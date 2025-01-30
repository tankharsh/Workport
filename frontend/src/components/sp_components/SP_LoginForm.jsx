// src/LoginForm.js
import React from 'react';
import Navbar from '../user_components/Navbar';
import Footer from '../user_components/Footer';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

function SP_LoginForm() {
    return (
        <>
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
                            <form>
                                <div>
                                    {/* sp_email */}
                                    <div className="flex items-center mt-2">
                                        <FaEnvelope className="text-gray-500 mr-3" />
                                        <input
                                            type="email"
                                            id="sp_email"
                                            name="sp_email"
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
                                            placeholder="Enter your password"
                                            className="p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                    </div>
                                </div>


                                {/* Navigation Buttons */}
                                <div className="flex justify-between items-center mt-6">
                                    <NavLink
                                        to="/dashboard"
                                        type="submit"
                                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                    >
                                        Submit
                                    </NavLink>

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
