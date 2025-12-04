import React from 'react';
import { Link } from 'react-router-dom';

function VideoCard({ video }) {
    return (
        <Link to={`/video/${video._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="video-card">
                <img src={video.thumbnail} alt={video.title} className="video-thumbnail" />
                <div className="video-info">
                    <img src={video.owner?.avatar} alt={video.owner?.username} className="channel-avatar" />
                    <div className="video-details">
                        <h3>{video.title}</h3>
                        <p>{video.owner?.username}</p>
                        <p>{video.views} views • {new Date(video.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default VideoCard;
