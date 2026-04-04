require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const config = require('./src/config');
const app = require('./src/app');
const { connectDB } = require('./src/config/db');
const { initSocket } = require('./src/config/socket');

// Start Workers and Schedulers
require('./src/queues/processors/soilAnalysis.processor');
require('./src/queues/schedulers/cron');

/**
 * Main server entry point for AgriSense AI.
 */

const start = async () => {
    try {
        // 1. Database Connection
        await connectDB();

        // 2. Database Initialization (Seeding)
        const seedData = require('./src/config/dbInit');
        await seedData();

        // 3. HTTP and Socket.io Initialization
        const server = http.createServer(app);
        await initSocket(server);

        // 3. Start Listening
        const PORT = config.port;
        server.listen(PORT, () => {
            console.log('==============================================');
            console.log(`AgriSense Backend Running on Port: ${PORT}`);
            console.log(`Node Environment: ${config.env}`);
            console.log(`DEMO_MODE: ${config.ai.demoMode}`);
            console.log('==============================================');
        });

        // 4. Graceful Shutdown Management
        const shutdown = async () => {
            console.log('\nShutting down gracefully...');
            try {
                // Close DB
                await mongoose.connection.close();
                console.log('MongoDB connection closed.');

                // Close Redis clients used in config (Adapter etc)
                const { pubClient, subClient, cacheClient, bullConnection } = require('./src/config/redis');
                await Promise.all([
                    pubClient.quit(),
                    subClient.quit(),
                    cacheClient.quit(),
                    bullConnection.quit()
                ]);
                console.log('Redis connections closed.');

                // Close Express server
                server.close(() => {
                    console.log('HTTP server closed.');
                    process.exit(0);
                });
            } catch (err) {
                console.error('Shutdown error:', err.message);
                process.exit(1);
            }
        };

        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);

    } catch (error) {
        console.error('AgriSense Server Initialization Failed:', error.message);
        process.exit(1);
    }
};

start();
