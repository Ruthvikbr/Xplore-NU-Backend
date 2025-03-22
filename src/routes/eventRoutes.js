const express = require('express');
const router = express.Router();
const { createEvent, deleteEvent, getUpcomingEvents, getEventById, updateEvent } = require('../controllers/eventController');
const { authenticateJWT } = require('../middleware/authMiddlewares');

// Create Event - protected with authentication middleware
router.post('/', authenticateJWT, createEvent);

// Get upcoming events - protected with authentication middleware
router.get('/upcoming', authenticateJWT, getUpcomingEvents);

// Get event by ID - protected with authentication middleware
router.get('/:id', authenticateJWT, getEventById);

// Update event by ID - protected with authentication middleware
router.patch('/:id', authenticateJWT, updateEvent);

module.exports = router;
