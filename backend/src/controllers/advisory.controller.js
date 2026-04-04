const Advisory = require('../models/Advisory');
const ApiError = require('../utils/ApiError');
const { formatSuccess, formatPaginated } = require('../utils/responseFormatter');
const { logActivity } = require('../utils/activityLogger');

/**
 * Advisory Controller for managing farming alerts and expert recommendations.
 */

const getAdvisories = async (req, res, next) => {
    try {
        const { category, severity, isRead, page = 1, limit = 20 } = req.query;
        
        // Build query to include both user-specific and global (state-based) advisories
        const query = {
            $or: [
                { userId: req.user._id },
                { isGlobal: true, 'targetLocation.state': req.user.location?.state }
            ]
        };

        if (category) query.category = category;
        if (severity) query.severity = severity;
        if (isRead !== undefined) query.isRead = isRead === 'true';

        const advisories = await Advisory.find(query)
            .sort({ date: -1, createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Advisory.countDocuments(query);
        formatPaginated(res, advisories, total, page, limit);

    } catch (error) {
        next(error);
    }
};

const getAdvisoryById = async (req, res, next) => {
    try {
        const advisory = await Advisory.findById(req.params.id);
        if (!advisory) throw ApiError.notFound('Advisory not found');
        
        // Ownership check
        if (!advisory.isGlobal && advisory.userId.toString() !== req.user._id.toString()) {
            throw ApiError.forbidden('Unauthorized advisory access');
        }

        formatSuccess(res, advisory, 'Advisory details fetched');
    } catch (error) {
        next(error);
    }
};

const markAsRead = async (req, res, next) => {
    try {
        const advisory = await Advisory.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { isRead: true, readAt: new Date() },
            { new: true }
        );

        if (!advisory) throw ApiError.notFound('Advisory not found');

        logActivity(req.user._id, 'advisory:read', { advisoryId: req.params.id }, req);
        formatSuccess(res, advisory, 'Advisory marked as read');
    } catch (error) {
        next(error);
    }
};

const updateAdvisory = async (req, res, next) => {
    try {
        const advisory = await Advisory.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            req.body,
            { new: true }
        );
        if (!advisory) throw ApiError.notFound('Advisory not found');
        formatSuccess(res, advisory, 'Advisory updated');
    } catch (error) {
        next(error);
    }
};

const subscribeToAlerts = async (req, res, next) => {
    try {
        const { categories } = req.body;
        req.user.notificationPrefs.categories = categories;
        await req.user.save();
        
        logActivity(req.user._id, 'advisory:subscribed', { categories }, req);
        formatSuccess(res, req.user.notificationPrefs, 'Alert preferences updated');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAdvisories,
    getAdvisoryById,
    markAsRead,
    updateAdvisory,
    subscribeToAlerts
};
