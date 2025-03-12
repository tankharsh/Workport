import React, { useContext, useEffect, useRef, useState } from 'react'
import Navbar from './Navbar'
import gsap from 'gsap'
import {useAuth} from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

function UserRegistrationFrom() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userContact: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { showPopup } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.userName.trim()) {
      newErrors.userName = "Name is required";
    } else if (formData.userName.length < 3) {
      newErrors.userName = "Name must be at least 3 characters long";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.userEmail) {
      newErrors.userEmail = "Email is required";
    } else if (!emailRegex.test(formData.userEmail)) {
      newErrors.userEmail = "Please enter a valid email";
    }

    // Contact validation
    const phoneRegex = /^\d{10}$/;
    if (!formData.userContact) {
      newErrors.userContact = "Contact number is required";
    } else if (!phoneRegex.test(formData.userContact)) {
      newErrors.userContact = "Please enter a valid 10-digit contact number";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showPopup("Please fix the errors in the form", "error");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:4000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: formData.userName,
          userEmail: formData.userEmail,
          userContact: formData.userContact,
          password: formData.password
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showPopup("Registration Successful! Please verify your email.", "success");
        navigate('/user-login');
      } else {
        showPopup(data.message || "Registration failed", "error");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      showPopup("Registration failed! Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  }

  const RegRef = useRef();
  useEffect(() => {
    gsap.fromTo(
      RegRef.current,
      { opacity: 0, y: 50, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power2.out' }
    );
  }, []);

  return (
    <>
      <Helmet>
        <title>WorkPort | Registration</title>
        <meta name="description" content="Register as a new user on WorkPort" />
        <meta name="author" content="WorkPort Team" />
      </Helmet>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
        <div ref={RegRef} className="bg-white shadow-lg w-full max-w-md p-8 rounded-lg">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
            Create Your Account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-600">
                Full Name
              </label>
              <input
                name="userName"
                type="text"
                id="userName"
                value={formData.userName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  errors.userName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.userName && (
                <p className="mt-1 text-xs text-red-500">{errors.userName}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="userEmail" className="block text-sm font-medium text-gray-600">
                Email Address
              </label>
              <input
                name="userEmail"
                type="email"
                id="userEmail"
                value={formData.userEmail}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  errors.userEmail ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.userEmail && (
                <p className="mt-1 text-xs text-red-500">{errors.userEmail}</p>
              )}
            </div>

            {/* Contact Field */}
            <div>
              <label htmlFor="userContact" className="block text-sm font-medium text-gray-600">
                Contact Number
              </label>
              <input
                name="userContact"
                type="tel"
                id="userContact"
                value={formData.userContact}
                onChange={handleChange}
                placeholder="Enter 10-digit mobile number"
                className={`w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  errors.userContact ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.userContact && (
                <p className="mt-1 text-xs text-red-500">{errors.userContact}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                Password
              </label>
              <input
                name="password"
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className={`w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={`w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Registering...' : 'Create Account'}
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/user-login')}
                className="text-blue-500 hover:text-blue-600 font-medium"
              >
                Login here
              </button>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default UserRegistrationFrom;