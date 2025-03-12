import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SPProtectedRoute = () => {
    const { serviceprovider, setServiceprovider } = useAuth();
    const spToken = localStorage.getItem('SP_token');
    const spData = localStorage.getItem('serviceProvider');
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // If token exists but serviceprovider state is not set, set it from localStorage
        if (spToken && spData && !serviceprovider) {
            try {
                const parsedData = JSON.parse(spData);
                if (parsedData) {
                    setServiceprovider(parsedData);
                }
            } catch (error) {
                console.error("Error parsing service provider data:", error);
                localStorage.removeItem('SP_token');
                localStorage.removeItem('serviceProvider');
                navigate('/sp-provider-login-new', { replace: true });
            }
        }
        setIsLoading(false);
    }, [serviceprovider, setServiceprovider, spToken, spData, navigate]);

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="p-8 bg-white rounded-lg shadow-md">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
                        <p className="mt-4 text-lg font-semibold text-gray-700">Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    // If service provider token doesn't exist, redirect to login page
    if (!spToken) {
        return <Navigate to="/sp-provider-login-new" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default SPProtectedRoute;
