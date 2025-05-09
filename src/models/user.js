/**
 * @module models/User
 * @description User model representing system users with authentication details
 */

const mongoose = require('mongoose');

/**
 * User Schema definition
 * @typedef {Object} UserSchema
 * @property {String} firstName - User's first name (required, non-empty)
 * @property {String} lastName - User's last name (required, non-empty)
 * @property {String} email - User's unique email address (required, validated format)
 * @property {String} password - User's hashed password (required, min 6 chars, contains letter, number, and special char)
 * @property {String} role - User role (student, visitor, or admin)
 * @property {String} refreshToken - JWT refresh token for authentication
 */
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    minlength: [1, 'First name cannot be empty'],
    validate: {
      validator: function(value) {
        return value.trim() !== '';  // Ensures first name is not just spaces
      },
      message: 'First name cannot be empty'
    }
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    minlength: [1, 'Last name cannot be empty'],
    validate: {
      validator: function(value) {
        return value.trim() !== '';  // Ensures last name is not just spaces
      },
      message: 'Last name cannot be empty'
    }
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email']  // Regex to validate email format
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    validate: {
      validator: function(value) {
        // Check if password is not empty
        return value.trim() !== '';
      },
      message: 'Password cannot be empty'
    },
    match: [
      /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).+$/, // Must contain letters, numbers, and special characters
      'Password must contain at least one letter, one number, and one special character'
    ]
  },
  role: {
    type: String,
    enum: ['student', 'visitor', 'admin'],
    required: [true, 'User type is required']
  },
  refreshToken: {
    type: String,
    default: null
  }
});

/**
 * User model for managing user accounts
 * @type {mongoose.Model}
 */
const User = mongoose.model('User', userSchema);
module.exports = User;
