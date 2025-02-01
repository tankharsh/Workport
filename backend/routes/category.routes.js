// const express = require("express");
// const multer = require("multer");
// const upload = require('../multer/multer'); // Assuming you have a multer config file
// // const categoryController = require('../controllers/category.controller');
// const { createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require("../controllers/category.controller");

// const router = express.Router();

// // Multer setup for image upload
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // Ensure this folder exists
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// // const upload = multer({ storage });

// // Routes
// router.post("/", upload.single("image"), createCategory);
// router.get("/", getCategories);
// router.get("/:id", getCategory);
// // router.put("/:id", upload.single("image"), updateCategory);
// // router.delete("/:id", deleteCategory);


// // Update Category (PUT request)
// // router.put('/categoriesUpdate/:id', upload.single('categoryImage'), categoryController.updateCategory);
// // router.put("/:id", upload.single("categoryImage"), updateCategory);
// // Delete Category (DELETE request)
// // router.delete('/:id', categoryController.deleteCategory);
// // router.delete("/:id",deleteCategory);

// // Route to update a category (with image upload)
// router.put("/:id", upload.single("image"),updateCategory);

// // Route to delete a category
// router.delete("/:id", deleteCategory);

// module.exports = router;



// routes/categoryRoutes.js

const express = require("express");
const multer = require("multer");
const path = require("path");
const categoryController = require("../controllers/category.controller");

const router = express.Router();

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage: storage });

// Routes
router.post("/categories", upload.single("image"), categoryController.createCategory); // Upload image with category
router.get("/categories", categoryController.getAllCategories);
router.put("/categories/:id", upload.single("image"), categoryController.updateCategory); // Update category with image
router.delete("/categories/:id", categoryController.deleteCategory);

module.exports = router;
