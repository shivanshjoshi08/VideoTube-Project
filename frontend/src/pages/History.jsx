import React, { useState, useEffect } from 'react';
import authService from '../services/auth.service';
import VideoCard from '../components/VideoCard';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function History() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        const fetchHistory = async () => {
            try {
                setLoading(true);
                const response = await authService.getWatchHistory();
                setHistory(response.data.data || []);
            } catch (error) {
                console.error('Error fetching history', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [currentUser, navigate]);

    return (
        <div className="history-container">
            <h1 style={{ marginBottom: '2rem' }}>Watch History</h1>

            {loading && <div className="loading">Loading history...</div>}

            {!loading && history.length === 0 && (
                <div className="empty-state">
                    <h3>No watch history</h3>
                    <p>Videos you watch will appear here.</p>
                </div>
            )}

            <div className="video-grid">
                {history.map((video) => (
                    <VideoCard key={video._id} video={video} />
                ))}
            </div>
        </div>
    );
}

export default History;
