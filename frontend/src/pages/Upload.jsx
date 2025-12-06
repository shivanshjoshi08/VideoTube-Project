import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import videoService from '../services/video.service';

function Upload() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        setUploading(true);
        // FormData construction is handled in videoService

        try {
            await videoService.publishVideo({ title, description, videoFile, thumbnail });
            setUploading(false);
            alert('Video uploaded successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Upload failed', error);
            setUploading(false);
            alert('Upload failed');
        }
    };

    return (
        <div className="upload-container">
            <h2>Upload Video</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <label>Video File:</label>
                <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files[0])}
                    required
                />
                <label>Thumbnail:</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbnail(e.target.files[0])}
                    required
                />
                <button type="submit" disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>
            </form>
        </div>
    );
}

export default Upload;
