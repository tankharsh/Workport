import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Slice from '../../assets/Slice.png'
import { FaUser, FaEnvelope, FaLock, FaPhone, FaEyeSlash, FaEye } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Footer from "./Footer";
import { Helmet } from "react-helmet-async";

export default function UserLogin() {

  // *** Users API 
  const USER_LOGIN_API_URI = "http://localhost:4000/api/users/login"
  const USER_REGISTER_API_URI = "http://localhost:4000/api/users/register"

  const [isSignup, setIsSignup] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userContact, setUserContact] = useState('');
  const [userName, setUserName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate()

  const { storeUserToken, showPopup } = useAuth();

  //  *** Login Logic here
  const handleSubmit = async (e) => {
    e.preventDefault();

    const credentials = ({ userEmail, password })
    try {
      const res = await fetch(USER_LOGIN_API_URI, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Login successful:", data);
        storeUserToken(data.token, data.user);
        showPopup('Login Successful !', 'success')
        // setUser(data.user);
        setUserEmail('');
        setPassword('');
        navigate('/')
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
    }
  }
  // *** Login Logic Ends Here

  // *** Registration Logic Here 
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    const details = ({ userName, userEmail, userContact, password })

    try {
      const res = await fetch(USER_REGISTER_API_URI, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.requiresVerification) {
          showPopup('Registration Successful! Please verify your email.', 'success');
          navigate(`/verify-email?email=${encodeURIComponent(userEmail)}`);
        } else {
          showPopup('Registration Successful!', 'success');
          setUserName('');
          setUserEmail('');
          setUserContact('');
          setPassword('');
          setIsSignup(false); // Switch back to login form
        }
      } else {
        showPopup(data.message || "Enter The Details")
        console.error("Registration failed:", data.message);
      }
    } catch (error) {
      console.error('Registration Error:', error);
    }
  }
  // *** Registration Logic Ends Here 

  return (
    <>
      <Helmet>
        <title>WorkPort | Login</title>
        <meta name="description" content="Know more about us." />
        <meta name="author" content="My Website Team" />
      </Helmet>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl flex flex-col md:flex-row">
          {/* Left Side - Login Form */}
          <div className={`w-full md:w-1/2 p-8 transition-all duration-500 ${isSignup ? 'md:translate-x-full hidden md:block' : ''}`}>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaEnvelope className="text-gray-500" />
                  </div>
                  <input
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaLock className="text-gray-500" />
                  </div>
                  <input
                    className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-500" />
                    ) : (
                      <FaEye className="text-gray-500" />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="text-blue-600 hover:underline">
                    Forgot password?
                  </a>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300"
              >
                Sign In
              </button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={() => setIsSignup(true)}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>

          {/* Right Side - Sign Up Form */}
          <div
            className={`w-full md:w-1/2 bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white transition-all duration-500 ${!isSignup ? 'md:translate-x-full hidden md:block' : ''
              }`}
          >
            <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
            <form onSubmit={handleSignUpSubmit}>
              <div className="mb-4">
                <label className="block text-white text-sm font-bold mb-2" htmlFor="name">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaUser className="text-blue-800" />
                  </div>
                  <input
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-blue-400 focus:outline-none focus:ring-2 focus:ring-white text-gray-800"
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-white text-sm font-bold mb-2" htmlFor="signup-email">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaEnvelope className="text-blue-800" />
                  </div>
                  <input
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-blue-400 focus:outline-none focus:ring-2 focus:ring-white text-gray-800"
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-white text-sm font-bold mb-2" htmlFor="phone">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaPhone className="text-blue-800" />
                  </div>
                  <input
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-blue-400 focus:outline-none focus:ring-2 focus:ring-white text-gray-800"
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={userContact}
                    onChange={(e) => setUserContact(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-white text-sm font-bold mb-2" htmlFor="signup-password">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaLock className="text-blue-800" />
                  </div>
                  <input
                    className="w-full pl-10 pr-10 py-2 rounded-lg border border-blue-400 focus:outline-none focus:ring-2 focus:ring-white text-gray-800"
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-600" />
                    ) : (
                      <FaEye className="text-gray-600" />
                    )}
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-white text-blue-600 py-2 px-4 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all duration-300"
              >
                Sign Up
              </button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-white">
                Already have an account?{" "}
                <button
                  onClick={() => setIsSignup(false)}
                  className="text-white hover:underline font-medium"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>

          {/* Mobile View Toggle */}
          <div className="md:hidden w-full p-4 text-center">
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-blue-600 hover:underline font-medium"
            >
              {isSignup ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
