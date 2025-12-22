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
                <div className="video-player-section">
                    <video
                        src={video.videoFile}
                        controls
                        autoPlay
                        className="video-player"
                    ></video>

                    <div className="video-meta">
                        <h1>{video.title}</h1>
                        <p>{video.views} views • {new Date(video.createdAt).toLocaleDateString()}</p>

                        <div className="video-actions">
                            <button onClick={handleLike} disabled>Like ({likeCount})</button>
                            <button disabled>Dislike</button>
                            <button>Share</button>
                            <button onClick={() => setShowPlaylistModal(true)}>Save</button>
                        </div>
                    </div>

                    <div className="channel-info">
                        <img
                            src={video.owner?.avatar || 'https://via.placeholder.com/50'}
                            alt={video.owner?.username}
                            className="channel-avatar"
                        />
                        <div>
                            <h4>{video.owner?.fullName}</h4>
                            <p>@{video.owner?.username} • {subscriberCount.toLocaleString()} subscribers</p>
                        </div>
                        <button onClick={handleSubscribe} disabled>Subscribe</button>
                    </div>

                    <div className="video-description">
                        <p>{video.description}</p>
                    </div>
                </div>

                <div className="related-videos-section" style={{ marginTop: '20px' }}>
                    <h3>Recommended Videos</h3>
                    <div className="video-grid">
                        {relatedVideos.length === 0 ? (
                            <p>No related videos found.</p>
                        ) : (
                            relatedVideos.map((relatedVideo) => (
                                <a
                                    key={relatedVideo._id}
                                    href={`/video/${relatedVideo._id}`}
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    <div className="video-card">
                                        <div className="video-thumbnail-container">
                                            <img
                                                src={relatedVideo.thumbnail || 'https://via.placeholder.com/100x56'}
                                                alt={relatedVideo.title}
                                                className="video-thumbnail"
                                            />
                                        </div>
                                        <div>
                                            <h4>{relatedVideo.title}</h4>
                                            <p>By {relatedVideo.owner?.username}</p>
                                        </div>
                                    </div>
                                </a>
                            ))
                        )}
                    </div>
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
