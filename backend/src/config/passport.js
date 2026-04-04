const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('./index');
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: config.google.clientId,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackUrl
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // 1. Find user by googleId with leaner query
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
            return done(null, user);
        }

        // 2. Identify by email
        const email = profile.emails[0].value;
        user = await User.findOne({ email });

        if (user) {
            user.googleId = profile.id;
            user.avatar = profile.photos[0].value;
            await user.save();
            return done(null, user);
        }

        // 3. Create new user
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
