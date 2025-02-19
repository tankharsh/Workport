import React, { useState } from 'react';
import Sidebar from '../../components/sp_components/Sidebar';
import { FaPlus } from "react-icons/fa6";
import { MdAccessTime, MdDriveFileRenameOutline, MdImage, MdEdit, MdDelete } from "react-icons/md";
import { FaRupeeSign } from "react-icons/fa";

const Addservice = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [image, setImage] = useState(null);
  const [serviceName, setServiceName] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!serviceName || !selectedService || !duration || !price || !image) return;
    
    if (editingService) {
      setServices(services.map(service => 
        service.id === editingService.id ? { ...editingService, serviceName, selectedService, duration, price, image } : service
      ));
      setEditingService(null);
    } else {
      const newService = {
        id: Date.now(),
        serviceName,
        selectedService,
        duration,
        price,
        image,
      };
      setServices([...services, newService]);
    }
    
    setShowPopup(false);
    setServiceName("");
    setSelectedService("");
    setDuration("");
    setPrice("");
    setImage(null);
  };

  const handleDelete = (id) => {
    setServices(services.filter(service => service.id !== id));
  };

  const handleEdit = (service) => {
    setServiceName(service.serviceName);
    setSelectedService(service.selectedService);
    setDuration(service.duration);
    setPrice(service.price);
    setImage(service.image);
    setEditingService(service);
    setShowPopup(true);
  };

  return (
    <>
      <Sidebar />
      <main className="flex-1 lg:ml-64 min-h-screen mt-16 p-4">
        <div className="flex flex-col items-center justify-start min-h-screen">
          <button
            onClick={() => setShowPopup(true)}
            className="px-4 py-2 flex items-center justify-center gap-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
          >
            <FaPlus /> {editingService ? "Edit Service" : "Add Service"}
          </button>

          {showPopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
                <h2 className="text-xl font-semibold text-black mb-4">{editingService ? "Edit Service" : "Add New Service"}</h2>
                <form onSubmit={handleSubmit}>
                  <div className="flex items-center border border-gray-700 p-2 rounded-md">
                    <MdDriveFileRenameOutline className="text-gray-500 mr-3" />
                    <input
                      type="text"
                      placeholder="Enter your service name"
                      className="w-full outline-none text-black placeholder:text-gray-700"
                      value={serviceName}
                      onChange={(e) => setServiceName(e.target.value)}
                    />
                  </div>

                  <div className="flex mt-3 items-center border border-gray-700 p-2 rounded-md">
                    <select
                      className="w-full outline-none text-black bg-white"
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                    >
                      <option value="" disabled>Select your service</option>
                      <option value="photography">Photography</option>
                      <option value="videography">Videography</option>
                      <option value="editing">Editing</option>
                    </select>
                  </div>

                  <div className="flex mt-3 items-center border border-gray-700 p-2 rounded-md">
                    <MdAccessTime className="text-gray-500 mr-3" />
                    <input
                      type="text"
                      placeholder="Enter duration (e.g., 30 min, 1 hr)"
                      className="w-full outline-none text-black placeholder:text-gray-700"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </div>

                  <div className="flex mt-3 items-center border border-gray-700 p-2 rounded-md">
                    <FaRupeeSign className="text-gray-500 mr-3" />
                    <input
                      type="number"
                      placeholder="Enter price"
                      className="w-full outline-none text-black placeholder:text-gray-700"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>

                  <div className="border mt-3 border-gray-700 p-3 rounded-md">
                    <label className="flex items-center cursor-pointer">
                      <MdImage className="text-gray-500 mr-3" />
                      <span className="text-gray-700">Upload Image</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                    {image && <img src={image} alt="Preview" className="mt-3 w-32 h-32 object-cover rounded-md border" />}
                  </div>

                  <button type="submit" className="w-full mt-3 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">
                    {editingService ? "Update" : "Submit"}
                  </button>
                </form>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {services.map((service) => (
              <div key={service.id} className="bg-white p-4 rounded-lg shadow-md">
                <img src={service.image} alt={service.serviceName} className="w-full h-40 object-cover rounded-md" />
                <h3 className="text-lg font-semibold text-black mt-2">Service : {service.serviceName}</h3>
                <p className='text-black'>Category : {service.selectedService}</p>
                <p className='text-black'>Duration : {service.duration}</p>
                <p className="text-green-500 font-bold">&#8377; Price : {service.price}</p>
                <div className="flex justify-between mt-3">
                  <button onClick={() => handleEdit(service)} className="text-white px-2 py-2 rounded-md bg-green-600"><MdEdit /></button>
                  <button onClick={() => handleDelete(service.id)} className="text-white px-2 py-2 rounded-md bg-red-600"><MdDelete /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Addservice;