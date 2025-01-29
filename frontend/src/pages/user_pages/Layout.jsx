import React from 'react'
import Navbar from '../../components/user_components/Navbar'
import bg from '../../assets/bg.png'
import { NavLink } from 'react-router-dom'
import Categories from '../../components/user_components/Categories'
import RecentlyCategories from '../../components/user_components/RecentlyCategories'
import Card from '../../components/user_components/Card'
import Footer from '../../components/user_components/Footer'

const Layout = () => {
  return (
    <>
      <Navbar />

      {/* background and heading  */}
      <div
        className="h-screen w-full bg-cover bg-center flex items-center"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="max-w-xl text-white space-y-20">
            <p className="bg-txt text-black text-lg md:text-7xl tracking-wide leading-loose mb-8">
              Simplify Your Search, Amplify Your Choices.
            </p>
            <NavLink to="/sp-provider" className="mt-5 text-3xl font-semibold bg-[#EEB6B6] text-black px-8 py-2 rounded-3xl hover:pointer">List Your Business</NavLink>
          </div>
        </div>
      </div>

      {/* About Section  */}
      <div className="mt-6 flex flex-col justify-center items-center px-4 sm:px-8 lg:px-16">
        <h1 className="bg-txt text-center mt-5 text-3xl sm:text-4xl lg:text-5xl font-semibold">
          About Us
        </h1>
        <p className="txt mt-6 text-center text-sm sm:text-base lg:text-lg leading-relaxed sm:leading-loose lg:leading-loose">
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
        <button className="txt w-48 mt-6 bg-[#EEB6B6] py-2 px-6 text-center rounded-3xl hover:bg-green-500 transition-all duration-300">
          Learn More
        </button>
      </div>

      {/* top categories  */}
      <Categories />

      {/* recently Added Categories  */}
      <RecentlyCategories />

      {/* Card - Services  */}
      <Card/>

      {/* Footer  */}
      <Footer/>
    </>
  )
}

export default Layout