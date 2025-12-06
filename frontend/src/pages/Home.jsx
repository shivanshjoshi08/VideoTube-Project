import React, { useEffect, useState } from 'react';
import videoService from '../services/video.service';
import VideoCard from '../components/VideoCard';

function Home() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true);
                const response = await videoService.getAllVideos();
                setVideos(response.data.data.docs || []);
                setError(null);
            } catch (error) {
                console.error('Error fetching videos', error);
                setError('Failed to load videos');
                setVideos([]);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    return (
        <div className="app-content">
            <div className="hero">
                <h1>Welcome to VideoTube</h1>
                <p>Discover and watch amazing videos shared by our community</p>
            </div>

            {error && (
                <div className="error-message" style={{ margin: '1.5rem' }}>
                    {error}
                </div>
            )}

            {loading && (
                <div className="loading">
                    <p>Loading videos...</p>
                </div>
            )}

            {!loading && videos.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">🎬</div>
                    <h3>No videos yet</h3>
                    <p>Be the first to upload a video!</p>
                </div>
            ) : (
                <>
                    <div style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem', marginBottom: '1rem' }}>
                        <h2 style={{ margin: '0' }}>Recommended For You</h2>
                    </div>
                    <div className="video-grid">
                        {videos.map((video) => (
                            <VideoCard key={video._id} video={video} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default Home;
