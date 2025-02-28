import React, { useState } from 'react';
import Navbar from '../../components/user_components/Navbar';
import Footer from '../../components/user_components/Footer';
import { FaEnvelope, FaFacebook, FaInstagram, FaTwitter, FaUser } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted", formData);
        // Add form submission logic here
    };

    return (
        <>
            <Navbar />
            <div className='p-4'>
                <h1 className='capitalize text-4xl md:text-6xl font-bold italic text-center mb-8'>Contact Us</h1>

                <div className='flex flex-col md:flex-row items-center justify-between gap-8'>
                    {/* Left side */}
                    <div className='w-full md:w-1/2 bg-white border border-black p-6 md:p-10 rounded-xl shadow-lg'>
                        <form onSubmit={handleSubmit} className='space-y-6'>
                            <h2 className='capitalize text-gray-500 text-xl md:text-2xl font-bold'>Contact Us</h2>
                            <h2 className='capitalize text-gray-900 text-3xl md:text-4xl font-bold'>Get in touch</h2>

                            {/* Name */}
                            <div className='flex items-center border border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200'>
                                <FaUser className='mr-2 text-gray-700' />
                                <input
                                    type='text'
                                    name='name'
                                    placeholder='Enter your name'
                                    value={formData.name}
                                    onChange={handleChange}
                                    className='w-full outline-none text-black placeholder:text-gray-700'
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div className='flex items-center border border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200'>
                                <FaEnvelope className='mr-2 text-gray-500' />
                                <input
                                    type='email'
                                    name='email'
                                    placeholder='Enter your email'
                                    value={formData.email}
                                    onChange={handleChange}
                                    className='w-full outline-none text-black placeholder:text-gray-700'
                                    required
                                />
                            </div>

                            {/* Message */}
                            <div className='flex border items-center border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200'>
                                <textarea
                                    name='message'
                                    placeholder='Enter your message...'
                                    value={formData.message}
                                    onChange={handleChange}
                                    className='w-full outline-none text-black placeholder:text-gray-700'
                                    rows={4}
                                    required
                                />
                            </div>

                            <button
                                type='submit'
                                className='w-full bg-[#FFA901] text-white p-3 rounded-lg hover:bg-[#df9706] transition-all duration-300'
                            >
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Right side */}
                    <div className='w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left space-y-6'>
                        <h2 className='capitalize text-3xl md:text-4xl font-bold'>We know as Workports</h2>
                        <p className='text-sm md:text-base leading-relaxed'>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore accusantium, dolores quos ut quasi quaerat deleniti reprehenderit, quod animi eum error. Officia sed iusto molestiae ducimus commodi impedit similique beatae.
                        </p>
                        <div className='flex space-x-4'>
                            <FaFacebook className='text-blue-600 text-4xl hover:scale-110 transition-transform' />
                            <FaInstagram className='text-pink-500 text-4xl hover:scale-110 transition-transform' />
                            <FaTwitter className='text-blue-400 text-4xl hover:scale-110 transition-transform' />
                        </div>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden w-full bg-[#2D4E35] flex items-center h-12 md:h-16">
                <motion.div
                    className="flex space-x-4 md:space-x-8"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                >
                    {[...Array(10)].map((_, index) => (
                        <div key={index} className="text-[#FFA901] text-xl md:text-4xl font-semibold px-3 md:px-6 py-2 rounded-lg">
                            WORKPORTS
                        </div>
                    ))}
                </motion.div>
            </div>

            <div className='w-full p-4 md:p-10'>
                <div className="relative w-full h-64 md:h-96 bg-[url('https://cdn.pixabay.com/photo/2014/12/08/21/25/innovation-561388_1280.jpg')] bg-cover bg-center">
                    {/* Black overlay */}
                    <div className="absolute inset-0 bg-black opacity-50"></div>

                    {/* Text on top */}
                    <div className="absolute inset-0 flex items-center justify-center flex-col text-center">
                        <h1 className="text-white text-2xl md:text-4xl font-bold">Start Now</h1>
                        <NavLink to='/user-login' className='bg-[#FFA901] text-white font-bold px-6 md:px-8 text-lg md:text-xl  py-2 rounded-lg mt-3'>Login</NavLink>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Contact;
