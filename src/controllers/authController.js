const User = require("../models/user");
const hashPassword = require("../utils/hashPassword");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Check if all required fields are provided
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ 
                message: "Missing required fields. Please ensure 'firstName', 'lastName', 'email', 'password' are provided."
            });
        }

        // Password validation
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ 
                message: "Password must be at least 8 characters long, contain at least one letter, one number, and one special character."
            });
        }

        // Role based on the email enetered
        const role = email.endsWith("@northeastern.edu") ? "student" : "visitor";

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                message: `A user with the email address ${email} is already registered. Please try logging in instead.` 
            });
        }

        // Hash password before saving
        const hashedPassword = await hashPassword(password);

        // Create new user
        const newUser = new User({ 
            firstName, 
            lastName, 
            email, 
            password: hashedPassword, 
            role 
        });

        // Save the new user
        await newUser.save();

        res.status(201).json({ message: "Account created successfully!" });
    } catch (error) {
        // Log the error for debugging purposes
        console.error(error);

        // Detailed error responses based on the error type
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Validation error. Please ensure all fields are properly formatted.",
                error: error.message
            });
        }

        // Catch other potential errors (e.g., MongoDB connection issues, etc.)
        return res.status(500).json({
            message: "An error occurred while creating the account. Please try again later.",
            error: error.message
        });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};

