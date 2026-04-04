const path = require('path');

/**
 * Centralized Configuration for AgriSense Backend.
 * Loads environment variables once and exports them as a frozen object.
 */

const getEnv = (key, defaultValue = null) => {
    const value = process.env[key];
    if (value === undefined || value === null) {
        if (defaultValue !== null) return defaultValue;
        // Optimization: Don't throw for everything, only for critical keys in validation step
    }
    return value;
};

const config = {
    env: getEnv('NODE_ENV', 'development'),
    port: parseInt(getEnv('PORT', '5000'), 10),
    
    // Database
    mongodb: {
        uri: getEnv('MONGODB_URI'),
    },
    
    // Redis
    redis: {
        url: getEnv('REDIS_URL'),
    },
    
    // Auth
    jwt: {
        secret: getEnv('JWT_SECRET'),
        refreshSecret: getEnv('JWT_REFRESH_SECRET'),
        expire: getEnv('JWT_EXPIRE', '7d'),
    },
    
    // AI Services
    ai: {
        openaiKey: getEnv('OPENAI_API_KEY'),
        openaiModel: getEnv('OPENAI_MODEL', 'gpt-4o-mini'),
        geminiKey: getEnv('GEMINI_API_KEY'),
        groqKey: getEnv('GROQ_API_KEY'),
        hfToken: getEnv('HF_API_TOKEN'),
        perplexityKey: getEnv('PERPLEXITY_API_KEY'),
        demoMode: getEnv('DEMO_MODE') === 'true',
    },
    
    // Infrastructure
    cloudinary: {
        name: getEnv('CLOUDINARY_CLOUD_NAME'),
        apiKey: getEnv('CLOUDINARY_API_KEY'),
        apiSecret: getEnv('CLOUDINARY_API_SECRET'),
    },
    
    // External APIs
    weather: {
        apiKey: getEnv('WEATHER_API_KEY'),
        baseUrl: getEnv('WEATHER_BASE_URL', 'https://api.openweathermap.org/data/2.5'),
    },
    
    // Email
    email: {
        resendKey: getEnv('RESEND_API_KEY'),
        sendgridKey: getEnv('SENDGRID_API_KEY'),
        from: getEnv('EMAIL_FROM', 'noreply@agrisense.ai'),
        gmailUser: getEnv('GMAIL_USER'),
        gmailPass: getEnv('GMAIL_APP_PASSWORD'),
    },
    
    // Vector DB
    vector: {
        url: getEnv('UPSTASH_VECTOR_REST_URL'),
        token: getEnv('UPSTASH_VECTOR_REST_TOKEN'),
    },
    
    // OAuth
    google: {
        clientId: getEnv('GOOGLE_CLIENT_ID'),
        clientSecret: getEnv('GOOGLE_CLIENT_SECRET'),
        callbackUrl: getEnv('GOOGLE_CALLBACK_URL'),
    },
    
    // URLs
    clientUrl: getEnv('CLIENT_URL', 'http://localhost:5173'),
    serverUrl: getEnv('SERVER_URL', 'http://localhost:5000'),

    sessionSecret: getEnv('SESSION_SECRET', 'agrisense_session_secret'),

    // STITCH SYSTEM VALIDATION
    requiredKeys: [
        { key: 'MONGODB_URI', value: getEnv('MONGODB_URI') },
        { key: 'REDIS_URL', value: getEnv('REDIS_URL') },
        { key: 'JWT_SECRET', value: getEnv('JWT_SECRET') },
        { key: 'OPENAI_API_KEY', value: getEnv('OPENAI_API_KEY') },
        { key: 'CLOUDINARY_API_KEY', value: getEnv('CLOUDINARY_API_KEY') },
        { key: 'WEATHER_API_KEY', value: getEnv('WEATHER_API_KEY') }
    ]
};

/**
 * VALIDATION: Ensure critical keys are present.
 * Fail FAST if API keys are missing — do not delay or retry unnecessarily.
 */
const missing = config.requiredKeys.filter(k => !k.value).map(k => k.key);

if (missing.length > 0) {
    if (config.env !== 'test') { 
        const errorMsg = `CRITICAL FAILURE: Missing REQUIRED API Keys: [${missing.join(', ')}]`;
        console.error('\x1b[41m\x1b[37m%s\x1b[0m', errorMsg);
        console.error('\x1b[31m%s\x1b[0m', 'Server will remain online but API calls will fail until keys are added.');
    }
}

// Global accessor for health check
config.getMissingKeys = () => config.requiredKeys.filter(k => !k.value).map(k => k.key);

// Freeze to prevent accidental modification during runtime
module.exports = Object.freeze(config);
