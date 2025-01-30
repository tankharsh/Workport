import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import Navbar from "../user_components/Navbar";
import { NavLink } from "react-router-dom";
import { FaEnvelope, FaLock, FaPhone, FaUser } from "react-icons/fa";
import { GiShop } from "react-icons/gi";
import { BiSolidCategoryAlt, BiSolidCity } from "react-icons/bi";
import { FaMapLocationDot } from "react-icons/fa6";
import { PiMapPinAreaFill } from "react-icons/pi";
import { TbMapPinCode } from "react-icons/tb";
import Footer from "../user_components/Footer";

const SP_RegistrationForm = () => {
    const [step, setStep] = useState(1);
    const formRef = useRef();

    // GSAP animation for transitions
    useEffect(() => {
        gsap.fromTo(
            formRef.current,
            { opacity: 0, x: 50 },
            { opacity: 1, x: 0, duration: 0.8 }
        );
    }, [step]);

    const handleNext = () => {
        if (step < 2) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Submitted");
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-300 flex p-2 items-center justify-center">
                {/* Container with fixed size */}
                <div className="flex rounded-lg flex-col md:flex-row w-full max-w-4xl h-[65%] bg-white shadow-lg  overflow-hidden">
                    {/* Left Side: Large Text */}
                    <div className="flex-1 bg-gradient-to-r from-blue-500/75 to-purple-600/75 text-white flex items-center justify-center ">
                        <h1 className="text-xl md:text-xl font-bold text-center p-8">
                            {step === 1
                                ? (
                                    <div className>
                                        <h1 className="mb-5">"Welcome to Registration"</h1>
                                        <NavLink to="/sp-provider-login" className="mb-2 px-6 py-2 rounded-lg hover:scale-95 border-2 border-white">Login</NavLink>
                                    </div>
                                )
                                : (
                                    <div className>
                                        <h1 className="mb-5">"Shop Details Registration"</h1>
                                        <NavLink to="/sp-provider-login" className="mt-5 px-6 py-2 rounded-lg hover:scale-95 border-2 border-white">Login</NavLink>
                                    </div>
                                )
                            }
                        </h1>
                    </div>

                    {/* Right Side: Form */}
                    <div
                        className="flex-1 flex items-center justify-center px-8 py-6"
                        ref={formRef}
                    >
                        <div className="w-full max-w-md">
                            <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
                                Step {step} of 2
                            </h2>
                            <form onSubmit={handleSubmit}>
                                {/* Step 1 */}
                                {step === 1 && (
                                    <div>
                                        {/* sp_name  */}
                                        <div className="flex items-center mt-2">
                                            <FaUser className="text-gray-500 mr-3" />
                                            <input
                                                type="text"
                                                id="sp_name"
                                                name="sp_name"
                                                placeholder="Enter your name"
                                                className="p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                        </div>

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

                                        {/* sp_contact */}
                                        <div className="flex items-center mt-2">
                                            <FaPhone className="text-gray-500 mr-3" />
                                            <input
                                                type="tel"
                                                id="sp_contact"
                                                name="sp_contact"
                                                placeholder="Enter your Contact No"
                                                className="p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Step 2 */}
                                {step === 2 && (
                                    <div>
                                        {/* sp_shop_name */}
                                        <div className="flex items-center mt-2">
                                            <GiShop className="text-gray-500 mr-3" />
                                            <input
                                                type="text"
                                                id="sp_shop_name"
                                                name="sp_shop_name"
                                                placeholder="Enter your Name"
                                                className="p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                        </div>

                                        {/* sp_category */}
                                        <div className="flex items-center mt-2">
                                            <BiSolidCategoryAlt className="text-gray-500 mr-3" />
                                            <input
                                                type="text"
                                                id="sp_category"
                                                name="sp_category"
                                                placeholder="Enter your Category"
                                                className="p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                        </div>



                                        {/* sp_area */}
                                        <div className="flex items-center mt-2">
                                            <PiMapPinAreaFill className="text-gray-500 mr-3" />
                                            <input
                                                type="text"
                                                id="sp_area"
                                                name="sp_area"
                                                placeholder="Enter your Shop Area"
                                                className="p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                        </div>

                                        {/* sp_block_no */}
                                        <div className="flex gap-4 mt-2">
                                            {/* sp_block_no */}
                                            <div className="flex items-center w-1/2">
                                                <FaMapLocationDot className="text-gray-500 mr-3" />
                                                <input
                                                    type="text"
                                                    id="sp_block_no"
                                                    name="sp_block_no"
                                                    placeholder="Block No"
                                                    className="p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                />
                                            </div>

                                            {/* sp_pincode */}
                                            <div className="flex items-center w-1/2">
                                                <TbMapPinCode className="text-gray-500 mr-3" />
                                                <input
                                                    type="text"
                                                    id="sp_pincode"
                                                    name="sp_pincode"
                                                    placeholder="Pincode"
                                                    className="p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                />
                                            </div>
                                        </div>


                                        {/* sp_city */}
                                        <div className="flex items-center mt-2">
                                            <BiSolidCity className="text-gray-500 mr-3" />
                                            <input
                                                type="text"
                                                id="sp_city"
                                                name="sp_city"
                                                placeholder="Enter your Shop City"
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

                                        <div className="flex gap-4 mt-2">
                                            {/* Shop Image */}
                                            <div className="flex items-center w-1/2">
                                                <label htmlFor="shop_image" className="text-gray-500 mr-3">Shop Image:</label>
                                                <input
                                                    type="file"
                                                    id="shop_image"
                                                    name="shop_image"
                                                    className="p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                />
                                            </div>

                                            {/* Banner Image */}
                                            <div className="flex items-center w-1/2">
                                                <label htmlFor="banner_image" className="text-gray-500 mr-3">Banner Image:</label>
                                                <input
                                                    type="file"
                                                    id="banner_image"
                                                    name="banner_image"
                                                    className="p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                />
                                            </div>
                                        </div>

                                    </div>
                                )}

                                {/* Navigation Buttons */}
                                <div className="flex justify-between items-center mt-6">
                                    {step > 1 && (
                                        <button
                                            type="button"
                                            onClick={handleBack}
                                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                                        >
                                            Back
                                        </button>
                                    )}

                                    {step < 2 ? (
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                        >
                                            Next
                                        </button>
                                    ) : (
                                        <NavLink
                                            to="/dashboard"
                                            type="submit"
                                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                        >
                                            Submit
                                        </NavLink>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default SP_RegistrationForm;
