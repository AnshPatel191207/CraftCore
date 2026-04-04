const { Queue } = require('bullmq');
const { bullConnection } = require('../config/redis');

/**
 * BullMQ Queue instances for background job management.
 */

const analysisQueue = new Queue('soil-analysis', { 
    connection: bullConnection,
    defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: 1000 // Keep past 1000 failures
    }
});

const advisoryQueue = new Queue('advisories', { connection: bullConnection });
const emailQueue = new Queue('email', { connection: bullConnection });
const monitorQueue = new Queue('monitoring', { connection: bullConnection });
const chatQueue = new Queue('ai-chat', { connection: bullConnection });

module.exports = {
    analysisQueue,
    advisoryQueue,
    emailQueue,
    monitorQueue,
    chatQueue
};
