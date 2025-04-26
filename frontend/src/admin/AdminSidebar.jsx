import React, { useState } from "react";
import { TbHomeFilled } from "react-icons/tb";
import { GrServices } from "react-icons/gr";
import { BsPersonWorkspace } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { NavLink } from "react-router-dom";
import { FaChevronDown, FaEnvelope } from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

const AdminSidebar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        Swal.fire({
            title: "Logout Confirmation",
            text: "Are you sure you want to logout?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, logout",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                // Add logout logic here
                console.log("Logging out...");
            }
        });
    };

    const dropdownVariants = {
        open: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.2
            }
        },
        closed: {
            opacity: 0,
            y: -10,
            transition: {
                duration: 0.2
            }
        }
    };

    return (
        <div className="relative font-[Roboto, sans-serif]">
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 bg-gradient-to-b from-[#192B3C] to-[#0f1a24] text-white w-64 shadow-xl">
                {/* Sidebar Header */}
                <div className="flex items-center justify-center p-4 border-b border-gray-700">
                    <motion.span
                        className="font-bold text-4xl bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text"
                        whileHover={{ scale: 1.05 }}
                    >
                        WorkPorts
                    </motion.span>
                </div>

                {/* Sidebar Links */}
                <nav className="mt-6 px-4">
                    <NavLink
                        to="/Admin-Dashboard"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                isActive
                                    ? "bg-emerald-500/20 text-emerald-400"
                                    : "hover:bg-white/10 text-gray-300 hover:text-white"
                            }`
                        }
                    >
                        <TbHomeFilled className="text-2xl" />
                        <span>Dashboard</span>
                    </NavLink>

                    {/* Category Dropdown */}
                    <div className="relative mt-4">
                        <motion.button
                            onClick={toggleDropdown}
                            whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                            className="flex items-center justify-between w-full px-4 py-3 text-gray-300 hover:text-white rounded-lg transition-colors"
                        >
                            <span className="flex items-center gap-3">
                                <BiCategory className="text-2xl" />
                                Category
                            </span>
                            <motion.span
                                animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <FaChevronDown />
                            </motion.span>
                        </motion.button>

                        <AnimatePresence>
                            {isDropdownOpen && (
                                <motion.div
                                    variants={dropdownVariants}
                                    initial="closed"
                                    animate="open"
                                    exit="closed"
                                    className="mt-2 py-2 bg-[#1E3A4C] rounded-lg overflow-hidden"
                                >
                                    <NavLink
                                        to="/Admin-Dashboard/add-category"
                                        className={({ isActive }) =>
                                            `flex items-center px-6 py-2 transition-colors ${
                                                isActive
                                                    ? "text-emerald-400 bg-emerald-500/10"
                                                    : "text-gray-300 hover:text-white hover:bg-white/10"
                                            }`
                                        }
                                    >
                                        ➕ Add Category
                                    </NavLink>
                                    <NavLink
                                        to="/Admin-Dashboard/all-categories"
                                        className={({ isActive }) =>
                                            `flex items-center px-6 py-2 transition-colors ${
                                                isActive
                                                    ? "text-emerald-400 bg-emerald-500/10"
                                                    : "text-gray-300 hover:text-white hover:bg-white/10"
                                            }`
                                        }
                                    >
                                        📂 All Categories
                                    </NavLink>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <NavLink
                        to="/Admin-Dashboard/all-users"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 mt-4 rounded-lg transition-all duration-200 ${
                                isActive
                                    ? "bg-emerald-500/20 text-emerald-400"
                                    : "hover:bg-white/10 text-gray-300 hover:text-white"
                            }`
                        }
                    >
                        <BsPersonWorkspace className="text-2xl" />
                        <span>Users</span>
                    </NavLink>

                    <NavLink
                        to="/Admin-Dashboard/all-serviceproviders"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 mt-4 rounded-lg transition-all duration-200 ${
                                isActive
                                    ? "bg-emerald-500/20 text-emerald-400"
                                    : "hover:bg-white/10 text-gray-300 hover:text-white"
                            }`
                        }
                    >
                        <GrServices className="text-2xl" />
                        <span>Service Providers</span>
                    </NavLink>

                    <NavLink
                        to="/Admin-Dashboard/contact-messages"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 mt-4 rounded-lg transition-all duration-200 ${
                                isActive
                                    ? "bg-emerald-500/20 text-emerald-400"
                                    : "hover:bg-white/10 text-gray-300 hover:text-white"
                            }`
                        }
                    >
                        <FaEnvelope className="text-2xl" />
                        <span>Contact Messages</span>
                    </NavLink>

                    <motion.button
                        onClick={handleLogout}
                        whileHover={{ backgroundColor: "rgba(239, 68, 68, 0.2)" }}
                        className="flex items-center gap-3 px-4 py-3 mt-4 rounded-lg w-full text-red-400 hover:text-red-300 transition-colors"
                    >
                        <HiOutlineLogout className="text-2xl" />
                        <span>Logout</span>
                    </motion.button>
                </nav>
            </div>

            {/* Navbar */}
            <div className="flex flex-1 flex-col">
                <header className="fixed w-full top-0 z-40 bg-gradient-to-r from-[#192B3C] to-[#0f1a24] text-white shadow-lg">
                    <div className="flex items-center justify-end px-4 py-4">
                        <span className="font-bold text-lg">Admin Dashboard</span>
                    </div>
                </header>
            </div>
        </div>
    );
};

export default AdminSidebar;
