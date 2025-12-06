import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

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

    const handleSearch = (e) => {
        e.preventDefault();
        // Implement search navigation if needed, for now just log
        console.log("Searching for:", searchQuery);
    };

    return (
        <nav className="navbar">
            <div className="navbar-start">
                <button className="nav-icon-btn">☰</button>
                <Link to="/" className="navbar-brand">
                    <span className="navbar-logo-icon">▶</span>
                    <span>VideoTube</span>
                </Link>
            </div>

            <div className="navbar-center">
                <form className="search-box" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search"
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="search-btn">🔍</button>
                </form>
            </div>

            <div className="navbar-end">
                {currentUser ? (
                    <>
                        <Link to="/upload" className="nav-icon-btn" title="Create">📹</Link>
                        <button className="nav-icon-btn" title="Notifications">🔔</button>
                        <div className="user-avatar-btn" onClick={handleLogout} title="Logout">
                            {currentUser.avatar ? (
                                <img src={currentUser.avatar} alt="avatar" />
                            ) : (
                                <div style={{ width: '100%', height: '100%', background: '#555' }}></div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <button className="nav-icon-btn">⋮</button>
                        <Link to="/login" className="btn-primary" style={{ borderRadius: '20px', padding: '6px 16px', border: '1px solid #3ea6ff', background: 'none', color: '#3ea6ff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            👤 <span style={{ fontSize: '0.9rem' }}>Sign in</span>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
