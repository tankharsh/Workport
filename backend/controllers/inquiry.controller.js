// const Inquiry = require("../models/inquiry.model");
// const { sendEmail } = require("../utils/emailService");


// // Send Inquiry
// exports.sendInquiry = async (req, res) => {
//     try {
//       const { user, service, serviceProvider } = req.body;
  
//       if (!user || !service || !serviceProvider) {
//         return res.status(400).json({ message: "Missing required fields" });
//       }
  
//       const newInquiry = new Inquiry({
//         user,
//         service,
//         serviceProvider,
//         status: "Pending",
//       });
  
//       await newInquiry.save();
//       res.status(201).json({ message: "Inquiry sent successfully", inquiry: newInquiry });
//     } catch (error) {
//       console.error("Inquiry Error:", error);
//       res.status(500).json({ message: "Server error" });
//     }
//   };
  

// exports.getInquiries = async (req, res) => {
//     try {
//         const { spId } = req.params;
//         const inquiries = await Inquiry.find({ serviceProvider: spId }).populate("user service");

//         res.status(200).json({ inquiries });
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };

// //get user inquiry
// exports.getUserInquiries = async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const inquiries = await Inquiry.find({ user: userId }).populate("service serviceProvider");

//         res.status(200).json({ inquiries });
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };



// // exports.updateInquiryStatus = async (req, res) => {
// //     try {
// //         const { status } = req.body;

// //         const inquiry = await Inquiry.findById(req.params.id)
// //             .populate({
// //                 path: "user",  // ✅ Correct reference (Mongoose model name)
// //                 select: "useremail"  // ✅ Selects only the email field
// //             })
// //             .populate("service", "name")
// //             .populate("serviceProvider", "name");

// //         if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });

// //         console.log("DEBUG: Inquiry Data:", inquiry); // Debugging

// //         if (!inquiry.user || !inquiry.user.useremail) {
// //             return res.status(400).json({ message: "User email is missing in the inquiry!" });
// //         }

// //         inquiry.status = status;
// //         await inquiry.save();

// //         console.log("Sending email to:", inquiry.user.useremail); 

// //         await sendEmail(
// //             inquiry.user.useremail,  // ✅ Uses correct field
// //             status,
// //             inquiry.service.name,
// //             inquiry.serviceProvider.name
// //         );

// //         // await sendEmail(
// //         //     "icity0849@gmail.com",  // Replace with a valid email address
// //         //     "Approved",               // Status message
// //         //     "Test Service",           // Service name
// //         //     "Test Service Provider"   // Service provider name
// //         // );

// //         res.status(200).json({ message: `Inquiry ${status} successfully`, inquiry });
// //     } catch (error) {
// //         console.error("Error updating inquiry status:", error.message);
// //         res.status(500).json({ message: "Server error", error: error.message });
// //     }
// // };



// // exports.updateInquiryStatus = async (req, res) => {
// //     try {
// //         const { status, date, time, message } = req.body; // ✅ Get date, time, message from request

// //         // ✅ Fetch inquiry with user email, service name, and service provider name
// //         const inquiry = await Inquiry.findById(req.params.id)
// //             .populate("user", "useremail username") // Fetch user email & name
// //             .populate("service", "services_name") // Fetch service name
// //             .populate("serviceProvider", "sp_name"); // Fetch service provider name

// //         if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });

// //         if (!inquiry.user || !inquiry.user.useremail) {
// //             return res.status(400).json({ message: "User email is missing in the inquiry!" });
// //         }

// //         // ✅ Update inquiry details
// //         inquiry.status = status;
// //         inquiry.date = date;
// //         inquiry.time = time;
// //         inquiry.message = message;
// //         await inquiry.save();

// //         console.log(`✅ Inquiry updated: ${inquiry._id} - Status: ${status}`);
// //         console.log(`📩 Sending email to: ${inquiry.user.useremail}`);

// //         // ✅ Pass all necessary details to the email function
// //         await sendEmail(
// //             inquiry.user.useremail,  // User email
// //             status,
// //             inquiry.service?.services_name || "Unknown Service",  // Service name (fallback if missing)
// //             inquiry.serviceProvider?.sp_name || "Unknown Provider",  // Service provider name (fallback if missing)
// //             date,
// //             time,
// //             message
// //         );

// //         res.status(200).json({ message: `Inquiry ${status} successfully`, inquiry });
// //     } catch (error) {
// //         console.error("❌ Error updating inquiry status:", error.message);
// //         res.status(500).json({ message: "Server error", error: error.message });
// //     }
// // };

// exports.updateInquiryStatus = async (req, res) => {
//     try {
//         const { status, date, time, message } = req.body; // ✅ Get date, time, message from request

//         const inquiry = await Inquiry.findById(req.params.id)
//             .populate("user", "useremail") // ✅ Fetch user email
//             .populate("service", "services_name") // ✅ Fetch service name
//             .populate("serviceProvider", "sp_name"); // ✅ Fetch service provider name

//         if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });

//         if (!inquiry.user || !inquiry.user.useremail) {
//             return res.status(400).json({ message: "User email is missing in the inquiry!" });
//         }

//         // ✅ Update inquiry details
//         inquiry.status = status;
//         inquiry.date = date;
//         inquiry.time = time;
//         inquiry.message = message;
//         await inquiry.save();

//         console.log("✅ Sending email to:", inquiry.user.useremail);

//         // ✅ Pass date, time, and message to sendEmail()
//         await sendEmail(
//             inquiry.user.useremail,  // User email
//             status,
//             inquiry.service?.services_name || "Unknown Service",  // Service name
//             inquiry.serviceProvider?.sp_name || "Unknown Provider",  // Service provider name
//             date || "Not Specified",  // ✅ Ensure date is passed
//             time || "Not Specified",  // ✅ Ensure time is passed
//             message || "No additional details"  // ✅ Ensure message is passed
//         );

//         res.status(200).json({ message: `Inquiry ${status} successfully`, inquiry });
//     } catch (error) {
//         console.error("❌ Error updating inquiry status:", error.message);
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };




// exports.deleteInquiry = async (req, res) => {
//     try {
//         const { id } = req.params;

//         // Find and delete the inquiry
//         const inquiry = await Inquiry.findByIdAndDelete(id);

//         if (!inquiry) {
//             return res.status(404).json({ message: "Inquiry not found" });
//         }

//         res.status(200).json({ message: "Inquiry deleted successfully", inquiry });
//     } catch (error) {
//         console.error("Error deleting inquiry:", error.message);
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };




const Inquiry = require("../models/inquiry.model");
const { sendEmail } = require("../utils/emailService");

// Send Inquiry
exports.sendInquiry = async (req, res) => {
    try {
        const { user, service, serviceProvider, userAddress, preferredDate, additionalInfo } = req.body;

        if (!user || !service || !serviceProvider) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const newInquiry = new Inquiry({
            user,
            service,
            serviceProvider,
            status: "Pending",
            userAddress,
            preferredDate,
            additionalInfo,
        });

        await newInquiry.save();
        res.status(201).json({ success: true, message: "Inquiry sent successfully", inquiry: newInquiry });
    } catch (error) {
        console.error("Inquiry Error:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Get Inquiries for a Service Provider
exports.getInquiries = async (req, res) => {
    try {
        const { spId } = req.params;
        const inquiries = await Inquiry.find({ serviceProvider: spId })
            .populate("user", "userName userEmail userContact userAddress")  // Added userContact and userAddress
            .populate("service", "serviceName")  // Fixed field name to match Service model
            .lean(); // Performance improvement

        res.status(200).json({ success: true, inquiries });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Get User Inquiries
exports.getUserInquiries = async (req, res) => {
    try {
        const { userId } = req.params;
        const inquiries = await Inquiry.find({ user: userId })
            .populate("service", "serviceName")  // Fixed field name to match Service model
            .populate("serviceProvider", "spName")  // Fixed field name to match ServiceProvider model
            .lean();

        res.status(200).json({ success: true, inquiries });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Update Inquiry Status & Send Email
exports.updateInquiryStatus = async (req, res) => {
    try {
        const { status, date, time, message } = req.body;
        const inquiryId = req.params.id;

        // If status is being set to "Approved" and date/time are provided, check for conflicts
        if (status === "Approved" && date && time) {
            // Find any existing approved inquiries with the same date and time (excluding current inquiry)
            const existingApprovedInquiry = await Inquiry.findOne({
                _id: { $ne: inquiryId }, // Not equal to current inquiry
                status: "Approved",
                date: date,
                time: time,
                serviceProvider: req.body.serviceProvider // Same service provider
            });

            if (existingApprovedInquiry) {
                return res.status(409).json({ 
                    success: false, 
                    message: "There is already an approved inquiry for this date and time. Please choose a different time slot.",
                    conflict: true
                });
            }
        }

        const inquiry = await Inquiry.findById(inquiryId)
            .populate("user", "userEmail userName")  // Fixed field names to match User model
            .populate("service", "serviceName")  // Fixed field name to match Service model
            .populate("serviceProvider", "spName");  // Fixed field name to match ServiceProvider model

        if (!inquiry) {
            return res.status(404).json({ success: false, message: "Inquiry not found" });
        }

        if (!inquiry.user?.userEmail) {  // Fixed field name to match User model
            return res.status(400).json({ success: false, message: "User email is missing in the inquiry!" });
        }

        // Update inquiry details
        inquiry.status = status;
        inquiry.date = date || inquiry.date;
        inquiry.time = time || inquiry.time;
        inquiry.message = message || inquiry.message;
        await inquiry.save();

        console.log("✅ Sending email to:", inquiry.user.userEmail);  // Fixed field name to match User model

        await sendEmail(
            inquiry.user.userEmail,  // Fixed field name to match User model
            status,
            inquiry.service?.serviceName || "Unknown Service",  // Fixed field name to match Service model
            inquiry.serviceProvider?.spName || "Unknown Provider",  // Fixed field name to match ServiceProvider model
            date || "Not Specified",
            time || "Not Specified",
            message || "No additional details"
        );

        res.status(200).json({ success: true, message: `Inquiry ${status} successfully`, inquiry });
    } catch (error) {
        console.error("❌ Error updating inquiry status:", error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Delete Inquiry
exports.deleteInquiry = async (req, res) => {
    try {
        const { id } = req.params;
        const inquiry = await Inquiry.findByIdAndDelete(id);

        if (!inquiry) {
            return res.status(404).json({ success: false, message: "Inquiry not found" });
        }

        res.status(200).json({ success: true, message: "Inquiry deleted successfully", inquiry });
    } catch (error) {
        console.error("Error deleting inquiry:", error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
