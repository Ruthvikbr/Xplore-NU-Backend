/**
 * @module routes/buildingRoutes
 * @description Routes for building and points of interest operations
 */

const express = require('express');
const router = express.Router();
const { createBuildings, getPOIs } = require('../controllers/buildingController');
const { authenticateJWT } = require('../middleware/authMiddlewares');

/**
 * POST /building - Create new building entries (admin only)
 * @name CreateBuildings
 * @route {POST} /building
 * @authentication This route requires JWT authentication
 * @bodyparam {Array<Object>} buildings - Array of building objects to create
 */
router.post('/', authenticateJWT, createBuildings);

/**
 * GET /building/pois - Get all points of interest
 * @name GetPOIs
 * @route {GET} /building/pois
 */
router.get('/pois', getPOIs);

module.exports = router;