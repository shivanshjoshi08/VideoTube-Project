import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';
import VideoDetail from './pages/VideoDetail';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import ChannelProfile from './pages/ChannelProfile';
import SearchResults from './pages/SearchResults';
import History from './pages/History';
import Playlists from './pages/Playlists';
import PlaylistDetail from './pages/PlaylistDetail';

import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';

function AppRoutes() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      {/* Public root: Landing if guest, video feed if logged in */}
      <Route path="/" element={currentUser ? <Home /> : <LandingPage />} />

      {/* Auth pages — always accessible */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Public video browsing */}
      <Route path="/video/:videoId" element={<VideoDetail />} />
      <Route path="/c/:username" element={<ChannelProfile />} />
      <Route path="/search" element={<SearchResults />} />

      {/* Protected — require login */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <Upload />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />
      <Route
        path="/playlists"
        element={
          <ProtectedRoute>
            <Playlists />
          </ProtectedRoute>
        }
      />
      <Route
        path="/playlist/:playlistId"
        element={
          <ProtectedRoute>
            <PlaylistDetail />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Toaster position="top-right" />
        <Navbar />
        <main className="main-content">
          <AppRoutes />
        </main>
      </div>
    </Router>
  );
}

export default App;
