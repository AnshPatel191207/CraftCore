const weatherService = require('../services/weather.service');
const ApiError = require('../utils/ApiError');
const { formatSuccess } = require('../utils/responseFormatter');

/**
 * Weather Controller for fetching current conditions, forecasts, and agricultural advisories.
 */

const getCurrent = async (req, res, next) => {
    try {
        const lat = parseFloat(req.query.lat) || req.user.location?.lat || 22.3072;
        const lng = parseFloat(req.query.lng) || req.user.location?.lng || 73.1812;

        const weather = await weatherService.getCurrentWeather(lat, lng);
        if (!weather) throw ApiError.internal('Could not fetch weather data');

        formatSuccess(res, weather, 'Current weather fetched');

    } catch (error) {
        next(error);
    }
};

const getForecast = async (req, res, next) => {
    try {
        const lat = parseFloat(req.query.lat) || req.user.location?.lat || 22.3072;
        const lng = parseFloat(req.query.lng) || req.user.location?.lng || 73.1812;
        const days = parseInt(req.query.days) || 7;

        const forecast = await weatherService.getForecast(lat, lng, days);
        formatSuccess(res, forecast, 'Weather forecast fetched');

    } catch (error) {
        next(error);
    }
};

const getAgricultural = async (req, res, next) => {
    try {
        const lat = parseFloat(req.query.lat) || req.user.location?.lat || 22.3072;
        const lng = parseFloat(req.query.lng) || req.user.location?.lng || 73.1812;

        const weather = await weatherService.getCurrentWeather(lat, lng);
        const advisory = await weatherService.getAgriculturalAdvisory(weather);

        formatSuccess(res, { weather, advisory }, 'Agricultural weather advisory fetched');

    } catch (error) {
        next(error);
    }
};

const getLocations = async (req, res, next) => {
    try {
        // Return user's saved locations or nearby weather stations
        const locations = [
            { name: 'Primary Farm', lat: req.user.location?.lat, lng: req.user.location?.lng, isPrimary: true },
            { name: 'Field B', lat: parseFloat(req.user.location?.lat) + 0.05, lng: parseFloat(req.user.location?.lng) + 0.05, isPrimary: false }
        ];
        formatSuccess(res, locations, 'Saved farm locations fetched');
    } catch (error) {
        next(error);
    }
};

const addLocation = async (req, res, next) => {
    try {
        const { name, lat, lng } = req.body;
        // Logic to store additional farm locations for the user
        formatSuccess(res, { name, lat, lng }, 'New farm location added', 201);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCurrent,
    getForecast,
    getAgricultural,
    getLocations,
    addLocation
};
