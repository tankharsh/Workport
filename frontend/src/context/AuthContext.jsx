import React, { createContext, useState } from 'react';


const USER_API_URI = "http://localhost:4000/api/users"
const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const login = async (credentials) => {
        try {
            const res = await fetch('http://localhost:4000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            // Parse response
            const data = await res.json();

            // Handle response based on status
            if (res.ok) {
                console.log("Login successful:", data);
                setUser(data.user);
                localStorage.setItem('token', data.token);
            } else {
                console.error("Login failed:", data.message || "Unknown error");
            }
        } catch (error) {
            console.error("Unexpected error during login:", error);
        }
    };


    const register = async (details) => {
        try {
            const res = await fetch(`${USER_API_URI}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(details),
            });
            const data = await res.json();

            if (res.ok) {
                console.log("Registration successfull: ", data.message);
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Registration Error', error)
        }
    }

    return (
        <AuthContext.Provider value={{ login, register, user }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;