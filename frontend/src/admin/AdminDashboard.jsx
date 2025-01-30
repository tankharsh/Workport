import React from 'react'
import AdminSidebar from './AdminSidebar'

function AdminDashboard() {
  return (
    <div>
        <AdminSidebar />
        <main className="flex-1 lg:ml-64 py-2 mt-20">
        <h1>Admin Dashboard</h1>
        </main>
       
    </div>
  )
}

export default AdminDashboard