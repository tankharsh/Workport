import React, { createContext, useState, useEffect } from 'react';
import Popup from '../components/user_components/Popup';
import { Navigate } from "react-router-dom"; 

const USER_API_URI = "http://localhost:4000/api/users";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [popupMessage, setPopupMessage] = useState("");
    const [redirect, setRedirect] = useState(false); 
    // Load user from localStorage on component mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setUser(token)
            fetchUserProfile(token);
        }
    }, []);

    const fetchUserProfile = async (id, token) => {
        try {
            const res = await fetch(`${USER_API_URI}/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();

            if (res.ok) {
                setUser(data.user);
            } else {
                console.error("Failed to fetch user profile:", data.message);
                logout(); // Logout if token is invalid
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };

    const login = async (credentials) => {
        try {
            const res = await fetch(`${USER_API_URI}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            const data = await res.json();

            if (res.ok) {
                console.log("Login successful:", data);
                localStorage.setItem('token', data.token);
                localStorage.setItem('loggedInUser', JSON.stringify(data));
                showPopup('Login Successful !', 'success')
                setUser(data.user);
                setRedirect(true)
            } else {
                showPopup('Login Failed: ' + (data.message || "Unknown error"), 'error');
                console.error("Login failed:", data.message || "Unknown error");
            }
        } catch (error) {
            console.error("Unexpected error during login:", error);
        }
    };
    // if (redirect) {
    //     return <Navigate to="/User-Dashboard" />;
    // }

    const register = async (details) => {
        try {
            const res = await fetch(`${USER_API_URI}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(details),
            });

            const data = await res.json();

            if (res.ok) {
                showPopup('Registration Successful !', 'success')
                console.log("Registration successful:", data.message);
            } else {
                showPopup('Registration failed !', 'success')
                console.error("Registration failed:", data.message);
            }
        } catch (error) {
            console.error('Registration Error:', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        setUser(null);
        console.log("User logged out successfully");
        showPopup('Logout Successful!', 'success');
    };

    const showPopup = (message, type) => {
        setPopupMessage({ message, type });
        setTimeout(() => {
            setPopupMessage("");
        }, 1000);
    };

    return (
        <AuthContext.Provider value={{ login, register, logout, user, showPopup }}>
            {children}
            {popupMessage && <Popup message={popupMessage.message} type={popupMessage.type} onClose={() => setPopupData(null)} />}
        </AuthContext.Provider>
    );
};

export default AuthContext;
