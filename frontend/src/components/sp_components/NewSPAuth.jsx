import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Helmet } from 'react-helmet-async';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser, FaPhone } from 'react-icons/fa';
import Navbar from '../user_components/Navbar';

const NewSPAuth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { storeSPToken, showPopup, serviceprovider } = useAuth();
  
  // Check if already logged in
  useEffect(() => {
    const spToken = localStorage.getItem('SP_token');
    if (spToken && serviceprovider) {
      navigate('/dashboard', { replace: true });
    }
  }, [serviceprovider, navigate]);
  
  // Determine if we're on login or register page
  const isLoginPage = location.pathname === '/sp-provider-login-new';
  
  // Form states
  const [loginForm, setLoginForm] = useState({
    spEmail: '',
    spPassword: '',
    showPassword: false
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  // API endpoints
  const SP_LOGIN_API_URI = "http://localhost:4000/api/sp/sp_login";
  
  // Handle login form changes
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setLoginForm(prev => ({
      ...prev,
      showPassword: !prev.showPassword
    }));
  };
  
  // Validate login form
  const validateLoginForm = () => {
    const newErrors = {};
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!loginForm.spEmail) {
      newErrors.spEmail = "Email is required";
    } else if (!emailRegex.test(loginForm.spEmail)) {
      newErrors.spEmail = "Please enter a valid email";
    }
    
    // Password validation
    if (!loginForm.spPassword) {
      newErrors.spPassword = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateLoginForm()) {
      showPopup("Please fix the errors in the form", "error");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const res = await fetch(SP_LOGIN_API_URI, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spEmail: loginForm.spEmail,
          spPassword: loginForm.spPassword
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        console.log("Login successful:", data);
        storeSPToken(data.token, data.serviceProvider);
        showPopup('Login Successful!', 'success');
        setLoginForm({
          spEmail: '',
          spPassword: '',
          showPassword: false
        });
        navigate('/dashboard');
      } else if (res.status === 403 && data.requiresVerification) {
        // Email not verified, redirect to verification page
        showPopup('Please verify your email to continue', 'info');
        navigate(`/verify-email?email=${encodeURIComponent(data.spEmail)}&type=sp`);
      } else {
        showPopup('Login Failed: ' + (data.message || "Unknown error"), 'error');
        console.log("Login failed:", data.message || "Unknown error");
      }
    } catch (error) {
      console.error("Unexpected error during login:", error);
      showPopup("An error occurred. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Render login form
  const renderLoginForm = () => (
    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Service Provider Login</h2>
      <p className="text-center text-gray-600 mb-8">Sign in to manage your services</p>
      
      <form onSubmit={handleLoginSubmit} className="space-y-6">
        {/* Email Field */}
        <div>
          <label htmlFor="spEmail" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="spEmail"
              name="spEmail"
              type="email"
              value={loginForm.spEmail}
              onChange={handleLoginChange}
              className={`block w-full pl-10 pr-3 py-3 border ${
                errors.spEmail ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter your email"
            />
          </div>
          {errors.spEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.spEmail}</p>
          )}
        </div>
        
        {/* Password Field */}
        <div>
          <label htmlFor="spPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="spPassword"
              name="spPassword"
              type={loginForm.showPassword ? "text" : "password"}
              value={loginForm.spPassword}
              onChange={handleLoginChange}
              className={`block w-full pl-10 pr-10 py-3 border ${
                errors.spPassword ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter your password"
            />
            <div 
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {loginForm.showPassword ? (
                <FaEyeSlash className="h-5 w-5 text-gray-400" />
              ) : (
                <FaEye className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </div>
          {errors.spPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.spPassword}</p>
          )}
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/sp-provider')}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Register as Service Provider
          </button>
        </p>
      </div>
    </div>
  );
  
  return (
    <>
      <Helmet>
        <title>WorkPort | Service Provider Login</title>
        <meta 
          name="description" 
          content="Login to your WorkPort service provider account" 
        />
      </Helmet>
      
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center px-4 py-12">
        {renderLoginForm()}
      </div>
    </>
  );
};

export default NewSPAuth; 