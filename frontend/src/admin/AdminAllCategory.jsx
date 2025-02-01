import React, { useState, useEffect } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import AdminSidebar from "./AdminSidebar";
import axios from "axios";
import { Link } from "react-router-dom";

const AdminAllCategory = () => {
  const [categories, setCategories] = useState([]);
  const [editCategory, setEditCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    id: null,
    name: "",
    description: "",
    image: "",
    file: null,
  });

  // Fetch Categories from API
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the categories!", error);
      });
  }, []);

  // Handle Edit Category
  const handleEditCategory = (category) => {
    setEditCategory(category);
    setNewCategory({
      id: category._id,
      name: category.name,
      description: category.description,
      image: category.image, // Retaining the existing image URL for the form
      file: null, // No new file selected yet
    });
  };

  // Handle Category Form Changes
  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
  };

  const handleFileChange = (e) => {
    setNewCategory({ ...newCategory, file: e.target.files[0] });
  };

  // Handle Create or Edit Category
  const handleSaveCategory = async () => {
    const formData = new FormData();
    formData.append("name", newCategory.name);
    formData.append("description", newCategory.description);

    // Only append the image if it's changed
    if (newCategory.file) {
      formData.append("image", newCategory.file);
    } else {
      // If no new image is provided, use the old image
      formData.append("image", newCategory.image);
    }

    try {
      let response;
      if (newCategory.id) {
        // Update existing category
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
      } else {
        // Create new category
        response = await axios.post(
          "http://localhost:4000/api/categories",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setCategories([...categories, response.data]);
      }
      setEditCategory(null); // Close edit modal
      setNewCategory({ name: "", description: "", image: "", file: null }); // Reset form
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  // Handle Delete Category
  const handleDeleteCategory = async (categoryId) => {
    try {
      await axios.delete(`http://localhost:4000/api/categories/${categoryId}`);
      setCategories(categories.filter((category) => category._id !== categoryId));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <>
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 py-2 mt-20">
        <div className="container mx-auto p-5">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-5">
            All Categories
          </h2>

          <div className="flex justify-end m-4">
          <Link to="/Admin-Dashboard/add-category" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-4">+ Add Categories</Link>
          </div>


          {/* Category Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 shadow-lg rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left font-bold text-gray-700">No.</th>
                  <th className="px-4 py-2 text-left font-bold text-gray-700">Category Name</th>
                  <th className="px-4 py-2 text-left font-bold text-gray-700">Description</th>
                  <th className="px-4 py-2 text-left font-bold text-gray-700">Image</th>
                  <th className="px-4 py-2 text-left font-bold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 ? (
                  categories.map((category, index) => (
                    <tr key={category._id} className="hover:bg-gray-200 transition">
                      <td className="px-4 py-2 border-t border-gray-200">{index + 1}</td>
                      <td className="px-4 py-2 border-t border-gray-200">{category.name}</td>
                      <td className="px-4 py-2 border-t border-gray-200">{category.description}</td>
                      <td className="px-4 py-2 border-t border-gray-200">
                        <img
                          src={`http://localhost:4000/uploads/${category.image}`}
                          alt="Category"
                          className="w-16 h-16 rounded-md"
                        />
                      </td>
                      <td className="px-4 py-2 border-t border-gray-200 space-x-2">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                        >
                          <MdEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                        >
                          <MdDelete />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-2 text-center text-gray-500">No categories available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Edit or Create Category Modal */}
          {editCategory && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md transform transition-all scale-95 sm:scale-100">
                <h3 className="text-lg font-bold mb-3 text-center text-gray-700">
                  {newCategory.id ? "Edit Category" : "Create Category"}
                </h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium">Category Name</label>
                    <input
                      type="text"
                      name="name"
                      value={newCategory.name}
                      onChange={handleCategoryChange}
                      className="border p-2 w-full rounded focus:ring focus:ring-blue-300 outline-none"
                      placeholder="Enter category name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium">Description</label>
                    <textarea
                      name="description"
                      value={newCategory.description}
                      onChange={handleCategoryChange}
                      className="border p-2 w-full rounded focus:ring focus:ring-blue-300 outline-none"
                      placeholder="Enter category description"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium">Category Image</label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="border p-2 w-full rounded focus:ring focus:ring-blue-300 outline-none"
                    />
                    {newCategory.image && !newCategory.file && (
                      <img
                        src={`http://localhost:4000/uploads/${newCategory.image}`}
                        alt="Preview"
                        className="mt-3 w-16 h-16 object-cover rounded-md"
                      />
                    )}
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      type="button"
                      onClick={handleSaveCategory}
                      className="bg-green-500 text-white w-full py-2 rounded hover:bg-green-600 transition"
                    >
                      {newCategory.id ? "Save Changes" : "Create Category"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditCategory(null)}
                      className="bg-gray-500 text-white w-full py-2 rounded hover:bg-gray-600 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default AdminAllCategory;
