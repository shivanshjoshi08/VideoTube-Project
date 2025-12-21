import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
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

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="main-layout">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/video/:videoId" element={<VideoDetail />} />
              <Route path="/c/:username" element={<ChannelProfile />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/history" element={<History />} />
              <Route path="/playlists" element={<Playlists />} />
              <Route path="/playlist/:playlistId" element={<PlaylistDetail />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
