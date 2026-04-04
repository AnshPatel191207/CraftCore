const ApiError = require('../utils/ApiError');

/**
 * Global centralized error handler for Express 
 */
const errorMiddleware = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let code = err.code || 'INTERNAL_ERROR';
    let errors = err.errors || [];

    // Mongoose CastError (e.g. invalid ObjectId)
    if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Resource not found: invalid ID format';
        code = 'INVALID_ID';
    }

    // Mongoose duplicate key error (11000)
    if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyValue)[0];
        message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
        code = 'DUPLICATE_KEY';
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
        code = 'VALIDATION_ERROR';
    }

    // JWT verification errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid authentication token';
        code = 'TOKEN_INVALID';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Authentication token has expired';
        code = 'TOKEN_EXPIRED';
    }

    // Multer file size error
    if (err.code === 'LIMIT_FILE_SIZE') {
        statusCode = 413;
        message = 'File size is too large (max 10MB)';
        code = 'FILE_TOO_LARGE';
    }

    // Final response shape
    res.status(statusCode).json({
        success: false,
        data: null,
        message,
        code,
        ...(errors.length > 0 && { errors }),
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = {
    errorMiddleware
};
