const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AI_KEY_NOT_SET');

// Get the model (using gemini-1.5-flash as default for speed/cost)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

module.exports = {
    genAI,
    model
};
