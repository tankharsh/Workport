import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Helmet } from 'react-helmet-async';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser, FaPhone } from 'react-icons/fa';
import Navbar from './Navbar';

const NewUserAuth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { storeUserToken, showPopup } = useAuth();
  
  // Determine if we're on login or register page
  const isLoginPage = location.pathname === '/user-login-new';
  
  // Form states
  const [loginForm, setLoginForm] = useState({
    userEmail: '',
    password: '',
    showPassword: false
  });
  
  const [registerForm, setRegisterForm] = useState({
    userName: '',
    userEmail: '',
    userContact: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  // API endpoints
  const USER_LOGIN_API_URI = "http://localhost:4000/api/users/login";
  const USER_REGISTER_API_URI = "http://localhost:4000/api/users/register";
  
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
  
  // Handle register form changes
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm(prev => ({
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
  const togglePasswordVisibility = (formType) => {
    if (formType === 'login') {
      setLoginForm(prev => ({
        ...prev,
        showPassword: !prev.showPassword
      }));
    } else if (formType === 'register') {
      setRegisterForm(prev => ({
        ...prev,
        showPassword: !prev.showPassword
      }));
    } else if (formType === 'confirmPassword') {
      setRegisterForm(prev => ({
        ...prev,
        showConfirmPassword: !prev.showConfirmPassword
      }));
    }
  };
  
  // Validate login form
  const validateLoginForm = () => {
    const newErrors = {};
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!loginForm.userEmail) {
      newErrors.userEmail = "Email is required";
    } else if (!emailRegex.test(loginForm.userEmail)) {
      newErrors.userEmail = "Please enter a valid email";
    }
    
    // Password validation
    if (!loginForm.password) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Validate register form
  const validateRegisterForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!registerForm.userName.trim()) {
      newErrors.userName = "Name is required";
    } else if (registerForm.userName.length < 3) {
      newErrors.userName = "Name must be at least 3 characters long";
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!registerForm.userEmail) {
      newErrors.userEmail = "Email is required";
    } else if (!emailRegex.test(registerForm.userEmail)) {
      newErrors.userEmail = "Please enter a valid email";
    }
    
    // Contact validation
    const phoneRegex = /^\d{10}$/;
    if (!registerForm.userContact) {
      newErrors.userContact = "Contact number is required";
    } else if (!phoneRegex.test(registerForm.userContact)) {
      newErrors.userContact = "Please enter a valid 10-digit contact number";
    }
    
    // Password validation
    if (!registerForm.password) {
      newErrors.password = "Password is required";
    } else if (registerForm.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    
    // Confirm password validation
    if (registerForm.password !== registerForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      const res = await fetch(USER_LOGIN_API_URI, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: loginForm.userEmail,
          password: loginForm.password
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        console.log("Login successful:", data);
        storeUserToken(data.token, data.user);
        showPopup('Login Successful!', 'success');
        setLoginForm({
          userEmail: '',
          password: '',
          showPassword: false
        });
        navigate('/');
      } else if (res.status === 403 && data.requiresVerification) {
        // Email not verified, redirect to verification page
        showPopup('Please verify your email to continue', 'info');
        navigate(`/verify-email?email=${encodeURIComponent(data.userEmail)}`);
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
  
  // Handle registration submission
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateRegisterForm()) {
      showPopup("Please fix the errors in the form", "error");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const res = await fetch(USER_REGISTER_API_URI, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: registerForm.userName,
          userEmail: registerForm.userEmail,
          userContact: registerForm.userContact,
          password: registerForm.password
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        if (data.requiresVerification) {
          showPopup('Registration Successful! Please verify your email.', 'success');
          navigate(`/verify-email?email=${encodeURIComponent(registerForm.userEmail)}`);
        } else {
          showPopup('Registration Successful!', 'success');
          setRegisterForm({
            userName: '',
            userEmail: '',
            userContact: '',
            password: '',
            confirmPassword: '',
            showPassword: false,
            showConfirmPassword: false
          });
          navigate('/user-login-new');
        }
      } else {
        showPopup(data.message || "Registration failed", "error");
        console.error("Registration failed:", data.message);
      }
    } catch (error) {
      console.error('Registration Error:', error);
      showPopup("An error occurred. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Render login form
  const renderLoginForm = () => (
    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>
      <p className="text-center text-gray-600 mb-8">Sign in to access your account</p>
      
      <form onSubmit={handleLoginSubmit} className="space-y-6">
        {/* Email Field */}
        <div>
          <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="userEmail"
              name="userEmail"
              type="email"
              value={loginForm.userEmail}
              onChange={handleLoginChange}
              className={`block w-full pl-10 pr-3 py-3 border ${
                errors.userEmail ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter your email"
            />
          </div>
          {errors.userEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.userEmail}</p>
          )}
        </div>
        
        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type={loginForm.showPassword ? "text" : "password"}
              value={loginForm.password}
              onChange={handleLoginChange}
              className={`block w-full pl-10 pr-10 py-3 border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter your password"
            />
            <div 
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => togglePasswordVisibility('login')}
            >
              {loginForm.showPassword ? (
                <FaEyeSlash className="h-5 w-5 text-gray-400" />
              ) : (
                <FaEye className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
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
            onClick={() => navigate('/user-register-new')}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign up now
          </button>
        </p>
      </div>
    </div>
  );
  
  // Render registration form
  const renderRegisterForm = () => (
    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Account</h2>
      <p className="text-center text-gray-600 mb-8">Join WorkPort today</p>
      
      <form onSubmit={handleRegisterSubmit} className="space-y-5">
        {/* Name Field */}
        <div>
          <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="userName"
              name="userName"
              type="text"
              value={registerForm.userName}
              onChange={handleRegisterChange}
              className={`block w-full pl-10 pr-3 py-3 border ${
                errors.userName ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter your full name"
            />
          </div>
          {errors.userName && (
            <p className="mt-1 text-sm text-red-600">{errors.userName}</p>
          )}
        </div>
        
        {/* Email Field */}
        <div>
          <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="userEmail"
              name="userEmail"
              type="email"
              value={registerForm.userEmail}
              onChange={handleRegisterChange}
              className={`block w-full pl-10 pr-3 py-3 border ${
                errors.userEmail ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter your email"
            />
          </div>
          {errors.userEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.userEmail}</p>
          )}
        </div>
        
        {/* Contact Field */}
        <div>
          <label htmlFor="userContact" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaPhone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="userContact"
              name="userContact"
              type="tel"
              value={registerForm.userContact}
              onChange={handleRegisterChange}
              className={`block w-full pl-10 pr-3 py-3 border ${
                errors.userContact ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter 10-digit mobile number"
            />
          </div>
          {errors.userContact && (
            <p className="mt-1 text-sm text-red-600">{errors.userContact}</p>
          )}
        </div>
        
        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type={registerForm.showPassword ? "text" : "password"}
              value={registerForm.password}
              onChange={handleRegisterChange}
              className={`block w-full pl-10 pr-10 py-3 border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Create a strong password"
            />
            <div 
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => togglePasswordVisibility('register')}
            >
              {registerForm.showPassword ? (
                <FaEyeSlash className="h-5 w-5 text-gray-400" />
              ) : (
                <FaEye className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>
        
        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={registerForm.showConfirmPassword ? "text" : "password"}
              value={registerForm.confirmPassword}
              onChange={handleRegisterChange}
              className={`block w-full pl-10 pr-10 py-3 border ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Confirm your password"
            />
            <div 
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => togglePasswordVisibility('confirmPassword')}
            >
              {registerForm.showConfirmPassword ? (
                <FaEyeSlash className="h-5 w-5 text-gray-400" />
              ) : (
                <FaEye className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
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
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/user-login-new')}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
  
  return (
    <>
      <Helmet>
        <title>WorkPort | {isLoginPage ? 'Login' : 'Register'}</title>
        <meta 
          name="description" 
          content={isLoginPage ? "Login to your WorkPort account" : "Create a new WorkPort account"} 
        />
      </Helmet>
      
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center px-4 py-12">
        {isLoginPage ? renderLoginForm() : renderRegisterForm()}
      </div>
    </>
  );
};

export default NewUserAuth; 