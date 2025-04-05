/**
 * @module routes/authRoutes
 * @description Routes for user authentication and account management
 */

const express = require("express");
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    logoutUser, 
    forgotPassword, 
    verifyOtp, 
    resendOtp, 
    resetPassword,
    refreshToken, 
    getAllUsers 
} = require("../controllers/authController");
const { authenticateJWT } =require( "../middleware/authMiddlewares")

/**
 * POST /auth/register - Register a new user
 * @name RegisterUser
 * @route {POST} /auth/register
 * @bodyparam {string} firstName - User's first name
 * @bodyparam {string} lastName - User's last name
 * @bodyparam {string} email - User's email address
 * @bodyparam {string} password - User's password
 */
router.post("/register", registerUser);

/**
 * POST /auth/login - Authenticate and login a user
 * @name LoginUser
 * @route {POST} /auth/login
 * @bodyparam {string} email - User's email address
 * @bodyparam {string} password - User's password
 */
router.post("/login", loginUser);

/**
 * POST /auth/logout - Logout a user and invalidate tokens
 * @name LogoutUser
 * @route {POST} /auth/logout
 * @headerparam {string} authorization - JWT access token
 */
router.post("/logout", logoutUser);

/**
 * POST /auth/forgot_password - Initiate password reset by sending OTP
 * @name ForgotPassword
 * @route {POST} /auth/forgot_password
 * @bodyparam {string} email - User's email address
 */
router.post("/forgot_password", forgotPassword);

/**
 * POST /auth/verify_otp - Verify password reset OTP
 * @name VerifyOTP
 * @route {POST} /auth/verify_otp
 * @bodyparam {string} email - User's email address
 * @bodyparam {string} otp - OTP received by email
 */
router.post("/verify_otp", verifyOtp);

/**
 * POST /auth/resend_otp - Resend password reset OTP
 * @name ResendOTP
 * @route {POST} /auth/resend_otp
 * @bodyparam {string} email - User's email address
 */
router.post("/resend_otp", resendOtp);

/**
 * POST /auth/reset_password - Set a new password after OTP verification
 * @name ResetPassword
 * @route {POST} /auth/reset_password
 * @bodyparam {string} email - User's email address
 * @bodyparam {string} newPassword - New password to set
 */
router.post("/reset_password", resetPassword);

/**
 * POST /auth/refreshtoken - Get a new access token using refresh token
 * @name RefreshToken
 * @route {POST} /auth/refreshtoken
 * @bodyparam {string} refreshToken - Valid refresh token
 * @headerparam {string} authorization - Current access token to invalidate
 */
router.post("/refreshtoken", refreshToken);

/**
 * GET /auth/users - Get all users (for admin purposes)
 * @name GetAllUsers
 * @route {GET} /auth/users
 */
router.get("/users", getAllUsers);

/**
 * GET /auth/protected - Example protected route requiring authentication
 * @name ProtectedRoute
 * @route {GET} /auth/protected
 * @headerparam {string} authorization - JWT access token
 */
router.get('/protected', authenticateJWT, (req, res) => {
    res.json({ message: 'You have access!', user: req.user });
});


module.exports = router;
