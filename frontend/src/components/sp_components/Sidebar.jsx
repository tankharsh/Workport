import React, { useState } from "react";
import { TbHomeFilled } from "react-icons/tb";
import { GrServices } from "react-icons/gr";
import { BsPersonWorkspace } from "react-icons/bs";
import { BsShop } from "react-icons/bs";
import { FaCartShopping } from "react-icons/fa6";
import { MdFeedback } from "react-icons/md";
import { HiOutlineLogout } from "react-icons/hi";
import { NavLink, useNavigate } from "react-router-dom";
import { FaAlignRight } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const { spLogout } = useAuth();
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
        document.body.style.overflow = isOpen ? "auto" : "hidden";
    };

    const handleLogout = () => {
        spLogout();
        setShowLogoutPopup(false); 
        navigate('/')
    };

    return (
        <>
            <div className="relative font-[Roboto, sans-serif]">
                {/* overlay  */}
                {isOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                        onClick={toggleSidebar}
                    ></div>
                )}

                {/* Sidebar */}
                <div
                    className={`fixed inset-y-0 left-0 bg-[#2f3e46] shadow-2xl text-white w-64 transform ${isOpen ? "translate-x-0" : "-translate-x-full"
                        } transition-transform duration-300 ease-in-out z-50 lg:translate-x-0 lg:block`}
                >
                    {/* Sidebar Header */}
                    <div className="flex items-center justify-between p-4">
                        <span className="font-bold text-4xl">WorkPort</span>
                        {/* Close Button */}
                        <button
                            onClick={toggleSidebar}
                            className="text-white text-2xl focus:outline-none lg:hidden"
                        >
                            &times;
                        </button>
                    </div>
                    {/* Sidebar Links */}
                    <nav className="mt-3">

                        {/* Dashboard Link  */}
                        <NavLink
                            to="/Dashboard"
                            className={({ isActive }) =>
                                isActive
                                    ? "block px-4 py-2 mt-3 bg-[#52796f] text-white"
                                    : "block px-4 py-2 mt-3 hover:bg-[#52796f] text-white hover:scale-95 transition-all duration-300"
                            }
                        >
                            <span className="flex px-2 gap-3 justify-start items-center">
                                <MdDashboard className="text-2xl" /> Dashboard
                            </span>
                        </NavLink>

                        {/* Add Service Link  */}
                        <NavLink
                            to="/addservice"
                            className={({ isActive }) =>
                                isActive
                                    ? "block px-4 py-2 mt-3 bg-[#52796f] text-white"
                                    : "block px-4 py-2 mt-3 hover:bg-[#52796f] text-white hover:scale-95 transition-all duration-300"
                            }
                        >
                            <span className="flex px-2 gap-3 justify-start items-center">
                                <GrServices className="text-2xl" /> Add Service
                            </span>
                        </NavLink>

                        {/* Profile Link  */}
                        <NavLink
                            to="/profile"
                            className={({ isActive }) =>
                                isActive
                                    ? "block px-4 py-2 mt-3 bg-[#52796f]  text-white"
                                    : "block px-4 py-2 mt-3 hover:bg-[#52796f] hover:scale-95 transition-all duration-300 text-white"
                            }
                        >
                            <span className="flex px-2 gap-3 justify-start items-center">
                                <BsPersonWorkspace className="text-2xl" /> Profile
                            </span>
                        </NavLink>

                        {/* Myshop Link  */}
                        <NavLink
                            to="/myshop"
                            className={({ isActive }) =>
                                isActive
                                    ? "block px-4 py-2 mt-3 bg-[#52796f] text-white"
                                    : "block px-4 py-2 mt-3 hover:bg-[#52796f] text-white hover:scale-95 transition-all duration-300"
                            }
                        >
                            <span className="flex px-2 gap-3 justify-start items-center">
                                <BsShop className="text-2xl" /> My Shop
                            </span>
                        </NavLink>

                        {/* Order Link  */}
                        <NavLink
                            to="/order"
                            className={({ isActive }) =>
                                isActive
                                    ? "block px-4 py-2 mt-3 bg-[#52796f] text-white"
                                    : "block px-4 py-2 mt-3 hover:bg-[#52796f] text-white hover:scale-95 transition-all duration-300"
                            }
                        >
                            <span className="flex px-2 gap-3 justify-start items-center">
                                <FaCartShopping className="text-2xl" /> Inquiry
                            </span>
                        </NavLink>

                        {/* Feedback Link  */}
                        <NavLink to="/feedback" className="block hover:scale-95 transition-all duration-300 px-4 py-2 mt-3 hover:bg-[#52796f]">
                            <span className="flex px-2 gap-3 justify-start items-center">
                                <MdFeedback className="text-2xl" /> Feedback
                            </span>
                        </NavLink>

                        {/* Logout Link  */}
                        <button
                            onClick={() => setShowLogoutPopup(true)}
                            className="w-full px-4 bg-red-500 py-2 mt-3 hover:bg-red-700">
                            <span className="flex px-2 gap-3 justify-start items-center">
                                <HiOutlineLogout className="text-2xl" /> Logout
                            </span>
                        </button>
                    </nav>
                </div>

                {/* Navbar */}
                <div className="flex flex-1 flex-col">
                    <header className="fixed w-full top-0 z-50 flex items-center justify-between bg-[#2f3e46] text-white p-4 shadow-md">
                        {/* Sidebar Toggle Button */}
                        <button
                            onClick={toggleSidebar}
                            className="text-2xl focus:outline-none lg:hidden"
                        >
                            <FaAlignRight />
                        </button>
                        {/* Brand Name */}
                        <span className="font-bold text-lg">WorkPort</span>
                    </header>
                </div>
            </div>


            {/* Logout Confirmation Popup */}
            {showLogoutPopup && (
                <div className="z-50 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <h2 className="text-lg font-semibold text-black mb-4">Are you sure you want to logout?</h2>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                Yes, Logout
                            </button>
                            <button
                                onClick={() => setShowLogoutPopup(false)}
                                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;
