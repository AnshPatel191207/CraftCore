const OpenAI = require('openai');
const crypto = require('crypto');
const { cacheClient } = require('../config/redis');
const { safeParseAI } = require('../utils/responseFormatter');
const promptBuilder = require('../utils/promptBuilder');
const soilService = require('./soil.service');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * AI Service for OpenAI GPT-4o-mini integration, 
 * including DEMO_MODE logic, caching, and rule-based fallbacks.
 */

const isDemoMode = () => process.env.DEMO_MODE === 'true';

const analyzeSoilReport = async (rawText) => {
    if (isDemoMode()) return soilService.getRuleBasedAnalysis(rawText);

    const cacheKey = `soil:analysis:${crypto.createHash('md5').update(rawText).digest('hex')}`;
    const cached = await cacheClient.get(cacheKey);
    if (cached) return JSON.parse(cached);

    try {
        const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
            messages: [{ role: 'user', content: promptBuilder.buildSoilAnalysisPrompt(rawText) }],
            temperature: 0.3,
            max_tokens: 1000
        });

        const result = safeParseAI(completion.choices[0].message.content);
        if (!result) return soilService.getRuleBasedAnalysis(rawText);

        await cacheClient.setex(cacheKey, 3600, JSON.stringify(result)); // 1 hour cache
        return result;
    } catch (error) {
        console.error('OpenAI Analysis Error:', error.message);
        return soilService.getRuleBasedAnalysis(rawText);
    }
};

const getCropRecommendations = async (soilData, season, state) => {
    if (isDemoMode()) return soilService.getRuleBasedCropRecommendations(soilData);

    const cacheKey = `crops:rec:${crypto.createHash('md5').update(JSON.stringify({ soilData, season, state })).digest('hex')}`;
    const cached = await cacheClient.get(cacheKey);
    if (cached) return JSON.parse(cached);

    try {
        const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
            messages: [{ role: 'user', content: promptBuilder.buildCropRecommendationPrompt(soilData, season, state) }],
            temperature: 0.4
        });

        const result = safeParseAI(completion.choices[0].message.content);
        if (!result) return soilService.getRuleBasedCropRecommendations(soilData);

        await cacheClient.setex(cacheKey, 3600, JSON.stringify(result));
        return result;
    } catch (error) {
        console.error('OpenAI Crop Rec Error:', error.message);
        return soilService.getRuleBasedCropRecommendations(soilData);
    }
};

const getFertilizerAdvisory = async (soilData, cropName) => {
    if (isDemoMode()) return soilService.getRuleBasedFertilizer(soilData, cropName);

    const cacheKey = `fert:advisory:${crypto.createHash('md5').update(JSON.stringify({ soilData, cropName })).digest('hex')}`;
    const cached = await cacheClient.get(cacheKey);
    if (cached) return JSON.parse(cached);

    try {
        const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
            messages: [{ role: 'user', content: promptBuilder.buildFertilizerAdvisoryPrompt(soilData, cropName) }],
            temperature: 0.3
        });

        const result = safeParseAI(completion.choices[0].message.content);
        if (!result) return soilService.getRuleBasedFertilizer(soilData, cropName);

        await cacheClient.setex(cacheKey, 3600, JSON.stringify(result));
        return result;
    } catch (error) {
        console.error('OpenAI Fertilizer Advisory Error:', error.message);
        return soilService.getRuleBasedFertilizer(soilData, cropName);
    }
};

const getChatResponse = async (messages, domain, userContext) => {
    if (isDemoMode()) return { content: `Currently running in DEMO_MODE. You are asking about ${domain}. AgriSense AI is ready for your specific query!`, sources: [] };

    try {
        const mappedMessages = messages.map(msg => ({
            role: msg.role === 'ai' ? 'assistant' : 'user',
            content: msg.content
        }));

        const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
            messages: [
                { role: 'system', content: promptBuilder.buildChatSystemPrompt(domain, userContext) },
                ...mappedMessages
            ],
            temperature: 0.7,
            max_tokens: 500
        });

        return {
            content: completion.choices[0].message.content,
            sources: []
        };
    } catch (error) {
        console.error('OpenAI Chat Error:', error.message);
        return { content: 'AI services are temporarily unavailable. Please try again later.', sources: [] };
    }
};

const getWeatherAdvisory = async (weatherData) => {
    if (isDemoMode()) return "Weather conditions are favorable for farming. Maintain regular irrigation.";

    try {
        const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
            messages: [{ role: 'user', content: promptBuilder.buildWeatherAdvisoryPrompt(weatherData) }],
            temperature: 0.5,
            max_tokens: 100
        });

        return completion.choices[0].message.content.trim();
    } catch (error) {
        console.error('OpenAI Weather Advisory Error:', error.message);
        return "Standard farming practices recommended for these weather conditions.";
    }
};

module.exports = {
    analyzeSoilReport,
    getCropRecommendations,
    getFertilizerAdvisory,
    getChatResponse,
    getWeatherAdvisory
};
