import React from 'react';
import Navbar from '../../components/user_components/Navbar';
import { GiShop } from 'react-icons/gi';
import { FaPhone, FaRupeeSign } from 'react-icons/fa';
import Footer from '../../components/user_components/Footer';
import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { BiSolidCity } from 'react-icons/bi';
import { TbMapPinCode } from 'react-icons/tb';
import { FaMapLocationDot } from 'react-icons/fa6';
import { PiMapPinAreaFill } from 'react-icons/pi';

const Shop_Dashboard = () => {
  const services = [
    { name: 'Hair Wash', price: 3500 },
    { name: 'Hair Wash', price: 3500 },
    { name: 'Hair Wash', price: 3500 },
    { name: 'Hair Wash', price: 3500 },
    { name: 'Hair Wash', price: 3500 },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");

  // Prevent background scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);



  return (
    <>
      <Navbar />
      <div className="w-full flex flex-col lg:flex-row mt-8">
        {/* Left side */}
        <div className="lg:w-1/2 w-full h-auto p-4 lg:p-10">
          <div className="flex items-center gap-4">
            <span className="text-3xl lg:text-4xl">
              <GiShop />
            </span>
            <h1 className="uppercase text-2xl lg:text-4xl font-bold">SHOP NAME</h1>
          </div>

          <div className="flex items-center mt-5 gap-2">
            <span>
              <FaPhone />
            </span>
            <span className="font-bold">Contact No: 1234567890</span>
          </div>
          <hr className="bg-gray-600 mt-2" />

          <div className="flex flex-col mt-5 gap-2">
            <span className="flex items-center gap-2 font-bold">
              <FaPhone />
              Address:
            </span>
            <div>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt
              dolor, sint impedit sapiente sed consectetur? Omnis modi temporibus
              dolore velit!
            </div>
          </div>
          <hr className="bg-gray-600 mt-2" />

          <div className="flex flex-col mt-5 gap-2">
            <span className="flex items-center gap-2 font-bold">
              <FaPhone />
              Owner Details:
            </span>
            <div>
              <span>
                <span className="font-bold">Name: </span>helo helo helo
              </span>
              <br />
              <span>
                <span className="font-bold">Email: </span>ahahha@gmail.com
              </span>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="lg:w-1/2 w-full h-auto flex flex-col lg:flex-row justify-center gap-4 lg:gap-10 p-4 lg:p-10">
          <div className="h-48 lg:h-60 w-full lg:w-1/2">
            <img
              src="https://cdn.pixabay.com/photo/2022/09/10/22/24/apples-7445797_640.jpg"
              alt="Shop Image"
              className="w-full h-full object-cover rounded-3xl"
            />
            <p className="text-center opacity-70">Shop Image</p>
          </div>
          <div className="h-48 lg:h-60 w-full lg:w-1/2">
            <img
              src="https://cdn.pixabay.com/photo/2022/09/10/22/24/apples-7445797_640.jpg"
              alt="Shop Banner"
              className="w-full h-full object-cover rounded-3xl"
            />
            <p className="text-center opacity-70">Banner Image</p>
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
            {services.map((service, i) => (
              <div
                key={i}
                className="bg-white hover:scale-105 transition-all duration-300 border border-gray-500 p-3 text-center text-lg rounded-lg"
              >
                <p>{service.name}</p>
                <p className="text-gray-700 font-bold flex justify-center items-center gap-1">
                  <FaRupeeSign /> {service.price}
                </p>
                <button
                  onClick={() => setIsOpen(true)}
                  className="bg-green-500 px-6 py-2 rounded-lg">
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)} // Close sidebar when clicking outside
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
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
                id="area"
                name="area"
                placeholder="Enter your Area"
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
                  id="block_no"
                  name="block_no"
                  placeholder="Block No"
                  className="p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* sp_pincode */}
              <div className="flex items-center w-1/2">
                <TbMapPinCode className="text-gray-500 mr-3" />
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
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
                id="city"
                name="city"
                placeholder="Enter your City"
                className="p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

            <button
              type="submit"
              className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg shadow-md hover:bg-purple-700"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Shop_Dashboard;
