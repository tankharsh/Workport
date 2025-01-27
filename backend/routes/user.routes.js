const userController = require("../controllers/user.controller");
const express = require("express");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "secret-000";
const userControllers = require('../controllers/user.controller');
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
    userControllers.loginUser
);

router.get("/profile", authmiddleware.authUser, userControllers.getUserProfile);


module.exports = router;
