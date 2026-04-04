const rateLimit = require('express-rate-limit');

/**
 * Limit overall API requests
 */
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 500, // Relaxed for testing
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes',
        code: 'RATE_LIMITED'
    },
    standardHeaders: true, 
    legacyHeaders: false
});

/**
 * Limit auth requests (login/register)
 */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 50, // Relaxed for testing
    message: {
        success: false,
        message: 'Too many login attempts, please try again after 15 minutes',
        code: 'AUTH_RATE_LIMITED'
    }
});

/**
 * Limit AI heavy operations
 */
const aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // Limit each IP to 20 requests per hour
    message: {
        success: false,
        message: 'Daily AI analysis limit reached, please try again later',
        code: 'AI_RATE_LIMITED'
    }
});

module.exports = {
    generalLimiter,
    authLimiter,
    aiLimiter
};
