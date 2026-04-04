const mongoose = require('mongoose');

const fertilizerAdvisorySchema = new mongoose.Schema({
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
    deficiencies: [{
        nutrient: String,
        currentLevel: Number,
        optimalRange: String,
        severity: {
            type: String,
            enum: ['low', 'medium', 'high']
        }
    }],
    recommendations: [{
        fertilizerName: String,
        type: {
            type: String,
            enum: ['organic', 'chemical', 'bio']
        },
        dosage: String, // e.g., "50 kg/acre"
        applicationMethod: String,
        timing: String, // "Before sowing" / "30 days after"
        estimatedCost: String
    }],
    sustainabilityTips: [String],
    aiSummary: String,
    generatedAt: {
        type: Date,
        default: Date.now
    }
});

const FertilizerAdvisory = mongoose.model('FertilizerAdvisory', fertilizerAdvisorySchema);

module.exports = FertilizerAdvisory;
