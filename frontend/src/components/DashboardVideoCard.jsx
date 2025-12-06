import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import videoService from '../services/video.service';

function DashboardVideoCard({ video, onDelete, onUpdate }) {
    const [showMenu, setShowMenu] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this video?')) {
            try {
                setLoading(true);
                await videoService.deleteVideo(video._id);
                onDelete(video._id);
            } catch (error) {
                console.error('Error deleting video:', error);
                alert('Failed to delete video');
            } finally {
                setLoading(false);
                setShowMenu(false);
            }
        }
    };

    const handleTogglePublish = async () => {
        try {
            setLoading(true);
            await videoService.togglePublishStatus(video._id);
            onUpdate({ ...video, isPublished: !video.isPublished });
            setShowMenu(false);
        } catch (error) {
            console.error('Error toggling publish:', error);
            alert('Failed to toggle publish status');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="video-card" style={{ position: 'relative' }}>
            <Link to={`/video/${video._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="video-thumbnail-container" style={{ position: 'relative' }}>
                    <img 
                        src={video.thumbnail} 
                        alt={video.title} 
                        className="video-thumbnail" 
                    />
                    <div style={{
                        position: 'absolute',
                        bottom: '8px',
                        right: '8px',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        color: '#fff',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                    }}>
                        {video.duration ? Math.floor(video.duration / 60) + ':' + String(video.duration % 60).padStart(2, '0') : '0:00'}
                    </div>
                    {!video.isPublished && (
                        <div style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            backgroundColor: 'rgba(255, 0, 0, 0.9)',
                            color: '#fff',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            fontWeight: 'bold'
                        }}>
                            PRIVATE
                        </div>
                    )}
                </div>
            </Link>

            <div className="video-info">
                <img 
                    src={video.owner?.avatar} 
                    alt={video.owner?.username} 
                    className="channel-avatar" 
                />
                <div className="video-details">
                    <h3>{video.title}</h3>
                    <p>{video.owner?.username}</p>
                    <p>
                        {video.views} views • {new Date(video.createdAt).toLocaleDateString()}
                    </p>
                </div>

                {/* Menu Button */}
                <div style={{ position: 'relative', marginLeft: 'auto', paddingLeft: '10px' }}>
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--yt-text-primary)',
                            cursor: 'pointer',
                            fontSize: '1.5rem',
                            padding: '0'
                        }}
                    >
                        ⋮
                    </button>

                    {showMenu && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            right: '0',
                            backgroundColor: 'var(--yt-surface)',
                            border: '1px solid var(--yt-border)',
                            borderRadius: '8px',
                            minWidth: '200px',
                            zIndex: 10,
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                        }}>
                            <Link 
                                to={`/edit-video/${video._id}`}
                                style={{ 
                                    display: 'block',
                                    padding: '12px 16px',
                                    color: 'var(--yt-text-primary)',
                                    textDecoration: 'none',
                                    borderBottom: '1px solid var(--yt-border)',
                                    cursor: 'pointer'
                                }}
                            >
                                ✏️ Edit
                            </Link>
                            <button
                                onClick={handleTogglePublish}
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    borderBottom: '1px solid var(--yt-border)',
                                    color: 'var(--yt-text-primary)',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    textAlign: 'left',
                                    opacity: loading ? 0.6 : 1
                                }}
                            >
                                {video.isPublished ? '🔒 Make Private' : '🌐 Make Public'}
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    color: '#cf6679',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    textAlign: 'left',
                                    opacity: loading ? 0.6 : 1
                                }}
                            >
                                🗑️ Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DashboardVideoCard;
