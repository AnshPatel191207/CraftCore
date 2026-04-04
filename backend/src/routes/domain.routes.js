const express = require('express');
const { 
    getDomains, getCurrent, updateCurrent 
} = require('../controllers/domain.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * Domain Routes mapping to /api/domains
 */

router.use(verifyToken);

router.get('/', getDomains);
router.get('/current', getCurrent);
router.put('/current', updateCurrent);

module.exports = router;
