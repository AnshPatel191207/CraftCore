const express = require('express');
const { 
    getActivities, createActivity, getAuditTrail 
} = require('../controllers/activity.controller');
const { verifyToken, requireAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * Activity Routes mapping to /api/activities
 */

router.use(verifyToken);

router.get('/', getActivities);
router.post('/', createActivity);

// Admin-only route for full system audit
router.get('/audit-trail', requireAdmin, getAuditTrail);

module.exports = router;
