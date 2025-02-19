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
    categoryName: { type: String, required: true, unique: true },  // unique index defined here
    categoryDescription: { type: String, required: true },
    categoryImage: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);