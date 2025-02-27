import { useState, useEffect } from 'react';
import Sidebar from '../../components/sp_components/Sidebar';
import { MdDataSaverOn, MdDeleteForever } from "react-icons/md";
import { Tooltip } from 'react-tooltip';
import Swal from "sweetalert2";

const Orders = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [status, setStatus] = useState("Pending");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Pending");
  
  const storedUser = localStorage.getItem("SP_LoggedInUser");
  const serviceProviderId = storedUser ? JSON.parse(storedUser).id : null;

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/inquiries/${serviceProviderId}`);
        const data = await response.json();
        setInquiries(data.inquiries);
      } catch (error) {
        console.error("Error fetching inquiries:", error);
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
          status: selectedStatus 
        }),
      });
  
      const data = await response.json();
      console.log("Update Response:", data);
  
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `Inquiry ${selectedStatus} successfully!`,
        });
  
        setInquiries(prev => 
          prev.map(inq => 
            inq._id === selectedUser._id ? { ...inq, status: selectedStatus } : inq
          )
        );
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error updating inquiry status:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update inquiry status. Please try again.",
      });
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!id) {
      console.error("Inquiry ID is missing");
      return;
    }
  
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
        // Remove deleted inquiry from the state without refreshing
        setInquiries((prev) => prev.filter((inquiry) => inquiry._id !== id));
      } else {
        const data = await response.json();
        Swal.fire("Error!", "Failed to delete inquiry: " + data.message, "error");
      }
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      Swal.fire("Error!", "Error deleting inquiry. Please try again.", "error");
    }
  };


  return (
    <>
      <Sidebar />
      <main className="flex-1 lg:ml-64 mt-20">
        <div className='text-3xl text-center font-bold '>Inquiry List</div>
        
        <div className="flex justify-center space-x-4 my-6">
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
        
        <div className="overflow-x-auto mt-3">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-[#354f52] text-white">
                <th className="px-4 py-2 text-left font-bold">No.</th>
                <th className="px-4 py-2 text-left font-bold">User Name</th>
                <th className="px-4 py-2 text-left font-bold">Service</th>
                <th className="px-4 py-2 text-left font-bold">Status</th>
                <th className="px-4 py-2 text-left font-bold">Action</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.filter(inquiry => inquiry.status === status).map((inquiry, index) => (
                <tr key={inquiry._id} className="transition-all duration-300 ease-in-out transform hover:bg-gray-500">
                  <td className="px-4 py-2 border-t border-gray-200">{index + 1}</td>
                  <td className="px-4 py-2 border-t border-gray-200">{inquiry.user?.username || "N/A"}</td>
                  <td className="px-4 py-2 border-t border-gray-200">{inquiry.service?.services_name || "N/A"}</td>
                  <td className="px-4 py-2 border-t border-gray-200">{inquiry.status}</td>
                  <td className="px-4 py-2 border-t border-gray-200">
                    <button onClick={() => handleAcceptClick(inquiry)} className="bg-green-500 text-white px-4 py-2 rounded mr-2">
                      <MdDataSaverOn />
                    </button>
                    <Tooltip id="my-tooltip" />
                    <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => handleDeleteInquiry(inquiry._id)}>
                      <MdDeleteForever />
                    </button>
                    <Tooltip id="delete-tooltip" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    




{isModalOpen && selectedUser && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
    <div className="bg-white rounded-lg shadow-lg w-96 p-6 z-10">
      <h2 className="text-lg font-bold mb-4 text-center bg-green-600 py-2">User Accepted</h2>
      <p className='text-black'><strong>Name:</strong> {selectedUser.user?.username || "N/A"}</p>
      <p className='text-black'><strong>Email:</strong> {selectedUser.user?.useremail || "N/A"}</p>
      <p className='text-black'><strong>Contact:</strong> {selectedUser.user?.usercontactno || "N/A"}</p>
      <p className='text-black'><strong>Address:</strong> {selectedUser.user?.address || "N/A"}</p>
      
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input type="date" className="mt-1 block text-black w-full px-3 py-2 border border-gray-300 rounded-md" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Time</label>
        <input type="time" className="mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md" value={time} onChange={(e) => setTime(e.target.value)} />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Message</label>
        <textarea rows={3} className="mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md" value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select className="mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="mt-6 flex justify-between">
        <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2" onClick={handleCloseModal}>Close</button>
        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleConfirmOrder}>Confirm Order</button>
      </div>
    </div>
  </div>
)}

    </>
  );
};

export default Orders;
