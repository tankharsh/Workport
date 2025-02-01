// const Category = require("../models/category.model");
// const fs = require('fs');
// const path = require('path');
// // Create Category
// exports.createCategory = async (req, res) => {
//   try {
//     const { name, description } = req.body;
//     const image = req.file ? req.file.filename : null;

//     if (!name || !description || !image) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const category = new Category({ name, description, image });
//     await category.save();

//     res.status(201).json({ message: "Category created successfully", category });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// };

// // Get All Categories
// exports.getCategories = async (req, res) => {
//   try {
//     const categories = await Category.find();
//     res.status(200).json(categories);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// };

// // Get Single Category
// exports.getCategory = async (req, res) => {
//   try {
//     const category = await Category.findById(req.params.id);
//     if (!category) return res.status(404).json({ message: "Category not found" });

//     res.status(200).json(category);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// };


// // Update Category
// exports.updateCategory = async (req, res) => {
//   const { name, description } = req.body;
//   const image = req.file ? req.file.filename : req.body.image;  // If a new image is uploaded, use the new file name; otherwise, keep the old image

//   try {
//     const updatedCategory = await Category.findByIdAndUpdate(
//       req.params.id,
//       { name, description, image },
//       { new: true }
//     );

//     if (!updatedCategory) {
//       return res.status(404).json({ message: "Category not found" });
//     }

//     res.json(updatedCategory);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Delete Category
// exports.deleteCategory = async (req, res) => {
//   try {
//     const deletedCategory = await Category.findByIdAndDelete(req.params.id);

//     if (!deletedCategory) {
//       return res.status(404).json({ message: "Category not found" });
//     }

//     res.json({ message: "Category deleted successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// controllers/categoryController.js

const Category = require("../models/category.model");
const fs = require("fs");
const path = require("path");

// Create a category
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const image = req.file ? req.file.filename : null;

    const newCategory = new Category({
      name,
      description,
      image,
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    let updatedCategoryData = { name, description };

    if (req.file) {
      // If a new image is uploaded, add the new image URL
      updatedCategoryData.image = req.file.filename;
    } else if (image) {
      // If no new image is uploaded, keep the existing image URL
      updatedCategoryData.image = image;
    }

    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, updatedCategoryData, { new: true });
    res.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "An error occurred while updating the category" });
  }
};


// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the category from the database
    const deletedCategory = await Category.findByIdAndDelete(id);

    // Optionally, delete the image file if it exists
    if (deletedCategory && deletedCategory.image) {
      fs.unlinkSync(path.join(__dirname, "../uploads", deletedCategory.image));
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error });
  }
};
