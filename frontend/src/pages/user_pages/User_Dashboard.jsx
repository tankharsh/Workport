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

      <div className=" text-2xl font-bold mt-24 p-8 m-2">
        Recent Shops
        <hr className='h-[1.5px] mt-3 bg-black' />
      </div>

      <div className="flex flex-col p-8 m-2 gap-3 sm:flex-row sm:justify-between">
        <div>
          <div className="p-6 ms-2 border border-black bg-[#005f58] shadow-lg rounded-lg max-w-md mx-auto mb-5">
            <h2 className="text-xl font-bold mb-4">Shop Dashboard Search</h2>
            <input
              type="text"
              name="productName"
              value={filters.productName}
              onChange={handleChange}
              placeholder="Product Name"
              className="w-full p-2 border rounded mb-3"
            />
            <div className="flex gap-2 mb-3">
              <input
                type="number"
                name="priceMin"
                value={filters.priceMin}
                onChange={handleChange}
                placeholder="Min Price"
                className="w-1/2 p-2 border rounded"
              />
              <input
                type="number"
                name="priceMax"
                value={filters.priceMax}
                onChange={handleChange}
                placeholder="Max Price"
                className="w-1/2 p-2 border rounded"
              />
            </div>
            <select
              name="category"
              value={filters.category}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-3"
            >
              <option value="">Select Category</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="home">Home & Kitchen</option>
            </select>
            <select
              name="availability"
              value={filters.availability}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-3"
            >
              <option value="">Availability</option>
              <option value="in-stock">In Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
            <input
              type="text"
              name="brand"
              value={filters.brand}
              onChange={handleChange}
              placeholder="Brand"
              className="w-full p-2 border rounded mb-3"
            />
            <button
              onClick={handleSearch}
              className="w-full bg-[#FFA901] text-white py-2 rounded hover:bg-[#9d6d0d]"
            >
              Search
            </button>
          </div>
        </div>


        {serviceProviders.length > 0 ? (
          serviceProviders.map((provider) => (
            <Link to={`/Shop-Dashboard/${provider._id}`} key={provider._id}>
              <div
                className=" border border-black m-2  w-full max-w-5xl text-black p-4 rounded-lg shadow-md flex flex-col md:flex-row gap-6 "
              >
                {/* Shop Banner */}
                <img
                  src={`http://localhost:4000/${provider.sp_shop_banner_img}`}
                  className="bg-gray-300 w-full my-auto md:w-72 md:h-64 object-cover rounded-lg"
                  alt={provider.sp_shop_name}
                />

                {/* Provider Details */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-black">{provider.sp_shop_name}</h2>
                  <p className="text-md text-black capitalize mt-2">
                    {provider.sp_city}, {provider.sp_area}
                  </p>

                  {/* Services List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
                    {provider.services.length > 0 ? (
                      provider.services.map((service) => (
                        <div key={service._id} className="bg-stone-100 border border-gray-300 p-3 text-center text-lg rounded-lg">
                          <p className="font-semibold capitalize">{service.services_name || "No Name"}</p>
                          <p className="text-gray-700 font-bold flex justify-center items-center gap-1">
                            <FaRupeeSign /> {service.services_price || "N/A"}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {(service.services_description || "").substring(0, 25) + "..."}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 col-span-3">No services available</p>
                    )}
                  </div>

                  {/* Contact Buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
                    <a href={`tel:${provider.sp_contact}`} className="relative flex h-[50px] w-40 items-center justify-center overflow-hidden bg-blue-800 hover:shadow-blue-600 text-white shadow-2xl transition-all rounded-lg">
                      <span className="relative z-10 text-lg flex justify-center items-center gap-2">
                        <MdPhone /> {provider.sp_contact}
                      </span>
                    </a>

                    <a href={`https://wa.me/${provider.sp_contact}`} className="relative flex h-[50px] w-40 items-center justify-center overflow-hidden bg-green-600 hover:shadow-green-700 text-white shadow-2xl transition-all rounded-lg">
                      <span className="relative z-10 text-lg flex justify-center items-center gap-2">
                        <FaWhatsapp /> Whatsapp
                      </span>
                    </a>

                    <button onClick={() => setIsModalOpen(true)} className="relative flex h-[50px] w-44 items-center justify-center overflow-hidden bg-yellow-500 hover:shadow-yellow-600 text-white shadow-2xl transition-all rounded-lg">
                      <span className="relative z-10 text-lg flex justify-center items-center gap-2">
                        <FaCheckCircle /> Check Inquiry
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-6">No service providers available</p>
        )}


      </div>

      <VerificationModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <Footer />
    </>
  );
};

export default User_Dashboard;
