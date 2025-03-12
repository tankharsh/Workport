import { useState, useEffect } from "react";
import Sidebar from "../../components/sp_components/Sidebar";
import Swal from "sweetalert2";

const AddServicePopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const storedUser = JSON.parse(localStorage.getItem("serviceProvider"));
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
    serviceProviderId: storedUser?.id || "",
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
        // First, try to get the provider data which includes categories
        const response = await fetch(`http://localhost:4000/api/sp/providers/${storedUser.id}`);
        const data = await response.json();
        
        console.log("Full provider data:", data.provider);
        
        // Check different possible structures
        if (data.provider) {
          if (Array.isArray(data.provider.spCategories) && data.provider.spCategories.length > 0) {
            console.log("Found categories in spCategories:", data.provider.spCategories);
            setCategories(data.provider.spCategories);
          } else if (Array.isArray(data.provider.category) && data.provider.category.length > 0) {
            console.log("Found categories in category:", data.provider.category);
            setCategories(data.provider.category);
          } else {
            // If no categories found in provider data, try to fetch all categories
            console.log("No categories found in provider data, fetching all categories");
            const catResponse = await fetch("http://localhost:4000/api/categories");
            const catData = await catResponse.json();
            
            if (Array.isArray(catData) && catData.length > 0) {
              console.log("Fetched all categories:", catData);
              setCategories(catData);
            } else {
              console.error("No categories found anywhere");
              setCategories([]);
            }
          }
        } else {
          console.error("Provider data not found");
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };
    fetchCategories();

    const fetchServices = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/services/");
        const data = await response.json();
        const filteredServices = data.filter(
          (service) => service.serviceProviderId?._id === storedUser.id
        );
        setServices(filteredServices);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, [storedUser?.id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "serviceImage" && files && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!storedUser?.id) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "User ID not found. Please log in again.",
      });
      return;
    }

    console.log("Form data before submission:", formData);
    console.log("Selected category ID:", formData.categoryId);

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (key === "serviceImage" && formData[key] instanceof File) {
        formDataToSend.append(key, formData[key]);
      } else {
        formDataToSend.append(key, formData[key]);
      }
    }

    console.log("FormData entries:");
    for (let pair of formDataToSend.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
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
            data.filter((service) => service.serviceProviderId?._id === storedUser.id)
          );
        }

        Swal.fire({
          icon: "success",
          title: "Success",
          text: isEditing ? "Service updated successfully!" : "Service added successfully!",
        });

        setShowPopup(false);
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
    setIsEditing(true);
    setEditServiceId(service._id);
    setFormData({
      serviceName: service.serviceName,
      servicePrice: service.servicePrice,
      serviceDescription: service.serviceDescription,
      serviceDuration: service.serviceDuration,
      categoryId: service.categoryId,
      serviceProviderId: storedUser?.id || "",
      serviceImage: null,
    });
    setShowPopup(true);
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const response = await fetch(`http://localhost:4000/api/services/delete/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setServices((prevServices) =>
            prevServices.filter((service) => service._id !== id)
          );
          Swal.fire("Deleted!", "Your service has been deleted.", "success");
        } else {
          Swal.fire("Error!", "Failed to delete service.", "error");
        }
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      Swal.fire("Error!", "Failed to delete service.", "error");
    }
  };

  return (
    <main className="flex-1 lg:ml-64 py-2 mt-20">
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">My Services</h2>
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
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            Add New Service
          </button>
        </div>

        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">
                {isEditing ? "Edit Service" : "Add New Service"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Service Name</label>
                  <input
                    type="text"
                    name="serviceName"
                    value={formData.serviceName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Price</label>
                  <input
                    type="number"
                    name="servicePrice"
                    value={formData.servicePrice}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Description</label>
                  <textarea
                    name="serviceDescription"
                    value={formData.serviceDescription}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Duration</label>
                  <input
                    type="text"
                    name="serviceDuration"
                    value={formData.serviceDuration}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Category</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories && categories.length > 0 ? (
                      categories.map((category) => {
                        // Handle different possible category structures
                        const categoryId = category._id || category.categoryId;
                        const categoryName = category.name || category.categoryName;
                        
                        return (
                          <option key={categoryId} value={categoryId}>
                            {categoryName}
                          </option>
                        );
                      })
                    ) : (
                      <option value="" disabled>No categories available</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Service Image</label>
                  <input
                    type="file"
                    name="serviceImage"
                    onChange={handleChange}
                    className="w-full"
                    accept="image/*"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowPopup(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    {isEditing ? "Update" : "Add"} Service
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service._id}
              className="bg-white p-4 rounded-lg shadow-md"
            >
              {service.serviceImage && (
                <img
                  src={`http://localhost:4000/uploads/${service.serviceImage}`}
                  alt={service.serviceName}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}
              <h3 className="text-xl font-semibold mb-2">{service.serviceName}</h3>
              <p className="text-gray-600 mb-2">{service.serviceDescription}</p>
              <p className="text-purple-600 font-semibold mb-2">
                ₹{service.servicePrice}
              </p>
              <p className="text-gray-500 mb-4">{service.serviceDuration}</p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(service._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </main>
  );
};

export default AddServicePopup;
