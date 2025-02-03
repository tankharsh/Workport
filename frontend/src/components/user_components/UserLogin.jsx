import { useContext, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Slice from '../../assets/Slice.png'
import { FaUser, FaEnvelope, FaLock, FaPhone } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import {useAuth} from "../../context/AuthContext";
import Footer from "./Footer";
import { Helmet } from "react-helmet-async";



export default function UserLogin() {
  const [isSignup, setIsSignup] = useState(false);

  const [useremail, setUseremail] = useState('');
  const [password, setPassword] = useState('');
  const [usercontactno, setUsercontactno] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate()

  const { login } = useAuth();
  const { register } = useAuth();

  

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ useremail, password });
    navigate('/User-Dashboard')
  }

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    register({ username, useremail, usercontactno, password })
    navigate('/user-login');
  }

  return (
    <>
    <Helmet>
        <title>WorkPort | Login</title>
        <meta name="description" content="Know more about us." />
        <meta name="author" content="My Website Team" />
      </Helmet>
      <Navbar />
      <div className="flex justify-center items-center h-screen bg-gray-300">
        <div className="relative w-[700px] h-[400px] bg-white shadow-xl rounded-lg overflow-hidden flex">
          {/* Login Form */}
          <div
            className={`w-1/2 p-8 absolute left-0 top-0 h-full transition-all duration-500 ${isSignup ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="flex items-center mt-2">
                <FaEnvelope className="text-gray-500 mr-3" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={useremail}
                  onChange={(e) => setUseremail(e.target.value)}
                  placeholder="Enter your email"
                  className="p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 active:scale-95 transition-all duration-200"
                />
              </div>
              <div className="flex items-center mt-2">
                <FaLock className="text-gray-500 mr-3" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 active:scale-95 transition-all duration-200"
                />
              </div>
              <button type="submit" className="w-full mt-5 bg-purple-600 text-white p-2 rounded">Login</button>
            </form>
          </div>

          {/* Signup Form */}
          <div
            className={`w-1/2 p-8 absolute right-0 top-0 h-full transition-all duration-500 ${isSignup ? "opacity-0 pointer-events-none" : "opacity-100"}`}
          >
            <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
            <form onSubmit={handleSignUpSubmit}>
              <div className="flex items-center mt-2">
                <FaUser className="text-gray-500 mr-3" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your name"
                  className="p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 active:scale-95 transition-all duration-200"
                />
              </div>
              <div className="flex items-center mt-2">
                <FaEnvelope className="text-gray-500 mr-3" />
                <input
                  type="email"
                  id="useremail"
                  name="email"
                  value={useremail}
                  onChange={(e) => setUseremail(e.target.value)}
                  placeholder="Enter your email"
                  className="p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 active:scale-95 transition-all duration-200"
                />
              </div>
              <div className="flex items-center mt-2">
                <FaPhone className="text-gray-500 mr-3" />
                <input
                  type="tel"
                  id="contact"
                  name="contact"
                  value={usercontactno}
                  onChange={(e) => setUsercontactno(e.target.value)}
                  placeholder="Enter your contact number"
                  className="p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 active:scale-95 transition-all duration-200"
                />
              </div>
              <div className="flex items-center mt-2">
                <FaLock className="text-gray-500 mr-3" />
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="p-2 w-full border border-gray-300 rounded-md focus:outline-none active:scale-95 transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button type="submit" className="w-full mt-5 bg-purple-600 text-white p-2 rounded">Sign Up</button>
            </form>
          </div>

          {/* Animated Image */}
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: isSignup ? "100%" : "0%" }}
            transition={{ duration: 0.5, ease: 'anticipate' }}
            style={{ backgroundImage: `url(${Slice})` }}
            className="absolute bg-cover top-0 left-0 w-1/2 h-full  flex justify-center items-center text-xl font-bold cursor-pointer z-10"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? (
              <div className="flex flex-col justify-center items-center">
                <h1 className="text-white text-3xl mb-3">Welcome Back</h1>
                <p className="w-[260px] text-white text-center text-lg mt-2">please sign into your accountwith the given details to continue</p>
                <p className="text-white mt-5">If you haven't an account! sign up</p>
                <button className="px-6 py-2 mt-3 text-black bg-transparent border-2 border-black rounded-lg hover:scale-95 transition-all duration-200">Sign up</button>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center">
                <h1 className="text-white text-3xl mb-3">Hello Friends</h1>
                <p className="w-[260px] text-white text-center text-lg mt-2">Please provide the information to register your account!</p>
                <p className="text-white mt-5">Already have an account ! Sign In</p>
                <button className="px-6 py-2 mt-3 text-black bg-transparent border-2 border-black rounded-lg hover:scale-95 transition-all duration-200">Sign In</button>
              </div>
            )}
          </motion.div>
        </div>

      </div>
      <Footer />
    </>
  );
}
