// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

function Register() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.includes('@')) e.email = 'Enter a valid email';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const result = register(form.name.trim(), form.email, form.password);
    setLoading(false);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } else {
      setErrors({ email: result.message });
    }
  };

  if (success) return (
    <div style={pageStyle}>
      <div style={bgStyle} />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,27,42,0.75)', zIndex: 0 }} />
      <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        <div style={{ ...cardStyle, textAlign: 'center' }}>
          <FaCheckCircle size={52} color="var(--primary-light)" />
          <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', marginTop: 14 }}>Account Created!</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Redirecting you to your dashboard...</p>
        </div>
      </div>
    </div>
  );

  const pwStrength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthLabel = ['', 'Weak', 'Good', 'Strong'];
  const strengthColor = ['', 'var(--accent)', 'var(--gold)', 'var(--primary-light)'];

  return (
    <div style={pageStyle}>
      <div style={bgStyle} />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,27,42,0.75)', zIndex: 0 }} />
      <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', position: 'relative', zIndex: 1, padding: '90px 16px 40px' }}>
        <div style={cardStyle}>
          {/* Logo */}
          <div className="text-center mb-4">
            <img src={logo} alt="VisitBD Logo" style={{ height: '70px', width: 'auto', objectFit: 'contain', margin: '0 auto 12px', display: 'block' }} />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>Create Account</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Join VisitBD — free forever</p>
          </div>

          <form onSubmit={handleSubmit} id="register-form">
            {/* Name */}
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <FaUser size={13} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input id="register-name" type="text" name="name" className={`form-control ${errors.name ? 'is-invalid' : ''}`} style={{ paddingLeft: 38 }} placeholder="Your full name" value={form.name} onChange={handleChange} />
              </div>
              {errors.name && <div style={errStyle}>{errors.name}</div>}
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <FaEnvelope size={13} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input id="register-email" type="email" name="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} style={{ paddingLeft: 38 }} placeholder="your@email.com" value={form.email} onChange={handleChange} />
              </div>
              {errors.email && <div style={errStyle}>{errors.email}</div>}
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <FaLock size={13} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input id="register-password" type={showPw ? 'text' : 'password'} name="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} style={{ paddingLeft: 38, paddingRight: 38 }} placeholder="Min 6 characters" value={form.password} onChange={handleChange} />
                <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  {showPw ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
                </button>
              </div>
              {form.password && (
                <div className="d-flex align-items-center gap-2 mt-1">
                  <div style={{ flex: 1, height: 4, background: 'var(--dark-3)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${(pwStrength / 3) * 100}%`, height: '100%', background: strengthColor[pwStrength], borderRadius: 2, transition: 'all 0.3s' }} />
                  </div>
                  <span style={{ fontSize: '0.72rem', color: strengthColor[pwStrength], fontWeight: 600, minWidth: 40 }}>{strengthLabel[pwStrength]}</span>
                </div>
              )}
              {errors.password && <div style={errStyle}>{errors.password}</div>}
            </div>

            {/* Confirm */}
            <div className="mb-4">
              <label className="form-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <FaLock size={13} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input id="register-confirm" type="password" name="confirm" className={`form-control ${errors.confirm ? 'is-invalid' : ''}`} style={{ paddingLeft: 38 }} placeholder="Repeat password" value={form.confirm} onChange={handleChange} />
              </div>
              {errors.confirm && <div style={errStyle}>{errors.confirm}</div>}
            </div>

            <button type="submit" id="register-submit-btn" className="btn btn-primary-bd w-100" style={{ padding: 13 }} disabled={loading}>
              {loading ? (
                <span className="d-flex align-items-center justify-content-center gap-2">
                  <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                  Creating Account...
                </span>
              ) : 'Create Free Account'}
            </button>
          </form>

          <p className="text-center mt-4" style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Sign in</Link>
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    </div>
  );
}

const pageStyle = { position: 'relative', minHeight: '100vh', overflow: 'hidden' };
const bgStyle = { position: 'absolute', inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80')", backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 };
const cardStyle = { width: '100%', maxWidth: 420, background: 'rgba(26,41,64,0.88)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-xl)', padding: '36px 32px' };
const logoStyle = { width: 52, height: 52, background: 'var(--gradient-primary)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', boxShadow: 'var(--shadow-glow-green)' };
const errStyle = { color: '#ff5568', fontSize: '0.78rem', marginTop: 5 };

export default Register;
