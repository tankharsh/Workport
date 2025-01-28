const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const ServiceProvider = require('../models/sp.model');
const { blacklistToken } = require('../services/tokenService'); 

const JWT_SECRET = process.env.JWT_SECRET;

// Register a Service Provider
module.exports.registerSP = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { sp_name, sp_email, sp_contact, sp_shop_name, sp_category, sp_block_no, sp_area, sp_pincode, sp_city, sp_password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await ServiceProvider.hashpassword(sp_password);

        // Create the service provider
        const sp = await ServiceProvider.create({
            sp_name,
            sp_email,
            sp_contact,
            sp_shop_name,
            sp_category,
            sp_block_no,
            sp_area,
            sp_pincode,
            sp_city,
            sp_password: hashedPassword,
        });

        // Generate JWT token
        const token = jwt.sign(
            { id: sp._id, sp_name: sp.sp_name, sp_email: sp.sp_email },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Send response
        res.status(201).json({
            message: "Service Provider registered successfully",
            serviceProvider: {
                id: sp._id,
                sp_name: sp.sp_name,
                sp_email: sp.sp_email,
                sp_contact: sp.sp_contact,
                sp_shop_name: sp.sp_shop_name,
                sp_category: sp.sp_category,
                sp_block_no: sp.sp_block_no,
                sp_area: sp.sp_area,
                sp_pincode: sp.sp_pincode,
                sp_city: sp.sp_city,
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

// Service Provider Login
module.exports.loginSP = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { sp_email, sp_password } = req.body;

    try {
        const sp = await ServiceProvider.findOne({ sp_email }).select('+sp_password');
        if (!sp) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await sp.comparePassword(sp_password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = sp.generateAuthToken();
        res.status(200).json({
            message: "Login successful",
            serviceProvider: {
                id: sp._id,
                sp_name: sp.sp_name,
                sp_email: sp.sp_email,
                sp_contact: sp.sp_contact,
                sp_shop_name: sp.sp_shop_name,
                sp_category: sp.sp_category,
                sp_block_no: sp.sp_block_no,
                sp_area: sp.sp_area,
                sp_pincode: sp.sp_pincode,
                sp_city: sp.sp_city,
            },
            token,
        });
    } catch (error) {
        next(error);
    }
};

// Get Service Provider Profile
module.exports.getProfile = (req, res) => {
    const serviceProvider = req.serviceProvider;

    if (!serviceProvider) {
        return res.status(404).json({ message: "Service Provider not found" });
    }

    res.status(200).json({
        message: "Service Provider profile retrieved successfully",
        serviceProvider, // Sends the entire object
    });
};

// Service Provider Logout
module.exports.logoutSP = async (req, res) => {
    res.clearCookie("token");
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    // Use the blacklistToken function to check and insert the token into the blacklist
    const result = await blacklistToken(token);  // result will have status and message
    
    if (result.status === "error") {
        return res.status(500).json({ message: result.message });
    }

    res.status(200).json({ message: result.message });
};