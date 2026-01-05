import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function Navbar() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    // ... inside Navbar component

    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            navigate('/login');
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-start">
                <Link to="/" className="navbar-brand">
                    VideoTube
                </Link>
                <div style={{ marginLeft: '20px' }}>
                    <Link to="/" style={{ marginRight: '15px', fontWeight: 'bold' }}>Home</Link>
                    <Link to="/upload" style={{ marginRight: '15px' }}>Upload</Link>
                    <Link to="/dashboard" style={{ marginRight: '15px' }}>Dashboard</Link>
                </div>
            </div>

            <div className="navbar-center">
                <form className="search-box" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit">Search</button>
                </form>
            </div>

            <div className="navbar-end">
                {currentUser ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img
                                src={currentUser.avatar || "https://via.placeholder.com/150"}
                                alt="avatar"
                                className="nav-avatar"
                            />
                            <span style={{ fontWeight: '500' }}>{currentUser.username}</span>
                        </div>
                        <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>Logout</button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <Link to="/login">Login</Link>
                        <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', padding: '5px 15px' }}>Register</Link>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
