import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/user_components/Navbar";
import Footer from "../../components/user_components/Footer";
import { FaRupeeSign } from "react-icons/fa";
import { MdPhone } from "react-icons/md";
import { FaCheckCircle, FaWhatsapp } from "react-icons/fa";
import VerificationModal from "../../components/user_components/VerificationModal";

const User_Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceProviders, setServiceProviders] = useState([]);
  const location = useLocation();

  // Extract category ID from URL query parameters
  const searchParams = new URLSearchParams(location.search);
  const selectedCategory = searchParams.get("category");

  useEffect(() => {
    if (!selectedCategory) {
      console.warn("⚠️ No category selected!");
      return;
    }

    // console.log("📌 Selected Category:", selectedCategory);

    axios
      .get(`http://localhost:4000/api/sp/providers?category=${selectedCategory}`)
      .then((response) => {
        // console.log("✅ Full API Response:", response.data);
        setServiceProviders(response.data.providers || []);
      })
      .catch((error) => console.error("❌ Error fetching data:", error));
  }, [selectedCategory]);


  const [filters, setFilters] = useState({
    productName: "",
    priceMin: "",
    priceMax: "",
    category: "",
    availability: "",
    brand: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    console.log("Searching with filters:", filters);
  };

  return (
    <>
      <Navbar />

      <div className="text-2xl font-bold mt-24 p-8 m-2 text-center sm:text-left">
        Recent Shops
        <hr className='h-[1.5px] mt-3 bg-black' />
      </div>

      <div className="flex flex-col p-4 m-2 gap-6 md:flex-row md:flex-wrap md:justify-center lg:justify-between">
        <div className="w-full sm:w-96 md:w-80 lg:w-96 mx-auto">
          <div className="p-6 border border-black bg-[#005f58] shadow-lg rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-white">Shop Dashboard Search</h2>
            <input type="text" name="productName" value={filters.productName} onChange={handleChange} placeholder="Product Name" className="w-full p-2 border rounded mb-3" />
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <input type="number" name="priceMin" value={filters.priceMin} onChange={handleChange} placeholder="Min Price" className="w-full sm:w-1/2 p-2 border rounded" />
              <input type="number" name="priceMax" value={filters.priceMax} onChange={handleChange} placeholder="Max Price" className="w-full sm:w-1/2 p-2 border rounded" />
            </div>
            <select name="category" value={filters.category} onChange={handleChange} className="w-full p-2 border rounded mb-3">
              <option value="">Select Category</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="home">Home & Kitchen</option>
            </select>
            <select name="availability" value={filters.availability} onChange={handleChange} className="w-full p-2 border rounded mb-3">
              <option value="">Availability</option>
              <option value="in-stock">In Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
            <input type="text" name="brand" value={filters.brand} onChange={handleChange} placeholder="Brand" className="w-full p-2 border rounded mb-3" />
            <button onClick={handleSearch} className="w-full bg-[#FFA901] text-white py-2 rounded hover:bg-[#9d6d0d]">Search</button>
          </div>
        </div>

        <div className="flex flex-col gap-6 md:w-3/4 lg:w-3/5">
          {serviceProviders.length > 0 ? (
            serviceProviders.map((provider) => (
              <Link to={`/shop/${provider.spShopName.replace(/\s+/g, '-').toLowerCase()}?id=${provider._id}`} key={provider._id}>
                <div className="border border-black p-4 rounded-lg shadow-md flex flex-col md:flex-row gap-4 items-center md:items-center">
                  <img src={`http://localhost:4000/${provider.spShopBannerImage}`} className="bg-gray-300 w-full sm:w-80 md:w-72 md:h-64 object-cover rounded-lg" alt={provider.spShopName} />
                  <div className="flex-1 text-center flex-wrap md:text-left">
                    <h2 className="text-2xl font-bold text-black">{provider.spShopName}</h2>
                    <p className="text-md text-black capitalize mt-2">{provider.spCity}, {provider.spArea}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                      {provider.services.length > 0 ? (
                        provider.services.slice(0, 2).map((service) => (
                          <div key={service._id} className="bg-[#115D33] p-3 text-center text-lg rounded-lg">
                            <img
                              src={`http://localhost:4000/uploads/${service.serviceImage}`}
                              onError={(e) => e.target.src = 'https://via.placeholder.com/300'}
                              alt={service.serviceName}
                              className="w-full h-40 object-cover rounded-lg mb-3"
                            />
                            <p className="font-semibold text-white capitalize">{service.serviceName}</p>
                            <p className="text-xl font-bold flex text-white justify-center items-center gap-1">
                              <FaRupeeSign /> {service.servicePrice}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 col-span-2 text-center">No services available</p>
                      )}
                    </div>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                      <button onClick={() => window.location.href = `tel:${provider.spContact}`} className="flex items-center justify-center w-[180px] sm:w-[160px] h-[50px] bg-blue-800 text-white text-lg rounded-lg hover:bg-blue-700 transition-all shadow-md">
                        <MdPhone /> <span className="ml-2">{provider.spContact}</span>
                      </button>
                      <button onClick={() => window.open(`https://wa.me/91${provider.spContact}`, "_blank")} className="flex items-center justify-center w-[180px] sm:w-[160px] h-[50px] bg-green-600 text-white text-lg rounded-lg hover:bg-green-500 transition-all shadow-md">
                        <FaWhatsapp /> <span className="ml-2">WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center p-8 border border-gray-300 rounded-lg">
              <FaCheckCircle className="text-gray-400 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">No Service Providers Found</h3>
              <p className="text-gray-500 mt-2">
                There are no service providers available for this category at the moment.
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default User_Dashboard;
