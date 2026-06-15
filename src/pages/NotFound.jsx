// src/pages/NotFound.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCompass, FaArrowLeft, FaMapMarkedAlt } from 'react-icons/fa';

function NotFound() {
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setAngle(a => (a + 1) % 360), 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-wrapper d-flex align-items-center justify-content-center" style={{ background: 'var(--dark)', minHeight: '100vh' }}>
      <div className="container text-center" style={{ maxWidth: 560 }}>
        {/* Animated compass */}
        <div style={{ marginBottom: 24 }}>
          <FaCompass size={80} color="var(--primary)" style={{ transform: `rotate(${angle}deg)`, transition: 'none', filter: 'drop-shadow(0 0 20px rgba(0,106,78,0.5))' }} />
        </div>

        {/* 404 */}
        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: 'clamp(5rem, 15vw, 9rem)', lineHeight: 1, background: 'linear-gradient(135deg, var(--primary-light), var(--gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8 }}>
          404
        </div>

        <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12, fontSize: '1.5rem' }}>
          Looks Like You're Off the Map!
        </h2>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 32, maxWidth: 380, margin: '0 auto 32px' }}>
          The page you're looking for doesn't exist or has been moved. Let's get you back on the right trail.
        </p>

        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <Link to="/" id="go-home-btn" className="btn btn-primary-bd d-flex align-items-center gap-2" style={{ padding: '12px 24px' }}>
            <FaArrowLeft size={13} /> Back to Home
          </Link>
          <Link to="/destinations" id="explore-btn" className="btn btn-outline-bd d-flex align-items-center gap-2" style={{ padding: '12px 24px' }}>
            <FaMapMarkedAlt size={13} /> Explore Destinations
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
