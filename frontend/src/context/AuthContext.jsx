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
    const [cartItems, setCartItems] = useState([]);

    //*----------------------------------------------------------------
    // USERS TOKEN LOGIC **START** HERE
    //*----------------------------------------------------------------

    useEffect(() => {
        const userToken = localStorage.getItem('token');
        const userData = localStorage.getItem('loggedInUser');
        if (userToken && userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const storeUserToken = (token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('loggedInUser', JSON.stringify(userData));
        localStorage.removeItem('SP_token');
        localStorage.removeItem('serviceProvider');
        setUser(userData);
    };

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
                logout();
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('cart');
        setUser(null);
        console.log("User logged out successfully");
        showPopup('Logout Successful!', 'success');
    };

    //*----------------------------------------------------------------
    // USERS TOKEN LOGIC **ENDs** HERE
    //*----------------------------------------------------------------


    //*----------------------------------------------------------------
    // SERVICE PROVIDER TOKEN LOGIC **START** HERE
    //*----------------------------------------------------------------

    useEffect(() => {
        const spToken = localStorage.getItem('SP_token');
        const spData = localStorage.getItem('serviceProvider');
        if (spToken && spData) {
            setServiceprovider(JSON.parse(spData));
        }
    }, [setServiceprovider]);

    const storeSPToken = (token, spData) => {
        localStorage.setItem('SP_token', token);
        localStorage.setItem('serviceProvider', JSON.stringify(spData));
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser')
        setServiceprovider(spData);
    };

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
                console.error("Failed to fetch service provider profile:", data.message);
                spLogout();
            }
        } catch (error) {
            console.error("Error fetching Service Provider profile:", error);
        }
    };

    const spLogout = () => {
        localStorage.removeItem('SP_token');
        localStorage.removeItem('serviceProvider');
        setServiceprovider(null);
        console.log("Service Provider logged out successfully");
        showPopup('Service Provider Logout Successful!', 'success');

        window.location.href = "/sp-provider-login-new"; 
    };

    //*----------------------------------------------------------------
    // SERVICE PROVIDER TOKEN LOGIC **ENDs** HERE
    //*----------------------------------------------------------------


    //*----------------------------------------------------------------
    // ADD TO CART LOGIC **START** HERE
    //*----------------------------------------------------------------

    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
    }, []);

    useEffect(() => {
        if (cartItems.length > 0) {
            localStorage.setItem("cart", JSON.stringify(cartItems));
        }
    }, [cartItems]);

    const addToCart = (item) => {
        const updatedCart = [...cartItems, item];
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const removeFromCart = (index) => {
        const updatedCart = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    //*----------------------------------------------------------------
    // ADD TO CART LOGIC **ENDs** HERE
    //*----------------------------------------------------------------


    // Popup Message Handler
    const showPopup = (message, type) => {
        setPopupMessage({ message, type });
        setTimeout(() => {
            setPopupMessage("");
        }, 1000);
    };

    return (
        <AuthContext.Provider
            value={{
                storeUserToken,
                logout,
                user,
                fetchUserProfile,
                serviceprovider,
                setServiceprovider,
                storeSPToken,
                fetchServiceProviderProfile,
                spLogout,
                cartItems,
                addToCart,
                removeFromCart,
                showPopup
            }}
        >
            {children}
            {popupMessage &&
                <Popup
                    message={popupMessage.message}
                    type={popupMessage.type}
                    onClose={() => setPopupMessage(null)}
                />}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
