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

        const credentials = { useremail, password };
        try {
            const res = await fetch(USER_LOGIN_API_URI, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            const data = await res.json();

            if (res.ok) {
                console.log("Login successful:", data);
                storeUserToken(data.token, data.user);
                showPopup('Login Successful !', 'success');
                setUseremail('');
                setPassword('');
                navigate('/');
                closePopup();
            } else {
                showPopup('Login Failed: ' + (data.message || "Unknown error"), 'error');
                console.log("Login failed:", data.message || "Unknown error");
            }

        } catch (error) {
            console.error("Unexpected error during login:", error);
        }
    };
    // *** Login Logic Ends Here

    return (
        <div className="relative">
            {showPopupp && !user && !serviceprovider && (
                <div className="z-50 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 sm:p-6 md:p-8">
                    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-sm sm:max-w-md md:max-w-lg animate-fade-in relative">
                        <button onClick={closePopup} className="absolute top-3 right-3 text-gray-600 hover:text-gray-900">
                            <IoMdCloseCircle className="text-2xl sm:text-3xl" />
                        </button>
                        <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-center text-gray-700">Login</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex items-center">
                                <FaEnvelope className="text-gray-500 mr-2 sm:mr-3" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={useremail}
                                    onChange={(e) => setUseremail(e.target.value)}
                                    placeholder="Enter your email"
                                    autocomplete="current-password"
                                    className="p-2 w-full border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                                />
                            </div>
                            <div className="flex items-center relative">
                                <FaLock className="text-gray-500 mr-2 sm:mr-3" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="p-2 w-full border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10 transition-all duration-200"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 text-gray-500"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>

                            <button type="submit" className="w-full bg-purple-600 text-white p-2 rounded-md hover:bg-purple-700 transition-all duration-300">
                                Login
                            </button>
                        </form>

                        <div className="mt-4 text-center">
                            <p className="text-gray-600 text-sm sm:text-base">
                                Don't have an account? {" "}
                                <NavLink to="/user-login" className="text-purple-600 hover:underline">
                                    Register here
                                </NavLink>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
}
