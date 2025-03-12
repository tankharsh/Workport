import { useState } from 'react';
import Navbar from '../../components/user_components/Navbar';
import Footer from '../../components/user_components/Footer';
import { FaEnvelope, FaFacebook, FaInstagram, FaTwitter, FaUser, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
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
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            {/* Hero Section */}
            <div className="pt-24 pb-16 bg-gradient-to-b from-emerald-900 to-emerald-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl md:text-6xl font-bold text-center text-white mb-4">
                        Contact <span className="text-amber-400">Us</span>
                    </h1>
                    <p className="text-emerald-100 text-center text-lg max-w-3xl mx-auto">
                        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white rounded-2xl shadow-xl p-8"
                    >
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-emerald-900 mb-2">Send us a Message</h2>
                            <p className="text-gray-600">Fill out the form below and we'll get back to you shortly.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name Input */}
                            <div className="group">
                                <div className="flex items-center border-2 border-gray-200 rounded-lg p-3 transition-all duration-300 focus-within:border-emerald-500">
                                    <FaUser className="text-gray-400 group-focus-within:text-emerald-500" />
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Your Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="flex-1 ml-3 outline-none text-gray-700 placeholder-gray-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email Input */}
                            <div className="group">
                                <div className="flex items-center border-2 border-gray-200 rounded-lg p-3 transition-all duration-300 focus-within:border-emerald-500">
                                    <FaEnvelope className="text-gray-400 group-focus-within:text-emerald-500" />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Your Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="flex-1 ml-3 outline-none text-gray-700 placeholder-gray-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Message Input */}
                            <div className="group">
                                <div className="border-2 border-gray-200 rounded-lg p-3 transition-all duration-300 focus-within:border-emerald-500">
                                    <textarea
                                        name="message"
                                        placeholder="Your Message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="5"
                                        className="w-full outline-none text-gray-700 placeholder-gray-500 resize-none"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-emerald-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-emerald-700 transform hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                            >
                                Send Message
                            </button>
                        </form>
                    </motion.div>

                    {/* Contact Information */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-8"
                    >
                        <div>
                            <h2 className="text-2xl font-bold text-emerald-900 mb-4">Get in Touch</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Whether you're looking to list your business, need help with our services, or just want to say hello, we're here to help.
                            </p>
                        </div>

                        {/* Contact Details */}
                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="bg-emerald-100 p-3 rounded-lg">
                                    <FaPhoneAlt className="text-emerald-600 text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Phone</h3>
                                    <p className="text-gray-600">+91 8849783086</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="bg-emerald-100 p-3 rounded-lg">
                                    <FaEnvelope className="text-emerald-600 text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Email</h3>
                                    <p className="text-gray-600">info@workport.com</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="bg-emerald-100 p-3 rounded-lg">
                                    <FaMapMarkerAlt className="text-emerald-600 text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Location</h3>
                                    <p className="text-gray-600">123 Business Avenue, Tech Park,<br />Innovation City - 380015</p>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-4">Follow Us</h3>
                            <div className="flex space-x-4">
                                <a href="#" className="bg-emerald-100 p-3 rounded-lg hover:bg-emerald-200 transition-colors duration-300">
                                    <FaFacebook className="text-emerald-600 text-xl" />
                                </a>
                                <a href="#" className="bg-emerald-100 p-3 rounded-lg hover:bg-emerald-200 transition-colors duration-300">
                                    <FaInstagram className="text-emerald-600 text-xl" />
                                </a>
                                <a href="#" className="bg-emerald-100 p-3 rounded-lg hover:bg-emerald-200 transition-colors duration-300">
                                    <FaTwitter className="text-emerald-600 text-xl" />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-b from-emerald-900 to-emerald-800 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                        Ready to Get Started?
                    </h2>
                    <NavLink 
                        to='/user-login' 
                        className="inline-block bg-amber-500 text-white font-semibold px-8 py-3 rounded-full hover:bg-amber-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        Join WorkPorts Today
                    </NavLink>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Contact;
