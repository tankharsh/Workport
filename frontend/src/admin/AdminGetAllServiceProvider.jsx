import { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import { MdDeleteForever, MdSearch } from 'react-icons/md';
import { FaEdit } from "react-icons/fa";
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

function AdminGetAllServiceProvider() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [serviceProviderData, setServiceProviderData] = useState([]);
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
    fetchServiceProviders();
  }, []);

  const fetchServiceProviders = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/api/sp');
      console.log('Fetched service providers:', response.data);
      setServiceProviderData(response.data);
      setError(null);
    } catch (error) {
      setError('Error fetching service providers: ' + error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch service providers. Please try again.',
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
      console.log('Updating service provider with data:', currentUser);
      await axios.put(`http://localhost:4000/api/sp/updateSP/${currentUser._id}`, currentUser);
      setServiceProviderData(serviceProviderData.map(sp =>
        sp._id === currentUser._id ? currentUser : sp
      ));
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Service provider updated successfully!',
        confirmButtonColor: '#10B981'
      });
      closeModal();
    } catch (error) {
      console.error('Error updating service provider:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update service provider. Please try again.',
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
          await axios.delete(`http://localhost:4000/api/sp/deleteSP/${id}`);
          setServiceProviderData(serviceProviderData.filter(sp => sp._id !== id));
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Service provider has been deleted.',
            confirmButtonColor: '#10B981'
          });
        } catch (error) {
          console.error('Error deleting service provider:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete service provider. Please try again.',
            confirmButtonColor: '#10B981'
          });
        }
      }
    });
  };

  const filteredProviders = serviceProviderData.filter(provider =>
    Object.values(provider).some(value =>
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
            onClick={fetchServiceProviders}
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
            <h1 className="text-2xl font-bold text-gray-900">Service Providers</h1>
            <p className="text-sm text-gray-500 mt-1">Manage all service providers</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative w-full sm:w-64">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search service providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Service Providers Table */}
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shop Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <AnimatePresence>
                      {filteredProviders.map((provider, index) => (
                        <motion.tr
                          key={provider._id}
                          variants={rowVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{provider.spName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{provider.spEmail}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{provider.spContact}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{provider.spShopName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                              {provider.spCategories && provider.spCategories.length > 0
                                ? provider.spCategories.map(category => category.categoryName).join(", ")
                                : "No categories"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{provider.spCity} {provider.sp_pincode}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => openModal(provider)}
                              className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <FaEdit className="mr-1" />
                              Edit
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDelete(provider._id)}
                              className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                              <MdDeleteForever className="mr-1" />
                              Delete
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                    {filteredProviders.length === 0 && !loading && (
                      <tr>
                        <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                          No service providers found
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
                className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
              >
                <div className="p-6 border-b">
                  <h3 className="text-lg font-bold text-gray-900">
                    Edit Service Provider
                  </h3>
                </div>

                {/* Scrollable content area */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
                  <div className="grid gap-4">
                    {Object.entries(currentUser).map(([key, value]) => (
                      key !== "_id" && key !== "__v" && key !== "spCategories" && key !== "services" && (
                        <div key={key}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {key.replace('sp', '').replace(/([A-Z])/g, ' $1').replace('_', ' ').trim().toUpperCase()}
                          </label>
                          <input
                            type={key.includes('email') ? 'email' : 'text'}
                            value={value || ''}
                            onChange={(e) =>
                              setCurrentUser({ ...currentUser, [key]: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          />
                        </div>
                      )
                    ))}
                  </div>
                </div>

                {/* Fixed footer with buttons */}
                <div className="p-6 border-t bg-gray-50">
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSaveChanges}
                      className="flex-1 bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                    >
                      Save Changes
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={closeModal}
                      className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
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

export default AdminGetAllServiceProvider;
