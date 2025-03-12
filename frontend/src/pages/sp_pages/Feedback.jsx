import React, { useState } from 'react';
import Sidebar from '../../components/sp_components/Sidebar';
import { MdDeleteForever, MdSearch, MdStar, MdStarBorder } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from 'react-tooltip';
import Swal from 'sweetalert2';

const Feedback = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [feedbacks] = useState([
    {
      id: 1,
      userName: "John Doe",
      email: "john@example.com",
      contact: "123-456-7890",
      message: "Great service! Very professional and timely.",
      rating: 5,
      date: "2024-03-15"
    },
    {
      id: 2,
      userName: "Jane Smith",
      email: "jane@example.com",
      contact: "987-654-3210",
      message: "Good experience overall. Would recommend.",
      rating: 4,
      date: "2024-03-14"
    },
  ]);

  // Animation variants
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

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This feedback will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        // Delete logic here
        Swal.fire("Deleted!", "Feedback has been deleted.", "success");
      }
    });
  };

  const RatingStars = ({ rating }) => {
    return (
      <div className="flex items-center text-yellow-400">
        {[...Array(5)].map((_, index) => (
          index < rating ? 
            <MdStar key={index} className="w-5 h-5" /> : 
            <MdStarBorder key={index} className="w-5 h-5" />
        ))}
      </div>
    );
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
                <h1 className="text-2xl font-bold text-gray-900">Customer Feedback</h1>
                <p className="text-sm text-gray-500 mt-1">View and manage customer reviews and feedback</p>
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
                  placeholder="Search feedback..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
          layout
        >
          <motion.div 
            className="bg-white rounded-xl shadow-sm overflow-hidden"
            layout
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Info</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <AnimatePresence mode="popLayout">
                    {feedbacks.map((feedback, index) => (
                      <motion.tr
                        key={feedback.id}
                        variants={tableRowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{feedback.userName}</div>
                          <div className="text-sm text-gray-500">{feedback.email}</div>
                          <div className="text-sm text-gray-500">{feedback.contact}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <RatingStars rating={feedback.rating} />
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900 line-clamp-2">{feedback.message}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(feedback.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <motion.button
                            onClick={() => handleDelete(feedback.id)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-200"
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            data-tooltip-id="delete-tooltip"
                            data-tooltip-content="Delete Feedback"
                          >
                            <MdDeleteForever className="w-5 h-5" />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      </motion.main>

      <Tooltip
        id="delete-tooltip"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          color: "white",
          borderRadius: "6px",
          padding: "6px 12px",
          fontSize: "12px"
        }}
        delayShow={200}
      />
    </>
  );
};

export default Feedback;