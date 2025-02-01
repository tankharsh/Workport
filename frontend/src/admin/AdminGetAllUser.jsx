import React, { useState ,useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import { MdDeleteForever } from 'react-icons/md';
import { FaEdit } from "react-icons/fa";
import { Tooltip } from 'react-tooltip';
import axios from 'axios';


function AdminGetAllUser() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  // const [loading, setLoading] = useState(true);  // To track loading state
  const [error, setError] = useState(null);      // To track errors

  useEffect(() => {
    // Fetch data from the API using Axios
    axios.get('http://localhost:4000/api/users')
      .then((response) => {
        setUsers(response.data);  // Update the state with the fetched data
        // setLoading(false);         // Set loading to false after data is fetched
      })
      .catch((error) => {
        setError('Error fetching users: ' + error.message);  // Handle errors
        // setLoading(false);  // Set loading to false after error
      });
  }, []);  // Empty dependency array ensures it runs only once after initial render

  // if (loading) {
  //   return <div>Loading...</div>;  // Show loading message while fetching data
  // }

  if (error) {
    return <div>{error}</div>;  // Show error message if there's any error
  }

  const openModal = (user) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
  };

  const saveChanges = () => {
    setUsers(users.map(user => (user.id === currentUser.id ? currentUser : user)));
    closeModal();
  };

  return (
    <div>
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 py-2 mt-20">
        <div className='text-3xl text-center font-bold'>All Users</div>
        <div className="overflow-x-auto mt-3 px-2">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left font-bold text-gray-700">No.</th>
                <th className="px-4 py-2 text-left font-bold text-gray-700">User Name</th>
                <th className="px-4 py-2 text-left font-bold text-gray-700">Email</th>
                <th className="px-4 py-2 text-left font-bold text-gray-700">Contact</th>
                <th className="px-4 py-2 text-left font-bold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (   users.map((user, index) => (
                <tr key={index} className="transition-all duration-300 ease-in-out transform hover:bg-gray-200">
                  <td className="px-4 py-2 border-t border-gray-200">{index + 1}</td>
                  <td className="px-4 py-2 border-t border-gray-200">{user.username}</td>
                  <td className="px-4 py-2 border-t border-gray-200">{user.useremail}</td>
                  <td className="px-4 py-2 border-t border-gray-200">{user.usercontactno}</td>
                  <td className="px-4 py-2 border-t border-gray-200 flex flex-wrap gap-2">
                    <button
                      onClick={() => openModal(user)}
                      className="bg-blue-500 text-white px-3 py-2 rounded"
                    >
                      <FaEdit />
                    </button>
                    <button
                      data-tooltip-id="delete-tooltip"
                      data-tooltip-content="Delete"
                      className="bg-red-500 text-white px-3 py-2 rounded"
                      onClick={() => setUsers(users.filter(u => u.id !== user.id))}
                    >
                      <MdDeleteForever />
                    </button>
                    <Tooltip
                      id="delete-tooltip"
                      style={{ backgroundColor: "black", color: "white", borderRadius: "8px", padding: "8px 12px" }}
                      delayShow={200}
                      delayHide={200}
                    />
                  </td>
                </tr>
              )) ) :(
                <tr className="text-center">
                  <td colSpan="5">No users found</td>
                </tr>  // Show a message when no users are found
              )}

         
            </tbody>
          </table>
        </div>
        
      </main>

      {/* Modal for Editing User */}
      {isModalOpen && currentUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-md w-full max-w-md sm:max-w-lg md:max-w-xl lg:w-1/3">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <div>
              <label className="block mb-2">User Name</label>
              <input
                type="text"
                value={currentUser.userName}
                onChange={(e) => setCurrentUser({ ...currentUser, userName: e.target.value })}
                className="border px-4 py-2 w-full mb-4 rounded"
              />

              <label className="block mb-2">Email</label>
              <input
                type="email"
                value={currentUser.email}
                onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                className="border px-4 py-2 w-full mb-4 rounded"
              />

              <label className="block mb-2">Contact</label>
              <input
                type="text"
                value={currentUser.contact}
                onChange={(e) => setCurrentUser({ ...currentUser, contact: e.target.value })}
                className="border px-4 py-2 w-full mb-4 rounded"
              />

              <div className="flex justify-end space-x-2">
                <button
                  onClick={closeModal}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={saveChanges}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminGetAllUser;
