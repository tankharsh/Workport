import React, { useState } from 'react'; 
import AdminSidebar from './AdminSidebar'; 
import { MdDeleteForever } from 'react-icons/md';
import { FaEdit } from "react-icons/fa";

function AdminGetAllServiceProvider() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const openModal = (user) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
  };

  const serviceProviderData = [
    {
      "no": 1,
      "service_provider_name": "John Doe",
      "sp_email": "john.doe@example.com",
      "sp_contact": "1234567890",
      "sp_shop_name": "John's Electronics",
      "sp_category": "Electronics",
      "sp_pincode": "123456",
      "sp_city": "New York"
    },
    {
      "no": 2,
      "service_provider_name": "Jane Smith",
      "sp_email": "jane.smith@example.com",
      "sp_contact": "0987654321",
      "sp_shop_name": "Smith's Bakery",
      "sp_category": "Bakery",
      "sp_pincode": "654321",
      "sp_city": "Los Angeles"
    }
  ];

  return (
    <div>
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 py-2 mt-20 px-4">
        <h2 className="text-3xl text-center font-bold">All Service Providers</h2>
        <div className="overflow-x-auto mt-3">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-sm sm:text-base">
                <th className="px-2 py-2 sm:px-4">No.</th>
                <th className="px-2 py-2 sm:px-4">Name</th>
                <th className="px-2 py-2 sm:px-4">Email</th>
                <th className="px-2 py-2 sm:px-4">Contact</th>
                <th className="px-2 py-2 sm:px-4">Shop Name</th>
                <th className="px-2 py-2 sm:px-4">Category</th>
                <th className="px-2 py-2 sm:px-4">Pincode</th>
                <th className="px-2 py-2 sm:px-4">City</th>
                <th className="px-2 py-2 sm:px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {serviceProviderData.map((user) => (
                <tr key={user.no} className="hover:bg-gray-200 text-sm sm:text-base">
                  <td className="px-2 py-2 border">{user.no}</td>
                  <td className="px-2 py-2 border">{user.service_provider_name}</td>
                  <td className="px-2 py-2 border">{user.sp_email}</td>
                  <td className="px-2 py-2 border">{user.sp_contact}</td>
                  <td className="px-2 py-2 border">{user.sp_shop_name}</td>
                  <td className="px-2 py-2 border">{user.sp_category}</td>
                  <td className="px-2 py-2 border">{user.sp_pincode}</td>
                  <td className="px-2 py-2 border">{user.sp_city}</td>
                  <td className="px-2 py-2 border flex gap-2">
                    <button onClick={() => openModal(user)} className="bg-blue-500 text-white p-2 rounded">
                      <FaEdit className="text-lg" />
                    </button>
                    <button className="bg-red-500 text-white p-2 rounded">
                      <MdDeleteForever className="text-lg" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Responsive Edit Modal */}
      {isModalOpen && currentUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-lg mx-4 md:mx-0">
            <h2 className="text-xl font-bold mb-4 text-center">Edit Service Provider</h2>
            <div className="grid gap-3">
              {Object.keys(currentUser).map((key) => (
                key !== "no" && (
                  <div key={key}>
                    <label className="block text-sm font-medium">{key.replace(/_/g, ' ')}</label>
                    <input
                      type="text"
                      value={currentUser[key]}
                      onChange={(e) =>
                        setCurrentUser({ ...currentUser, [key]: e.target.value })
                      }
                      className="border px-4 py-2 w-full rounded"
                    />
                  </div>
                )
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={closeModal} className="bg-red-500 text-white px-4 py-2 rounded mr-2">
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log('Saved changes:', currentUser);
                  closeModal();
                }}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminGetAllServiceProvider;
