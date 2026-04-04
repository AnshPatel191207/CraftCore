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
 * Optimized for high resilience and real-time status reporting.
 */

const soilAnalysisWorker = new Worker('soil-analysis', async (job) => {
    const { reportId, fileUrl, fileType, userId } = job.data;
    
    // 0. Try to get IO safely
    const io = getIO();

    try {
        // 1. Update status to 'processing'
        await SoilReport.findByIdAndUpdate(reportId, {
            status: 'processing',
            processingStartedAt: new Date()
        });
        if (io) io.to(`farm:${userId}`).emit('soil:analysis:progress', { reportId, progress: 10 });

        // 2. Fetch and extract text
        let rawText = '';
        try {
            console.log(`[SOIL_WORKER] Downloading file: ${fileUrl}`);
            const response = await axios.get(fileUrl, { 
                responseType: 'arraybuffer',
                timeout: 10000 
            });
            const buffer = Buffer.from(response.data);

            if (fileType === 'pdf') {
                rawText = await extractTextFromPDF(buffer);
            } else {
                rawText = await extractTextFromImage(buffer);
            }
        } catch (ocrError) {
            console.warn(`[SOIL_WORKER] OCR/Download failed for [${reportId}]:`, ocrError.message);
            // Don't fail completely - we might have some data or can use AI vision later if needed
            // For now, we allow the next step to try AI analysis or rule-base.
            // If rawText is empty, AI/Rules will handle it.
        }

        if (io) io.to(`farm:${userId}`).emit('soil:analysis:progress', { reportId, progress: 40 });

        // 3. Perform AI or Rule-Based Analysis
        // analyzeSoilReport has its own fallback to rule-based!
        const results = await analyzeSoilReport(rawText || "Lab report could not be read cleanly. Providing baseline recommendations.");
        
        if (io) io.to(`farm:${userId}`).emit('soil:analysis:progress', { reportId, progress: 80 });

        // 4. Save results to database
        await SoilReport.findByIdAndUpdate(reportId, {
            status: 'complete',
            results,
            rawExtractedText: rawText || 'OCR_FAILED',
            processingCompletedAt: new Date()
        });

        // 5. Generate automated advisories
        try {
            await generateAdvisoryFromSoilReport({ results, _id: reportId }, userId);
        } catch (advError) {
            console.error(`[SOIL_WORKER] Advisory Generation failed [${reportId}]:`, advError.message);
        }

        // 6. Notify the user of completion
        if (io) io.to(`farm:${userId}`).emit('soil:analysis:complete', { reportId, results });
        logActivity(userId, 'soil:report:analyzed', { reportId });

        console.log(`[SOIL_WORKER] Analysis Job SUCCESS [${reportId}]`);
        return { success: true, reportId };

    } catch (error) {
        console.error(`[SOIL_WORKER] CRITICAL Job Failure [${reportId}]:`, error.stack);
        
        await SoilReport.findByIdAndUpdate(reportId, {
            status: 'error',
            errorMessage: error.message || 'An unexpected error occurred during analysis.'
        });
        
        if (io) io.to(`farm:${userId}`).emit('soil:analysis:error', { reportId, message: error.message });
        
        // Only throw if it's transient (e.g. Redis out). 
        // For processing errors, we've already marked it as 'error' in DB.
        throw error; 
    }
}, {
    connection: bullConnection,
    concurrency: 3,
    attempts: 2,
    backoff: { type: 'exponential', delay: 5000 }
});

module.exports = soilAnalysisWorker;
