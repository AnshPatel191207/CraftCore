const SoilReport = require('../models/SoilReport');
const FertilizerAdvisory = require('../models/FertilizerAdvisory');
const { generateFertilizerAdvisory } = require('../services/fertilizer.service');
const { formatStandardResponse } = require('../utils/responseFormatter');

/**
 * @desc    Generate fertilizer advisory
 * @route   POST /api/fertilizer/advise
 */
const adviseFertilizer = async (req, res, next) => {
    try {
        const { soilReportId, cropName } = req.body;

        if (!soilReportId || !cropName) {
            return res.status(400).json(formatStandardResponse(false, null, "Soil report ID and crop name are required."));
        }

        const soilReport = await SoilReport.findById(soilReportId);
        if (!soilReport || soilReport.userId.toString() !== req.user._id.toString()) {
            return res.status(404).json(formatStandardResponse(false, null, "Soil report not found."));
        }

        // Generate new advisory
        const advisory = await generateFertilizerAdvisory(soilReport, req.user._id, cropName);
        res.status(201).json(formatStandardResponse(true, advisory, "Fertilizer advisory generated."));
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get advisory history
 */
const getFertilizerHistory = async (req, res, next) => {
    try {
        const advisories = await FertilizerAdvisory.find({ userId: req.user._id })
            .populate('soilReportId', 'location parsedData')
            .sort({ generatedAt: -1 });
        res.json(formatStandardResponse(true, advisories));
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single advisory detail
 */
const getAdvisoryById = async (req, res, next) => {
    try {
        const advisory = await FertilizerAdvisory.findById(req.params.id)
            .populate('soilReportId', 'location parsedData');
            
        if (!advisory || advisory.userId.toString() !== req.user._id.toString()) {
            return res.status(404).json(formatStandardResponse(false, null, "Advisory not found."));
        }
        res.json(formatStandardResponse(true, advisory));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    adviseFertilizer,
    getFertilizerHistory,
    getAdvisoryById
};
