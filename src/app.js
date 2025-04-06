/**
 * @module app
 * @description Main Express application setup and configuration
 */

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes"); 
const eventRoutes = require("./routes/eventRoutes");
const buildingRoutes = require("./routes/buildingRoutes");
require("dotenv").config();

/**
 * Express application instance
 * @type {express.Application}
 */
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/auth", authRoutes); 
app.use("/event", eventRoutes);
app.use("/building", buildingRoutes);

module.exports = app;