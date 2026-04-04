const OpenAI = require('openai');
const crypto = require('crypto');
const config = require('../config');
const { cacheClient } = require('../config/redis');
const { safeParseAI } = require('../utils/responseFormatter');
const promptBuilder = require('../utils/promptBuilder');
const soilService = require('./soil.service');

// Initialize with early validation from config
const openai = new OpenAI({ apiKey: config.ai.openaiKey });

/**
 * AI Service for OpenAI GPT-4o-mini integration.
 * Optimized with centralized config, logging, and async patterns.
 */

const isDemoMode = () => config.ai.demoMode;

const analyzeSoilReport = async (rawText) => {
    if (isDemoMode()) return soilService.getRuleBasedAnalysis(rawText);

    const cacheKey = `soil:analysis:${crypto.createHash('md5').update(rawText).digest('hex')}`;
    const cached = await cacheClient.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const startTime = Date.now();
    try {
        console.log(`[AI_SERVICE] Starting analyzeSoilReport...`);
        const completion = await openai.chat.completions.create({
            model: config.ai.openaiModel,
            messages: [{ role: 'user', content: promptBuilder.buildSoilAnalysisPrompt(rawText) }],
            temperature: 0.3,
            max_tokens: 1000
        });

        const duration = Date.now() - startTime;
        console.log(`[AI_SERVICE] analyzeSoilReport completed in ${duration}ms`);

        const result = safeParseAI(completion.choices[0].message.content);
        if (!result) return soilService.getRuleBasedAnalysis(rawText);

        await cacheClient.setex(cacheKey, 3600, JSON.stringify(result)); // 1 hour cache
        return result;
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`[AI_SERVICE] OpenAI Analysis Error after ${duration}ms:`, error.message);
        return soilService.getRuleBasedAnalysis(rawText);
    }
};

const getCropRecommendations = async (soilData, season, state) => {
    if (isDemoMode()) return soilService.getRuleBasedCropRecommendations(soilData);

    const cacheKey = `crops:rec:${crypto.createHash('md5').update(JSON.stringify({ soilData, season, state })).digest('hex')}`;
    const cached = await cacheClient.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const startTime = Date.now();
    try {
        console.log(`[AI_SERVICE] Starting getCropRecommendations...`);
        const completion = await openai.chat.completions.create({
            model: config.ai.openaiModel,
            messages: [{ role: 'user', content: promptBuilder.buildCropRecommendationPrompt(soilData, season, state) }],
            temperature: 0.4
        });

        const duration = Date.now() - startTime;
        console.log(`[AI_SERVICE] getCropRecommendations completed in ${duration}ms`);

        const result = safeParseAI(completion.choices[0].message.content);
        if (!result) return soilService.getRuleBasedCropRecommendations(soilData);

        await cacheClient.setex(cacheKey, 3600, JSON.stringify(result));
        return result;
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`[AI_SERVICE] OpenAI Crop Rec Error after ${duration}ms:`, error.message);
        return soilService.getRuleBasedCropRecommendations(soilData);
    }
};

const getFertilizerAdvisory = async (soilData, cropName) => {
    if (isDemoMode()) return soilService.getRuleBasedFertilizer(soilData, cropName);

    const cacheKey = `fert:advisory:${crypto.createHash('md5').update(JSON.stringify({ soilData, cropName })).digest('hex')}`;
    const cached = await cacheClient.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const startTime = Date.now();
    try {
        console.log(`[AI_SERVICE] Starting getFertilizerAdvisory...`);
        const completion = await openai.chat.completions.create({
            model: config.ai.openaiModel,
            messages: [{ role: 'user', content: promptBuilder.buildFertilizerAdvisoryPrompt(soilData, cropName) }],
            temperature: 0.3
        });

        const duration = Date.now() - startTime;
        console.log(`[AI_SERVICE] getFertilizerAdvisory completed in ${duration}ms`);

        const result = safeParseAI(completion.choices[0].message.content);
        if (!result) return soilService.getRuleBasedFertilizer(soilData, cropName);

        await cacheClient.setex(cacheKey, 3600, JSON.stringify(result));
        return result;
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`[AI_SERVICE] OpenAI Fertilizer Advisory Error after ${duration}ms:`, error.message);
        return soilService.getRuleBasedFertilizer(soilData, cropName);
    }
};

const getChatResponse = async (messages, domain, userContext) => {
    if (isDemoMode()) return { content: `Currently running in DEMO_MODE. You are asking about ${domain}. AgriSense AI is ready for your specific query!`, sources: [] };

    const startTime = Date.now();
    try {
        console.log(`[AI_SERVICE] Starting getChatResponse...`);
        const mappedMessages = messages.map(msg => ({
            role: msg.role === 'ai' ? 'assistant' : 'user',
            content: msg.content
        }));

        const completion = await openai.chat.completions.create({
            model: config.ai.openaiModel,
            messages: [
                { role: 'system', content: promptBuilder.buildChatSystemPrompt(domain, userContext) },
                ...mappedMessages
            ],
            temperature: 0.7,
            max_tokens: 500
        });

        const duration = Date.now() - startTime;
        console.log(`[AI_SERVICE] getChatResponse completed in ${duration}ms`);

        return {
            content: completion.choices[0].message.content,
            sources: []
        };
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`[AI_SERVICE] OpenAI Chat Error after ${duration}ms:`, error.message);
        return { content: 'AI services are temporarily unavailable. Please try again later.', sources: [] };
    }
};

const getWeatherAdvisory = async (weatherData) => {
    if (isDemoMode()) return "Weather conditions are favorable for farming. Maintain regular irrigation.";

    const startTime = Date.now();
    try {
        console.log(`[AI_SERVICE] Starting getWeatherAdvisory...`);
        const completion = await openai.chat.completions.create({
            model: config.ai.openaiModel,
            messages: [{ role: 'user', content: promptBuilder.buildWeatherAdvisoryPrompt(weatherData) }],
            temperature: 0.5,
            max_tokens: 100
        });

        const duration = Date.now() - startTime;
        console.log(`[AI_SERVICE] getWeatherAdvisory completed in ${duration}ms`);

        return completion.choices[0].message.content.trim();
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`[AI_SERVICE] OpenAI Weather Advisory Error after ${duration}ms:`, error.message);
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
