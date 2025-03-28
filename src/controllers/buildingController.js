const Building = require('../models/building');

// Create multiple buildings (admin only)
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

// Fetch ordered POIs (public endpoint)
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