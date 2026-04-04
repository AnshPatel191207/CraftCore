const SoilReport = require('../models/SoilReport');
const Crop = require('../models/Crop');
const Advisory = require('../models/Advisory');
const Activity = require('../models/Activity');
const { formatSuccess } = require('../utils/responseFormatter');

/**
 * Dashboard Controller for aggregated KPIs and data visualization.
 */

const getStats = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const [cropAgg, unreadAdvisories, latestSoil] = await Promise.all([
            // 1. Crop Health & Area Metrics
            Crop.aggregate([
                { $match: { userId, isActive: true } },
                { 
                    $group: { 
                        _id: null, 
                        avgHealth: { $avg: '$health' }, 
                        totalArea: { $sum: '$area' },
                        count: { $sum: 1 }
                    } 
                }
            ]),
            // 2. Alert Count
            Advisory.countDocuments({ userId, isRead: false }),
            // 3. Latest Soil Health Score
            SoilReport.findOne({ userId, status: 'complete' }).sort({ createdAt: -1 })
        ]);

        const stats = {
            cropHealth: cropAgg[0]?.avgHealth || 100,
            activeArea: cropAgg[0]?.totalArea || 0,
            activeCrops: cropAgg[0]?.count || 0,
            unreadAlerts: unreadAdvisories,
            soilScore: latestSoil?.results?.healthScore || 0
        };

        formatSuccess(res, stats, 'Dashboard statistics fetched');

    } catch (error) {
        next(error);
    }
};

const getNutrients = async (req, res, next) => {
    try {
        // Find latest soil report to extract nutrients for radar/bar charts
        const latestSoil = await SoilReport.findOne({ 
            userId: req.user._id, 
            status: 'complete' 
        }).sort({ createdAt: -1 });

        if (!latestSoil) {
            return formatSuccess(res, { nutrients: null }, 'No soil analysis found');
        }

        const data = {
            ph: latestSoil.results.ph,
            nitrogen: latestSoil.results.nitrogen,
            phosphorus: latestSoil.results.phosphorus,
            potassium: latestSoil.results.potassium,
            organicMatter: latestSoil.results.organicMatter,
            moisture: latestSoil.results.moisture,
            micronutrients: latestSoil.results.micronutrients
        };

        formatSuccess(res, data, 'Nutrient profile fetched');

    } catch (error) {
        next(error);
    }
};

const getActivityFeed = async (req, res, next) => {
    try {
        const activities = await Activity.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(20);

        formatSuccess(res, activities, 'Activity feed fetched');
    } catch (error) {
        next(error);
    }
};

const getYieldProjection = async (req, res, next) => {
    try {
        // Simple projection logic for UI visualization
        const months = parseInt(req.query.months) || 6;
        const projections = Array.from({ length: months }, (_, i) => ({
            month: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000).toLocaleString('en-US', { month: 'short' }),
            projectedYield: (Math.random() * 50 + 50).toFixed(2),
            confidence: (Math.random() * 20 + 80).toFixed(1)
        }));

        formatSuccess(res, projections, 'Yield projections generated');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getStats,
    getNutrients,
    getActivityFeed,
    getYieldProjection
};
