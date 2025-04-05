/**
 * @module server
 * @description Server entry point that initializes the application
 */

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Start HTTP server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
