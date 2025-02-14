// const mongoose = require("mongoose");

// const categorySchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   image: {
//     type: String, // Stores the image filename
//     required: true,
//   },
// });

// module.exports = mongoose.model("Category", categorySchema);


// models/Category.js

const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    Category_Name: { type: String, required: true },
    Category_Description: { type: String, required: true },
    Category_Image: { type: String, required: true }, // store image filename or path
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
