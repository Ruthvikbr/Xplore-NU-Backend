const express = require('express');
const router = express.Router();
const { createEvent, deleteEvent } = require('../controllers/eventController');
const { authenticateJWT } = require('../middleware/authMiddlewares');

// Create Event - protected with authentication middleware
router.post('/', authenticateJWT, createEvent);

module.exports = router;
