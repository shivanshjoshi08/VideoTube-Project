import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import playlistService from '../services/playlist.service';
import videoService from '../services/video.service'; // Start importing video service to get video details if playlist only sends IDs
import { useAuth } from '../context/AuthContext';
import VideoCard from '../components/VideoCard';

function PlaylistDetail() {
    const { playlistId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [playlist, setPlaylist] = useState(null);
    const [videos, setVideos] = useState([]); // Provide a way to store populated video data if simpler
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPlaylist();
    }, [playlistId]);

    const fetchPlaylist = async () => {
        try {
            setLoading(true);
            const response = await playlistService.getPlaylistById(playlistId);
            const playlistData = response.data.data;
            setPlaylist(playlistData);

            // Backend might not populate videos fully, or it might.
            // Let's assume it returns array of IDs or Objects.
            // Based on earlier controller analysis: `Playlist.aggregate` or `findById`?
            // `getPlaylistById` uses `Playlist.findById(playlistId)`. 
            // The Mongoose model likely stores ObjectIds. The controller didn't show `populate('videos')` in `getPlaylistById`.
            // Controller: const playlist = await Playlist.findById(playlistId).select("-__v")
            // So we likely just have IDs. We need to fetch video details. 
            // Wait, standard for `video` field in Mongoose is usually populated if needed, but here it wasn't.
            // So we might need to fetch each video or strict populate.
            // Actually, let's check if `videos` is array of strings or objects.

            // If they are IDs, we need to fetch them.
            // BUT `getAllVideos` has pagination. `getVideoById` is one by one.
            // Ideally we'd have `getPlaylistVideos`.
            // For now, let's try to handle both or fetch individually if needed. 
            // Actually, let's assume valid implementation SHOULD populate. 
            // If the controller doesn't populate, we have a problem.
            // Let's look at `user.controller` watch history -> it used aggregation pipeline.
            // `playlist.controller` -> `getPlaylistById` -> matches ID. 
            // If it doesn't populate, we can't show videos.
            // "Hack": We can't change backend. We have to fetch each video by ID if it's not populated.

            if (playlistData.videos && playlistData.videos.length > 0) {
                if (typeof playlistData.videos[0] === 'string') {
                    // Need to fetch details. This is slow but necessary without backend changes.
                    const videoPromises = playlistData.videos.map(vidId =>
                        videoService.getVideoById(vidId).then(res => res.data.data).catch(() => null)
                    );
                    const fetchedVideos = await Promise.all(videoPromises);
                    setVideos(fetchedVideos.filter(v => v)); // Remove nulls
                } else {
                    setVideos(playlistData.videos);
                }
            } else {
                setVideos([]);
            }

        } catch (error) {
            console.error("Error fetching playlist", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePlaylist = async () => {
        if (!window.confirm("Are you sure you want to delete this playlist?")) return;
        try {
            await playlistService.deletePlaylist(playlistId);
            navigate('/playlists');
        } catch (error) {
            console.error("Error deleting playlist", error);
            alert("Failed to delete playlist");
        }
    };

    const handleRemoveVideo = async (videoId) => {
        if (!window.confirm("Remove video from playlist?")) return;
        try {
            await playlistService.removeVideoFromPlaylist(videoId, playlistId);
            setVideos(videos.filter(v => v._id !== videoId));
        } catch (error) {
            console.error("Error removing video", error);
            alert("Failed to remove video");
        }
    }

    if (loading) return <div>Loading playlist...</div>;

    if (!playlist) return <div>Playlist not found</div>;

    const isOwner = currentUser && playlist.owner === currentUser._id;

    return (
        <div className="playlist-detail-page">
            <div className="playlist-header" style={{ marginBottom: '2rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1>{playlist.name}</h1>
                        <p style={{ color: '#aaa' }}>{playlist.description}</p>
                        <p style={{ fontSize: '0.9rem', color: '#888' }}>
                            Created by {playlist.owner?.username || playlist.owner} • {videos.length} videos
                        </p>
                    </div>
                    {isOwner && (
                        <div>
                            <button className="btn-secondary" onClick={handleDeletePlaylist} style={{ color: '#ff4d4d', borderColor: '#ff4d4d' }}>
                                Delete Playlist
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="playlist-videos">
                {videos.length === 0 ? (
                    <p>No videos in this playlist.</p>
                ) : (
                    <div className="video-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {videos.map(video => (
                            <div key={video._id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', backgroundColor: '#1e1e1e', padding: '10px', borderRadius: '8px' }}>
                                <div style={{ width: '160px', flexShrink: 0, cursor: 'pointer' }} onClick={() => navigate(`/video/${video._id}`)}>
                                    <img src={video.thumbnail} alt={video.title} style={{ width: '100%', borderRadius: '8px', aspectRatio: '16/9', objectFit: 'cover' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: '0 0 5px 0', cursor: 'pointer' }} onClick={() => navigate(`/video/${video._id}`)}>{video.title}</h4>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#aaa' }}>{video.owner?.username}</p>
                                </div>
                                {isOwner && (
                                    <button
                                        onClick={() => handleRemoveVideo(video._id)}
                                        style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '1.2rem', padding: '0 10px' }}
                                        title="Remove from playlist"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PlaylistDetail;
