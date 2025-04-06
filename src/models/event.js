/**
 * @module models/Event
 * @description Event model representing campus events and activities
 */

const mongoose = require('mongoose');

/**
 * Event Schema definition
 * @typedef {Object} EventSchema
 * @property {String} name - Event name (required, non-empty)
 * @property {Date} date - Date when the event will occur (required)
 * @property {String} time - Time when the event will occur (required)
 * @property {String} location - Location where the event will be held (required)
 * @property {String} description - Detailed description of the event (required)
 * @property {String[]} images - Array of image URLs for the event (up to 10)
 * @property {mongoose.Schema.Types.ObjectId} building_id - Reference to associated building (optional)
 * @property {mongoose.Schema.Types.ObjectId} created_by - Reference to user who created the event (required)
 * @property {Date} created_at - Date when the event was created (default: current time)
 */
const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Event name is required'],
    minlength: [1, 'Event name cannot be empty'],
  },
  date: {
    type: Date,
    required: [true, 'Event date is required'],
  },
  time: {
    type: String,
    required: [true, 'Event time is required'],
  },
  location: {
    type: String,
    required: [true, 'Event location is required'],
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
  },
  images: {
    type: [String],  // Array of image URLs
    validate: {
      validator: function (value) {
        return Array.isArray(value) && value.length <= 10;  // Limit to 10 images
      },
      message: 'Only up to 10 images can be associated with the event.',
    },
  },
  building_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Building',
    default: null, // Building ID will be optional for now
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Event model for managing campus events
 * @type {mongoose.Model}
 */
const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
