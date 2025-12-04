import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';

function VideoDetail() {
    const { videoId } = useParams();
    const [video, setVideo] = useState(null);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await api.get(`/videos/${videoId}`);
                setVideo(response.data.data);
            } catch (error) {
                console.error('Error fetching video', error);
            }
        };

        fetchVideo();
    }, [videoId]);

    if (!video) return <div>Loading...</div>;

    return (
        <div className="video-detail-container">
            <video src={video.videoFile} controls autoPlay className="video-player" />
            <h2>{video.title}</h2>
            <p>{video.description}</p>
            <div className="video-meta">
                <p>Views: {video.views}</p>
                <p>Uploaded by: {video.owner?.username}</p>
            </div>
        </div>
    );
}

export default VideoDetail;
