import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: '🎬',
    title: 'Upload & Share Videos',
    desc: 'Upload your creative content in minutes and reach a global audience instantly.',
  },
  {
    icon: '📋',
    title: 'Smart Playlists',
    desc: 'Organise your favourite videos into playlists and listen without interruption.',
  },
  {
    icon: '💬',
    title: 'Comments & Likes',
    desc: 'Engage with creators and the community through likes, comments, and more.',
  },
  {
    icon: '📡',
    title: 'Subscribe to Channels',
    desc: 'Never miss an update — subscribe to your favourite creators.',
  },
  {
    icon: '📊',
    title: 'Creator Dashboard',
    desc: 'Track views, subscribers, and video performance from one powerful dashboard.',
  },
  {
    icon: '🔒',
    title: 'Secure Authentication',
    desc: 'JWT-powered auth with refresh tokens keeps your account safe at all times.',
  },
];

const stats = [
  { number: '10K+', label: 'Creators' },
  { number: '500K+', label: 'Videos' },
  { number: '2M+', label: 'Monthly Views' },
  { number: '99.9%', label: 'Uptime' },
];

function LandingPage() {
  const heroRef = useRef(null);

  useEffect(() => {
    // Parallax-like mouse glow effect on the hero section
    const handleMouse = (e) => {
      if (!heroRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const xPct = (clientX / innerWidth - 0.5) * 30;
      const yPct = (clientY / innerHeight - 0.5) * 30;
      heroRef.current.style.setProperty('--glow-x', `${50 + xPct}%`);
      heroRef.current.style.setProperty('--glow-y', `${50 + yPct}%`);
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  return (
    <div className="landing-page">
      {/* ─── HERO ────────────────────────────────────────────── */}
      <section className="landing-hero" ref={heroRef}>
        <div className="landing-hero-badge">✨ The next-gen video platform</div>

        <h1 className="landing-hero-title">
          Share Your World<br />
          <span className="landing-gradient-text">One Video at a Time</span>
        </h1>

        <p className="landing-hero-sub">
          VideoTube is a full-featured video platform where creators upload, share,
          and grow. Discover thousands of videos or launch your own channel today.
        </p>

        <div className="landing-hero-cta">
          <Link to="/register" className="landing-btn-primary">
            🚀 Get Started Free
          </Link>
          <Link to="/login" className="landing-btn-secondary">
            Sign In
          </Link>
        </div>

        {/* Floating mock player */}
        <div className="landing-mock-player">
          <div className="mock-player-bar">
            <span className="mock-dot red" />
            <span className="mock-dot yellow" />
            <span className="mock-dot green" />
            <span className="mock-title">VideoTube Player</span>
          </div>
          <div className="mock-player-screen">
            <div className="mock-play-btn">▶</div>
            <div className="mock-waveform">
              {Array.from({ length: 28 }).map((_, i) => (
                <div
                  key={i}
                  className="mock-bar"
                  style={{ animationDelay: `${i * 0.06}s` }}
                />
              ))}
            </div>
          </div>
          <div className="mock-player-controls">
            <span>00:42</span>
            <div className="mock-progress">
              <div className="mock-progress-fill" />
            </div>
            <span>04:30</span>
          </div>
        </div>
      </section>

      {/* ─── STATS ───────────────────────────────────────────── */}
      <section className="landing-stats">
        {stats.map((s) => (
          <div key={s.label} className="landing-stat-card">
            <span className="landing-stat-number">{s.number}</span>
            <span className="landing-stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* ─── FEATURES ────────────────────────────────────────── */}
      <section className="landing-features">
        <div className="landing-section-header">
          <p className="landing-section-tag">What you get</p>
          <h2 className="landing-section-title">Everything a creator needs</h2>
          <p className="landing-section-sub">
            From upload to analytics — we've got you covered.
          </p>
        </div>

        <div className="landing-features-grid">
          {features.map((f) => (
            <div key={f.title} className="landing-feature-card">
              <div className="landing-feature-icon">{f.icon}</div>
              <h3 className="landing-feature-title">{f.title}</h3>
              <p className="landing-feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS ────────────────────────────────────── */}
      <section className="landing-how">
        <div className="landing-section-header">
          <p className="landing-section-tag">Simple & fast</p>
          <h2 className="landing-section-title">Up and running in 3 steps</h2>
        </div>

        <div className="landing-steps">
          <div className="landing-step">
            <div className="landing-step-num">01</div>
            <h3>Create your account</h3>
            <p>Sign up in seconds — no credit card required.</p>
          </div>
          <div className="landing-step-arrow">→</div>
          <div className="landing-step">
            <div className="landing-step-num">02</div>
            <h3>Upload your first video</h3>
            <p>Drag, drop, and go live with your content.</p>
          </div>
          <div className="landing-step-arrow">→</div>
          <div className="landing-step">
            <div className="landing-step-num">03</div>
            <h3>Grow your audience</h3>
            <p>Get subscribers, likes, and meaningful analytics.</p>
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ──────────────────────────────────────── */}
      <section className="landing-cta-banner">
        <h2>Ready to start creating?</h2>
        <p>Join thousands of creators already on VideoTube.</p>
        <div className="landing-hero-cta">
          <Link to="/register" className="landing-btn-primary">
            Create Free Account
          </Link>
          <Link to="/login" className="landing-btn-secondary">
            I already have an account
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────── */}
      <footer className="landing-footer">
        <div className="landing-footer-brand">
          <span className="landing-footer-logo">▶ VideoTube</span>
          <span className="landing-footer-copy">© {new Date().getFullYear()} VideoTube. All rights reserved.</span>
        </div>
        <div className="landing-footer-links">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
