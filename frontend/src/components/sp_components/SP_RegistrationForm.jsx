import React, { useState } from "react";
import { FaEnvelope, FaLock, FaPhone, FaUser } from "react-icons/fa";
import { GiShop } from "react-icons/gi";
import { BiSolidCategoryAlt, BiSolidCity } from "react-icons/bi";
import { FaMapLocationDot } from "react-icons/fa6";
import { TbMapPinCode } from "react-icons/tb";
import { PiMapPinAreaFill } from "react-icons/pi";
import axios from "axios";
import Navbar from "../user_components/Navbar";
import Footer from "../user_components/Footer";
import { NavLink } from "react-router-dom";

const SP_RegistrationForm = () => {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });

        try {
            const response = await axios.post(
                "http://localhost:4000/api/sp/sp_register",
                data,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            alert("Registration Successful");
        } catch (error) {
            console.error("Error:", error);
            alert("Registration Failed");
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center bg-gray-300 p-6">
                <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
                    <h2 className="text-2xl font-bold text-center mb-4">Service Provider Registration</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                        {/* Image upload fields */}
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

                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                        >
                            Register
                        </button>

                    </form>
                    <NavLink
                        to='/sp-provider-login'
                    >Login HERE</NavLink>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default SP_RegistrationForm;
