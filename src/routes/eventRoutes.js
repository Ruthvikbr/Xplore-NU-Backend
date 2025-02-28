const express = require('express');
const router = express.Router();
const { createEvent, deleteEvent } = require('../controllers/eventController');

// Create Event
router.post('/', createEvent);



module.exports = router;
