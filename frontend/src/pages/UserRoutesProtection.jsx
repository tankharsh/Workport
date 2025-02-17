import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UserRoutesProtection = () => {
    const { serviceprovider } = useAuth();
    const location = useLocation();

    // Agar service provider logged in hai aur user routes pe aane ki koshish kar raha hai, toh dashboard pe bhejo
    if (serviceprovider) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default UserRoutesProtection;
