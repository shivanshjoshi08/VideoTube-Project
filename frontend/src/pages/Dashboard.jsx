import React, { useState, useEffect } from 'react';
import videoService from '../services/video.service';
import authService from '../services/auth.service';
import VideoCard from '../components/VideoCard';

function Dashboard() {
    const [activeTab, setActiveTab] = useState('videos');
    const [settingsTab, setSettingsTab] = useState('profile');

    // Data States
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [videos, setVideos] = useState([]);
    const [watchHistory, setWatchHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form States
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [coverImage, setCoverImage] = useState(null);

    useEffect(() => {
        fetchCurrentUser();
        fetchChannelStats();
    }, []);

    useEffect(() => {
        if (activeTab === 'videos') {
            fetchChannelVideos();
        }
        if (activeTab === 'history') {
            fetchWatchHistory();
        }
    }, [activeTab]);

    const fetchCurrentUser = async () => {
        try {
            const response = await authService.getCurrentUser();
            setUser(response.data.data);
            setFullname(response.data.data.fullname);
            setEmail(response.data.data.email);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user', error);
            setLoading(false);
        }
    };

    const fetchChannelStats = async () => {
        // Backend dashboard stats are not implemented
        setStats({
            totalVideos: 0,
            totalViews: 0,
            totalSubscribers: 0,
            totalLikes: 0
        });
    };

    const fetchChannelVideos = async () => {
        if (!user?._id) return;
        try {
            const response = await videoService.getAllVideos({ userId: user._id });
            setVideos(response.data.data.docs || []);
        } catch (error) {
            console.error('Error fetching videos', error);
        }
    };

    const fetchWatchHistory = async () => {
        try {
            const response = await authService.getWatchHistory();
            setWatchHistory(response.data.data || []);
        } catch (error) {
            console.error('Error fetching history', error);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await authService.updateAccount({ fullname, email });
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
            await authService.changePassword({ oldPassword, newPassword });
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
        // authService expects raw file, it creates FormData
        try {
            await authService.updateAvatar(avatar);
            alert('Avatar updated successfully');
            fetchCurrentUser();
        } catch (error) {
            console.error('Error updating avatar', error);
            alert('Failed to update avatar');
        }
    };

    const handleUpdateCover = async (e) => {
        e.preventDefault();
        try {
            await authService.updateCoverImage(coverImage);
            alert('Cover image updated successfully');
            fetchCurrentUser();
        } catch (error) {
            console.error('Error updating cover image', error);
            alert('Failed to update cover image');
        }
    };

    const handleRefreshToken = async () => {
        try {
            const response = await authService.refreshAccessToken();
            // Assuming cookies are set by backend 
            // If we really need to store in localStorage (for access token if returned), we can.
            if (response.data.data.accessToken) {
                localStorage.setItem('accessToken', response.data.data.accessToken);
                localStorage.setItem('refreshToken', response.data.data.refreshToken); // If simplified
            }
            alert('Token refreshed successfully');
        } catch (error) {
            console.error('Error refreshing token', error);
            alert('Failed to refresh token');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>📊 My Dashboard</h1>
            </div>

            <div className="dashboard-tabs">
                <button
                    className={`tab-button ${activeTab === 'videos' ? 'active' : ''}`}
                    onClick={() => setActiveTab('videos')}
                >
                    Videos
                </button>
                <button
                    className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    Watch History
                </button>
                <button
                    className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('settings')}
                >
                    Settings
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'videos' && (
                    <div>
                        {stats && (
                            <div className="dashboard-stats" style={{ marginBottom: '20px' }}>
                                <div className="stat-card">
                                    <div className="stat-number">{stats.totalVideos || 0}</div>
                                    <div className="stat-label">Total Videos</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-number">{stats.totalViews || 0}</div>
                                    <div className="stat-label">Total Views</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-number">{stats.totalSubscribers || 0}</div>
                                    <div className="stat-label">Subscribers</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-number">{stats.totalLikes || 0}</div>
                                    <div className="stat-label">Total Likes</div>
                                </div>
                            </div>
                        )}
                        <h3>My Videos</h3>
                        <div className="video-grid">
                            {videos.length > 0 ? (
                                videos.map((video) => (
                                    <VideoCard key={video._id} video={video} />
                                ))
                            ) : (
                                <p>No videos uploaded yet.</p>
                            )}
                        </div>
                    </div>
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

                {activeTab === 'settings' && (
                    <div className="settings-container">
                        <div className="settings-tabs">
                            <button className={settingsTab === 'profile' ? 'active' : ''} onClick={() => setSettingsTab('profile')}>Profile</button>
                            <button className={settingsTab === 'images' ? 'active' : ''} onClick={() => setSettingsTab('images')}>Avatar & Cover</button>
                            <button className={settingsTab === 'security' ? 'active' : ''} onClick={() => setSettingsTab('security')}>Security</button>
                            <button className={settingsTab === 'session' ? 'active' : ''} onClick={() => setSettingsTab('session')}>Session</button>
                        </div>

                        <div className="settings-content">
                            {settingsTab === 'profile' && (
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

                            {settingsTab === 'images' && (
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

                            {settingsTab === 'security' && (
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

                            {settingsTab === 'session' && (
                                <div>
                                    <h3>Session Management</h3>
                                    <p>Manually refresh your access token if needed.</p>
                                    <button onClick={handleRefreshToken}>Refresh Token</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
