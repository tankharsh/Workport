import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SPProtectedRoute = () => {
    const { serviceprovider } = useAuth();
    const spToken = localStorage.getItem('SP_token');
    const location = useLocation();

    // If service provider is not logged in, redirect to login page
    if (!serviceprovider || !spToken) {
        return <Navigate to="/sp-provider-login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default SPProtectedRoute;
