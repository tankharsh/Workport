import React from 'react';
import Navbar from '../../components/user_components/Navbar';
import abp from '../../assets/about-bg.jpg';
import { motion } from 'framer-motion';
import Footer from '../../components/user_components/Footer';
import { NavLink } from 'react-router-dom';

const About = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            {/* Hero Section */}
            <div className="pt-24 pb-16 bg-gradient-to-b from-emerald-900 to-emerald-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl md:text-6xl font-bold text-center text-white mb-4">
                        About <span className="text-amber-400">WorkPorts</span>
                    </h1>
                    <p className="text-emerald-100 text-center text-lg max-w-3xl mx-auto">
                        Your trusted partner in connecting local services with customers, making everyday life simpler and more convenient.
                    </p>
                </div>
            </div>

            {/* Main Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Image Section */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-emerald-200 rounded-3xl transform rotate-3"></div>
                        <img 
                            src={abp} 
                            alt="About WorkPorts" 
                            className="relative rounded-2xl shadow-xl w-full h-[400px] object-cover transform hover:scale-[1.02] transition-transform duration-300"
                        />
                    </motion.div>

                    {/* Content Section */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-6"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-emerald-900">
                            We Are WorkPorts
                        </h2>
                        <div className="space-y-4 text-gray-600">
                            <p>
                                At WorkPorts, we're revolutionizing how people connect with local services. Our platform brings together quality service providers and customers, creating a seamless experience for everyone.
                            </p>
                            <p>
                                Whether you're looking for home services, professional assistance, or local expertise, WorkPorts is your trusted partner in finding the right solution.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-6 pt-4">
                            <div className="bg-emerald-50 p-4 rounded-xl">
                                <h3 className="text-2xl font-bold text-emerald-600 mb-2">500+</h3>
                                <p className="text-gray-600">Service Providers</p>
                            </div>
                            <div className="bg-emerald-50 p-4 rounded-xl">
                                <h3 className="text-2xl font-bold text-emerald-600 mb-2">10k+</h3>
                                <p className="text-gray-600">Happy Customers</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Animated Banner */}
            <div className="bg-emerald-900 py-8 overflow-hidden">
                <motion.div
                    className="flex space-x-8"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                >
                    {[...Array(10)].map((_, index) => (
                        <div key={index} className="text-amber-400 text-3xl md:text-4xl font-bold px-6">
                            WORKPORTS
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* CTA Section */}
            <div className="relative py-16 bg-gradient-to-b from-emerald-900 to-emerald-800">
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

export default About;
