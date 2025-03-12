import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEnvelope, FaPhone, FaRupeeSign } from 'react-icons/fa';
import { IoIosPerson } from "react-icons/io";
import { FaAddressCard } from "react-icons/fa";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
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
  const [showInquiryPopup, setShowInquiryPopup] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [inquiryData, setInquiryData] = useState({
    userAddress: user?.userAddress || '',
    preferredDate: '',
    additionalInfo: ''
  });
  const { providerId } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const idFromQuery = searchParams.get('id');
  
  // Use either the ID from params or from query
  const shopId = providerId || idFromQuery;

  useEffect(() => {
    if (!shopId) {
      console.error('No shop ID provided');
      return;
    }
    
    console.log('Fetching shop data for ID:', shopId);
    
    axios.get(`http://localhost:4000/api/sp/providers/${shopId}`)
      .then(response => {
        console.log('API Response:', response.data);
        if (response.data && response.data.provider) {
          // Ensure services and categories are arrays even if they're missing or null
          const providerData = {
            ...response.data.provider,
            services: Array.isArray(response.data.provider.services) 
              ? response.data.provider.services 
              : [],
            spCategories: Array.isArray(response.data.provider.spCategories) 
              ? response.data.provider.spCategories 
              : (Array.isArray(response.data.provider.category) 
                ? response.data.provider.category 
                : [])
          };
          
          console.log('Processed provider data:', providerData);
          setShopData(providerData);
        } else {
          console.error('Invalid API response format:', response.data);
          // Set default empty data to prevent rendering errors
          setShopData({
            spName: 'Not Available',
            spEmail: 'Not Available',
            spContact: 'Not Available',
            spShopName: 'Shop Not Found',
            spBlockNo: '',
            spArea: '',
            spCity: '',
            spPincode: '',
            spDescription: 'No description available',
            spShopImage: '',
            spShopBannerImage: '',
            services: [],
            spCategories: []
          });
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        // Set default empty data on error
        setShopData({
          spName: 'Not Available',
          spEmail: 'Not Available',
          spContact: 'Not Available',
          spShopName: 'Error Loading Shop',
          spBlockNo: '',
          spArea: '',
          spCity: '',
          spPincode: '',
          spDescription: 'Could not load shop information',
          spShopImage: '',
          spShopBannerImage: '',
          services: [],
          spCategories: []
        });
      });
  }, [shopId]);

  // Update inquiry data when user changes
  useEffect(() => {
    if (user && user.userAddress) {
      setInquiryData(prev => ({
        ...prev,
        userAddress: user.userAddress
      }));
    }
  }, [user]);

  const handleWhatsApp = (event) => {
    if (!user) {
      event.preventDefault(); // Prevent default link behavior
      setShowPopup(true);
      return;
    }

    // If user is logged in, navigate to WhatsApp
    const phoneNumber = shopData.spContact.startsWith("+")
      ? shopData.spContact.replace("+", "")
      : "91" + shopData.spContact;

    const whatsappURL = `https://wa.me/${phoneNumber}?text=Hello%2C%20I%20am%20interested%20in%20your%20services.`;

    window.open(whatsappURL, "_blank"); // Open WhatsApp link in new tab
  }

  const handleInquiryClick = (service) => {
    if (!user || !user.id) {
      setShowPopup(true);
      return;
    }

    if (!service || !service._id) {
      toast.error("❌ Service information missing!");
      return;
    }

    // Set the selected service and show the inquiry popup
    setSelectedService(service);
    setShowInquiryPopup(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInquiryData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendInquiry = async () => {
    if (!inquiryData.userAddress.trim()) {
      toast.error("Please provide your address!");
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
          service: selectedService._id,
          serviceProvider: shopData._id,
          userAddress: inquiryData.userAddress,
          preferredDate: inquiryData.preferredDate,
          additionalInfo: inquiryData.additionalInfo
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Inquiry Sent Successfully to ${shopData.spName}!`, {
          position: "bottom-right",
          autoClose: 1500,
        });
        // Close the popup and reset form
        setShowInquiryPopup(false);
        setInquiryData({
          userAddress: user?.userAddress || '',
          preferredDate: '',
          additionalInfo: ''
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

  const handleLoginRedirect = () => {
    setShowPopup(false);
    navigate('/login');
  };

  if (!shopData) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Shop Banner */}
        <div className="relative h-48 md:h-64 rounded-xl overflow-hidden mb-8 bg-gradient-to-r from-emerald-600 to-emerald-800">
          <img
            src={shopData.spShopBannerImage ? `http://localhost:4000/uploads/${shopData.spShopBannerImage}` : "https://via.placeholder.com/1200x400?text=Shop+Banner"}
            alt="Shop Banner"
            className="w-full h-full object-cover mix-blend-overlay"
          />
          <div className="absolute inset-0 flex items-center px-6">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{shopData.spShopName}</h1>
              <p className="text-emerald-100 text-sm md:text-base line-clamp-2">{shopData.spDescription}</p>
            </div>
          </div>
        </div>

        {/* Shop Info and Services */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Shop Info */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="relative h-32 bg-gradient-to-r from-emerald-500 to-emerald-600">
                <img
                  src={shopData.spShopImage ? `http://localhost:4000/uploads/${shopData.spShopImage}` : "https://via.placeholder.com/150?text=Shop"}
                  alt="Shop Logo"
                  className="absolute -bottom-10 left-6 w-24 h-24 rounded-xl object-cover border-4 border-white shadow-md"
                />
              </div>
              
              <div className="pt-12 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1">{shopData.spShopName}</h2>
                <div className="flex flex-wrap gap-2 mb-6">
                  {shopData.spCategories && shopData.spCategories.length > 0
                    ? shopData.spCategories.map((cat, index) => (
                      <span key={index} className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md text-sm">
                        {cat.name || cat.categoryName}
                      </span>
                    ))
                    : <span className="text-gray-500 text-sm">No categories available</span>
                  }
                </div>

                <div className="space-y-4 divide-y divide-gray-100">
                  <div className="flex items-center py-2">
                    <IoIosPerson className="text-emerald-600 mr-3 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500">Owner</p>
                      <p className="font-medium">{shopData.spName || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center py-2">
                    <FaEnvelope className="text-emerald-600 mr-3 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{shopData.spEmail || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center py-2">
                    <FaPhone className="text-emerald-600 mr-3 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500">Contact</p>
                      <p className="font-medium">{shopData.spContact || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start py-2">
                    <FaAddressCard className="text-emerald-600 mr-3 text-xl mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">
                        {shopData.spBlockNo || 'N/A'}, {shopData.spArea || 'N/A'}, {shopData.spCity || 'N/A'} - {shopData.spPincode || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={handleWhatsApp}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <FaWhatsapp className="text-xl" /> WhatsApp
                  </button>
                  <button
                    onClick={() => window.location.href = `tel:${shopData.spContact}`}
                    className="flex-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <FaPhone /> Call Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Our Services</h2>
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm">
                  {shopData.services?.length || 0} Services
                </span>
              </div>
              
              <div className="grid gap-4">
                {shopData && shopData.services && shopData.services.length > 0 ? (
                  shopData.services.map((service) => (
                    <div key={service._id} className="group bg-gray-50 rounded-xl p-4 hover:bg-white hover:shadow-md transition-all duration-300">
                      <div className="flex gap-4">
                        <div className="relative w-24 h-24">
                          <img
                            src={service.serviceImage ? `http://localhost:4000/uploads/${service.serviceImage}` : "https://via.placeholder.com/100"}
                            alt={service.serviceName || 'Service'}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 rounded-lg transition-colors"></div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                              {service.serviceName || 'Unnamed Service'}
                            </h3>
                            <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-medium">
                              {service.serviceDuration || 'Flexible'}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                            {service.serviceDescription || 'No description available'}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-gray-500 mb-0.5">Starting from</p>
                              <div className="flex items-center gap-1 text-emerald-600">
                                <FaRupeeSign className="text-sm" />
                                <span className="font-bold text-lg">{service.servicePrice || 'N/A'}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleInquiryClick(service)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg flex items-center text-sm font-medium group-hover:shadow-lg transition-all"
                            >
                              <IoIosSend className="mr-1.5" /> Send Inquiry
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <FaCheckCircle className="text-gray-300 text-4xl mx-auto mb-3" />
                    <p className="text-gray-500">No services available at the moment.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"></div>
          
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl max-w-md w-full transform transition-all duration-300 scale-100 opacity-100">
              {/* Close Button */}
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Popup Content */}
              <div className="p-8">
                {/* Icon and Gradient Circle */}
                <div className="relative mx-auto w-20 h-20 mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-200 to-emerald-300 rounded-full animate-pulse"></div>
                  <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
                    <FaCheckCircle className="text-emerald-500 text-3xl" />
                  </div>
                </div>

                {/* Text Content */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    To access this feature and send inquiries to service providers, please log in to your account.
                  </p>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleLoginRedirect}
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Login Now
                  </button>
                  
                  <button
                    onClick={() => setShowPopup(false)}
                    className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium transition-colors duration-200 border border-gray-200"
                  >
                    Cancel
                  </button>
                </div>

                {/* Additional Info */}
                <p className="text-center text-gray-500 text-xs mt-6">
                  Don't have an account? 
                  <a href="/register" className="text-emerald-600 hover:text-emerald-700 ml-1">
                    Sign up here
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inquiry Form Popup */}
      {showInquiryPopup && selectedService && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"></div>
          
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl max-w-lg w-full transform transition-all duration-300 scale-100 opacity-100 shadow-xl">
              {/* Close Button */}
              <button
                onClick={() => setShowInquiryPopup(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-10"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Header with Service Image */}
              <div className="relative h-48 rounded-t-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-800">
                  <img
                    src={selectedService.serviceImage ? `http://localhost:4000/uploads/${selectedService.serviceImage}` : "https://via.placeholder.com/400"}
                    alt={selectedService.serviceName}
                    className="w-full h-full object-cover mix-blend-overlay opacity-75"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="bg-emerald-500/20 text-emerald-100 text-xs px-3 py-1 rounded-full border border-emerald-400/30 mb-2 inline-block">
                    {selectedService.serviceDuration || 'Flexible Duration'}
                  </span>
                  <h2 className="text-2xl font-bold text-white mb-1">{selectedService.serviceName}</h2>
                  <p className="text-emerald-100 text-sm">
                    Send inquiry to {shopData.spShopName}
                  </p>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="userAddress" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="userAddress"
                      name="userAddress"
                      value={inquiryData.userAddress}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                      rows="3"
                      placeholder="Enter your complete delivery address"
                      required
                    ></textarea>
                  </div>
                  
                  <div>
                    <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Date <span className="text-gray-400">(Optional)</span>
                    </label>
                    <input
                      type="date"
                      id="preferredDate"
                      name="preferredDate"
                      value={inquiryData.preferredDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Information <span className="text-gray-400">(Optional)</span>
                    </label>
                    <textarea
                      id="additionalInfo"
                      name="additionalInfo"
                      value={inquiryData.additionalInfo}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                      rows="3"
                      placeholder="Any specific requirements or questions?"
                    ></textarea>
                  </div>
                </div>

                {/* Price Info */}
                <div className="mt-6 p-4 bg-emerald-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-emerald-600 font-medium">Service Price</p>
                      <div className="flex items-center gap-1 text-emerald-700">
                        <FaRupeeSign className="text-base" />
                        <span className="text-xl font-bold">{selectedService.servicePrice}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-emerald-600 font-medium">Duration</p>
                      <p className="text-emerald-700 font-medium">
                        {selectedService.serviceDuration || 'Flexible'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowInquiryPopup(false)}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendInquiry}
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 text-sm font-medium flex items-center"
                  >
                    <IoIosSend className="mr-2" /> Send Inquiry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Shop_Dashboard;
