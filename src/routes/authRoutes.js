const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser, forgotPassword, verifyOtp, resendOtp, resetPassword } = require("../controllers/authController");
const { getAllUsers } = require("../controllers/authController");
const { authenticateJWT } =require( "../middleware/authMiddlewares")

// Define routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forgot_password", forgotPassword);
router.post("/verify_otp", verifyOtp);
router.post("/resend_otp", resendOtp);
router.post("/reset_password", resetPassword);

// Get all users route
router.get("/users", getAllUsers);
//example of how to use middleware in protected routes while logged in 
router.get('/protected', authenticateJWT, (req, res) => {
    res.json({ message: 'You have access!', user: req.user });
});


module.exports = router;
