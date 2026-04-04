const IORedis = require('ioredis');
const config = require('./index');

/**
 * Centalized Redis connection configuration.
 * Optimized for performance and stability with localized config.
 */

const redisOptions = {
    maxRetriesPerRequest: null, // Required by BullMQ
    enableReadyCheck: false,
    retryStrategy: (times) => Math.min(times * 200, 5000), // Slower backoff for stability
};

if (config.redis.url?.startsWith('rediss')) {
    redisOptions.tls = { rejectUnauthorized: false };
}

// Optimization: Shared connections where possible, 
// but BullMQ and Socket.io often require dedicated ones for pub/sub.
const bullConnection = new IORedis(config.redis.url, redisOptions);
const cacheClient = new IORedis(config.redis.url, redisOptions);
const pubClient = new IORedis(config.redis.url, redisOptions);
const subClient = new IORedis(config.redis.url, redisOptions);

bullConnection.on('error', (err) => console.error('Redis BullMQ Error:', err.message));
cacheClient.on('error', (err) => console.error('Redis Cache Error:', err.message));

module.exports = { 
    bullConnection, 
    cacheClient, 
    pubClient, 
    subClient 
};
