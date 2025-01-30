import React from 'react'
import AdminSidebar from './AdminSidebar'
import { MdDataSaverOn, MdDeleteForever } from "react-icons/md";
import { Tooltip } from 'react-tooltip';


function AdminGetAllUser() {
  return (
    <div>
        <AdminSidebar />
        <main className="flex-1 lg:ml-64 py-2 mt-20">
      <div className='text-3xl text-center font-bold '>All Users</div>
      <div className="overflow-x-auto mt-3">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left font-bold text-gray-700">No.</th>
                <th className="px-4 py-2 text-left font-bold text-gray-700">User Name</th>
                <th className="px-4 py-2 text-left font-bold text-gray-700">Email</th>
                <th className="px-4 py-2 text-left font-bold text-gray-700">Contact</th>
                {/* <th className="px-4 py-2 text-left font-bold text-gray-700">Message</th> */}
                <th className="px-4 py-2 text-left font-bold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  id: 1,
                  userName: "John Doe",
                  email: "john@example.com",
                  contact: "123-456-7890",
                //   message: "123 Main St, New York"
                },
                {
                  id: 2,
                  userName: "John Doe",
                  email: "john@example.com",
                  contact: "123-456-7890",
                //   message: "123 Main St, New York"
                },
              ].map((user, index) => (
                <tr
                  key={user.id}
                  className="transition-all duration-300 ease-in-out transform hover:bg-gray-200"
                >
                  <td className="px-4 py-2 border-t border-gray-200">{index + 1}</td>
                  <td className="px-4 py-2 border-t border-gray-200">{user.userName}</td>
                  <td className="px-4 py-2 border-t border-gray-200">{user.email}</td>
                  <td className="px-4 py-2 border-t border-gray-200">{user.contact}</td>
                  {/* <td className="px-4 py-2 border-t border-gray-200">{user.message}</td> */}
                  <td className="px-4 py-2 border-t border-gray-200">
                    <button
                      data-tooltip-id="delete-tooltip"
                      data-tooltip-content="Delete"
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      <MdDeleteForever />
                    </button>
                    <Tooltip
                      id="delete-tooltip"
                      style={{
                        backgroundColor: "black",
                        color: "white",
                        borderRadius: "8px",
                        padding: "8px 12px",
                      }}
                      delayShow={200}
                      delayHide={200}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default AdminGetAllUser