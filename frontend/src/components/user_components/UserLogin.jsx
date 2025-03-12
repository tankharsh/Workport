import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaEyeSlash, FaEye } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Footer from "./Footer";
import { Helmet } from "react-helmet-async";

export default function UserLogin() {
  const USER_LOGIN_API_URI = "http://localhost:4000/api/users/login";
  const USER_REGISTER_API_URI = "http://localhost:4000/api/users/register";

  const [isSignup, setIsSignup] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userContact, setUserContact] = useState('');
  const [userName, setUserName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { storeUserToken, showPopup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const credentials = ({ userEmail, password });
    try {
      const res = await fetch(USER_LOGIN_API_URI, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (res.ok) {
        storeUserToken(data.token, data.user);
        showPopup('Login Successful!', 'success');
        setUserEmail('');
        setPassword('');
        navigate('/');
      } else if (res.status === 403 && data.requiresVerification) {
        showPopup('Please verify your email to continue', 'info');
        navigate(`/verify-email?email=${encodeURIComponent(data.userEmail)}`);
      } else {
        showPopup('Login Failed: ' + (data.message || "Unknown error"), 'error');
      }
    } catch (error) {
      showPopup('An unexpected error occurred', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const details = ({ userName, userEmail, userContact, password });

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
          setIsSignup(false);
        }
      } else {
        showPopup(data.message || "Please enter all required details", 'error');
      }
    } catch (error) {
      showPopup('Registration failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>WorkPort | {isSignup ? 'Sign Up' : 'Login'}</title>
        <meta name="description" content={isSignup ? "Create a new account on WorkPort" : "Login to your WorkPort account"} />
      </Helmet>
      <Navbar />
      <div className="flex mt-40 items-center justify-center min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-400 via-emerald-500 to-emerald-800 py-12 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden w-full max-w-4xl mx-4 relative"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-10"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-200 rounded-full translate-y-1/2 -translate-x-1/2 opacity-10"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-50 rounded-full opacity-5 blur-3xl pointer-events-none"></div>
          
          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-10" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2310b981' fill-opacity='0.2' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")` 
          }}></div>

          <div className="flex flex-col md:flex-row">
            {/* Login Form */}
            <div className={`w-full md:w-1/2 p-8 transition-all duration-500 relative backdrop-blur-md ${isSignup ? 'md:translate-x-full hidden md:block' : ''}`}>
              <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-20"></div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8 relative inline-block">
                Welcome Back
                <span className="block text-sm font-normal text-emerald-600 mt-2">Sign in to continue</span>
                <div className="absolute -bottom-2 left-0 w-12 h-1 bg-emerald-500 rounded-full"></div>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-emerald-500 group-hover:text-emerald-600 transition-colors">
                      <FaEnvelope className="transition-transform group-hover:scale-110" />
                    </div>
                    <input
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all hover:border-emerald-200"
                      type="email"
                      placeholder="Email address"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-emerald-500 group-hover:text-emerald-600 transition-colors">
                      <FaLock className="transition-transform group-hover:scale-110" />
                    </div>
                    <input
                      className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all hover:border-emerald-200"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-emerald-600 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2 text-gray-600 cursor-pointer group">
                    <input type="checkbox" className="form-checkbox h-4 w-4 text-emerald-500 rounded focus:ring-emerald-500 transition-colors group-hover:text-emerald-600" />
                    <span className="group-hover:text-gray-900 transition-colors">Remember me</span>
                  </label>
                  <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors hover:underline">Forgot password?</a>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-xl hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-300 relative overflow-hidden group transform hover:scale-[1.02]"
                >
                  <span className="absolute w-64 h-64 mt-12 group-hover:-rotate-45 transition-all duration-500 ease-out -translate-x-20 -translate-y-32 bg-white opacity-10 rounded-full"></span>
                  <span className="relative inline-flex items-center justify-center">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </span>
                </button>
              </form>

              <p className="mt-8 text-center text-gray-600">
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => setIsSignup(true)}
                  className="text-emerald-600 hover:text-emerald-700 font-medium focus:outline-none hover:underline transition-colors"
                >
                  Create Account
                </button>
              </p>
            </div>

            {/* Sign Up Form */}
            <div className={`w-full md:w-1/2 bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-700 p-8 text-white transition-all duration-500 relative ${!isSignup ? 'md:translate-x-full hidden md:block' : ''}`}>
              <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
              <div className="absolute inset-0 opacity-20" style={{ 
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.2' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")` 
              }}></div>
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-8 relative inline-block">
                  Create Account
                  <span className="block text-sm font-normal text-emerald-100 mt-2">Join our community today</span>
                  <div className="absolute -bottom-2 left-0 w-12 h-1 bg-white rounded-full"></div>
                </h2>

                <form onSubmit={handleSignUpSubmit} className="space-y-6">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-emerald-300 group-hover:text-white transition-colors">
                      <FaUser className="transition-transform group-hover:scale-110" />
                    </div>
                    <input
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-emerald-300/30 text-white placeholder-emerald-100 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all group-hover:bg-white/20"
                      type="text"
                      placeholder="Full Name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-emerald-300 group-hover:text-white transition-colors">
                      <FaEnvelope className="transition-transform group-hover:scale-110" />
                    </div>
                    <input
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-emerald-300/30 text-white placeholder-emerald-100 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all group-hover:bg-white/20"
                      type="email"
                      placeholder="Email address"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-emerald-300 group-hover:text-white transition-colors">
                      <FaPhone className="transition-transform group-hover:scale-110" />
                    </div>
                    <input
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-emerald-300/30 text-white placeholder-emerald-100 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all group-hover:bg-white/20"
                      type="tel"
                      placeholder="Phone Number"
                      value={userContact}
                      onChange={(e) => setUserContact(e.target.value)}
                      required
                    />
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-emerald-300 group-hover:text-white transition-colors">
                      <FaLock className="transition-transform group-hover:scale-110" />
                    </div>
                    <input
                      className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/10 border border-emerald-300/30 text-white placeholder-emerald-100 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all group-hover:bg-white/20"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-emerald-100 hover:text-white transition-colors"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-white text-emerald-600 py-3 rounded-xl hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-600 transition-all duration-300 relative overflow-hidden group transform hover:scale-[1.02]"
                  >
                    <span className="absolute w-64 h-64 mt-12 group-hover:-rotate-45 transition-all duration-500 ease-out -translate-x-20 -translate-y-32 bg-emerald-600 opacity-10 rounded-full"></span>
                    <span className="relative inline-flex items-center justify-center">
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating Account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </span>
                  </button>
                </form>

                <p className="mt-8 text-center text-emerald-100">
                  Already have an account?{" "}
                  <button
                    onClick={() => setIsSignup(false)}
                    className="text-white hover:text-emerald-200 font-medium focus:outline-none hover:underline transition-colors"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </div>

            {/* Mobile View Toggle */}
            <div className="md:hidden w-full p-4 text-center bg-gray-50">
              <button
                onClick={() => setIsSignup(!isSignup)}
                className="text-emerald-600 hover:text-emerald-700 font-medium focus:outline-none hover:underline transition-colors"
              >
                {isSignup ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
