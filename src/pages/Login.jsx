// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to={from} replace />;

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // simulate delay
    const result = login(form.email, form.password);
    setLoading(false);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message);
    }
  };

  const fillDemo = () => setForm({ email: 'admin@travel.com', password: 'travel123' });

  return (
    <div style={pageStyle}>
      {/* Background image */}
      <div style={bgStyle} />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,27,42,0.75)', zIndex: 0 }} />

      <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', position: 'relative', zIndex: 1, padding: '90px 16px 40px' }}>
        <div style={cardStyle}>
          {/* Logo */}
          <div className="text-center mb-4">
            <img src={logo} alt="VisitBD Logo" style={{ height: '70px', width: 'auto', objectFit: 'contain', margin: '0 auto 12px', display: 'block', mixBlendMode: 'lighten' }} />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>Welcome Back</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Sign in to your VisitBD account</p>
          </div>

          {/* Demo hint */}
          <div style={demoBannerStyle} onClick={fillDemo} role="button" id="demo-credentials-btn">
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--primary-light)' }}>🎯 Demo Credentials</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>admin@travel.com / travel123</div>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--primary-light)', border: '1px solid currentColor', borderRadius: 4, padding: '2px 8px' }}>Fill</span>
          </div>

          {error && (
            <div style={{ background: 'rgba(244,42,65,0.1)', border: '1px solid rgba(244,42,65,0.3)', borderRadius: 'var(--radius-md)', padding: '10px 14px', marginBottom: 16, color: '#ff5568', fontSize: '0.85rem' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} id="login-form">
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <FaEnvelope size={14} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input id="login-email" type="email" name="email" className="form-control" style={{ paddingLeft: 38 }} placeholder="your@email.com" value={form.email} onChange={handleChange} autoComplete="email" />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <FaLock size={14} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input id="login-password" type={showPw ? 'text' : 'password'} name="password" className="form-control" style={{ paddingLeft: 38, paddingRight: 38 }} placeholder="Enter password" value={form.password} onChange={handleChange} autoComplete="current-password" />
                <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  {showPw ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
              </div>
            </div>

            <button type="submit" id="login-submit-btn" className="btn btn-primary-bd w-100" style={{ padding: 13 }} disabled={loading}>
              {loading ? (
                <span className="d-flex align-items-center justify-content-center gap-2">
                  <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-4" style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Create one free</Link>
          </p>

          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    </div>
  );
}

const pageStyle = { position: 'relative', minHeight: '100vh', overflow: 'hidden' };
const bgStyle = { position: 'absolute', inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80')", backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 };
const cardStyle = { width: '100%', maxWidth: 420, background: 'rgba(26,41,64,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-xl)', padding: '36px 32px' };
const logoStyle = { width: 52, height: 52, background: 'var(--gradient-primary)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', boxShadow: 'var(--shadow-glow-green)' };
const demoBannerStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,106,78,0.1)', border: '1px solid rgba(0,106,78,0.25)', borderRadius: 'var(--radius-md)', padding: '10px 14px', marginBottom: 20, cursor: 'pointer', transition: 'var(--transition)' };

export default Login;
