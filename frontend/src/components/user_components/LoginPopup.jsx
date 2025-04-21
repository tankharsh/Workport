import { useState, useEffect } from "react";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LoginPopup() {
    const USER_LOGIN_API_URI = "http://localhost:4000/api/users/login";
    const { storeUserToken, showPopup, user, serviceprovider } = useAuth();
    const [showPopupp, setShowPopupp] = useState(false);
    const [useremail, setUseremail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // Check if user is already logged in
    useEffect(() => {
        if (user) {
            // If user is logged in, don't show popup
            setShowPopupp(false);
        } else {
            const timer = setTimeout(() => {
                setShowPopupp(true);
                document.body.style.overflow = "hidden";
            }, 5000);
            return () => {
                clearTimeout(timer);
                document.body.style.overflow = "auto";
            };
        }
    }, [user]);

    const closePopup = () => {
        setShowPopupp(false);
        document.body.style.overflow = "auto";
    };

    //  *** Login Logic here
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Fix: Use userEmail instead of useremail to match backend expectations
        const credentials = { userEmail: useremail, password };
        console.log("Sending login credentials:", credentials);

        try {
            const res = await fetch(USER_LOGIN_API_URI, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            const data = await res.json();
            console.log("Login response:", { status: res.status, data });

            if (res.ok) {
                console.log("Login successful:", data);
                storeUserToken(data.token, data.user);
                showPopup('Login Successful !', 'success');
                setUseremail('');
                setPassword('');
                navigate('/');
                closePopup();
            } else if (res.status === 403 && data.requiresVerification) {
                // Handle email verification case
                showPopup('Please verify your email to continue', 'info');
                navigate(`/verify-email?email=${encodeURIComponent(useremail)}`);
                closePopup();
            } else {
                showPopup('Login Failed: ' + (data.message || "Unknown error"), 'error');
                console.log("Login failed:", data.message || "Unknown error");
            }

        } catch (error) {
            console.error("Unexpected error during login:", error);
            showPopup("An error occurred. Please try again.", "error");
        }
    };
    // *** Login Logic Ends Here

    return (
        <div className="relative">
            {showPopupp && !user && !serviceprovider && (
                <div className="z-50 fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
                        <div className="relative p-6">
                            <button
                                onClick={closePopup}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            >
                                <IoMdCloseCircle className="text-2xl" />
                            </button>

                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
                                <p className="text-gray-600 mt-2">Sign in to continue your journey</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-emerald-500">
                                        <FaEnvelope className="transition-transform group-hover:scale-110" />
                                    </div>
                                    <input
                                        type="email"
                                        value={useremail}
                                        onChange={(e) => setUseremail(e.target.value)}
                                        placeholder="Email address"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all hover:border-emerald-200"
                                        required
                                    />
                                </div>

                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-emerald-500">
                                        <FaLock className="transition-transform group-hover:scale-110" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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
                                        <input
                                            type="checkbox"
                                            className="form-checkbox h-4 w-4 text-emerald-500 rounded focus:ring-emerald-500 transition-colors"
                                        />
                                        <span className="group-hover:text-gray-900 transition-colors">Remember me</span>
                                    </label>
                                    <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors hover:underline">
                                        Forgot password?
                                    </a>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-xl hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-300 relative overflow-hidden group transform hover:scale-[1.02]"
                                >
                                    <span className="absolute w-64 h-64 mt-12 group-hover:-rotate-45 transition-all duration-500 ease-out -translate-x-20 -translate-y-32 bg-white opacity-10 rounded-full"></span>
                                    <span className="relative">Sign In</span>
                                </button>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-gray-600">
                                    Don't have an account?{" "}
                                    <NavLink
                                        to="/user-login"
                                        className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
                                    >
                                        Register here
                                    </NavLink>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
