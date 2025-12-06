import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import videoService from '../services/video.service';
import VideoCard from '../components/VideoCard';

function SearchResults() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query) return;
            try {
                setLoading(true);
                const response = await videoService.getAllVideos({ query });
                setVideos(response.data.data.docs || []);
                setError(null);
            } catch (err) {
                console.error('Error searching videos', err);
                setError('Failed to fetch search results');
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]);

    return (
        <div className="search-results-container">
            <h2 style={{ marginBottom: '1.5rem' }}>
                Search Results for "{query}"
            </h2>

            {loading && <div className="loading">Searching...</div>}

            {error && <div className="error-message">{error}</div>}

            {!loading && videos.length === 0 && (
                <div className="empty-state">
                    <h3>No videos found</h3>
                    <p>Try different keywords.</p>
                </div>
            )}

            <div className="video-grid" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {videos.map((video) => (
                    // Improve VideoCard for list view? For now reusing grid card but maybe style it manually if needed
                    // Or keep grid. YouTube search is list view.
                    // Let's use the standard grid for consistency for now, or flex row.
                    <div key={video._id} style={{ display: 'flex', gap: '16px', cursor: 'pointer' }} onClick={() => window.location.href = `/video/${video._id}`}>
                        <div style={{ width: '360px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                            <img src={video.thumbnail} alt={video.title} style={{ width: '100%', height: '202px', objectFit: 'cover' }} />
                        </div>
                        <div style={{ flex: 1, padding: '8px 0' }}>
                            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: '500' }}>{video.title}</h3>
                            <div style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '12px' }}>
                                {video.views} views • {new Date(video.createdAt).toLocaleDateString()}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                <img src={video.owner?.avatar} alt={video.owner?.username} style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                                <span style={{ color: '#aaa', fontSize: '0.9rem' }}>{video.owner?.username}</span>
                            </div>
                            <p style={{ color: '#aaa', fontSize: '0.9rem', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {video.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SearchResults;
