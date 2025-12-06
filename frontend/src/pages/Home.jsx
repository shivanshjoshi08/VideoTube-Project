import React, { useEffect, useState } from 'react';
import videoService from '../services/video.service';
import VideoCard from '../components/VideoCard';

function Home() {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await videoService.getAllVideos();
                setVideos(response.data.data.docs || []);
            } catch (error) {
                console.error('Error fetching videos', error);
            }
        };

        fetchVideos();
    }, []);

    return (
        <div className="home-container">
            <div className="hero">
                <h1>Welcome to VideoTube</h1>
                <p>Discover, Upload, and Share your favorite videos with the world.</p>
            </div>
            <h2>Recommended</h2>
            <div className="video-grid">
                {videos.map((video) => (
                    <VideoCard key={video._id} video={video} />
                ))}
            </div>
        </div>
    );
}

export default Home;
