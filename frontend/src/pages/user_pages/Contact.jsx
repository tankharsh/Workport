import React, { useState } from 'react'
import Navbar from '../../components/user_components/Navbar'
import Footer from '../../components/user_components/Footer'
import { FaEnvelope, FaFacebook, FaInstagram, FaTwitter, FaUser } from 'react-icons/fa6';
import { FaMapMarkerAlt } from 'react-icons/fa';

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
            <h1 className='capitalize text-6xl font-bold italic text-center'>Contact Us</h1>
            <div className='w-full flex justify-between p-6 '>
                {/* left side  */}
                <div className='w-1/2 p-6'>
                    <form onSubmit={handleSubmit} className="space-y-4 p-10 rounded-xl bg-white">
                        <h1 className='capitalize text-gray-500 text-2xl font-bold'>Contact Us</h1>
                        <h1 className='capitalize text-gray-900 text-4xl font-bold'>Get in touch</h1>
                        {/* name  */}
                        <div className="flex items-center border border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
                            <FaUser className="mr-2 text-gray-700" />
                            <input
                                type="text"
                                name="sp_name"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full outline-none text-black placeholder:text-gray-700 "
                                required
                            />
                        </div>

                        {/* email  */}
                        <div className="flex items-center border border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
                            <FaEnvelope className="mr-2 text-gray-500" />
                            <input
                                type="email"
                                name="sp_email"
                                placeholder="Enter your email"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full outline-none text-black placeholder:text-gray-700"
                                required
                            />
                        </div>

                        {/* message  */}
                        <div className="flex border items-center border-gray-700 p-2 rounded-md hover:scale-95 transition-all duration-200">
                            {/* <BiSolidCategoryAlt className="mr-2 text-gray-500" /> */}
                            <textarea
                                name="sp_desc"
                                placeholder="Enter Shop Description ..."
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full outline-none text-black placeholder-gray-700 placeholder:flex placeholder:items-center"
                                rows={3}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition"
                        >
                            Send Message
                        </button>
                    </form>
                </div>

            </div>
            <Footer />
        </>
    )
}

export default Contact