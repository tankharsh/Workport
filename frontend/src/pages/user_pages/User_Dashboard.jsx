import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/user_components/Navbar";
import Footer from "../../components/user_components/Footer";
import { FaRupeeSign } from "react-icons/fa";
import { MdPhone } from "react-icons/md";
import { FaCheckCircle, FaWhatsapp } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import VerificationModal from "../../components/user_components/VerificationModal";

const User_Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceProviders, setServiceProviders] = useState([]);

  // Fetch data from API
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/services") // Change API URL as needed
      .then((response) => {
        console.log("full api: ",response.data); // Check the response format
        setServiceProviders(response.data || []); // Ensure it’s always an array
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <>
      <Navbar />
      <div className="w-full text-white text-3xl font-bold p-4 mt-2">
        <h1 className="text-center">Service Providers</h1>

        {serviceProviders.length > 0 ? (
          serviceProviders.map((provider, index) => (
            <div
              key={index}
              className="bg-gray-200 w-full max-w-5xl mx-auto text-black p-4 rounded-lg shadow-md flex flex-col md:flex-row gap-6 mt-6"
            >
              {/* Shop Banner */}
              <img
                src={`http://localhost:4000/${provider.service_provider.sp_shop_banner_img}`}
                className="bg-gray-300 w-full md:w-72 md:h-64 object-cover rounded-lg"
                alt={provider.sp_shop_name}
              />

              {/* Provider Details */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold">
                  {provider.service_provider.sp_shop_name}
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  {provider.service_provider.sp_city},{" "}
                  {provider.service_provider.sp_area}
                </p>

                {/* Services List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
                  {provider.services ? (
                    Array.isArray(provider.services) ? (
                      provider.services.map((service, i) => (
                        <div
                          key={i}
                          className="bg-white border border-gray-300 p-3 text-center text-lg rounded-lg"
                        >
                          <p className="font-semibold">
                            {service?.services_name || "No Name"}
                          </p>
                          <p className="text-gray-700 font-bold flex justify-center items-center gap-1">
                            <FaRupeeSign /> {service?.services_price || "N/A"}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {service?.services_description || "No Description"}
                          </p>
                          <p className="text-gray-700 font-semibold">
                            Duration:{" "}
                            {service?.services_duration
                              ? `${service.services_duration} days`
                              : "N/A"}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white border border-gray-300 p-3 text-center text-lg rounded-lg">
                        <p className="font-semibold">
                          {provider.services.services_name || "No Name"}
                        </p>
                        <p className="text-gray-700 font-bold flex justify-center items-center gap-1">
                          <FaRupeeSign />{" "}
                          {provider.services.services_price || "N/A"}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {provider.services.services_description ||
                            "No Description"}
                        </p>
                        <p className="text-gray-700 font-semibold">
                          Duration:{" "}
                          {provider.services.services_duration
                            ? `${provider.services.services_duration} days`
                            : "N/A"}
                        </p>
                      </div>
                    )
                  ) : (
                    <p className="text-center text-gray-500 col-span-3">
                      No services available
                    </p>
                  )}
                </div>

                {/* Contact Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
                  <NavLink className="relative flex h-[50px] w-40 items-center justify-center overflow-hidden bg-blue-800 hover:shadow-blue-600 text-white shadow-2xl transition-all rounded-lg">
                    <span className="relative z-10 text-lg flex justify-center items-center gap-2">
                      <MdPhone /> {provider.service_provider.sp_contact}
                    </span>
                  </NavLink>

                  <NavLink className="relative flex h-[50px] w-40 items-center justify-center overflow-hidden bg-green-600 hover:shadow-green-700 text-white shadow-2xl transition-all rounded-lg">
                    <span className="relative z-10 text-lg flex justify-center items-center gap-2">
                      <FaWhatsapp /> Whatsapp
                    </span>
                  </NavLink>

                  <NavLink
                    onClick={() => setIsModalOpen(true)}
                    className="relative flex h-[50px] w-44 items-center justify-center overflow-hidden bg-yellow-500 hover:shadow-yellow-600 text-white shadow-2xl transition-all rounded-lg"
                  >
                    <span className="relative z-10 text-lg flex justify-center items-center gap-2">
                      <FaCheckCircle /> Check Inquiry
                    </span>
                  </NavLink>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-6">
            Loading service providers...
          </p>
        )}
      </div>

      <VerificationModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <Footer />
    </>
  );
};

export default User_Dashboard;
