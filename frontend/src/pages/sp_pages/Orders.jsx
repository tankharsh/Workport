import { useState, useEffect } from 'react';
import Sidebar from '../../components/sp_components/Sidebar';
import { MdDataSaverOn, MdDeleteForever, MdCalendarMonth, MdPending, MdCheckCircle, MdCancel, MdSearch } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

const Orders = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [status, setStatus] = useState("Pending");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Pending");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Get service provider data from localStorage
  const storedUser = localStorage.getItem("serviceProvider");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const serviceProviderId = parsedUser?.id;

  useEffect(() => {
    const fetchInquiries = async () => {
      if (!serviceProviderId) {
        setError("Service provider ID not found in localStorage");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const apiUrl = `http://localhost:4000/api/inquiries/${serviceProviderId}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();

        // Check the structure of the response
        if (data && data.inquiries && Array.isArray(data.inquiries)) {
          // First, fetch user and service details if needed
          const populatedInquiries = await Promise.all(data.inquiries.map(async (inquiry) => {
            let updatedInquiry = { ...inquiry };

            // If user is just an ID, fetch user details
            if (inquiry.user && typeof inquiry.user === 'string') {
              try {
                const userResponse = await fetch(`http://localhost:4000/api/users/${inquiry.user}`);
                if (userResponse.ok) {
                  const userData = await userResponse.json();

                  // Check if user data is in expected format
                  if (userData.user) {
                    updatedInquiry.user = userData.user;
                  } else if (userData) {
                    updatedInquiry.user = userData;
                  }
                }
              } catch {
                // Handle error silently
              }
            }

            // If service is just an ID, fetch service details
            if (inquiry.service && typeof inquiry.service === 'string') {
              try {
                const serviceResponse = await fetch(`http://localhost:4000/api/services/${inquiry.service}`);
                if (serviceResponse.ok) {
                  const serviceData = await serviceResponse.json();

                  // Check if service data is in expected format
                  if (serviceData.service) {
                    updatedInquiry.service = serviceData.service;
                  } else if (serviceData) {
                    updatedInquiry.service = serviceData;
                  }
                }
              } catch {
                // Handle error silently
              }
            }

            return updatedInquiry;
          }));

          // Transform data to ensure proper structure
          const transformedData = populatedInquiries.map(inquiry => {
            // Extract service data properly
            let serviceData = {};
            if (inquiry.service) {
              if (typeof inquiry.service === 'string') {
                serviceData = { _id: inquiry.service, name: "Service " + inquiry.service.substring(0, 5) };
              } else if (typeof inquiry.service === 'object') {
                serviceData = inquiry.service;
              }
            }

            // Extract user data properly
            let userData = {};
            if (inquiry.user) {
              if (typeof inquiry.user === 'string') {
                userData = { _id: inquiry.user, userName: "User " + inquiry.user.substring(0, 5) };
              } else if (typeof inquiry.user === 'object') {
                userData = inquiry.user;
              }
            }

            return {
              ...inquiry,
              user: userData,
              service: serviceData,
              services: inquiry.services || {},
              status: inquiry.status || "Pending"
            };
          });

          setInquiries(transformedData);

          // Extract booked slots from approved inquiries
          const approvedBookings = transformedData
            .filter(inq => inq.status === "Approved" && inq.date && inq.time)
            .map(inq => ({
              date: inq.date,
              time: inq.time,
              userName: inq.user?.userName || "Unknown User",
              serviceName: inq.service?.serviceName || "Unknown Service",
              inquiryId: inq._id
            }));

          setBookedSlots(approvedBookings);
        } else if (data && Array.isArray(data)) {
          // Transform data to ensure proper structure
          const transformedData = data.map(inquiry => {
            // Extract service data properly
            let serviceData = {};
            if (inquiry.service) {
              if (typeof inquiry.service === 'string') {
                serviceData = { name: inquiry.service };
              } else if (typeof inquiry.service === 'object') {
                serviceData = inquiry.service;
              }
            }

            // Extract user data properly
            let userData = {};
            if (inquiry.user) {
              if (typeof inquiry.user === 'string') {
                userData = { name: inquiry.user };
              } else if (typeof inquiry.user === 'object') {
                userData = inquiry.user;
              }
            }

            return {
              ...inquiry,
              user: userData,
              service: serviceData,
              services: inquiry.services || {},
              status: inquiry.status || "Pending"
            };
          });
          setInquiries(transformedData);

          // Extract booked slots from approved inquiries
          const approvedBookings = transformedData
            .filter(inq => inq.status === "Approved" && inq.date && inq.time)
            .map(inq => ({
              date: inq.date,
              time: inq.time,
              userName: inq.user?.userName || "Unknown User",
              serviceName: inq.service?.serviceName || "Unknown Service",
              inquiryId: inq._id
            }));

          setBookedSlots(approvedBookings);
        } else {
          setError("Invalid inquiries data format received from API");
          setInquiries([]);
        }
      } catch (error) {
        setError(error.message || "Failed to fetch inquiries");
        setInquiries([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInquiries();
  }, [serviceProviderId]);

  const handleAcceptClick = (inquiry) => {
    setSelectedUser(inquiry);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setDate("");
    setTime("");
    setMessage("");
    setSelectedStatus("Pending");
  };

  const handleConfirmOrder = async () => {
    if (!selectedUser) return;

    // Validate that date and time are provided if status is Approved
    if (selectedStatus === "Approved" && (!date || !time)) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please provide both date and time when approving an inquiry.",
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/inquiries/status/${selectedUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date,
          time,
          message,
          status: selectedStatus,
          serviceProvider: selectedUser.serviceProvider // Pass the service provider ID for conflict checking
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `Inquiry ${selectedStatus} successfully!`,
        });

        // Update the inquiries state
        const updatedInquiries = inquiries.map(inq =>
          inq._id === selectedUser._id ? { ...inq, status: selectedStatus, date, time, message } : inq
        );

        setInquiries(updatedInquiries);

        // Update booked slots if status is Approved
        if (selectedStatus === "Approved") {
          const newBooking = {
            date,
            time,
            userName: selectedUser.user?.userName || "Unknown User",
            serviceName: selectedUser.service?.serviceName || "Unknown Service",
            inquiryId: selectedUser._id
          };

          setBookedSlots(prev => [...prev.filter(slot => slot.inquiryId !== selectedUser._id), newBooking]);
        } else {
          // Remove from booked slots if status is not Approved
          setBookedSlots(prev => prev.filter(slot => slot.inquiryId !== selectedUser._id));
        }

        handleCloseModal();
      } else if (response.status === 409) {
        // Handle conflict - already booked time slot
        Swal.fire({
          icon: "error",
          title: "Time Slot Conflict",
          text: data.message || "This time slot is already booked. Please choose a different time.",
          footer: '<span class="text-red-500">Tip: Check your calendar for available slots</span>'
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Failed to update inquiry status. Please try again.",
        });
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update inquiry status. Please try again.",
      });
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!id) return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This inquiry will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`http://localhost:4000/api/inquiries/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        Swal.fire("Deleted!", "Inquiry has been deleted.", "success");
        setInquiries((prev) => prev.filter((inquiry) => inquiry._id !== id));
        // Also remove from booked slots if it was there
        setBookedSlots(prev => prev.filter(slot => slot.inquiryId !== id));
      } else {
        const errorData = await response.json();
        Swal.fire("Error!", "Failed to delete inquiry: " + errorData.message, "error");
      }
    } catch {
      Swal.fire("Error!", "Error deleting inquiry. Please try again.", "error");
    }
  };

  const openCalendarModal = () => {
    setIsCalendarModalOpen(true);
  };

  const closeCalendarModal = () => {
    setIsCalendarModalOpen(false);
  };

  // Group booked slots by date for the calendar view
  const groupedBookings = bookedSlots.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot);
    return acc;
  }, {});

  // Enhanced Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const tableRowVariants = {
    hidden: {
      opacity: 0,
      x: -20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    },
    exit: {
      opacity: 0,
      x: 20,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  const statusButtonVariants = {
    tap: { scale: 0.95 },
    hover: { scale: 1.05 }
  };

  return (
    <>
      <Sidebar />
      <motion.main
        className="flex-1 lg:ml-64 min-h-screen bg-gray-50 pt-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Modern Header Section */}
        <div className="bg-white shadow-sm border-b sticky top-16 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Inquiry Management</h1>
                <p className="text-sm text-gray-500 mt-1">Manage and track all your service inquiries</p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="Search by name, email, or service..."
                  autoComplete="off"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status Filters with Enhanced Animations */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap gap-4 justify-center sm:justify-between items-center">
            <div className="flex flex-wrap gap-3">
              {[
                { status: "Pending", icon: MdPending, color: "bg-yellow-500" },
                { status: "Approved", icon: MdCheckCircle, color: "bg-green-500" },
                { status: "Rejected", icon: MdCancel, color: "bg-red-500" }
              ].map((item) => (
                <motion.button
                  key={item.status}
                  onClick={() => setStatus(item.status)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    status === item.status
                      ? `${item.color} text-white shadow-lg`
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                  whileHover="hover"
                  whileTap="tap"
                  variants={statusButtonVariants}
                  layout
                >
                  <item.icon className={status === item.status ? "text-white" : "text-gray-500"} />
                  <span>{item.status}</span>
                  <motion.span
                    className="ml-2 bg-white bg-opacity-20 px-2 py-0.5 rounded-full text-sm"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  >
                    {inquiries.filter(i => i.status === item.status).length}
                  </motion.span>
                </motion.button>
              ))}
            </div>

            <motion.button
              onClick={openCalendarModal}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200 shadow-sm hover:shadow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MdCalendarMonth className="text-xl" />
              <span>View Calendar</span>
            </motion.button>
          </div>
        </div>

        {/* Table Section with Enhanced Animations */}
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8"
          layout
        >
          <motion.div
            className="bg-white rounded-xl shadow-sm overflow-hidden"
            layout
          >
            <div className="overflow-x-auto">
              {isLoading ? (
                <motion.div
                  className="flex items-center justify-center h-64"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                </motion.div>
              ) : error ? (
                <motion.div
                  className="flex flex-col items-center justify-center h-64 text-red-500"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <p className="text-lg mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200"
                  >
                    Retry
                  </button>
                </motion.div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <AnimatePresence mode="popLayout">
                      {inquiries
                        .filter(inquiry => inquiry && (inquiry.status === status || (status === "Pending" && !inquiry.status)))
                        .filter(inquiry => {
                          if (!searchTerm) return true;

                          const searchLower = searchTerm.toLowerCase();

                          // Search in user name
                          if (inquiry.user?.userName && inquiry.user.userName.toLowerCase().includes(searchLower)) {
                            return true;
                          }

                          // Search in user email
                          if (inquiry.user?.userEmail && inquiry.user.userEmail.toLowerCase().includes(searchLower)) {
                            return true;
                          }

                          // Search in service name
                          if (inquiry.service?.serviceName && inquiry.service.serviceName.toLowerCase().includes(searchLower)) {
                            return true;
                          }

                          // Search in address
                          const address = inquiry.userAddress || inquiry.user?.userAddress || "";
                          if (address.toLowerCase().includes(searchLower)) {
                            return true;
                          }

                          return false;
                        })
                        .map((inquiry, index) => (
                          <motion.tr
                            key={inquiry._id || index}
                            variants={tableRowVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            layout
                            className="hover:bg-gray-50 transition-colors duration-200"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {inquiry.user?.userName || "Unknown User"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {inquiry.user?.userEmail || "No email"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {inquiry.service?.serviceName || "Unknown Service"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {(inquiry.userAddress || inquiry.user?.userAddress || "No address").substring(0, 30)}...
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                inquiry.status === "Approved" ? "bg-green-100 text-green-800" :
                                inquiry.status === "Rejected" ? "bg-red-100 text-red-800" :
                                "bg-yellow-100 text-yellow-800"
                              }`}>
                                {inquiry.status || "Pending"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <motion.button
                                  onClick={() => handleAcceptClick(inquiry)}
                                  className="text-emerald-600 hover:text-emerald-900 transition-colors duration-200"
                                  title="Manage Inquiry"
                                  whileHover={{ scale: 1.2 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <MdDataSaverOn className="w-5 h-5" />
                                </motion.button>
                                <motion.button
                                  onClick={() => handleDeleteInquiry(inquiry._id)}
                                  className="text-red-600 hover:text-red-900 transition-colors duration-200"
                                  title="Delete Inquiry"
                                  whileHover={{ scale: 1.2 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <MdDeleteForever className="w-5 h-5" />
                                </motion.button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                    </AnimatePresence>
                    {inquiries
                      .filter(inquiry => inquiry && (inquiry.status === status || (status === "Pending" && !inquiry.status)))
                      .filter(inquiry => {
                        if (!searchTerm) return true;

                        const searchLower = searchTerm.toLowerCase();

                        // Search in user name
                        if (inquiry.user?.userName && inquiry.user.userName.toLowerCase().includes(searchLower)) {
                          return true;
                        }

                        // Search in user email
                        if (inquiry.user?.userEmail && inquiry.user.userEmail.toLowerCase().includes(searchLower)) {
                          return true;
                        }

                        // Search in service name
                        if (inquiry.service?.serviceName && inquiry.service.serviceName.toLowerCase().includes(searchLower)) {
                          return true;
                        }

                        // Search in address
                        const address = inquiry.userAddress || inquiry.user?.userAddress || "";
                        if (address.toLowerCase().includes(searchLower)) {
                          return true;
                        }

                        return false;
                      }).length === 0 && (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                          {searchTerm ? (
                            <>
                              No inquiries found matching <span className="font-medium">"{searchTerm}"</span>
                            </>
                          ) : (
                            <>No inquiries found with {status} status</>
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>
        </motion.div>
      </motion.main>

      {/* Inquiry Details Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl my-8">
            {/* Modal Header - Sticky */}
            <div className="sticky top-0 bg-white z-20 rounded-t-xl">
              <div className="bg-emerald-600 text-white p-4 rounded-t-xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Inquiry Details</h2>
                  <button
                    onClick={handleCloseModal}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="p-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Information Card */}
                <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                  <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">User Information</h3>
                  <div className="space-y-3">
                    <p className="text-gray-800"><span className="font-medium">Name:</span> {selectedUser.user?.userName || "N/A"}</p>
                    <p className="text-gray-800"><span className="font-medium">Email:</span> {selectedUser.user?.userEmail || "N/A"}</p>
                    <p className="text-gray-800"><span className="font-medium">Contact:</span> {selectedUser.user?.userContact || "N/A"}</p>
                    <p className="text-gray-800"><span className="font-medium">Address:</span> {selectedUser.userAddress || selectedUser.user?.userAddress || "N/A"}</p>
                  </div>
                </div>

                {/* Inquiry Information Card */}
                <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                  <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">Inquiry Information</h3>
                  <div className="space-y-3">
                    <p className="text-gray-800">
                      <span className="font-medium">Preferred Date:</span> {selectedUser.preferredDate || "Not specified"}
                    </p>
                    <p className="text-gray-800">
                      <span className="font-medium">Additional Info:</span> {selectedUser.additionalInfo || "None provided"}
                    </p>
                    <p className="text-gray-800">
                      <span className="font-medium">Current Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-sm font-medium ${
                        selectedUser.status === "Approved" ? "bg-green-100 text-green-800" :
                        selectedUser.status === "Rejected" ? "bg-red-100 text-red-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {selectedUser.status || "Pending"}
                      </span>
                    </p>
                    <p className="text-gray-800">
                      <span className="font-medium">Submitted:</span> {new Date(selectedUser.createdAt).toLocaleString() || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Update Section */}
              <div className="mt-6 bg-gray-50 p-6 rounded-xl shadow-sm">
                <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">Update Inquiry</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                      type="time"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter a message for the user"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Footer - Sticky */}
            <div className="sticky bottom-0 bg-white p-6 border-t rounded-b-xl">
              <div className="flex justify-end gap-4">
                <button
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                  onClick={handleConfirmOrder}
                >
                  Update Inquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Modal */}
      {isCalendarModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl my-8">
            {/* Calendar Modal Header - Sticky */}
            <div className="sticky top-0 bg-white z-20 rounded-t-xl">
              <div className="bg-emerald-600 text-white p-4 rounded-t-xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Booking Calendar</h2>
                  <button
                    onClick={closeCalendarModal}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            {/* Calendar Modal Content - Scrollable */}
            <div className="p-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
              <div className="bg-gray-50 p-6 rounded-xl">
                <p className="text-sm text-gray-600 mb-4">
                  This calendar shows all your approved bookings. Use this to avoid scheduling conflicts.
                </p>

                {Object.keys(groupedBookings).length > 0 ? (
                  <div className="space-y-6">
                    {Object.entries(groupedBookings)
                      .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
                      .map(([date, slots]) => (
                        <div key={date} className="bg-white rounded-xl shadow-sm overflow-hidden">
                          <div className="bg-emerald-600 text-white px-6 py-3">
                            <h3 className="font-bold">
                              {new Date(date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </h3>
                          </div>
                          <div className="p-4">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left py-2 text-gray-600">Time</th>
                                  <th className="text-left py-2 text-gray-600">Client</th>
                                  <th className="text-left py-2 text-gray-600">Service</th>
                                </tr>
                              </thead>
                              <tbody>
                                {slots
                                  .sort((a, b) => a.time.localeCompare(b.time))
                                  .map((slot, idx) => (
                                    <tr key={idx} className="border-b last:border-b-0">
                                      <td className="py-3 font-medium text-gray-900">{slot.time}</td>
                                      <td className="py-3 text-gray-800">{slot.userName}</td>
                                      <td className="py-3 text-gray-800">{slot.serviceName}</td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    No approved bookings found. When you approve inquiries with date and time, they will appear here.
                  </div>
                )}
              </div>
            </div>

            {/* Calendar Modal Footer - Sticky */}
            <div className="sticky bottom-0 bg-white p-6 border-t rounded-b-xl">
              <div className="flex justify-end">
                <button
                  onClick={closeCalendarModal}
                  className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Orders;
