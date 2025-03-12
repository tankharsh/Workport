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
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Login Popup */}
      <LoginPopup />

      {/* Hero Section */}
      <div className="relative min-h-screen w-full">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${bgg})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/95 via-emerald-800/90 to-emerald-900/95"></div>
        </div>

        {/* Hero Content */}
        <div className="relative h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-2xl space-y-10">
            <div className="space-y-6">
              <h1 className="font-extrabold font-[Roboto] text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.1] text-white">
                <span className="text-amber-400">Simplify</span> Your Search,{' '}
                <span className="text-emerald-400">Amplify</span> Your Choices.
              </h1>
              <p className="text-xl text-gray-200 leading-relaxed max-w-xl">
                Discover and connect with trusted service providers in your area. Quality services, simplified booking process.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              {serviceprovider ? (
                <NavLink 
                  to="/Dashboard" 
                  className="group inline-flex items-center justify-center px-8 py-3.5 text-lg font-semibold text-emerald-900 bg-amber-400 hover:bg-amber-300 rounded-full transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg relative overflow-hidden"
                >
                  <span className="relative z-10">Go to Dashboard</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </NavLink>
              ) : (
                <NavLink 
                  to="/sp-provider-login-new" 
                  className="group inline-flex items-center justify-center px-8 py-3.5 text-lg font-semibold text-emerald-900 bg-amber-400 hover:bg-amber-300 rounded-full transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg relative overflow-hidden"
                >
                  <span className="relative z-10">List Your Business</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </NavLink>
              )}
              <NavLink 
                to="/services" 
                className="group inline-flex items-center justify-center px-8 py-3.5 text-lg font-semibold text-white border-2 border-emerald-400/30 hover:border-emerald-400/60 rounded-full transition-all duration-300 transform hover:scale-[1.02]"
              >
                Explore Services
              </NavLink>
            </div>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </div>

      {/* About Section */}
      <section className="py-24 bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.07) 1px, transparent 0)',
            backgroundSize: '30px 30px'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 bg-clip-text text-transparent mb-8">
              About Us
            </h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-gray-200 text-lg md:text-xl leading-relaxed mb-12">
                We connect skilled professionals with customers seeking quality services. Our platform ensures reliable, efficient, and transparent service delivery, making the process seamless for both providers and clients.
              </p>
              <NavLink 
                to='Aboutpage' 
                className="group inline-flex items-center px-8 py-3.5 text-lg font-semibold text-emerald-900 bg-emerald-400 hover:bg-emerald-300 rounded-full transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg relative overflow-hidden"
              >
                <span className="relative z-10">Learn More About Us</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10">
            <Categories />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-transparent h-32"></div>
      </section>

      {/* Recently Added Categories */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <RecentlyCategories />
        </div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.07) 1px, transparent 0)',
          backgroundSize: '30px 30px'
        }}></div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Card />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 to-transparent h-32"></div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Layout