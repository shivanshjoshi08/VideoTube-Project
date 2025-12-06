import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import videoService from '../services/video.service';

function VideoDetail() {
    const { videoId } = useParams();
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                setLoading(true);
                const response = await videoService.getVideoById(videoId);
                setVideo(response.data.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching video', err);
                setError(err.response?.data?.message || 'Error loading video');
            } finally {
                setLoading(false);
            }
        };

        if (videoId) {
            fetchVideo();
        }
    }, [videoId]);

    if (loading) return <div className="video-detail-container"><p>Loading video...</p></div>;
    if (error) return <div className="video-detail-container"><p style={{ color: 'var(--error-color)' }}>{error}</p></div>;
    if (!video) return <div className="video-detail-container"><p>Video not found</p></div>;

    return (
        <div className="video-detail-container">
            <video
                src={video.videoFile}
                controls
                autoPlay
                className="video-player"
                style={{ width: '100%', borderRadius: '12px' }}
            />
            <h2 style={{ marginTop: '1.5rem' }}>{video.title}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{video.description}</p>
            <div className="video-meta">
                <div>
                    <p><strong>Views:</strong> {video.views?.toLocaleString() || 0}</p>
                    <p><strong>Uploaded:</strong> {new Date(video.createdAt).toLocaleDateString()}</p>
                    <div className="video-actions">
                        {/* Backend Like/Subscribe controllers are not fully implemented yet, showing static buttons */}
                        <button className="btn-action" disabled>Like</button>
                        <button className="btn-action" disabled>Subscribe</button>
                    </div>
                </div>
                <div>
                    <p><strong>Uploaded by:</strong> {video.owner?.fullname || video.owner?.username}</p>
                    {video.owner?.avatar && (
                        <img
                            src={video.owner.avatar}
                            alt={video.owner.username}
                            style={{ width: '40px', height: '40px', borderRadius: '50%', marginTop: '0.5rem' }}
                        />
                    )}
                </div>
            </div>
            <div className="comments-section" style={{ marginTop: '2rem' }}>
                <h3>Comments</h3>
                <p>Comments are coming soon!</p>
            </div>
        </div>
    );
}

export default VideoDetail;
