import React from 'react'
import AdminSidebar from './AdminSidebar';
import { Helmet } from "react-helmet-async";

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
        </main>
       
    </div>
  )
}

export default AdminDashboard