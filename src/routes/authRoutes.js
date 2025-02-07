const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/authController");
const { getAllUsers } = require("../controllers/authController");

// Define routes
router.post("/register", registerUser);

// Get all users route
router.get("/users", getAllUsers);


module.exports = router;
