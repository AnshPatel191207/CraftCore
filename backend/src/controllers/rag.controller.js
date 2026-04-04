const { trainWithText, askQuestion } = require('../services/rag/ragChain');

/**
 * Endpoint for training the RAG system with text data.
 * POST /api/v1/rag/train
 */
exports.train = async (req, res, next) => {
  try {
    const { text, metadata } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Text data is required and cannot be empty.',
      });
    }

    await trainWithText(text, metadata || {});

    res.status(200).json({
      success: true,
      message: 'Data trained and stored successfully.',
    });
  } catch (error) {
    console.error('Train Error:', error);
    next(error);
  }
};

/**
 * Endpoint for querying the RAG system.
 * POST /api/v1/rag/ask
 */
exports.ask = async (req, res, next) => {
  try {
    const { question } = req.body;

    if (!question || question.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Question is required and cannot be empty.',
      });
    }

    const result = await askQuestion(question);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Ask Error:', error);
    next(error);
  }
};
