/**
 * @module middleware/authMiddlewares
 * @description Authentication and authorization middleware functions
 */

const jwt = require('jsonwebtoken');

/**
 * Set to store invalidated/blacklisted tokens
 * @type {Set<string>}
 */
const blacklistedTokens = new Set();

/**
 * Checks if a token has been blacklisted
 * @function isTokenBlacklisted
 * @param {string} token - JWT token to check
 * @returns {boolean} True if token is blacklisted, false otherwise
 */
const isTokenBlacklisted = (token) => blacklistedTokens.has(token);

/**
 * Middleware to authenticate JWT tokens
 * @function authenticateJWT
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
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