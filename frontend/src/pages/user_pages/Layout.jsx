import React from 'react'
import Navbar from '../../components/user_components/Navbar'
import bgg from '../../assets/bgg.jpeg'
import { NavLink } from 'react-router-dom'
import Categories from '../../components/user_components/Categories'
import RecentlyCategories from '../../components/user_components/RecentlyCategories'
import Card from '../../components/user_components/Card'
import Footer from '../../components/user_components/Footer'
import LoginPopup from '../../components/user_components/LoginPopup'
import { useAuth } from '../../context/AuthContext'


const Layout = () => {

  const { serviceprovider } = useAuth();

  return (
    <>
      {/* navbar  */}
      <Navbar />

      {/* login popup  */}
      <LoginPopup />


      {/* background and heading  */}
      <div
        className="relative h-screen w-full bg-cover bg-center flex items-center"
        style={{ backgroundImage: `url(${bgg})` }}
      ></div>
      <div className="absolute top-80 container mx-auto px-6 md:px-12 lg:px-20">
        <div className="max-w-xl text-white space-y-20">
          <p className="font-extrabold font-[Roboto] text-white text-4xl md:text-7xl tracking-wide leading-loose mb-8">
            <span className='text-[#FFA901]'>Simplify</span> Your Search, <span className='text-[#28a491]'>Amplify</span> Your Choices.
          </p>

          {serviceprovider ? (
            <NavLink to="/Dashboard" className="mt-5 text-3xl font-semibold bg-[#FFA901] hover:bg-[#28a491] text-black px-8 py-2 rounded-3xl hover:pointer transition-all duration-300">Dashboard</NavLink>
          ) : (
            <NavLink to="/sp-provider-login" className="mt-5 text-3xl font-semibold bg-[#FFA901] hover:bg-[#28a491] text-black px-8 py-2 rounded-3xl hover:pointer transition-all duration-300">List Your Business</NavLink>
          )}

        </div>
      </div>

      {/* About Section  */}
      <div className="mt-6 flex bg-[#115D33] flex-col justify-center items-center px-4 sm:px-8 lg:px-16">
        <h1 className="bg-txt text-[#FFA901] text-center mt-5 text-3xl sm:text-4xl lg:text-5xl font-semibold">
          About Us
        </h1>
        <p className="txt text-white mt-6 text-center text-sm sm:text-base lg:text-lg leading-relaxed sm:leading-loose lg:leading-loose">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nihil eligendi
          dolor doloribus suscipit voluptatum, perspiciatis illum assumenda harum
          natus consectetur. Suscipit mollitia harum, numquam libero consectetur
          voluptatem magnam sed, doloremque id impedit aspernatur a quam. Lorem ipsum,
          dolor sit amet consectetur adipisicing elit. Nihil eligendi dolor doloribus
          suscipit voluptatum, perspiciatis illum assumenda harum natus consectetur.
          Suscipit mollitia harum, numquam libero consectetur voluptatem magnam sed,
          doloremque id impedit aspernatur a quam. Lorem ipsum, dolor sit amet
          consectetur adipisicing elit. Nihil eligendi dolor doloribus suscipit
          voluptatum, perspiciatis illum assumenda harum natus consectetur. Suscipit
          mollitia harum, numquam libero consectetur voluptatem magnam sed, doloremque
          id impedit aspernatur a quam.
        </p>
        <NavLink to='Aboutpage' className="txt w-48 mt-6 bg-[#FFA901] hover:bg-[#28a491] py-2 px-6 text-center rounded-3xl mb-6 transition-all duration-300">
          Learn More
        </NavLink>
      </div>



      <div className='flex justify-center'>
        <hr className='h-10 mt-5 w-[95%]' />
      </div>
      {/* top categories  */}
      <Categories />
      <div className='flex justify-center'>
        <hr className='h-10 mt-5 w-[95%]' />
      </div>

      {/* recently Added Categories  */}
      <RecentlyCategories />
      <div className='flex justify-center'>
        <hr className='h-10 mt-5 w-[95%]' />
      </div>
      {/* Card - Services  */}
      <Card />
      <div className='flex justify-center'>
        <hr className='h-10 mt-5 w-[95%]' />
      </div>
      {/* Footer  */}
      <Footer />


    </>
  )
}

export default Layout