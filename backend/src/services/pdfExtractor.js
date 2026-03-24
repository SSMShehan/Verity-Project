const axios = require('axios');
const pdf = require('pdf-parse');

/**
 * Extracts text from a PDF file given its public URL.
 * @param {string} url - The public URL of the PDF file.
 * @returns {Promise<string>} - The extracted text.
 */
async function extractTextFromUrl(url) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data);
        const data = await pdf(buffer);
        return data.text;
    } catch (error) {
        console.error('Error extracting text from PDF:', error);
        throw new Error('Failed to extract text from PDF');
    }
}

module.exports = { extractTextFromUrl };
