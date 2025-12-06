import React from 'react';
import { Link } from 'react-router-dom';

function VideoCard({ video }) {
    return (
        <Link to={`/video/${video._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="video-card">
                <div className="video-thumbnail-container">
                    <img src={video.thumbnail} alt={video.title} className="video-thumbnail" />
                </div>
                <div className="video-info">
                    <img src={video.owner?.avatar} alt={video.owner?.username} className="channel-avatar" />
                    <div className="video-details">
                        <h3 className="video-title">{video.title}</h3>
                        <p className="video-meta-text">{video.owner?.username}</p>
                        <p className="video-meta-text">
                            {video.views} views <span className="video-meta-dot">•</span> {new Date(video.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default VideoCard;
