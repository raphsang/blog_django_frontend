import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'https://raphsang.pythonanywhere.com/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        // Set Axios default headers based on token presence
        if (token) {
            axios.defaults.headers.Authorization = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.Authorization;
        }
    }, [token]);

    // Login function to authenticate user and set token
    const login = async (username, password) => {
        try {
            const response = await axios.post('/login/', { username, password });
            const { access, user } = response.data;
            setToken(access);
            localStorage.setItem('token', access);
            setUser(user);
        } catch (error) {
            console.error('Login error:', error.response ? error.response.data : error.message);
            throw new Error(error.response?.data?.detail || 'Login failed');
        }
    };

    // Signup function to register user and set token
    const signup = async (username, email, password) => {
        try {
            const response = await axios.post('/register/', { username, email, password });
            const { access, user } = response.data;
            setToken(access);
            localStorage.setItem('token', access);
            setUser(user);
        } catch (error) {
            console.error('Signup error:', error.response ? error.response.data : error.message);
            throw new Error(error.response?.data?.detail || 'Signup failed');
        }
    };

    // Logout function to clear user and token data
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        delete axios.defaults.headers.Authorization;
        window.location.reload(); // Refresh to clear app state
    };

    return (
        <AuthContext.Provider value={{ user, token, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for consuming authentication context
export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthContext;
