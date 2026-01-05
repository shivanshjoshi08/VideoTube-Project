import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import toast from 'react-hot-toast';

function Login() {
    const [identifier, setIdentifier] = useState(''); // Stores email or username
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // State for error messages
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        try {
            // Backend checks $or: [{ username }, { email }]
            // Sending the same value for both allows login by either.
            const response = await login({
                email: identifier,
                username: identifier,
                password
            });

            if (response?.data?.data?.accessToken) {
                localStorage.setItem('accessToken', response.data.data.accessToken);
                localStorage.setItem('refreshToken', response.data.data.refreshToken);
            }
            toast.success('Login successful!');
            navigate('/');
        } catch (error) {
            console.error('Login failed', error);
            setError(error.response?.data?.message || 'Login failed');
            toast.error(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username or Email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    className="form-input"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="form-input"
                />
                <button type="submit" className="btn-primary">Login</button>
            </form>
            <p className="mt-4 text-center">
                Don't have an account? <span
                    onClick={() => navigate('/register')}
                    style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                >
                    Register
                </span>
            </p>
        </div>
    );
}

export default Login;
