import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../user_components/Navbar';
import Footer from '../user_components/Footer';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {useAuth} from '../../context/AuthContext';

function SP_LoginForm() {

    const { SP_login, serviceprovider } = useAuth()
    const navigate = useNavigate();
    const [sp_email, setSp_email] = useState("");
    const [sp_password, setSp_password] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await SP_login({ sp_email, sp_password });
        if (success) {
            setIsLoggedIn(true); // Set state to trigger navigation
        }
    };

    useEffect(() => {
        if (isLoggedIn || serviceprovider) {
            navigate("/dashboard");
        }
    }, [isLoggedIn, serviceprovider, navigate]);

    return (
        <>
            <Helmet>
                <title>Service Provider | Login</title>
                <meta name="description" content="Know more about us." />
                <meta name="author" content="My Website Team" />
            </Helmet>
            <Navbar />
            <div className="min-h-screen bg-gray-300 p-2 flex items-center justify-center">
                {/* Container with fixed size */}
                <div className="flex flex-col rounded-lg md:flex-row w-full max-w-4xl h-[60vh] bg-white shadow-lg overflow-hidden">
                    {/* Left Side: Large Text */}
                    <div className="flex-1 bg-gradient-to-r from-blue-500/75 to-purple-600/75 text-white flex items-center justify-center px-8 flex-col">
                        <h1 className="text-2xl md:text-2xl font-bold text-center p-4">
                            "Welcome to Registration"
                            <br />

                        </h1>
                        <NavLink to="/sp-provider" className=" px-6 py-2 rounded-lg hover:scale-95 border-2 border-white">List Your Business</NavLink>
                    </div>

                    {/* Right Side: Form */}
                    <div
                        className="flex-1 flex items-center justify-center px-8 py-8"
                    >
                        <div className="w-full max-w-md">
                            <h2 className="text-2xl font-bold mb-4">Login</h2>
                            <form onSubmit={handleSubmit}>
                                <div>
                                    {/* sp_email */}
                                    <div className="flex items-center mt-2">
                                        <FaEnvelope className="text-gray-500 mr-3" />
                                        <input
                                            type="email"
                                            id="sp_email"
                                            name="sp_email"
                                            value={sp_email}
                                            onChange={(e) => setSp_email(e.target.value)}
                                            placeholder="Enter your Email"
                                            className="p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                    </div>

                                    <div className="flex items-center mt-2">
                                        <FaLock className="text-gray-500 mr-3" />
                                        <input
                                            type="password"
                                            id="sp_password"
                                            name="sp_password"
                                            value={sp_password}
                                            onChange={(e) => setSp_password(e.target.value)}
                                            placeholder="Enter your password"
                                            className="p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                    </div>
                                </div>


                                {/* Navigation Buttons */}
                                <div className="flex justify-between items-center mt-6">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                    >
                                        Submit
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
