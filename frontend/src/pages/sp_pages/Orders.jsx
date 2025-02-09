import React, { useState } from 'react';
import Sidebar from '../../components/sp_components/Sidebar';
import { MdDataSaverOn, MdDeleteForever } from "react-icons/md";
import { Tooltip } from 'react-tooltip';

const Orders = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleAcceptClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <>
      <Sidebar />
      <main className="flex-1 lg:ml-64   mt-20">
        <div className='text-3xl text-center font-bold '>Order List</div>
        <div className="overflow-x-auto mt-3">
          <table className="min-w-full  border border-gray-200">
            <thead>
              <tr className="bg-[#354f52] text-white">
                <th className="px-4 py-2 text-left font-bold text-white">No.</th>
                <th className="px-4 py-2 text-left font-bold text-white">Image</th>
                <th className="px-4 py-2 text-left font-bold text-white">User Name</th>
                <th className="px-4 py-2 text-left font-bold text-white">Email</th>
                <th className="px-4 py-2 text-left font-bold text-white">Contact</th>
                <th className="px-4 py-2 text-left font-bold text-white">Address</th>
                <th className="px-4 py-2 text-left font-bold text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  id: 1,
                  image: "https://via.placeholder.com/50",
                  userName: "John Doe",
                  email: "john@example.com",
                  contact: "123-456-7890",
                  address: "123 Main St, New York"
                },
                {
                  id: 2,
                  image: "https://via.placeholder.com/50",
                  userName: "John Doe",
                  email: "john@example.com",
                  contact: "123-456-7890",
                  address: "123 Main St, New York"
                },
              ].map((user, index) => (
                <tr
                  key={user.id}
                  className="transition-all  duration-300 ease-in-out transform hover:bg-gray-500"
                >
                  <td className="px-4 py-2 border-t border-gray-200">{index + 1}</td>
                  <td className="px-4 py-2 border-t border-gray-200">
                    <img src={user.image} alt="User" className="w-12 h-12 rounded-full" />
                  </td>
                  <td className="px-4 py-2 border-t border-gray-200">{user.userName}</td>
                  <td className="px-4 py-2 border-t border-gray-200">{user.email}</td>
                  <td className="px-4 py-2 border-t border-gray-200">{user.contact}</td>
                  <td className="px-4 py-2 border-t border-gray-200">{user.address}</td>
                  <td className="px-4 py-2 border-t border-gray-200">
                    <button
                      data-tooltip-id="my-tooltip"
                      data-tooltip-content="Accept"
                      onClick={() => handleAcceptClick(user)}
                      className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                    >
                      <MdDataSaverOn />
                    </button>
                    <Tooltip
                      id="my-tooltip"
                      style={{
                        backgroundColor: "black",
                        color: "white",
                        borderRadius: "8px",
                        padding: "8px 12px",
                      }}
                      delayShow={200}
                      delayHide={200}
                    />
                    <button
                      data-tooltip-id="delete-tooltip"
                      data-tooltip-content="Delete"
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      <MdDeleteForever />
                    </button>
                    <Tooltip
                      id="delete-tooltip"
                      style={{
                        backgroundColor: "black",
                        color: "white",
                        borderRadius: "8px",
                        padding: "8px 12px",
                      }}
                      delayShow={200}
                      delayHide={200}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="model fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 z-10">
            <h2 className="text-lg font-bold mb-4 text-center bg-green-600 py-2">User Accepted</h2>
            <p className='text-black'><strong >Name:</strong> {selectedUser.userName}</p>
            <p className='text-black'><strong>Email:</strong> {selectedUser.email}</p>
            <p className='text-black'><strong>Contact:</strong> {selectedUser.contact}</p>
            <p className='text-black'><strong>Address:</strong> {selectedUser.address}</p>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                className="mt-1 block text-black w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Time</label>
              <input
                type="time"
                name="time"
                className="mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                name="message"
                rows={3}
                className="mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mt-6 flex justify-between">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Orders;
