const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // 1. Find user by googleId first
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
            return done(null, user);
        }

        // 2. If not found, find by email
        const email = profile.emails[0].value;
        user = await User.findOne({ email });

        if (user) {
            // 4. Update googleId if found by email without it
            user.googleId = profile.id;
            user.avatar = profile.photos[0].value;
            await user.save();
            return done(null, user);
        }

        // 3. If still not found, create new user (no password)
        user = await User.create({
            name: profile.displayName,
            email: email,
            googleId: profile.id,
            avatar: profile.photos[0].value,
            role: 'farmer'
        });

        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

module.exports = passport;
