import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { currentUser, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
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
                {currentUser ? (
                    <>
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/settings">Settings</Link>
                        <Link to="/upload">Upload</Link>
                        {currentUser.avatar && (
                            <img
                                src={currentUser.avatar}
                                alt="avatar"
                                style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', verticalAlign: 'middle', marginLeft: '10px' }}
                            />
                        )}
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
