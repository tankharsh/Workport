// import { useState, useEffect } from "react";
// import Sidebar from "../../components/sp_components/Sidebar";

// const AddServicePopup = () => {
//   const [showPopup, setShowPopup] = useState(false);
//   const storedUser = JSON.parse(localStorage.getItem("SP_LoggedInUser"));
//   const [services, setServices] = useState([]);
//   const [categories, setCategories] = useState([]);

//   const [formData, setFormData] = useState({
//     services_name: "",
//     services_price: "",
//     services_description: "",
//     services_duration: "",
//     categoryId: "",
//     service_provider: storedUser?.id || "",
//     services_img: null,
//   });

//   useEffect(() => {
//     if (!storedUser || !storedUser.id) {
//       alert("Error: Service provider not found. Please log in again.");
//       return;
//     }

//     setFormData((prev) => ({
//       ...prev,
//       service_provider: storedUser.id,
//     }));

//     // Fetch categories
//     const fetchCategories = async () => {
//       try {
//         const response = await fetch("http://localhost:4000/api/categories");
//         const data = await response.json();
//         setCategories(data);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };
//     fetchCategories();

//     // Fetch services for the logged-in service provider
//     const fetchServices = async () => {
//       try {
//         const response = await fetch("http://localhost:4000/api/services/");
//         const data = await response.json();
//         const filteredServices = data.filter(
//           (service) => service.service_provider._id === storedUser.id
//         );
//         setServices(filteredServices);
//       } catch (error) {
//         console.error("Error fetching services:", error);
//       }
//     };
//     fetchServices();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: files ? files[0] : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.service_provider) {
//       alert("Error: Service provider ID is missing.");
//       return;
//     }

//     try {
//       const formDataToSend = new FormData();
//       for (const key in formData) {
//         formDataToSend.append(key, formData[key]);
//       }

//       const response = await fetch("http://localhost:4000/api/services/add-service", {
//         method: "POST",
//         body: formDataToSend,
//       });

//       if (response.ok) {
//         alert("Service added successfully!");
//         setShowPopup(false);
//         window.location.reload(); // Reload to update the table
//       } else {
//         const errorData = await response.json();
//         alert(`Error: ${errorData.message}`);
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       alert("Failed to add service. Please try again.");
//     }
//   };

//   return (
//     <>
//       <Sidebar />
//       <main className="flex-1 lg:ml-64 mt-20">
//       <div className="p-8">
//         <button
//           onClick={() => setShowPopup(true)}
//           className="bg-purple-600 text-white px-4 py-2 rounded-lg mb-4"
//         >
//           Add Service
//         </button>


//         {/* Services Table */}
//         <table className="w-full border bg-[#354f52] border-gray-300 mt-4">
//           <thead>
//             <tr className="bg-[#354f52]">
//               <th className="border p-2">Service Name</th>
//               <th className="border p-2">Price</th>
//               <th className="border p-2">Duration</th>
//               <th className="border p-2">Category</th>
//               <th className="border p-2">Image</th>
//             </tr>
//           </thead>
//           <tbody>
//             {services.map((service) => (
//               <tr key={service._id} className="text-center">
//                 <td className="border p-2">{service.services_name}</td>
//                 <td className="border p-2">{service.services_price}</td>
//                 <td className="border p-2">{service.services_duration}</td>
//                 <td className="border p-2">{service.categoryId?.categoryName || "N/A"}</td>
//                 <td className="border p-2">
//                   <img
//                     src={`http://localhost:4000/uploads/${service.services_img}`}
//                     alt="Service"
//                     className="w-16 h-16 object-cover mx-auto"
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>


//         {showPopup && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//             <div className="bg-white p-8 rounded-lg w-full max-w-lg">
//               <h2 className="text-2xl mb-4 text-black">Add Service</h2>
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <input type="text" name="services_name" value={formData.services_name} onChange={handleChange} placeholder="Service Name" className="w-full p-2 border rounded text-black" required />
//                 <input type="number" name="services_price" value={formData.services_price} onChange={handleChange} placeholder="Service Price" className="w-full p-2 border rounded text-black" required />
//                 <textarea name="services_description" value={formData.services_description} onChange={handleChange} placeholder="Service Description" className="w-full p-2 border rounded text-black" required />
//                 <input type="text" name="services_duration" value={formData.services_duration} onChange={handleChange} placeholder="Service Duration" className="w-full p-2 border rounded text-black" required />
//                 <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full p-2 border rounded text-black" required>
//                   <option value="">Select Category</option>
//                   {categories.map((category) => (
//                     <option key={category._id} value={category._id}>{category.categoryName}</option>
//                   ))}
//                 </select>
//                 <input type="file" name="services_img" onChange={handleChange} className="w-full p-2 border rounded text-black" required />
//                 <div className="flex justify-end gap-4">
//                   <button type="button" onClick={() => setShowPopup(false)} className="bg-gray-400 text-black px-4 py-2 rounded-lg">Cancel</button>
//                   <button type="submit" className="bg-purple-600 text-black px-4 py-2 rounded-lg">Submit</button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//       </div>
//       </main>
//     </>
//   );
// };

// export default AddServicePopup;



import { useState, useEffect } from "react";
import Sidebar from "../src/components/sp_components/Sidebar";

const AddServicePopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const storedUser = JSON.parse(localStorage.getItem("SP_LoggedInUser"));
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editServiceId, setEditServiceId] = useState(null);

  const [formData, setFormData] = useState({
    services_name: "",
    services_price: "",
    services_description: "",
    services_duration: "",
    categoryId: "",
    service_provider: storedUser?.id || "",
    services_img: null,
  });

  useEffect(() => {
    if (!storedUser || !storedUser.id) {
      alert("Error: Service provider not found. Please log in again.");
      return;
    }

    setFormData((prev) => ({ ...prev, service_provider: storedUser.id }));

    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();

    const fetchServices = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/services/");
        const data = await response.json();
        const filteredServices = data.filter(
          (service) => service.service_provider._id === storedUser.id
        );
        setServices(filteredServices);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.service_provider) {
      alert("Error: Service provider ID is missing.");
      return;
    }
  
    // 📝 Prepare form data
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }
  
    // 🌐 API URL for Add or Update
    const url = isEditing
      ? `http://localhost:4000/api/services/update/${editServiceId}`
      : "http://localhost:4000/api/services/add-service";
  
    try {
      // 🚀 Send API request
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        body: formDataToSend,
      });
  
      const result = await response.json();
  
      if (response.ok) {
        if (isEditing) {
          setServices((prevServices) =>
            prevServices.map((service) =>
              service._id === editServiceId ? { ...service, ...result.updatedService } : service
            )
          );
        
        } else {
          // ➕ Fetch all services after adding a new service
          const res = await fetch("http://localhost:4000/api/services/");
          const data = await res.json();
          setServices(
            data.filter((service) => service.service_provider._id === storedUser.id)
          );
        }
  
        // 🎉 Success alert
        alert(isEditing ? "Service updated successfully!" : "Service added successfully!");
  
        // 🔄 Reset form and state
        setShowPopup(false);
        setIsEditing(false);
         // ✅ Ensure `service_provider` is always set
  setFormData((prev) => ({
    ...prev,
    services_name: result.updatedService.services_name,
    services_price: result.updatedService.services_price,
    services_description: result.updatedService.services_description,
    services_duration: result.updatedService.services_duration,
    categoryId: result.updatedService.categoryId?._id || "",
    service_provider: result.updatedService.service_provider?._id || storedUser?.id || "",
    services_img: result.updatedService.services_img,
  }));
        
      } else {
        // ❌ Error alert from server
        alert(`Error: ${result.message}`);
      }
  
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit service. Please try again.");
    }
  };
  
  


  const handleEdit = (service) => {
    setFormData({
      services_name: service.services_name,
      services_price: service.services_price,
      services_description: service.services_description,
      services_duration: service.services_duration,
      categoryId: service.categoryId?._id || "",
      service_provider: service.service_provider._id,
      services_img: service.services_img, // Store existing image
    });

    setEditServiceId(service._id);
    setIsEditing(true);
    setShowPopup(true);
  };


  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        const response = await fetch(`http://localhost:4000/api/services/delete/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Service deleted successfully!");

          // Update state to remove deleted service from UI
          setServices((prevServices) => prevServices.filter((service) => service._id !== id));
        } else {
          const errorData = await response.json();
          alert(`Failed to delete service: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Error deleting service:", error);
        alert("Failed to delete service. Please try again.");
      }
    }
  };


  return (
    <>
      <Sidebar />
      <main className="flex-1 lg:ml-64 mt-20">
        <div className="p-8">
          <button
            onClick={() => {
              setShowPopup(true);
              setIsEditing(false);
              setFormData({
                services_name: "",
                services_price: "",
                services_description: "",
                services_duration: "",
                categoryId: "",
                service_provider: storedUser?.id || "",
                services_img: null,
              });
            }}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg mb-4"
          >
            Add Service
          </button>

          <table className="w-full border bg-[#354f52] border-gray-300 mt-4">
            <thead>
              <tr className="bg-[#354f52]">
                <th className="border p-2">Name</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Duration</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Image</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service._id} className="text-center">
                  <td className="border p-2">{service.services_name}</td>
                  <td className="border p-2">{service.services_price}</td>
                  <td className="border p-2">{service.services_duration}</td>
                  <td className="border p-2">{service.categoryId?.categoryName || "N/A"}</td>
                  <td className="border p-2"><img src={`http://localhost:4000/uploads/${service.services_img}`} alt="Service" className="w-16 h-16 object-cover mx-auto" /></td>
                  <td className="border p-2">
                    <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleEdit(service)}>Edit</button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(service._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg w-full max-w-lg">
              <h2 className="text-2xl mb-4 text-black">Add Service</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="services_name" value={formData.services_name} onChange={handleChange} placeholder="Service Name" className="w-full p-2 border rounded text-black" required />
                <input type="number" name="services_price" value={formData.services_price} onChange={handleChange} placeholder="Service Price" className="w-full p-2 border rounded text-black" required />
                <textarea name="services_description" value={formData.services_description} onChange={handleChange} placeholder="Service Description" className="w-full p-2 border rounded text-black" required />
                <input type="text" name="services_duration" value={formData.services_duration} onChange={handleChange} placeholder="Service Duration" className="w-full p-2 border rounded text-black" required />
                <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full p-2 border rounded text-black" required>
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>{category.categoryName}</option>
                  ))}
                </select>
                {formData.services_img && (
                  <div className="mb-4">
                    <img
                      src={`http://localhost:4000/uploads/${formData.services_img}`}
                      alt="Service"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                )}
                <input type="file" name="services_img" onChange={handleChange} className="w-full p-2 border rounded text-black" />
                <div className="flex justify-end gap-4">
                  <button type="button" onClick={() => setShowPopup(false)} className="bg-gray-400 text-black px-4 py-2 rounded-lg">Cancel</button>
                  <button type="submit" className="bg-purple-600 text-black px-4 py-2 rounded-lg">Submit</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default AddServicePopup;
