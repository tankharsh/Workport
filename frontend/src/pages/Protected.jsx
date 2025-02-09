import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import AuthContext

const SPProtectedRoute = () => {
    const { serviceprovider } = useAuth(); // Get service provider from context

    return serviceprovider ? <Outlet /> : <Navigate to="/" />;
};

export default SPProtectedRoute;
