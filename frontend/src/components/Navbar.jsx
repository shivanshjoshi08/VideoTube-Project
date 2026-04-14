import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function Navbar() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            navigate('/');
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
                    ▶ VideoTube
                </Link>

                {/* Only show these links when logged in */}
                {currentUser && (
                    <div style={{ marginLeft: '20px', display: 'flex', gap: '15px' }}>
                        <Link to="/" style={{ fontWeight: 'bold' }}>Home</Link>
                        <Link to="/upload">Upload</Link>
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/history">History</Link>
                        <Link to="/playlists">Playlists</Link>
                    </div>
                )}
            </div>

            {/* Search only shown when logged in */}
            {currentUser && (
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
            )}

            <div className="navbar-end">
                {currentUser ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <Link to="/settings" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                            <img
                                src={currentUser.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(currentUser.username || 'User') + '&background=6366f1&color=fff'}
                                alt="avatar"
                                className="nav-avatar"
                            />
                            <span style={{ fontWeight: '500', color: 'var(--text-main)' }}>{currentUser.username}</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="btn-secondary"
                            style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <Link to="/login" style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Login</Link>
                        <Link
                            to="/register"
                            className="btn-primary"
                            style={{ textDecoration: 'none', padding: '0.45rem 1.2rem', fontSize: '0.9rem' }}
                        >
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
