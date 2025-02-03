import React, { useState } from "react";
import { FaEnvelope, FaLock, FaPhone, FaUser } from "react-icons/fa";
import { GiShop } from "react-icons/gi";
import { BiSolidCategoryAlt, BiSolidCity } from "react-icons/bi";
import { FaMapLocationDot } from "react-icons/fa6";
import { TbMapPinCode } from "react-icons/tb";
import { PiMapPinAreaFill } from "react-icons/pi";
import Navbar from "../user_components/Navbar";
import Footer from "../user_components/Footer";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const SP_RegistrationForm = () => {
    // *** Service Provider Registration Api 
    const SERVICE_PROVIDER_REGISTER_API = 'http://localhost:4000/api/sp/sp_register';

    const { showPopup } = useAuth();

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        sp_name: "",
        sp_email: "",
        sp_contact: "",
        sp_shop_name: "",
        sp_category: "",
        sp_area: "",
        sp_pincode: "",
        sp_block_no: "",
        sp_city: "",
        sp_password: "",
        sp_shop_img: null,
        sp_shop_banner_img: null,
    });

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "file" ? files[0] : value,
        }));
    };

    // *** SP Registration 
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });

        try {
            const res = await fetch(SERVICE_PROVIDER_REGISTER_API, {
                method: 'POST',
                body: data, // Sending FormData with the request
            });
            const responseData = await res.json();

            if (res.ok) {
                showPopup('Registration Successful!', 'success');
                console.log("Registration successful:", responseData.message);
                setFormData('');
                navigate('/sp-provider-login')
            } else {
                showPopup('Registration failed!', 'error');
                console.error("Registration failed:", responseData.message);
            }
        } catch (error) {
            console.log("Error:", error);
            showPopup('Registration failed!', 'error');
        }
    };
    // *** SP Registration Ends

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center bg-gray-300 p-6">
                <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
                    <h2 className="text-2xl font-bold text-center mb-4">Service Provider Registration</h2>

                    {/* Registration Form  */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* SP Name  */}
                        <div className="flex items-center border p-2 rounded-md">
                            <FaUser className="mr-2 text-gray-500" />
                            <input
                                type="text"
                                name="sp_name"
                                placeholder="Enter your name"
                                value={formData.sp_name}
                                onChange={handleChange}
                                className="w-full outline-none"
                                required
                            />
                        </div>

                        {/* SP Email  */}
                        <div className="flex items-center border p-2 rounded-md">
                            <FaEnvelope className="mr-2 text-gray-500" />
                            <input
                                type="email"
                                name="sp_email"
                                placeholder="Enter your email"
                                value={formData.sp_email}
                                onChange={handleChange}
                                className="w-full outline-none"
                                required
                            />
                        </div>

                        {/* SP Contact  */}
                        <div className="flex items-center border p-2 rounded-md">
                            <FaPhone className="mr-2 text-gray-500" />
                            <input
                                type="tel"
                                name="sp_contact"
                                placeholder="Enter your contact no"
                                value={formData.sp_contact}
                                onChange={handleChange}
                                className="w-full outline-none"
                                required
                            />
                        </div>

                        {/* SP Shop Name  */}
                        <div className="flex items-center border p-2 rounded-md">
                            <GiShop className="mr-2 text-gray-500" />
                            <input
                                type="text"
                                name="sp_shop_name"
                                placeholder="Enter shop name"
                                value={formData.sp_shop_name}
                                onChange={handleChange}
                                className="w-full outline-none"
                                required
                            />
                        </div>

                        {/* SP Category  */}
                        <div className="flex items-center border p-2 rounded-md">
                            <BiSolidCategoryAlt className="mr-2 text-gray-500" />
                            <input
                                type="text"
                                name="sp_category"
                                placeholder="Enter category"
                                value={formData.sp_category}
                                onChange={handleChange}
                                className="w-full outline-none"
                                required
                            />
                        </div>

                        {/* SP Area  */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center border p-2 rounded-md">
                                <PiMapPinAreaFill className="mr-2 text-gray-500" />
                                <input
                                    type="text"
                                    name="sp_area"
                                    placeholder="Shop Area"
                                    value={formData.sp_area}
                                    onChange={handleChange}
                                    className="w-full outline-none"
                                    required
                                />
                            </div>
                            <div className="flex items-center border p-2 rounded-md">
                                <FaMapLocationDot className="mr-2 text-gray-500" />
                                <input
                                    type="text"
                                    name="sp_block_no"
                                    placeholder="Block No"
                                    value={formData.sp_block_no}
                                    onChange={handleChange}
                                    className="w-full outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* SP Pincode  */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center border p-2 rounded-md">
                                <TbMapPinCode className="mr-2 text-gray-500" />
                                <input
                                    type="text"
                                    name="sp_pincode"
                                    placeholder="Pincode"
                                    value={formData.sp_pincode}
                                    onChange={handleChange}
                                    className="w-full outline-none"
                                    required
                                />
                            </div>
                            <div className="flex items-center border p-2 rounded-md">
                                <BiSolidCity className="mr-2 text-gray-500" />
                                <input
                                    type="text"
                                    name="sp_city"
                                    placeholder="City"
                                    value={formData.sp_city}
                                    onChange={handleChange}
                                    className="w-full outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* SP Password  */}
                        <div className="flex items-center border p-2 rounded-md">
                            <FaLock className="mr-2 text-gray-500" />
                            <input
                                type="password"
                                name="sp_password"
                                placeholder="Enter password"
                                value={formData.sp_password}
                                onChange={handleChange}
                                className="w-full outline-none"
                                required
                            />
                        </div>

                        {/* SP Shop Image upload fields */}
                        <div className="flex items-center border p-2 rounded-md">
                            <label className="mr-2 text-gray-500">Shop Image</label>
                            <input
                                type="file"
                                name="sp_shop_img"
                                onChange={handleChange}
                                className="w-full outline-none"
                                accept="image/*"
                                required
                            />
                        </div>

                        {/* SP Shop Banner Image upload fields */}
                        <div className="flex items-center border p-2 rounded-md">
                            <label className="mr-2 text-gray-500">Shop Banner Image</label>
                            <input
                                type="file"
                                name="sp_shop_banner_img"
                                onChange={handleChange}
                                className="w-full outline-none"
                                accept="image/*"
                                required
                            />
                        </div>

                        {/* SP Form Submit Button  */}
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                        >
                            Register
                        </button>

                    </form>
                    {/* Registration Form ends */}

                    {/* SP Login Button  */}
                    <span className="flex justify-center">
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
