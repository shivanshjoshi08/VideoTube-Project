import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import videoService from '../services/video.service';
import likeService from '../services/like.service';
import subscriptionService from '../services/subscription.service';
import playlistService from '../services/playlist.service';
import { useAuth } from '../context/AuthContext';

function VideoDetail() {
    const { videoId } = useParams();
    const [video, setVideo] = useState(null);
    const [relatedVideos, setRelatedVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [subscriberCount, setSubscriberCount] = useState(0);
    const [actionLoading, setActionLoading] = useState(false);

    // Playlist Modal State
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const [userPlaylists, setUserPlaylists] = useState([]);
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchVideoAndRelated = async () => {
            try {
                setLoading(true);
                const response = await videoService.getVideoById(videoId);
                setVideo(response.data.data);
                setLikeCount(response.data.data.likesCount || 0);

                // Fetch subscriber count
                try {
                    const subRes = await subscriptionService.getUserChannelSubscribers(response.data.data.owner._id);
                    setSubscriberCount(subRes.data.data.length || 0);
                } catch (err) {
                    console.error('Error fetching subscribers', err);
                }

                // Fetch related videos
                try {
                    const relatedRes = await videoService.getAllVideos({ limit: 10 });
                    const filtered = relatedRes.data.data.docs.filter(v => v._id !== videoId);
                    setRelatedVideos(filtered.slice(0, 8));
                } catch (err) {
                    console.error('Error fetching related videos', err);
                }

                setError(null);
            } catch (error) {
                console.error('Error fetching video', error);
                setError('Failed to load video');
            } finally {
                setLoading(false);
            }
        };

        if (videoId) {
            fetchVideoAndRelated();
        }
    }, [videoId]);

    const handleLike = async () => {
        // Feature not implemented on backend
        alert("Like feature coming soon!");
        // try {
        //     setActionLoading(true);
        //     await likeService.toggleVideoLike(videoId);
        //     setIsLiked(!isLiked);
        //     setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
        // } catch (error) {
        //     console.error('Error toggling like:', error);
        //     alert('Failed to like video');
        // } finally {
        //     setActionLoading(false);
        // }
    };

    const handleSubscribe = async () => {
        alert("Subscribe feature unavailable (Backend route mismatch)");
        // try {
        //     setActionLoading(true);
        //     await subscriptionService.toggleSubscription(video.owner._id);
        //     setIsSubscribed(!isSubscribed);
        //     setSubscriberCount(isSubscribed ? subscriberCount - 1 : subscriberCount + 1);
        // } catch (error) {
        //     console.error('Error toggling subscription:', error);
        //     alert('Failed to toggle subscription');
        // } finally {
        //     setActionLoading(false);
        // }
    };

    if (loading) {
        return (
            <div className="app-content">
                <div className="loading">Loading video...</div>
            </div>
        );
    }

    if (error || !video) {
        return (
            <div className="app-content">
                <div className="error-message" style={{ margin: '1.5rem' }}>
                    {error || 'Video not found'}
                </div>
            </div>
        );
    }

    return (
        <div className="app-content">
            <div className="video-detail-container">
                {/* Main Video Section */}
                <div className="video-player-section">
                    <video
                        src={video.videoFile}
                        controls
                        autoPlay
                        className="video-player"
                    ></video>

                    {/* Video Metadata */}
                    <div className="video-meta">
                        <div className="video-meta-left">
                            <h1>{video.title}</h1>
                            <div className="video-meta-stats">
                                <span>{video.views} views</span>
                                <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="video-actions">
                            <button
                                onClick={handleLike}
                                title="Like (Coming Soon)"
                                style={{
                                    backgroundColor: 'rgba(0,0,0,0.1)',
                                    color: 'var(--yt-text-secondary)',
                                    cursor: 'not-allowed'
                                }}
                            >
                                👍 {likeCount}
                            </button>
                            <button title="Dislike" disabled style={{ cursor: 'not-allowed', color: 'var(--yt-text-secondary)' }}>
                                👎 Dislike
                            </button>
                            <button title="Share">
                                ↗️ Share
                            </button>
                            <button title="Save" onClick={handleSaveClick}>
                                🔖 Save
                            </button>
                        </div>
                    </div>

                    {/* Channel Section */}
                    <div className="video-channel-section">
                        <div className="channel-info">
                            <img
                                src={video.owner?.avatar || 'https://via.placeholder.com/50'}
                                alt={video.owner?.username}
                            />
                            <div className="channel-details">
                                <h4>{video.owner?.fullName}</h4>
                                <p>@{video.owner?.username} • {subscriberCount.toLocaleString()} subscribers</p>
                            </div>
                        </div>
                        <button
                            className="btn-primary"
                            onClick={handleSubscribe}
                            disabled={actionLoading}
                            style={{
                                backgroundColor: isSubscribed ? 'var(--yt-hover)' : 'var(--yt-brand-color)',
                                color: isSubscribed ? 'var(--yt-text-primary)' : '#fff',
                                border: isSubscribed ? '1px solid var(--yt-border)' : 'none',
                                opacity: 0.5,
                                cursor: 'not-allowed'
                            }}
                        >
                            {isSubscribed ? '✓ Subscribed' : 'Subscribe (Broken)'}
                        </button>
                    </div>

                    {/* Description */}
                    <div className="video-description">
                        {video.description}
                    </div>

                    {/* Comments Section */}
                    <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--yt-border)' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Comments</h3>
                        <p style={{ color: 'var(--yt-text-secondary)' }}>Comments feature coming soon! (Backend not implemented)</p>
                    </div>
                </div>

                {/* Sidebar - Related Videos */}
                <div className="related-videos-section">
                    <h3>Recommended</h3>
                    {relatedVideos.length === 0 ? (
                        <p style={{ color: 'var(--yt-text-secondary)', fontSize: '0.9rem' }}>No related videos</p>
                    ) : (
                        relatedVideos.map((relatedVideo) => (
                            <a
                                key={relatedVideo._id}
                                href={`/video/${relatedVideo._id}`}
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <div className="related-video-item">
                                    <img
                                        src={relatedVideo.thumbnail || 'https://via.placeholder.com/100x56'}
                                        alt={relatedVideo.title}
                                        className="related-video-thumbnail"
                                    />
                                    <div className="related-video-info">
                                        <h4>{relatedVideo.title}</h4>
                                        <p>{relatedVideo.owner?.username}</p>
                                        <p>{relatedVideo.views} views</p>
                                    </div>
                                </div>
                            </a>
                        ))
                    )}
                </div>
            </div>
            {/* Simple Playlist Selection Modal */}
            {showPlaylistModal && (
                <div className="modal-overlay" onClick={() => setShowPlaylistModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h3>Save to...</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
                            {userPlaylists.length === 0 ? (
                                <p>No playlists found.</p>
                            ) : (
                                userPlaylists.map(playlist => (
                                    <button
                                        key={playlist._id}
                                        onClick={() => handleAddToPlaylist(playlist._id)}
                                        style={{ padding: '10px', textAlign: 'left', backgroundColor: '#333', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '4px' }}
                                    >
                                        {playlist.name}
                                    </button>
                                ))
                            )}
                        </div>
                        <button onClick={() => setShowPlaylistModal(false)} style={{ marginTop: '10px', width: '100%', padding: '8px' }}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default VideoDetail;
