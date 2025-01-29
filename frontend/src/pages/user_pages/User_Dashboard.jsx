import React from 'react'
import Navbar from '../../components/user_components/Navbar'
import AdvancedSearchMenu from '../../components/user_components/AdvancedSearchMenu'
import { FaRupeeSign } from "react-icons/fa"
import { MdPhone } from "react-icons/md"
import { FaCheckCircle } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa"

const User_Dashboard = () => {
    return (
        <>
            <Navbar />
            <AdvancedSearchMenu />
            <div className="bg-[#192B3C] w-full text-white text-3xl font-bold p-4 mt-2">
                <h1>Hair and Care Shop</h1>
                <div className="bg-gray-200 h-[40%] w-[65%] text-black p-4 rounded-lg shadow-md flex gap-10 mt-4">
                    {/* Image Placeholder */}
                    <img
                        src="https://cdn.pixabay.com/photo/2020/05/24/02/00/barber-shop-5212059_640.jpg"
                        id="user-dashboard-img"
                        className="bg-gray-300 w-36 h-36 md:w-72 md:h-64 mx-auto md:mx-0"
                    />

                    {/* Service Details */}
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold">Ant Top Hair Care</h2>
                        <p className="text-sm text-gray-600 mt-2">Location</p>

                        {/* Services and Prices */}
                        <div className="flex flex-wrap gap-4 justify-center md:justify-start my-10">
                            <div className="user-dashboard-service bg-white border border-gray-300 p-2 text-center text-lg w-40">
                                <p>Hair Wash</p>
                                <p className="text-gray-700 font-bold flex justify-center items-center">
                                    <span>
                                        <FaRupeeSign />
                                    </span>
                                    3500
                                </p>
                            </div>
                            <div className="user-dashboard-service bg-white border border-gray-300 p-2 text-center text-lg w-40">
                                <p>Hair Wash</p>
                                <p className="text-gray-700 font-bold flex justify-center items-center">
                                    <span>
                                        <FaRupeeSign />
                                    </span>
                                    3500
                                </p>
                            </div>
                            <div className="user-dashboard-service bg-white border border-gray-300 p-2 text-center text-lg w-40">
                                <p>Hair Wash</p>
                                <p className="text-gray-700 font-bold flex justify-center items-center">
                                    <span>
                                        <FaRupeeSign />
                                    </span>
                                    3500
                                </p>
                            </div>
                        </div>

                        {/* Contact Buttons */}
                        <div className="flex items-center gap-4 mt-10">
                            <button id='user-dashboard-phone' class="relative flex h-[50px] w-40 items-center justify-center overflow-hidden bg-blue-800 text-white shadow-2xl transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-blue-600 before:duration-500 before:ease-out hover:shadow-blue-600 hover:before:h-56 hover:before:w-56">
                                <span class="relative z-10 text-lg flex justify-center items-center gap-2"> <span><MdPhone/></span>922103020</span>
                            </button>
                            <button id='user-dashboard-phone' class="relative flex h-[50px] w-40 items-center justify-center overflow-hidden bg-green-600 text-white shadow-2xl transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-green-700 before:duration-500 before:ease-out hover:shadow-green-700 hover:before:h-56 hover:before:w-56">
                                <span class="relative z-10 text-lg flex justify-center items-center gap-2"> <span><FaWhatsapp/></span>Whatsapp</span>
                            </button>
                            <button id='user-dashboard-phone' class="relative flex h-[50px] w-40 items-center justify-center overflow-hidden bg-yellow-500 text-white shadow-2xl transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-yellow-600 before:duration-500 before:ease-out hover:shadow-yellow-600 hover:before:h-56 hover:before:w-56">
                                <span class="relative z-10 text-lg flex justify-center items-center gap-2"> <span><FaCheckCircle/></span>Book Now</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-200 h-[40%] w-[65%] text-black p-4 rounded-lg shadow-md flex gap-10 mt-4">
                    {/* Image Placeholder */}
                    <img src='https://cdn.pixabay.com/photo/2020/05/24/02/00/barber-shop-5212059_640.jpg' id='user-dashboard-img' className="bg-gray-300 w-36 h-36 md:w-72 md:h-64 "></img>

                    {/* Service Details */}
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold">Ant Top Hair Care</h2>
                        <p className="text-sm text-gray-600 mt-2">Location</p>

                        {/* Services and Prices */}
                        <div className="flex gap-2 my-10">
                            <div className="user-dashboard-service bg-white border border-gray-300 p-2 text-center text-lg w-40">
                                <p>Hair Wash</p>
                                <p className="text-gray-700 font-bold flex justify-center items-center"><span><FaRupeeSign /></span>3500</p>
                            </div>
                            <div className="user-dashboard-service bg-white border border-gray-300 p-2 text-center text-lg w-40">
                                <p>Hair Wash</p>
                                <p className="text-gray-700 font-bold flex justify-center items-center"><span><FaRupeeSign /></span>3500</p>
                            </div>
                            <div className="user-dashboard-service bg-white border border-gray-300 p-2 text-center text-lg w-40">
                                <p>Hair Wash</p>
                                <p className="text-gray-700 font-bold flex justify-center items-center"><span><FaRupeeSign /></span>3500</p>
                            </div>
                        </div>

                        {/* Contact Buttons */}
                        <div className="flex items-center gap-4 mt-10">
                            <button id='user-dashboard-phone' class="relative flex h-[50px] w-40 items-center justify-center overflow-hidden bg-blue-800 text-white shadow-2xl transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-blue-600 before:duration-500 before:ease-out hover:shadow-blue-600 hover:before:h-56 hover:before:w-56">
                                <span class="relative z-10 text-lg flex justify-center items-center gap-2"> <span><MdPhone/></span>922103020</span>
                            </button>
                            <button id='user-dashboard-phone' class="relative flex h-[50px] w-40 items-center justify-center overflow-hidden bg-green-600 text-white shadow-2xl transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-green-700 before:duration-500 before:ease-out hover:shadow-green-700 hover:before:h-56 hover:before:w-56">
                                <span class="relative z-10 text-lg flex justify-center items-center gap-2"> <span><FaWhatsapp/></span>Whatsapp</span>
                            </button>
                            <button id='user-dashboard-phone' class="relative flex h-[50px] w-40 items-center justify-center overflow-hidden bg-yellow-500 text-white shadow-2xl transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-yellow-600 before:duration-500 before:ease-out hover:shadow-yellow-600 hover:before:h-56 hover:before:w-56">
                                <span class="relative z-10 text-lg flex justify-center items-center gap-2"> <span><FaCheckCircle/></span>Book Now</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-200 h-[40%] w-[65%] text-black p-4 rounded-lg shadow-md flex gap-10 mt-4">
                    {/* Image Placeholder */}
                    <img src='https://cdn.pixabay.com/photo/2020/05/24/02/00/barber-shop-5212059_640.jpg' id='user-dashboard-img' className="bg-gray-300 w-36 h-36 md:w-72 md:h-64 "></img>

                    {/* Service Details */}
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold">Ant Top Hair Care</h2>
                        <p className="text-sm text-gray-600 mt-2">Location</p>

                        {/* Services and Prices */}
                        <div className="flex gap-2 my-10">
                            <div className="user-dashboard-service bg-white border border-gray-300 p-2 text-center text-lg w-40">
                                <p>Hair Wash</p>
                                <p className="text-gray-700 font-bold flex justify-center items-center"><span><FaRupeeSign /></span>3500</p>
                            </div>
                            <div className="user-dashboard-service bg-white border border-gray-300 p-2 text-center text-lg w-40">
                                <p>Hair Wash</p>
                                <p className="text-gray-700 font-bold flex justify-center items-center"><span><FaRupeeSign /></span>3500</p>
                            </div>
                            <div className="user-dashboard-service bg-white border border-gray-300 p-2 text-center text-lg w-40">
                                <p>Hair Wash</p>
                                <p className="text-gray-700 font-bold flex justify-center items-center"><span><FaRupeeSign /></span>3500</p>
                            </div>
                        </div>

                        {/* Contact Buttons */}
                        <div className="flex items-center gap-4 mt-10">
                            <button id='user-dashboard-phone' class="relative flex h-[50px] w-40 items-center justify-center overflow-hidden bg-blue-800 text-white shadow-2xl transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-blue-600 before:duration-500 before:ease-out hover:shadow-blue-600 hover:before:h-56 hover:before:w-56">
                                <span class="relative z-10 text-lg flex justify-center items-center gap-2"> <span><MdPhone/></span>922103020</span>
                            </button>
                            <button id='user-dashboard-phone' class="relative flex h-[50px] w-40 items-center justify-center overflow-hidden bg-green-600 text-white shadow-2xl transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-green-700 before:duration-500 before:ease-out hover:shadow-green-700 hover:before:h-56 hover:before:w-56">
                                <span class="relative z-10 text-lg flex justify-center items-center gap-2"> <span><FaWhatsapp/></span>Whatsapp</span>
                            </button>
                            <button id='user-dashboard-phone' class="relative flex h-[50px] w-40 items-center justify-center overflow-hidden bg-yellow-500 text-white shadow-2xl transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-yellow-600 before:duration-500 before:ease-out hover:shadow-yellow-600 hover:before:h-56 hover:before:w-56">
                                <span class="relative z-10 text-lg flex justify-center items-center gap-2"> <span><FaCheckCircle/></span>Book Now</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default User_Dashboard