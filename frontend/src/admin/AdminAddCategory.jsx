import React, { useState } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import { Navigate } from "react-router-dom";

const AdminAddCategory = () => {
    const [formData, setFormData] = useState({
        categoryName: "",
        categoryDescription: "",
        categoryImage: null,
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [redirect, setRedirect] = useState(false);  // State for redirecting

    // Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle Image Upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, categoryImage: file });
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.categoryName || !formData.categoryDescription || !formData.categoryImage) {
            alert("Please fill all fields before submitting.");
            return;
        }

        setLoading(true);
        setMessage("");

        const formDataToSend = new FormData();
        formDataToSend.append("categoryName", formData.categoryName); // Ensure this is correctly passed as categoryName
        formDataToSend.append("categoryDescription", formData.categoryDescription);
        formDataToSend.append("categoryImage", formData.categoryImage);

        // console.log("formDataToSend:", formDataToSend);        

        try {
            const response = await axios.post("http://localhost:4000/api/categories", formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setMessage("Category successfully created!", response.data.message);
            // console.log("Category added:", response.data);

               
            setRedirect(true);
            // Reset Form
            setFormData({
                categoryName: "",
                categoryDescription: "",
                categoryImage: null,
            });
            setPreviewImage(null);
        } catch (error) {
            console.error("Error adding category:", error);
            setMessage("Failed to add category. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Redirect to the dashboard if category is successfully created
    if (redirect) {
        return <Navigate to="/Admin-Dashboard/all-categories" />;
    }

    return (
        <>
            <AdminSidebar />
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
                    <h2 className="text-2xl font-bold text-center text-gray-700 mb-5">Add New Category</h2>

                    {message && <p className="text-center text-sm text-green-600">{message}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Category Name */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Category Name</label>
                            <input
                                type="text"
                                name="categoryName"
                                value={formData.categoryName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md focus:ring-2 text-black"
                                placeholder="Enter category name"
                                required
                            />
                        </div>

                        {/* Category Description */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Category Description</label>
                            <textarea
                                name="categoryDescription"
                                value={formData.categoryDescription}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md focus:ring-2 text-black"
                                placeholder="Enter category description"
                                rows="3"
                                required
                            ></textarea>
                        </div>

                        {/* Category Image Upload */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Upload Category Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full px-4 py-2 border rounded-md text-black"
                                required
                            />
                            {previewImage && (
                                <img
                                    src={previewImage}
                                    alt="Preview"
                                    className="mt-3 w-full h-40 object-cover rounded-md border"
                                />
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded-md text-black transition duration-200"
                            disabled={loading}
                        >
                            {loading ? "Adding..." : "Add Category"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AdminAddCategory;
