const natural = require('natural');
const TfIdf = natural.TfIdf;

/**
 * Checks for plagiarism between a new submission and existing ones.
 * @param {string} newText - The text of the new submission.
 * @param {Array<{id: string, extractedText: string}>} existingSubmissions - List of other submissions for the same assignment.
 * @returns {{plagiarismScore: number, matches: Array}} - The highest plagiarism score and list of matches.
 */
function checkPlagiarism(newText, existingSubmissions) {
    if (!newText || existingSubmissions.length === 0) {
        return { plagiarismScore: 0, matches: [] };
    }

    const tfidf = new TfIdf();
    
    // Add the new submission as document 0
    tfidf.addDocument(newText);
    
    const matches = [];
    let maxScore = 0;

    // Compare with each existing submission
    existingSubmissions.forEach((sub, index) => {
        if (!sub.extractedText) return;

        // Simplified cosine similarity using natural's TfIdf
        // natural doesn't have a direct cosine similarity function in TfIdf, 
        // so we manually compute a basic similarity score based on common terms
        
        const score = computeSimilarity(newText, sub.extractedText);
        const percentage = Math.min(Math.round(score * 100), 100);

        if (percentage > maxScore) {
            maxScore = percentage;
        }

        // Only track matches above 30% for internal logging, 
        // but we'll flag 70%+ in the main flow
        if (percentage >= 30) {
            matches.push({
                submissionId: sub.id,
                score: percentage
            });
        }
    });

    return {
        plagiarismScore: maxScore,
        matches: matches.filter(m => m.score >= 70) // Main flagged matches
    };
}

/**
 * Basic similarity computation using token overlap.
 * For a production environment, a more robust library like 'string-similarity' 
 * or a vector-based approach (Word2Vec/BERT) would be better.
 */
function computeSimilarity(text1, text2) {
    const tokenizer = new natural.WordTokenizer();
    const tokens1 = new Set(tokenizer.tokenize(text1.toLowerCase()));
    const tokens2 = new Set(tokenizer.tokenize(text2.toLowerCase()));

    const intersection = new Set([...tokens1].filter(x => tokens2.has(x)));
    const union = new Set([...tokens1, ...tokens2]);

    if (union.size === 0 || tokens1.size === 0 || tokens2.size === 0) return 0;
    return intersection.size / Math.sqrt(tokens1.size * tokens2.size); // Cosine-like similarity
}

module.exports = { checkPlagiarism };
