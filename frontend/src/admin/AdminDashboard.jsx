import React from 'react'
import AdminSidebar from './AdminSidebar';
import { Helmet } from "react-helmet-async";
import { Link } from 'react-router-dom';

function AdminDashboard() {
  return (
    <div>
      <Helmet>
        <title>Admin Dashboard</title>
        <meta name="description" content="Know more about us." />
        <meta name="author" content="My Website Team" />
      </Helmet>
        <AdminSidebar />
        <main className="flex-1 lg:ml-64 py-2 mt-20">
        <h1>Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-4">Chatbot Management</h3>
            <p className="text-gray-600 mb-4">
              Add, edit, and manage FAQs for the chatbot
            </p>
            <Link
              to="/Admin-Dashboard/chatbot-faqs"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Manage FAQs
            </Link>
          </div>
        </div>
        </main>
       
    </div>
  )
}

export default AdminDashboard