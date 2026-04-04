const Crop = require('../models/Crop');
const Advisory = require('../models/Advisory');
const ApiError = require('../utils/ApiError');
const { formatSuccess, formatPaginated } = require('../utils/responseFormatter');
const { logActivity } = require('../utils/activityLogger');
const { getIO } = require('../config/socket');

/**
 * Crop Controller for managing field records, growth stages, and health monitoring.
 */

const getCrops = async (req, res, next) => {
    try {
        const crops = await Crop.find({ userId: req.user._id, isActive: true })
            .sort({ plantedDate: -1 });
        formatSuccess(res, crops, 'Crops fetched successfully');
    } catch (error) {
        next(error);
    }
};

const createCrop = async (req, res, next) => {
    try {
        const { name, area, stage, plantedDate, expectedHarvest, variety, fieldLocation } = req.body;
        
        const crop = await Crop.create({
            userId: req.user._id,
            name, area, stage, plantedDate, expectedHarvest, variety, fieldLocation
        });

        logActivity(req.user._id, 'crop:created', { cropId: crop._id, name: crop.name }, req);
        formatSuccess(res, crop, 'Crop created successfully', 201);
    } catch (error) {
        next(error);
    }
};

const updateCrop = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const crop = await Crop.findOneAndUpdate(
            { _id: id, userId: req.user._id },
            updates,
            { new: true, runValidators: true }
        );

        if (!crop) throw ApiError.notFound('Crop not found');

        logActivity(req.user._id, 'crop:updated', { cropId: id }, req);
        formatSuccess(res, crop, 'Crop updated successfully');
    } catch (error) {
        next(error);
    }
};

const deleteCrop = async (req, res, next) => {
    try {
        const { id } = req.params;
        const crop = await Crop.findOneAndUpdate(
            { _id: id, userId: req.user._id },
            { isActive: false },
            { new: true }
        );

        if (!crop) throw ApiError.notFound('Crop not found');

        logActivity(req.user._id, 'crop:deleted', { cropId: id }, req);
        formatSuccess(res, {}, 'Crop deleted successfully');
    } catch (error) {
        next(error);
    }
};

const addHealthRecord = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { health, notes } = req.body;

        const crop = await Crop.findOne({ _id: id, userId: req.user._id });
        if (!crop) throw ApiError.notFound('Crop not found');

        // 1. Add to health history
        crop.healthHistory.push({ health, notes, date: new Date() });
        crop.health = health;
        await crop.save();

        // 2. Alert logic if health is critical (< 40)
        if (health < 40) {
            const io = getIO();
            io.to(`farm:${req.user._id}`).emit('crop:health:alert', {
                cropId: id,
                health,
                message: `Critical health alert for ${crop.name}!`
            });

            // Create an advisory record
            await Advisory.create({
                userId: req.user._id,
                title: `Critical Alert: ${crop.name}`,
                category: 'crop',
                severity: 'critical',
                summary: `Crop health for ${crop.name} has dropped below 40%.`,
                details: `Growth monitoring system indicates a significant stress level in ${crop.name}. ${notes || ''}`,
                actionItems: ['Check for pests immediately', 'Evaluate irrigation levels', 'Apply fertilizer if needed'],
                source: 'system'
            });
        }

        logActivity(req.user._id, 'crop:health:updated', { cropId: id, health }, req);
        formatSuccess(res, crop, 'Health record added successfully');

    } catch (error) {
        next(error);
    }
};

const getHealthHistory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const crop = await Crop.findOne({ _id: id, userId: req.user._id }).select('name healthHistory');
        if (!crop) throw ApiError.notFound('Crop not found');
        formatSuccess(res, crop, 'Health history fetched');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCrops,
    createCrop,
    updateCrop,
    deleteCrop,
    addHealthRecord,
    getHealthHistory
};
