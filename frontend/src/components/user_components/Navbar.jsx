import React from 'react';
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-[#192B3C] text-white p-4 font-[Roboto]">
      <div className="container mx-auto flex items-center justify-between">
        {/* Website Name */}
        <div className="text-2xl font-bold">WorkPort</div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8 items-center justify-between">
          <a href="#home" className="navbar-link ">Home</a>
          <a href="#services" className="navbar-link ">Services</a>
          <a href="#about" className="navbar-link ">About</a>
          <a href="#contact" className="navbar-link ">Contact</a>
          <button className="navbar-link ">Login</button>
          <NavLink to='/dashboard' className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500">Start Selling</NavLink>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            className="text-white focus:outline-none"
            onClick={() => {
              const menu = document.getElementById('mobile-menu');
              menu.classList.toggle('hidden');
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div id="mobile-menu" className="hidden md:hidden bg-[#192B3C] text-white space-y-4 p-4">
        <a href="#home" className="block hover:text-gray-400">Home</a>
        <a href="#services" className="block hover:text-gray-400">Services</a>
        <a href="#about" className="block hover:text-gray-400">About</a>
        <a href="#contact" className="block hover:text-gray-400">Contact</a>
        <button className="block w-full bg-gray-800 px-4 py-2 rounded hover:bg-gray-700">Login</button>
        <NavLink to='/dashboard' className="block w-full bg-blue-600 px-4 py-2 rounded hover:bg-blue-500">Start Selling</NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
