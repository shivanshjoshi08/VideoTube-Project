import React, { useState, useEffect } from 'react';
import videoService from '../services/video.service';
import authService from '../services/auth.service';
import tweetService from '../services/tweet.service';
import subscriptionService from '../services/subscription.service';
import DashboardVideoCard from '../components/DashboardVideoCard';

function Dashboard() {
    const [activeTab, setActiveTab] = useState('videos');
    const [settingsTab, setSettingsTab] = useState('profile');

    // Data States
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [videos, setVideos] = useState([]);
    const [tweets, setTweets] = useState([]);
    const [watchHistory, setWatchHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form States
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [newTweetContent, setNewTweetContent] = useState('');
    const [editingTweet, setEditingTweet] = useState(null); // { id, content }

    // Preview States
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);

    useEffect(() => {
        if (user?._id) {
            fetchChannelStats();
            if (activeTab === 'videos') {
                fetchChannelVideos();
            }
        }
    }, [user, activeTab]);

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        if (!user?._id) return;

        if (activeTab === 'tweets') {
            fetchUserTweets();
        }
        if (activeTab === 'history') {
            fetchWatchHistory();
        }
    }, [activeTab, user]);

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
        // Polyfill: Calculate stats from videos and subscriptions since backend controller is empty
        try {
            // We need videos to calculate views and video count
            // We need subscriber count from subscription service
            // We cannot get total likes easily without backend aggregation, so we'll set it to 0 or hidden

            // 1. Get Videos (already managed by fetchChannelVideos, but we need them here for stats if they aren't loaded yet)
            // But fetchChannelVideos depends on user state. 
            // Let's rely on fetchChannelVideos to populate 'videos' state, and then we derive stats from it?
            // Actually, better to fetch everything here independently or ensure order.

            if (!user?._id) return;

            const videosResponse = await videoService.getAllVideos({ userId: user._id });
            const userVideos = videosResponse.data.data.docs || [];

            const totalVideos = userVideos.length;
            const totalViews = userVideos.reduce((acc, curr) => acc + (curr.views || 0), 0);

            // 2. Get Subscribers
            const subsResponse = await subscriptionService.getUserChannelSubscribers(user._id);
            const totalSubscribers = subsResponse.data.data.length || 0;

            setStats({
                totalVideos,
                totalViews,
                totalSubscribers,
                totalLikes: 0 // Cannot calculate without backend
            });
        } catch (error) {
            console.error('Error fetching stats', error);
        }
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

    const fetchUserTweets = async () => {
        try {
            const response = await tweetService.getUserTweets();
            setTweets(response.data.data || []);
        } catch (error) {
            console.error('Error fetching tweets', error);
        }
    }

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
        if (newPassword === oldPassword) {
            alert("New password cannot be same as old password");
            return;
        }
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

    const handleAvatarSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleCancelAvatar = () => {
        setAvatar(null);
        setAvatarPreview(null);
    };

    const handleUpdateAvatar = async (e) => {
        e.preventDefault();
        try {
            await authService.updateAvatar(avatar);
            toast.success('Avatar updated successfully');
            setAvatar(null);
            setAvatarPreview(null);
            fetchCurrentUser();
        } catch (error) {
            console.error('Error updating avatar', error);
            toast.error('Failed to update avatar');
        }
    };

    const handleCoverSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImage(file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    const handleCancelCover = () => {
        setCoverImage(null);
        setCoverPreview(null);
    };

    const handleUpdateCover = async (e) => {
        e.preventDefault();
        try {
            await authService.updateCoverImage(coverImage);
            toast.success('Cover image updated successfully');
            setCoverImage(null);
            setCoverPreview(null);
            fetchCurrentUser();
        } catch (error) {
            console.error('Error updating cover image', error);
            toast.error('Failed to update cover image');
        }
    };

    const handleRefreshToken = async () => {
        try {
            const response = await authService.refreshAccessToken();
            if (response.data.data.accessToken) {
                localStorage.setItem('accessToken', response.data.data.accessToken);
                localStorage.setItem('refreshToken', response.data.data.refreshToken);
            }
            alert('Token refreshed successfully');
        } catch (error) {
            console.error('Error refreshing token', error);
            alert('Failed to refresh token');
        }
    };

    // Tweet Actions
    const handleCreateTweet = async (e) => {
        e.preventDefault();
        if (!newTweetContent.trim()) return;
        try {
            await tweetService.createTweet(newTweetContent);
            setNewTweetContent('');
            fetchUserTweets();
        } catch (error) {
            console.error("Error creating tweet", error);
            alert("Failed to create tweet");
        }
    };

    const handleDeleteTweet = async (tweetId) => {
        if (!window.confirm("Are you sure you want to delete this tweet?")) return;
        try {
            await tweetService.deleteTweet(tweetId);
            fetchUserTweets();
        } catch (error) {
            console.error("Error deleting tweet", error);
        }
    };

    const handleEditTweet = (tweet) => {
        setEditingTweet({ id: tweet._id, content: tweet.content });
    };

    const handleUpdateTweet = async () => {
        try {
            await tweetService.updateTweet(editingTweet.id, editingTweet.content);
            setEditingTweet(null);
            fetchUserTweets();
        } catch (error) {
            console.error("Error updating tweet", error);
            alert("Failed to update tweet");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                {/* Profile Header Block */}
                <div className="profile-header">
                    <div className="cover-image-container">
                        <img
                            src={user?.coverImage || "https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=2675&auto=format&fit=crop"}
                            alt="Cover"
                            className="cover-image"
                        />
                    </div>
                    <div className="profile-info-overlay">
                        <img
                            src={user?.avatar || "https://via.placeholder.com/150"}
                            alt="avatar"
                            className="profile-avatar-large"
                        />
                        <div className="profile-text">
                            <h1 className="profile-name">{user?.fullname}</h1>
                            <p className="profile-username">@{user?.username}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-tabs">
                <button
                    className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                >
                    Profile
                </button>
                <button
                    className={`tab-button ${activeTab === 'videos' ? 'active' : ''}`}
                    onClick={() => setActiveTab('videos')}
                >
                    Videos
                </button>
                <button
                    className={`tab-button ${activeTab === 'tweets' ? 'active' : ''}`}
                    onClick={() => setActiveTab('tweets')}
                >
                    Tweets
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
                {activeTab === 'profile' && (
                    <div className="profile-details-card">
                        <div className="profile-card-header">
                            <h2>My Profile</h2>
                            <p style={{ color: 'var(--text-muted)' }}>Manage your personal information</p>
                        </div>

                        <div className="profile-details-grid">
                            <div className="detail-item">
                                <span className="detail-label">Full Name</span>
                                <div className="detail-value">{user?.fullname}</div>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Username</span>
                                <div className="detail-value">@{user?.username}</div>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Email Address</span>
                                <div className="detail-value">{user?.email}</div>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Joined On</span>
                                <div className="detail-value">
                                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={() => setActiveTab('settings')} className="btn-secondary">
                                ✏️ Edit Profile
                            </button>
                        </div>
                    </div>
                )}

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
                                    <DashboardVideoCard
                                        key={video._id}
                                        video={video}
                                        onDelete={(videoId) => setVideos(videos.filter(v => v._id !== videoId))}
                                        onUpdate={(updatedVideo) => {
                                            setVideos(videos.map(v => v._id === updatedVideo._id ? updatedVideo : v));
                                            fetchChannelStats();
                                        }}
                                    />
                                ))
                            ) : (
                                <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                                    <div className="empty-state-icon">📹</div>
                                    <h3>No videos yet</h3>
                                    <p>Start by uploading your first video</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'tweets' && (
                    <div className="tweets-section">
                        <h3>My Tweets</h3>
                        <form onSubmit={handleCreateTweet} className="create-tweet-form">
                            <textarea
                                value={newTweetContent}
                                onChange={(e) => setNewTweetContent(e.target.value)}
                                placeholder="What's on your mind?"
                                rows="3"
                                className="form-input"
                                style={{ marginBottom: '10px', resize: 'vertical' }}
                            />
                            <button type="submit" className="btn-primary">Post Tweet</button>
                        </form>

                        <div className="tweets-list" style={{ marginTop: '20px' }}>
                            {tweets.length > 0 ? (
                                tweets.map(tweet => (
                                    <div key={tweet._id} className="tweet-card" style={{ backgroundColor: '#2a2a2a', padding: '15px', borderRadius: '8px', marginBottom: '10px', border: '1px solid #333' }}>
                                        {editingTweet?.id === tweet._id ? (
                                            <div>
                                                <textarea
                                                    value={editingTweet.content}
                                                    onChange={(e) => setEditingTweet({ ...editingTweet, content: e.target.value })}
                                                    className="form-input"
                                                    style={{ padding: '8px' }}
                                                />
                                                <div style={{ marginTop: '10px' }}>
                                                    <button onClick={handleUpdateTweet} className="btn-primary" style={{ marginRight: '10px', fontSize: '0.8rem' }}>Save</button>
                                                    <button onClick={() => setEditingTweet(null)} className="btn-secondary" style={{ fontSize: '0.8rem' }}>Cancel</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <p style={{ margin: '0 0 10px 0', whiteSpace: 'pre-wrap' }}>{tweet.content}</p>
                                                <div className="tweet-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#888' }}>
                                                    <span>{new Date(tweet.createdAt).toLocaleDateString()}</span>
                                                    <div className="tweet-actions">
                                                        <button onClick={() => handleEditTweet(tweet)} style={{ marginRight: '10px', background: 'none', border: 'none', color: '#3ea6ff', cursor: 'pointer' }}>Edit</button>
                                                        <button onClick={() => handleDeleteTweet(tweet._id)} style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer' }}>Delete</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p>No tweets found.</p>
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
                                        className="form-input"
                                    />
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="form-input"
                                    />
                                    <button type="submit" className="btn-primary">Save Changes</button>
                                </form>
                            )}

                            {settingsTab === 'images' && (
                                <div className="image-upload-section">
                                    {/* Avatar Upload Group */}
                                    <div className="upload-group">
                                        <h3>Profile Avatar</h3>
                                        <div className="preview-container">
                                            <img
                                                src={avatarPreview || user?.avatar || "https://via.placeholder.com/150"}
                                                alt="Avatar Preview"
                                                className="avatar-preview"
                                            />
                                        </div>

                                        <div className="action-buttons" style={{ justifyContent: 'center' }}>
                                            {!avatarPreview ? (
                                                <div className="file-input-wrapper">
                                                    <button className="btn-upload-select">Select New Avatar</button>
                                                    <input
                                                        type="file"
                                                        onChange={handleAvatarSelect}
                                                        accept="image/*"
                                                    />
                                                </div>
                                            ) : (
                                                <>
                                                    <button onClick={handleUpdateAvatar} className="btn-primary">Save Change</button>
                                                    <button onClick={handleCancelAvatar} className="btn-secondary">Cancel</button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Cover Image Upload Group */}
                                    <div className="upload-group">
                                        <h3>Cover Image</h3>
                                        <div className="preview-container">
                                            <img
                                                src={coverPreview || user?.coverImage || "https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=2675&auto=format&fit=crop"}
                                                alt="Cover Preview"
                                                className="cover-preview"
                                            />
                                        </div>

                                        <div className="action-buttons" style={{ justifyContent: 'center' }}>
                                            {!coverPreview ? (
                                                <div className="file-input-wrapper">
                                                    <button className="btn-upload-select">Select New Cover</button>
                                                    <input
                                                        type="file"
                                                        onChange={handleCoverSelect}
                                                        accept="image/*"
                                                    />
                                                </div>
                                            ) : (
                                                <>
                                                    <button onClick={handleUpdateCover} className="btn-primary">Save Change</button>
                                                    <button onClick={handleCancelCover} className="btn-secondary">Cancel</button>
                                                </>
                                            )}
                                        </div>
                                    </div>
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
                                        className="form-input"
                                    />
                                    <label>New Password</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="form-input"
                                    />
                                    <button type="submit" className="btn-primary">Change Password</button>
                                </form>
                            )}

                            {settingsTab === 'session' && (
                                <div>
                                    <h3>Session Management</h3>
                                    <p>Manually refresh your access token if needed.</p>
                                    <button onClick={handleRefreshToken} className="btn-secondary">Refresh Token</button>
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
