const ChatSession = require('../models/ChatSession');
const SoilReport = require('../models/SoilReport');
const Crop = require('../models/Crop');
const ApiError = require('../utils/ApiError');
const aiService = require('../services/ai.service');
const { formatSuccess } = require('../utils/responseFormatter');
const { logActivity } = require('../utils/activityLogger');

/**
 * Chat Controller for managing session-based and quick-advice AI interactions.
 */

const getSessions = async (req, res, next) => {
    try {
        const sessions = await ChatSession.find({ userId: req.user._id, isActive: true })
            .sort({ updatedAt: -1 })
            .limit(20);
        formatSuccess(res, sessions, 'Chat sessions fetched');
    } catch (error) {
        next(error);
    }
};

const createSession = async (req, res, next) => {
    try {
        const { domain } = req.body;
        const session = await ChatSession.create({
            userId: req.user._id,
            domain: domain || 'AgriTech',
            title: 'New Chat'
        });
        formatSuccess(res, session, 'Chat session created', 201);
    } catch (error) {
        next(error);
    }
};

const sendMessage = async (req, res, next) => {
    try {
        const { id: sessionId } = req.params;
        const { content } = req.body;

        // 1. Find session and verify ownership
        const session = await ChatSession.findById(sessionId);
        if (!session) throw ApiError.notFound('Session not found', 'SESSION_NOT_FOUND');
        if (session.userId.toString() !== req.user._id.toString()) {
            throw ApiError.forbidden('Unauthorized chat access');
        }

        // 2. Build User Context (Crops + Soil Health)
        const [crops, latestSoil] = await Promise.all([
            Crop.find({ userId: req.user._id, isActive: true }).select('name health stage'),
            SoilReport.findOne({ userId: req.user._id, status: 'complete' }).sort({ createdAt: -1 })
        ]);

        const userContext = {
            farmName: req.user.farmName,
            totalAcres: req.user.totalAcres,
            state: req.user.location?.state,
            crops,
            soilScore: latestSoil?.results?.healthScore || 0
        };

        // 3. Push user message
        const userMsg = { role: 'user', content, timestamp: new Date() };
        session.messages.push(userMsg);

        // 4. Get AI Response
        const aiResponse = await aiService.getChatResponse(session.messages, session.domain, userContext);
        
        const aiMsg = { 
            role: 'ai', 
            content: aiResponse.content, 
            sources: aiResponse.sources,
            timestamp: new Date() 
        };
        session.messages.push(aiMsg);

        // 5. Update session title if first message
        if (session.messages.length === 2) {
            session.title = content.split(' ').slice(0, 5).join(' ') + '...';
        }

        await session.save();
        logActivity(req.user._id, 'chat:message:sent', { sessionId }, req);

        formatSuccess(res, { message: userMsg, aiResponse: aiMsg, sessionTitle: session.title }, 'AI response generated');

    } catch (error) {
        next(error);
    }
};

const getSessionMessages = async (req, res, next) => {
    try {
        const session = await ChatSession.findById(req.params.id);
        if (!session || session.userId.toString() !== req.user._id.toString()) {
            throw ApiError.notFound('Session not found');
        }
        formatSuccess(res, session.messages, 'Chat messages fetched');
    } catch (error) {
        next(error);
    }
};

const deleteSession = async (req, res, next) => {
    try {
        const session = await ChatSession.findById(req.params.id);
        if (!session || session.userId.toString() !== req.user._id.toString()) {
            throw ApiError.notFound('Session not found');
        }
        session.isActive = false;
        await session.save();
        formatSuccess(res, {}, 'Session archived successfully');
    } catch (error) {
        next(error);
    }
};

const getQuickAdvice = async (req, res, next) => {
    try {
        const { content, domain = 'AgriTech' } = req.body;
        
        // One-shot AI query without session persistence
        const response = await aiService.getChatResponse([{ role: 'user', content }], domain, {
            farmName: req.user.farmName,
            totalAcres: req.user.totalAcres,
            state: req.user.location?.state,
            soilScore: 0
        });

        formatSuccess(res, response, 'Quick advice generated');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSessions,
    createSession,
    sendMessage,
    getSessionMessages,
    deleteSession,
    getQuickAdvice
};
