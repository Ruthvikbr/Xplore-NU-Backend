const mongoose = require('mongoose');

// Event Schema
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
        return Array.isArray(value) && value.length <= 10;  // Limit to 6 images
      },
      message: 'Only up to 10 images can be associated with the event.',
    },
  },
  building_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Building',
    default: null, // Building ID will be optional for now
  },
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
