import React, { useState } from "react";
import { TbHomeFilled } from "react-icons/tb";
import { GrServices } from "react-icons/gr";
import { BsPersonWorkspace } from "react-icons/bs";
import { BsShop } from "react-icons/bs";
import { FaCartShopping } from "react-icons/fa6";
import { MdFeedback } from "react-icons/md";
import { HiOutlineLogout } from "react-icons/hi";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="flex font-[Roboto, sans-serif]">
            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 bg-[#2C43A0] text-white w-64 transform ${isOpen ? "translate-x-0" : "-translate-x-full"
                    } transition-transform duration-300 ease-in-out lg:translate-x-0`}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-4">
                    <span className="font-bold px-8 text-3xl">WorkPort</span>
                    {/* Close Button */}
                    <button
                        onClick={toggleSidebar}
                        className="text-white text-2xl focus:outline-none lg:hidden"
                    >
                        &times;
                    </button>
                </div>
                {/* Sidebar Links */}
                    {/* <span className="block px-14 text-xl font-bold">Shop Name</span> */}
                <nav className="mt-3">
                    <a href="/" className="block px-4 py-2 hover:bg-purple-700">
                        <span className="flex px-2 gap-3 justify-start items-center"><TbHomeFilled className="text-2xl" /> Dashborad</span>
                    </a>
                    <a href="#" className="block px-4 py-2 mt-3 hover:bg-purple-700">
                        <span className="flex px-2 gap-3 justify-start items-center"><GrServices className="text-2xl" /> Add Service</span>
                    </a>
                    <a href="#" className="block px-4 py-2 mt-3 hover:bg-purple-700">
                        <span className="flex px-2 gap-3 justify-start items-center"><BsPersonWorkspace className="text-2xl" /> Profile</span>
                    </a>
                    <a href="#" className="block px-4 py-2 mt-3 hover:bg-purple-700">
                        <span className="flex px-2 gap-3 justify-start items-center"><BsShop className="text-2xl" /> My Shop</span>
                    </a>
                    <a href="#" className="block px-4 py-2 mt-3 hover:bg-purple-700">
                        <span className="flex px-2 gap-3 justify-start items-center"><FaCartShopping className="text-2xl" /> Orders</span>
                    </a>
                    <a href="#" className="block px-4 py-2 mt-3 hover:bg-purple-700">
                        <span className="flex px-2 gap-3 justify-start items-center"><MdFeedback className="text-2xl" /> Feedback</span>
                    </a>
                    <a href="#" className="block px-4 py-2 mt-3 hover:bg-red-700">
                        <span className="flex px-2 gap-3 justify-start items-center"><HiOutlineLogout className="text-2xl" /> Logout</span>
                    </a>
                </nav>
            </div>

            {/* Navbar */}
            <div className="flex flex-1 flex-col">
                <header className="flex items-center justify-between bg-[#2C43A0] text-white p-4">
                    {/* Sidebar Toggle Button */}
                    <button
                        onClick={toggleSidebar}
                        className="text-2xl focus:outline-none lg:hidden"
                    >
                        ☰
                    </button>
                    <span className="font-bold text-lg">WorkPort</span>
                    <nav className="hidden lg:flex gap-6 items-center">

                    </nav>
                </header>
            </div>
        </div>
    );
};

export default Sidebar;
