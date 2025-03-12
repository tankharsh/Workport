import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useAuth } from '../../context/AuthContext';
import { FaCartArrowDown } from "react-icons/fa";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false); // State for logout confirmation
  const { user, logout } = useAuth();

  // Function to close the mobile menu when a link is clicked
  const closeMenu = () => setIsMenuOpen(false);

  // Logout Confirmation
  const handleLogout = () => {
    logout();
    setShowLogoutPopup(false); // Close popup after logout
  };

  return (<>

    <nav className="tinos-txt bg-white p-4 top-0 w-full shadow-lg fixed z-50">
      <div className="max-w-9xl flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center text-3xl font-bold">
          <img src={logo} alt="Workport Logo" className="h-12 w-20" />
          <span className="tracking-[.15em]">WORKPORTS</span>
        </NavLink>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-8 items-center">
          <NavLink to="/" className={({ isActive }) => isActive ? `text-orange-600 font-bold text-lg` : `hover:text-gray-400 text-lg font-semibold`}>Home</NavLink>
          <NavLink to="/Aboutpage" className={({isActive}) => isActive ? `text-orange-600 font-bold text-lg`:`hover:text-gray-400 text-lg font-semibold`}>About</NavLink>
          <NavLink to="/contactpage" className={({isActive}) => isActive ? `text-orange-600 font-bold text-lg`:`hover:text-gray-400 text-lg font-semibold`}>Contact</NavLink>
          {user ? (
            <div className="flex gap-6 items-center">
              <NavLink to="/User-Serivices-history" className={({isActive}) => isActive ? `text-orange-600 font-bold text-lg`:`hover:text-gray-400 text-lg font-semibold`}>Services</NavLink>
              <button
                onClick={() => setShowLogoutPopup(true)}
                className="bg-red-500 text-lg font-semibold text-white px-4 py-2 rounded hover:bg-red-700 transition-all duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <NavLink
              to="/user-login-new"
              className="bg-[#FFA901] text-lg font-semibold text-white px-4 py-2 rounded hover:scale-95 transition-all duration-300 hover:bg-[#a37821]"
            >
              Login
            </NavLink>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button className="text-black focus:outline-none" onClick={() => setIsMenuOpen(!isMenuOpen)}>
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
      <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden bg-white shadow-lg absolute w-full left-0 top-16 p-4 space-y-4`}>
        <NavLink to="/" className={({isActive}) => isActive ? `text-orange-600 block`:`block hover:text-gray-400`} onClick={closeMenu}>Home</NavLink>
        <NavLink to="/User-Dashboard" className={({isActive}) => isActive ? `text-orange-600 block`:`block hover:text-gray-400`} onClick={closeMenu}>Services</NavLink>
        <NavLink to="/Aboutpage" className={({isActive}) => isActive ? `text-orange-600 block`:`block hover:text-gray-400`} onClick={closeMenu}>About</NavLink>
        <NavLink to="/contactpage" className={({isActive}) => isActive ? `text-orange-600 block`:`block hover:text-gray-400`} onClick={closeMenu}>Contact</NavLink>
        {user ? (
          <div className="flex flex-col gap-4">
            <NavLink to="/User-Serivices-history" className={({isActive}) => isActive ? `text-orange-600 block`:`block hover:text-gray-400`}>
            Services
            </NavLink>
            <button
              onClick={() => setShowLogoutPopup(true)}
              className="bg-red-500 text-lg font-semibold text-white px-4 py-2 rounded hover:bg-red-700 transition-all duration-300"
            >
              Logout
            </button>
          </div>
        ) : (
          <NavLink
            to="/user-login-new"
            className="bg-[#FFA901] text-lg font-semibold text-black px-4 py-2 rounded hover:bg-pink-700 block"
            onClick={closeMenu}
          >
            Login
          </NavLink>
        )}
      </div>

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
    </nav>
  </>);
};

export default Navbar;
