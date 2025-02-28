const express = require('express');
const router = express.Router();
const { createEvent, deleteEvent } = require('../controllers/eventController');

// Create Event
router.post('/', createEvent);

// Delete Event
router.delete('/:event_id', deleteEvent);

module.exports = router;
