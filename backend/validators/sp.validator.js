
const { body , validationResult} = require("express-validator");

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

// exports.validateLoginSP = [
//     body("sp_email").isEmail().withMessage("Valid email is required"),
//     body("sp_password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
// ];

exports.validateLoginSP = [
    // Validate sp_email (Must be a valid email)
    body("sp_email").isEmail().withMessage("Valid email is required"),
  
    // Validate sp_password (Must be at least 6 characters long)
    body("sp_password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  
    // Error handler for validation results
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // If validation errors are found, send them in the response
        return res.status(400).json({ errors: errors.array() });
      }
      next(); // Proceed to the next middleware (login controller)
    }
  ];