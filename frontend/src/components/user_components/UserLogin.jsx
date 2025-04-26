import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaEyeSlash, FaEye } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Footer from "./Footer";
import { Helmet } from "react-helmet-async";

export default function UserLogin() {
  const USER_REGISTER_API_URI = "http://localhost:4000/api/users/register";

  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userContact, setUserContact] = useState('');
  const [userName, setUserName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { showPopup } = useAuth();

  const [fieldErrors, setFieldErrors] = useState({
    userName: '',
    userEmail: '',
    userContact: '',
    password: ''
  });

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Reset field errors
    setFieldErrors({
      userName: '',
      userEmail: '',
      userContact: '',
      password: ''
    });

    const details = ({ userName, userEmail, userContact, password });

    try {
      const res = await fetch(USER_REGISTER_API_URI, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details),
      });

      const data = await res.json();
      console.log('Registration response:', data);

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
          navigate('/');
        }
      } else {
        // Handle specific field errors
        if (data.field) {
          setFieldErrors(prev => ({
            ...prev,
            [data.field]: data.message
          }));
          showPopup(`${data.message}. Please use a different ${data.field === 'userEmail' ? 'email address' : 'contact number'}.`, 'error');
        } else if (data.errors && Array.isArray(data.errors)) {
          // Handle validation errors from express-validator
          const newFieldErrors = {};
          data.errors.forEach(err => {
            newFieldErrors[err.param] = err.msg;
          });
          setFieldErrors(prev => ({ ...prev, ...newFieldErrors }));
          showPopup('Please fix the errors in the form.', 'error');
        } else {
          showPopup(data.message || "Please enter all required details", 'error');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      showPopup('Registration failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>WorkPort | Sign Up</title>
        <meta name="description" content="Create a new account on WorkPort" />
      </Helmet>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
        <div className="container mx-auto px-4 py-16 pt-40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto"
          >
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600"></div>

              <div className="w-full bg-gradient-to-br from-emerald-600 to-emerald-700 p-8 lg:p-12 text-white">
                <div className="max-w-md mx-auto">
                  <h2 className="text-3xl font-bold mb-2">Create Account</h2>
                  <p className="text-emerald-100 mb-8">Join our community today</p>

                  <form onSubmit={handleSignUpSubmit} className="space-y-6">
                    {/* Name Input */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-emerald-300">
                        <FaUser />
                      </div>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Full name"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border ${fieldErrors.userName ? 'border-red-400' : 'border-white/20'} text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all`}
                        required
                      />
                      {fieldErrors.userName && (
                        <p className="mt-1 text-sm text-red-400">{fieldErrors.userName}</p>
                      )}
                    </div>

                    {/* Email Input */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-emerald-300">
                        <FaEnvelope />
                      </div>
                      <input
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="Email address"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border ${fieldErrors.userEmail ? 'border-red-400' : 'border-white/20'} text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all`}
                        required
                      />
                      {fieldErrors.userEmail && (
                        <p className="mt-1 text-sm text-red-400">{fieldErrors.userEmail}</p>
                      )}
                    </div>

                    {/* Contact Input */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-emerald-300">
                        <FaPhone />
                      </div>
                      <input
                        type="tel"
                        value={userContact}
                        onChange={(e) => setUserContact(e.target.value)}
                        placeholder="Contact number"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border ${fieldErrors.userContact ? 'border-red-400' : 'border-white/20'} text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all`}
                        required
                      />
                      {fieldErrors.userContact && (
                        <p className="mt-1 text-sm text-red-400">{fieldErrors.userContact}</p>
                      )}
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-emerald-300">
                        <FaLock />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className={`w-full pl-10 pr-12 py-3 rounded-xl bg-white/10 border ${fieldErrors.password ? 'border-red-400' : 'border-white/20'} text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all`}
                        required
                      />
                      {fieldErrors.password && (
                        <p className="mt-1 text-sm text-red-400">{fieldErrors.password}</p>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-emerald-300 hover:text-white transition-colors"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-white text-emerald-600 py-3 rounded-xl hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-600 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                          Creating Account...
                        </div>
                      ) : (
                        'Create Account'
                      )}
                    </button>

                    <div className="text-center mt-6">
                      <p className="text-white/80">
                        Already have an account?{' '}
                        <button
                          type="button"
                          onClick={() => navigate('/login')}
                          className="text-white hover:text-emerald-200 font-medium transition-colors hover:underline"
                        >
                          Sign In
                        </button>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
