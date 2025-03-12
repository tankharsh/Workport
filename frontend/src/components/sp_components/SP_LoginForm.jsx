import { useState } from 'react';
import Navbar from '../user_components/Navbar';
import Footer from '../user_components/Footer';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../context/AuthContext';

function SP_LoginForm() {

    // *** Service Provider Login Api 
    const SERVICE_PROVIDER_LOGIN_API_URI = "http://localhost:4000/api/sp/sp_login"

    const { showPopup, storeSPToken } = useAuth()

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        spEmail: "",
        spPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);

    // *** SP Login Here 
    const handleSubmit = async (e) => {
        e.preventDefault();

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
                // Email not verified, redirect to verification page
                showPopup('Please verify your email to continue', 'info');
                navigate(`/verify-email?email=${encodeURIComponent(data.spEmail)}&type=sp`);
            } else {
                showPopup('Login Failed: ' + (data.message || "Unknown error"), 'error');
                console.log("Login failed:", data.message || "Unknown error");
            }
        } catch (error) {
            console.error("Unexpected error during login:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // *** SP Login Ends Here

    return (
        <>
            <Helmet>
                <title>Service Provider | Login</title>
                <meta name="description" content="Know more about us." />
                <meta name="author" content="My Website Team" />
            </Helmet>
            <Navbar />
            <div className="min-h-screen p-2 flex items-center justify-center">
                <div className="flex flex-col rounded-lg md:flex-row w-full max-w-4xl h-[60vh] bg-white shadow-lg overflow-hidden">
                    {/* Left Side: Large Text */}
                    <div className="flex-1 bg-gradient-to-r from-blue-500/75 to-purple-600/75 text-white flex items-center justify-center px-8 flex-col">
                        <h1 className="text-2xl md:text-2xl font-bold text-center p-4">
                            &ldquo;Welcome to Registration&rdquo;
                            <br />
                        </h1>
                        <NavLink to="/sp-provider" className="px-6 py-2 rounded-lg hover:scale-95 border-2 border-white">List Your Business</NavLink>
                    </div>

                    {/* Right Side: Form */}
                    <div
                        className="flex-1 flex items-center justify-center px-8 py-8"
                    >
                        <div className="w-full max-w-md">
                            <h2 className="text-2xl font-bold text-black mb-4">Login</h2>
                            <form onSubmit={handleSubmit}>
                                <div>
                                    {/* SP email */}
                                    <div className="flex items-center border border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
                                        <FaEnvelope className="text-gray-500 mr-3" />
                                        <input
                                            type="email"
                                            name="spEmail"
                                            value={formData.spEmail}
                                            onChange={handleChange}
                                            placeholder="Email"
                                            className="w-full outline-none"
                                            required
                                        />
                                    </div>

                                    {/* SP Password */}
                                    <div className="flex items-center border border-gray-700 p-2 rounded-md mt-4 hover:scale-95 transition-all duration-200">
                                        <FaLock className="text-gray-500 mr-3" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="spPassword"
                                            value={formData.spPassword}
                                            onChange={handleChange}
                                            placeholder="Password"
                                            className="w-full outline-none"
                                            required
                                        />
                                        <div
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="cursor-pointer"
                                        >
                                            {showPassword ? (
                                                <FaEyeSlash className="text-gray-500" />
                                            ) : (
                                                <FaEye className="text-gray-500" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-all duration-200"
                                    >
                                        Login
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default SP_LoginForm;
