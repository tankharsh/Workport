/* eslint-disable react/prop-types */
import  { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";

const RecentlyCategories = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/api/services/latest-services")
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
    <div className="h-auto md:mt-6">
      <h1 className="bg-txt text-center mt-5 text-3xl sm:text-4xl lg:text-5xl font-semibold">
        Recently Added
      </h1>
      <div className="p-12 flex flex-wrap gap-10 justify-center items-center">
        {loading ? (
          <p>Loading...</p>
        ) : services.length > 0 ? (
          services.map((service) => <RcCat key={service._id} service={service} />)
        ) : (
          <p>No services found.</p>
        )}
      </div>
    </div>
  );
};

// const RcCat = ({ service }) => {
//   return (
//     <div className="w-64 bg-white rounded-xl hover:scale-105 duration-300 shadow-lg overflow-hidden cursor-pointer">
//       <div className="flex justify-center">
//         <div className="w-64 h-40 overflow-hidden border-4 border-pink-100 shadow-md">
//           <img
//             src={`http://localhost:4000/uploads/${service.services_img}`}
//             alt={service.services_name}
//             className="w-full h-full object-cover"
//           />
//         </div>
//       </div>
//       <div className="px-4 py-4 text-center">
//         <h2 className="text-xl font-bold text-[#2F3E46] mb-2">
//           {service.services_name}
//         </h2>
//         <p className="text-sm text-gray-600 mb-2">{service.services_description}</p>
//         <p className="text-sm font-semibold text-blue-500">{service.categoryName}</p>
//         <p className="text-sm text-gray-700">Duration: {service.services_duration}</p>
//         <p className="text-lg font-bold text-green-600">₹{service.services_price}</p>
//         <p className="text-sm font-medium text-gray-500">Shop: {service.sp_shop_name}</p>
//       </div>
//     </div>
//   );
// };


const RcCat = ({ service }) => {
  // console.log(service);
  return (
    <div className="max-w-sm bg-white rounded-xl shadow-lg w-4/12 overflow-hidden border border-gray-200">
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
        <h2 className="text-xl font-bold text-gray-800">{service.services_name}</h2>

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
<p className="text-sm text-gray-600 text-justify break-words "> {service.services_description}</p>

        {/* Additional Info */}
        <div className="mt-4">
          <h3 className="text-gray-700 font-semibold">Category: {service.categoryId.categoryName}</h3>
          <p className="text-sm text-gray-600">Duration: {service.services_duration}</p>
          <p className="text-lg font-bold text-green-600">₹{service.services_price}</p>
          <p className="text-sm text-gray-500">Shop: {service.service_provider.sp_shop_name}</p>
        </div>

        {/* Tags / Items */}
        {/* <div className="flex flex-wrap mt-4">
          <span className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full mr-2">
            Item 1
          </span>
          <span className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full mr-2">
            Item 2
          </span>
          <span className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full mr-2">
            Item 3
          </span>
          <span className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
            Item 4
          </span>
        </div> */}

        {/* Action Link */}
        {/* <div className="mt-4 text-indigo-600 font-bold cursor-pointer">
          ACTION 1
        </div> */}
      </div>
    </div>
  );
};




// export default RcCat;


export default RecentlyCategories;