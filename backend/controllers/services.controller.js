const Service = require("../models/services.model");
const ServiceProvider = require("../models/sp.model");
const Category = require("../models/category.model");

// Add a new service
exports.addService = async (req, res) => {
    try {
      const { services_name, services_price, services_description, services_duration, categoryId, service_provider, services_img } = req.body;
  
      // Check if Service Provider exists
      const providerExists = await ServiceProvider.findById(service_provider);
      if (!providerExists) {
        return res.status(404).json({ message: "Service Provider not found!" });
      }
  
      // Check if Category exists
      const categoryExists = await Category.findById(categoryId);
      if (!categoryExists) {
        return res.status(404).json({ message: "Category not found!" });
      }
  
      // Create new Service
      const newService = new Service({
        services_name,
        services_price,
        services_description,
        services_duration,
        categoryId,
        service_provider,
        services_img,
      });
  
      // Save Service to DB
      await newService.save();
  
      // Push new service ID to service provider's services array
      await ServiceProvider.findByIdAndUpdate(service_provider, {
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
      const services = await Service.find().populate("service_provider categoryId");
      res.status(200).json(services);
  } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a single service by ID
exports.getServiceById = async (req, res) => {
  try {
      const service = await Service.findById(req.params.id).populate("service_provider categoryId");
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
      const { services_name, services_price, services_description, services_duration, categoryId, services_img } = req.body;

      const updatedService = await Service.findByIdAndUpdate(
          req.params.id,
          { services_name, services_price, services_description, services_duration, categoryId, services_img },
          { new: true }
      );

      if (!updatedService) {
          return res.status(404).json({ message: "Service not found!" });
      }

      res.status(200).json({ message: "Service updated successfully!", updatedService });
  } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a service
exports.deleteService = async (req, res) => {
  try {
      const service = await Service.findById(req.params.id);
      if (!service) {
          return res.status(404).json({ message: "Service not found!" });
      }

      // Remove service ID from service provider's list
      await ServiceProvider.findByIdAndUpdate(service.service_provider, {
          $pull: { services: service._id },
      });

      await service.deleteOne();
      res.status(200).json({ message: "Service deleted successfully!" });
  } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
  }
};

  exports.getInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find({ serviceProvider: req.params.spId })
            .populate("user", "name email")
            .populate("service", "services_name");

        res.status(200).json({ inquiries });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}; 