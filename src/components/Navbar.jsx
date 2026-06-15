// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaGlobeAsia, FaHeart, FaUser, FaSignOutAlt, FaBars, FaTimes, FaTachometerAlt, FaUserShield } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import logo from '../assets/logo.png';

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const isAdmin = user?.role === 'admin';
  const { wishlistCount } = useBooking();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const navStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0,
    zIndex: 1000,
    background: scrolled
      ? 'rgba(13,27,42,0.95)'
      : 'rgba(13,27,42,0.4)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
    transition: 'all 0.4s ease',
    padding: '0 0',
  };

  const linkStyle = (isActive) => ({
    color: isActive ? 'var(--primary-light)' : 'var(--text-secondary)',
    fontWeight: 500,
    fontSize: '0.9rem',
    padding: '6px 4px',
    borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
    transition: 'var(--transition)',
    fontFamily: 'var(--font-heading)',
  });

  return (
    <nav style={navStyle} id="main-navbar">
      <div className="container" style={{ maxWidth: 1280 }}>
        <div className="d-flex align-items-center justify-content-between" style={{ height: 70 }}>

          {/* Logo */}
          <Link to="/" className="d-flex align-items-center gap-2" style={{ textDecoration: 'none' }}>
            <img src={logo} alt="VisitBD Logo" style={{ height: '55px', width: 'auto', objectFit: 'contain' }} />
          </Link>

          {/* Desktop Nav Links */}
          <div className="d-none d-lg-flex align-items-center gap-4">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'} style={({ isActive }) => linkStyle(isActive)}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right Side */}
          <div className="d-none d-lg-flex align-items-center gap-3">
            {/* Wishlist */}
            <Link to={isAuthenticated ? '/dashboard' : '/login'} style={{ position: 'relative', color: 'var(--text-secondary)', transition: 'var(--transition)' }} title="My Wishlist">
              <FaHeart size={17} />
              {wishlistCount > 0 && (
                <span style={badgeStyle}>{wishlistCount}</span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="dropdown-toggle"
                  data-bs-toggle="dropdown"
                  style={avatarBtnStyle}
                  id="user-dropdown-btn"
                >
                  <img src={user.avatar} alt={user.name} width={32} height={32} style={{ borderRadius: '50%', objectFit: 'cover' }} />
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user.name.split(' ')[0]}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item d-flex align-items-center gap-2" to="/dashboard" id="dashboard-link">
                      <FaTachometerAlt size={13} /> Dashboard
                    </Link>
                  </li>
                  {isAdmin && (
                    <li>
                      <Link className="dropdown-item d-flex align-items-center gap-2" to="/admin" id="admin-panel-link" style={{ color: 'var(--gold)' }}>
                        <FaUserShield size={13} /> Admin Panel
                      </Link>
                    </li>
                  )}
                  <li><hr className="dropdown-divider" style={{ borderColor: 'var(--border-color)' }} /></li>
                  <li>
                    <button className="dropdown-item d-flex align-items-center gap-2" onClick={handleLogout} id="logout-btn" style={{ color: 'var(--accent)' }}>
                      <FaSignOutAlt size={13} /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-sm" style={loginBtnStyle} id="login-nav-btn">Login</Link>
                <Link to="/register" className="btn btn-sm btn-primary-bd" id="register-nav-btn">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="d-lg-none"
            onClick={() => setMenuOpen(!menuOpen)}
            style={hamburgerStyle}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={mobileMenuStyle}>
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMenuOpen(false)}
                style={({ isActive }) => ({
                  display: 'block',
                  padding: '12px 0',
                  color: isActive ? 'var(--primary-light)' : 'var(--text-secondary)',
                  fontWeight: 500,
                  borderBottom: '1px solid var(--border-color)',
                  fontFamily: 'var(--font-heading)',
                })}
              >
                {link.label}
              </NavLink>
            ))}
            <div className="d-flex gap-2 pt-3">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="btn btn-sm btn-outline-bd flex-fill" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                  <button className="btn btn-sm btn-accent-bd flex-fill" onClick={handleLogout}>Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-sm btn-outline-bd flex-fill" onClick={() => setMenuOpen(false)}>Login</Link>
                  <Link to="/register" className="btn btn-sm btn-primary-bd flex-fill" onClick={() => setMenuOpen(false)}>Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/destinations', label: 'Destinations' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const logoIconStyle = {
  width: 36, height: 36,
  background: 'var(--gradient-primary)',
  borderRadius: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: 'var(--shadow-glow-green)',
};

const badgeStyle = {
  position: 'absolute',
  top: -7, right: -7,
  background: 'var(--accent)',
  color: '#fff',
  fontSize: '0.62rem',
  fontWeight: 700,
  width: 16, height: 16,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const avatarBtnStyle = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-full)',
  padding: '5px 12px 5px 6px',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  cursor: 'pointer',
  transition: 'var(--transition)',
};

const loginBtnStyle = {
  background: 'transparent',
  border: '1px solid var(--border-color)',
  color: 'var(--text-secondary)',
  borderRadius: 'var(--radius-full)',
  padding: '6px 16px',
};

const hamburgerStyle = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid var(--border-color)',
  color: 'var(--text-primary)',
  width: 40, height: 40,
  borderRadius: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};

const mobileMenuStyle = {
  paddingBottom: 20,
  borderTop: '1px solid var(--border-color)',
  marginTop: 4,
};

export default Navbar;
