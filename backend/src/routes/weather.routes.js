const express = require('express');
const { 
    getCurrent, getForecast, getAgricultural, getLocations, addLocation 
} = require('../controllers/weather.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * Weather Routes mapping to /api/weather
 */

router.use(verifyToken);

router.get('/current', getCurrent);
router.get('/forecast', getForecast);
router.get('/agricultural', getAgricultural);

router.get('/locations', getLocations);
router.post('/locations', addLocation);

module.exports = router;
