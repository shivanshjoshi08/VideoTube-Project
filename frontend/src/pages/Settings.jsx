import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import VideoCard from '../components/VideoCard';

function Settings() {
    const [activeTab, setActiveTab] = useState('profile');
    const [user, setUser] = useState(null);
    const [watchHistory, setWatchHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    // Profile Form States
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');

    // Password Form States
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Image Upload States
    const [avatar, setAvatar] = useState(null);
    const [coverImage, setCoverImage] = useState(null);

    // Session/Token States
    const [tokenRefreshStatus, setTokenRefreshStatus] = useState('');

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        if (activeTab === 'history') {
            fetchWatchHistory();
        }
    }, [activeTab]);

    const fetchCurrentUser = async () => {
        try {
            const response = await api.get('/users/current-user');
            setUser(response.data.data);
            setFullname(response.data.data.fullname);
            setEmail(response.data.data.email);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user', error);
            setLoading(false);
        }
    };

    const fetchWatchHistory = async () => {
        try {
            const response = await api.get('/users/history');
            setWatchHistory(response.data.data || []);
        } catch (error) {
            console.error('Error fetching history', error);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await api.patch('/users/update-account', { fullname, email });
            alert('Profile updated successfully');
            fetchCurrentUser();
        } catch (error) {
            console.error('Error updating profile', error);
            alert('Failed to update profile');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        try {
            await api.post('/users/change-password', { oldPassword, newPassword });
            alert('Password changed successfully');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error('Error changing password', error);
            alert('Failed to change password');
        }
    };

    const handleUpdateAvatar = async (e) => {
        e.preventDefault();
        if (!avatar) {
            alert('Please select an avatar file');
            return;
        }
        const formData = new FormData();
        formData.append('avatar', avatar);
        try {
            await api.patch('/users/update-avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Avatar updated successfully');
            setAvatar(null);
            fetchCurrentUser();
        } catch (error) {
            console.error('Error updating avatar', error);
            alert('Failed to update avatar');
        }
    };

    const handleUpdateCover = async (e) => {
        e.preventDefault();
        if (!coverImage) {
            alert('Please select a cover image file');
            return;
        }
        const formData = new FormData();
        formData.append('coverImage', coverImage);
        try {
            await api.patch('/users/update-cover-image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Cover image updated successfully');
            setCoverImage(null);
            fetchCurrentUser();
        } catch (error) {
            console.error('Error updating cover image', error);
            alert('Failed to update cover image');
        }
    };

    const handleRefreshToken = async () => {
        try {
            setTokenRefreshStatus('Refreshing...');
            const response = await api.post('/users/refresh-token');
            const { accessToken, refreshToken } = response.data.data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            setTokenRefreshStatus('Token refreshed successfully at ' + new Date().toLocaleTimeString());
        } catch (error) {
            console.error('Error refreshing token', error);
            setTokenRefreshStatus('Failed to refresh token');
        }
    };

    const handleLogout = async () => {
        try {
            await api.post('/users/logout');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
        } catch (error) {
            console.error('Error logging out', error);
        }
    };

    if (loading) return <div className="settings-loading">Loading settings...</div>;

    return (
        <div className="settings-container">
            <div className="settings-header">
                <h1>Settings</h1>
                <p className="settings-subtitle">Manage your account and preferences</p>
            </div>

            <div className="settings-layout">
                {/* Sidebar Navigation */}
                <aside className="settings-sidebar">
                    <nav className="settings-nav">
                        <button
                            className={`settings-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            👤 Profile
                        </button>
                        <button
                            className={`settings-nav-item ${activeTab === 'avatar' ? 'active' : ''}`}
                            onClick={() => setActiveTab('avatar')}
                        >
                            🖼️ Avatar & Cover
                        </button>
                        <button
                            className={`settings-nav-item ${activeTab === 'security' ? 'active' : ''}`}
                            onClick={() => setActiveTab('security')}
                        >
                            🔒 Security
                        </button>
                        <button
                            className={`settings-nav-item ${activeTab === 'session' ? 'active' : ''}`}
                            onClick={() => setActiveTab('session')}
                        >
                            🔑 Session
                        </button>
                        <button
                            className={`settings-nav-item ${activeTab === 'history' ? 'active' : ''}`}
                            onClick={() => setActiveTab('history')}
                        >
                            📺 Watch History
                        </button>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="settings-content">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="settings-section">
                            <h2>Profile Information</h2>
                            <p className="section-description">Update your basic profile details</p>
                            <form onSubmit={handleUpdateProfile} className="settings-form">
                                <div className="form-group">
                                    <label htmlFor="fullname">Full Name</label>
                                    <input
                                        id="fullname"
                                        type="text"
                                        value={fullname}
                                        onChange={(e) => setFullname(e.target.value)}
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn-primary">Save Changes</button>
                            </form>
                        </div>
                    )}

                    {/* Avatar & Cover Tab */}
                    {activeTab === 'avatar' && (
                        <div className="settings-section">
                            <h2>Avatar & Cover Image</h2>
                            <p className="section-description">Customize your profile appearance</p>

                            {/* Avatar Section */}
                            <div className="image-update-group">
                                <div className="image-preview">
                                    <h3>Profile Avatar</h3>
                                    {user?.avatar && (
                                        <img 
                                            src={user.avatar} 
                                            alt="Current Avatar" 
                                            className="avatar-preview"
                                        />
                                    )}
                                </div>
                                <form onSubmit={handleUpdateAvatar} className="settings-form">
                                    <div className="form-group">
                                        <label htmlFor="avatar">Choose Avatar Image</label>
                                        <input
                                            id="avatar"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setAvatar(e.target.files[0])}
                                        />
                                    </div>
                                    <button type="submit" className="btn-primary">Update Avatar</button>
                                </form>
                            </div>

                            <hr className="settings-divider" />

                            {/* Cover Image Section */}
                            <div className="image-update-group">
                                <div className="image-preview">
                                    <h3>Cover Image</h3>
                                    {user?.coverImage && (
                                        <img 
                                            src={user.coverImage} 
                                            alt="Current Cover" 
                                            className="cover-preview"
                                        />
                                    )}
                                </div>
                                <form onSubmit={handleUpdateCover} className="settings-form">
                                    <div className="form-group">
                                        <label htmlFor="cover">Choose Cover Image</label>
                                        <input
                                            id="cover"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setCoverImage(e.target.files[0])}
                                        />
                                    </div>
                                    <button type="submit" className="btn-primary">Update Cover</button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div className="settings-section">
                            <h2>Security Settings</h2>
                            <p className="section-description">Manage your password and security options</p>
                            <form onSubmit={handleChangePassword} className="settings-form">
                                <div className="form-group">
                                    <label htmlFor="oldPassword">Current Password</label>
                                    <input
                                        id="oldPassword"
                                        type="password"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        placeholder="Enter your current password"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="newPassword">New Password</label>
                                    <input
                                        id="newPassword"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter your new password"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm your new password"
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn-primary">Change Password</button>
                            </form>
                        </div>
                    )}

                    {/* Session Tab */}
                    {activeTab === 'session' && (
                        <div className="settings-section">
                            <h2>Session Management</h2>
                            <p className="section-description">Manage your login sessions and tokens</p>
                            
                            <div className="session-info">
                                <div className="session-item">
                                    <h3>Current Session</h3>
                                    <p>Logged in as: <strong>{user?.username}</strong></p>
                                    <p>Email: <strong>{user?.email}</strong></p>
                                </div>
                            </div>

                            <div className="session-actions">
                                <div className="action-group">
                                    <h3>Token Management</h3>
                                    <p className="action-description">Refresh your access token to extend your session</p>
                                    <button onClick={handleRefreshToken} className="btn-secondary">
                                        🔄 Refresh Access Token
                                    </button>
                                    {tokenRefreshStatus && (
                                        <p className="status-message">{tokenRefreshStatus}</p>
                                    )}
                                </div>

                                <hr className="settings-divider" />

                                <div className="action-group">
                                    <h3>Logout</h3>
                                    <p className="action-description">End your current session and logout</p>
                                    <button onClick={handleLogout} className="btn-danger">
                                        🚪 Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Watch History Tab */}
                    {activeTab === 'history' && (
                        <div className="settings-section">
                            <h2>Watch History</h2>
                            <p className="section-description">Videos you've recently watched</p>
                            <div className="video-grid">
                                {watchHistory.length > 0 ? (
                                    watchHistory.map((video) => (
                                        <VideoCard key={video._id} video={video} />
                                    ))
                                ) : (
                                    <p className="empty-state">No watch history found. Start watching videos!</p>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default Settings;
