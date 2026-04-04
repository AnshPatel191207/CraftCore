const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
const { generalLimiter } = require('./middleware/rateLimiter.middleware');
const { errorMiddleware } = require('./middleware/error.middleware');

// Routes
const authRouter = require('./routes/auth.routes');
const soilRouter = require('./routes/soil.routes');
const advisoryRouter = require('./routes/advisory.routes');
const cropRouter = require('./routes/crop.routes');
const weatherRouter = require('./routes/weather.routes');
const chatRouter = require('./routes/chat.routes');
const dashboardRouter = require('./routes/dashboard.routes');
const activityRouter = require('./routes/activity.routes');
const domainRouter = require('./routes/domain.routes');
const ragRouter = require('./routes/rag.routes');

const app = express();

/**
 * Main Application Configuration and Middleware Pipeline.
 */

// 1. Security & Performance
app.use(helmet());
app.use(cors({ 
    origin: process.env.CLIENT_URL || 'http://localhost:5173', 
    credentials: true 
}));
app.use(morgan('dev'));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// 2. Auth State
app.use(passport.initialize());

// 3. API Rate Limiting
app.use('/api', generalLimiter);

// 4. Health Check (Non-Rate Limited)
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date(),
        uptime: process.uptime(),
        env: process.env.NODE_ENV
    });
});

// 5. Routing Layer
app.use('/api/auth', authRouter);
app.use('/api/soil-reports', soilRouter);
app.use('/api/advisories', advisoryRouter);
app.use('/api/crops', cropRouter);
app.use('/api/weather', weatherRouter);
app.use('/api/chat', chatRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/activities', activityRouter);
app.use('/api/domains', domainRouter);
app.use('/api/rag', ragRouter);

// 6. 404 Handler
app.use('*', (req, res) => {
    res.status(404).json({ 
        success: false, 
        data: null,
        message: 'Endpoint not found', 
        code: 'NOT_FOUND' 
    });
});

// 7. Global Error Handler (CRITICAL: MUST BE LAST)
app.use(errorMiddleware);

module.exports = app;
