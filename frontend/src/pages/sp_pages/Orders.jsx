import { useState, useEffect } from 'react';
import Sidebar from '../../components/sp_components/Sidebar';
import { MdDataSaverOn, MdDeleteForever, MdCalendarMonth } from "react-icons/md";
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

  return (
    <>
      <Sidebar />
      <main className="flex-1 lg:ml-64 mt-20">
        <div className='text-3xl text-center font-bold'>Inquiry List</div>
        
        <div className="flex justify-center items-center space-x-4 my-6">
          <div className="flex space-x-4">
            {["Pending", "Approved", "Rejected"].map((item) => (
              <button 
                key={item} 
                onClick={() => setStatus(item)} 
                className={`px-4 py-2 rounded ${status === item ? 'bg-blue-600 text-white' : 'bg-gray-300 text-black'}`}
              >
                {item}
              </button>
            ))}
          </div>
          
          <button 
            onClick={openCalendarModal}
            className="ml-4 bg-green-600 text-white px-4 py-2 rounded flex items-center"
            title="View Booking Calendar"
          >
            <MdCalendarMonth className="mr-2" /> View Calendar
          </button>
        </div>
        
        <div className="overflow-x-auto mt-3">
          {isLoading ? (
            <div className="text-center p-4">Loading inquiries...</div>
          ) : error ? (
            <div className="text-center p-4 text-red-500">
              Error: {error}
              <button 
                onClick={() => window.location.reload()} 
                className="ml-4 bg-blue-500 text-white px-4 py-1 rounded"
              >
                Retry
              </button>
            </div>
          ) : (
            <table className="min-w-full border border-gray-200">
              <thead>
                <tr className="bg-[#354f52] text-white">
                  <th className="px-4 py-2 text-left font-bold">No.</th>
                  <th className="px-4 py-2 text-left font-bold">User Name</th>
                  <th className="px-4 py-2 text-left font-bold">Service</th>
                  <th className="px-4 py-2 text-left font-bold">Address</th>
                  <th className="px-4 py-2 text-left font-bold">Status</th>
                  <th className="px-4 py-2 text-left font-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                {inquiries && inquiries.length > 0 ? (
                  inquiries
                    .filter(inquiry => 
                      inquiry && (inquiry.status === status || (status === "Pending" && !inquiry.status))
                    )
                    .map((inquiry, index) => {
                      // Extract user and service information
                      const userName = (() => {
                        // Based on your database model, userName is the primary field
                        if (inquiry.user?.userName) return inquiry.user.userName;
                        
                        // Fallback options
                        if (inquiry.userName) return inquiry.userName;
                        if (inquiry.user?.name) return inquiry.user.name;
                        
                        // If we have user ID but couldn't get the name
                        if (typeof inquiry.user === 'string') {
                          return "User ID: " + inquiry.user;
                        }
                        
                        if (inquiry.user?._id) {
                          return "User ID: " + inquiry.user._id;
                        }
                        
                        return "Unknown User";
                      })();
                      
                      const serviceName = (() => {
                        // Based on your database model, serviceName is the primary field
                        if (inquiry.service?.serviceName) return inquiry.service.serviceName;
                        
                        // Fallback options
                        if (inquiry.serviceName) return inquiry.serviceName;
                        if (inquiry.service?.name) return inquiry.service.name;
                        
                        // If we have service ID but couldn't get the name
                        if (typeof inquiry.service === 'string') {
                          return "Service ID: " + inquiry.service;
                        }
                        
                        if (inquiry.service?._id) {
                          return "Service ID: " + inquiry.service._id;
                        }
                        
                        return "Unknown Service";
                      })();

                      // Get user address from inquiry or user object
                      const userAddress = inquiry.userAddress || 
                                         inquiry.user?.userAddress || 
                                         "No address provided";
                      
                      return (
                        <tr key={inquiry._id || index} className="transition-all duration-300 ease-in-out transform hover:bg-gray-500">
                          <td className="px-4 py-2 border-t border-gray-200">{index + 1}</td>
                          <td className="px-4 py-2 border-t border-gray-200">{userName}</td>
                          <td className="px-4 py-2 border-t border-gray-200">{serviceName}</td>
                          <td className="px-4 py-2 border-t border-gray-200">
                            {userAddress.length > 20 ? `${userAddress.substring(0, 20)}...` : userAddress}
                          </td>
                          <td className="px-4 py-2 border-t border-gray-200">{inquiry.status || "Pending"}</td>
                          <td className="px-4 py-2 border-t border-gray-200">
                            <button 
                              onClick={() => handleAcceptClick(inquiry)} 
                              className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                              title="Accept/Update Inquiry"
                            >
                              <MdDataSaverOn />
                            </button>
                            <button 
                              className="bg-red-500 text-white px-4 py-2 rounded" 
                              onClick={() => handleDeleteInquiry(inquiry._id)}
                              title="Delete Inquiry"
                            >
                              <MdDeleteForever />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-2 text-center border-t border-gray-200">
                      {isLoading ? (
                        "Loading inquiries..."
                      ) : error ? (
                        <div className="text-red-500">
                          Error: {error}
                          <button 
                            onClick={() => window.location.reload()} 
                            className="ml-4 bg-blue-500 text-white px-4 py-1 rounded"
                          >
                            Retry
                          </button>
                        </div>
                      ) : (
                        `No inquiries found for status: ${status}`
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Inquiry Details Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 z-10">
            <h2 className="text-lg font-bold mb-4 text-center bg-green-600 text-white py-2 rounded">Inquiry Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2 border-b pb-2">User Information</h3>
                <p className='text-black'><strong>Name:</strong> {selectedUser.user?.userName || selectedUser.userName || "N/A"}</p>
                <p className='text-black'><strong>Email:</strong> {selectedUser.user?.userEmail || selectedUser.userEmail || "N/A"}</p>
                <p className='text-black'><strong>Contact:</strong> {selectedUser.user?.userContact || selectedUser.userContact || "N/A"}</p>
                
                {/* User Address from inquiry */}
                <p className='text-black'><strong>Address:</strong> {selectedUser.userAddress || selectedUser.user?.userAddress || "N/A"}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2 border-b pb-2">Inquiry Information</h3>
                {/* Show Preferred Date if available */}
                <p className='text-black'>
                  <strong>Preferred Date:</strong> {selectedUser.preferredDate || "Not specified"}
                </p>
                
                {/* Show Additional Information if available */}
                <p className='text-black'>
                  <strong>Additional Info:</strong> {selectedUser.additionalInfo || "None provided"}
                </p>
                
                <p className='text-black'>
                  <strong>Current Status:</strong> <span className={`font-bold ${
                    selectedUser.status === "Approved" ? "text-green-600" : 
                    selectedUser.status === "Rejected" ? "text-red-600" : "text-yellow-600"
                  }`}>{selectedUser.status || "Pending"}</span>
                </p>
                
                <p className='text-black'>
                  <strong>Submitted:</strong> {new Date(selectedUser.createdAt).toLocaleString() || "N/A"}
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-bold text-lg mb-2 border-b pb-2">Update Inquiry</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input type="date" className="mt-1 block text-black w-full px-3 py-2 border border-gray-300 rounded-md" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Time</label>
                  <input type="time" className="mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <textarea rows={3} className="mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Enter a message for the user" />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select className="mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded" onClick={handleCloseModal}>Cancel</button>
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded" onClick={handleConfirmOrder}>Update Inquiry</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Calendar Modal */}
      {isCalendarModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Booking Calendar</h2>
              <button 
                onClick={closeCalendarModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600 mb-2">
                This calendar shows all your approved bookings. Use this to avoid scheduling conflicts.
              </p>
              
              {Object.keys(groupedBookings).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(groupedBookings)
                    .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
                    .map(([date, slots]) => (
                    <div key={date} className="border rounded-lg overflow-hidden">
                      <div className="bg-blue-600 text-white px-4 py-2 font-bold">
                        {new Date(date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="p-4">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2">Time</th>
                              <th className="text-left py-2">Client</th>
                              <th className="text-left py-2">Service</th>
                            </tr>
                          </thead>
                          <tbody>
                            {slots
                              .sort((a, b) => a.time.localeCompare(b.time))
                              .map((slot, idx) => (
                              <tr key={idx} className="border-b last:border-b-0">
                                <td className="py-2 font-medium">
                                  {slot.time}
                                </td>
                                <td className="py-2">
                                  {slot.userName}
                                </td>
                                <td className="py-2">
                                  {slot.serviceName}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No approved bookings found. When you approve inquiries with date and time, they will appear here.
                </div>
              )}
            </div>
            
            <div className="flex justify-end">
              <button 
                onClick={closeCalendarModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Orders;
