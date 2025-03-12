import { useEffect, useState } from "react";
import { FaEnvelope, FaLock, FaPhone, FaUser, FaEye, FaEyeSlash, FaStar } from "react-icons/fa";
import { GiShop } from "react-icons/gi";
import { BiSolidCity } from "react-icons/bi";
import { FaMapLocationDot } from "react-icons/fa6";
import { TbMapPinCode } from "react-icons/tb";
import { PiMapPinAreaFill } from "react-icons/pi";
import { motion } from "framer-motion";
import Navbar from "../user_components/Navbar";
import Footer from "../user_components/Footer";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Helmet } from "react-helmet-async";
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
            <Helmet>
                <title>WorkPort | Service Provider Registration</title>
                <meta name="description" content="Register as a service provider on WorkPort" />
            </Helmet>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center py-20 px-6 bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-800">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl p-8 w-full max-w-5xl relative overflow-hidden"
                >
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-10"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-200 rounded-full translate-y-1/2 -translate-x-1/2 opacity-10"></div>
                    
                    {/* Pattern Overlay */}
                    <div className="absolute inset-0 opacity-5" style={{ 
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2310b981' fill-opacity='0.2' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")` 
                    }}></div>

                    <div className="relative">
                        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Service Provider Registration</h2>
                        <p className="text-emerald-600 text-center mb-8">Join our community of service providers</p>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Personal Information Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-emerald-600 mb-4">
                                    <FaStar className="text-sm" />
                                    <h3 className="text-lg font-semibold">Personal Information</h3>
                                    <FaStar className="text-sm" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Name Input */}
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-emerald-500 group-hover:text-emerald-600 transition-colors">
                                            <FaUser className="transition-transform group-hover:scale-110" />
                                        </div>
                                        <input
                                            type="text"
                                            name="spName"
                                            placeholder="Enter your name"
                                            value={formData.spName}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all hover:border-emerald-200"
                                            required
                                        />
                                    </div>

                                    {/* Email Input */}
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-emerald-500 group-hover:text-emerald-600 transition-colors">
                                            <FaEnvelope className="transition-transform group-hover:scale-110" />
                                        </div>
                                        <input
                                            type="email"
                                            name="spEmail"
                                            placeholder="Enter your email"
                                            value={formData.spEmail}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all hover:border-emerald-200"
                                            required
                                        />
                                    </div>

                                    {/* Contact Input */}
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-emerald-500 group-hover:text-emerald-600 transition-colors">
                                            <FaPhone className="transition-transform group-hover:scale-110" />
                                        </div>
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
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all hover:border-emerald-200"
                                            required
                                        />
                                    </div>

                                    {/* Password Input */}
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-emerald-500 group-hover:text-emerald-600 transition-colors">
                                            <FaLock className="transition-transform group-hover:scale-110" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="spPassword"
                                            placeholder="Enter password"
                                            value={formData.spPassword}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all hover:border-emerald-200"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-emerald-600 transition-colors"
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Shop Information Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-emerald-600 mb-4">
                                    <FaStar className="text-sm" />
                                    <h3 className="text-lg font-semibold">Shop Information</h3>
                                    <FaStar className="text-sm" />
                                </div>

                                {/* Shop Name */}
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-emerald-500 group-hover:text-emerald-600 transition-colors">
                                        <GiShop className="transition-transform group-hover:scale-110" />
                                    </div>
                                    <input
                                        type="text"
                                        name="spShopName"
                                        placeholder="Enter shop name"
                                        value={formData.spShopName}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all hover:border-emerald-200"
                                        required
                                    />
                                </div>

                                {/* Categories */}
                                <div className="bg-gray-50 rounded-xl p-6 space-y-3 border border-gray-200">
                                    <p className="text-emerald-600 font-medium mb-4">Select Service Categories:</p>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {categories.map((category) => (
                                            <label key={category._id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white transition-colors">
                                                <input
                                                    type="checkbox"
                                                    name="spCategories"
                                                    value={category._id}
                                                    checked={formData.spCategories.includes(category._id)}
                                                    onChange={handleChange}
                                                    className="form-checkbox h-5 w-5 text-emerald-500 rounded border-gray-300 focus:ring-emerald-500 transition-colors"
                                                />
                                                <span className="text-gray-700 capitalize">{category.categoryName}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Shop Address */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-emerald-500 group-hover:text-emerald-600 transition-colors">
                                            <FaMapLocationDot className="transition-transform group-hover:scale-110" />
                                        </div>
                                        <input
                                            type="text"
                                            name="spBlockNo"
                                            placeholder="Enter block no"
                                            value={formData.spBlockNo}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all hover:border-emerald-200"
                                            required
                                        />
                                    </div>

                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-emerald-500 group-hover:text-emerald-600 transition-colors">
                                            <PiMapPinAreaFill className="transition-transform group-hover:scale-110" />
                                        </div>
                                        <input
                                            type="text"
                                            name="spArea"
                                            placeholder="Enter area"
                                            value={formData.spArea}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all hover:border-emerald-200"
                                            required
                                        />
                                    </div>

                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-emerald-500 group-hover:text-emerald-600 transition-colors">
                                            <TbMapPinCode className="transition-transform group-hover:scale-110" />
                                        </div>
                                        <input
                                            type="text"
                                            name="spPincode"
                                            placeholder="Enter pincode"
                                            value={formData.spPincode}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all hover:border-emerald-200"
                                            required
                                        />
                                    </div>

                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-emerald-500 group-hover:text-emerald-600 transition-colors">
                                            <BiSolidCity className="transition-transform group-hover:scale-110" />
                                        </div>
                                        <input
                                            type="text"
                                            name="spCity"
                                            placeholder="Enter city"
                                            value={formData.spCity}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all hover:border-emerald-200"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Shop Description */}
                                <div className="relative">
                                    <textarea
                                        name="spDescription"
                                        placeholder="Enter shop description"
                                        value={formData.spDescription}
                                        onChange={handleChange}
                                        className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all hover:border-emerald-200 resize-none"
                                        rows="3"
                                        required
                                    />
                                </div>

                                {/* Shop Images */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-emerald-600">Shop Image</label>
                                        <div className="relative group">
                                            <input
                                                type="file"
                                                name="spShopImage"
                                                onChange={handleChange}
                                                accept="image/*"
                                                className="w-full text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-all"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-emerald-600">Shop Banner Image</label>
                                        <div className="relative group">
                                            <input
                                                type="file"
                                                name="spShopBannerImage"
                                                onChange={handleChange}
                                                accept="image/*"
                                                className="w-full text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-all"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-xl hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-300 relative overflow-hidden group transform hover:scale-[1.02]"
                            >
                                <span className="absolute w-64 h-64 mt-12 group-hover:-rotate-45 transition-all duration-500 ease-out -translate-x-20 -translate-y-32 bg-white opacity-10 rounded-full"></span>
                                <span className="relative">Register as Service Provider</span>
                            </button>

                            <p className="text-center text-gray-600">
                                Already have an account?{" "}
                                <NavLink to="/sp-provider-login" className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline transition-colors">
                                    Login here
                                </NavLink>
                            </p>
                        </form>
                    </div>
                </motion.div>
            </div>
            <Footer />
        </>
    );
};

export default SP_RegistrationForm;
