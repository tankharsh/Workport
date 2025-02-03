import React, { useState, useEffect, useContext } from "react";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/user_components/Navbar";
import { IoMdClose } from "react-icons/io";
import { FaPhone, FaRupeeSign } from "react-icons/fa";
import { BiSolidCity } from "react-icons/bi";
import { TbMapPinCode } from "react-icons/tb";
import { FaMapLocationDot } from "react-icons/fa6";
import { PiMapPinAreaFill } from "react-icons/pi";
import Footer from "../../components/user_components/Footer";

const Shop_Dashboard = () => {
  const { user } = useAuth(); // Get user from context
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  const handleOpenSidebar = () => {
    if (user) {
      setIsOpen(true);
    } else {
      setShowLoginPrompt(true);
    }
  };

  return (
    <>
      <Navbar />
      <div className="w-full flex flex-col lg:flex-row mt-8">
        {/* Shop Details */}
        <div className="lg:w-1/2 w-full h-auto p-4 lg:p-10">
          <div className="flex items-center gap-4">
            <h1 className="uppercase text-2xl lg:text-4xl font-bold">SHOP NAME</h1>
          </div>

          <div className="flex items-center mt-5 gap-2">
            <span>
              <FaPhone />
            </span>
            <span className="font-bold">Contact No: 1234567890</span>
          </div>
        </div>

        {/* Images */}
        <div className="lg:w-1/2 w-full h-auto flex flex-col lg:flex-row justify-center gap-4 lg:gap-10 p-4 lg:p-10">
          <div className="h-48 lg:h-60 w-full lg:w-1/2">
            <img
              src="https://cdn.pixabay.com/photo/2022/09/10/22/24/apples-7445797_640.jpg"
              alt="Shop Image"
              className="w-full h-full object-cover rounded-3xl"
            />
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="h-auto p-4 lg:p-10">
        <div className="h-full pt-5 border-2 border-black">
          <h1 className="uppercase px-4 lg:px-10 text-2xl lg:text-4xl font-bold">
            Services
          </h1>

          <div className="grid px-4 lg:px-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                className="bg-white hover:scale-105 transition-all duration-300 border border-gray-500 p-3 text-center text-lg rounded-lg"
              >
                <p>Hair Wash</p>
                <p className="text-gray-700 font-bold flex justify-center items-center gap-1">
                  <FaRupeeSign /> 3500
                </p>
                <button
                  onClick={handleOpenSidebar}
                  className="bg-green-500 px-6 py-2 rounded-lg"
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar (Only Opens If Logged In) */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out translate-x-0">
            {/* Sidebar Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Enter Your Full Address</h2>
              <button onClick={() => setIsOpen(false)} className="text-xl">
                <IoMdClose />
              </button>
            </div>

            <div className="p-4">
              <form>
                <div className="flex items-center mt-2">
                  <PiMapPinAreaFill className="text-gray-500 mr-3" />
                  <input
                    type="text"
                    placeholder="Enter your Area"
                    className="p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="flex gap-4 mt-2">
                  <div className="flex items-center w-1/2">
                    <FaMapLocationDot className="text-gray-500 mr-3" />
                    <input
                      type="text"
                      placeholder="Block No"
                      className="p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="flex items-center w-1/2">
                    <TbMapPinCode className="text-gray-500 mr-3" />
                    <input
                      type="text"
                      placeholder="Pincode"
                      className="p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="flex items-center mt-2">
                  <BiSolidCity className="text-gray-500 mr-3" />
                  <input
                    type="text"
                    placeholder="Enter your City"
                    className="p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg shadow-md hover:bg-purple-700"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Login Prompt */}
      {showLoginPrompt && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-xl font-semibold">You need to log in first!</p>
            <button
              onClick={() => setShowLoginPrompt(false)}
              className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Shop_Dashboard;
