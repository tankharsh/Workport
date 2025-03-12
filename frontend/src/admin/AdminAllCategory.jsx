import { useState, useEffect } from "react";
import { MdEdit, MdDelete, MdAdd, MdSearch } from "react-icons/md";
import AdminSidebar from "./AdminSidebar";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { BiUpload } from "react-icons/bi";

const AdminAllCategory = () => {
  const [categories, setCategories] = useState([]);
  const [editCategory, setEditCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState({
    id: null,
    categoryName: "",
    categoryDescription: "",
    categoryImage: "",
    file: null,
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const tableVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  // Fetch Categories from API
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:4000/api/categories")
      .then((response) => {
        setCategories(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the categories!", error);
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch categories. Please try again.",
          confirmButtonColor: "#10B981"
        });
      });
  }, []);

  // Handle Edit Category
  const handleEditCategory = (category) => {
    setEditCategory(category);
    setNewCategory({
      id: category._id,
      categoryName: category.categoryName,
      categoryDescription: category.categoryDescription,
      categoryImage: category.categoryImage,
      file: null,
    });
  };

  // Handle Category Form Changes
  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewCategory({ ...newCategory, file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCategory(prev => ({ ...prev, previewUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Create or Edit Category
  const handleSaveCategory = async () => {
    const formData = new FormData();
    formData.append("categoryName", newCategory.categoryName);
    formData.append("categoryDescription", newCategory.categoryDescription);

    if (newCategory.file) {
      formData.append("categoryImage", newCategory.file);
    } else if (newCategory.categoryImage) {
      formData.append("categoryImage", newCategory.categoryImage);
    }

    try {
      let response;
      if (newCategory.id) {
        response = await axios.put(
          `http://localhost:4000/api/categories/${newCategory.id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setCategories(
          categories.map((cat) =>
            cat._id === newCategory.id ? response.data : cat
          )
        );
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Category updated successfully!",
          confirmButtonColor: "#10B981"
        });
      } else {
        response = await axios.post(
          "http://localhost:4000/api/categories",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setCategories([...categories, response.data]);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Category created successfully!",
          confirmButtonColor: "#10B981"
        });
      }
      setEditCategory(null);
      setNewCategory({ categoryName: "", categoryDescription: "", categoryImage: "", file: null });
    } catch (error) {
      console.error("Error saving category:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save category. Please try again.",
        confirmButtonColor: "#10B981"
      });
    }
  };

  // Handle Delete Category
  const handleDeleteCategory = async (categoryId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#10B981",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:4000/api/categories/${categoryId}`);
          setCategories(categories.filter((category) => category._id !== categoryId));
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Category has been deleted.",
            confirmButtonColor: "#10B981"
          });
        } catch (error) {
          console.error("Error deleting category:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to delete category. Please try again.",
            confirmButtonColor: "#10B981"
          });
        }
      }
    });
  };

  // Filter categories based on search term
  const filteredCategories = categories.filter(category =>
    category.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.categoryDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <AdminSidebar />
      <motion.main 
        className="flex-1 lg:ml-64 min-h-screen bg-gray-50"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header Section */}
        <div className="bg-white shadow-sm mt-16 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-2xl font-bold text-gray-900">All Categories</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your service categories</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Add Category */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div className="relative w-full sm:w-64">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <Link 
              to="/Admin-Dashboard/add-category"
              className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
            >
              <MdAdd className="mr-2" />
              Add Category
            </Link>
          </div>

          {/* Category Table */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm overflow-hidden"
            variants={tableVariants}
          >
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <AnimatePresence>
                      {filteredCategories.map((category, index) => (
                        <motion.tr 
                          key={category._id}
                          variants={rowVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{category.categoryName}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500 line-clamp-2">{category.categoryDescription}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <img
                              src={`http://localhost:4000/uploads/${category.categoryImage}`}
                              alt={category.categoryName}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleEditCategory(category)}
                              className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <MdEdit className="mr-1" />
                              Edit
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDeleteCategory(category._id)}
                              className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                              <MdDelete className="mr-1" />
                              Delete
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                    {filteredCategories.length === 0 && !loading && (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                          No categories found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>

        {/* Edit Category Modal */}
        <AnimatePresence>
          {editCategory && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Edit Category
                  </h3>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category Name
                      </label>
                      <input
                        type="text"
                        name="categoryName"
                        value={newCategory.categoryName}
                        onChange={handleCategoryChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Enter category name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        name="categoryDescription"
                        value={newCategory.categoryDescription}
                        onChange={handleCategoryChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Enter category description"
                        rows="4"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category Image
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 transition-all duration-200 hover:border-emerald-500">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="categoryImage"
                        />
                        <label 
                          htmlFor="categoryImage"
                          className="cursor-pointer flex flex-col items-center justify-center py-4"
                        >
                          <BiUpload className="text-4xl text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                        </label>
                        {(newCategory.previewUrl || newCategory.categoryImage) && (
                          <div className="mt-4">
                            <img
                              src={newCategory.previewUrl || `http://localhost:4000/uploads/${newCategory.categoryImage}`}
                              alt="Preview"
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </form>
                  <div className="flex gap-3 mt-6">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSaveCategory}
                      className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Save Changes
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setEditCategory(null)}
                      className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>
    </>
  );
};

export default AdminAllCategory;
