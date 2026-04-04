const { model } = require('../config/gemini');
const { 
    buildCropPrompt, 
    buildFertilizerPrompt, 
    buildSoilHealthPrompt 
} = require('../utils/promptBuilder');
const { parseAIResponse } = require('../utils/responseFormatter');
const NodeCache = require('node-cache');

// Local cache to save API costs
const aiCache = new NodeCache({ stdTTL: 86400 }); // Cache for 24 hours

/**
 * Fallback logic for crop recommendation if AI fails.
 */
const getFallbackCropRecommendations = (soilData, season) => {
    // Rule-based logic based on common NPK thresholds
    const recommendations = [];
    
    if (soilData.nitrogen < 280) {
        recommendations.push({
            cropName: "Legumes (Pigeon Pea)",
            suitabilityScore: 85,
            reason: "Nitrogen is low, and legumes can fix nitrogen back into the soil.",
            season: season,
            expectedYield: "Medium",
            marketDemand: "High"
        });
    } else {
        recommendations.push({
            cropName: "Wheat",
            suitabilityScore: 80,
            reason: "Good nitrogen levels support cereal crop growth.",
            season: season,
            expectedYield: "High",
            marketDemand: "High"
        });
    }
    
    return {
        recommendations,
        summary: "Rule-based fallback recommendation provided as AI was unavailable."
    };
};

const getCropRecommendations = async (soilData, season, state) => {
    const cacheKey = `crops_${JSON.stringify(soilData)}_${season}_${state}`;
    const cachedResult = aiCache.get(cacheKey);
    if (cachedResult) return cachedResult;

    try {
        const prompt = buildCropPrompt(soilData, season, state);
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const parsed = parseAIResponse(responseText);

        if (parsed) {
            aiCache.set(cacheKey, parsed);
            return parsed;
        }
        throw new Error("Invalid AI JSON response");
    } catch (error) {
        console.error("Gemini AI Crop Error:", error);
        return getFallbackCropRecommendations(soilData, season);
    }
};

const getFertilizerAdvisory = async (soilData, cropName) => {
    const cacheKey = `fertilizer_${JSON.stringify(soilData)}_${cropName}`;
    const cachedResult = aiCache.get(cacheKey);
    if (cachedResult) return cachedResult;

    try {
        const prompt = buildFertilizerPrompt(soilData, cropName);
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const parsed = parseAIResponse(responseText);

        if (parsed) {
            aiCache.set(cacheKey, parsed);
            return parsed;
        }
        throw new Error("Invalid AI JSON response");
    } catch (error) {
        console.error("Gemini AI Fertilizer Error:", error);
        // Minimal hardcoded fallback
        return {
            deficiencies: [{ nutrient: "Generic", severity: "medium" }],
            recommendations: [{ fertilizerName: "NPK 19-19-19", dosage: "50kg/acre", type: "chemical" }],
            summary: "AI unavailable. Recommending balanced NPK as a baseline."
        };
    }
};

const getSoilHealthAnalysis = async (soilData) => {
    try {
        const prompt = buildSoilHealthPrompt(soilData);
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const parsed = parseAIResponse(responseText);
        
        return parsed || { healthScore: 50, summary: "Analysis failed." };
    } catch (error) {
        console.error("Gemini AI Health Analysis Error:", error);
        return { healthScore: 50, plainEnglishSummary: "Could not perform detailed analysis." };
    }
};

module.exports = {
    getCropRecommendations,
    getFertilizerAdvisory,
    getSoilHealthAnalysis
};
