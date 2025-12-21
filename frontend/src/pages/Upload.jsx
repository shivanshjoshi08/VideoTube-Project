import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import videoService from '../services/video.service';

function Upload() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploadSuccess(false); // Reset status

        if (!videoFile || !thumbnail) {
            alert('Please select both video file and thumbnail');
            return;
        }

        setUploading(true);

        try {
            await videoService.publishVideo({ title, description, videoFile, thumbnail });
            setUploading(false);
            setUploadSuccess(true);
            alert("Video uploaded successfully!");
            setTitle('');
            setDescription('');
            setVideoFile(null);
            setThumbnail(null);
            // navigate('/dashboard'); // Optional: stay on page to show success
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (error) {
            console.error('Upload failed', error);
            setUploading(false);
            alert('Upload failed: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="upload-container">
            <h2>Upload Video</h2>
            {uploadSuccess && <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>Video uploaded successfully! Redirecting...</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="form-input"
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="form-input"
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
