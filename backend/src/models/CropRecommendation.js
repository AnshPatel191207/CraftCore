const mongoose = require('mongoose');

const cropRecommendationSchema = new mongoose.Schema({
    soilReportId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SoilReport',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recommendations: [{
        cropName: String,
        suitabilityScore: Number, // 0-100
        reason: String,
        season: String,
        expectedYield: String,
        marketDemand: String
    }],
    aiSummary: String,
    generatedAt: {
        type: Date,
        default: Date.now
    }
});

const CropRecommendation = mongoose.model('CropRecommendation', cropRecommendationSchema);

module.exports = CropRecommendation;
