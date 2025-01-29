import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to close menu when a link is clicked
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="bg-[#ECC3C2]/25 text-black p-4 font-[Roboto]">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Website Logo */}
        <NavLink to="/" className="flex items-center text-3xl font-bold">
          <img src={logo} alt="Workport Logo" className="h-12 w-20" />
          <span>WORKPORT</span>
        </NavLink>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-8 items-center">
          <NavLink to="/" className="hover:text-gray-400 text-lg font-semibold">Home</NavLink>
          <NavLink to="/#services" className="hover:text-gray-400 text-lg font-semibold">Services</NavLink>
          <NavLink to="/#about" className="hover:text-gray-400 text-lg font-semibold">About</NavLink>
          <NavLink to="/#contact" className="hover:text-gray-400 text-lg font-semibold">Contact</NavLink>
          <NavLink to="/user-login" className="bg-[#EEB6B6] text-lg font-semibold text-black px-4 py-2 rounded hover:bg-pink-700">
            Login
          </NavLink>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            className="text-black focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
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
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden bg-[#ECC3C2]/25 text-black space-y-4 p-4`}>
        <NavLink to="/" className="block hover:text-gray-400" onClick={closeMenu}>Home</NavLink>
        <NavLink to="/#services" className="block hover:text-gray-400" onClick={closeMenu}>Services</NavLink>
        <NavLink to="/#about" className="block hover:text-gray-400" onClick={closeMenu}>About</NavLink>
        <NavLink to="/#contact" className="block hover:text-gray-400" onClick={closeMenu}>Contact</NavLink>
        <NavLink to="/user-login" className="bg-[#EEB6B6] text-lg font-semibold text-black px-4 py-2 rounded hover:bg-pink-700 block" onClick={closeMenu}>
          Login
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
