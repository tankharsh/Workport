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

  const [formData, setFormData] = useState({
    services_name: "",
    services_price: "",
    services_description: "",
    services_duration: "",
    categoryId: "",
    service_provider: storedUser?.id || "", // ✅ Ensure service_provider is always set
    services_img: null,
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

    console.log("🔹 Submitting Form Data:", formData); // ✅ Debugging log

    if (!formData.service_provider) {
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
      if (key === "services_img" && formData[key] instanceof File) {
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
            data.filter((service) => service.service_provider._id === storedUser.id)
          );
        }

        Swal.fire({
          icon: "success",
          title: "Success",
          text: isEditing ? "Service updated successfully!" : "Service added successfully!",
        });

        setShowPopup(false);
        setIsEditing(false);

        // ✅ Ensure service_provider is always retained
        setFormData({
          services_name: "",
          services_price: "",
          services_description: "",
          services_duration: "",
          categoryId: "",
          service_provider: storedUser?.id || "",
          services_img: null,
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
      services_name: service.services_name,
      services_price: service.services_price,
      services_description: service.services_description,
      services_duration: service.services_duration,
      categoryId: service.categoryId?._id || "",
      service_provider: service.service_provider?._id || storedUser?.id || "", // ✅ Ensure service_provider is set
      services_img: service.services_img,
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
                services_name: "",
                services_price: "",
                services_description: "",
                services_duration: "",
                categoryId: "",
                service_provider: storedUser?.id || "",
                services_img: null,
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
              <th className="border text-white p-2">Name</th>
              <th className="border text-white p-2">Price</th>
              <th className="border text-white p-2">Duration</th>
              <th className="border text-white p-2">Category</th>
              <th className="border text-white p-2">Image</th>
              <th className="border text-white p-2">Actions</th>
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

        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg w-full max-w-lg">
              <h2 className="text-2xl mb-4 text-black">{isEditing ? "Edit Service" : "Add Service"}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">

                <input
                  type="text"
                  name="services_name"
                  value={formData.services_name}
                  onChange={handleChange}
                  placeholder="Service Name"
                  className="w-full p-2 border rounded text-black"
                  required
                />

                <input
                  type="number"
                  name="services_price"
                  value={formData.services_price}
                  onChange={handleChange}
                  placeholder="Service Price"
                  className="w-full p-2 border rounded text-black"
                  required
                />

                <textarea
                  name="services_description"
                  value={formData.services_description}
                  onChange={handleChange}
                  placeholder="Service Description"
                  className="w-full p-2 border rounded text-black"
                  required
                />

                <input
                  type="text"
                  name="services_duration"
                  value={formData.services_duration}
                  onChange={handleChange}
                  placeholder="Service Duration"
                  className="w-full p-2 border rounded text-black"
                  required
                />

                <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full p-2 border rounded text-black" required>
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>{category.categoryName}</option>
                  ))}
                </select>

                {isEditing ? (formData.services_img && (
                  <div className="mb-4">
                    <img
                      src={`http://localhost:4000/uploads/${formData.services_img}`}
                      alt="Service"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                )) : ""}

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
