/**
 * @module routes/eventRoutes
 * @description Routes for managing campus events
 */

const express = require('express');
const router = express.Router();
const { createEvent, deleteEvent, getUpcomingEvents, getEventById, updateEvent } = require('../controllers/eventController');
const { authenticateJWT } = require('../middleware/authMiddlewares');

/**
 * POST /event - Create a new event (admin only)
 * @name CreateEvent
 * @route {POST} /event
 * @authentication This route requires JWT authentication
 * @bodyparam {string} name - Event name
 * @bodyparam {string} date - Event date
 * @bodyparam {string} time - Event time
 * @bodyparam {string} location - Event location
 * @bodyparam {string} description - Event description
 * @bodyparam {Array<string>} images - Array of image URLs for the event
 * @bodyparam {string} [building_id] - Optional ID of associated building
 */
router.post('/', authenticateJWT, createEvent);

/**
 * GET /event/upcoming - Get all upcoming events
 * @name GetUpcomingEvents
 * @route {GET} /event/upcoming
 */
router.get('/upcoming', authenticateJWT, getUpcomingEvents);

/**
 * GET /event/:id - Get event by ID
 * @name GetEventById
 * @route {GET} /event/:id
 * @routeparam {string} id - Event ID to retrieve
 */
router.get('/:id', authenticateJWT, getEventById);

/**
 * PUT /event/:id - Update an existing event (admin only)
 * @name UpdateEvent
 * @route {PUT} /event/:id
 * @authentication This route requires JWT authentication
 * @routeparam {string} id - Event ID to update
 * @bodyparam {string} [name] - Updated event name
 * @bodyparam {string} [date] - Updated event date
 * @bodyparam {string} [time] - Updated event time
 * @bodyparam {string} [location] - Updated event location
 * @bodyparam {string} [description] - Updated event description
 * @bodyparam {Array<string>} [images] - Updated array of image URLs
 * @bodyparam {string} [building_id] - Updated ID of associated building
 */
router.put('/:id', authenticateJWT, updateEvent);

module.exports = router;
