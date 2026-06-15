// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaGlobeAsia, FaFacebook, FaInstagram, FaYoutube, FaTwitter, FaMapMarkerAlt, FaPhone, FaEnvelope, FaHeart } from 'react-icons/fa';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={footerStyle}>
      {/* Top accent line */}
      <div style={{ height: 3, background: 'linear-gradient(90deg, var(--primary), var(--gold), var(--accent))' }} />

      <div className="container" style={{ maxWidth: 1280, paddingTop: 60, paddingBottom: 40 }}>
        <div className="row g-4">

          {/* Brand Column */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div style={logoIconStyle}>
                <FaGlobeAsia size={18} color="#fff" />
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                  Visit<span style={{ color: 'var(--primary-light)' }}>BD</span>
                </span>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Tourism</div>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 20 }}>
              Discover the incredible beauty of Bangladesh — from the world's longest beach to the majestic Royal Bengal Tiger habitat. Your adventure starts here.
            </p>
            {/* Social Links */}
            <div className="d-flex gap-2">
              {[
                { icon: <FaFacebook size={16} />, href: '#', label: 'Facebook' },
                { icon: <FaInstagram size={16} />, href: '#', label: 'Instagram' },
                { icon: <FaYoutube size={16} />, href: '#', label: 'YouTube' },
                { icon: <FaTwitter size={16} />, href: '#', label: 'Twitter' },
              ].map((s) => (
                <a key={s.label} href={s.href} style={socialBtnStyle} title={s.label} aria-label={s.label}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 style={colTitleStyle}>Explore</h6>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                { label: 'Home', to: '/' },
                { label: 'All Destinations', to: '/destinations' },
                { label: 'About Us', to: '/about' },
                { label: 'Contact', to: '/contact' },
              ].map((l) => (
                <li key={l.label} style={{ marginBottom: 8 }}>
                  <Link to={l.to} style={footerLinkStyle}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div className="col-lg-3 col-md-6 col-6">
            <h6 style={colTitleStyle}>Top Destinations</h6>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {["Cox's Bazar", 'Sundarbans', 'Sajek Valley', 'Bandarban', 'Saint Martin\'s', 'Sylhet'].map((d) => (
                <li key={d} style={{ marginBottom: 8 }}>
                  <Link to="/destinations" style={footerLinkStyle}>{d}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-3 col-md-6">
            <h6 style={colTitleStyle}>Contact</h6>
            <div className="d-flex flex-column gap-3">
              {[
                { icon: <FaMapMarkerAlt size={14} />, text: 'Dhaka, Bangladesh' },
                { icon: <FaPhone size={14} />, text: '+880 1700 000000' },
                { icon: <FaEnvelope size={14} />, text: 'info@visitbd.com' },
              ].map((item, i) => (
                <div key={i} className="d-flex align-items-center gap-2">
                  <span style={{ color: 'var(--primary-light)', flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{item.text}</span>
                </div>
              ))}
            </div>

            {/* Newsletter */}
            <div style={{ marginTop: 20 }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: 8 }}>Get travel inspiration</p>
              <div className="d-flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="form-control form-control-sm"
                  id="newsletter-email"
                  style={{ flex: 1 }}
                />
                <button className="btn btn-primary-bd btn-sm" id="newsletter-btn" style={{ padding: '6px 16px', whiteSpace: 'nowrap' }}>
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid var(--border-color)', marginTop: 40, paddingTop: 20 }}
          className="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-2">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0 }}>
            © {year} VisitBD Tourism. All rights reserved.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
            Made with <FaHeart size={11} color="var(--accent)" /> for Bangladesh
          </p>
        </div>
      </div>
    </footer>
  );
}

const footerStyle = {
  background: 'var(--dark-2)',
  borderTop: '1px solid var(--border-color)',
  marginTop: 'auto',
};

const logoIconStyle = {
  width: 36, height: 36,
  background: 'var(--gradient-primary)',
  borderRadius: 10,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};

const colTitleStyle = {
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-heading)',
  fontWeight: 700,
  fontSize: '0.9rem',
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
  marginBottom: 16,
};

const footerLinkStyle = {
  color: 'var(--text-secondary)',
  fontSize: '0.88rem',
  transition: 'var(--transition)',
  display: 'inline-block',
};

const socialBtnStyle = {
  width: 36, height: 36,
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid var(--border-color)',
  borderRadius: 8,
  color: 'var(--text-secondary)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'var(--transition)',
};

export default Footer;
