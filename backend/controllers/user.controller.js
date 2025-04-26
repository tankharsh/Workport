const { validationResult } = require("express-validator");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const blackListToken = require("../models/blackListToken.model");
const JWT_SECRET = process.env.JWT_SECRET;
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const { createVerification } = require('../services/verification.service');

// Register a new user
module.exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userName, userEmail, userContact, userAddress, password } = req.body;

    try {
        // Check if user already exists by email
        const existingUserByEmail = await userModel.findOne({ userEmail });
        if (existingUserByEmail) {
            return res.status(400).json({ message: "Email already exists", field: "userEmail" });
        }

        // Check if user already exists by contact number
        const existingUserByContact = await userModel.findOne({ userContact });
        if (existingUserByContact) {
            return res.status(400).json({ message: "Contact number already exists", field: "userContact" });
        }

        // Hash the password
        const hashedPassword = await userModel.hashpassword(password);

        // Create the user with isVerified set to false
        const user = await userModel.create({
            userName,
            userEmail,
            userContact,
            userAddress,
            password: hashedPassword,
            isVerified: false,
            // socketId, // Commented out socketId as per original requirement
        });

        // Send verification email
        const verificationResult = await createVerification(userEmail, false);

        if (!verificationResult.success) {
            // If email sending fails, still create the account but inform the user
            return res.status(201).json({
                message: "User registered successfully, but verification email could not be sent. Please try again later.",
                user: {
                    id: user._id,
                    userName: user.userName,
                    userEmail: user.userEmail,
                    userContact: user.userContact,
                    userAddress: user.userAddress,
                },
                requiresVerification: true
            });
        }

        // Send response
        res.status(201).json({
            message: "User registered successfully. Please check your email for verification.",
            user: {
                id: user._id,
                userName: user.userName,
                userEmail: user.userEmail,
                userContact: user.userContact,
                userAddress: user.userAddress,
            },
            requiresVerification: true
        });
    } catch (error) {
        if (error.code === 11000) {
            // Check which field caused the duplicate key error
            const keyPattern = error.keyPattern;
            if (keyPattern && keyPattern.userEmail) {
                return res.status(400).json({ message: "Email already exists", field: "userEmail" });
            } else if (keyPattern && keyPattern.userContact) {
                return res.status(400).json({ message: "Contact number already exists", field: "userContact" });
            } else {
                return res.status(400).json({ message: "User with these details already exists" });
            }
        }
        console.error("Registration error:", error);
        next(error);
    }
};

// User login
module.exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userEmail, password } = req.body;

    try {
        // Check if the user exists
        const user = await userModel.findOne({ userEmail }).select("+password");
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check if email is verified
        if (!user.isVerified) {
            // Send a new verification email
            await createVerification(userEmail, false);

            return res.status(403).json({
                message: "Email not verified. A new verification email has been sent.",
                requiresVerification: true,
                userEmail: user.userEmail
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, userName: user.userName, userEmail: user.userEmail },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Send success response
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                userName: user.userName,
                userEmail: user.userEmail,
                userContact: user.userContact,
                userAddress: user.userAddress,
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

// Verify user email
exports.verifyEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await userModel.findOne({ userEmail: email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user verification status
        user.isVerified = true;
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, userName: user.userName, userEmail: user.userEmail },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Email verified successfully",
            token,
            user: {
                id: user._id,
                userName: user.userName,
                userEmail: user.userEmail,
                userContact: user.userContact,
            },
        });
    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ message: "Error verifying email", error: error.message });
    }
};

