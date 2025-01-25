import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import Navbar from "../user_components/Navbar";
import { NavLink } from "react-router-dom";

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
            <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                {/* Container with fixed size */}
                <div id="sp_registrationForm" className="flex flex-col md:flex-row w-full max-w-4xl h-[65%] bg-white shadow-lg  overflow-hidden">
                    {/* Left Side: Large Text */}
                    <div className="flex-1 bg-green-500 text-white flex items-center justify-center px-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-center">
                            {step === 1
                                ? "Welcome to Registration"
                                : "Shop Details Registration"}
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
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Service Pro Name
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter name"
                                        />

                                        <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">
                                            Service Pro Email
                                        </label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter email"
                                        />

                                        <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">
                                            Service Pro Contact Number
                                        </label>
                                        <input
                                            type="tel"
                                            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter contact number"
                                        />
                                    </div>
                                )}

                                {/* Step 2 */}
                                {step === 2 && (
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Service Pro Shop Name
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter shop name"
                                        />

                                        <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">
                                            Service Pro Category
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter category"
                                        />

                                        <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">
                                            House No./Building Name
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter house/building name"
                                        />

                                        <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">
                                            Road Name / Area / Colony
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter road name/area/colony"
                                        />

                                        <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">
                                            Pincode
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter pincode"
                                        />

                                        <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter city"
                                        />
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
        </>
    );
};

export default SP_RegistrationForm;
