const express = require('express');
const passport = require('passport');
const { 
    register, login, logout, getMe, refresh, updateProfile, googleCallback 
} = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { authLimiter } = require('../middleware/rateLimiter.middleware');
const { 
    validate, registerValidator, loginValidator 
} = require('../middleware/validate.middleware');

const router = express.Router();

/**
 * Auth Routes mapping to /api/auth
 */

router.post('/register', authLimiter, registerValidator, validate, register);
router.post('/login', authLimiter, loginValidator, validate, login);
router.post('/logout', verifyToken, logout);
router.get('/me', verifyToken, getMe);
router.post('/refresh', refresh);
router.put('/profile', verifyToken, updateProfile);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), googleCallback);

module.exports = router;
