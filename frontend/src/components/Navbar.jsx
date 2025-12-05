import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

function Navbar() {
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('accessToken');

    const handleLogout = async () => {
        try {
            await api.post('/users/logout');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            navigate('/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">VideoTube</Link>
            </div>
            <div className="navbar-links">
                {accessToken ? (
                    <>
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/settings">Settings</Link>
                        <Link to="/upload">Upload</Link>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
