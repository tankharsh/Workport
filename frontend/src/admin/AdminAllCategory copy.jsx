import React, { useState, useEffect } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import AdminSidebar from "./AdminSidebar";
import axios from "axios";

const CategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [editCategory, setEditCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ id: null, name: "", description: "", image: "", file: null });

  // Fetch Categories from API
  useEffect(() => {
    axios.get("http://localhost:4000/api/categories")
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the categories!", error);
      });
  }, []);

  // Handle Edit (Open Modal)
  const handleEdit = (category) => {
    setEditCategory(category);
    setNewCategory({ ...category, file: null }); // Clear file on edit
  };

  // Handle Save Changes (Update Backend and Frontend)
  const handleSave = (id) => {
    const formData = new FormData();
    formData.append("name", newCategory.name);  // ✅ Use "name" (not "categoryName")
    formData.append("description", newCategory.description);  // ✅ Use "description"

    if (newCategory.file) {
      formData.append("categoryImage", newCategory.file);  // ✅ Matches Multer config
    }

    axios.put(`http://localhost:4000/api/categories/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
      .then((response) => {
        console.log("Update successful:", response.data);
        setCategories(categories.map((cat) =>
          cat.id === newCategory.id ? response.data : cat
        ));
        setEditCategory(null);
      })
      .catch((error) => {
        console.error("Error updating the category:", error);
      });
  };



  // Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewCategory({ ...newCategory, file: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCategory({ ...newCategory, image: reader.result });
      };
      reader.readAsDataURL(file); // Set image preview
    }
  };

  // Handle Delete (Remove from both frontend and backend)
  // const handleDelete = (id) => {
  //   // Send DELETE request to backend to remove the category
  //   axios.delete(`http://localhost:4000/api/categories/${id}`, newCategory).then(() => {
  //       // Remove category from frontend after successful deletion
  //       setCategories(categories.filter((category) => category.id !== id));
  //     })
  //     .catch((error) => {
  //       console.error("There was an error deleting the category!", error);
  //     });
  // };
  const handleDelete = async (id) => {
    console.log("Deleting category with ID:", id);
    
    if (!id) {
      console.error("Error: Category ID is undefined!");
      return;
    }
  
    try {
      const response = await axios.delete(`http://localhost:4000/api/categories/${id}`);
      console.log("Delete API Response:", response.data); // ✅ Debugging API Response
  
      setCategories(categories.filter((category) => category._id !== id));
    } catch (error) {
      console.error("Error deleting the category!", error.response?.data || error.message);
    }
  };
  





  return (
    <>
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 py-2 mt-20">
        <div className="container mx-auto p-5">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-5">All Categories</h2>

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
                {categories.length > 0 ? categories.map((category, index) => (
                  <tr key={category.id} className="hover:bg-gray-200 transition">
                    <td className="px-4 py-2 border-t border-gray-200">{index + 1}</td>
                    <td className="px-4 py-2 border-t border-gray-200">{category.name}</td>
                    <td className="px-4 py-2 border-t border-gray-200">{category.description}</td>
                    <td className="px-4 py-2 border-t border-gray-200">
                      {/* Use the dynamic image URL returned from backend */}
                      <img src={`http://localhost:4000/uploads/${category.image}`} alt="Category" className="w-16 h-16 rounded-md" />
                    </td>
                    <td className="px-4 py-2 border-t border-gray-200 space-x-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                      >
                        <MdEdit />
                      </button>
                      <button onClick={() => handleDelete(category._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-2 text-center text-gray-500">No categories available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Edit Category Modal */}
          {editCategory && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md transform transition-all scale-95 sm:scale-100">
                <h3 className="text-lg font-bold mb-3 text-center text-gray-700">Edit Category</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium">Category Name</label>
                    <input
                      type="text"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      className="border p-2 w-full rounded focus:ring focus:ring-blue-300 outline-none"
                      placeholder="Enter category name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium">Description</label>
                    <textarea
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                      className="border p-2 w-full rounded focus:ring focus:ring-blue-300 outline-none"
                      placeholder="Enter category description"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium">Category Image</label>
                    <input
                      type="file"
                      onChange={handleImageUpload}
                      className="border p-2 w-full rounded focus:ring focus:ring-blue-300 outline-none"
                    />
                    {newCategory.image && (
                      <img src={newCategory.image} alt="Preview" className="mt-3 w-16 h-16 object-cover rounded-md" />
                    )}
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      type="button"
                      onClick={handleSave}
                      className="bg-green-500 text-white w-full py-2 rounded hover:bg-green-600 transition"
                    >
                      Save Changes
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

export default CategoryTable;
