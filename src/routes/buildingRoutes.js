const express = require('express');
const router = express.Router();
const { createBuildings, getPOIs } = require('../controllers/buildingController');
const { authenticateJWT } = require('../middleware/authMiddlewares');

router.post('/', authenticateJWT, createBuildings); // Admin only
router.get('/pois', authenticateJWT, getPOIs);

module.exports = router;