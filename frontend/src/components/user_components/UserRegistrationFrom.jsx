import React, { useContext, useEffect, useRef, useState } from 'react'
import Navbar from './Navbar'
import gsap from 'gsap'
import {useAuth} from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaShieldAlt } from 'react-icons/fa';

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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-500 to-emerald-700 py-12 px-4">
        <div ref={RegRef} className="bg-white shadow-2xl w-full max-w-md rounded-2xl relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-10"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-200 rounded-full translate-y-1/2 -translate-x-1/2 opacity-10"></div>

          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 relative inline-block">
                Create Account
                <span className="block text-sm font-normal text-emerald-600 mt-2">Join our community today</span>
                <div className="absolute -bottom-2 left-0 w-12 h-1 bg-emerald-500 rounded-full"></div>
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaUser className="text-emerald-500" />
                  </div>
                  <input
                    name="userName"
                    type="text"
                    value={formData.userName}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                      errors.userName ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                  />
                </div>
                {errors.userName && (
                  <p className="mt-1.5 text-sm text-red-500 flex items-center">
                    <FaShieldAlt className="mr-1" /> {errors.userName}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaEnvelope className="text-emerald-500" />
                  </div>
                  <input
                    name="userEmail"
                    type="email"
                    value={formData.userEmail}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                      errors.userEmail ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                  />
                </div>
                {errors.userEmail && (
                  <p className="mt-1.5 text-sm text-red-500 flex items-center">
                    <FaShieldAlt className="mr-1" /> {errors.userEmail}
                  </p>
                )}
              </div>

              {/* Contact Field */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaPhone className="text-emerald-500" />
                  </div>
                  <input
                    name="userContact"
                    type="tel"
                    value={formData.userContact}
                    onChange={handleChange}
                    placeholder="Contact Number"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                      errors.userContact ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                  />
                </div>
                {errors.userContact && (
                  <p className="mt-1.5 text-sm text-red-500 flex items-center">
                    <FaShieldAlt className="mr-1" /> {errors.userContact}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaLock className="text-emerald-500" />
                  </div>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create Password"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                      errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                  />
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-sm text-red-500 flex items-center">
                    <FaShieldAlt className="mr-1" /> {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaLock className="text-emerald-500" />
                  </div>
                  <input
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                      errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-sm text-red-500 flex items-center">
                    <FaShieldAlt className="mr-1" /> {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-xl hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-300 relative overflow-hidden group mt-6"
              >
                <span className="absolute w-64 h-64 mt-12 group-hover:-rotate-45 transition-all duration-500 ease-out -translate-x-20 -translate-y-32 bg-white opacity-10 rounded-full"></span>
                <span className="relative">
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </span>
              </button>

              <p className="text-center text-gray-600 mt-6">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/user-login')}
                  className="text-emerald-600 hover:text-emerald-700 font-medium focus:outline-none"
                >
                  Sign In
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserRegistrationFrom;