const cron = require('node-cron');
const { advisoryQueue, emailQueue, monitorQueue } = require('../index');

/**
 * Node-Cron scheduler for recurring background tasks.
 */

// Daily Advisories at 6:00 AM
cron.schedule('0 6 * * *', async () => {
    console.log('Running daily advisory job scheduler');
    await advisoryQueue.add('daily-advisories', { timestamp: new Date() });
});

// Weekly Digest on Sundays at 8:00 AM
cron.schedule('0 8 * * 0', async () => {
    console.log('Running weekly digest job scheduler');
    await emailQueue.add('weekly-digest', { timestamp: new Date() });
});

// Crop Health Check every 4 hours
cron.schedule('0 */4 * * *', async () => {
    console.log('Running crop health monitoring job scheduler');
    await monitorQueue.add('crop-health-check', { timestamp: new Date() });
});

// Weather Cache Refresh every 3 hours
cron.schedule('0 */3 * * *', async () => {
    console.log('Running weather cache refresh job scheduler');
    await advisoryQueue.add('refresh-weather', { timestamp: new Date() });
});

console.log('Schedulers initialized.');

module.exports = cron;
