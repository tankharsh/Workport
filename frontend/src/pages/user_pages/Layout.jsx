import React from 'react'
import Navbar from '../../components/user_components/Navbar'
import { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slid1 from '../../assets/Slid1.jpg';

const Layout = () => {

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  const images = [
    Slid1,
    "https://via.placeholder.com/800x400?text=Slide+2",
    "https://via.placeholder.com/800x400?text=Slide+3",
  ];

  return (
    <>
      <Navbar />

      {/* Slider Compornet start */}
      <div className="w-[calc(100%-40px)]  h-[80vh] m-5 ">
        <Slider {...settings}>
          {images.map((image, index) => (
            <div key={index} className="flex justify-center items-center h-full">
              <img src={image} alt={`Slide ${index + 1}`} className="w-full h-[80vh] object-cover" />
            </div>
          ))}
        </Slider>
      </div>
      {/* Slider Compornet end */}


      {/* Top Categories */}
      <div className='pt-9'>
        <div className="w-[calc(100%-40px)] m-5">
          {/* Top Categories Heading */}
          <h2 className="text-center text-2xl font-bold mb-4 flex flex-col items-center bg-white w-[18%] ml-[41%]  ">
            Top Categories
            <div className="w-16 h-1 bg-blue-500 mt-2 absolute mt-[18px] z-[-1] w-[96%]"></div>
          </h2>

          {/* Search Bar */}
          <div className="flex justify-end mb-6">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Search..."
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Search
              </button>
            </div>
          </div>

          {/* Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="h-48 bg-gray-300 rounded-lg shadow-md flex items-center justify-center"
              >
                Card {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Recently addded */}
      <div className='recentlt added pt-12'>

        <h2 className="text-center text-2xl font-bold mb-4 flex flex-col items-center bg-white w-[18%] ml-[41%]  ">
          Recently added
          <div className="w-16 h-1 bg-blue-500 mt-2 absolute mt-[18px] z-[-1] w-[96%]"></div>
        </h2>

        <div className="bg-gray-200 py-8 px-4 mt-10">
          {/* <h2 className="text-center text-xl font-bold mb-6">Recently Added</h2> */}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {/* Card 1 */}
            <div className="bg-gray-400 h-40 rounded shadow-md"></div>

            {/* Card 2 */}
            <div className="bg-gray-400 h-40 rounded shadow-md"></div>

            {/* Card 3 */}
            <div className="bg-gray-400 h-40 rounded shadow-md"></div>

            {/* Card 4 */}
            <div className="bg-gray-400 h-40 rounded shadow-md"></div>

            {/* Card 5 */}
            <div className="bg-gray-400 h-40 rounded shadow-md"></div>

            {/* Card 6 */}
            <div className="bg-gray-400 h-40 rounded shadow-md"></div>
          </div>
        </div>


      </div>


      {/* About Us */}
      <div className='about-us pt-12'>

        <h2 className="text-center text-2xl font-bold mb-4 flex flex-col items-center bg-white w-[18%] ml-[41%]  ">
          About Us
          <div className="w-16 h-1 bg-blue-500 mt-2 absolute mt-[18px] z-[-1] w-[96%]"></div>
        </h2>
        <div className="relative bg-gray-200 h-[100vh] flex justify-center items-center mt-10">
          {/* Background container */}
          <div className="absolute inset-0 bg-gray-300"></div>

          {/* Green boxes */}
          <div className="relative">
            {/* Top Right Box */}
            <div className="absolute top-[15vh] right-10 bg-lime-400 h-20 w-20 rounded shadow-lg h-[32vh] w-[13vw] right-[-26.5rem]"></div>

            {/* Center Box */}
            <div className="absolute bg-lime-400 h-28 w-28 rounded shadow-lg h-[32vh] w-[13vw] bottom-[-6.5rem]"></div>

            {/* Bottom Right Box */}
            <div className="absolute bottom-[4.5rem] right-10 bg-lime-400 h-24 w-24 rounded shadow-lg h-[32vh] w-[13vw] right-[-26.5rem]"></div>
          </div>
        </div>
      </div>


      {/* Footer */}
      <div className="bg-blue-400 min-h-screen flex flex-col mt-10">
        <div className="flex flex-wrap justify-between p-8">
          {/* Left Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white gap-[100px] p-[65px]">
            <div className="space-y-4">
              <p className="font-semibold">Home</p>
              <p className="font-semibold">Help</p>
              <p className="font-semibold">Store</p>
              <p className="font-semibold">About</p>
              <p className="font-semibold">Contact</p>
              <p className="font-semibold">Services</p>
              <p className="font-semibold">Blog</p>
              <p className="font-semibold">FAQ</p>
            </div>
            <div className="space-y-4">
              <p className="font-semibold">Home</p>
              <p className="font-semibold">Help</p>
              <p className="font-semibold">Store</p>
              <p className="font-semibold">About</p>
              <p className="font-semibold">Contact</p>
              <p className="font-semibold">Services</p>
              <p className="font-semibold">Blog</p>
              <p className="font-semibold">FAQ</p>
            </div>
            <div className="space-y-4">
              <p className="font-semibold">Home</p>
              <p className="font-semibold">Help</p>
              <p className="font-semibold">Store</p>
              <p className="font-semibold">About</p>
              <p className="font-semibold">Contact</p>
              <p className="font-semibold">Services</p>
              <p className="font-semibold">Blog</p>
              <p className="font-semibold">FAQ</p>
            </div>
          </div>

          {/* Right Section - Contact Form */}
          <div className="w-full md:w-1/2 bg-white p-8 rounded shadow-lg mt-8 md:mt-0 md:ml-8">
            <h2 className="text-black text-xl font-bold mb-6">Contact</h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                className="w-full p-3 border border-gray-300 rounded"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded"
              />
              <textarea
                placeholder="Your Message"
                className="w-full p-3 border border-gray-300 rounded h-32"
              ></textarea>
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <    footer className="bg-blue-500 text-white text-center py-4">
        &copy; 2025 Your Company. All rights reserved.
      </footer>
    </>
  )
}

export default Layout




