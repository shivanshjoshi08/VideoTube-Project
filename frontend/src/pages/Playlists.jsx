import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import playlistService from '../services/playlist.service';
import { useAuth } from '../context/AuthContext';
import PlaylistModal from '../components/PlaylistModal';

function Playlists() {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            fetchPlaylists();
        } else {
            setLoading(false);
        }
    }, [currentUser]);

    const fetchPlaylists = async () => {
        try {
            setLoading(true);
            const response = await playlistService.getUserPlaylists(currentUser._id);
            setPlaylists(response.data.data);
        } catch (error) {
            console.error("Error fetching playlists", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePlaylist = async ({ name, description }) => {
        try {
            await playlistService.createPlaylist({ name, description });
            setIsModalOpen(false);
            fetchPlaylists();
        } catch (error) {
            console.error("Error creating playlist", error);
            alert("Failed to create playlist");
        }
    };

    if (loading) return <div>Loading playlists...</div>;

    if (!currentUser) return <div>Please login to view playlists.</div>;

    return (
        <div className="playlists-page">
            <div className="page-header">
                <h1>My Playlists</h1>
                <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                    + Create Playlist
                </button>
            </div>

            <div className="playlists-grid">
                {playlists.length === 0 ? (
                    <p>No playlists found. Create one!</p>
                ) : (
                    playlists.map(playlist => (
                        <div
                            key={playlist._id}
                            className="playlist-card"
                            onClick={() => navigate(`/playlist/${playlist._id}`)}
                            style={{ cursor: 'pointer', border: '1px solid #333', padding: '16px', borderRadius: '8px', backgroundColor: '#1e1e1e' }}
                        >
                            <h3>{playlist.name}</h3>
                            <p style={{ color: '#aaa', fontSize: '0.9rem' }}>{playlist.description}</p>
                            <p style={{ marginTop: '8px', fontSize: '0.8rem' }}>{playlist.videos?.length || 0} videos</p>
                        </div>
                    ))
                )}
            </div>

            <PlaylistModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreatePlaylist}
            />
        </div>
    );
}

export default Playlists;
