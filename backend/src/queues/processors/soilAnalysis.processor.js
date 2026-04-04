const { Worker } = require('bullmq');
const axios = require('axios');
const { bullConnection } = require('../../config/redis');
const SoilReport = require('../../models/SoilReport');
const { extractTextFromPDF, extractTextFromImage } = require('../../services/ocr.service');
const { analyzeSoilReport } = require('../../services/ai.service');
const { generateAdvisoryFromSoilReport } = require('../../services/advisory.service');
const { logActivity } = require('../../utils/activityLogger');
const { getIO } = require('../../config/socket');

/**
 * BullMQ Worker for background processing of soil reports.
 */

const soilAnalysisWorker = new Worker('soil-analysis', async (job) => {
    const { reportId, fileUrl, fileType, userId } = job.data;
    let io;
    try {
        io = getIO();
    } catch (_) {}

    try {
        // 1. Update status to 'processing'
        await SoilReport.findByIdAndUpdate(reportId, {
            status: 'processing',
            processingStartedAt: new Date()
        });
        if (io) io.to(`farm:${userId}`).emit('soil:analysis:progress', { reportId, progress: 10 });

        // 2. Fetch and extract text
        let rawText = '';
        const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data);

        if (fileType === 'pdf') {
            rawText = await extractTextFromPDF(buffer);
        } else {
            rawText = await extractTextFromImage(buffer);
        }
        if (io) io.to(`farm:${userId}`).emit('soil:analysis:progress', { reportId, progress: 40 });

        // 3. Perform AI or Rule-Based Analysis
        const results = await analyzeSoilReport(rawText);
        if (io) io.to(`farm:${userId}`).emit('soil:analysis:progress', { reportId, progress: 80 });

        // 4. Save results to database
        await SoilReport.findByIdAndUpdate(reportId, {
            status: 'complete',
            results,
            rawExtractedText: rawText,
            processingCompletedAt: new Date()
        });

        // 5. Generate automated advisories from results
        await generateAdvisoryFromSoilReport({ results, _id: reportId }, userId);

        // 6. Notify the user of completion
        if (io) io.to(`farm:${userId}`).emit('soil:analysis:complete', { reportId, results });
        logActivity(userId, 'soil:report:analyzed', { reportId });

    } catch (error) {
        console.error(`Soil Analysis Job Failed [${reportId}]:`, error.message);
        await SoilReport.findByIdAndUpdate(reportId, {
            status: 'error',
            errorMessage: error.message
        });
        if (io) io.to(`farm:${userId}`).emit('soil:analysis:error', { reportId, message: error.message });
        throw error; // Re-throw to trigger BullMQ retry logic
    }
}, {
    connection: bullConnection,
    concurrency: 5,
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 }
});

module.exports = soilAnalysisWorker;
