import { useState, useEffect } from "react";
import Sidebar from "../../components/sp_components/Sidebar";

const AddServicePopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const storedUser = JSON.parse(localStorage.getItem("SP_LoggedInUser"));
  const [useid, setUseid] = useState(storedUser?.id || "");

  const [formData, setFormData] = useState({
    services_name: "",
    services_price: "",
    services_description: "",
    services_duration: "",
    categoryId: "",
    service_provider: storedUser?.id || "",
    services_img: null,
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!storedUser || !storedUser.id) {
      alert("Error: Service provider not found. Please log in again.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      service_provider: storedUser.id,
    }));

    // Fetch categories
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

    console.log("Form Data: ", formData);

    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      const response = await fetch("http://localhost:4000/api/services/add", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        alert("Service added successfully!");
        setShowPopup(false);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to add service. Please try again.");
    }
  };

  return (
    <>
      <Sidebar />
      <div className="flex justify-center items-center p-80">
        <button
          onClick={() => setShowPopup(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg"
        >
          Add Service
        </button>

        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg w-full max-w-lg">
              <h2 className="text-2xl mb-4 text-black">Add Service</h2>
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
                  placeholder="Service Duration (e.g., 2 hours)"
                  className="w-full p-2 border rounded text-black"
                  required
                />

                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full p-2 border rounded text-black"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id} className="text-black">
                      {category.categoryName}
                    </option>
                  ))}
                </select>

                <input
                  type="file"
                  name="services_img"
                  onChange={handleChange}
                  className="w-full p-2 border rounded text-black"
                  required
                />

                <input type="hidden" name="service_provider" value={formData.service_provider} />

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowPopup(false)}
                    className="bg-gray-400 text-black px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="bg-purple-600 text-black px-4 py-2 rounded-lg">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AddServicePopup;
