import React, { useState } from "react";
import { TbHomeFilled } from "react-icons/tb";
import { GrServices } from "react-icons/gr";
import { BsPersonWorkspace } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { NavLink } from "react-router-dom";
import { FaAlignRight } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { BiCategory } from "react-icons/bi";

const AdminSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
        document.body.style.overflow = isOpen ? "auto" : "hidden"; 
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="relative font-[Roboto, sans-serif]">
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={toggleSidebar} 
                ></div>
            )}

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 bg-[#192B3C] text-white w-64 transform ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } transition-transform duration-300 ease-in-out z-50 lg:translate-x-0 lg:block`}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-4">
                    <span className="font-bold text-4xl">WorkPorts</span>
                    <button
                        onClick={toggleSidebar}
                        className="text-white text-2xl focus:outline-none lg:hidden"
                    >
                        &times;
                    </button>
                </div>

                {/* Sidebar Links */}
                <nav className="mt-3">
                    <NavLink
                        to="/"
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

                    {/* Service Provider with Dropdown */}
                    <div className="relative">
                        <button
                            onClick={toggleDropdown}
                            className="block w-full px-4 py-2 mt-3 hover:bg-[#6499C2] text-white flex justify-between items-center"
                        >
                            <span className="flex gap-2 items-center">
                               <BiCategory className="text-2xl" /> Category
                            </span>
                            <FaChevronDown className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                        </button>

                        {isDropdownOpen && (
                            <div className="bg-[#1E3A4C] rounded-md shadow-md mt-1">
                                <NavLink
                                    to="/Admin-Dashboard/add-category"
                                    className="block px-6 py-2 hover:bg-[#6499C2] text-white"
                                >
                                    ➕ Add Category
                                </NavLink>
                                <NavLink
                                    to="/Admin-Dashboard/all-categories"
                                    className="block px-6 py-2 hover:bg-[#6499C2] text-white"
                                >
                                    📂 All Categories
                                </NavLink>
                            </div>
                        )}
                    </div>

                    <NavLink
                        to="/Admin-Dashboard/all-users"
                        className={({ isActive }) =>
                            isActive
                                ? "block px-4 py-2 mt-3 bg-[#6499C2] text-white"
                                : "block px-4 py-2 mt-3 hover:bg-[#6499C2] text-white"
                        }
                    >
                        <span className="flex px-2 gap-3 justify-start items-center">
                            <BsPersonWorkspace className="text-2xl" /> Users
                        </span>
                    </NavLink>

                    <NavLink
                        to="/Admin-Dashboard/all-serviceproviders"
                        className={({ isActive }) =>
                            isActive
                                ? "block px-4 py-2 mt-3 bg-[#6499C2] text-white"
                                : "block px-4 py-2 mt-3 hover:bg-[#6499C2] text-white"
                        }
                    >
                        <span className="flex px-2 gap-3 justify-start items-center">
                         <GrServices  className="text-2xl" /> Service Providers
                        </span>
                    </NavLink>

                    <a href="#" className="block px-4 py-2 mt-3 hover:bg-red-700">
                        <span className="flex px-2 gap-3 justify-start items-center">
                            <HiOutlineLogout className="text-2xl" /> Logout
                        </span>
                    </a>
                </nav>
            </div>

            {/* Navbar */}
            <div className="flex flex-1 flex-col">
                <header className="fixed w-full top-0 z-50 flex items-center justify-between bg-[#192B3C] text-white p-4 shadow-md">
                    <button
                        onClick={toggleSidebar}
                        className="text-2xl focus:outline-none lg:hidden"
                    >
                        <FaAlignRight />
                    </button>
                    <span className="font-bold text-lg">Admin Dashboard</span>
                </header>
            </div>
        </div>
    );
};

export default AdminSidebar;
