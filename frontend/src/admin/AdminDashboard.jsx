import React from 'react'
import AdminSidebar from './AdminSidebar';
import { Helmet } from "react-helmet-async";
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { FaRobot, FaUsers, FaToolbox, FaChartLine } from "react-icons/fa";

function AdminDashboard() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const cards = [
    {
      title: "Chatbot Management",
      description: "Add, edit, and manage FAQs for the chatbot",
      icon: <FaRobot className="text-3xl text-emerald-600" />,
      link: "/Admin-Dashboard/chatbot-faqs",
      stats: "200+ FAQs"
    },
    {
      title: "User Management",
      description: "Manage and monitor user accounts",
      icon: <FaUsers className="text-3xl text-blue-600" />,
      link: "/Admin-Dashboard/all-users",
      stats: "1.2k Users"
    },
    {
      title: "Service Providers",
      description: "Monitor and manage service providers",
      icon: <FaToolbox className="text-3xl text-purple-600" />,
      link: "/Admin-Dashboard/all-serviceproviders",
      stats: "500+ Providers"
    },
    {
      title: "Analytics",
      description: "View platform statistics and growth",
      icon: <FaChartLine className="text-3xl text-orange-600" />,
      link: "/Admin-Dashboard/analytics",
      stats: "Daily Updates"
    }
  ];

  return (
    <div>
      <Helmet>
        <title>Admin Dashboard</title>
        <meta name="description" content="Admin dashboard for WorkPorts platform management." />
        <meta name="author" content="WorkPorts Admin Team" />
      </Helmet>
      <AdminSidebar />
      <motion.main 
        className="flex-1 lg:ml-64 min-h-screen bg-gray-50"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header Section */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Monitor and manage your platform</p>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
          >
            {cards.map((card, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <Link to={card.link} className="block p-6">
                  <div className="flex items-center justify-between mb-4">
                    {card.icon}
                    <span className="text-sm font-medium text-gray-500">{card.stats}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h3>
                  <p className="text-gray-600 text-sm">{card.description}</p>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions Section */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 text-center rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                >
                  Add Category
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 text-center rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  View Reports
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 text-center rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
                >
                  Manage FAQs
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 text-center rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors"
                >
                  System Settings
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.main>
    </div>
  )
}

export default AdminDashboard