import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const { user, logout } = useAuth();

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    logout();
    setShowLogoutPopup(false);
  };

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-md py-4 px-6 fixed top-0 w-full shadow-lg z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <NavLink 
            to="/" 
            className="flex items-center space-x-3 group"
          >
            <img 
              src={logo} 
              alt="Workport Logo" 
              className="h-12 w-20 transform group-hover:scale-105 transition-transform duration-300" 
            />
            <span className="text-3xl font-bold tracking-[.15em] bg-gradient-to-r from-emerald-800 to-emerald-600 bg-clip-text text-transparent">
              WORKPORTS
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `text-lg font-medium transition-all duration-300 ${
                  isActive 
                    ? 'text-emerald-600 font-bold' 
                    : 'text-gray-600 hover:text-emerald-500'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/Aboutpage" 
              className={({ isActive }) => 
                `text-lg font-medium transition-all duration-300 ${
                  isActive 
                    ? 'text-emerald-600 font-bold' 
                    : 'text-gray-600 hover:text-emerald-500'
                }`
              }
            >
              About
            </NavLink>
            <NavLink 
              to="/contactpage" 
              className={({ isActive }) => 
                `text-lg font-medium transition-all duration-300 ${
                  isActive 
                    ? 'text-emerald-600 font-bold' 
                    : 'text-gray-600 hover:text-emerald-500'
                }`
              }
            >
              Contact
            </NavLink>

            {user ? (
              <div className="flex items-center space-x-6">
                <NavLink 
                  to="/User-Serivices-history" 
                  className={({ isActive }) => 
                    `text-lg font-medium transition-all duration-300 ${
                      isActive 
                        ? 'text-emerald-600 font-bold' 
                        : 'text-gray-600 hover:text-emerald-500'
                    }`
                  }
                >
                  Services
                </NavLink>
                <button
                  onClick={() => setShowLogoutPopup(true)}
                  className="bg-red-500 text-white px-6 py-2.5 rounded-full font-medium hover:bg-red-600 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <NavLink
                to="/user-login-new"
                className="bg-emerald-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-emerald-700 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                Login
              </NavLink>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors duration-300" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ transform: isMenuOpen ? 'rotate(90deg)' : 'rotate(0)' }}
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

        {/* Mobile Menu */}
        <div 
          className={`md:hidden fixed inset-x-0 top-[76px] bg-white/95 backdrop-blur-md transition-all duration-300 transform ${
            isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
          }`}
        >
          <div className="p-6 space-y-4 border-t border-gray-100">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `block text-lg font-medium transition-all duration-300 ${
                  isActive 
                    ? 'text-emerald-600 font-bold' 
                    : 'text-gray-600 hover:text-emerald-500'
                }`
              }
              onClick={closeMenu}
            >
              Home
            </NavLink>
            <NavLink 
              to="/User-Dashboard" 
              className={({ isActive }) => 
                `block text-lg font-medium transition-all duration-300 ${
                  isActive 
                    ? 'text-emerald-600 font-bold' 
                    : 'text-gray-600 hover:text-emerald-500'
                }`
              }
              onClick={closeMenu}
            >
              Services
            </NavLink>
            <NavLink 
              to="/Aboutpage" 
              className={({ isActive }) => 
                `block text-lg font-medium transition-all duration-300 ${
                  isActive 
                    ? 'text-emerald-600 font-bold' 
                    : 'text-gray-600 hover:text-emerald-500'
                }`
              }
              onClick={closeMenu}
            >
              About
            </NavLink>
            <NavLink 
              to="/contactpage" 
              className={({ isActive }) => 
                `block text-lg font-medium transition-all duration-300 ${
                  isActive 
                    ? 'text-emerald-600 font-bold' 
                    : 'text-gray-600 hover:text-emerald-500'
                }`
              }
              onClick={closeMenu}
            >
              Contact
            </NavLink>

            {user ? (
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <NavLink 
                  to="/User-Serivices-history" 
                  className={({ isActive }) => 
                    `block text-lg font-medium transition-all duration-300 ${
                      isActive 
                        ? 'text-emerald-600 font-bold' 
                        : 'text-gray-600 hover:text-emerald-500'
                    }`
                  }
                  onClick={closeMenu}
                >
                  Services
                </NavLink>
                <button
                  onClick={() => {
                    setShowLogoutPopup(true);
                    closeMenu();
                  }}
                  className="w-full bg-red-500 text-white px-6 py-2.5 rounded-full font-medium hover:bg-red-600 transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <NavLink
                to="/user-login-new"
                className="block w-full bg-emerald-600 text-center text-white px-6 py-2.5 rounded-full font-medium hover:bg-emerald-700 transition-all duration-300"
                onClick={closeMenu}
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] px-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full transform transition-all duration-300 scale-100">
            <h2 className="text-2xl font-bold text-emerald-900 mb-4">
              Confirm Logout
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout from your account?
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleLogout}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-full hover:bg-red-600 transition-all duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutPopup(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-full hover:bg-gray-200 transition-all duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
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

export default Navbar;
