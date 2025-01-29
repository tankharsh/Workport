const { validationResult } = require("express-validator");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const blackListToken = require("../models/blackListToken.model");
const JWT_SECRET = process.env.JWT_SECRET;

// Register a new user
module.exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, useremail, usercontactno, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await userModel.hashpassword(password);

        // Create the user
        const user = await userModel.create({
            username,
            useremail,
            usercontactno,
            password: hashedPassword,
            // socketId, // Commented out socketId as per original requirement
        });

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, username: user.username, useremail: user.useremail },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Send response
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                useremail: user.useremail,
                usercontactno: user.usercontactno,
                // socketId: user.socketId, // Commented out socketId as per original requirement
            },
            token,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Email already exists" });
        }
        next(error);
    }
};

// User login
module.exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { useremail, password } = req.body;

    try {
        // Check if the user exists
        const user = await userModel.findOne({ useremail }).select("+password");
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, username: user.username, useremail: user.useremail },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Send success response
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                useremail: user.useremail,
                // socketId: user.socketId, // Commented out socketId as per original requirement
            },
        });
    } catch (error) {
        next(error); // Pass any errors to the global error handler
    }
};

// Get user profile
module.exports.getUserProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(req.user);
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// User logout
module.exports.logoutUser = async (req, res) => {
    res.clearCookie("token");

    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    // Blacklist the token
    await blackListToken.create({ token });

    res.status(200).json({ message: "Logout successful" });
};
