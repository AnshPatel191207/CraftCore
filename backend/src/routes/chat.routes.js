const express = require('express');
const { 
    getSessions, createSession, sendMessage, getSessionMessages, deleteSession, getQuickAdvice 
} = require('../controllers/chat.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { aiLimiter } = require('../middleware/rateLimiter.middleware');
const { validate, chatValidator } = require('../middleware/validate.middleware');

const router = express.Router();

/**
 * Chat Routes mapping to /api/chat
 */

router.use(verifyToken);

router.get('/sessions', getSessions);
router.post('/sessions', createSession);

router.get('/sessions/:id/messages', getSessionMessages);
router.post('/sessions/:id/messages', aiLimiter, chatValidator, validate, sendMessage);

router.delete('/sessions/:id', deleteSession);
router.post('/quick-advice', aiLimiter, chatValidator, validate, getQuickAdvice);

module.exports = router;
