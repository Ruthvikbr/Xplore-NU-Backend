const jwt = require('jsonwebtoken');
const blacklistedTokens = new Set();

const isTokenBlacklisted = (token) => blacklistedTokens.has(token);

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    const token = authHeader

    if (isTokenBlacklisted(token)) {
        return res.status(401).json({ message: 'Token is invalid (logged out)' });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

module.exports= {authenticateJWT,blacklistedTokens}