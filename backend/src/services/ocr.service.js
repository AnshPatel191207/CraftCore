const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');
const ApiError = require('../utils/ApiError');

/**
 * OCR Service for PDF and Image text extraction.
 */

const extractTextFromPDF = async (buffer) => {
    try {
        const data = await pdfParse(buffer);
        return data.text;
    } catch (error) {
        console.error('PDF Parse Error:', error.message);
        throw ApiError.badRequest('Could not parse PDF content.', 'PDF_PARSE_ERROR');
    }
};

const extractTextFromImage = async (buffer) => {
    try {
        const { data: { text } } = await Tesseract.recognize(buffer, 'eng');
        return text;
    } catch (error) {
        console.error('OCR Process Error:', error.message);
        throw ApiError.badRequest('Could not read image content.', 'OCR_ERROR');
    }
};

module.exports = {
    extractTextFromPDF,
    extractTextFromImage
};
