/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa6";
import { IoIosSend } from "react-icons/io";
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import axios from "axios";

const RecentlyCategories = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/api/services/recentlyservices")
      .then((res) => res.json())
      .then((data) => {
        setServices(data);
        // console.log(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="h-auto md:mt-6 bg-[#2D4E35] ">
      <h1 className="bg-txt text-[#FFA901] text-center pt-6 text-3xl  sm:text-4xl lg:text-5xl font-semibold">
        Recently Added
      </h1>
      <div className="p-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
        {loading ? (
          <p className="">Loading...</p>
        ) : services.length > 0 ? (
          services.map((service) => (
            <RcCat key={service._id} service={service} />
          ))
        ) : (
          <p className="text-center">No services found.</p>
        )}
      </div>

    </div>
  );
};


const RcCat = ({ service }) => {

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/api/services/recentlyservices")
      .then((res) => res.json())
      .then((data) => {
        setServices(data);
        // console.log(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
        setLoading(false);
      });
  }, []);

  const { user } = useAuth();
  const navigate = useNavigate();
  // const [showPopup, setShowPopup] = useState(false);
  const [showPopup, setShowPopup] = useState(false);



  const handleWP = (event, service) => {
    if (!user) {
      event.preventDefault(); // Prevent default link behavior
      setShowPopup(true);
      return;
    }


    // If user is logged in, navigate to WhatsApp
    const phoneNumber = event.service_provider.sp_contact.startsWith("+")
      ? event.service_provider.sp_contact.replace("+", "")
      : "91" + event.service_provider.sp_contact;

    const whatsappURL = `https://wa.me/${phoneNumber}?text=Hello%2C%20I%20am%20interested%20in%20your%20services.`;

    window.open(whatsappURL, "_blank"); // Open WhatsApp link in new tab
  }

  const handleInquiry = async (service) => {
    console.log("AA CHHE : ", service.service_provider._id)
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
          serviceProvider: service.service_provider._id,
        }),
      });

      const data = await response.json();
      // console.log("Server Response:", data);

      if (response.ok) {
        toast.success(`Inquiry Sent Successfully to ${service.service_provider.sp_name}!`, {
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


  // console.log(service);
  return (
    <div className="max-w-sm hover:scale-105 duration-200 transition-all bg-white rounded-xl shadow-lg  overflow-hidden border border-gray-200">
      {/* Image Section */}
      <div className="w-full h-40 bg-gray-200 flex justify-center items-center">
        <img
          src={`http://localhost:4000/uploads/${service.services_img}`}
          alt={service.services_name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold capitalize text-gray-800">{service.services_name}</h2>

          <p className="text-xl font-bold text-green-600">₹{service.services_price}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center h-[1px] w-[1] text-yellow-500 my-2">
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar className="text-gray-300" />
          <span className="text-gray-600 ml-2 text-sm">4.5 (413)</span>
        </div>

        {/* Description */}
        <p className="text-sm mt-1 text-gray-600 text-justify break-words "> {(service.services_description).substr(0, 200) + " ..."}<span className="cursor-pointer">Read more</span></p>

        {/* Additional Info */}
        <div className="mt-4 flex justify-between items-center">
          <Link key={service.service_provider._id} to={`/Shop-Dashboard/${service.service_provider._id}`} className="text-md text-gray-700 cursor-pointer font-bold underline">Shop: {service.service_provider.sp_shop_name}</Link>
          <p className="text-sm text-black">Duration: {service.services_duration}</p>
        </div>

        <div className="flex flex-nowrap justify-center gap-3 mt-6 ">

          <a href="#" onClick={() => handleWP(service)}
            rel="noopener noreferrer" className="flex items-center justify-center w-[180px] sm:w-[160px] h-[50px] bg-green-600 text-white text-lg rounded-lg hover:bg-green-500 transition-all shadow-md">
            <FaWhatsapp /> <span className="ml-2">WhatsApp</span>
          </a>

          <button onClick={() => handleInquiry(service)} className="flex items-center justify-center w-[180px] sm:w-[160px] h-[50px] bg-yellow-500 text-white text-lg rounded-lg hover:bg-yellow-400 transition-all shadow-md">
            <IoIosSend /> <span className="ml-2">Send Inquiry</span>
          </button>
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
    </div>
  );
};




// export default RcCat;


export default RecentlyCategories;