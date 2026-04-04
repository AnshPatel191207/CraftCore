const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

/**
 * Verify JWT from Authorization header
 */
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        
        if (!authHeader) {
            throw ApiError.unauthorized('Not authorized, no token', 'NO_TOKEN');
        }

        let token = '';
        if (authHeader.toLowerCase().startsWith('bearer ')) {
            token = authHeader.split(' ')[1];
        } else if (authHeader.startsWith('eyJ')) {
            // Case where user pastes token directly without Bearer prefix
            token = authHeader;
        } else {
            throw ApiError.unauthorized('Invalid authorization format. Use "Bearer <token>"', 'INVALID_FORMAT');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded._id);
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
        const token = socket.handshake.auth.token;
        if (!token) return next(new Error('Authentication error: No token'));

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);
        
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
