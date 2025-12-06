import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import authService from '../services/auth.service';
import videoService from '../services/video.service';
import VideoCard from '../components/VideoCard';

function ChannelProfile() {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchChannelData = async () => {
            try {
                setLoading(true);
                // Fetch profile
                const profileResponse = await authService.getUserChannelProfile(username);
                const channelData = profileResponse.data.data;
                setProfile(channelData);

                // Fetch videos
                if (channelData._id) {
                    const videosResponse = await videoService.getAllVideos({ userId: channelData._id });
                    setVideos(videosResponse.data.data.docs || []);
                }
                setError(null);
            } catch (err) {
                console.error('Error fetching channel', err);
                setError('Channel not found');
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchChannelData();
        }
    }, [username]);

    if (loading) return <div>Loading channel...</div>;
    if (error) return <div>{error}</div>;
    if (!profile) return <div>Channel not found</div>;

    return (
        <div className="channel-profile">
            {profile.coverImage && (
                <div className="channel-cover" style={{ backgroundImage: `url(${profile.coverImage})` }}></div>
            )}
            <div className="channel-header">
                <img src={profile.avatar} alt={profile.username} className="channel-avatar-large" />
                <div className="channel-info">
                    <h1>{profile.fullname}</h1>
                    <p>@{profile.username}</p>
                    <p>{profile.subscribersCount} subscribers • {profile.channelsSubscribedToCount} subscribed</p>
                    <div className="channel-actions">
                        <button className="btn-primary" disabled>
                            {profile.isSubscribed ? 'Subscribed' : 'Subscribe'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="channel-content">
                <h2>Videos</h2>
                <div className="video-grid">
                    {videos.length > 0 ? (
                        videos.map((video) => (
                            <VideoCard key={video._id} video={video} />
                        ))
                    ) : (
                        <p>No videos uploaded yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChannelProfile;
