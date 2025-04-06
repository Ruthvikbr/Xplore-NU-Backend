/**
 * @module config/db
 * @description MongoDB database connection configuration
 */

const mongoose = require("mongoose");
require("dotenv").config();

/**
 * Establishes connection to MongoDB database
 * @async
 * @function connectDB
 * @returns {Promise<void>} Resolves when connection is established or rejects on error
 */
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
