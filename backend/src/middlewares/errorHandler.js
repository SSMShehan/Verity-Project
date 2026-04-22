const errorHandler = (err, req, res, next) => {
    console.error(`[Error] ${err.name}:`, err.message);
    if (err.details) console.error(`[Details]:`, err.details);
    if (err.stack) console.error(`[Stack]:`, err.stack);
    
    // Check for Prisma specific errors
    if (err.code && err.code.startsWith('P2')) {
        return res.status(400).json({
            success: false,
            message: 'Database operation failed',
            details: err.message
        });
    }

    // Default error response
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
};

module.exports = errorHandler;
