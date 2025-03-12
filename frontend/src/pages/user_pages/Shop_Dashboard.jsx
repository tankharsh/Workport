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
        <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-8">
          <img
            src={shopData.spShopBannerImage ? `http://localhost:4000/uploads/${shopData.spShopBannerImage}` : "https://via.placeholder.com/1200x400?text=Shop+Banner"}
            alt="Shop Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-2">{shopData.spShopName}</h1>
              <p className="text-xl text-white">{shopData.spDescription}</p>
            </div>
          </div>
        </div>

        {/* Shop Info and Services */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Shop Info */}
          <div className="md:w-1/3">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-6">
                <img
                  src={shopData.spShopImage ? `http://localhost:4000/uploads/${shopData.spShopImage}` : "https://via.placeholder.com/150?text=Shop"}
                  alt="Shop Logo"
                  className="w-24 h-24 rounded-full object-cover mr-4"
                />
                <div>
                  <h2 className="text-2xl font-bold">{shopData.spShopName}</h2>
                  <p className="text-gray-600">
                    {shopData.spCategories && shopData.spCategories.length > 0
                      ? shopData.spCategories.map(cat => cat.name || cat.categoryName).join(', ')
                      : 'No categories available'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <IoIosPerson className="text-blue-600 mr-2 text-xl" />
                  <span>{shopData.spName || 'N/A'}</span>
                </div>
                <div className="flex items-center">
                  <FaEnvelope className="text-blue-600 mr-2 text-xl" />
                  <span>{shopData.spEmail || 'N/A'}</span>
                </div>
                <div className="flex items-center">
                  <FaPhone className="text-blue-600 mr-2 text-xl" />
                  <span>{shopData.spContact || 'N/A'}</span>
                </div>
                <div className="flex items-start">
                  <FaAddressCard className="text-blue-600 mr-2 text-xl mt-1" />
                  <span>
                    {shopData.spBlockNo || 'N/A'}, {shopData.spArea || 'N/A'}, {shopData.spCity || 'N/A'} - {shopData.spPincode || 'N/A'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleWhatsApp}
                className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center justify-center"
              >
                <FaWhatsapp className="mr-2 text-xl" /> Chat on WhatsApp
              </button>
            </div>
          </div>

          {/* Services */}
          <div className="md:w-2/3">
            <h2 className="text-2xl font-bold mb-6">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {shopData && shopData.services && shopData.services.length > 0 ? (
                shopData.services.map((service) => (
                  <div key={service._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <img
                      src={service.serviceImage ? `http://localhost:4000/uploads/${service.serviceImage}` : "https://via.placeholder.com/300x200?text=Service"}
                      alt={service.serviceName || 'Service'}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{service.serviceName || 'Unnamed Service'}</h3>
                      <p className="text-gray-600 mb-4">{service.serviceDescription || 'No description available'}</p>
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center">
                          <FaRupeeSign className="text-green-600" />
                          <span className="font-bold text-lg">{service.servicePrice || 'N/A'}</span>
                        </div>
                        <div className="text-sm text-gray-500">{service.serviceDuration || 'N/A'}</div>
                      </div>
                      <button
                        onClick={() => handleInquiryClick(service)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center"
                      >
                        <IoIosSend className="mr-2" /> Send Inquiry
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-8">
                  <p className="text-gray-500">No services available at the moment.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Login Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <FaCheckCircle className="text-red-500 text-5xl mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Login Required</h2>
              <p className="text-gray-600 mt-2">
                Please login to your account to send inquiries or contact service providers.
              </p>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-6 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleLoginRedirect}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg"
              >
                Login Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inquiry Form Popup */}
      {showInquiryPopup && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">Send Inquiry</h2>
              <p className="text-gray-600 mt-2">
                Please provide additional information for your inquiry about <span className="font-semibold">{selectedService.serviceName}</span>
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="userAddress" className="block text-sm font-medium text-gray-700 mb-1">Your Address *</label>
                <textarea
                  id="userAddress"
                  name="userAddress"
                  value={inquiryData.userAddress}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Enter your complete address"
                  required
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-1">Preferred Date (Optional)</label>
                <input
                  type="date"
                  id="preferredDate"
                  name="preferredDate"
                  value={inquiryData.preferredDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div>
                <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">Additional Information (Optional)</label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={inquiryData.additionalInfo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Any specific requirements or questions?"
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={() => setShowInquiryPopup(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-6 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSendInquiry}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg flex items-center"
              >
                <IoIosSend className="mr-2" /> Send Inquiry
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
