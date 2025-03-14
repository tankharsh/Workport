import { useState, useEffect } from "react";
import Sidebar from "../../components/sp_components/Sidebar";
import Swal from "sweetalert2";

const AddServicePopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const storedUser = JSON.parse(localStorage.getItem("SP_LoggedInUser"));
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editServiceId, setEditServiceId] = useState(null);

  const providerId = storedUser ? storedUser.id : null;


  const [formData, setFormData] = useState({
    serviceName: "",
    servicePrice: "",
    serviceDescription: "",
    serviceDuration: "",
    categoryId: "",
    serviceProviderId: storedUser?.id || "", // ✅ Ensure service_provider is always set
    serviceImage: null,
  });

  useEffect(() => {
    if (!storedUser || !storedUser.id) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Service provider not found. Please log in again.",
      });
      return;
    }
    

    setFormData((prev) => ({ ...prev, serviceProviderId: storedUser.id }));

    const fetchCategories = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/sp/providers/${providerId}`);
        const data = await response.json();

        if (data.provider && data.provider.category) {
            setCategories(data.provider.category); // Only setting provider's categories
        }
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
          (service) => service.serviceProviderId._id === storedUser.id
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
  
    console.log("🔹 Submitting Form Data:", formData); // ✅ Debugging log
  
    if (!formData.serviceProviderId) {
      console.error("❌ Error: Service provider ID is missing.");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Service provider ID is missing.",
      });
      return;
    }
  
    const formDataToSend = new FormData();
    for (const key in formData) {
      if (key === "serviceImage" && formData[key] instanceof File) {
        formDataToSend.append(key, formData[key]);
      } else {
        formDataToSend.append(key, formData[key]);
      }
    }
  
    const url = isEditing
      ? `http://localhost:4000/api/services/update/${editServiceId}`
      : "http://localhost:4000/api/services/add-service";
  
    try {
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
          const res = await fetch("http://localhost:4000/api/services/");
          const data = await res.json();
          setServices(
            data.filter((service) => service.serviceProviderId._id === storedUser.id)
          );
        }
  
        Swal.fire({
          icon: "success",
          title: "Success",
          text: isEditing ? "Service updated successfully!" : "Service added successfully!",
        });
  
        setShowPopup(false);
        setIsEditing(false);
  
        // ✅ Ensure serviceProviderId is always retained
        setFormData({
          serviceName: "",
          servicePrice: "",
          serviceDescription: "",
          serviceDuration: "",
          categoryId: "",
          serviceProviderId: storedUser?.id || "",
          serviceImage: null,
        });
  
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message,
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to submit service. Please try again.",
      });
    }
  };
  

  const handleEdit = (service) => {
    console.log("📝 Editing Service:", service); // ✅ Debugging log

    setFormData({
      serviceName: service.serviceName,
      servicePrice: service.servicePrice,
      serviceDescription: service.serviceDescription,
      serviceDuration: service.serviceDuration,
      categoryId: service.categoryId?._id || "",
      serviceProviderId: service.serviceProviderId?._id || storedUser?.id || "", // ✅ Ensure service_provider is set
      serviceImage: service.serviceImage,
    });

    setEditServiceId(service._id);
    setIsEditing(true);
    setShowPopup(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
  
    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:4000/api/services/delete/${id}`, {
          method: "DELETE",
        });
  
        if (response.ok) {
          Swal.fire("Deleted!", "Service has been deleted.", "success");
  
          // Update state to remove deleted service from UI
          setServices((prevServices) => prevServices.filter((service) => service._id !== id));
        } else {
          const errorData = await response.json();
          Swal.fire("Error!", `Failed to delete service: ${errorData.message}`, "error");
        }
      } catch (error) {
        console.error("Error deleting service:", error);
        Swal.fire("Error!", "Failed to delete service. Please try again.", "error");
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
                serviceName: "",
                servicePrice: "",
                serviceDescription: "",
                serviceDuration: "",
                categoryId: "",
                serviceProviderId: storedUser?.id || "",
                serviceImage: null,
              });
            }}
            className="bg-purple-600 text-white float-right px-4 py-2 rounded-lg mb-4"
          >
            Add Service
          </button>
        </div>


           {/* Services Table */}
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
                  <td className="border p-2">{service.serviceName}</td>
                  <td className="border p-2">{service.servicePrice}</td>
                  <td className="border p-2">{service.serviceDuration}</td>
                  <td className="border p-2">{service.categoryId?.categoryName || "N/A"}</td>
                  <td className="border p-2"><img src={`http://localhost:4000/uploads/${service.serviceImage}`} alt="Service" className="w-16 h-16 object-cover mx-auto" /></td>
                  <td className="border p-2">
                    <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleEdit(service)}>Edit</button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(service._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg w-full max-w-lg">
              <h2 className="text-2xl mb-4 text-black">{isEditing ? "Edit Service" : "Add Service"}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="serviceName" value={formData.serviceName} onChange={handleChange} placeholder="Service Name" className="w-full p-2 border rounded text-black" required />
                <input type="number" name="servicePrice" value={formData.servicePrice} onChange={handleChange} placeholder="Service Price" className="w-full p-2 border rounded text-black" required />
                <textarea name="serviceDescription" value={formData.serviceDescription} onChange={handleChange} placeholder="Service Description" className="w-full p-2 border rounded text-black" required />
                <input type="text" name="serviceDuration" value={formData.serviceDuration} onChange={handleChange} placeholder="Service Duration" className="w-full p-2 border rounded text-black" required />
                <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full p-2 border rounded text-black" required>
                  <option value="" >Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>{category.categoryName}</option>
                  ))}
                </select>

                {isEditing ? (formData.serviceImage && (
                  <div className="mb-4">
                    <img
                      src={`http://localhost:4000/uploads/${formData.serviceImage}`}
                      alt="Service"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                ))   : ""}
                
                <input type="file" name="serviceImage" onChange={handleChange} className="w-full p-2 border rounded text-black" />
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
