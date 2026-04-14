import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — wraps private pages.
 * If the user is not logged in, they are redirected to /login.
 */
function ProtectedRoute({ children }) {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p>Loading...</p>
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;
