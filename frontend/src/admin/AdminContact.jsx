import { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import { MdDeleteForever, MdSearch, MdEmail, MdCheck, MdClose } from 'react-icons/md';
import { FaEye } from "react-icons/fa";
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

function AdminContact() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [replyText, setReplyText] = useState("");

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
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/api/contact');

      console.log('Fetched contacts:', response.data);
      setContacts(response.data.data || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setError('Error fetching contacts: ' + (error.response?.data?.message || error.message));
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch contact messages. Please try again.',
        confirmButtonColor: '#10B981'
      });
    } finally {
      setLoading(false);
    }
  };

  const openModal = (contact) => {
    setCurrentContact(contact);
    setReplyText("");
    setIsModalOpen(true);

    // If the contact is unread, mark it as read
    if (contact.status === 'unread') {
      updateContactStatus(contact._id, 'read');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentContact(null);
    setReplyText("");
  };

  const updateContactStatus = async (id, status) => {
    try {
      await axios.patch(`http://localhost:4000/api/contact/${id}/status`,
        { status }
      );

      // Update the contact in the local state
      setContacts(contacts.map(contact =>
        contact._id === id ? { ...contact, status } : contact
      ));

      // If the modal is open and this is the current contact, update it
      if (currentContact && currentContact._id === id) {
        setCurrentContact({ ...currentContact, status });
      }

    } catch (error) {
      console.error('Error updating contact status:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update contact status. Please try again.',
        confirmButtonColor: '#10B981'
      });
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Empty Reply',
        text: 'Please enter a reply message.',
        confirmButtonColor: '#10B981'
      });
      return;
    }

    try {
      // In a real application, you would send the reply via email
      // For now, we'll just mark the contact as replied
      await updateContactStatus(currentContact._id, 'replied');

      Swal.fire({
        icon: 'success',
        title: 'Reply Sent!',
        text: 'Your reply has been sent successfully.',
        confirmButtonColor: '#10B981'
      });

      closeModal();
    } catch (error) {
      console.error('Error sending reply:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to send reply. Please try again.',
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
          await axios.delete(`http://localhost:4000/api/contact/${id}`);

          setContacts(contacts.filter(contact => contact._id !== id));

          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Contact message has been deleted.',
            confirmButtonColor: '#10B981'
          });
        } catch (error) {
          console.error('Error deleting contact:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete contact message. Please try again.',
            confirmButtonColor: '#10B981'
          });
        }
      }
    });
  };

  // Filter contacts based on search term and status
  const filteredContacts = contacts.filter(contact => {
    // Status filter
    if (statusFilter !== 'all' && contact.status !== statusFilter) {
      return false;
    }

    // Search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        (contact.name && contact.name.toLowerCase().includes(searchLower)) ||
        (contact.email && contact.email.toLowerCase().includes(searchLower)) ||
        (contact.message && contact.message.toLowerCase().includes(searchLower))
      );
    }

    return true;
  });

  // Format date
  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'unread':
        return 'bg-yellow-100 text-yellow-800';
      case 'read':
        return 'bg-blue-100 text-blue-800';
      case 'replied':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchContacts}
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
            <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and respond to contact form submissions</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filter Bar */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative w-full sm:w-64">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">All Messages</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
              </select>

              <button
                onClick={fetchContacts}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Contacts Table */}
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <AnimatePresence>
                      {filteredContacts.map((contact, index) => (
                        <motion.tr
                          key={contact._id}
                          variants={rowVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className={`hover:bg-gray-50 transition-colors ${contact.status === 'unread' ? 'bg-yellow-50' : ''}`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{contact.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{formatDate(contact.createdAt)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(contact.status)}`}>
                              {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => openModal(contact)}
                              className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <FaEye className="mr-1" />
                              View
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDelete(contact._id)}
                              className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                              <MdDeleteForever className="mr-1" />
                              Delete
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                    {filteredContacts.length === 0 && !loading && (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                          {searchTerm ? (
                            <>No messages found matching &quot;<span className="font-medium">{searchTerm}</span>&quot;</>
                          ) : statusFilter !== 'all' ? (
                            <>No {statusFilter} messages found</>
                          ) : (
                            <>No contact messages found</>
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>

        {/* View/Reply Modal */}
        <AnimatePresence>
          {isModalOpen && currentContact && (
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
                className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden"
              >
                <div className="bg-emerald-600 text-white p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold">
                      Contact Message
                    </h3>
                    <button
                      onClick={closeModal}
                      className="text-white hover:text-gray-200 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">Message Details</h4>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(currentContact.status)}`}>
                        {currentContact.status.charAt(0).toUpperCase() + currentContact.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">From</p>
                        <p className="font-medium">{currentContact.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{currentContact.email}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{formatDate(currentContact.createdAt)}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-2">Message</p>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="whitespace-pre-wrap">{currentContact.message}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Reply</h4>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply here..."
                      rows="4"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                    ></textarea>
                  </div>

                  <div className="flex justify-between mt-6">
                    <div className="space-x-2">
                      <button
                        onClick={() => updateContactStatus(currentContact._id, 'read')}
                        className={`px-3 py-1.5 rounded-lg border ${currentContact.status === 'read' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                      >
                        <MdCheck className="inline mr-1" />
                        Mark as Read
                      </button>
                      <button
                        onClick={() => updateContactStatus(currentContact._id, 'unread')}
                        className={`px-3 py-1.5 rounded-lg border ${currentContact.status === 'unread' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                      >
                        <MdClose className="inline mr-1" />
                        Mark as Unread
                      </button>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSendReply}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
                    >
                      <MdEmail className="mr-2" />
                      Send Reply
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

export default AdminContact;