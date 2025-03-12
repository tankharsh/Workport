import { useEffect, useState } from "react";
import { FaEnvelope, FaLock, FaPhone, FaUser, FaEye, FaEyeSlash, FaStar } from "react-icons/fa";
import { GiShop } from "react-icons/gi";
import { BiSolidCity } from "react-icons/bi";
import { FaMapLocationDot } from "react-icons/fa6";
import { TbMapPinCode } from "react-icons/tb";
import { PiMapPinAreaFill } from "react-icons/pi";
import Navbar from "../user_components/Navbar";
import Footer from "../user_components/Footer";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from 'axios';

const SP_RegistrationForm = () => {
    const SERVICE_PROVIDER_REGISTER_API = 'http://localhost:4000/api/sp/sp_register';

    const { showPopup } = useAuth();
    const navigate = useNavigate()
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        spName: "",
        spEmail: "",
        spContact: "",
        spShopName: "",
        spCategories: [],
        spArea: "",
        spPincode: "",
        spBlockNo: "",
        spCity: "",
        spDescription: "",
        spPassword: "",
        spShopImage: null,
        spShopBannerImage: null,
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
                : name === "spCategories"
                    ? checked
                        ? [...(prev.spCategories || []), value]  // Add checked category
                        : (prev.spCategories || []).filter((item) => item !== value)  // Remove unchecked category
                    : value,  // Handle other input types
        }));
    };

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
    
            if (res.ok) {
                if (responseData.requiresVerification) {
                    showPopup("Registration Successful! Please verify your email.", "success");
                    navigate(`/verify-email?email=${encodeURIComponent(formData.spEmail)}&type=sp`);
                } else {
                    showPopup("Registration Successful!", "success");
                    navigate("/sp-provider-login");
                }
            } else {
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

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center p-6 mt-16">
                <div className="bg-white max-w-5xl shadow-lg rounded-lg p-6 w-full">
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">Service Provider Registration</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <p className="text-gray-400 flex items-center gap-2">
                            <FaStar />Personal Information<FaStar />
                        </p>
                        <div className="flex gap-5">
                            {/* SP Name */}
                            <div className="flex w-1/2 items-center border border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
                                <FaUser className="mr-2 text-gray-700" />
                                <input
                                    type="text"
                                    name="spName"
                                    placeholder="Enter your name"
                                    value={formData.spName}
                                    onChange={handleChange}
                                    className="w-full outline-none text-black placeholder:text-gray-700"
                                    required
                                />
                            </div>

                            {/* SP Email */}
                            <div className="flex w-1/2 items-center border border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
                                <FaEnvelope className="mr-2 text-gray-500" />
                                <input
                                    type="email"
                                    name="spEmail"
                                    placeholder="Enter your email"
                                    value={formData.spEmail}
                                    onChange={handleChange}
                                    className="w-full outline-none text-black placeholder:text-gray-700"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex gap-5">
                            {/* SP Contact */}
                            <div className="flex w-1/2 items-center border border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
                                <FaPhone className="mr-2 text-gray-500" />
                                <input
                                    type="text"
                                    name="spContact"
                                    placeholder="Enter your contact no"
                                    minLength={10}
                                    maxLength={10}
                                    value={formData.spContact}
                                    onChange={(e) => {
                                        const onlyNumbers = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                                        setFormData((prev) => ({ ...prev, spContact: onlyNumbers }));
                                    }}
                                    className="w-full outline-none text-black placeholder:text-gray-700"
                                    required
                                />
                            </div>

                            {/* SP Password */}
                            <div className="flex w-1/2 items-center border border-gray-700 p-2 rounded-md relative hover:scale-95 transition-all duration-200">
                                <FaLock className="mr-2 text-gray-500" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="spPassword"
                                    placeholder="Enter password"
                                    value={formData.spPassword}
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

                        {/* SP Shop Name */}
                        <div className="flex items-center border border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
                            <GiShop className="mr-2 text-gray-500" />
                            <input
                                type="text"
                                name="spShopName"
                                placeholder="Enter shop name"
                                value={formData.spShopName}
                                onChange={handleChange}
                                className="w-full outline-none text-black placeholder:text-gray-700"
                                required
                            />
                        </div>

                        {/* SP Categories */}
                        <div className="flex flex-col border border-gray-700 p-2 rounded-md">
                            <p className="text-gray-500 mb-2">Select Service Category:</p>
                            <div className="grid grid-cols-3 gap-2">
                                {categories.map((category) => (
                                    <label key={category._id} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            name="spCategories"
                                            value={category._id}
                                            checked={formData.spCategories.includes(category._id)}
                                            onChange={handleChange}
                                            className="accent-purple-600"
                                        />
                                        <span className="text-gray-700 capitalize">{category.categoryName}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Shop Address Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center border border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
                                <FaMapLocationDot className="mr-2 text-gray-500" />
                                <input
                                    type="text"
                                    name="spBlockNo"
                                    placeholder="Enter block no"
                                    value={formData.spBlockNo}
                                    onChange={handleChange}
                                    className="w-full outline-none text-black placeholder:text-gray-700"
                                    required
                                />
                            </div>

                            <div className="flex items-center border border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
                                <PiMapPinAreaFill className="mr-2 text-gray-500" />
                                <input
                                    type="text"
                                    name="spArea"
                                    placeholder="Enter area"
                                    value={formData.spArea}
                                    onChange={handleChange}
                                    className="w-full outline-none text-black placeholder:text-gray-700"
                                    required
                                />
                            </div>

                            <div className="flex items-center border border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
                                <TbMapPinCode className="mr-2 text-gray-500" />
                                <input
                                    type="text"
                                    name="spPincode"
                                    placeholder="Enter pincode"
                                    value={formData.spPincode}
                                    onChange={handleChange}
                                    className="w-full outline-none text-black placeholder:text-gray-700"
                                    required
                                />
                            </div>

                            <div className="flex items-center border border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
                                <BiSolidCity className="mr-2 text-gray-500" />
                                <input
                                    type="text"
                                    name="spCity"
                                    placeholder="Enter city"
                                    value={formData.spCity}
                                    onChange={handleChange}
                                    className="w-full outline-none text-black placeholder:text-gray-700"
                                    required
                                />
                            </div>
                        </div>

                        {/* Shop Description */}
                        <div className="flex flex-col border border-gray-700 p-2 rounded-md">
                            <textarea
                                name="spDescription"
                                placeholder="Enter shop description"
                                value={formData.spDescription}
                                onChange={handleChange}
                                className="w-full outline-none text-black placeholder:text-gray-700 resize-none"
                                rows="3"
                                required
                            />
                        </div>

                        {/* Shop Images */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="text-gray-500 mb-2">Shop Image:</label>
                                <input
                                    type="file"
                                    name="spShopImage"
                                    onChange={handleChange}
                                    accept="image/*"
                                    className="text-gray-700"
                                    required
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-gray-500 mb-2">Shop Banner Image:</label>
                                <input
                                    type="file"
                                    name="spShopBannerImage"
                                    onChange={handleChange}
                                    accept="image/*"
                                    className="text-gray-700"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors"
                        >
                            Register
                        </button>

                        <p className="text-center text-gray-600">
                            Already have an account?{" "}
                            <NavLink to="/sp-provider-login" className="text-purple-600 hover:underline">
                                Login here
                            </NavLink>
                        </p>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default SP_RegistrationForm;
