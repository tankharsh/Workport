import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaRupeeSign } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/user_components/Navbar';
import Footer from '../../components/user_components/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaAddressCard } from "react-icons/fa";
import { IoIosPerson } from "react-icons/io";

const Shop_Dashboard = () => {
  const { addToCart, user } = useAuth();
  const navigate = useNavigate();
  
  const [showPopup, setShowPopup] = useState(false);

  const services = [
    { 
      id: 1, 
      name: 'Hair Wash', 
      price: 3500, 
      image: 'https://cdn.pixabay.com/photo/2025/01/31/09/52/dj-9372007_640.jpg',
      desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro at saepe voluptas ducimus quaerat, ullam tenetur ratione inventore soluta facere molestiae a voluptatem.'
    },
    { 
      id: 2, 
      name: 'Hair Cut', 
      price: 1500, 
      image: 'https://cdn.pixabay.com/photo/2025/01/26/20/33/robin-9361610_640.jpg',
      desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro at saepe voluptas ducimus quaerat, ullam tenetur ratione inventore soluta facere molestiae a voluptatem.' 
    },
    { 
      id: 3, 
      name: 'Hair Color', 
      price: 5000, 
      image: 'https://cdn.pixabay.com/photo/2024/09/09/14/06/aster-9034882_640.jpg',
      desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro at saepe voluptas ducimus quaerat, ullam tenetur ratione inventore soluta facere molestiae a voluptatem.' 
    },
    { 
      id: 4, 
      name: 'Hair Color', 
      price: 5000, 
      image: 'https://cdn.pixabay.com/photo/2024/09/09/14/06/aster-9034882_640.jpg',
      desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro at saepe voluptas ducimus quaerat, ullam tenetur ratione inventore soluta facere molestiae a voluptatem.' 
    },
    { 
      id: 5, 
      name: 'Hair Color', 
      price: 5000, 
      image: 'https://cdn.pixabay.com/photo/2024/09/09/14/06/aster-9034882_640.jpg',
      desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro at saepe voluptas ducimus quaerat, ullam tenetur ratione inventore soluta facere molestiae a voluptatem.' 
    },
  ];

  const handleAddToCart = (service) => {
    if (!user) {
      setShowPopup(true);
      return;
    }
    addToCart(service);
    toast.success(`✅ ${service.name} added to cart!`, {
      position: "bottom-center",
      autoClose: 1500, 
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
    // navigate('/cart');
  };

  return (
    <>
      <Navbar />
      <div className="w-full flex flex-col lg:flex-row mt-8">
        {/* Shop Details */}
        <div className="lg:w-1/2 w-full h-auto p-4 lg:p-10">
          <div className="flex items-center gap-4">
            <h1 className="uppercase text-2xl lg:text-4xl font-bold">SHOP NAME</h1>
          </div>
          <div className="flex items-center mt-5 gap-2">
            <span>
              <IoIosPerson />
            </span>
            <span className="font-bold text-xl">Owner Name : <span className='text-lg font-medium'>Milan</span></span>
          </div>
          <hr className='h-5 mt-2' />
          <div className="flex items-center gap-2">
            <span>
              <FaPhone />
            </span>
            <span className="font-bold">Contact No: 1234567890</span>
          </div>
          <hr className='h-5 mt-2' />
          <div className="flex items-center gap-2">
            <span>
              <FaEnvelope />
            </span>
            <span className="font-bold">Email: a@gmail.com</span>
          </div>
          <hr className='h-5 mt-2' />
          <div className="flex items-center gap-2 flex-wrap">
            <span>
              <FaAddressCard />
            </span>
            <span className="font-bold">Address : </span>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium, reprehenderit.
          </div>
        </div>

        {/* Images */}
        <div className="lg:w-1/2 w-full h-auto flex flex-col lg:flex-row justify-center gap-4 lg:gap-10 p-4 lg:p-10">
          <div className="h-48 lg:h-60 w-full lg:w-1/2">
            <img
              src="https://cdn.pixabay.com/photo/2022/09/10/22/24/apples-7445797_640.jpg"
              alt="Shop Image"
              className="w-full h-full object-cover rounded-3xl"
            />
          </div>
          <div className="h-48 lg:h-60 w-full lg:w-1/2">
            <img
              src="https://cdn.pixabay.com/photo/2022/09/10/22/24/apples-7445797_640.jpg"
              alt="Shop Image"
              className="w-full h-full object-cover rounded-3xl"
            />
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="h-auto p-4 lg:p-10">
        <div className="h-full pt-5 border-2 border-white rounded-lg">
          <h1 className="uppercase px-4 lg:px-10 text-2xl lg:text-4xl font-bold">
            Services
          </h1>
          <div className="grid px-4 lg:px-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-[#52796F] hover:scale-105 transition-all duration-300 border border-gray-500 p-3 text-center text-lg rounded-lg"
              >
                <img 
                  src={service.image} 
                  alt={service.name} 
                  className="w-full h-40 object-cover rounded-lg mb-3" 
                />
                <div className='flex justify-between'>
                <p className="font-semibold text-left text-2xl">{service.name}</p>
                <p className="text-2xl font-bold flex justify-center items-center gap-1">
                  <FaRupeeSign /> {service.price}
                </p></div>
               <p className="font-medium mt-2 text-sm text-left ">{service.desc}</p>
                
                <button
                  onClick={() => handleAddToCart(service)}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg mt-3"
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
     
      {/* Custom Popup for Login Alert */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-xl text-black font-bold mb-3">Login Required</h2>
            <p className="text-gray-700 mb-4">You need to login to book a service.</p>
            <div className="flex justify-center gap-4">
              <button 
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                onClick={() => navigate('/user-login')}
              >
                Login
              </button>
              <button 
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                onClick={() => setShowPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Shop_Dashboard;
