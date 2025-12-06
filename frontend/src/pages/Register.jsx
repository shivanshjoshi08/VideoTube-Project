import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const navigate = useNavigate();

    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Prepare data as object first, authService handles FormData conversion if we passed simple object, 
        // BUT authService.register expects a generic data object and iterates keys to append to FormData. 
        // So we can pass a plain object with the file objects.

        const data = {
            fullName,
            email,
            username,
            password,
            avatar,
            coverImage
        };

        try {
            await register(data);
            navigate('/login');
        } catch (error) {
            console.error('Registration failed', error);
            alert('Registration failed');
        }
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <label>Avatar:</label>
                <input
                    type="file"
                    onChange={(e) => setAvatar(e.target.files[0])}
                    required
                />
                <label>Cover Image:</label>
                <input
                    type="file"
                    onChange={(e) => setCoverImage(e.target.files[0])}
                />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;
