import React from 'react';
import Navbar from '../../components/user_components/Navbar';
import abp from '../../assets/about-bg.jpg';
import { motion } from 'framer-motion';
import Footer from '../../components/user_components/Footer';
import { NavLink } from 'react-router-dom';

const About = () => {
    return (
        <>
            <Navbar />
            <h1 className='capitalize text-4xl md:text-6xl mt-3 italic font-bold text-center'>about us</h1>
            <div className='flex flex-wrap items-center justify-center md:justify-evenly w-full pt-9 px-4'>
                <div className='w-full bg-cover md:w-1/2 flex items-center justify-center pt-3'>
                    <img src={abp} className='h-60 md:h-96 rounded-md w-full max-w-2xl' alt="About us image" />
                </div>
                <div className='w-full md:w-1/2 flex items-center justify-center flex-col p-5 text-center md:text-left'>
                    <h2 className='capitalize text-2xl md:text-4xl font-bold'>we know as workports</h2>
                    <p className='pt-4 text-sm md:text-base'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore accusantium, dolores quos ut quasi quaerat deleniti reprehenderit, quod animi eum error. Officia sed iusto molestiae ducimus commodi impedit similique beatae porro in provident...</p>
                </div>
            </div>

            <div className="overflow-hidden mt-3 w-full bg-[#2D4E35] flex items-center h-12 md:h-16">
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

export default About;
