const express = require('express');
const { 
    getAdvisories, getAdvisoryById, markAsRead, updateAdvisory, subscribeToAlerts 
} = require('../controllers/advisory.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * Advisory Routes mapping to /api/advisories
 */

router.use(verifyToken);

router.get('/', getAdvisories);
router.get('/:id', getAdvisoryById);
router.patch('/:id/read', markAsRead);
router.patch('/:id', updateAdvisory);
router.post('/subscribe', subscribeToAlerts);

module.exports = router;
