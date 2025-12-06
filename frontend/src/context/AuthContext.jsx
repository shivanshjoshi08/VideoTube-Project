
import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await authService.getCurrentUser();
                setCurrentUser(response.data.data);
            } catch (error) {
                console.log("Not logged in");
                setCurrentUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const login = async (data) => {
        const response = await authService.login(data);
        setCurrentUser(response.data.data.user);
        return response;
    };

    const register = async (data) => {
        const response = await authService.register(data);
        setCurrentUser(response.data.data.user);
        return response;
    };

    const logout = async () => {
        await authService.logout();
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, register, logout, loading, setCurrentUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
