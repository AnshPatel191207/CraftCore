const axios = require('axios');
const config = require('../config');
const WeatherCache = require('../models/WeatherCache');
const aiService = require('./ai.service');

/**
 * Weather Service for fetching current and forecast data with MongoDB caching.
 * Optimized with timeout handling, centralized config, and performance logs.
 */

const getCurrentWeather = async (lat, lng) => {
    // 1. Check MongoDB cache first
    const cached = await WeatherCache.findOne({
        'location.lat': { $gte: lat - 0.01, $lte: lat + 0.01 },
        'location.lng': { $gte: lng - 0.01, $lte: lng + 0.01 },
        expiresAt: { $gt: new Date() }
    });

    if (cached && cached.current) return cached.current;

    const startTime = Date.now();
    try {
        console.log(`[WEATHER_SERVICE] Fetching current weather for [${lat}, ${lng}]...`);
        
        // 2. Fetch from OpenWeatherMap with timeout
        const response = await axios.get(`${config.weather.baseUrl}/weather`, {
            params: {
                lat,
                lon: lng,
                appid: config.weather.apiKey,
                units: 'metric'
            },
            timeout: 5000 // 5 second timeout for responsiveness
        });

        const duration = Date.now() - startTime;
        console.log(`[WEATHER_SERVICE] current weather fetched in ${duration}ms`);

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
        const duration = Date.now() - startTime;
        console.error(`[WEATHER_SERVICE] Weather API Error after ${duration}ms:`, error.message);
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

    const startTime = Date.now();
    try {
        console.log(`[WEATHER_SERVICE] Fetching forecast for [${lat}, ${lng}]...`);
        
        const response = await axios.get(`${config.weather.baseUrl}/forecast`, {
            params: {
                lat,
                lon: lng,
                appid: config.weather.apiKey,
                units: 'metric',
                cnt: days * 8 // 3-hourly data
            },
            timeout: 5000
        });

        const duration = Date.now() - startTime;
        console.log(`[WEATHER_SERVICE] forecast fetched in ${duration}ms`);

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
        const duration = Date.now() - startTime;
        console.error(`[WEATHER_SERVICE] Forecast API Error after ${duration}ms:`, error.message);
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
