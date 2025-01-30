import React from "react";
import logo from '../../assets/logo.png'
import LinkedIn from '../../assets/LinkedIn.png'
import insta from '../../assets/insta.png'
import facebook from '../../assets/facebook.png'
import twitter from '../../assets/twitter.png'
import { NavLink } from "react-router-dom";



const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#7D84B21D] to-[#7D84B21D] p-8 md:p-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Our Services Section */}
        <div>
          <h2 className="text-lg font-bold mb-4">Our Services</h2>
          <ul className="space-y-2">
            <li>Local Shops</li>
            <li>Home Service</li>
            <li>Pet Care</li>
            <li>Fitness Centers</li>
            <li>Beauty Salon</li>
            <li>Hair Salon</li>
          </ul>
        </div>

        {/* Company Section */}
        <div>
          <h2 className="text-lg font-bold mb-4">Company</h2>
          <ul className="space-y-2">
            <li>About Us</li>
            <li>Services</li>
            <li>Contact Us</li>
            <li><NavLink to="/sp-provider" className="hover:text-green-500">List Your Business</NavLink></li>
          </ul>
          
        </div>

        {/* Contact Details Section */}
        <div>
          <h2 className="text-lg font-bold mb-4">Contact Details</h2>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="material-icons">call</span>
              +91 8849783086
            </li>
            <li className="flex items-center gap-2">
              <span className="material-icons">email</span>
              info@workport.com
            </li>
          </ul>
          <div className="mt-4">
            <img src={logo} alt="WorkPort Logo" className="w-64 h-32" />
          </div>
        </div>
      </div>

      {/* Social Icons and Copyright */}
      <div className="mt-8 border-t border-gray-300 pt-4 flex flex-col md:flex-row items-center justify-between">
        {/* Social Media Icons */}
        <div className="flex space-x-4">
          <a href="#" className="hover:opacity-75">
            <img src={LinkedIn} alt="LinkedIn" className="w-6 h-6" />
          </a>
          <a href="#" className="hover:opacity-75">
            <img src={facebook} alt="Facebook" className="w-6 h-6" />
          </a>
          <a href="#" className="hover:opacity-75">
            <img src={insta} alt="Instagram" className="w-6 h-6" />
          </a>
          <a href="#" className="hover:opacity-75">
            <img src={twitter} alt="X" className="w-6 h-6" />
          </a>
        </div>

        {/* Copyright Text */}
        <p className="text-sm text-gray-500 mt-4 md:mt-0">
          &copy; 2025 WorkPort. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

