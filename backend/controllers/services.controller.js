const Service = require("../models/services.model");
const ServiceProvider = require("../models/sp.model");
const Category = require("../models/category.model");
const mongoose = require("mongoose");

// Add a new service
// Add Service function
exports.addService = async (req, res) => {
  try {
    let { serviceName, servicePrice, serviceDescription, serviceDuration, categoryId, serviceProviderId } = req.body;
    
    // If `serviceProviderId` is an array, extract the first element
    if (Array.isArray(serviceProviderId)) {
      serviceProviderId = serviceProviderId[0];  
    }

    if (Array.isArray(categoryId)) {
      categoryId = categoryId[0];
    }

    // Validate Service Provider
    const providerExists = await ServiceProvider.findById(serviceProviderId);
    if (!providerExists) {
      return res.status(404).json({ message: "Service Provider not found!" });
    }

    // Validate Category
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return res.status(404).json({ message: "Category not found!" });
    }

    // Check if file is uploaded
    const serviceImage = req.file ? req.file.filename : null;

    // Create new Service
    const newService = new Service({
      serviceName,
      servicePrice,
      serviceDescription,
      serviceDuration,
      categoryId,
      serviceProviderId,
      serviceImage,
    });

    // Save Service
    await newService.save();

    // Update Service Provider's services array
    await ServiceProvider.findByIdAndUpdate(serviceProviderId, {
      $push: { services: newService._id },
    });

    res.status(201).json({ message: "Service added successfully!", newService });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().populate("serviceProviderId categoryId");
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// New controller for latest 8 services
exports.getRecentServices = async (req, res) => {
  try {
    const services = await Service.find()
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order (newest first)
      .limit(8) // Limit to 8 services
      .populate("serviceProviderId categoryId"); // Populate related fields

    // Check if any service has invalid references
    const invalidServices = services.filter(
      (service) =>
        !mongoose.isValidObjectId(service.serviceProviderId) ||
        !mongoose.isValidObjectId(service.categoryId)
    );

    if (invalidServices.length > 0) {
      return res.status(400).json({ message: "Invalid service ID format in references" });
    }

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Get get All ServiceProviders With Services  if need then use that controller 
exports.getAllServiceProvidersWithServices = async (req, res) => {
  try {
    const providers = await ServiceProvider.find().populate({
      path: "services",
      model: "Service",
      populate: {
        path: "categoryId",
      },
    });

    res.status(200).json(providers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a single service by ID
exports.getServiceById = async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid service ID format" });
    }

    const service = await Service.findById(req.params.id).populate("serviceProviderId categoryId");
    if (!service) {
      return res.status(404).json({ message: "Service not found!" });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a service
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid service ID format" });
    }

    let service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found!" });
    }

    // Prepare updated data
    const updatedData = {
      serviceName: req.body.serviceName,
      servicePrice: req.body.servicePrice,
      serviceDescription: req.body.serviceDescription,
      serviceDuration: req.body.serviceDuration,
      categoryId: req.body.categoryId,
      serviceProviderId: req.body.serviceProviderId,
    };

    // If image is uploaded, update it
    if (req.file) {
      updatedData.serviceImage = req.file.filename;
    }

    // Update service
    const updatedService = await Service.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedService) {
      return res.status(500).json({ message: "Failed to update service" });
    }

    res.status(200).json({ message: "Service updated successfully!", updatedService });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// Delete a service
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid service ID format" });
    }

    // Find the service by ID
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found!" });
    }

    // Remove service ID from the ServiceProvider's services array
    await ServiceProvider.updateOne(
      { _id: service.serviceProviderId },
      { $pull: { services: id } }
    );

    // Delete the service
    await Service.deleteOne({ _id: id });

    res.status(200).json({ message: "Service deleted successfully!" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Get inquiries for a service provider
exports.getInquiries = async (req, res) => {
  try {
    if (!req.params.spId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid service provider ID format" });
    }

    const inquiries = await Inquiry.find({ serviceProvider: req.params.spId })
      .populate("user", "name email")
      .populate("service", "serviceName");

    res.status(200).json({ inquiries });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};






