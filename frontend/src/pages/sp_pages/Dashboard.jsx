import React from 'react'
import Sidebar from '../../components/serviceProvider/sp_components/Sidebar';


const Dashboard = () => {
    return (
        <>
            <Sidebar />
           
            

            <main className="flex-1 md:px-72 mx-2 py-2">
                <h1 className="text-2xl font-bold">Responsive Sidebar and Navbar</h1>
                <p className="mt-4">
                    The shop name and logout button are visible in the navbar for
                    desktop view and inside the sidebar for mobile view.
                </p>
            </main>
        </>
    )
}

export default Dashboard