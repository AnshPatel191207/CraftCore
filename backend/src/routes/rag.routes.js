const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const ragController = require('../controllers/rag.controller');

const trainLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: { success: false, message: 'Too many training requests, please try again after a minute.' },
});

const askLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  message: { success: false, message: 'Too many ask requests, please try again after a minute.' },
});

/**
 * RAG Training Endpoint
 * POST /api/v1/rag/train
 */
router.post('/train', trainLimiter, ragController.train);

/**
 * RAG Ask Endpoint
 * POST /api/v1/rag/ask
 */
router.post('/ask', askLimiter, ragController.ask);

module.exports = router;
