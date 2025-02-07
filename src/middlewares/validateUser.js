const { body, validationResult } = require("express-validator");

const validateUser = [
    body("fullName").notEmpty().withMessage("Full Name is required"),
    body("email")
        .isEmail().withMessage("Invalid email format")
        .custom((value) => {
            if (value.endsWith("@northeastern.edu")) return true;
            if (!value.includes("@")) throw new Error("Invalid email format");
            return true;
        }),
    body("password")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role").isIn(["Student", "Visitor"]).withMessage("User type must be Student or Visitor"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        next();
    }
];

module.exports = validateUser;
