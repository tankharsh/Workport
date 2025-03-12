import React, { useEffect, useRef, useState } from 'react'
import Sidebar from '../../components/sp_components/Sidebar';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaShop, FaUsers, FaClipboardList, FaStar } from 'react-icons/fa6';

const Dashboard = () => {
    const { serviceprovider } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalServices: 0,
        pendingRequests: 0,
        completedRequests: 0,
        rating: 0
    });

    // animation 
    const desRef = useRef();
    useGSAP(() => {
        gsap.from(desRef.current, {
            scale: 0,
            duration: 0.5,
            y: 300,
            delay: 0.3
        })
    });

    useEffect(() => {
        // Fetch dashboard statistics
        const fetchStats = async () => {
            try {
                const response = await fetch(`http://localhost:4000/api/sp/dashboard-stats/${serviceprovider.id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('SP_token')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            }
        };

        if (serviceprovider?.id) {
            fetchStats();
        }
    }, [serviceprovider]);

    if (!serviceprovider) {
        return null;
    }

    return (
        <>
            <Helmet>
                <title>WorkPort | Dashboard</title>
                <meta name="description" content="Service Provider Dashboard - Manage your services and requests" />
            </Helmet>
            <Sidebar />
            <main className="flex-1 lg:ml-64 py-6 px-8 mt-20">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Welcome back, {serviceprovider.spName}!
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Manage your shop and services from your dashboard
                    </p>
                </div>

                {/* Shop Info Card */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex items-center mb-4">
                        <FaShop className="text-3xl text-blue-600 mr-4" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">{serviceprovider.spShopName}</h2>
                            <p className="text-gray-600">{serviceprovider.spArea}, {serviceprovider.spCity}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center">
                            <FaUsers className="text-gray-500 mr-2" />
                            <span className="text-gray-700">{serviceprovider.spContact}</span>
                        </div>
                        <div className="flex items-center">
                            <FaStar className="text-yellow-500 mr-2" />
                            <span className="text-gray-700">{stats.rating || 0} Rating</span>
                        </div>
                    </div>
                </div>

                {/* Statistics Grid */}
                <div ref={desRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Services */}
                    <div className="bg-blue-500 text-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-75">Total Services</p>
                                <h3 className="text-2xl font-bold mt-1">{stats.totalServices}</h3>
                            </div>
                            <FaClipboardList className="text-3xl opacity-75" />
                        </div>
                    </div>

                    {/* Pending Requests */}
                    <div className="bg-yellow-500 text-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-75">Pending Requests</p>
                                <h3 className="text-2xl font-bold mt-1">{stats.pendingRequests}</h3>
                            </div>
                            <FaClipboardList className="text-3xl opacity-75" />
                        </div>
                    </div>

                    {/* Completed Requests */}
                    <div className="bg-green-500 text-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-75">Completed Requests</p>
                                <h3 className="text-2xl font-bold mt-1">{stats.completedRequests}</h3>
                            </div>
                            <FaClipboardList className="text-3xl opacity-75" />
                        </div>
                    </div>

                    {/* Rating */}
                    <div className="bg-purple-500 text-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-75">Average Rating</p>
                                <h3 className="text-2xl font-bold mt-1">{stats.rating || 0}/5</h3>
                            </div>
                            <FaStar className="text-3xl opacity-75" />
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={() => navigate('/addservice')}
                            className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                            Add New Service
                        </button>
                        <button
                            onClick={() => navigate('/myshop')}
                            className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition duration-200"
                        >
                            Manage Shop
                        </button>
                        <button
                            onClick={() => navigate('/order')}
                            className="bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition duration-200"
                        >
                            View Orders
                        </button>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Dashboard;