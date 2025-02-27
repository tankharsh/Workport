const Category = require("../models/category.model");
const fs = require("fs");
const path = require("path");

// Create a category
exports.createCategory = async (req, res) => {
  try {
      // console.log("Received Data:", req.body);
      // console.log("Received File:", req.file);

      // Ensure categoryName is not empty
      const { categoryName, categoryDescription } = req.body;
      if (!categoryName || categoryName.trim() === "") {
          return res.status(400).json({ message: "Category name is required and cannot be empty." });
      }

      // Validate that categoryDescription is provided
      if (!categoryDescription || categoryDescription.trim() === "") {
          return res.status(400).json({ message: "Category description is required and cannot be empty." });
      }

      if (!req.file) {
          return res.status(400).json({ message: "Category image is required." });
      }

      const categoryImage = req.file.filename;

      // 🚀 **Check if Category already exists**
      const existingCategory = await Category.findOne({ categoryName });
      if (existingCategory) {
          return res.status(400).json({ message: "Category already exists." });
      }

      const newCategory = new Category({
          categoryName,
          categoryDescription,
          categoryImage,
      });

      await newCategory.save();

      res.status(201).json({ message: "Category successfully added!", category: newCategory });
  } catch (error) {
      console.error("Database Save Error:", error);
      res.status(500).json({ message: "Error creating category", error: error.message });
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
    const { categoryName, categoryDescription, categoryImage } = req.body;

    let updatedCategoryData = { categoryName, categoryDescription };

    if (req.file) {
      // If a new categoryImage is uploaded, add the new categoryImage URL
      updatedCategoryData.categoryImage = req.file.filename;
    } else if (categoryImage) {
      // If no new categoryImage is uploaded, keep the existing categoryImage URL
      updatedCategoryData.categoryImage = categoryImage;
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

    // Optionally, delete the categoryImage file if it exists
    if (deletedCategory && deletedCategory.categoryImage) {
      fs.unlinkSync(path.join(__dirname, "../uploads", deletedCategory.categoryImage));
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error });
  }
};
