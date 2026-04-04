/**
 * AI Response Parsing and Standardized API Response Formatting
 */

/**
 * Strips AI formatting (markdown code blocks, etc.) and parses as JSON
 */
const safeParseAI = (text) => {
    try {
        if (!text) return null;
        let cleanText = text.trim();
        
        // Remove markdown code blocks if they exist
        if (cleanText.includes('```')) {
            cleanText = cleanText.split('```')[1].replace(/^(json|JSON)/, '').trim();
        }
        
        return JSON.parse(cleanText);
    } catch (error) {
        console.error('AI JSON Parse Error:', error.message);
        return null;
    }
};

/**
 * Standard Success Response Format 
 * Shape: { success: true, data: {}, message: "" }
 */
const formatSuccess = (res, data = {}, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        data,
        message
    });
};

/**
 * Standard Paginated Response Format
 */
const formatPaginated = (res, data, total, page, limit) => {
    return res.json({
        success: true,
        data,
        pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / limit)
        }
    });
};

module.exports = {
    safeParseAI,
    formatSuccess,
    formatPaginated
};
