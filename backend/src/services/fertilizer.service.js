const FertilizerAdvisory = require('../models/FertilizerAdvisory');
const { getFertilizerAdvisory } = require('./gemini.service');

const generateFertilizerAdvisory = async (soilReport, userId, cropName) => {
    try {
        const { parsedData } = soilReport;
        
        // AI Logic
        const aiResult = await getFertilizerAdvisory(parsedData, cropName);

        // Save to DB
        const advisory = await FertilizerAdvisory.create({
            soilReportId: soilReport._id,
            userId,
            deficiencies: aiResult.deficiencies,
            recommendations: aiResult.recommendations,
            sustainabilityTips: aiResult.sustainabilityTips,
            aiSummary: aiResult.summary
        });

        return advisory;
    } catch (error) {
        console.error("Fertilizer Service Error:", error);
        throw error;
    }
};

module.exports = {
    generateFertilizerAdvisory
};
