const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const ServiceProvider = require("../models/sp.model");
const Service = require("../models/services.model");
const { blacklistToken } = require("../services/tokenService");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const multer = require("multer");
const upload = require("../multer/multer");
const path = require("path");


const JWT_SECRET = process.env.JWT_SECRET;

// Register a Service Provider
// exports.registerSP = async (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     console.log(req.files); // Debugging: Check the files received

//     const {
//         sp_name,
//         sp_email,
//         sp_contact,
//         sp_shop_name,
//         sp_category,
//         sp_block_no,
//         sp_area,
//         sp_pincode,
//         sp_city,
//         sp_password,
//     } = req.body;

//     try {
//         // Check if files were uploaded
//         if (!req.files || !req.files["sp_shop_img"] || !req.files["sp_shop_banner_img"]) {
//             return res.status(400).json({ message: "Shop image and banner image are required" });
//         }

//         const hashedPassword = await ServiceProvider.hashpassword(sp_password);
//         const sp = await ServiceProvider.create({
//             sp_name,
//             sp_email,
//             sp_contact,
//             sp_shop_name,
//             sp_category,
//             sp_block_no,
//             sp_area,
//             sp_pincode,
//             sp_city,
//             sp_password: hashedPassword,
//             sp_shop_img: req.files["sp_shop_img"][0].path, // Path to the uploaded shop image
//             sp_shop_banner_img: req.files["sp_shop_banner_img"][0].path, // Path to the uploaded banner image
//         });

//         const token = jwt.sign({ id: sp._id, sp_name: sp.sp_name, sp_email: sp.sp_email }, process.env.JWT_SECRET, { expiresIn: "1h" });

//         res.status(201).json({
//             message: "Service Provider registered successfully",
//             serviceProvider: sp,
//             token,
//         });
//     } catch (error) {
//         if (error.code === 11000) {
//             return res.status(400).json({ message: "Email already exists" });
//         }
//         next(error);
//     }
// };

exports.registerSP = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    console.log(req.files); // Debugging: Check the files received

    const {
        sp_name,
        sp_email,
        sp_contact,
        sp_shop_name,
        sp_block_no,
        sp_area,
        sp_pincode,
        sp_city,
        sp_password,
        sp_category,  // ✅ New field: Expecting an array of categories
        services   // ✅ New field: Expecting an array of service ObjectIds
    } = req.body;

    try {
        // Check if files were uploaded
        if (!req.files || !req.files["sp_shop_img"] || !req.files["sp_shop_banner_img"]) {
            return res.status(400).json({ message: "Shop image and banner image are required" });
        }

        // Hash the password before saving
        const hashedPassword = await ServiceProvider.hashpassword(sp_password);

        // Convert `category` and `services` from string to JSON (if sent as stringified data)
        const parsedCategories = sp_category ? JSON.parse(sp_category) : [];
        const parsedServices = services ? JSON.parse(services) : [];

        const sp = await ServiceProvider.create({
            sp_name,
            sp_email,
            sp_contact,
            sp_shop_name,
            sp_block_no,
            sp_area,
            sp_pincode,
            sp_city,
            sp_password: hashedPassword,
            sp_shop_img: req.files["sp_shop_img"][0].path, // Path to the uploaded shop image
            sp_shop_banner_img: req.files["sp_shop_banner_img"][0].path, // Path to the uploaded banner image
            sp_category: parsedCategories,  // ✅ Storing category references
            services: parsedServices     // ✅ Storing service references
        });

        const token = jwt.sign({ id: sp._id, sp_name: sp.sp_name, sp_email: sp.sp_email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({
            message: "Service Provider registered successfully",
            serviceProvider: sp,
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

// Get all Service Providers
exports.getAllSP = async (req, res) => {
    try {
      const SP = await ServiceProvider.find(); // Fetch all service providers from DB
      res.json(SP); // Send the users as JSON response
    } catch (err) {
      res.status(500).json({ message: 'Error fetching ServiceProvider', error: err });
    }
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

// Update Service Provider
exports.updateServiceProvider = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Service Provider ID" });
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No fields provided for update" });
        }

        if (updates.sp_password) {
            updates.sp_password = await bcrypt.hash(updates.sp_password, 10);
        }

        const updatedProvider = await ServiceProvider.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedProvider) {
            return res.status(404).json({ message: "Service Provider not found" });
        }

        res.json({ message: "Updated successfully", data: updatedProvider });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ message: "Error updating service provider", error: error.message });
    }
};


// Delete Service Provider
exports.deleteServiceProvider = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProvider = await ServiceProvider.findByIdAndDelete(id);

        if (!deletedProvider) {
            return res.status(404).json({ message: "Service Provider not found" });
        }

        res.json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting service provider", error });
    }
};


// Get all service providers with categories and services
  exports.getAllServiceProviders = async (req, res) => {
    try {
        // Fetch all service providers and populate categories
        const providers = await ServiceProvider.find()
            .populate("category.categoryId", "name description categoryImage") // Populate Category model fields
            .lean(); // Convert to plain JS objects

        // Fetch all services
        const services = await Service.find().lean();

        // Format the response
        const formattedProviders = providers.map((provider) => ({
            _id: provider._id,
            sp_name: provider.sp_name,
            sp_email: provider.sp_email,
            sp_contact: provider.sp_contact,
            sp_shop_name: provider.sp_shop_name,
            sp_block_no: provider.sp_block_no,
            sp_area: provider.sp_area,
            sp_pincode: provider.sp_pincode,
            sp_city: provider.sp_city,
            sp_shop_img: provider.sp_shop_img,
            sp_shop_banner_img: provider.sp_shop_banner_img,
            category: (provider.category || []).map((cat) => ({
                categoryId: cat.categoryId?._id || cat.categoryId, // Handle populated or direct ID
                Category_Name: cat.categoryId?.name || cat.Category_Name, // Use populated or stored name
                Category_Description: cat.categoryId?.Category_Description || "", // Ensure description exists
                Category_Image: cat.categoryId?.Category_Image || "", // Ensure image exists
            })),
            services: services
                .filter((service) => service.service_provider?.toString() === provider._id.toString())
                .map((service) => ({
                    _id: service._id,
                    categoryId: service.categoryId,
                    services_name: service.services_name,
                    services_description: service.services_description,
                    services_price: service.services_price,
                    services_duration: service.services_duration,
                    services_img: service.services_img,
                })),
        }));

        res.status(200).json({ providers: formattedProviders });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



// Get particular service provider id  with categories and services 

exports.getServiceProviderById = async (req, res) => {
    try {
        const { id } = req.params; // Get ID from URL params

        // Find service provider by ID and populate categories
        const provider = await ServiceProvider.findById(id)
            .populate("category.categoryId", "name description categoryImage") // Populate category details
            .lean(); // Convert to plain JS object

        if (!provider) {
            return res.status(404).json({ message: "Service Provider not found" });
        }

        // Fetch all services for this provider
        const services = await Service.find({ service_provider: id }).lean();

        // Format response
        const formattedProvider = {
            _id: provider._id,
            sp_name: provider.sp_name,
            sp_email: provider.sp_email,
            sp_contact: provider.sp_contact,
            sp_shop_name: provider.sp_shop_name,
            sp_block_no: provider.sp_block_no,
            sp_area: provider.sp_area,
            sp_pincode: provider.sp_pincode,
            sp_city: provider.sp_city,
            sp_shop_img: provider.sp_shop_img,
            sp_shop_banner_img: provider.sp_shop_banner_img,
            category: (provider.category || []).map((cat) => ({
                categoryId: cat.categoryId?._id || cat.categoryId,
                Category_Name: cat.categoryId?.name || cat.categoryName,
                Category_Description: cat.categoryId?.description || "",
                Category_Image: cat.categoryId?.categoryImage || "",
            })),
            services: services.map((service) => ({
                _id: service._id,
                categoryId: service.categoryId,
                services_name: service.services_name,
                services_description: service.services_description,
                services_price: service.services_price,
                services_duration: service.services_duration,
                services_img: service.services_img,
            })),
        };

        res.status(200).json({ provider: formattedProvider });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
