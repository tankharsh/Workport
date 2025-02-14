// const mongoose = require("mongoose");

// const servicesSchema = new mongoose.Schema({
//   services_img: { type: String, required: true }, // URL or file path of the service image
//   services_name: { type: String, required: true }, // Name of the service
//   services_price: { type: Number, required: true }, // Price of the service
//   services_description: { type: String, required: true }, // Description of the service
//   services_duration: { type: String, required: true }, // Duration of the service 
//   service_provider: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceProvider", required: true }, // Reference to ServiceProvider schema
//   categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }, // Reference to Category schema
// }, { timestamps: true }); // Adds createdAt and updatedAt timestamps

// module.exports = mongoose.model("Services", servicesSchema);


const mongoose = require("mongoose");

const servicesSchema = new mongoose.Schema(
  {
    services_img: { type: String, required: true }, // Service Image
    services_name: { type: String, required: true }, // Service Name
    services_price: { type: Number, required: true }, // Service Price
    services_description: { type: String, required: true }, // Service Description
    services_duration: { type: String, required: true }, // Service Duration (e.g., "30 mins", "1 hour")
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }, // Linked Category
    service_provider: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceProvider", required: true }, // Linked Provider
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", servicesSchema);
module.exports = Service;
