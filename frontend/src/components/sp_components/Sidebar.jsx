import React, { useState } from "react";
import { TbHomeFilled } from "react-icons/tb";
import { GrServices } from "react-icons/gr";
import { BsPersonWorkspace } from "react-icons/bs";
import { BsShop } from "react-icons/bs";
import { FaCartShopping } from "react-icons/fa6";
import { MdFeedback } from "react-icons/md";
import { HiOutlineLogout } from "react-icons/hi";
import { NavLink } from "react-router-dom";
import { FaAlignRight } from "react-icons/fa";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
        document.body.style.overflow = isOpen ? "auto" : "hidden";
    };

    return (
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
                className={`fixed inset-y-0 left-0 bg-[#192B3C] text-white w-64 transform ${isOpen ? "translate-x-0" : "-translate-x-full"
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
                                ? "block px-4 py-2 bg-[#6499C2] text-white"
                                : "block px-4 py-2 hover:bg-[#6499C2] text-white"
                        }
                    >
                        <span className="flex px-2 gap-3 justify-start items-center">
                            <TbHomeFilled className="text-2xl" /> Dashboard
                        </span>
                    </NavLink>

                    {/* Add Service Link  */}
                    <a href="#" className="block px-4 py-2 mt-3 hover:bg-[#6499C2]">
                        <span className="flex px-2 gap-3 justify-start items-center">
                            <GrServices className="text-2xl" /> Add Service
                        </span>
                    </a>

                    {/* Profile Link  */}
                    <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                            isActive
                                ? "block px-4 py-2 mt-3 bg-[#6499C2] text-white"
                                : "block px-4 py-2 mt-3 hover:bg-[#6499C2] text-white"
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
                                ? "block px-4 py-2 mt-3 bg-[#6499C2] text-white"
                                : "block px-4 py-2 mt-3 hover:bg-[#6499C2] text-white"
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
                                ? "block px-4 py-2 mt-3 bg-[#6499C2] text-white"
                                : "block px-4 py-2 mt-3 hover:bg-[#6499C2] text-white"
                        }
                    >
                        <span className="flex px-2 gap-3 justify-start items-center">
                            <FaCartShopping className="text-2xl" /> Orders
                        </span>
                    </NavLink>

                    {/* Feedback Link  */}
                    <NavLink to="/feedback" className="block px-4 py-2 mt-3 hover:bg-[#6499C2]">
                        <span className="flex px-2 gap-3 justify-start items-center">
                            <MdFeedback className="text-2xl" /> Feedback
                        </span>
                    </NavLink>

                    {/* Logout Link  */}
                    <NavLink to="/" className="block px-4 bg-red-500 py-2 mt-3 hover:bg-red-700">
                        <span className="flex px-2 gap-3 justify-start items-center">
                            <HiOutlineLogout className="text-2xl" /> Logout
                        </span>
                    </NavLink>
                </nav>
            </div>

            {/* Navbar */}
            <div className="flex flex-1 flex-col">
                <header className="fixed w-full top-0 z-50 flex items-center justify-between bg-[#192B3C] text-white p-4 shadow-md">
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
    );
};

export default Sidebar;
