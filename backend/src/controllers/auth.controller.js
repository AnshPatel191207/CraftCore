const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { formatSuccess } = require('../utils/responseFormatter');
const { logActivity } = require('../utils/activityLogger');
const { emailQueue } = require('../queues/index');
const geocodingService = require('../services/geocoding.service');

/**
 * Auth Controller for user registration, login, and profile management.
 */

const register = async (req, res, next) => {
    try {
        const { name, email, password, farmName, totalAcres, location } = req.body;

        // 1. Check if email already taken
        const existingUser = await User.findOne({ email });
        if (existingUser) throw ApiError.conflict('Email already registered', 'EMAIL_TAKEN');

        // 2. Automated Geocoding if city is provided
        if (location && location.city && (!location.lat || !location.lng)) {
            const coords = await geocodingService.getCoordinates(location.city);
            if (coords) {
                location.lat = coords.lat;
                location.lng = coords.lng;
                if (!location.address) location.address = coords.address;
            }
        }

        // 3. Create user (password hashed via pre-save hook)
        const user = await User.create({
            name, email, password, farmName, totalAcres, location, role: 'farmer'
        });

        // 3. Generate tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // 4. Save refresh token to user
        user.refreshTokens.push({ token: refreshToken });
        await user.save();

        // 5. Set refresh token in httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // 6. Queue welcome email
        await emailQueue.add('welcome-email', { userId: user._id.toString() });

        // 7. Log activity
        logActivity(user._id, 'account:created', { email: user.email }, req);

        formatSuccess(res, { 
            user: { 
                _id: user._id, 
                name: user.name, 
                email: user.email, 
                role: user.role,
                farmName: user.farmName,
                totalAcres: user.totalAcres
            }, 
            accessToken 
        }, 'User registered successfully', 201);

    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1. Find user (include password field for comparison)
        const user = await User.findByEmailWithPassword(email);
        if (!user || !(await user.comparePassword(password))) {
            throw ApiError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
        }

        // 2. Generate tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // 3. Update refresh tokens (keep only last 5 sessions)
        user.refreshTokens.push({ token: refreshToken });
        if (user.refreshTokens.length > 5) user.refreshTokens.shift();
        user.lastLogin = new Date();
        await user.save();

        // 4. Set cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // 5. Log activity
        logActivity(user._id, 'user:login', {}, req);

        formatSuccess(res, {
            user: { 
                _id: user._id, 
                name: user.name, 
                email: user.email, 
                role: user.role, 
                farmName: user.farmName,
                totalAcres: user.totalAcres
            },
            accessToken
        }, 'Login successful');

    } catch (error) {
        next(error);
    }
};

const refresh = async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) throw ApiError.unauthorized('No refresh token provided', 'NO_REFRESH_TOKEN');

        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        const user = await User.findById(decoded._id);
        if (!user) throw ApiError.unauthorized('User not found', 'USER_NOT_FOUND');

        // Verify token still exists in user's active sessions in DB
        const tokenExists = user.refreshTokens.some(t => t.token === token);
        if (!tokenExists) throw ApiError.unauthorized('Invalid or expired refresh token', 'TOKEN_REVOKED');

        const accessToken = user.generateAccessToken();
        formatSuccess(res, { accessToken }, 'Token refreshed');

    } catch (error) {
        next(error);
    }
};

const logout = async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken;
        if (token) {
            const user = await User.findById(req.user._id);
            if (user) {
                user.refreshTokens = user.refreshTokens.filter(t => t.token !== token);
                await user.save();
            }
        }

        res.clearCookie('refreshToken');
        logActivity(req.user._id, 'user:logout', {}, req);
        formatSuccess(res, {}, 'Logged out successfully');

    } catch (error) {
        next(error);
    }
};

const getMe = async (req, res, next) => {
    try {
        formatSuccess(res, { user: req.user }, 'User data fetched');
    } catch (error) {
        next(error);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const updates = req.body;
        const allowedUpdates = ['name', 'farmName', 'totalAcres', 'location', 'notificationPrefs'];
        
        // Automated Geocoding for profile updates
        if (updates.location && updates.location.city && (!updates.location.lat || !updates.location.lng)) {
            const coords = await geocodingService.getCoordinates(updates.location.city);
            if (coords) {
                updates.location.lat = coords.lat;
                updates.location.lng = coords.lng;
                if (!updates.location.address) updates.location.address = coords.address;
            }
        }

        Object.keys(updates).forEach(key => {
            if (allowedUpdates.includes(key)) req.user[key] = updates[key];
        });

        await req.user.save();
        logActivity(req.user._id, 'profile:updated', { fields: Object.keys(updates) }, req);
        formatSuccess(res, { user: req.user }, 'Profile updated successfully');

    } catch (error) {
        next(error);
    }
};

const googleCallback = async (req, res, next) => {
    try {
        const user = req.user;
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshTokens.push({ token: refreshToken });
        await user.save();

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${accessToken}`);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    refresh,
    logout,
    getMe,
    updateProfile,
    googleCallback
};
