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
    <div className="min-h-screen pt-8 bg-gray-50">
      <Sidebar />
      <div className="lg:ml-64">
        {/* Fixed Header */}
        <div className="fixed top-0 right-0 lg:left-64 left-0 bg-white z-10 border-b">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">My Services</h2>
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
                className="bg-emerald-600 mt-4 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors duration-200 flex items-center gap-2"
              >
                <span className="text-xl">+</span> Add New Service
              </button>
            </div>
          </div>
        </div>

        {/* Main Content with Padding for Fixed Header */}
        <main className="pt-24 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div
                  key={service._id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  {service.serviceImage && (
                    <div className="relative h-48">
                      <img
                        src={`http://localhost:4000/uploads/${service.serviceImage}`}
                        alt={service.serviceName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.serviceName}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.serviceDescription}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-emerald-600 font-bold text-lg">₹{service.servicePrice}</span>
                      <span className="text-gray-500 text-sm">{service.serviceDuration}</span>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(service)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(service._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Add/Edit Service Popup */}
        {showPopup && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-800">
                  {isEditing ? "Edit Service" : "Add New Service"}
                </h3>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                    <input
                      type="text"
                      name="serviceName"
                      value={formData.serviceName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      name="servicePrice"
                      value={formData.servicePrice}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="serviceDescription"
                      value={formData.serviceDescription}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <input
                      type="text"
                      name="serviceDuration"
                      value={formData.serviceDuration}
                      onChange={handleChange}
                      placeholder="e.g., 1 hour"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories && categories.length > 0 ? (
                        categories.map((category) => {
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Image</label>
                    <input
                      type="file"
                      name="serviceImage"
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      accept="image/*"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowPopup(false)}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                  >
                    {isEditing ? "Update" : "Add"} Service
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddServicePopup;
