const { validationResult } = require("express-validator");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const blackListToken = require("../models/blackListToken.model");
const JWT_SECRET = process.env.JWT_SECRET;
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

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

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
      const users = await userModel.find(); // Fetch all users from DB
      res.json(users); // Send the users as JSON response
    } catch (err) {
      res.status(500).json({ message: 'Error fetching users', error: err });
    }
  };


// Update Service Provider
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Service Provider ID" });
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No fields provided for update" });
        }

        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        const updatedUser = await userModel.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "Service Provider not found" });
        }

        res.json({ message: "Updated successfully", data: updatedUser });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ message: "Error updating service provider", error: error.message });
    }
};


// Delete Service Provider
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await userModel.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "Service Provider not found" });
        }

        res.json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting service provider", error });
    }
};

