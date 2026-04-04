const IORedis = require('ioredis');

// Build common options
const redisOptions = {
    maxRetriesPerRequest: null, // Required by BullMQ and good for stability
    enableReadyCheck: false,
    retryStrategy: (times) => Math.min(times * 100, 3000),
};

// Add TLS if using rediss://
if (process.env.REDIS_URL?.startsWith('rediss')) {
    redisOptions.tls = { rejectUnauthorized: false };
}

// Clients
const bullConnection = new IORedis(process.env.REDIS_URL, redisOptions);
const cacheClient = new IORedis(process.env.REDIS_URL, redisOptions);
const pubClient = new IORedis(process.env.REDIS_URL, redisOptions);
const subClient = new IORedis(process.env.REDIS_URL, redisOptions);

// Connection logging
bullConnection.on('connect', () => console.log('Redis BullMQ connected'));
cacheClient.on('connect', () => console.log('Redis Cache connected'));
pubClient.on('connect', () => console.log('Redis Pub connected'));
subClient.on('connect', () => console.log('Redis Sub connected'));

module.exports = { 
    bullConnection, 
    cacheClient, 
    pubClient, 
    subClient 
};
