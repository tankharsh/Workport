import React, { createContext, useState, useEffect, useContext } from 'react';
import Popup from '../components/user_components/Popup';

// APIs 
const USER_API_URI = "http://localhost:4000/api/users";
const SERVICE_PROVIDER_API_URI = "http://localhost:4000/api/sp";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [serviceprovider, setServiceprovider] = useState(null);

    const [popupMessage, setPopupMessage] = useState("");

    //*----------------------------------------------------------------
    // USERS TOKEN LOGIC **START** HERE
    //*----------------------------------------------------------------

    // ***  user from localStorage 
    useEffect(() => {
        const userToken = localStorage.getItem('token');
        if (userToken) {
            setUser(JSON.parse(localStorage.getItem('loggedInUser')));
        }
    }, []);

    // *** Store user token 
    const storeUserToken = (token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('loggedInUser', JSON.stringify(userData));
        setUser(userData);
    };

    // *** USER - fetch the profile  
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
    // *** USER - fetch Profile ends  


    // *** USER - logout 
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        setUser(null);
        console.log("User logged out successfully");
        showPopup('Logout Successful!', 'success');
    };

    //*----------------------------------------------------------------
    // USERS TOKEN LOGIC **ENDs** HERE
    //*----------------------------------------------------------------


    // *** Popup Message 
    const showPopup = (message, type) => {
        setPopupMessage({ message, type });
        setTimeout(() => {
            setPopupMessage("");
        }, 1000);
    };

    //*----------------------------------------------------------------
    //  SERVICE PROVIDER TOKEN LOGIC **START** HERE
    //*----------------------------------------------------------------

    // *** SERVICE PROVIDER -  from localStorage 
    useEffect(() => {
        const spToken = localStorage.getItem('SP_token');
        const spData = localStorage.getItem('SP_LoggedInUser');

        if (spToken && spData) {
            try {
                setServiceprovider(JSON.parse(spData));
            } catch (error) {
                console.error("Error parsing SP_LoggedInUser:", error);
                setServiceprovider(null);
            }
        }
    }, []);

    // *** SERVICE PROVIDER - Store token 
    const storeSPToken = (token, spData) => {
        localStorage.setItem('SP_token', token);
        localStorage.setItem('SP_LoggedInUser', JSON.stringify(spData));
        setServiceprovider(spData);
    };

    // *** SERVICE PROVIDER - fetch profile 
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
                setServiceprovider(data.serviceprovider);
            } else {
                console.error("Failed to fetch user profile:", data.message);
                spLogout(); // Logout if token is invalid
            }
        } catch (error) {
            console.error("Error fetching Service Provider profile:", error);
        }
    };
    // *** SERVICE PROVIDER - fetch profile ends 

    // *** SERVICE PROVIDER - Logout 
    const spLogout = () => {
        localStorage.removeItem('SP_token');
        localStorage.removeItem('SP_LoggedInUser');
        setServiceprovider(null);
    };

    //*----------------------------------------------------------------
    //  SERVICE PROVIDER TOKEN LOGIC **ENDs**  HERE
    //*----------------------------------------------------------------

    return (
        <AuthContext.Provider
            value=
            {{
                storeUserToken,
                logout,
                user,
                showPopup,
                serviceprovider,
                spLogout,
                storeSPToken
            }}
        >
            {children}
            {popupMessage &&
                <Popup
                    message={popupMessage.message}
                    type={popupMessage.type}
                    onClose={() => setPopupData(null)}
                />}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);