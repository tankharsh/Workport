import React from 'react'
import Navbar from '../../components/user_components/Navbar'
import AdvancedSearchMenu from '../../components/user_components/AdvancedSearchMenu'
import { FaRupeeSign } from "react-icons/fa"
import { MdPhone } from "react-icons/md"
import { FaCheckCircle } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa"
import Footer from '../../components/user_components/Footer'
import { NavLink } from 'react-router-dom'
import { Helmet } from "react-helmet-async";

const services = [
    { name: "Hair Wash", price: 3500 },
    { name: "Hair Wash", price: 3500 },
    { name: "Hair Wash", price: 3500 }
];

const User_Dashboard = () => {
    return (
        <>
        <Helmet>
        <title>WorkPort</title>
        <meta name="description" content="Know more about us." />
        <meta name="author" content="My Website Team" />
      </Helmet>
            <Navbar />
            <div className=" w-full text-white text-3xl font-bold p-4 mt-2">
                <h1 className="text-center">Hair and Care Shop</h1>

                {[1, 2, 3].map((_, index) => (
                    <div key={index} className="bg-gray-200 w-full max-w-5xl mx-auto text-black p-4 rounded-lg shadow-md flex flex-col md:flex-row gap-6 mt-6">
                        {/* Image Placeholder */}
                        <img src="https://cdn.pixabay.com/photo/2020/05/24/02/00/barber-shop-5212059_640.jpg"
                            className="bg-gray-300 w-full md:w-72 md:h-64 object-cover rounded-lg" alt="Hair Care" />

                        {/* Service Details */}
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold">Ant Top Hair Care</h2>
                            <p className="text-sm text-gray-600 mt-2">Location</p>

                            {/* Services and Prices */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
                                {services.map((service, i) => (
                                    <div key={i} className="bg-white border border-gray-300 p-3 text-center text-lg rounded-lg">
                                        <p>{service.name}</p>
                                        <p className="text-gray-700 font-bold flex justify-center items-center gap-1">
                                            <FaRupeeSign /> {service.price}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Contact Buttons */}
                            <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
                                <NavLink className="relative flex h-[50px] w-40 items-center justify-center overflow-hidden bg-blue-800 hover:shadow-blue-600 text-white shadow-2xl transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-opacity-50 before:duration-500 before:ease-out hover:before:h-56 hover:before:w-56 rounded-lg">
                                    <span className="relative z-10 text-lg flex justify-center items-center gap-2"><MdPhone />922103020</span>
                                </NavLink>

                                <NavLink className="relative flex h-[50px] w-40 items-center justify-center overflow-hidden bg-green-600 hover:shadow-green-700 text-white shadow-2xl transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-opacity-50 before:duration-500 before:ease-out hover:before:h-56 hover:before:w-56 rounded-lg">
                                    <span className="relative z-10 text-lg flex justify-center items-center gap-2"><FaWhatsapp />Whatsapp</span>
                                </NavLink>

                                <NavLink to='/Shop-Dashboard' className="relative flex h-[50px] w-40 items-center justify-center overflow-hidden bg-yellow-500 hover:shadow-yellow-600 text-white shadow-2xl transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-opacity-50 before:duration-500 before:ease-out hover:before:h-56 hover:before:w-56 rounded-lg">
                                    <span className="relative z-10 text-lg flex justify-center items-center gap-2"><FaCheckCircle />Book Now</span>
                                </NavLink>

                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Footer />
        </>
    )
}

export default User_Dashboard