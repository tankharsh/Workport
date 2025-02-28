import { useEffect, useState } from "react";
import { FaEnvelope, FaLock, FaPhone, FaUser, FaEye, FaEyeSlash, FaStar } from "react-icons/fa";
import { GiShop } from "react-icons/gi";
import {  BiSolidCity } from "react-icons/bi";
import { FaMapLocationDot } from "react-icons/fa6";
import { TbMapPinCode } from "react-icons/tb";
import { PiMapPinAreaFill } from "react-icons/pi";
import Navbar from "../user_components/Navbar";
import Footer from "../user_components/Footer";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from 'axios';



const SP_RegistrationForm = () => {
    // *** Service Provider Registration Api 
    const SERVICE_PROVIDER_REGISTER_API = 'http://localhost:4000/api/sp/sp_register';

    const { showPopup } = useAuth();

    const navigate = useNavigate()
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        sp_name: "",
        sp_email: "",
        sp_contact: "",
        sp_shop_name: "",
        sp_category: [],
        sp_area: "",
        sp_pincode: "",
        sp_block_no: "",
        sp_city: "",
        sp_description:"",
        sp_password: "",
        sp_shop_img: null,
        sp_shop_banner_img: null,
    });
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://localhost:4000/api/categories");
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);


    const handleChange = (e) => {
        const { name, value, type, files, checked } = e.target;



        setFormData((prev) => ({
            ...prev,
            [name]: type === "file"
                ? files[0]  // Handle file upload
                : name === "sp_category"
                    ? checked
                        ? [...(prev.sp_category || []), value]  // Add checked category
                        : (prev.sp_category || []).filter((item) => item !== value)  // Remove unchecked category
                    : value,  // Handle other input types
        }));
    };


    // *** SP Registration 
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const data = new FormData();

        
        
    
        // Append form fields (stringify arrays if needed)
        Object.keys(formData).forEach((key) => {
            if (Array.isArray(formData[key])) {
                data.append(key, JSON.stringify(formData[key]));
            } else if (formData[key]) {
                data.append(key, formData[key]);
            }
        });

        try {
            const res = await fetch(SERVICE_PROVIDER_REGISTER_API, {
                method: "POST",
                body: data,
            });
    
            // Debugging: Log raw response
            console.log("Raw Response:", res);
    
            // Check if response is JSON
            const contentType = res.headers.get("content-type");
            let responseData;
    
            if (contentType && contentType.includes("application/json")) {
                responseData = await res.json();
                console.log("Parsed JSON Response:", responseData);
            } else {
                const rawText = await res.text();
                console.error("Non-JSON Response:", rawText);
                throw new Error("Unexpected server response. Please try again later.");
            }
    
            // Handle success case
            if (res.ok) {
                showPopup("Registration Successful!", "success");
                navigate("/sp-provider-login");
            } else {
                // Ensure errors exist before trying to access them
                if (responseData.errors && Array.isArray(responseData.errors)) {
                    const errorMessages = responseData.errors.map(err => err.msg).join(", ");
                    showPopup(errorMessages, "error");
                    console.log("Validation Errors:", errorMessages);
                } else {
                    showPopup(responseData.message || "Something went wrong!", "error");
                }
            }
        } catch (error) {
            console.error("Error during registration:", error);
            showPopup("Registration failed! Please try again.", "error");
        }
    };
        

    // *** SP Registration Ends

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center p-6 mt-16">
                <div className="bg-white max-w-5xl shadow-lg rounded-lg p-6 w-full">
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">Service Provider Registration</h2>

                    {/* Registration Form  */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <p className="text-gray-400 flex items-center gap-2">
                            <FaStar />Personal Information<FaStar />
                        </p>
                        <div className="flex gap-5">
                            {/* SP Name  */}
                            <div className="flex w-1/2 items-center border border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
                                <FaUser className="mr-2 text-gray-700" />
                                <input
                                    type="text"
                                    name="sp_name"
                                    placeholder="Enter your name"
                                    value={formData.sp_name}
                                    onChange={handleChange}
                                    className="w-full outline-none text-black placeholder:text-gray-700 "
                                    required
                                />
                            </div>

                            {/* SP Email  */}
                            <div className="flex w-1/2 items-center border border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
                                <FaEnvelope className="mr-2 text-gray-500" />
                                <input
                                    type="email"
                                    name="sp_email"
                                    placeholder="Enter your email"
                                    value={formData.sp_email}
                                    onChange={handleChange}
                                    className="w-full outline-none text-black placeholder:text-gray-700"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex gap-5">
                            {/* SP Contact  */}
                            <div className="flex w-1/2 items-center border border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
                                <FaPhone className="mr-2 text-gray-500" />
                                <input
                                    type="text"
                                    name="sp_contact"
                                    placeholder="Enter your contact no"
                                    minLength={10}
                                    maxLength={10}
                                    value={formData.sp_contact}
                                    onChange={(e) => {
                                        const onlyNumbers = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                                        setFormData((prev) => ({ ...prev, sp_contact: onlyNumbers }));
                                    }}
                                    className="w-full outline-none text-black placeholder:text-gray-700"
                                    required
                                />
                            </div>

                            {/* SP Password  */}
                            <div className="flex w-1/2 items-center border border-gray-700 p-2 rounded-md relative hover:scale-95 transition-all duration-200">
                                <FaLock className="mr-2 text-gray-500" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="sp_password"
                                    placeholder="Enter password"
                                    value={formData.sp_password}
                                    onChange={handleChange}
                                    className="w-full outline-none text-black placeholder:text-gray-700"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 text-black"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>
                        <p className="text-gray-400 flex items-center gap-2">
                            <FaStar />Shop Information<FaStar />
                        </p>
                        {/* SP Shop Name  */}
                        <div className="flex items-center border border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
                            <GiShop className="mr-2 text-gray-500" />
                            <input
                                type="text"
                                name="sp_shop_name"
                                placeholder="Enter shop name"
                                value={formData.sp_shop_name}
                                onChange={handleChange}
                                className="w-full outline-none text-black placeholder:text-gray-700"
                                required
                            />
                            
                        </div>

                        {/* SP Category  */}
                        <div className="flex flex-col border border-gray-700 p-2 rounded-md">
                            <p className="text-gray-500 mb-2">Select Service Category:</p>
                            <div className="grid grid-cols-3 gap-2">
                                {categories.map((category) => (
                                    <label key={category._id} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            name="sp_category"
                                            value={category._id}
                                            checked={formData.sp_category.includes(category._id)}
                                            onChange={handleChange}
                                            className="accent-purple-600 "
                                        />
                                        <span className="text-gray-700 capitalize">{category.categoryName}</span>
                                    </label>
                                ))}
                            </div>
                        </div>



                        <div className="flex border items-center border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
                            {/* <BiSolidCategoryAlt className="mr-2 text-gray-500" /> */}
                            <textarea
                                type="text"
                                name="sp_description"
                                placeholder="Enter Shop Description ..."
                                value={formData.sp_description}
                                onChange={handleChange}
                                className="w-full outline-none text-black placeholder-gray-700 placeholder:flex placeholder:items-center"
                                rows={3}
                                required
                            />
                        </div>


                        <p className="text-gray-400 flex items-center gap-2">
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
                                    value={formData.sp_area}
                                    onChange={handleChange}
                                    className="w-full outline-none text-black placeholder:text-gray-700"
                                    required
                                />
                            </div>
                            <div className="flex items-center border border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
                                <FaMapLocationDot className="mr-2 text-gray-500" />
                                <input
                                    type="text"
                                    name="sp_block_no"
                                    placeholder="Block No"
                                    value={formData.sp_block_no}
                                    onChange={handleChange}
                                    className="w-full outline-none text-black placeholder:text-gray-700"
                                    required
                                />
                            </div>
                        </div>

                        {/* SP Pincode  */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center border border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
                                <TbMapPinCode className="mr-2 text-gray-500" />
                                <input
                                    type="text"
                                    name="sp_pincode"
                                    placeholder="Pincode"
                                    value={formData.sp_pincode}
                                    onChange={handleChange}
                                    className="w-full outline-none text-black placeholder:text-gray-700"
                                    required
                                />
                            </div>
                            <div className="flex items-center border border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
                                <BiSolidCity className="mr-2 text-gray-500" />
                                <input
                                    type="text"
                                    name="sp_city"
                                    placeholder="City"
                                    value={formData.sp_city}
                                    onChange={handleChange}
                                    className="w-full outline-none text-black placeholder:text-gray-700"
                                    required
                                />
                            </div>
                        </div>

                        <p className="text-gray-400 flex items-center gap-2">
                            <FaStar />Shop Images <FaStar />
                        </p>
                        <div className="flex gap-5">
                            {/* SP Shop Image upload fields */}
                            <div className="flex w-1/2 items-center border border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
                                <label className="mr-2 text-gray-500">Shop Image</label>
                                <input
                                    type="file"
                                    name="sp_shop_img"
                                    onChange={handleChange}
                                    className="w-full outline-none text-black"
                                    accept="image/*"
                                    required
                                />
                            </div>

                            {/* SP Shop Banner Image upload fields */}
                            <div className="flex w-1/2 items-center border border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
                                <label className="mr-2 text-gray-500">Shop Banner Image</label>
                                <input
                                    type="file"
                                    name="sp_shop_banner_img"
                                    onChange={handleChange}
                                    className="w-full outline-none text-black"
                                    accept="image/*"
                                    required
                                />
                            </div>
                        </div>
                        {/* SP Form Submit Button  */}
                        <button
                            type="submit"
                            className="w-full bg-[#84A98C] text-white py-2 rounded-md hover:bg-blue-600"
                        >
                            Register
                        </button>

                    </form>
                    {/* Registration Form ends */}

                    {/* SP Login Button  */}
                    <span className="flex text-gray-500 justify-center">
                        Already have an account ! &nbsp;
                        <NavLink
                            to='/sp-provider-login'
                            className='text-blue-500'
                        >
                            Sign In
                        </NavLink>
                    </span>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default SP_RegistrationForm;
