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
              message: "Registration was unsuccessful",
              error:
                "Missing required fields. Please ensure 'firstName', 'lastName', 'email', 'password' are provided.",
            });
        }

        // Password validation
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ 
              message: "Registration was unsuccessful",
              error:
                "Password must be at least 8 characters long, contain at least one letter, one number, and one special character.",      
            });
        }

        // Role based on the email entered
        const role = email.endsWith("@northeastern.edu") ? "student" : "visitor";

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
              message: "Registration was unsuccessful",
              error: `You are already registered. Please try logging in instead.`,
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

        const user = await User.findOne({ email });

        // Generate access token
        const accessToken = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        
        // Generate refresh token
        const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        
        // Store refresh token in database
        user.refreshToken = refreshToken;
        await user.save();

        res.status(201).json({ 
            message: "Account created successfully!", 
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });
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

        // Generate JWT access token (short-lived)
        const accessToken = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        
        // Generate refresh token (long-lived)
        const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        
        // Store refresh token in database
        user.refreshToken = refreshToken;
        await user.save();

        res.status(200).json({
            message: "Login successful",
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
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

        // Add the access token to blacklist
        blacklistedTokens.add(token);
        
        // Clear refresh token in database if user ID is available
        if (req.user && req.user.userId) {
            await User.findByIdAndUpdate(req.user.userId, { refreshToken: null });
        }
        
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Refresh Token - generate new access token using refresh token
exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        // Get the old access token from authorization header
        const oldAccessToken = req.headers.authorization;

        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token is required" });
        }

        // Verify the refresh token
        let decoded;
        try {
            decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({ message: "Invalid or expired refresh token" });
        }

        // Find the user with this refresh token
        const user = await User.findOne({ 
            _id: decoded.userId,
            refreshToken: refreshToken 
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid refresh token or user not found" });
        }

        // Generate a new access token
        const accessToken = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Invalidate the old access token if it exists
        if (oldAccessToken) {
            blacklistedTokens.add(oldAccessToken);
        }

        res.status(200).json({
            message: "Token refreshed successfully",
            accessToken
        });
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

// Verify OTP
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!otpStore.has(email)) {
            return res.status(400).json({ message: "No OTP request found. Please request OTP again." });
        }

        const storedOtpData = otpStore.get(email);

        if (Date.now() > storedOtpData.expiresAt) {
            otpStore.delete(email);
            return res.status(400).json({ message: "OTP expired. Please request a new one." });
        }

        if (storedOtpData.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP. Please try again." });
        }

        // OTP is valid, allow user to reset password
        otpStore.delete(email);
        res.status(200).json({ message: "OTP verified successfully. You can now reset your password." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error verifying OTP." });
    }
};

// Resend OTP
exports.resendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!otpStore.has(email)) {
            return res.status(400).json({ message: "No OTP request found. Please request OTP again." });
        }

        const otp = crypto.randomInt(100000, 999999).toString(); // Generate new OTP
        otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 }); // Update OTP

        // Send OTP to email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Resend OTP for Password Reset",
            text: `Your new OTP for password reset is ${otp}. It is valid for 5 minutes.`
        });

        res.status(200).json({ message: "New OTP sent to your email." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error resending OTP. Try again later." });
    }
};

// Reset Password after OTP verification
exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User with this email does not exist." });
        }

        const hashedPassword = await hashPassword(newPassword);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password reset successful. You can now log in." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error resetting password." });
    }
};