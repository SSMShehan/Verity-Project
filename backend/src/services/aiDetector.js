const axios = require('axios');

/**
 * Detects AI-generated content using Sapling AI API.
 * @param {string} text - The text to analyze.
 * @returns {Promise<{aiScore: number, sentenceScores: Array}>} - The AI score (0-100).
 */
async function detectAIContent(text) {
    try {
        const apiKey = process.env.SAPLING_API_KEY;
        if (!apiKey) {
            console.error('SAPLING_API_KEY is missing in .env');
            return { aiScore: 0, sentenceScores: [] };
        }

        // Sapling has a limit of 200,000 characters. 
        // For very long texts, we might need to chunk it, but for most assignments this is enough.
        const response = await axios.post('https://api.sapling.ai/api/v1/aidetect', {
            key: apiKey,
            text: text.substring(0, 200000)
        });

        // Sapling returns score from 0 to 1. We multiply by 100.
        const aiScore = (response.data.score || 0) * 100;

        return {
            aiScore: Math.round(aiScore * 100) / 100, // Round to 2 decimal places
            sentenceScores: response.data.sentence_scores || []
        };
    } catch (error) {
        console.error('Error in AI Detection (Sapling):', error.response?.data || error.message);
        // Fallback or rethrow? 
        // Let's return 0 and log it for now to not break the whole flow
        return { aiScore: 0, sentenceScores: [], error: error.message };
    }
}

module.exports = { detectAIContent };
