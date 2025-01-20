import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'

function UserLogin() {
    return (
        <>
            <Navbar />
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
                    <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
                        Login
                    </h2>
                    <form>
                        <div className="mb-4">
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-gray-600"
                            >
                                User Name
                            </label>
                            <input
                                type="text"
                                id="username"
                                placeholder="Enter your username"
                                className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-600"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Enter your password"
                                className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div className="flex items-center justify-between mb-6">
                            <label className="flex items-center text-sm text-gray-600">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-4 w-4 text-blue-500 rounded focus:ring-blue-400"
                                />
                                <span className="ml-2">Remember Me</span>
                            </label>
                            <a
                                href="#"
                                className="text-sm text-blue-500 hover:underline focus:outline-none"
                            >
                                Forget Me?
                            </a>
                        </div>
                        <div className="mt-4 text-center">
                            <span className="text-sm text-gray-600 ">Not registered? </span>
                            <a
                                href="#"
                                className="text-sm text-blue-500 hover:underline focus:outline-none"
                            >
                              <Link to='/user-registrationFrom'>  Register here </Link>
                            </a>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-500 mt-6 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                          Login 
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default UserLogin