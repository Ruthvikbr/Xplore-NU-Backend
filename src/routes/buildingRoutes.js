const express = require('express');
const router = express.Router();
const { createBuildings, getPOIs, getBuildingById } = require('../controllers/buildingController');
const { authenticateJWT } = require('../middleware/authMiddlewares');

router.post('/', authenticateJWT, createBuildings); // Admin only
router.get('/pois', authenticateJWT, getPOIs);
router.get('/:id', authenticateJWT, getBuildingById);

module.exports = router;