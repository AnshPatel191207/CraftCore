const express = require('express');
const { 
    getCrops, createCrop, updateCrop, deleteCrop, addHealthRecord, getHealthHistory 
} = require('../controllers/crop.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { validate, cropValidator } = require('../middleware/validate.middleware');

const router = express.Router();

/**
 * Crop Routes mapping to /api/crops
 */

router.use(verifyToken);

router.get('/', getCrops);
router.post('/', cropValidator, validate, createCrop);
router.put('/:id', cropValidator, validate, updateCrop);
router.delete('/:id', deleteCrop);

router.get('/:id/health-history', getHealthHistory);
router.post('/:id/health', addHealthRecord);

module.exports = router;
