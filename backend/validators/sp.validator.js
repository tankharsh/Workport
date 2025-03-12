const { body, validationResult } = require("express-validator");

exports.validateRegisterSP = [
    body("spName").notEmpty().withMessage("Service Provider name is required"),
    body("spEmail").isEmail().withMessage("Valid email is required"),
    body("spContact").isLength({ min: 10, max: 10 }).withMessage("Contact must be 10 digits"),
    body("spShopName").notEmpty().withMessage("Shop name is required"),
    body("spCategories").notEmpty().withMessage("Categories are required"),
    body("spBlockNo").notEmpty().withMessage("Block number is required"),
    body("spArea").notEmpty().withMessage("Area is required"),
    body("spPincode").isLength({ min: 6, max: 6 }).withMessage("Pincode must be 6 digits"),
    body("spCity").notEmpty().withMessage("City is required"),
    body("spPassword").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

// exports.validateLoginSP = [
//     body("sp_email").isEmail().withMessage("Valid email is required"),
//     body("sp_password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
// ];

exports.validateLoginSP = [
    body("spEmail").isEmail().withMessage("Valid email is required"),
    body("spPassword").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];