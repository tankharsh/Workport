import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEnvelope, FaPhone, FaRupeeSign } from 'react-icons/fa';
import { IoIosPerson } from "react-icons/io";
import { FaAddressCard } from "react-icons/fa";
import { useNavigate, useParams } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/user_components/Navbar';
import Footer from '../../components/user_components/Footer';
// import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { FaRupeeSign } from "react-icons/fa";
// import { MdPhone } from "react-icons/md";
import { IoIosSend } from "react-icons/io";
import { FaCheckCircle, FaWhatsapp } from "react-icons/fa";
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const Shop_Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  // const [showPopup, setShowPopup] = useState(false);
  const [shopData, setShopData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const { providerId } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:4000/api/sp/providers/${providerId}`)
      .then(response => {
        setShopData(response.data.provider);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleWhatsApp = (event) => {
    if (!user) {
      event.preventDefault(); // Prevent default link behavior
      setShowPopup(true);
      return;
    }

    // If user is logged in, navigate to WhatsApp
    const phoneNumber = shopData.sp_contact.startsWith("+")
      ? shopData.sp_contact.replace("+", "")
      : "91" + shopData.sp_contact;

    const whatsappURL = `https://wa.me/${phoneNumber}?text=Hello%2C%20I%20am%20interested%20in%20your%20services.`;

    window.open(whatsappURL, "_blank"); // Open WhatsApp link in new tab
  }

  const handleInquiry = async (service) => {

    if (!user || !user.id) {
      setShowPopup(true);
      return;
    }

    if (!service || !service._id) {
      toast.error("❌ Service information missing!");
      return;
    }

    try {
      // console.log("Sending inquiry...", { user: user.id, service: service._id, serviceProvider: shopData._id });

      const response = await fetch("http://localhost:4000/api/inquiries/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: user.id,
          service: service._id,
          serviceProvider: shopData._id,
        }),
      });

      const data = await response.json();
      // console.log("Server Response:", data);

      if (response.ok) {
        toast.success(`Inquiry Sent Successfully to ${shopData.sp_name}!`, {
          position: "bottom-right",
          autoClose: 1500,
        });
      } else {
        toast.error(`❌ Failed: ${data.message || "Something went wrong"}`, {
          position: "bottom-right",
          autoClose: 1500,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("❌ Server error, please try again later!", {
        position: "bottom-right",
        autoClose: 1500,
      });
    }
  };


  if (!shopData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className='mt-16 '>

        <div className="relative h-48 lg:h-60 w-full ">
          {/* Background Image */}
          <img
            src={`http://localhost:4000/${shopData.sp_shop_banner_img.replace(/\\/g, '/')}`}
            alt="Shop Image"
            className="absolute top-0 left-0 w-full h-full object-cover"
          />

          {/* Centered Text */}
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-40">
            <h2 className="text-white text-xl lg:text-2xl capitalize font-bold text-center">
              {shopData.sp_shop_name}
            </h2>
          </div>
        </div>



        <div className="w-full flex flex-col lg:flex-row ">
          <div className="lg:w-1/2 w-full h-auto p-4 lg:p-10">
            <div className="flex items-center mt-5 gap-2">
              <IoIosPerson className='bg-[#FFA901] rounded-full text-3xl p-1' />
              <span className="font-bold text-xl">Owner Name : <span className='text-lg font-medium'>{shopData.sp_name}</span></span>
            </div>
            <hr className='h-[2px] mt-3 mb-2 bg-black' />
            <div className="flex items-center gap-2">
              <FaPhone className='bg-[#FFA901] rounded-full text-3xl p-1' />
              <span className="font-bold">Contact No: {shopData.sp_contact}</span>
            </div>
            <hr className='h-[2px] mt-3 mb-2 bg-black' />
            <div className="flex items-center gap-2">
              <FaEnvelope className='bg-[#FFA901] rounded-full text-3xl p-1' />
              <span className="font-bold">Email: {shopData.sp_email}</span>
            </div>
            <hr className='h-[2px] mt-3 mb-2 bg-black' />
            <div className="flex items-center gap-2 flex-wrap">
              <FaAddressCard className='bg-[#FFA901] rounded-full text-3xl p-1' />
              <span className="font-bold">Address : {shopData.sp_block_no},<br/> {shopData.sp_area}, {shopData.sp_city} - {shopData.sp_pincode}</span>
            </div>
            <hr className='h-[2px] mt-3 mb-2 bg-black' />
          </div>

          {/* Images */}
          <div className="lg:w-1/2 w-full h-auto flex flex-col lg:flex-row justify-center gap-4 lg:gap-10 p-4 lg:p-10">
            <div className="h-48 lg:h-64 w-full lg:w-full">
              <img
                src={`http://localhost:4000/${shopData.sp_shop_img.replace(/\\/g, '/')}`}
                alt="Shop Image"
                className="w-full h-full object-cover rounded-3xl"
              />
            </div>

          </div>
        </div>
      </div>
      <div className="h-auto">
        <div className="h-full pt-5  rounded">
          <h1 className="uppercase px-4 lg:px-10 text-2xl lg:text-4xl font-bold text-[#FFA901]">Our <span className='text-black'>Services</span></h1>
          <div className="grid pb-5 px-4 lg:px-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
            {shopData.services.map((service) => (
              <div key={service._id} className="bg-[#115D33] hover:scale-105 transition-all duration-300  p-3 text-center text-lg rounded-lg">

                <img
                  src={`http://localhost:4000/uploads/${service.services_img}`}
                  onError={(e) => e.target.src = 'https://via.placeholder.com/300'}
                  alt={service.services_name}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />

                <div className='flex justify-between'>
                  <p className="font-semibold text-left text-stone-100 capitalize text-2xl">{service.services_name}</p>
                  <p className="text-2xl font-bold flex text-white justify-center items-center gap-1">
                    <FaRupeeSign /> {service.services_price}
                  </p>
                </div>

                <p className="font-medium mt-2 text-sm text-white text-left">
                  {(service.services_description).substr(0, 300) + "..."}
                  <span className='text-black cursor-pointer'> read more</span>
                </p>

                {/* <button className="bg-green-500 text-white px-6 py-2 rounded-lg mt-3">Book Now</button> */}

                {/* Contact Buttons */}
                <div className="flex flex-nowrap justify-center gap-3 mt-6 ">
                  {/* <a href="#" className="flex items-center justify-center w-[180px] sm:w-[160px] h-[50px] bg-blue-800 text-white text-lg rounded-lg hover:bg-blue-700 transition-all shadow-md">
                    <MdPhone /> <span className="ml-2">1234567890</span>
                  </a> */}

                  <a href="#" onClick={handleWhatsApp}
                    rel="noopener noreferrer" className="flex items-center justify-center w-[180px] sm:w-[160px] h-[50px] bg-green-600 text-white text-lg rounded-lg hover:bg-green-500 transition-all shadow-md">
                    <FaWhatsapp /> <span className="ml-2">WhatsApp</span>
                  </a>

                  <button onClick={() => handleInquiry(service)} className="flex items-center justify-center w-[180px] sm:w-[160px] h-[50px] bg-yellow-500 text-white text-lg rounded-lg hover:bg-yellow-400 transition-all shadow-md">
                    <IoIosSend /> <span className="ml-2">Send Inquiry</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-xl text-black font-bold mb-3">Login Required</h2>
            <p className="text-gray-700 mb-4">You need to login to book a service.</p>
            <div className="flex justify-center gap-4">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={() => navigate('/user-login')}>Login</button>
              <button className="bg-gray-500 text-white px-4 py-2 rounded-lg" onClick={() => setShowPopup(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default Shop_Dashboard;
