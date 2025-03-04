const userController = require("../controllers/user.controller");
const { body } = require("express-validator");
const router = require("express").Router();
const authmiddleware = require("../middlewares/auth.middleware");



router.post(
    "/register",
    [
        body("username").notEmpty().withMessage("Username is required"),
        body("useremail").isEmail().withMessage("Valid email is required"),
        body("usercontactno")
            .isLength({ min: 10, max: 10 })
            .withMessage("Contact number must be 10 digits"),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
       // body("socketId").notEmpty().withMessage("Socket ID is required"),
    ],
    userController.registerUser
);


router.post(
    "/login",
    [
        body("useremail").isEmail().withMessage("Valid email is required"),
        body("password").notEmpty().withMessage("Password is required"),
    ],
    userController.loginUser
);


// Update Service Provider
router.put("/updateUser/:id", userController.updateUser);

// Delete Service Provider
router.delete("/deleteUser/:id", userController.deleteUser); 

// Get user profile
router.get("/profile", authmiddleware.authUser, userController.getUserProfile);

//Get all users
router.get('/', userController.getAllUsers);

// Logout User
router.get("/logout", authmiddleware.authUser, userController.logoutUser);


module.exports = router;
