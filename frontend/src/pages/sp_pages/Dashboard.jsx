import React, { useRef } from 'react'
import Sidebar from '../../components/sp_components/Sidebar';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Helmet } from 'react-helmet-async';


const Dashboard = () => {

    // animation 
    const desRef = useRef();
    useGSAP(() =>{
        gsap.from(desRef.current, {
            scale:0,
            duration:0.5,
            y:300,
            delay:0.3
        })
    })

    return (
        <>
        <Helmet>
            <title>Service Provider | Dashboard</title>
            <meta name="description" content="Dashboard" />
        </Helmet>
            <Sidebar />
            <main className="flex-1 lg:ml-64 py-2 mt-20">
                <div className='text-3xl font-bold mt-2 ml-3'>Welcome...</div>
                <div ref={desRef} className="flex flex-col md:flex-row md:justify-between w-[90%] mt-3 space-y-3 md:space-y-0 md:space-x-4 md:m-3">
                    <div className="bg-green-600 w-full md:w-[45%] h-24 rounded-md text-2xl flex justify-center items-center font-bold hover:scale-95 hover:bg-green-700 hover:duration-300">
                        Request Completed : 00
                    </div>
                    <div className="bg-red-600 w-full md:w-[45%] h-24 rounded-md text-2xl flex justify-center items-center font-bold hover:scale-95 hover:bg-red-700 hover:duration-300">
                        Request Pending : 00
                    </div>
                </div>
            </main>
        </>
    )
}

export default Dashboard