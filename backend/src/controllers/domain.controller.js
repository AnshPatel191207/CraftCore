const { formatSuccess } = require('../utils/responseFormatter');
const { logActivity } = require('../utils/activityLogger');
const ApiError = require('../utils/ApiError');

/**
 * Domain Controller for managing multi-industry application contexts.
 */

const domains = [
    { id: 'AgriTech', name: 'Agriculture', icon: 'tractor', color: '#4caf50' },
    { id: 'FinTech', name: 'Finance', icon: 'coins', color: '#2196f3' },
    { id: 'Health', name: 'Healthcare', icon: 'heartbeat', color: '#f44336' },
    { id: 'EdTech', name: 'Education', icon: 'graduation-cap', color: '#ff9800' },
    { id: 'Civic', name: 'Civic Engagement', icon: 'users', color: '#9c27b0' }
];

const getDomains = async (req, res, next) => {
    try {
        formatSuccess(res, domains, 'Available domains fetched');
    } catch (error) {
        next(error);
    }
};

const getCurrent = async (req, res, next) => {
    try {
        formatSuccess(res, { domain: req.user.currentDomain }, 'Current domain fetched');
    } catch (error) {
        next(error);
    }
};

const updateCurrent = async (req, res, next) => {
    try {
        const { domain } = req.body;
        
        if (!domains.find(d => d.id === domain)) {
            throw ApiError.badRequest('Invalid domain selected', 'INVALID_DOMAIN');
        }

        const oldDomain = req.user.currentDomain;
        req.user.currentDomain = domain;
        await req.user.save();

        logActivity(req.user._id, 'domain:switched', { from: oldDomain, to: domain }, req);
        formatSuccess(res, { domain: req.user.currentDomain }, 'Domain context switched');
        
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDomains,
    getCurrent,
    updateCurrent
};
