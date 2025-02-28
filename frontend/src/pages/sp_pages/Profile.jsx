import { useEffect, useState } from 'react';
import Sidebar from '../../components/sp_components/Sidebar';
import { FaEnvelope, FaPhone, FaUser, FaStar } from "react-icons/fa";
import { GiShop } from "react-icons/gi";
import {  BiSolidCity } from "react-icons/bi";
import { FaMapLocationDot } from "react-icons/fa6";
import { TbMapPinCode } from "react-icons/tb";
import { PiMapPinAreaFill } from "react-icons/pi";
import axios from 'axios';
import Swal from "sweetalert2";

const Profile = () => {


  const [formData, setFormData] = useState({
    sp_name: "",
    sp_email: "",
    sp_contact: "",
    sp_shop_name: "",
    shopDescription: "",
    sp_block_no: "",
    sp_area: "",
    sp_pincode: "",
    sp_city: "",
    sp_shop_img: "",
    sp_shop_banner_img: "",
    categories: [],
  });

  const [shopImagePreview, setShopImagePreview] = useState(null);
  const [shopBannerPreview, setShopBannerPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const storedUser = JSON.parse(localStorage.getItem("SP_LoggedInUser"));
  const SPId = storedUser?.id || "";

  useEffect(() => {
    if (!SPId) return;
    
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/sp/providers/${SPId}`);
        setFormData(response.data);
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
  
    setFormData((prevData) => ({
      ...prevData,
      provider: {
        ...prevData.provider,
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  };
  

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
      
      const previewURL = URL.createObjectURL(files[0]);
      if (name === "sp_shop_img") setShopImagePreview(previewURL);
      if (name === "sp_shop_banner_img") setShopBannerPreview(previewURL);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
  
    // Flatten formData if it's nested under `provider`
    const flattenedData = formData.provider ? formData.provider : formData;
  
    Object.keys(flattenedData).forEach((key) => {
      if (Array.isArray(flattenedData[key])) {
        data.append(key, JSON.stringify(flattenedData[key]));
      } else if (flattenedData[key] instanceof File) {
        data.append(key, flattenedData[key]); // Append file correctly
      } else {
        data.append(key, flattenedData[key]);
      }
    });
  
    // Ensure images are appended as files (not just strings)
    if (flattenedData.sp_shop_img instanceof File) {
      data.append("sp_shop_img", flattenedData.sp_shop_img);
    }
    if (flattenedData.sp_shop_banner_img instanceof File) {
      data.append("sp_shop_banner_img", flattenedData.sp_shop_banner_img);
    }
  
    try {
      const response = await axios.put(`http://localhost:4000/api/sp/update/${SPId}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (response?.status === 200 && response?.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Profile updated successfully!",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response?.data?.message || "Update failed! Try again.",
        });
      }
    } catch (error) {
      console.error("❌ Error updating profile:", error.response?.data || error.message);
      console.log("🔍 Full error object:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Update failed! Try again.",
      });
    }
  };

  return (
    <>
      <Sidebar />
      <main className="flex-1 lg:ml-64 min-h-screen mt-16 p-10">
        <form onSubmit={handleSubmit} className="p-4 bg-white shadow-xl rounded w-full mx-auto">
          <h2 className="text-xl font-bold text-black mb-4">Edit Provider Details</h2>

          <div className="flex gap-5">
            {/* SP Name  */}
            <div className="flex w-1/2 items-center border border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
              <FaUser className="mr-2 text-gray-700" />
              <input
                type="text"
                name="sp_name"
                placeholder="Enter your name"
                value={formData?.provider?.sp_name }
                onChange={handleChange}
                className="w-full outline-none text-black placeholder:text-gray-700 "

              />
            </div>

            {/* contact  */}
            <div className="flex w-1/2 items-center border border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
              <FaPhone className="mr-2 text-gray-500" />
              <input
                type="tel"
                name="sp_contact"
                placeholder="Enter your contact no"
                value={formData?.provider?.sp_contact}
                onChange={handleChange}
                className="w-full outline-none text-black placeholder:text-gray-700"

              />
            </div>
          </div>

          {/* SP Email  */}
          <div className="flex w-full mt-3 items-center border border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
            <FaEnvelope className="mr-2 text-gray-500" />
            <input
              type="email"
              name="sp_email"
              placeholder="Enter your email"
              value={formData?.provider?.sp_email}
              onChange={handleChange}
              className="w-full outline-none text-black placeholder:text-gray-700"

            />
          </div>

          <p className="text-gray-400 mt-3 mb-2 flex items-center gap-2">
            <FaStar />Shop Information<FaStar />
          </p>
          {/* SP Shop Name  */}
          <div className="flex items-center border border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
            <GiShop className="mr-2 text-gray-500" />
            <input
              type="text"
              name="sp_shop_name"
              placeholder="Enter shop name"
              value={formData?.provider?.sp_shop_name}
              onChange={handleChange}
              className="w-full outline-none text-black placeholder:text-gray-700"

            />
          </div>
          {/* SP Category  */}
          <div className="flex flex-col mt-3 border border-gray-700 p-2 rounded-md">
            <p className="text-gray-500 mb-2">Select Service Category:</p>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((category) => (
                <label key={category._id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="sp_category"
                    value={category._id}
                    checked={formData?.provider?.category}
                    onChange={handleChange}
                    className="accent-purple-600"
                  />
                  <span className="text-gray-700">{category.categoryName}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex mt-3 border items-center border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
            {/* <BiSolidCategoryAlt className="mr-2 text-gray-500" /> */}
            <textarea
              name="sp_desc"
              placeholder="Enter Shop Description ..."
              value={formData?.provider?.sp_desc}
              onChange={handleChange}
              className="w-full outline-none text-black placeholder-gray-700 placeholder:flex placeholder:items-center"
              rows={3}

            />
          </div>

          <p className="text-gray-400 mt-3 mb-2 flex items-center gap-2">
            <FaStar />Shop Address<FaStar />
          </p>
          {/* SP Area  */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center border p-2 border-gray-700 rounded-md hover:scale-95 transition-all duration-200">
              <PiMapPinAreaFill className="mr-2 text-gray-500" />
              <input
                type="text"
                name="sp_area"
                placeholder="Shop Area"
                value={formData?.provider?.sp_area}
                onChange={handleChange}
                className="w-full outline-none text-black placeholder:text-gray-700"

              />
            </div>
            <div className="flex items-center border border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
              <FaMapLocationDot className="mr-2 text-gray-500" />
              <input
                type="text"
                name="sp_block_no"
                placeholder="Block No"
                value={formData?.provider?.sp_block_no}
                onChange={handleChange}
                className="w-full outline-none text-black placeholder:text-gray-700"

              />
            </div>
          </div>

          <div className="grid grid-cols-2 mt-3 gap-4">
            <div className="flex items-center border border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
              <TbMapPinCode className="mr-2 text-gray-500" />
              <input
                type="text"
                name="sp_pincode"
                placeholder="Pincode"
                value={formData?.provider?.sp_pincode}
                onChange={handleChange}
                className="w-full outline-none text-black placeholder:text-gray-700"

              />
            </div>
            <div className="flex items-center border border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
              <BiSolidCity className="mr-2 text-gray-500" />
              <input
                type="text"
                name="sp_city"
                placeholder="City"
                value={formData.provider?.sp_city}
                onChange={handleChange}
                className="w-full outline-none text-black placeholder:text-gray-700"

              />
            </div>
          </div>

          <p className="text-gray-400 flex mt-3 mb-2 items-center gap-2">
            <FaStar /> Shop Images <FaStar />
          </p>
          <div className="flex gap-5">
            {/* SP Shop Image upload fields */}
            <div className="flex flex-col w-1/2 items-center border border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
              <label className="mr-2 text-gray-500">Shop Image</label>
              <input
                type="file"
                name="sp_shop_img"
                onChange={handleFileChange}
                className="w-full outline-none text-black"
                accept="image/*"

              />
              {shopImagePreview && <img src={shopImagePreview} alt="Shop Preview" width={100} />}
            </div>

            {/* SP Shop Banner Image upload fields */}
            <div className="flex flex-col w-1/2 items-center border border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
              <label className="mr-2 text-gray-500">Shop Banner Image</label>
              <input
                type="file"
                name="sp_shop_banner_img"
                onChange={handleFileChange}
                className="w-full outline-none text-black"
                accept="image/*"
              />
              {shopBannerPreview && <img src={shopBannerPreview} alt="Banner Preview" width={100} />}
            </div>
          </div>

          <button type="submit" className="bg-blue-500 mt-3 text-white p-2 rounded">
            Update Details
          </button>
        </form>
      </main>
    </>
  );
};

export default Profile;