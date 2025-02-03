import React, { createContext, useState, useEffect, useContext } from 'react';
import Popup from '../components/user_components/Popup';

const USER_API_URI = "http://localhost:4000/api/users";
const SERVICE_PROVIDER_API_URI = "http://localhost:4000/api/sp";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [serviceprovider, setServiceprovider] = useState(null);
    const [popupMessage, setPopupMessage] = useState("");

    // Load user from localStorage on component mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setUser(token)
            fetchUserProfile(token);
        }
    }, []);

    // *** fetch the profile *** 
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
    // *** fetch Profile ends *** 

    // *** user login ***
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
            } else {
                showPopup('Login Failed: ' + (data.message || "Unknown error"), 'error');
                console.error("Login failed:", data.message || "Unknown error");
            }
            
        } catch (error) {
            console.error("Unexpected error during login:", error);
        }
    };
    // *** user login ends ***

    // *** user registration ***
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
    // *** user registration ends *** 

    // *** logout ***
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        setUser(null);
        console.log("User logged out successfully");
        showPopup('Logout Successful!', 'success');
    };
    // *** logout ends ***

    // *** Popup Message ***
    const showPopup = (message, type) => {
        setPopupMessage({ message, type });
        setTimeout(() => {
            setPopupMessage("");
        }, 1000);
    };
    // *** Popup Message ends ***

/* =================================================================================
        **** SERVICE PROVIDER LOGIC HERE ****
==================================================================================*/
       
    // *** Service Provider fetch profile ***

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setServiceprovider(token)
            fetchServiceProviderProfile(token);
        }
    }, [])

    const fetchServiceProviderProfile = async (id, token) => {
        try {
            const res = await fetch(`${SERVICE_PROVIDER_API_URI}/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();

            if (res.ok) {
                setServiceprovider(data.user);
            } else {
                console.error("Failed to fetch user profile:", data.message);
                logout(); // Logout if token is invalid
            }
        } catch (error) {
            console.error("Error fetching Service Provider profile:", error);
        }
    };
    // *** Service Provider fetch profile ends ***

    // *** Service Provider Login ***
    const SP_login = async (credentials) => {
        try {
            const res = await fetch(`${SERVICE_PROVIDER_API_URI}//sp_login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials),
            });

            const data = await res.json();

            if (res.ok) {
                console.log("Service Provider Login Successful :", data);
                localStorage.setItem('SP_token', data.token);
                localStorage.setItem('SP_LoggedInUser', JSON.stringify(data));
                showPopup('Login Successful !', 'success')
                setServiceprovider(data.serviceprovider);
                setRedirect(true)
                navigate('/Dashboard')
            } else {
                showPopup('Login Failed : ' + (data.message || "Unknown error"), 'error');
                console.error("Login Failed : ", data.message || "Unknown error")
            }
            return { success: true, token: data.token };
        } catch (error) {
            console.error('Unexpected Error During Login :', error)
            return { success: false , message:"ERROR" };
        }
    }
    // *** Service Provider Login ends ***
/* ===============================================================================
        **** SERVICE PROVIDER LOGIC ENDS **** 
==================================================================================*/
   




    return (
        <AuthContext.Provider value={{ login, register, logout, user, showPopup, SP_login, serviceprovider }}>
            {children}
            {popupMessage && <Popup message={popupMessage.message} type={popupMessage.type} onClose={() => setPopupData(null)} />}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);