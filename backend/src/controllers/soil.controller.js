const SoilReport = require('../models/SoilReport');
const ApiError = require('../utils/ApiError');
const { formatSuccess, formatPaginated } = require('../utils/responseFormatter');
const { logActivity } = require('../utils/activityLogger');
const { analysisQueue } = require('../queues/index');

/**
 * Soil Controller for managing soil report uploads and analysis results.
 */

const uploadSoilReport = async (req, res, next) => {
    try {
        if (!req.file) throw ApiError.badRequest('No file uploaded', 'NO_FILE');

        // 1. Create report record in DB
        const report = await SoilReport.create({
            userId: req.user._id,
            fileName: req.file.originalname,
            fileUrl: req.file.path, // Cloudinary URL
            fileType: req.file.mimetype.includes('pdf') ? 'pdf' : 'jpg',
            status: 'processing'
        });

        // 2. Add job to BullMQ analysis queue
        await analysisQueue.add('analyze-soil', {
            reportId: report._id.toString(),
            fileUrl: report.fileUrl,
            fileType: report.fileType,
            userId: req.user._id.toString()
        });

        // 3. Log activity
        logActivity(req.user._id, 'soil:report:uploaded', { reportId: report._id }, req);

        formatSuccess(res, { report }, 'Report uploaded, analysis started', 201);

    } catch (error) {
        next(error);
    }
};

const getReports = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const query = { userId: req.user._id };

        const reports = await SoilReport.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await SoilReport.countDocuments(query);
        formatPaginated(res, reports, total, page, limit);

    } catch (error) {
        next(error);
    }
};

const getLatestReport = async (req, res, next) => {
    try {
        const report = await SoilReport.findOne({ 
            userId: req.user._id, 
            status: 'complete' 
        }).sort({ createdAt: -1 });

        if (!report) throw ApiError.notFound('No complete soil reports found');
        formatSuccess(res, { report }, 'Latest report fetched');

    } catch (error) {
        next(error);
    }
};

const getReportById = async (req, res, next) => {
    try {
        const report = await SoilReport.findById(req.params.id);
        if (!report) throw ApiError.notFound('Soil report not found');
        
        // Verify ownership
        if (report.userId.toString() !== req.user._id.toString()) {
            throw ApiError.forbidden('Unauthorized access to report');
        }

        formatSuccess(res, { report }, 'Report details fetched');

    } catch (error) {
        next(error);
    }
};

const deleteReport = async (req, res, next) => {
    try {
        const report = await SoilReport.findById(req.params.id);
        if (!report) throw ApiError.notFound('Report not found');
        if (report.userId.toString() !== req.user._id.toString()) {
            throw ApiError.forbidden('Unauthorized deletion attempt');
        }

        await report.deleteOne();
        logActivity(req.user._id, 'soil:report:deleted', { reportId: req.params.id }, req);
        formatSuccess(res, {}, 'Report deleted successfully');

    } catch (error) {
        next(error);
    }
};

const getAnalysis = async (req, res, next) => {
    try {
        const report = await SoilReport.findById(req.params.id);
        if (!report) throw ApiError.notFound('Soil report not found');
        if (report.userId.toString() !== req.user._id.toString()) {
            throw ApiError.forbidden('Unauthorized analysis access');
        }

        if (report.status !== 'complete') {
            return formatSuccess(res, { status: report.status }, 'Analysis is still in progress', 202);
        }

        formatSuccess(res, { results: report.results }, 'Analysis results fetched');

    } catch (error) {
        next(error);
    }
};

module.exports = {
    uploadSoilReport,
    getReports,
    getLatestReport,
    getReportById,
    deleteReport,
    getAnalysis
};
