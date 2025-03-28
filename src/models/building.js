const mongoose = require("mongoose");

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

module.exports = mongoose.model("Building", buildingSchema);
