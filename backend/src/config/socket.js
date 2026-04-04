const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const { pubClient, subClient } = require('./redis');
const { verifySocketToken } = require('../middleware/auth.middleware');
const config = require('./index');

/**
 * Socket.io Initialization with Redis Adapter for real-time scale-out.
 * Optimized with centralized configuration and enhanced error handling.
 */

let io;

const initSocket = async (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: config.clientUrl,
            credentials: true
        },
        pingTimeout: 60000
    });

    // 1. Connect Redis Adapter (Uses specialized dual clients)
    try {
        io.adapter(createAdapter(pubClient, subClient));
        console.log('Socket.io Redis adapter initialized');
    } catch (err) {
        console.error('Socket.io Redis adapter failed:', err.message);
    }

    // 2. Authentication Middleware
    io.use(verifySocketToken);

    // 3. Event Handling
    io.on('connection', (socket) => {
        // Safe check for user existence if middleware passes but auth fails
        if (!socket.user) return socket.disconnect(true);
        
        const userId = socket.user._id.toString();
        
        // Join personal farm room
        socket.join(`farm:${userId}`);
        console.log(`Socket connected: ${userId}`);

        // Join regional location room if state is available
        if (socket.user.location?.state) {
            socket.join(`location:${socket.user.location.state}`);
            console.log(`User ${userId} joined regional room: ${socket.user.location.state}`);
        }

        // Client -> Server events
        socket.on('join:farm', () => socket.join(`farm:${userId}`));
        
        socket.on('chat:typing', ({ sessionId }) => {
            socket.to(`farm:${userId}`).emit('chat:typing', { sessionId });
        });

        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${userId}`);
        });
    });

    return io;
};

const getIO = () => {
    // Optimization: Don't throw if not initialized yet, return null for graceful handling
    return io || null;
};

module.exports = {
    initSocket,
    getIO
};
