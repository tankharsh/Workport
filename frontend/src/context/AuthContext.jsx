import React, { createContext, useState } from 'react';
import axois from 'axios';

const API_URI = "http://localhost:3000/api/users"
const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    

    return (
        <AuthContext.Provider value={{  user, token }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;