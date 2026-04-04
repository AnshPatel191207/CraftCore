const express = require('express');
const router = express.Router();
const { 
    adviseFertilizer, 
    getFertilizerHistory, 
    getAdvisoryById 
} = require('../controllers/fertilizer.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// All fertilizer routes are protected
router.use(verifyToken);

router.post('/advise', adviseFertilizer);
router.get('/history', getFertilizerHistory);
router.get('/history/:id', getAdvisoryById);

module.exports = router;
