const Category = require("../models/category.model");
const fs = require("fs");
const path = require("path");

// Create a category
exports.createCategory = async (req, res) => {
  try {
    const { Category_Name, Category_Description } = req.body;
    const Category_Image = req.file ? req.file.filename : null;

    const newCategory = new Category({
      Category_Name,
      Category_Description,
      Category_Image,
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
    const { Category_Name, Category_Description, Category_Image } = req.body;

    let updatedCategoryData = { Category_Name, Category_Description };

    if (req.file) {
      // If a new Category_Image is uploaded, add the new Category_Image URL
      updatedCategoryData.Category_Image = req.file.filename;
    } else if (Category_Image) {
      // If no new Category_Image is uploaded, keep the existing Category_Image URL
      updatedCategoryData.Category_Image = Category_Image;
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

    // Optionally, delete the Category_Image file if it exists
    if (deletedCategory && deletedCategory.Category_Image) {
      fs.unlinkSync(path.join(__dirname, "../uploads", deletedCategory.Category_Image));
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error });
  }
};
