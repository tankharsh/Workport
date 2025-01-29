import React, { useContext, useEffect, useRef, useState } from 'react'
import Navbar from './Navbar'
import gsap from 'gsap'
import AuthContext from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';


function UserRegistrationFrom() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [useremail, setUseremail] = useState('');
  const [usercontactno, setUsercontactno] = useState('');
  const [password, setPassword] = useState('')
  const { register } = useContext(AuthContext);


  const handleSubmit = async (e) => {
    e.preventDefault();
    register({ username, useremail, usercontactno, password })
    navigate('/user-login');
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
      <Navbar />
      <div className="flex items-center justify-center min-h-screen  bg-gradient-to-r from-blue-500 to-purple-600">
        <div
          ref={RegRef}
          id='registration' className="bg-white  shadow-lg w-full max-w-md p-6">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
            Registration
          </h2>
          <form
            onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-600"
              >
                Name
              </label>
              <input
                name='username'
                type="text"
                id="name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your full name"
                className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600"
              >
                Email
              </label>
              <input
                name='useremail'
                type="email"
                id="email"
                value={useremail}
                onChange={(e) => setUseremail(e.target.value)}
                placeholder="Enter your email"
                className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Contact No Field */}
            <div className="mb-4">
              <label
                htmlFor="contact"
                className="block text-sm font-medium text-gray-600"
              >
                Contact No
              </label>
              <input
                name='usercontactno'
                type="text"
                id="contact"
                value={usercontactno}
                onChange={(e) => setUsercontactno(e.target.value)}
                placeholder="Enter your contact number"
                className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600"
              >
                Password
              </label>
              <input
                name='password'
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default UserRegistrationFrom