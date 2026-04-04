const express = require('express');
const { 
    getStats, getNutrients, getActivityFeed, getYieldProjection 
} = require('../controllers/dashboard.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * Dashboard Routes mapping to /api/dashboard
 */

router.use(verifyToken);

router.get('/stats', getStats);
router.get('/nutrients', getNutrients);
router.get('/activity-feed', getActivityFeed);
router.get('/yield-projection', getYieldProjection);

module.exports = router;
