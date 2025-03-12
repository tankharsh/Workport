import React, { useEffect, useRef, useState } from 'react'
import Sidebar from '../../components/sp_components/Sidebar';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaShop, FaUsers, FaClipboardList, FaStar, FaChartLine, FaBell, FaCalendarCheck, FaMoneyBillWave } from 'react-icons/fa6';

const Dashboard = () => {
    const { serviceprovider } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalServices: 0,
        pendingRequests: 0,
        completedRequests: 0,
        rating: 0,
        totalEarnings: 0,
        monthlyBookings: 0
    });

    // animation refs
    const mainRef = useRef();
    const welcomeRef = useRef();
    const shopRef = useRef();
    const statsRef = useRef();
    const actionsRef = useRef();

    useGSAP(() => {
        const timeline = gsap.timeline({
            defaults: {
                ease: "power2.out",
                duration: 0.6
            }
        });
        
        // Initial fade in of the main container
        timeline.fromTo(mainRef.current, 
            { opacity: 0 },
            { opacity: 1, duration: 0.3 }
        )
        // Welcome section slides in from top
        .fromTo(welcomeRef.current,
            { y: -50, opacity: 0 },
            { y: 0, opacity: 1 }
        )
        // Shop info card slides in and fades
        .fromTo(shopRef.current,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1 },
            "-=0.4"
        )
        // Stats cards stagger in from bottom
        .fromTo(statsRef.current.children,
            { 
                y: 50,
                opacity: 0,
                scale: 0.9
            },
            { 
                y: 0,
                opacity: 1,
                scale: 1,
                stagger: 0.1,
                duration: 0.4
            },
            "-=0.3"
        )
        // Quick action buttons slide in from left with stagger
        .fromTo(actionsRef.current.children,
            {
                x: -30,
                opacity: 0,
                scale: 0.9
            },
            {
                x: 0,
                opacity: 1,
                scale: 1,
                stagger: 0.1,
                duration: 0.4
            },
            "-=0.2"
        );
    }, []);

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
            <main ref={mainRef} className="flex-1 lg:ml-64 mt-8 min-h-screen bg-gray-50">
                {/* Top Bar with Notifications */}
                <div className="bg-white shadow-sm py-4 px-8 flex justify-between items-center sticky top-0 z-10">
                    <div className="flex items-center space-x-4">
                        <FaChartLine className="text-emerald-600 text-2xl" />
                        <h2 className="text-xl font-semibold text-gray-800">Dashboard Overview</h2>
                    </div>
                    <button className="p-2 rounded-full hover:bg-gray-100 relative transition-colors duration-200">
                        <FaBell className="text-gray-600 text-xl" />
                        <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center transform scale-100 hover:scale-110 transition-transform duration-200">3</span>
                    </button>
                </div>

                <div className="p-8">
                    {/* Welcome Section */}
                    <div ref={welcomeRef} className="mb-8 bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-2xl p-8 text-white shadow-lg transform hover:shadow-xl transition-all duration-300">
                        <h1 className="text-3xl font-bold mb-2">
                            Welcome back, {serviceprovider.spName}!
                        </h1>
                        <p className="text-emerald-100 text-lg">
                            Here&apos;s what&apos;s happening with your business today
                        </p>
                    </div>

                    {/* Shop Info Card */}
                    <div ref={shopRef} className="bg-white rounded-2xl shadow-md p-6 mb-8 transform hover:scale-[1.01] hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center mb-4">
                            <div className="p-3 bg-emerald-100 rounded-xl mr-4 transform hover:rotate-6 transition-transform duration-300">
                                <FaShop className="text-3xl text-emerald-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">{serviceprovider.spShopName}</h2>
                                <p className="text-gray-600">{serviceprovider.spArea}, {serviceprovider.spCity}</p>
                            </div>
                            <button 
                                onClick={() => navigate('/myshop')}
                                className="ml-auto px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transform hover:scale-105 transition-all duration-300"
                            >
                                Manage Shop
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                                <FaUsers className="text-gray-500 mr-2 transform group-hover:scale-110 transition-transform duration-300" />
                                <span className="text-gray-700">{serviceprovider.spContact}</span>
                            </div>
                            <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                                <FaStar className="text-yellow-500 mr-2 transform group-hover:scale-110 transition-transform duration-300" />
                                <span className="text-gray-700">{stats.rating || 0} Rating</span>
                            </div>
                            <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                                <FaCalendarCheck className="text-emerald-500 mr-2 transform group-hover:scale-110 transition-transform duration-300" />
                                <span className="text-gray-700">{stats.monthlyBookings || 0} Bookings this month</span>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Grid */}
                    <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Total Services */}
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl shadow-md p-6 transform hover:scale-[1.02] hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-white/10 rounded-lg transform hover:rotate-6 transition-transform duration-300">
                                    <FaClipboardList className="text-2xl" />
                                </div>
                                <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">Services</span>
                            </div>
                            <h3 className="text-3xl font-bold">{stats.totalServices}</h3>
                            <p className="text-blue-100 mt-1">Total Services</p>
                        </div>

                        {/* Pending Requests */}
                        <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-2xl shadow-md p-6 transform hover:scale-[1.02] hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-white/10 rounded-lg transform hover:rotate-6 transition-transform duration-300">
                                    <FaClipboardList className="text-2xl" />
                                </div>
                                <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">Pending</span>
                            </div>
                            <h3 className="text-3xl font-bold">{stats.pendingRequests}</h3>
                            <p className="text-amber-100 mt-1">Pending Requests</p>
                        </div>

                        {/* Completed Requests */}
                        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl shadow-md p-6 transform hover:scale-[1.02] hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-white/10 rounded-lg transform hover:rotate-6 transition-transform duration-300">
                                    <FaClipboardList className="text-2xl" />
                                </div>
                                <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">Completed</span>
                            </div>
                            <h3 className="text-3xl font-bold">{stats.completedRequests}</h3>
                            <p className="text-emerald-100 mt-1">Completed Requests</p>
                        </div>

                        {/* Total Earnings */}
                        <div className="bg-gradient-to-br from-violet-500 to-violet-600 text-white rounded-2xl shadow-md p-6 transform hover:scale-[1.02] hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-white/10 rounded-lg transform hover:rotate-6 transition-transform duration-300">
                                    <FaMoneyBillWave className="text-2xl" />
                                </div>
                                <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">Earnings</span>
                            </div>
                            <h3 className="text-3xl font-bold">₹{stats.totalEarnings || 0}</h3>
                            <p className="text-violet-100 mt-1">Total Earnings</p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
                        <div ref={actionsRef} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button
                                onClick={() => navigate('/addservice')}
                                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-4 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
                            >
                                <FaClipboardList className="text-xl transform group-hover:rotate-6 transition-transform duration-300" />
                                <span>Add New Service</span>
                            </button>
                            <button
                                onClick={() => navigate('/myshop')}
                                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
                            >
                                <FaShop className="text-xl transform group-hover:rotate-6 transition-transform duration-300" />
                                <span>Manage Shop</span>
                            </button>
                            <button
                                onClick={() => navigate('/order')}
                                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-violet-500 to-violet-600 text-white py-3 px-4 rounded-xl hover:from-violet-600 hover:to-violet-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
                            >
                                <FaClipboardList className="text-xl transform group-hover:rotate-6 transition-transform duration-300" />
                                <span>View Orders</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Dashboard;