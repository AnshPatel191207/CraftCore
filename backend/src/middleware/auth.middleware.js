const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

/**
 * Verify JWT from Authorization header
 * Optimized with centralized config access.
 */
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        
        if (!authHeader) {
            throw ApiError.unauthorized('Not authorized, no token', 'NO_TOKEN');
        }

        let token = '';
        const authString = authHeader.toString();
        if (authString.toLowerCase().startsWith('bearer ')) {
            token = authString.split(' ')[1];
        } else if (authString.startsWith('eyJ')) {
            token = authString;
        } else {
            throw ApiError.unauthorized('Invalid authorization format', 'INVALID_FORMAT');
        }

        // Cache-friendly verification (using config)
        const decoded = jwt.verify(token, config.jwt.secret);

        // Fetch user once per request
        const user = await User.findById(decoded._id).select('-password -refreshTokens').lean();
        if (!user) {
            throw ApiError.unauthorized('User not found', 'USER_NOT_FOUND');
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            next(ApiError.unauthorized('Token expired', 'TOKEN_EXPIRED'));
        } else if (error.name === 'JsonWebTokenError') {
            next(ApiError.unauthorized('Invalid token', 'TOKEN_INVALID'));
        } else {
            next(error);
        }
    }
};

/**
 * Verify JWT for Socket.io handshake
 */
const verifySocketToken = async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token;
        if (!token) return next(new Error('Authentication error: No token'));

        const decoded = jwt.verify(token, config.jwt.secret);
        const user = await User.findById(decoded._id).select('-password').lean();
        
        if (!user) return next(new Error('Authentication error: User not found'));

        socket.user = user;
        next();
    } catch (error) {
        next(new Error('Authentication error: Invalid token'));
    }
};

/**
 * Restrict access to admin role
 */
const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        next(ApiError.forbidden('Admin priority access required'));
    }
};

module.exports = {
    verifyToken,
    verifySocketToken,
    requireAdmin
};
