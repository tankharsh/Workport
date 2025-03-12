import React from "react";
import { NavLink } from "react-router-dom";
import logo from '../../assets/logo.png';
import LinkedIn from '../../assets/LinkedIn.png';
import insta from '../../assets/insta.png';
import facebook from '../../assets/facebook.png';
import twitter from '../../assets/twitter.png';
import { MdCall, MdEmail, MdLocationOn } from 'react-icons/md';

const Footer = () => {
  return (
    <footer className="bg-emerald-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <img 
                src={logo} 
                alt="WorkPort Logo" 
                className="h-12 w-20 object-contain" 
              />
              <span className="text-2xl font-bold tracking-wider text-white">
                WORKPORTS
              </span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Your one-stop destination for finding and connecting with local services and businesses. Making your daily life easier, one service at a time.
            </p>
          </div>

          {/* Our Services */}
          <div>
            <h2 className="text-xl font-bold mb-6 text-amber-400">Our Services</h2>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mr-2"></span>
                  Local Shops
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mr-2"></span>
                  Home Services
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mr-2"></span>
                  Pet Care
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mr-2"></span>
                  Fitness Centers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mr-2"></span>
                  Beauty Salon
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-xl font-bold mb-6 text-amber-400">Quick Links</h2>
            <ul className="space-y-3">
              <li>
                <NavLink to="/Aboutpage" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mr-2"></span>
                  About Us
                </NavLink>
              </li>
              <li>
                <NavLink to="/User-Dashboard" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mr-2"></span>
                  Services
                </NavLink>
              </li>
              <li>
                <NavLink to="/contactpage" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mr-2"></span>
                  Contact Us
                </NavLink>
              </li>
              <li>
                <NavLink to="/sp-provider" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mr-2"></span>
                  List Your Business
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-xl font-bold mb-6 text-amber-400">Contact Us</h2>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-gray-300">
                <MdCall className="text-amber-400 text-xl" />
                <span>+91 8849783086</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-300">
                <MdEmail className="text-amber-400 text-xl" />
                <span>info@workport.com</span>
              </li>
              <li className="flex items-start space-x-3 text-gray-300">
                <MdLocationOn className="text-amber-400 text-xl flex-shrink-0 mt-1" />
                <span>123 Business Avenue, Tech Park, Innovation City - 380015</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-emerald-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social Links */}
            <div className="flex space-x-6">
              <a 
                href="#" 
                className="bg-emerald-800 p-2 rounded-full hover:bg-emerald-700 transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <img src={LinkedIn} alt="LinkedIn" className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="bg-emerald-800 p-2 rounded-full hover:bg-emerald-700 transition-colors duration-300"
                aria-label="Facebook"
              >
                <img src={facebook} alt="Facebook" className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="bg-emerald-800 p-2 rounded-full hover:bg-emerald-700 transition-colors duration-300"
                aria-label="Instagram"
              >
                <img src={insta} alt="Instagram" className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="bg-emerald-800 p-2 rounded-full hover:bg-emerald-700 transition-colors duration-300"
                aria-label="Twitter"
              >
                <img src={twitter} alt="X" className="w-5 h-5" />
              </a>
            </div>

            {/* Copyright */}
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} WorkPort. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

