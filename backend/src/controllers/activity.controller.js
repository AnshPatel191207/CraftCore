const Activity = require('../models/Activity');
const ApiError = require('../utils/ApiError');
const { formatSuccess, formatPaginated } = require('../utils/responseFormatter');

/**
 * Activity Controller for fetching user audit trails and system logs.
 */

const getActivities = async (req, res, next) => {
    try {
        const { limit = 50, offset = 0 } = req.query;
        const query = { userId: req.user._id };

        const activities = await Activity.find(query)
            .sort({ createdAt: -1 })
            .skip(parseInt(offset))
            .limit(parseInt(limit));

        const total = await Activity.countDocuments(query);
        formatPaginated(res, activities, total, Math.floor(offset/limit) + 1, limit);

    } catch (error) {
        next(error);
    }
};

const createActivity = async (req, res, next) => {
    try {
        const { action, details } = req.body;
        const activity = await Activity.create({
            userId: req.user._id,
            action,
            details,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });
        formatSuccess(res, activity, 'Activity logged', 201);
    } catch (error) {
        next(error);
    }
};

const getAuditTrail = async (req, res, next) => {
    try {
        // Admin-only route to see all system activities
        if (req.user.role !== 'admin') {
            throw ApiError.forbidden('Admin access required for audit trails');
        }

        const { limit = 100, page = 1 } = req.query;
        const activities = await Activity.find()
            .populate('userId', 'name email role')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Activity.countDocuments();
        formatPaginated(res, activities, total, page, limit);

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getActivities,
    createActivity,
    getAuditTrail
};
