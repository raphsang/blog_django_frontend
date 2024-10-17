// src/components/LogoutButton.js
import React from 'react';
import { useAuth } from '../context/AuthContext'; // Import useAuth to get authentication state

const LogoutButton = () => {
    const { isAuthenticated, logout } = useAuth(); // Use authentication state and logout function

    const handleLogout = async () => {
        try {
            await logout(); // Call logout function
            // Redirect to home or any other page after logout
            window.location.href = '/'; // Redirect to home page
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    if (!isAuthenticated) return null; // Don't render button if not authenticated

    return (
        <button className="logout-button" onClick={handleLogout}>
            Logout
        </button>
    );
};

export default LogoutButton;
