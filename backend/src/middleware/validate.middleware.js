const { check, validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Validation result handler
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorArray = errors.array().map(err => ({ field: err.path, message: err.msg }));
        return next(new ApiError(400, 'Validation failed', 'VALIDATION_ERROR', errorArray));
    }
    next();
};

/**
 * Reusable validator chains
 */
const registerValidator = [
    check('name', 'Name is required').notEmpty().trim(),
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
];

const loginValidator = [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
];

const cropValidator = [
    check('name', 'Crop name is required').notEmpty().trim(),
    check('area', 'Valid area is required (min 0.1)').isFloat({ min: 0.1 }),
    check('stage', 'Growth stage is required').notEmpty(),
    check('plantedDate', 'Planted date is required').isISO8601().toDate(),
    check('expectedHarvest', 'Expected harvest date is required').isISO8601().toDate()
];

const chatValidator = [
    check('content', 'Message content is required (max 2000 chars)').notEmpty().isLength({ max: 2000 }),
    check('domain', 'Valid domain is required').isIn(['AgriTech', 'FinTech', 'Health', 'EdTech', 'Civic'])
];

module.exports = {
    validate,
    registerValidator,
    loginValidator,
    cropValidator,
    chatValidator
};
