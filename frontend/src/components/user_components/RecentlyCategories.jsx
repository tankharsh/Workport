/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa6";
import { IoIosSend } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const RecentlyCategories = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/api/services/recentlyservices")
      .then((res) => res.json())
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="relative py-16">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-4">
          Recently Added Services
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Discover our latest additions - fresh services ready to meet your needs
        </p>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading ? (
            <div className="col-span-full flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
            </div>
          ) : services.length > 0 ? (
            services.map((service) => (
              <RcCat key={service._id} service={service} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No services available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const RcCat = ({ service }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const handleWP = (service) => {
    if (!user) {
      setShowPopup(true);
      return;
    }

    if (!service || !service.serviceProviderId || !service.serviceProviderId.spContact) {
      toast.error("❌ Contact information missing!");
      return;
    }

    const phoneNumber = service.serviceProviderId.spContact.startsWith("+")
      ? service.serviceProviderId.spContact.replace("+", "")
      : "91" + service.serviceProviderId.spContact;

    const whatsappURL = `https://wa.me/${phoneNumber}?text=Hello%2C%20I%20am%20interested%20in%20your%20services.`;
    window.open(whatsappURL, "_blank");
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
      const response = await fetch("http://localhost:4000/api/inquiries/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: user.id,
          service: service._id,
          serviceProvider: service.serviceProviderId._id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Inquiry Sent Successfully to ${service.serviceProviderId.spName}!`, {
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

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={`http://localhost:4000/uploads/${service.serviceImage}`}
          alt={service.serviceName}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute bottom-3 right-3 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          ₹{service.servicePrice}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-emerald-900 capitalize group-hover:text-emerald-700 transition-colors">
            {service.serviceName}
          </h3>
          <div className="flex items-center text-amber-400 ml-2">
            <FaStar />
            <span className="text-gray-600 ml-1 text-sm">4.5</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
          {service.serviceDescription || "No description available"}
        </p>

        {/* Shop Info */}
        <div className="mt-4 flex items-center justify-between">
          {service.serviceProviderId ? (
            <Link 
              to={`/Shop-Dashboard/${service.serviceProviderId._id}`}
              className="text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors"
            >
              {service.serviceProviderId.spShopName || 'Unknown Shop'}
            </Link>
          ) : (
            <span className="text-gray-500 text-sm">Shop not available</span>
          )}
          <span className="text-sm text-gray-500">
            {service.serviceDuration || 'Duration N/A'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => handleWP(service)}
            className="flex items-center justify-center px-4 py-2.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors duration-300"
          >
            <FaWhatsapp className="mr-2" />
            <span className="font-medium">WhatsApp</span>
          </button>
          <button
            onClick={() => handleInquiry(service)}
            className="flex items-center justify-center px-4 py-2.5 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors duration-300"
          >
            <IoIosSend className="mr-2" />
            <span className="font-medium">Inquire</span>
          </button>
        </div>
      </div>

      {/* Login Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 transform transition-all">
            <h2 className="text-2xl font-bold text-emerald-900 mb-4">Login Required</h2>
            <p className="text-gray-600 mb-6">Please login to your account to continue with this action.</p>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/user-login')}
                className="flex-1 bg-emerald-600 text-white py-2.5 rounded-full hover:bg-emerald-700 transition-colors duration-300 font-medium"
              >
                Login
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2.5 rounded-full hover:bg-gray-300 transition-colors duration-300 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentlyCategories;