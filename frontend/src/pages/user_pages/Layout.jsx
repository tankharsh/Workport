import React from 'react'
import Navbar from '../../components/user_components/Navbar'
import { useEffect, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Card from '../../components/user_components/Card';

gsap.registerPlugin(ScrollTrigger);

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
    "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8d29ya2VyJTIwcXVvdGVzfGVufDB8MHw0fHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1614792403436-ba5b3e747604?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE1fHx8ZW58MHx8fHx8",
    "https://i.pinimg.com/736x/62/74/60/62746057827ef1ed9b1985476b59e3e5.jpg",
  ];


 

  const catImage = [{
    catImage: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8d29ya2VyJTIwcXVvdGVzfGVufDB8MHw0fHx8MA%3D%3D",
    catName: "Hair Shop"
  }, {
    catImage: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8d29ya2VyJTIwcXVvdGVzfGVufDB8MHw0fHx8MA%3D%3D",
    catName: "Beauty Spa"
  }, {
    catImage: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8d29ya2VyJTIwcXVvdGVzfGVufDB8MHw0fHx8MA%3D%3D",
    catName: "Hair Shop"
  }, {
    catImage: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8d29ya2VyJTIwcXVvdGVzfGVufDB8MHw0fHx8MA%3D%3D",
    catName: "Beauty Spa"
  }, {
    catImage: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8d29ya2VyJTIwcXVvdGVzfGVufDB8MHw0fHx8MA%3D%3D",
    catName: "Hair Shop"
  }, {
    catImage: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8d29ya2VyJTIwcXVvdGVzfGVufDB8MHw0fHx8MA%3D%3D",
    catName: "Beauty Spa"
  }, {
    catImage: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8d29ya2VyJTIwcXVvdGVzfGVufDB8MHw0fHx8MA%3D%3D",
    catName: "Hair Shop"
  }, {
    catImage: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8d29ya2VyJTIwcXVvdGVzfGVufDB8MHw0fHx8MA%3D%3D",
    catName: "Beauty Spa"
  }]

  const sectionRef = useRef(null);
  const leftContentRef = useRef(null);
  const rightImageRef = useRef(null);
  useEffect(() => {
    const section = sectionRef.current;

    gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top center",
        end: "bottom center",
        scrub: 1, // Smooth scrubbing
      },
    })
      .fromTo(
        leftContentRef.current,
        {
          x: -100,
          opacity: 0
        },
        {
          x: 0,
          opacity: 1
        }
      )
      .fromTo(
        rightImageRef.current,
        {
          x: 100,
          opacity: 0
        },
        {
          x: 0,
          opacity: 1
        },
        "-=0.5"
      );
  }, []);


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
        <div className=" h-1 bg-blue-500 absolute mt-[18px] z-[-1] w-[96%]"></div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 ">
            {catImage.map((catImage, index) => (
              <div
                key={index}
                className="relative h-56 flex-wrap w-[100%] flex items-center justify-center hover:scale-105 duration-300 cursor-pointer"
              >
                <img src={catImage.catImage} alt={`Slide ${index + 1}`} className='bg-cover p-2 h-48 w-[100%] rounded-xl' />
                <span className='text-black font-semibold text-xl font-[lato]'>{catImage.catName}</span>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Recently addded */}
      <div className='recentlt added pt-12'>

        <h2 className="text-center text-2xl font-bold mb-4 flex flex-col items-center bg-white w-[18%] ml-[41%]  ">
          Recently added
          <div className="h-1 bg-blue-500 absolute mt-5 z-[-1] w-[96%]"></div>
        </h2>

        <div className="bg-[#6499C2] py-8 px-4 mt-10">
          {/* <h2 className="text-center text-xl font-bold mb-6">Recently Added</h2> */}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-7xl mx-auto">
            {/* Card 1 */}
            <div className="bg-gray-100 h-40 rounded shadow-md"></div>

            {/* Card 2 */}
            <div className="bg-gray-100 h-40 rounded shadow-md"></div>

            {/* Card 3 */}
            <div className="bg-gray-100 h-40 rounded shadow-md"></div>

            {/* Card 4 */}
            <div className="bg-gray-100 h-40 rounded shadow-md"></div>

            {/* Card 5 */}
            <div className="bg-gray-100 h-40 rounded shadow-md"></div>

            {/* Card 6 */}
            <div className="bg-gray-100 h-40 rounded shadow-md"></div>

          </div>
        </div>
      </div>

      {/* About Us */}
      <div
        id='about'
        ref={sectionRef}
        className="relative w-full h-[80%] mt-5 bg-fixed bg-cover bg-center flex items-center font-[Open-Sans]"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between relative z-10">
          {/* Left Side: About Content */}
          <div
            ref={leftContentRef}
            className="text-white md:w-1/2 space-y-6 text-center md:text-left"
          >
            <h2 className="text-4xl md:text-5xl pt-3 font-bold">About Us</h2>
            <p className="text-lg md:text-xl leading-relaxed">
              Welcome to our platform! We are dedicated to connecting people
              through innovative solutions. Our mission is to bring dreams to
              life, providing unmatched service and support.
            </p>
            <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-lg transition-transform transform hover:scale-105">
              Learn More
            </button>
          </div>

          {/* Right Side: Image */}
          <div
            ref={rightImageRef}
            className="mt-8 md:mt-0 md:w-1/2 flex justify-center"
          >
            <img
              src="https://cdn.pixabay.com/photo/2024/05/20/17/25/construction-8775840_640.png"
              alt="About Us"
              className="rounded-lg shadow-lg w-80 md:w-96"
            />

          </div>
        </div>
      </div>

      {/* other's section  */}
      <Card/>



      {/* Footer */}
      <div className="bg-[#192B3C] flex flex-col">
        <div className="flex flex-wrap justify-between p-8">
          <div id='contact-form' className="w-full md:w-1/2 bg-white p-8 rounded shadow-lg mt-8 md:mt-0 md:ml-8">
            {/* contact form - right side */}
            <h2 id='contact' className="text-black text-xl font-bold mb-6">Contact</h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                className="w-full p-3 py-1.5 border border-gray-300 rounded"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 py-1.5 border border-gray-300 rounded"
              />
              <textarea
                placeholder="Your Message"
                className="w-full p-3 border border-gray-300 rounded h-24"
              ></textarea>
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600"
              >
                Submit
              </button>
            </form>
          </div>
          {/* Left Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-32 text-white p-16">
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

        </div>

        {/* Footer */}
        <footer className="bg-[#192B3C] text-white text-center py-4 mt-7">
          &copy; 2025 Workport. All rights reserved.
        </footer>
      </div>

    </>
  )
}

export default Layout




