import { useState } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BiUpload } from "react-icons/bi";
import { FaStar } from "react-icons/fa";
import Swal from "sweetalert2";

const AdminAddCategory = () => {
    const [formData, setFormData] = useState({
        categoryName: "",
        categoryDescription: "",
        categoryImage: null,
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [redirect, setRedirect] = useState(false);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    };

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
            Swal.fire({
                icon: "warning",
                title: "Missing Fields",
                text: "Please fill all fields before submitting.",
                confirmButtonColor: "#10B981"
            });
            return;
        }

        setLoading(true);

        const formDataToSend = new FormData();
        formDataToSend.append("categoryName", formData.categoryName);
        formDataToSend.append("categoryDescription", formData.categoryDescription);
        formDataToSend.append("categoryImage", formData.categoryImage);

        try {
            const response = await axios.post("http://localhost:4000/api/categories", formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            Swal.fire({
                icon: "success",
                title: "Success!",
                text: "Category successfully created!",
                confirmButtonColor: "#10B981"
            });
               
            setRedirect(true);
            setFormData({
                categoryName: "",
                categoryDescription: "",
                categoryImage: null,
            });
            setPreviewImage(null);
        } catch (error) {
            console.error("Error adding category:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to add category. Please try again.",
                confirmButtonColor: "#10B981"
            });
        } finally {
            setLoading(false);
        }
    };

    if (redirect) {
        return <Navigate to="/Admin-Dashboard/all-categories" />;
    }

    return (
        <>
            <AdminSidebar />
            <motion.div 
                className="flex-1 lg:ml-64 min-h-screen bg-gray-50"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Header Section */}
                <div className="bg-white shadow-sm mt-16 border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <h1 className="text-2xl font-bold text-gray-900">Add New Category</h1>
                        <p className="text-sm text-gray-500 mt-1">Create a new service category</p>
                    </div>
                </div>

                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <motion.div 
                        className="bg-white rounded-xl shadow-sm overflow-hidden"
                        variants={containerVariants}
                    >
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Category Name */}
                                <div>
                                    <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                                        <FaStar className="text-emerald-500" />
                                        Category Name
                                    </label>
                                    <input
                                        type="text"
                                        name="categoryName"
                                        value={formData.categoryName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                        placeholder="Enter category name"
                                        required
                                    />
                                </div>

                                {/* Category Description */}
                                <div>
                                    <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                                        <FaStar className="text-emerald-500" />
                                        Category Description
                                    </label>
                                    <textarea
                                        name="categoryDescription"
                                        value={formData.categoryDescription}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                        placeholder="Enter category description"
                                        rows="4"
                                        required
                                    ></textarea>
                                </div>

                                {/* Category Image Upload */}
                                <div>
                                    <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                                        <FaStar className="text-emerald-500" />
                                        Category Image
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 transition-all duration-200 hover:border-emerald-500">
                                        <div className="flex items-center justify-center">
                                            <label className="cursor-pointer w-full">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                    required
                                                />
                                                <div className="flex flex-col items-center justify-center py-6">
                                                    <BiUpload className="text-4xl text-gray-400 mb-2" />
                                                    <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                                                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                                                </div>
                                            </label>
                                        </div>
                                        {previewImage && (
                                            <motion.div 
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="mt-4"
                                            >
                                                <img
                                                    src={previewImage}
                                                    alt="Preview"
                                                    className="w-full h-48 object-cover rounded-lg"
                                                />
                                            </motion.div>
                                        )}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-200 flex items-center justify-center gap-2"
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    disabled={loading}
                                >
                                    <FaStar className="text-sm" />
                                    {loading ? "Adding Category..." : "Add Category"}
                                    <FaStar className="text-sm" />
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </>
    );
};

export default AdminAddCategory;
