const express = require('express');
const router = express.Router();
const { analyzeSoilHealth, getDashboardStats } = require('../controllers/analysis.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// All analysis routes are protected
router.use(verifyToken);

router.post('/analyze', analyzeSoilHealth);
router.get('/dashboard', getDashboardStats);

module.exports = router;
