const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token || token === 'null' || token === 'undefined') {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Contains id, role, etc.
        next();
    } catch (err) {
        console.error('[AuthMiddleware] Token Verification Failed:', err.message);
        res.status(400).json({ message: 'Invalid token.', details: err.message });
    }
};

const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: Insufficient permissions.' });
        }
        next();
    };
};

module.exports = { authMiddleware, roleMiddleware };
