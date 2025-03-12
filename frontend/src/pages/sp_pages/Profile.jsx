import { useEffect, useState } from 'react';
import Sidebar from '../../components/sp_components/Sidebar';
import { FaEnvelope, FaPhone, FaUser, FaStar } from "react-icons/fa";
import { GiShop } from "react-icons/gi";
import { BiSolidCity } from "react-icons/bi";
import { FaMapLocationDot } from "react-icons/fa6";
import { TbMapPinCode } from "react-icons/tb";
import { PiMapPinAreaFill } from "react-icons/pi";
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

  return (
    <>
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-5">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <p className="text-gray-400 mb-2 flex items-center gap-2">
                <FaStar />Personal Information<FaStar />
              </p>
              
              {/* SP Name */}
              <div className="flex w-full items-center border border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
                <FaUser className="mr-2 text-gray-500" />
                <input
                  type="text"
                  name="spName"
                  placeholder="Enter your name"
                  value={formData.spName || ""}
                  onChange={handleChange}
                  className="w-full outline-none text-black placeholder:text-gray-700"
                />
              </div>
              
              {/* SP Contact */}
              <div className="flex w-full items-center border border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
                <FaPhone className="mr-2 text-gray-500" />
                <input
                  type="tel"
                  name="spContact"
                  placeholder="Enter your contact number"
                  value={formData.spContact || ""}
                  onChange={handleChange}
                  className="w-full outline-none text-black placeholder:text-gray-700"
                />
              </div>

              {/* SP Email */}
              <div className="flex w-full mt-3 items-center border border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
                <FaEnvelope className="mr-2 text-gray-500" />
                <input
                  type="email"
                  name="spEmail"
                  placeholder="Enter your email"
                  value={formData.spEmail || ""}
                  onChange={handleChange}
                  className="w-full outline-none text-black placeholder:text-gray-700"
                />
              </div>

              <p className="text-gray-400 mt-3 mb-2 flex items-center gap-2">
                <FaStar />Shop Information<FaStar />
              </p>

              {/* Shop Name */}
              <div className="flex items-center border border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
                <GiShop className="mr-2 text-gray-500" />
                <input
                  type="text"
                  name="spShopName"
                  placeholder="Enter shop name"
                  value={formData.spShopName || ""}
                  onChange={handleChange}
                  className="w-full outline-none text-black placeholder:text-gray-700"
                />
              </div>

              {/* Categories */}
              <div className="flex flex-col mt-3 border border-gray-700 p-2 rounded-md">
                <p className="text-gray-500 mb-2">Select Service Category:</p>
                <div className="grid grid-cols-3 gap-2">
                  {categories.map((category) => (
                    <label key={category._id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="spCategories"
                        value={category._id}
                        checked={formData.spCategories?.some(
                          (cat) => cat.categoryId === category._id || cat._id === category._id
                        )}
                        onChange={handleChange}
                        className="accent-purple-600"
                      />
                      <span className="text-gray-700 capitalize">
                        {category.categoryName}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Shop Description */}
              <div className="flex flex-col mt-3 border border-gray-700 p-2 rounded-md">
                <textarea
                  name="spDescription"
                  placeholder="Enter shop description"
                  value={formData.spDescription || ""}
                  onChange={handleChange}
                  className="w-full outline-none text-black placeholder:text-gray-700 resize-none"
                  rows="3"
                />
              </div>

              {/* Shop Address Fields */}
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div className="flex items-center border border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
                  <FaMapLocationDot className="mr-2 text-gray-500" />
                  <input
                    type="text"
                    name="spBlockNo"
                    placeholder="Enter block no"
                    value={formData.spBlockNo || ""}
                    onChange={handleChange}
                    className="w-full outline-none text-black placeholder:text-gray-700"
                  />
                </div>

                <div className="flex items-center border border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
                  <PiMapPinAreaFill className="mr-2 text-gray-500" />
                  <input
                    type="text"
                    name="spArea"
                    placeholder="Enter area"
                    value={formData.spArea || ""}
                    onChange={handleChange}
                    className="w-full outline-none text-black placeholder:text-gray-700"
                  />
                </div>

                <div className="flex items-center border border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
                  <TbMapPinCode className="mr-2 text-gray-500" />
                  <input
                    type="text"
                    name="spPincode"
                    placeholder="Enter pincode"
                    value={formData.spPincode || ""}
                    onChange={handleChange}
                    className="w-full outline-none text-black placeholder:text-gray-700"
                  />
                </div>

                <div className="flex items-center border border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
                  <BiSolidCity className="mr-2 text-gray-500" />
                  <input
                    type="text"
                    name="spCity"
                    placeholder="Enter city"
                    value={formData.spCity || ""}
                    onChange={handleChange}
                    className="w-full outline-none text-black placeholder:text-gray-700"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-gray-400 mb-2 flex items-center gap-2">
                <FaStar />Shop Images<FaStar />
              </p>

              {/* Shop Image */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Shop Image</label>
                <input
                  type="file"
                  name="spShopImage"
                  onChange={handleFileChange}
                  className="w-full text-gray-700"
                />
                {shopImagePreview && (
                  <div className="mt-2">
                    <img
                      src={shopImagePreview}
                      alt="Shop Preview"
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>

              {/* Shop Banner Image */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Shop Banner Image</label>
                <input
                  type="file"
                  name="spShopBannerImage"
                  onChange={handleFileChange}
                  className="w-full text-gray-700"
                />
                {shopBannerPreview && (
                  <div className="mt-2">
                    <img
                      src={shopBannerPreview}
                      alt="Banner Preview"
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors"
            >
              Update Profile
            </button>
          </div>
        </form>
      </main>
    </>
  );
};

export default Profile;