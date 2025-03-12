const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const ServiceProvider = require("../models/sp.model");
const Service = require("../models/services.model");
const { blacklistToken } = require("../services/tokenService");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { createVerification } = require('../services/verification.service');



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
exports.registerSP = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // console.log(req.files); // Debugging: Check uploaded files

    const {
        spName,
        spEmail,
        spContact,
        spShopName,
        spBlockNo,
        spArea,
        spPincode,
        spCity,
        spDescription,
        spPassword,
        spCategories
    } = req.body;

    try {
        // Check if service provider already exists
        const existingSP = await ServiceProvider.findOne({ spEmail });
        if (existingSP) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Ensure required images are uploaded
        if (!req.files || !req.files["spShopImage"] || !req.files["spShopBannerImage"]) {
            return res.status(400).json({ message: "Shop image and banner image are required" });
        }

        // ✅ Hash the password before saving
        const hashedPassword = await bcrypt.hash(spPassword, 10);

        // ✅ Ensure category & services are arrays
        const parsedCategories = Array.isArray(spCategories) ? spCategories : JSON.parse(spCategories || "[]");

        // Get image filenames if uploaded
        const spShopImage = req.files["spShopImage"][0].filename;
        const spShopBannerImage = req.files["spShopBannerImage"][0].filename;

        const sp = await ServiceProvider.create({
            spName,
            spEmail,
            spContact,
            spShopName,
            spBlockNo,
            spArea,
            spPincode,
            spCity,
            spDescription,
            spPassword: hashedPassword,
            spShopImage,
            spShopBannerImage,
            spCategories: parsedCategories,
            isVerified: false
        });

        // Send verification email
        const verificationResult = await createVerification(spEmail, true);
        
        if (!verificationResult.success) {
            // If email sending fails, still create the account but inform the user
            return res.status(201).json({
                message: "Service Provider registered successfully, but verification email could not be sent. Please try again later.",
                serviceProvider: {
                    id: sp._id,
                    spName: sp.spName,
                    spEmail: sp.spEmail,
                },
                requiresVerification: true
            });
        }

        res.status(201).json({
            message: "Service Provider registered successfully. Please check your email for verification.",
            serviceProvider: {
                id: sp._id,
                spName: sp.spName,
                spEmail: sp.spEmail,
            },
            requiresVerification: true
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Email already exists" });
        }
        next(error);
    }
};


// Login Service Provider Function
module.exports.loginSP = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { spEmail, spPassword } = req.body;

    try {
        const sp = await ServiceProvider.findOne({ spEmail }).select("+spPassword");
        if (!sp) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await sp.comparePassword(spPassword);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check if email is verified
        if (!sp.isVerified) {
            // Send a new verification email
            await createVerification(spEmail, true);
            
            return res.status(403).json({ 
                message: "Email not verified. A new verification email has been sent.",
                requiresVerification: true,
                spEmail: sp.spEmail
            });
        }

        const token = jwt.sign(
            { id: sp._id, spEmail: sp.spEmail },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            serviceProvider: {
                id: sp._id,
                spName: sp.spName,
                spEmail: sp.spEmail,
                spContact: sp.spContact,
                spShopName: sp.spShopName,
                spCategories: sp.spCategories,
                spBlockNo: sp.spBlockNo,
                spArea: sp.spArea,
                spPincode: sp.spPincode,
                spCity: sp.spCity,
                spDescription: sp.spDescription,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



  

// Get Service Provider Profile
module.exports.getProfile = async (req, res) => {
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
// exports.updateServiceProvider = async (req, res) => {
//     try {
//         const { id } = req.params;
//         let updateData = { ...req.body };

//         // ✅ Parse category and services if they exist and are strings
//         try {
//             if (updateData.sp_category) {
//                 updateData.sp_category = JSON.parse(updateData.sp_category);
//             }
//             if (updateData.services) {
//                 updateData.services = JSON.parse(updateData.services);
//             }
//         } catch (error) {
//             console.error("❌ Error parsing JSON fields:", error);
//         }

//         // ✅ Process image uploads, keeping only filenames
//         if (req.files) {
//             if (req.files.sp_shop_img?.length > 0) {
//                 updateData.sp_shop_img = req.files.sp_shop_img[0].path.split("/").pop(); // Extract filename only
//             }
//             if (req.files.sp_shop_banner_img?.length > 0) {
//                 updateData.sp_shop_banner_img = req.files.sp_shop_banner_img[0].path.split("/").pop(); // Extract filename only
//             }
//         }

//         const updatedSP = await ServiceProvider.findByIdAndUpdate(id, updateData, { new: true });

//         if (!updatedSP) {
//             return res.status(404).json({ success: false, message: "Service Provider not found" });
//         }

//         return res.status(200).json({ success: true, message: "Profile updated successfully", data: updatedSP });
//     } catch (error) {
//         console.error("❌ Error updating service provider:", error);
//         return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
//     }
// };


exports.updateServiceProvider = async (req, res) => {
    try {
        const { id } = req.params;
        let updateData = { ...req.body };

        console.log("📥 Received Update Data:", updateData); // Debugging

        // ✅ Parse category and services if they exist and are strings
        try {
            if (updateData.spCategories) {
                const parsedCategories = JSON.parse(updateData.spCategories);
                // Ensure we have an array of ObjectIds
                updateData.spCategories = parsedCategories.map(catId => 
                    typeof catId === 'string' ? catId : catId.toString()
                );
                console.log("📌 Parsed Categories:", updateData.spCategories); // Debugging
            }
            if (updateData.services && updateData.services !== '') {
                updateData.services = JSON.parse(updateData.services);
                console.log("📌 Parsed Services:", updateData.services); // Debugging
            } else {
                // Remove empty services field to avoid casting errors
                delete updateData.services;
            }
        } catch (error) {
            console.error("❌ Error parsing JSON fields:", error);
            return res.status(400).json({ 
                success: false, 
                message: "Error parsing JSON fields", 
                error: error.message 
            });
        }

        // ✅ Process image uploads, keeping only filenames
        if (req.files) {
            if (req.files.spShopImage) {
                updateData.spShopImage = req.files.spShopImage[0].filename;
            }
            if (req.files.spShopBannerImage) {
                updateData.spShopBannerImage = req.files.spShopBannerImage[0].filename;
            }
        }

        // Remove any fields that shouldn't be updated directly
        ['_id', '__v', 'createdAt', 'updatedAt'].forEach(field => {
            delete updateData[field];
        });

        // If services is an empty string, remove it to avoid casting errors
        if (updateData.services === '') {
            delete updateData.services;
        }

        // 🔴 IMPORTANT: Update the service provider with proper category handling
        const updatedSP = await ServiceProvider.findByIdAndUpdate(
            id, 
            updateData,
            { 
                new: true,
                runValidators: true // This ensures the update follows schema validation
            }
        );

        if (!updatedSP) {
            return res.status(404).json({ success: false, message: "Service Provider not found" });
        }

        console.log("✅ Updated Service Provider:", updatedSP); // Debugging
        return res.status(200).json({ success: true, message: "Profile updated successfully", data: updatedSP });

    } catch (error) {
        console.error("❌ Error updating service provider:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
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
        const { category } = req.query;

        let filter = {};
        if (category) {
            filter.spCategories = category;
        }

        const providers = await ServiceProvider.find(filter)
            .populate("spCategories", "categoryName categoryDescription categoryImage")
            .populate("services", "serviceName serviceDescription servicePrice serviceDuration serviceImage")
            .lean();

        const formattedProviders = providers.map((provider) => ({
            _id: provider._id,
            spName: provider.spName,
            spEmail: provider.spEmail,
            spContact: provider.spContact,
            spShopName: provider.spShopName,
            spBlockNo: provider.spBlockNo,
            spArea: provider.spArea,
            spPincode: provider.spPincode,
            spCity: provider.spCity,
            spDescription: provider.spDescription,
            spShopImage: provider.spShopImage,
            spShopBannerImage: provider.spShopBannerImage,
            category: (provider.spCategories || []).map((cat) => ({
                categoryId: cat._id,
                categoryName: cat.categoryName,
                categoryDescription: cat.categoryDescription || "",
                categoryImage: cat.categoryImage || "",
            })),
            services: (provider.services || []).map((service) => ({
                _id: service._id,
                serviceName: service.serviceName,
                serviceDescription: service.serviceDescription,
                servicePrice: service.servicePrice,
                serviceDuration: service.serviceDuration,
                serviceImage: service.serviceImage,
            })),
        }));

        res.status(200).json({ providers: formattedProviders });
    } catch (error) {
        console.error("❌ Error fetching providers:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Get particular service provider id with categories and services 
exports.getServiceProviderById = async (req, res) => {
    try {
        const { id } = req.params;

        const provider = await ServiceProvider.findById(id)
            .populate("spCategories", "categoryName categoryDescription categoryImage")
            .populate("services", "serviceName serviceDescription servicePrice serviceDuration serviceImage")
            .lean();

        console.log("Service Provider: ", provider);

        if (!provider) {
            return res.status(404).json({ message: "Service Provider not found" });
        }

        console.log("Categories: ", provider.spCategories);
        console.log("Services: ", provider.services);

        const formattedProvider = {
            _id: provider._id,
            spName: provider.spName,
            spEmail: provider.spEmail,
            spContact: provider.spContact,
            spShopName: provider.spShopName,
            spBlockNo: provider.spBlockNo,
            spArea: provider.spArea,
            spPincode: provider.spPincode,
            spCity: provider.spCity,
            spDescription: provider.spDescription,
            spShopImage: provider.spShopImage,
            spShopBannerImage: provider.spShopBannerImage,
            category: (provider.spCategories || []).map((cat) => ({
                categoryId: cat._id,
                categoryName: cat.categoryName,
                categoryDescription: cat.categoryDescription,
                categoryImage: cat.categoryImage,
            })),
            services: (provider.services || []).map((service) => ({
                _id: service._id,
                serviceName: service.serviceName,
                serviceDescription: service.serviceDescription,
                servicePrice: service.servicePrice,
                serviceDuration: service.serviceDuration,
                serviceImage: service.serviceImage,
            })),
        };

        res.status(200).json({ provider: formattedProvider });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Verify service provider email
exports.verifyEmail = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        
        const sp = await ServiceProvider.findOne({ spEmail: email });
        
        if (!sp) {
            return res.status(404).json({ message: "Service Provider not found" });
        }
        
        // Update service provider verification status
        sp.isVerified = true;
        await sp.save();
        
        // Generate JWT token
        const token = jwt.sign(
            { id: sp._id, spEmail: sp.spEmail },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        
        res.status(200).json({
            message: "Email verified successfully",
            token,
            serviceProvider: {
                id: sp._id,
                spName: sp.spName,
                spEmail: sp.spEmail,
                spContact: sp.spContact,
                spShopName: sp.spShopName,
                spCategories: sp.spCategories,
                spBlockNo: sp.spBlockNo,
                spArea: sp.spArea,
                spPincode: sp.spPincode,
                spCity: sp.spCity,
                spDescription: sp.spDescription,
            },
        });
    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ message: "Error verifying email", error: error.message });
    }
};

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
    try {
        const { spId } = req.params;
        
        // Get the service provider
        const serviceProvider = await ServiceProvider.findById(spId);
        if (!serviceProvider) {
            return res.status(404).json({ message: "Service provider not found" });
        }

        // Get total services count
        const totalServices = serviceProvider.services ? serviceProvider.services.length : 0;

        // Get requests counts (you'll need to implement this based on your schema)
        const pendingRequests = 0; // Implement based on your schema
        const completedRequests = 0; // Implement based on your schema
        
        // Get average rating (you'll need to implement this based on your schema)
        const rating = 0; // Implement based on your schema

        res.status(200).json({
            totalServices,
            pendingRequests,
            completedRequests,
            rating
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ message: "Error fetching dashboard statistics", error: error.message });
    }
};

