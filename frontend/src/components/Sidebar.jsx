import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    const activeStyle = { backgroundColor: 'var(--yt-hover)', fontWeight: 'bold' };

    return (
        <aside className="sidebar">
            <Link to="/" className="sidebar-link" style={isActive('/') ? activeStyle : {}}>
                <span className="sidebar-icon">🏠</span>
                <span className="sidebar-label">Home</span>
            </Link>
            <div className="sidebar-link" title="Coming Soon">
                <span className="sidebar-icon">⚡</span>
                <span className="sidebar-label">Shorts</span>
            </div>
            <div className="sidebar-link" title="Coming Soon">
                <span className="sidebar-icon">📺</span>
                <span className="sidebar-label">Subscriptions</span>
            </div>
            <hr style={{ borderColor: 'var(--yt-border)', margin: '12px 0' }} />
            <Link to="/dashboard" className="sidebar-link" style={isActive('/dashboard') ? activeStyle : {}}>
                <span className="sidebar-icon">📊</span>
                <span className="sidebar-label">Dashboard</span>
            </Link>
            <Link to="/upload" className="sidebar-link" style={isActive('/upload') ? activeStyle : {}}>
                <span className="sidebar-icon">📤</span>
                <span className="sidebar-label">Upload</span>
            </Link>
            <div className="sidebar-link" title="Coming Soon">
                <span className="sidebar-icon">📁</span>
                <span className="sidebar-label">Library</span>
            </div>
            <Link to="/history" className="sidebar-link" style={isActive('/history') ? activeStyle : {}}>
                <span className="sidebar-icon">🕒</span>
                <span className="sidebar-label">History</span>
            </Link>
            <hr style={{ borderColor: 'var(--yt-border)', margin: '12px 0' }} />
            <Link to="/settings" className="sidebar-link" style={isActive('/settings') ? activeStyle : {}}>
                <span className="sidebar-icon">⚙️</span>
                <span className="sidebar-label">Settings</span>
            </Link>
        </aside>
    );
}

export default Sidebar;
