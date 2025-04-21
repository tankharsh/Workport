import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser, FaPhone, FaArrowRight } from 'react-icons/fa';
import Navbar from './Navbar';
import { API_ENDPOINTS } from '../../config/config';

const NewUserAuth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { storeUserToken, showPopup } = useAuth();
  const isLoginPage = location.pathname === '/user-login-new';

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



  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Use centralized API endpoints
  const USER_LOGIN_API_URI = API_ENDPOINTS.USER_LOGIN;
  const USER_REGISTER_API_URI = API_ENDPOINTS.USER_REGISTER;

  // Handle login form changes
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: value
    }));
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

    // Prevent multiple submissions
    if (isLoading) return;

    setIsLoading(true);

    try {
      // Use a timeout to ensure the loading state is visible
      setTimeout(async () => {
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
        } catch (innerError) {
          console.error("Unexpected error during login:", innerError);
          showPopup("An error occurred. Please try again.", "error");
        } finally {
          setIsLoading(false);
        }
      }, 500); // Small delay to show loading state
    } catch (error) {
      console.error("Outer login error:", error);
      showPopup("An error occurred. Please try again.", "error");
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

    // Prevent multiple submissions
    if (isLoading) return;

    setIsLoading(true);
    console.log("Submitting registration form:", {
      userName: registerForm.userName,
      userEmail: registerForm.userEmail,
      userContact: registerForm.userContact,
      password: registerForm.password
    });

    try {
      // Use a timeout to ensure the loading state is visible
      setTimeout(async () => {
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
          console.log("Registration response:", { status: res.status, data });

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
        } catch (innerError) {
          console.error('Registration Error:', innerError);
          showPopup("An error occurred. Please try again.", "error");
        } finally {
          setIsLoading(false);
        }
      }, 500); // Small delay to show loading state
    } catch (error) {
      console.error('Outer Registration Error:', error);
      showPopup("An error occurred. Please try again.", "error");
      setIsLoading(false);
    }
  };

  const renderLoginForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gradient-to-br from-emerald-800/90 to-emerald-900/90 rounded-3xl shadow-2xl p-8 lg:p-12 w-full max-w-md backdrop-blur-lg"
    >
      <h2 className="text-3xl font-bold text-white mb-8">Welcome Back</h2>
      <form onSubmit={handleLoginSubmit} className="space-y-6" autoComplete="on">
        {/* Email Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-emerald-600">
            <FaEnvelope className="text-lg" />
          </div>
          <input
            type="email"
            name="userEmail"
            value={loginForm.userEmail}
            onChange={handleLoginChange}
            placeholder="Email address"
            className={`w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border-2 ${errors.userEmail ? 'border-red-400' : 'border-emerald-300/20'} text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
            autoComplete="email"
          />
          {errors.userEmail && (
            <p className="text-red-400 text-sm mt-1 ml-1">{errors.userEmail}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-emerald-600">
            <FaLock className="text-lg" />
          </div>
          <input
            type={loginForm.showPassword ? "text" : "password"}
            name="password"
            value={loginForm.password}
            onChange={handleLoginChange}
            placeholder="Password"
            className={`w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border-2 ${errors.password ? 'border-red-400' : 'border-emerald-300/20'} text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
            autoComplete="current-password"
          />
          {errors.password && (
            <p className="text-red-400 text-sm mt-1 ml-1">{errors.password}</p>
          )}
          <button
            type="button"
            onClick={() => togglePasswordVisibility('login')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
          >
            {loginForm.showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center py-4 px-6 rounded-xl bg-amber-400 text-emerald-900 hover:bg-amber-300 transition-all duration-300 transform hover:scale-105 font-medium disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="w-5 h-5 border-2 border-emerald-900 border-t-transparent rounded-full animate-spin mr-2"></div>
              Signing in...
            </div>
          ) : (
            <>
              Sign In
              <FaArrowRight className="ml-2" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-white/80">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/user-register-new')}
            className="text-amber-400 hover:text-amber-300 font-medium transition-colors hover:underline"
          >
            Sign up now
          </button>
        </p>
      </div>
    </motion.div>
  );

  const renderRegisterForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gradient-to-br from-emerald-800/90 to-emerald-900/90 rounded-3xl shadow-2xl p-8 lg:p-12 w-full max-w-md backdrop-blur-lg"
    >
      <h2 className="text-3xl font-bold text-white mb-8">Create Account</h2>
      <form onSubmit={handleRegisterSubmit} className="space-y-6" autoComplete="on">
        {/* Name Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-emerald-600">
            <FaUser className="text-lg" />
          </div>
          <input
            type="text"
            name="userName"
            value={registerForm.userName}
            onChange={handleRegisterChange}
            placeholder="Full name"
            className={`w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border-2 ${errors.userName ? 'border-red-400' : 'border-emerald-300/20'} text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
            autoComplete="name"
          />
          {errors.userName && (
            <p className="text-red-400 text-sm mt-1 ml-1">{errors.userName}</p>
          )}
        </div>

        {/* Email Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-emerald-600">
            <FaEnvelope className="text-lg" />
          </div>
          <input
            type="email"
            name="userEmail"
            value={registerForm.userEmail}
            onChange={handleRegisterChange}
            placeholder="Email address"
            className={`w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border-2 ${errors.userEmail ? 'border-red-400' : 'border-emerald-300/20'} text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
            autoComplete="email"
          />
          {errors.userEmail && (
            <p className="text-red-400 text-sm mt-1 ml-1">{errors.userEmail}</p>
          )}
        </div>

        {/* Contact Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-emerald-600">
            <FaPhone className="text-lg" />
          </div>
          <input
            type="tel"
            name="userContact"
            value={registerForm.userContact}
            onChange={handleRegisterChange}
            placeholder="Contact number"
            className={`w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border-2 ${errors.userContact ? 'border-red-400' : 'border-emerald-300/20'} text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
            autoComplete="tel"
          />
          {errors.userContact && (
            <p className="text-red-400 text-sm mt-1 ml-1">{errors.userContact}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-emerald-600">
            <FaLock className="text-lg" />
          </div>
          <input
            type={registerForm.showPassword ? "text" : "password"}
            name="password"
            value={registerForm.password}
            onChange={handleRegisterChange}
            placeholder="Password"
            className={`w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border-2 ${errors.password ? 'border-red-400' : 'border-emerald-300/20'} text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
            autoComplete="new-password"
          />
          {errors.password && (
            <p className="text-red-400 text-sm mt-1 ml-1">{errors.password}</p>
          )}
          <button
            type="button"
            onClick={() => togglePasswordVisibility('register')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
          >
            {registerForm.showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Confirm Password Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-emerald-600">
            <FaLock className="text-lg" />
          </div>
          <input
            type={registerForm.showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={registerForm.confirmPassword}
            onChange={handleRegisterChange}
            placeholder="Confirm password"
            className={`w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border-2 ${errors.confirmPassword ? 'border-red-400' : 'border-emerald-300/20'} text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
            autoComplete="new-password"
          />
          {errors.confirmPassword && (
            <p className="text-red-400 text-sm mt-1 ml-1">{errors.confirmPassword}</p>
          )}
          <button
            type="button"
            onClick={() => togglePasswordVisibility('confirmPassword')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
          >
            {registerForm.showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center py-4 px-6 rounded-xl bg-amber-400 text-emerald-900 hover:bg-amber-300 transition-all duration-300 transform hover:scale-105 font-medium disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="w-5 h-5 border-2 border-emerald-900 border-t-transparent rounded-full animate-spin mr-2"></div>
              Creating Account...
            </div>
          ) : (
            <>
              Create Account
              <FaArrowRight className="ml-2" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-white/80">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/user-login-new')}
            className="text-amber-400 hover:text-amber-300 font-medium transition-colors hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </motion.div>
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

      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 relative">
        <div className="absolute inset-0 bg-[url('/path/to/your/pattern.svg')] opacity-10"></div>
        <Navbar />

        <div className="container mx-auto px-4">
          <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12">
            <AnimatePresence mode="wait">
              {isLoginPage ? renderLoginForm() : renderRegisterForm()}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewUserAuth;