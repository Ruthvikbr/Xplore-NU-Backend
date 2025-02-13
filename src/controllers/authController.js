const User = require("../models/user");
const hashPassword = require("../utils/hashPassword");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { blacklistedTokens } =require( "../middleware/authMiddlewares");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const otpStore = new Map(); // Store OTPs temporarily

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

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.logoutUser = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        
        const token = authHeader;

        blacklistedTokens.add(token); 
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Generate OTP and Send Email
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User with this email does not exist." });
        }

        const otp = crypto.randomInt(100000, 999999).toString(); // Generate 6-digit OTP
        otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 }); // Store OTP for 5 minutes

        // Send OTP to email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is ${otp}. It is valid for 5 minutes.`
        });

        res.status(200).json({ message: "OTP sent to your email." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error sending OTP. Try again later." });
    }
};