import React, { useState, useEffect } from 'react';
import videoService from '../services/video.service';
import authService from '../services/auth.service';
import tweetService from '../services/tweet.service';
import VideoCard from '../components/VideoCard';

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

    useEffect(() => {
        fetchCurrentUser();
        fetchChannelStats();
    }, []);

    useEffect(() => {
        if (activeTab === 'videos') {
            fetchChannelVideos();
        }
        if (activeTab === 'tweets') {
            fetchUserTweets();
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

    const handleUpdateAvatar = async (e) => {
        e.preventDefault();
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

                {activeTab === 'tweets' && (
                    <div className="tweets-section">
                        <h3>My Tweets</h3>
                        <form onSubmit={handleCreateTweet} className="create-tweet-form">
                            <textarea
                                value={newTweetContent}
                                onChange={(e) => setNewTweetContent(e.target.value)}
                                placeholder="What's on your mind?"
                                rows="3"
                                style={{ width: '100%', padding: '10px', marginBottom: '10px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}
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
                                                    style={{ width: '100%', padding: '8px', backgroundColor: '#333', color: '#fff', border: '1px solid #555' }}
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
