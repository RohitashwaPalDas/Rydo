import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN; 

const LiveLocationMap = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const [lng, setLng] = useState(0);
  const [lat, setLat] = useState(0);

  const updateLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLng = position.coords.longitude;
          const newLat = position.coords.latitude;

          setLng(newLng);
          setLat(newLat);

          if (mapRef.current) {
            mapRef.current.flyTo({ center: [newLng, newLat], essential: true });
          }

          if (markerRef.current) {
            markerRef.current.setLngLat([newLng, newLat]);
          } else {
            markerRef.current = new mapboxgl.Marker({ color: 'red' })
              .setLngLat([newLng, newLat])
              .addTo(mapRef.current);
          }
        },
        (error) => console.error('Error getting location:', error),
        { enableHighAccuracy: true }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: 15,
    });

    updateLocation();

    const interval = setInterval(updateLocation, 10000);

    return () => {
      clearInterval(interval);
      mapRef.current.remove();
    };
  }, []);

  return (
    <div>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100vh' }} className='-z-20'/>
    </div>
  );
};

export default LiveLocationMap;
