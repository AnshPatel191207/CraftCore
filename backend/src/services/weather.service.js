const axios = require('axios');
const WeatherCache = require('../models/WeatherCache');
const aiService = require('./ai.service');

/**
 * Weather Service for fetching current and forecast data with MongoDB caching.
 */

const getCurrentWeather = async (lat, lng) => {
    // 1. Check MongoDB cache first
    const cached = await WeatherCache.findOne({
        'location.lat': { $gte: lat - 0.01, $lte: lat + 0.01 },
        'location.lng': { $gte: lng - 0.01, $lte: lng + 0.01 },
        expiresAt: { $gt: new Date() }
    });

    if (cached && cached.current) return cached.current;

    try {
        // 2. Fetch from OpenWeatherMap
        const response = await axios.get(`${process.env.WEATHER_BASE_URL}/weather`, {
            params: {
                lat,
                lon: lng,
                appid: process.env.WEATHER_API_KEY,
                units: 'metric'
            }
        });

        const data = {
            temp: response.data.main.temp,
            feelsLike: response.data.main.feels_like,
            humidity: response.data.main.humidity,
            windSpeed: response.data.wind.speed,
            description: response.data.weather[0].description,
            icon: response.data.weather[0].icon
        };

        // 3. Update cache (3 hours)
        await WeatherCache.findOneAndUpdate(
            { 'location.lat': lat, 'location.lng': lng },
            { 
                current: data, 
                cachedAt: new Date(), 
                expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000) 
            },
            { upsert: true }
        );

        return data;
    } catch (error) {
        console.error('Weather API Error:', error.message);
        return null;
    }
};

const getForecast = async (lat, lng, days = 7) => {
    const cached = await WeatherCache.findOne({
        'location.lat': lat,
        'location.lng': lng,
        expiresAt: { $gt: new Date() }
    });

    if (cached && cached.forecast) return cached.forecast;

    try {
        const response = await axios.get(`${process.env.WEATHER_BASE_URL}/forecast`, {
            params: {
                lat,
                lon: lng,
                appid: process.env.WEATHER_API_KEY,
                units: 'metric',
                cnt: days * 8 // 3-hourly data
            }
        });

        const forecast = response.data.list.filter((_, index) => index % 8 === 0).map(item => ({
            date: item.dt_txt,
            temp: item.main.temp,
            humidity: item.main.humidity,
            description: item.weather[0].description,
            icon: item.weather[0].icon
        }));

        await WeatherCache.findOneAndUpdate(
            { 'location.lat': lat, 'location.lng': lng },
            { forecast, expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000) },
            { upsert: true }
        );

        return forecast;
    } catch (error) {
        console.error('Forecast API Error:', error.message);
        return [];
    }
};

const getAgriculturalAdvisory = async (weatherData) => {
    if (!weatherData) return "Weather data unavailable for advisory.";
    
    // Calls AI service to generate a farming-specific advisory from weather
    return await aiService.getWeatherAdvisory(weatherData);
};

module.exports = {
    getCurrentWeather,
    getForecast,
    getAgriculturalAdvisory
};
