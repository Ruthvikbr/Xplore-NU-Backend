/**
 * @module models/Building
 * @description Building model representing points of interest on the Northeastern campus
 */

const mongoose = require("mongoose");

/**
 * Building Schema definition
 * @typedef {Object} BuildingSchema
 * @property {String} building_name - Name of the building or point of interest (required)
 * @property {String} description - Detailed description of the building (required)
 * @property {String} pointId - Unique identifier for the point on the map (required, unique)
 * @property {Number} lat - Latitude coordinate of the building (required)
 * @property {Number} long - Longitude coordinate of the building (required)
 * @property {Number} order - Display order for the building in listings (required)
 * @property {String[]} images - Array of image URLs for the building (at least one required)
 */
const buildingSchema = new mongoose.Schema({
  building_name: { type: String, required: true },
  description: { type: String, required: true },
  pointId: { type: String, required: true, unique: true },
  lat: { type: Number, required: true },
  long: { type: Number, required: true },
  order: { type: Number, required: true },
  images: {
    type: [String],
    validate: {
      validator: function (value) {
        return Array.isArray(value) && value.length > 0;
      },
      message: "At least one image is required."
    }
  }
});

/**
 * Building model for managing campus points of interest
 * @type {mongoose.Model}
 */
module.exports = mongoose.model("Building", buildingSchema);
