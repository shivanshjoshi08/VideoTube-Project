import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import VideoCard from '../components/VideoCard';

function Dashboard() {
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

    // Image Upload States
    const [avatar, setAvatar] = useState(null);
    const [coverImage, setCoverImage] = useState(null);

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
        try {
            await api.post('/users/change-password', { oldPassword, newPassword });
            alert('Password changed successfully');
            setOldPassword('');
            setNewPassword('');
        } catch (error) {
            console.error('Error changing password', error);
            alert('Failed to change password');
        }
    };

    const handleUpdateAvatar = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('avatar', avatar);
        try {
            await api.patch('/users/update-avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Avatar updated successfully');
            fetchCurrentUser();
        } catch (error) {
            console.error('Error updating avatar', error);
            alert('Failed to update avatar');
        }
    };

    const handleUpdateCover = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('coverImage', coverImage);
        try {
            await api.patch('/users/update-cover-image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Cover image updated successfully');
            fetchCurrentUser();
        } catch (error) {
            console.error('Error updating cover image', error);
            alert('Failed to update cover image');
        }
    };

    const handleRefreshToken = async () => {
        try {
            const response = await api.post('/users/refresh-token');
            const { accessToken, refreshToken } = response.data.data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            alert('Token refreshed successfully');
        } catch (error) {
            console.error('Error refreshing token', error);
            alert('Failed to refresh token');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="dashboard-container">
            <h2>Dashboard</h2>

            <div className="dashboard-tabs">
                <button
                    className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                >
                    Profile
                </button>
                <button
                    className={`tab-button ${activeTab === 'images' ? 'active' : ''}`}
                    onClick={() => setActiveTab('images')}
                >
                    Avatar & Cover
                </button>
                <button
                    className={`tab-button ${activeTab === 'security' ? 'active' : ''}`}
                    onClick={() => setActiveTab('security')}
                >
                    Security
                </button>
                <button
                    className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    Watch History
                </button>
                <button
                    className={`tab-button ${activeTab === 'session' ? 'active' : ''}`}
                    onClick={() => setActiveTab('session')}
                >
                    Session
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'profile' && (
                    <form onSubmit={handleUpdateProfile}>
                        <h3>Update Profile</h3>
                        <label>Full Name</label>
                        <input
                            type="text"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                        />
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button type="submit">Save Changes</button>
                    </form>
                )}

                {activeTab === 'images' && (
                    <div className="image-update-section">
                        <form onSubmit={handleUpdateAvatar}>
                            <h3>Update Avatar</h3>
                            <img src={user?.avatar} alt="Current Avatar" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }} />
                            <input
                                type="file"
                                onChange={(e) => setAvatar(e.target.files[0])}
                            />
                            <button type="submit">Update Avatar</button>
                        </form>
                        <hr style={{ margin: '2rem 0', borderColor: 'var(--border-color)' }} />
                        <form onSubmit={handleUpdateCover}>
                            <h3>Update Cover Image</h3>
                            {user?.coverImage && <img src={user.coverImage} alt="Current Cover" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />}
                            <input
                                type="file"
                                onChange={(e) => setCoverImage(e.target.files[0])}
                            />
                            <button type="submit">Update Cover Image</button>
                        </form>
                    </div>
                )}

                {activeTab === 'security' && (
                    <form onSubmit={handleChangePassword}>
                        <h3>Change Password</h3>
                        <label>Old Password</label>
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                        <label>New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button type="submit">Change Password</button>
                    </form>
                )}

                {activeTab === 'history' && (
                    <div>
                        <h3>Watch History</h3>
                        <div className="video-grid">
                            {watchHistory.length > 0 ? (
                                watchHistory.map((video) => (
                                    <VideoCard key={video._id} video={video} />
                                ))
                            ) : (
                                <p>No watch history found.</p>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'session' && (
                    <div>
                        <h3>Session Management</h3>
                        <p>Manually refresh your access token if needed.</p>
                        <button onClick={handleRefreshToken}>Refresh Token</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
