import { useState } from 'react';
import axios from 'axios';
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null
    const [statusMessage, setStatusMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear status when user starts typing again
        if (submitStatus) {
            setSubmitStatus(null);
            setStatusMessage("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);
        setStatusMessage("");

        try {
            // Add loading delay for better UX
            await new Promise(resolve => setTimeout(resolve, 1000));

            const response = await axios.post('http://localhost:4000/api/contact', formData);

            console.log("Form submitted successfully", response.data);
            setSubmitStatus('success');
            setStatusMessage(response.data.message || "Your message has been sent successfully!");

            // Clear form data
            setFormData({
                name: "",
                email: "",
                message: "",
            });
        } catch (error) {
            console.error("Error submitting form:", error);
            setSubmitStatus('error');

            if (error.response && error.response.data && error.response.data.errors) {
                // Format validation errors
                const errorMessages = error.response.data.errors.map(err => err.msg).join(', ');
                setStatusMessage(errorMessages);
            } else if (error.response && error.response.data && error.response.data.message) {
                setStatusMessage(error.response.data.message);
            } else {
                setStatusMessage("An error occurred while sending your message. Please try again later.");
            }
        } finally {
            setIsSubmitting(false);
        }
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

                            {/* Status message */}
                            {submitStatus && (
                                <div className={`p-3 rounded-lg mb-4 ${submitStatus === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {statusMessage}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full bg-emerald-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-emerald-700 transform hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending...
                                    </div>
                                ) : 'Send Message'}
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
