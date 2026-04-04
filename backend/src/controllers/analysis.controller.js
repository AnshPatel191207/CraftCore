const SoilReport = require('../models/SoilReport');
const CropRecommendation = require('../models/CropRecommendation');
const FertilizerAdvisory = require('../models/FertilizerAdvisory');
const { getSoilHealthAnalysis } = require('../services/gemini.service');
const { formatStandardResponse } = require('../utils/responseFormatter');

/**
 * @desc    Get detailed soil health analysis
 * @route   POST /api/analysis/analyze
 */
const analyzeSoilHealth = async (req, res, next) => {
    try {
        const { soilReportId } = req.body;

        if (!soilReportId) {
            return res.status(400).json(formatStandardResponse(false, null, "Soil report ID is required."));
        }

        const soilReport = await SoilReport.findById(soilReportId);
        if (!soilReport || soilReport.userId.toString() !== req.user._id.toString()) {
            return res.status(404).json(formatStandardResponse(false, null, "Soil report not found."));
        }

        const analysis = await getSoilHealthAnalysis(soilReport.parsedData);
        res.json(formatStandardResponse(true, analysis));
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get dashboard aggregated stats
 * @route   GET /api/analysis/dashboard
 */
const getDashboardStats = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const [totalReports, totalRecommendations, latestReport] = await Promise.all([
            SoilReport.countDocuments({ userId }),
            CropRecommendation.countDocuments({ userId }),
            SoilReport.findOne({ userId }).sort({ createdAt: -1 })
        ]);

        // Aggregate nutrient trends (simplified)
        const reports = await SoilReport.find({ userId }).sort({ createdAt: 1 }).limit(10);
        const trends = reports.map(r => ({
            date: r.createdAt,
            n: r.parsedData.nitrogen,
            p: r.parsedData.phosphorus,
            k: r.parsedData.potassium
        }));

        res.json(formatStandardResponse(true, {
            totalReports,
            totalRecommendations,
            latestReport,
            nutrientTrends: trends
        }));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    analyzeSoilHealth,
    getDashboardStats
};
