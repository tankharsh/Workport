import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../user_components/Navbar';
import Footer from '../user_components/Footer';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../context/AuthContext';

function SP_LoginForm() {
    const SERVICE_PROVIDER_LOGIN_API_URI = "http://localhost:4000/api/sp/sp_login"
    const { showPopup, storeSPToken } = useAuth()
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        spEmail: "",
        spPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch(SERVICE_PROVIDER_LOGIN_API_URI, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    spEmail: formData.spEmail,
                    spPassword: formData.spPassword
                }),
            });

            const data = await res.json();

            if (res.ok) {
                console.log("Login successful:", data);
                storeSPToken(data.token, data.serviceProvider);
                showPopup('Login Successful !', 'success')
                setFormData({
                    spEmail: "",
                    spPassword: ""
                });
                navigate('/dashboard', { replace: true })
            } else if (res.status === 403 && data.requiresVerification) {
                showPopup('Please verify your email to continue', 'info');
                navigate(`/verify-email?email=${encodeURIComponent(formData.spEmail)}&type=sp`);
            } else {
                showPopup('Login Failed: ' + (data.message || "Unknown error"), 'error');
                console.log("Login failed:", data.message || "Unknown error");
            }
        } catch (error) {
            console.error("Unexpected error during login:", error);
            showPopup('An unexpected error occurred', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <>
            <Helmet>
                <title>WorkPort | Service Provider Login</title>
                <meta name="description" content="Login to your service provider account" />
            </Helmet>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center py-20 px-6 bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-800 relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10" style={{ 
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.2' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '24px 24px'
                }}></div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-4xl"
                >
                    <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden relative">
                        {/* Decorative Elements */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600"></div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-10"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-200 rounded-full translate-y-1/2 -translate-x-1/2 opacity-10"></div>

                        {/* Pattern Overlay */}
                        <div className="absolute inset-0 opacity-5" style={{ 
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2310b981' fill-opacity='0.2' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")` 
                        }}></div>

                        <div className="flex flex-col md:flex-row">
                            {/* Left Side: Welcome Message */}
                            <div className="w-full md:w-1/2 bg-gradient-to-br from-emerald-500 to-emerald-700 p-8 text-white relative overflow-hidden">
                                <div className="absolute inset-0 bg-white/5"></div>
                                <div className="absolute inset-0" style={{ 
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.2' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
                                    opacity: '0.2'
                                }}></div>
                                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
                                    <h1 className="text-3xl font-bold mb-6">Welcome Back!</h1>
                                    <p className="text-emerald-100 mb-8">Access your service provider dashboard and manage your business</p>
                                    <NavLink 
                                        to="/sp-provider" 
                                        className="px-6 py-2 rounded-xl border-2 border-white/80 hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
                                    >
                                        List Your Business
                                    </NavLink>
                                </div>
                            </div>

                            {/* Right Side: Login Form */}
                            <div className="w-full md:w-1/2 p-8">
                                <div className="max-w-md mx-auto">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Login to Your Account</h2>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Email Input */}
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-emerald-500 group-hover:text-emerald-600 transition-colors">
                                                <FaEnvelope className="transition-transform group-hover:scale-110" />
                                            </div>
                                            <input
                                                type="email"
                                                name="spEmail"
                                                value={formData.spEmail}
                                                onChange={handleChange}
                                                placeholder="Email address"
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
                                                value={formData.spPassword}
                                                onChange={handleChange}
                                                placeholder="Password"
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

                                        <div className="flex items-center justify-between text-sm">
                                            <label className="flex items-center space-x-2 text-gray-600 cursor-pointer group">
                                                <input type="checkbox" className="form-checkbox h-4 w-4 text-emerald-500 rounded focus:ring-emerald-500 transition-colors" />
                                                <span className="group-hover:text-gray-900 transition-colors">Remember me</span>
                                            </label>
                                            <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors hover:underline">
                                                Forgot password?
                                            </a>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-xl hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-300 relative overflow-hidden group transform hover:scale-[1.02]"
                                        >
                                            <span className="absolute w-64 h-64 mt-12 group-hover:-rotate-45 transition-all duration-500 ease-out -translate-x-20 -translate-y-32 bg-white opacity-10 rounded-full"></span>
                                            <span className="relative inline-flex items-center justify-center">
                                                {isLoading ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Signing in...
                                                    </>
                                                ) : (
                                                    'Sign In'
                                                )}
                                            </span>
                                        </button>

                                        <p className="text-center text-gray-600">
                                            Don't have an account?{" "}
                                            <NavLink to="/sp-provider" className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline transition-colors">
                                                Register here
                                            </NavLink>
                                        </p>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
            <Footer />
        </>
    );
}

export default SP_LoginForm;
