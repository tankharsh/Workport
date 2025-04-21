import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/user_components/Navbar";
import Footer from "../../components/user_components/Footer";
import { FaRupeeSign, FaFilter, FaStar, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { MdPhone } from "react-icons/md";
import { FaCheckCircle, FaWhatsapp } from "react-icons/fa";

const User_Dashboard = () => {
  const [serviceProviders, setServiceProviders] = useState([]);
  const [allServiceProviders, setAllServiceProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const selectedCategory = searchParams.get("category");

  // Fetch categories for filter dropdown
  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/category/getAll`)
      .then((response) => {
        setCategories(response.data || []);
      })
      .catch((error) => {
        console.error("❌ Error fetching categories:", error);
      });
  }, []);

  useEffect(() => {
    if (!selectedCategory) {
      console.warn("⚠️ No category selected!");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    axios
      .get(`http://localhost:4000/api/sp/providers?category=${selectedCategory}`)
      .then((response) => {
        const providers = response.data.providers || [];
        setAllServiceProviders(providers); // Store all providers for filtering
        setServiceProviders(providers); // Display all initially
        setIsLoading(false);

        // Set initial category filter based on URL parameter
        setFilters(prev => ({
          ...prev,
          category: selectedCategory
        }));
      })
      .catch((error) => {
        console.error("❌ Error fetching data:", error);
        setIsLoading(false);
      });
  }, [selectedCategory]);

  const [filters, setFilters] = useState({
    searchTerm: "", // For searching service name or shop name
    priceMin: "",
    priceMax: "",
    category: "", // Will be set from URL parameter
    sortBy: "rating" // Default sort option
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Apply filters to service providers
  const applyFilters = () => {
    let filteredProviders = [...allServiceProviders];

    // Filter by search term (shop name or service name)
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filteredProviders = filteredProviders.filter(provider => {
        // Check if shop name matches
        if (provider.spShopName.toLowerCase().includes(searchLower)) {
          return true;
        }

        // Check if any service name matches
        return provider.services.some(service =>
          service.serviceName.toLowerCase().includes(searchLower)
        );
      });
    }

    // Filter by category
    if (filters.category) {
      filteredProviders = filteredProviders.filter(provider => {
        // Check if provider has the selected category
        if (provider.spCategories && provider.spCategories.length > 0) {
          return provider.spCategories.some(cat =>
            cat.categoryName.toLowerCase() === filters.category.toLowerCase()
          );
        }
        return false;
      });
    }

    // Filter by price range
    if (filters.priceMin || filters.priceMax) {
      filteredProviders = filteredProviders.filter(provider => {
        // Check if any service falls within the price range
        return provider.services.some(service => {
          const price = parseFloat(service.servicePrice);
          const min = filters.priceMin ? parseFloat(filters.priceMin) : 0;
          const max = filters.priceMax ? parseFloat(filters.priceMax) : Infinity;

          return price >= min && price <= max;
        });
      });
    }

    // Sort providers based on selected option
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'priceAsc':
          // Sort by lowest service price
          filteredProviders.sort((a, b) => {
            const aMinPrice = Math.min(...a.services.map(s => parseFloat(s.servicePrice) || 0));
            const bMinPrice = Math.min(...b.services.map(s => parseFloat(s.servicePrice) || 0));
            return aMinPrice - bMinPrice;
          });
          break;
        case 'priceDesc':
          // Sort by highest service price
          filteredProviders.sort((a, b) => {
            const aMaxPrice = Math.max(...a.services.map(s => parseFloat(s.servicePrice) || 0));
            const bMaxPrice = Math.max(...b.services.map(s => parseFloat(s.servicePrice) || 0));
            return bMaxPrice - aMaxPrice;
          });
          break;
        case 'newest':
          // Sort by newest (assuming _id is somewhat chronological)
          filteredProviders.sort((a, b) => b._id.localeCompare(a._id));
          break;
        case 'rating':
        default:
          // Sort by rating (placeholder - would need actual rating data)
          break;
      }
    }

    setServiceProviders(filteredProviders);
  };

  const handleSearch = () => {
    applyFilters();
  };

  const resetFilters = () => {
    setFilters({
      searchTerm: "",
      priceMin: "",
      priceMax: "",
      category: selectedCategory, // Keep the selected category from URL
      sortBy: "rating"
    });
    setServiceProviders(allServiceProviders);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="pt-24 pb-8 bg-gradient-to-b from-emerald-900 to-emerald-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center text-white mb-4">
            Discover Local <span className="text-amber-400">Services</span>
          </h1>
          <p className="text-emerald-100 text-center text-lg max-w-3xl mx-auto">
            Find and connect with the best service providers in your area
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold text-emerald-900">
            Available Service Providers
            {serviceProviders.length > 0 && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({serviceProviders.length} found)
              </span>
            )}
          </h2>
          <div className="flex gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
            >
              <FaFilter />
              Filters {showFilters ? 'Hide' : 'Show'}
            </button>
            <select
              name="sortBy"
              value={filters.sortBy}
              onChange={(e) => {
                handleChange(e);
                // Apply sorting immediately when changed
                setFilters(prev => ({ ...prev, sortBy: e.target.value }));
                setTimeout(() => applyFilters(), 0);
              }}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="rating">Top Rated</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {/* Filters Panel */}
        <div className={`bg-white rounded-xl shadow-lg mb-8 transition-all duration-300 ${showFilters ? 'block' : 'hidden'}`}>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Services or Shops</label>
              <div className="relative">
                <input
                  type="text"
                  name="searchTerm"
                  value={filters.searchTerm}
                  onChange={(e) => {
                    handleChange(e);
                    // Apply search filter after a short delay for typing
                    setFilters(prev => ({ ...prev, searchTerm: e.target.value }));
                    setTimeout(() => applyFilters(), 300);
                  }}
                  placeholder="Search by service or shop name..."
                  className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <div className="flex gap-4">
                <div className="relative w-full">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <FaRupeeSign />
                  </span>
                  <input
                    type="number"
                    name="priceMin"
                    value={filters.priceMin}
                    onChange={(e) => {
                      handleChange(e);
                      // Apply price filter after a short delay
                      setFilters(prev => ({ ...prev, priceMin: e.target.value }));
                      setTimeout(() => applyFilters(), 500);
                    }}
                    placeholder="Min"
                    className="w-full p-3 pl-8 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="relative w-full">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <FaRupeeSign />
                  </span>
                  <input
                    type="number"
                    name="priceMax"
                    value={filters.priceMax}
                    onChange={(e) => {
                      handleChange(e);
                      // Apply price filter after a short delay
                      setFilters(prev => ({ ...prev, priceMax: e.target.value }));
                      setTimeout(() => applyFilters(), 500);
                    }}
                    placeholder="Max"
                    className="w-full p-3 pl-8 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={(e) => {
                  handleChange(e);
                  // Apply category filter immediately when changed
                  setFilters(prev => ({ ...prev, category: e.target.value }));
                  setTimeout(() => applyFilters(), 0);
                }}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category._id} value={category.categoryName}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-between gap-4">
            <div className="text-sm text-gray-500">
              {serviceProviders.length} service providers found
            </div>
            <div className="flex gap-4">
              <button
                onClick={resetFilters}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset All
              </button>
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <FaFilter className="h-4 w-4" />
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Service Providers Grid */}
        <div className="grid gap-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading service providers...</p>
            </div>
          ) : serviceProviders.length > 0 ? (
            serviceProviders.map((provider) => (
              <Link
                to={`/shop/${provider.spShopName.replace(/\s+/g, '-').toLowerCase()}?id=${provider._id}`}
                key={provider._id}
                className="block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="p-6 grid md:grid-cols-3 gap-6">
                  {/* Shop Image */}
                  <div className="relative">
                    <img
                      src={`http://localhost:4000/uploads/${provider.spShopBannerImage}`}
                      className="w-full h-64 object-cover rounded-xl"
                      alt={provider.spShopName}
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                      <FaStar className="text-amber-400" />
                      <span className="font-medium">4.5</span>
                    </div>
                  </div>

                  {/* Shop Info */}
                  <div className="md:col-span-2">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{provider.spShopName}</h3>
                        <p className="flex items-center text-gray-600 mb-4">
                          <FaMapMarkerAlt className="mr-2 text-emerald-500" />
                          {provider.spCity}, {provider.spArea}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.href = `tel:${provider.spContact}`;
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
                        >
                          <MdPhone />
                          Call
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            window.open(`https://wa.me/91${provider.spContact}`, "_blank");
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                        >
                          <FaWhatsapp />
                          WhatsApp
                        </button>
                      </div>
                    </div>

                    {/* Services Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {provider.services.length > 0 ? (
                        provider.services.slice(0, 2).map((service) => (
                          <div key={service._id} className="bg-white border border-emerald-100 rounded-lg p-3 hover:shadow-md transition-all duration-300">
                            <div className="flex gap-3">
                              {/* Service Image */}
                              <img
                                src={`http://localhost:4000/uploads/${service.serviceImage}`}
                                onError={(e) => e.target.src = 'https://via.placeholder.com/100'}
                                alt={service.serviceName}
                                className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                              />

                              {/* Service Details */}
                              <div className="flex-1">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <h4 className="font-medium text-gray-900 capitalize line-clamp-1">
                                    {service.serviceName}
                                  </h4>
                                  <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-medium">
                                    {service.serviceCategory || "General"}
                                  </span>
                                </div>

                                <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                                  {service.serviceDescription || "Professional service with quality assurance."}
                                </p>

                                <div className="flex items-center justify-between">
                                  <p className="text-lg font-bold text-emerald-600 flex items-center gap-1">
                                    <FaRupeeSign className="text-sm" />
                                    {service.servicePrice}
                                  </p>
                                  <div className="flex items-center gap-1 text-sm">
                                    <FaStar className="text-amber-400" />
                                    <span className="font-medium">4.5</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 col-span-2 text-center py-4 bg-gray-50 rounded-lg">
                          No services available
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
              <FaCheckCircle className="text-gray-400 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Service Providers Found</h3>
              <p className="text-gray-500">
                There are no service providers available for this category at the moment.
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default User_Dashboard;
