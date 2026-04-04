const CropRecommendation = require('../models/CropRecommendation');
const { getCropRecommendations } = require('./gemini.service');

/**
 * Generates and saves crop recommendations.
 */
const generateCropRecommendation = async (soilReport, userId) => {
    try {
        const { parsedData, location } = soilReport;
        
        // AI Logic
        const aiResult = await getCropRecommendations(
            parsedData, 
            location.season, 
            location.state
        );

        // Save to DB
        const recommendation = await CropRecommendation.create({
            soilReportId: soilReport._id,
            userId,
            recommendations: aiResult.recommendations,
            aiSummary: aiResult.summary
        });

        return recommendation;
    } catch (error) {
        console.error("Crop Service Error:", error);
        throw error;
    }
};

module.exports = {
    generateCropRecommendation
};
