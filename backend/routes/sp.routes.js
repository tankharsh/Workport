const { body } = require("express-validator");
const spController = require("../controllers/sp.controller");
const authmiddleware = require("../middlewares/auth.middleware");
const router = require("express").Router();


// Route to register a new Service Provider
router.post(
    "/sp_register",
    [
        body("sp_name").notEmpty().withMessage("Service Provider name is required"),
        body("sp_email").isEmail().withMessage("Valid email is required"),
        body("sp_contact")
            .isLength({ min: 10, max: 10 })
            .withMessage("Contact number must be 10 digits"),
        body("sp_shop_name").notEmpty().withMessage("Shop name is required"),
        body("sp_category").notEmpty().withMessage("Category is required"),
        body("sp_block_no").notEmpty().withMessage("Block number is required"),
        body("sp_area").notEmpty().withMessage("Area is required"),
        body("sp_pincode").isLength({ min: 6, max: 6 }).withMessage("Pincode must be 6 digits"),
        body("sp_city").notEmpty().withMessage("City is required"),
        body("sp_password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    ],
    spController.registerSP
);

// Route for Service Provider Login
router.post(
    "/sp_login",
    [
        body("sp_email").isEmail().withMessage("Valid email is required"),
        body("sp_password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    ],
    spController.loginSP
);

// Update Service Provider
router.put("/update/:id", spController.updateServiceProvider);

// Delete Service Provider
router.delete("/delete/:id", spController.deleteServiceProvider); 


router.get("/sp_profile", authmiddleware.authServiceProvider, spController.getProfile);
router.get("/sp_logout", authmiddleware.authServiceProvider, spController.logoutSP);
module.exports = router;
