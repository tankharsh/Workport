import { useEffect, useState } from 'react';
import Sidebar from '../../components/sp_components/Sidebar';
import { FaEnvelope, FaPhone, FaUser, FaStar } from "react-icons/fa";
import { GiShop } from "react-icons/gi";
import { BiSolidCity } from "react-icons/bi";
import { FaMapLocationDot } from "react-icons/fa6";
import { TbMapPinCode } from "react-icons/tb";
import { PiMapPinAreaFill } from "react-icons/pi";
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import Swal from "sweetalert2";

const Profile = () => {
  const [formData, setFormData] = useState({
    spName: "",
    spEmail: "",
    spContact: "",
    spShopName: "",
    spDescription: "",
    spBlockNo: "",
    spArea: "",
    spPincode: "",
    spCity: "",
    spShopImage: "",
    spShopBannerImage: "",
    spCategories: [],
  });

  const [shopImagePreview, setShopImagePreview] = useState(null);
  const [shopBannerPreview, setShopBannerPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const storedUser = JSON.parse(localStorage.getItem("serviceProvider"));
  const SPId = storedUser?.id || "";

  useEffect(() => {
    if (!SPId) return;
    
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/sp/providers/${SPId}`);
        if (response.data && response.data.provider) {
          console.log("Provider data:", response.data.provider);
          
          // Format the categories data to match our expected structure
          const formattedData = {
            ...response.data.provider,
            spCategories: response.data.provider.category || []
          };
          
          // Extract provider data and set it to formData
          setFormData(formattedData);
          
          // Set image previews if available
          if (response.data.provider.spShopImage) {
            setShopImagePreview(`http://localhost:4000/uploads/${response.data.provider.spShopImage}`);
          }
          if (response.data.provider.spShopBannerImage) {
            setShopBannerPreview(`http://localhost:4000/uploads/${response.data.provider.spShopBannerImage}`);
          }
        }
      } catch (error) {
        console.error("Error fetching service details:", error);
      }
    };
    
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchData();
    fetchCategories();
  }, [SPId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "spCategories") {
      // Handle category selection
      let updatedCategories = [...(formData.spCategories || [])];
      
      if (checked) {
        // If category is not already selected, add it
        if (!updatedCategories.some(cat => cat.categoryId === value)) {
          const selectedCategory = categories.find(cat => cat._id === value);
          if (selectedCategory) {
            updatedCategories.push({
              categoryId: selectedCategory._id,
              categoryName: selectedCategory.categoryName,
              categoryDescription: selectedCategory.categoryDescription || "",
              categoryImage: selectedCategory.categoryImage || ""
            });
          }
        }
      } else {
        // Remove the category if unchecked
        updatedCategories = updatedCategories.filter(cat => cat.categoryId !== value);
      }
      
      setFormData(prev => ({
        ...prev,
        spCategories: updatedCategories
      }));
    } else {
      // Handle other form fields
      setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    
    if (files && files[0]) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(files[0]);
      if (name === "spShopImage") {
        setShopImagePreview(previewUrl);
      } else if (name === "spShopBannerImage") {
        setShopBannerPreview(previewUrl);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!SPId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Service provider ID not found",
      });
      return;
    }
    
    const data = new FormData();
    
    // Append all form fields
    Object.keys(formData).forEach(key => {
      // Skip the services field to avoid casting errors
      if (key === 'services') {
        return;
      }
      
      if (key === "spCategories") {
        // Extract only the category IDs from the spCategories array
        const categoryIds = formData[key].map(cat => cat.categoryId || cat._id);
        data.append(key, JSON.stringify(categoryIds));
      } else if (key === "spShopImage" || key === "spShopBannerImage") {
        // Only append file if it's a File object (new upload)
        if (formData[key] instanceof File) {
          data.append(key, formData[key]);
        }
      } else if (formData[key] !== undefined && formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });
    
    try {
      const response = await axios.put(
        `http://localhost:4000/api/sp/update/${SPId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Profile updated successfully",
        });
        
        // Refresh the data by fetching again
        try {
          const refreshResponse = await axios.get(`http://localhost:4000/api/sp/providers/${SPId}`);
          if (refreshResponse.data && refreshResponse.data.provider) {
            // Format the categories data to match our expected structure
            const formattedData = {
              ...refreshResponse.data.provider,
              spCategories: refreshResponse.data.provider.category || []
            };
            
            setFormData(formattedData);
            
            // Set image previews if available
            if (refreshResponse.data.provider.spShopImage) {
              setShopImagePreview(`http://localhost:4000/uploads/${refreshResponse.data.provider.spShopImage}`);
            }
            if (refreshResponse.data.provider.spShopBannerImage) {
              setShopBannerPreview(`http://localhost:4000/uploads/${refreshResponse.data.provider.spShopBannerImage}`);
            }
          }
        } catch (refreshError) {
          console.error("Error refreshing data:", refreshError);
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to update profile",
      });
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const formItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <>
      <Sidebar />
      <motion.main 
        className="flex-1 lg:ml-64 min-h-screen bg-gray-50"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header Section - Removed sticky positioning */}
        <div className="bg-white shadow-sm border-b mt-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your personal and shop information</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.form 
            onSubmit={handleSubmit} 
            className="bg-white rounded-xl shadow-sm overflow-hidden"
            variants={containerVariants}
          >
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Information Section */}
                <motion.div 
                  className="space-y-6"
                  variants={formItemVariants}
                >
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                    <FaStar className="text-emerald-500" />
                    <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                  </div>
                  
                  {/* Personal Info Fields */}
                  <motion.div 
                    className="space-y-4"
                    variants={formItemVariants}
                  >
                    <div className="group">
                      <div className="flex w-full items-center border border-gray-300 p-3 rounded-lg transition-all duration-200 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 hover:border-emerald-500">
                        <FaUser className="mr-3 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                        <input
                          type="text"
                          name="spName"
                          placeholder="Enter your name"
                          value={formData.spName || ""}
                          onChange={handleChange}
                          className="w-full outline-none text-gray-700 placeholder:text-gray-400"
                        />
                      </div>
                    </div>

                    <div className="group">
                      <div className="flex w-full items-center border border-gray-300 p-3 rounded-lg transition-all duration-200 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 hover:border-emerald-500">
                        <FaPhone className="mr-3 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                        <input
                          type="tel"
                          name="spContact"
                          placeholder="Enter your contact number"
                          value={formData.spContact || ""}
                          onChange={handleChange}
                          className="w-full outline-none text-gray-700 placeholder:text-gray-400"
                        />
                      </div>
                    </div>

                    <div className="group">
                      <div className="flex w-full items-center border border-gray-300 p-3 rounded-lg transition-all duration-200 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 hover:border-emerald-500">
                        <FaEnvelope className="mr-3 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                        <input
                          type="email"
                          name="spEmail"
                          placeholder="Enter your email"
                          value={formData.spEmail || ""}
                          onChange={handleChange}
                          className="w-full outline-none text-gray-700 placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Shop Information */}
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-200 mt-8">
                    <FaStar className="text-emerald-500" />
                    <h2 className="text-lg font-semibold text-gray-900">Shop Information</h2>
                  </div>

                  <motion.div 
                    className="space-y-4"
                    variants={formItemVariants}
                  >
                    <div className="group">
                      <div className="flex w-full items-center border border-gray-300 p-3 rounded-lg transition-all duration-200 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 hover:border-emerald-500">
                        <GiShop className="mr-3 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                        <input
                          type="text"
                          name="spShopName"
                          placeholder="Enter shop name"
                          value={formData.spShopName || ""}
                          onChange={handleChange}
                          className="w-full outline-none text-gray-700 placeholder:text-gray-400"
                        />
                      </div>
                    </div>

                    {/* Categories */}
                    <div className="border border-gray-300 p-4 rounded-lg">
                      <p className="text-gray-700 font-medium mb-3">Service Categories</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {categories.map((category) => (
                          <label 
                            key={category._id} 
                            className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:border-emerald-500 transition-colors cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              name="spCategories"
                              value={category._id}
                              checked={formData.spCategories?.some(
                                (cat) => cat.categoryId === category._id || cat._id === category._id
                              )}
                              onChange={handleChange}
                              className="accent-emerald-500"
                            />
                            <span className="text-gray-700 capitalize text-sm">
                              {category.categoryName}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Shop Description */}
                    <div className="group">
                      <div className="border border-gray-300 p-3 rounded-lg transition-all duration-200 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 hover:border-emerald-500">
                        <textarea
                          name="spDescription"
                          placeholder="Enter shop description"
                          value={formData.spDescription || ""}
                          onChange={handleChange}
                          className="w-full outline-none text-gray-700 placeholder:text-gray-400 resize-none min-h-[100px]"
                          rows="4"
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Shop Address */}
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div className="group" variants={formItemVariants}>
                      <div className="flex w-full items-center border border-gray-300 p-3 rounded-lg transition-all duration-200 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 hover:border-emerald-500">
                        <FaMapLocationDot className="mr-3 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                        <input
                          type="text"
                          name="spBlockNo"
                          placeholder="Block No."
                          value={formData.spBlockNo || ""}
                          onChange={handleChange}
                          className="w-full outline-none text-gray-700 placeholder:text-gray-400"
                        />
                      </div>
                    </motion.div>

                    <motion.div className="group" variants={formItemVariants}>
                      <div className="flex w-full items-center border border-gray-300 p-3 rounded-lg transition-all duration-200 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 hover:border-emerald-500">
                        <PiMapPinAreaFill className="mr-3 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                        <input
                          type="text"
                          name="spArea"
                          placeholder="Area"
                          value={formData.spArea || ""}
                          onChange={handleChange}
                          className="w-full outline-none text-gray-700 placeholder:text-gray-400"
                        />
                      </div>
                    </motion.div>

                    <motion.div className="group" variants={formItemVariants}>
                      <div className="flex w-full items-center border border-gray-300 p-3 rounded-lg transition-all duration-200 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 hover:border-emerald-500">
                        <TbMapPinCode className="mr-3 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                        <input
                          type="text"
                          name="spPincode"
                          placeholder="Pincode"
                          value={formData.spPincode || ""}
                          onChange={handleChange}
                          className="w-full outline-none text-gray-700 placeholder:text-gray-400"
                        />
                      </div>
                    </motion.div>

                    <motion.div className="group" variants={formItemVariants}>
                      <div className="flex w-full items-center border border-gray-300 p-3 rounded-lg transition-all duration-200 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 hover:border-emerald-500">
                        <BiSolidCity className="mr-3 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                        <input
                          type="text"
                          name="spCity"
                          placeholder="City"
                          value={formData.spCity || ""}
                          onChange={handleChange}
                          className="w-full outline-none text-gray-700 placeholder:text-gray-400"
                        />
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Shop Images Section */}
                <motion.div 
                  className="space-y-6"
                  variants={formItemVariants}
                >
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                    <FaStar className="text-emerald-500" />
                    <h2 className="text-lg font-semibold text-gray-900">Shop Images</h2>
                  </div>

                  {/* Shop Image */}
                  <div className="space-y-4">
                    <div className="group">
                      <label className="block text-gray-700 font-medium mb-2">Shop Image</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 transition-all duration-200 hover:border-emerald-500">
                        <input
                          type="file"
                          name="spShopImage"
                          onChange={handleFileChange}
                          className="w-full text-gray-700"
                        />
                        {shopImagePreview && (
                          <motion.div 
                            className="mt-4"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <img
                              src={shopImagePreview}
                              alt="Shop Preview"
                              className="w-full h-48 object-cover rounded-lg shadow-md"
                            />
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* Shop Banner Image */}
                    <div className="group">
                      <label className="block text-gray-700 font-medium mb-2">Shop Banner Image</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 transition-all duration-200 hover:border-emerald-500">
                        <input
                          type="file"
                          name="spShopBannerImage"
                          onChange={handleFileChange}
                          className="w-full text-gray-700"
                        />
                        {shopBannerPreview && (
                          <motion.div 
                            className="mt-4"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <img
                              src={shopBannerPreview}
                              alt="Banner Preview"
                              className="w-full h-48 object-cover rounded-lg shadow-md"
                            />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Form Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t">
              <motion.button
                type="submit"
                className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-200 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <FaStar className="text-sm" />
                Update Profile
                <FaStar className="text-sm" />
              </motion.button>
            </div>
          </motion.form>
        </div>
      </motion.main>
    </>
  );
};

export default Profile;