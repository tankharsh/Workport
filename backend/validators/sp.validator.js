
const { body } = require("express-validator");

exports.validateRegisterSP = [
    body("sp_name").notEmpty().withMessage("Service Provider name is required"),
    body("sp_email").isEmail().withMessage("Valid email is required"),
    body("sp_contact").isLength({ min: 10, max: 10 }).withMessage("Contact must be 10 digits"),
    body("sp_shop_name").notEmpty().withMessage("Shop name is required"),
    body("sp_category").notEmpty().withMessage("Category is required"),
    body("sp_block_no").notEmpty().withMessage("Block number is required"),
    body("sp_area").notEmpty().withMessage("Area is required"),
    body("sp_pincode").isLength({ min: 6, max: 6 }).withMessage("Pincode must be 6 digits"),
    body("sp_city").notEmpty().withMessage("City is required"),
    body("sp_password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

exports.validateLoginSP = [
    body("sp_email").isEmail().withMessage("Valid email is required"),
    body("sp_password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];