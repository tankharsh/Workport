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



    </div>


    </>
  )
}

export default Layout




// position: absolute;
// /* padding-top: 2px; */
// margin-top: 18px;
// z-index: -1;
// width: 96%;

// top

// background-color: white;
// width: 18%;
// margin-left: 41%;