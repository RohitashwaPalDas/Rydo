import axios from 'axios';
import { validationResult } from 'express-validator';
import dotenv from "dotenv";
dotenv.config();



const MAPBOX_TOKEN = process.env.MAPBOX_API_KEY;


const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs} hr ${mins} min ${secs} sec`;
};


const formatDistance = (meters) => {
    const km = Math.floor(meters / 1000);
    const m = Math.round(meters % 1000);
    return `${km} km ${m} m`;
};


const getCoordinates = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const address = req.query.address;
    if (!address) {
        return res.status(400).json({ success: false, message: "Address is required" });
    }

    const encodedAddress = encodeURIComponent(address);
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${MAPBOX_TOKEN}`;

    try {
        const response = await axios.get(url);
        if (response.data.features.length === 0) {
            return res.status(400).json({ success: false, message: "No coordinates found for address" });
        }
        const coordinates = response.data.features[0].geometry.coordinates;
        return res.status(200).json({ success: true, coordinates });
    } catch (error) {
        console.error(`Error getting coordinates for "${address}":`, error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};


const getDistanceAndTime = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { origin, destination } = req.query;

    if (!origin || !destination) {
        return res.status(400).json({ success: false, message: "Origin and destination are required" });
    }

    try {

        const originRes = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(origin)}.json?access_token=${MAPBOX_TOKEN}`);
        const originCoords = originRes.data.features[0]?.geometry.coordinates;


        const destRes = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(destination)}.json?access_token=${MAPBOX_TOKEN}`);
        const destCoords = destRes.data.features[0]?.geometry.coordinates;

        if (!originCoords || !destCoords) {
            return res.status(400).json({ success: false, message: "Unable to get coordinates" });
        }

        const coords = `${originCoords.join(',')};${destCoords.join(',')}`;
        const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?access_token=${MAPBOX_TOKEN}&geometries=geojson`;

        const routeResponse = await axios.get(directionsUrl);
        const route = routeResponse.data.routes[0];

        if (!route) {
            return res.status(400).json({ success: false, message: "No route found" });
        }

        const formattedDistance = formatDistance(route.distance);
        const formattedDuration = formatDuration(route.duration);

        return res.status(200).json({
            success: true,
            message: {
                originCoords,
                destinationCoords: destCoords,
                time: route.duration,
                distance: route.distance,
            },
        });
    } catch (error) {
        console.error('Error getting distance and time:', error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};


const getAddressSuggestions = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ success: false, message: "Query parameter is required" });
    }

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`;

    try {
        const response = await axios.get(url, {
            params: {
                access_token: MAPBOX_TOKEN,
                autocomplete: true,
                country: 'in',
                limit: 5,
            },
        });

        const suggestions = response.data.features.map(feature => feature.place_name);
        return res.status(200).json({ success: true, suggestions });
    } catch (error) {
        console.error('Error getting address suggestions:', error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export { getCoordinates, getDistanceAndTime, getAddressSuggestions };
