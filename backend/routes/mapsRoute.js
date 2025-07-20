import express from 'express';
import { authUser } from '../middlewares/auth.js';
import { getAddressSuggestions, getCoordinates, getDistanceAndTime } from '../controllers/mapCOntroller.js';
const mapRouter = express.Router();

import { query } from 'express-validator';

mapRouter.get('/get-coordinates',
    query('address').isString().isLength({ min: 3 }),
    authUser, getCoordinates
);

mapRouter.get('/get-distance-time',
    query('origin').isString().isLength({ min: 3 }),
    query('destination').isString().isLength({ min: 3 }),
    authUser, getDistanceAndTime
)

mapRouter.get('/get-suggestions',
    query('query').isString().isLength({ min: 3 }),
    authUser, getAddressSuggestions
)

export default mapRouter;

