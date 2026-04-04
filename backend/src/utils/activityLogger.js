const Activity = require('../models/Activity');

/**
 * Log user activity in a non-blocking way 
 */
const logActivity = (userId, action, details = {}, req = null) => {
    // Fire and forget — do NOT await this to avoid slowing down responses
    Activity.create({
        userId,
        action,
        details,
        ipAddress: req?.ip || req?.headers?.['x-forwarded-for'],
        userAgent: req?.headers?.['user-agent']
    }).catch(err => {
        console.error(`Activity log error [${action}]:`, err.message);
    });

    // Also emit socket: activity:new in a non-blocking way
    try {
        const { getIO } = require('../config/socket');
        const io = getIO();
        io.to(`farm:${userId}`).emit('activity:new', {
            action,
            details,
            timestamp: new Date()
        });
    } catch (_) {
        // Socket.io might not be initialized or optional for this log
    }
};

module.exports = {
    logActivity
};
