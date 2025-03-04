import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SPProtectedRoute = () => {
    const { serviceprovider } = useAuth();
    const spToken = localStorage.getItem('SP_token');
    const location = useLocation();

    // Agar service provider login nahi hai, toh usko login page pe bhejo
    if (!serviceprovider || !spToken) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default SPProtectedRoute;
