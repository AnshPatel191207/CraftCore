const express = require('express');
const { 
    uploadSoilReport, getReports, getLatestReport, getReportById, deleteReport, getAnalysis 
} = require('../controllers/soil.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { soilFileUpload } = require('../middleware/upload.middleware');
const { aiLimiter } = require('../middleware/rateLimiter.middleware');

const router = express.Router();

/**
 * Soil Report Routes mapping to /api/soil-reports
 */

// Global Middleware: JWT Required
router.use(verifyToken);

router.get('/', getReports);
router.post('/', soilFileUpload.single('file'), uploadSoilReport);

// CRITICAL: /latest MUST be before /:id to avoid ID conflict
router.get('/latest', getLatestReport);

router.get('/:id', getReportById);
router.delete('/:id', deleteReport);
router.get('/:id/analysis', aiLimiter, getAnalysis);

module.exports = router;
