import { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import { MdDeleteForever, MdSearch } from 'react-icons/md';
import { FaEdit } from "react-icons/fa";
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

function AdminGetAllUser() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const tableVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/api/users');
      setUsers(response.data);
      setError(null);
    } catch (error) {
      setError('Error fetching users: ' + error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch users. Please try again.',
        confirmButtonColor: '#10B981'
      });
    } finally {
      setLoading(false);
    }
  };

  const openModal = (user) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(`http://localhost:4000/api/users/${currentUser._id}`, currentUser);
      setUsers(users.map(user => 
        user._id === currentUser._id ? currentUser : user
      ));
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'User updated successfully!',
        confirmButtonColor: '#10B981'
      });
      closeModal();
    } catch (error) {
      console.error('Error updating user:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update user. Please try again.',
        confirmButtonColor: '#10B981'
      });
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#10B981',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:4000/api/users/${id}`);
          setUsers(users.filter(user => user._id !== id));
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'User has been deleted.',
            confirmButtonColor: '#10B981'
          });
        } catch (error) {
          console.error('Error deleting user:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete user. Please try again.',
            confirmButtonColor: '#10B981'
          });
        }
      }
    });
  };

  const filteredUsers = users.filter(user =>
    Object.values(user).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchUsers}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <AdminSidebar />
      <motion.main 
        className="flex-1 lg:ml-64 min-h-screen bg-gray-50"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header Section */}
        <div className="bg-white shadow-sm mt-16 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-2xl font-bold text-gray-900">All Users</h1>
            <p className="text-sm text-gray-500 mt-1">Manage registered users</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative w-full sm:w-64">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Users Table */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm overflow-hidden"
            variants={tableVariants}
          >
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <AnimatePresence>
                      {filteredUsers.map((user, index) => (
                        <motion.tr 
                          key={user._id}
                          variants={rowVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{user.userName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{user.userEmail}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{user.userContact}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => openModal(user)}
                              className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <FaEdit className="mr-1" />
                              Edit
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDelete(user._id)}
                              className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                              <MdDeleteForever className="mr-1" />
                              Delete
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                    {filteredUsers.length === 0 && !loading && (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>

        {/* Edit Modal */}
        <AnimatePresence>
          {isModalOpen && currentUser && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Edit User
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        value={currentUser.username}
                        onChange={(e) => setCurrentUser({ ...currentUser, username: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={currentUser.useremail}
                        onChange={(e) => setCurrentUser({ ...currentUser, useremail: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact
                      </label>
                      <input
                        type="text"
                        value={currentUser.usercontactno}
                        onChange={(e) => setCurrentUser({ ...currentUser, usercontactno: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSaveChanges}
                      className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Save Changes
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={closeModal}
                      className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
                
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>
    </>
  );
}

export default AdminGetAllUser;
