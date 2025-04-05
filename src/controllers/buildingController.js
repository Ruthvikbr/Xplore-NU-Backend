/**
 * @module controllers/buildingController
 * @description Handles operations related to campus buildings and points of interest
 */

const Building = require('../models/building');

/**
 * Creates multiple building entries (admin only)
 * @async
 * @function createBuildings
 * @param {Object} req - Express request object
 * @param {Object} req.user - User object from auth middleware
 * @param {string} req.user.role - User role (must be 'admin')
 * @param {Object} req.body - Request body
 * @param {Array<Object>} req.body.buildings - Array of building objects to create
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with created buildings or error message
 */
exports.createBuildings = async (req, res) => {
  try {
    const userRole = req.user.role;

    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Only admin users can create buildings.' });
    }

    const buildings = req.body.buildings;

    if (!Array.isArray(buildings) || buildings.length === 0) {
      return res.status(400).json({ message: 'Please provide at least one building.' });
    }

    const newBuildings = buildings.map(b => ({
      ...b,
      pointId: b.pointId || require('crypto').randomUUID()
    }));

    const result = await Building.insertMany(newBuildings);
    res.status(201).json({ message: "Buildings created successfully", buildings: result });
  } catch (error) {
    console.error("Error creating buildings:", error);
    res.status(500).json({ message: "Error creating buildings", error: error.message });
  }
};

/**
 * Retrieves all points of interest in ordered sequence
 * @async
 * @function getPOIs
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with array of POI objects sorted by order field
 */
exports.getPOIs = async (req, res) => {
  try {
    const pois = await Building.find({})
      .select('building_name lat long pointId order description images')
      .sort({ order: 1 });

    res.status(200).json({ count: pois.length, pois });
  } catch (error) {
    console.error("Error fetching POIs:", error);
    res.status(500).json({ message: "Error fetching POIs", error: error.message });
  }
};