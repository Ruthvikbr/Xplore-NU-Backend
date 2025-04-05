/**
 * @module utils/hashPassword
 * @description Utility function for securely hashing user passwords
 */

const bcrypt = require("bcryptjs");

/**
 * Hashes a password using bcrypt with a salt
 * @async
 * @function hashPassword
 * @param {string} password - Plain text password to hash
 * @returns {Promise<string>} Hashed password
 */
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

module.exports = hashPassword;
