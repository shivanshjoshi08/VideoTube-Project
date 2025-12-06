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
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
