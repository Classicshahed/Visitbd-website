// src/components/BTBWidget.jsx
// Bangladesh Tourism Board — fixed bottom-left info widget
import React, { useState } from 'react';
import { FaGlobeAsia, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaChevronUp, FaChevronDown, FaExternalLinkAlt } from 'react-icons/fa';

function BTBWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div style={containerStyle} id="btb-widget">
        {/* Toggle Header */}
        <button
          onClick={() => setOpen(p => !p)}
          style={toggleStyle}
          id="btb-toggle-btn"
          aria-label="Toggle Bangladesh Tourism Board info"
        >
          <div className="d-flex align-items-center gap-2">
            <div style={flagBadgeStyle}>🇧🇩</div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary-light)', letterSpacing: '0.3px', lineHeight: 1, fontFamily: 'var(--font-heading)' }}>
                BANGLADESH
              </div>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.5px', lineHeight: 1.2 }}>
                TOURISM BOARD
              </div>
            </div>
          </div>
          {open ? <FaChevronDown size={11} color="var(--text-muted)" /> : <FaChevronUp size={11} color="var(--text-muted)" />}
        </button>

        {/* Info Panel */}
        {open && (
          <div style={panelStyle} id="btb-info-panel">
            {/* Divider */}
            <div style={{ height: 1, background: 'var(--border-color)', margin: '0 0 12px' }} />

            <div className="d-flex flex-column gap-2">
              {/* Address */}
              <InfoRow icon={<FaMapMarkerAlt size={11} />} color="var(--accent)">
                <span style={infoTextStyle}>
                  233 Airport Road, Tejgaon<br />
                  Dhaka–1215, Bangladesh
                </span>
              </InfoRow>

              {/* Phone */}
              <InfoRow icon={<FaPhone size={11} />} color="var(--primary-light)">
                <a href="tel:+880255107270" style={{ ...infoTextStyle, color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  +880-2-55107270
                </a>
              </InfoRow>

              {/* Email */}
              <InfoRow icon={<FaEnvelope size={11} />} color="var(--gold)">
                <a href="mailto:info@tourismboard.gov.bd" style={{ ...infoTextStyle, color: 'var(--text-secondary)', textDecoration: 'none', wordBreak: 'break-all' }}>
                  info@tourismboard.gov.bd
                </a>
              </InfoRow>

              {/* Hours */}
              <InfoRow icon={<FaClock size={11} />} color="var(--text-muted)">
                <span style={infoTextStyle}>Sun–Thu: 9AM – 5PM</span>
              </InfoRow>
            </div>

            {/* Website Link */}
            <a
              href="http://www.parjatan.gov.bd"
              target="_blank"
              rel="noopener noreferrer"
              id="btb-website-link"
              style={websiteLinkStyle}
            >
              <FaGlobeAsia size={11} />
              <span>parjatan.gov.bd</span>
              <FaExternalLinkAlt size={9} style={{ marginLeft: 'auto' }} />
            </a>

            {/* Hotline */}
            <div style={hotlineStyle}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Tourism Hotline
              </span>
              <a href="tel:16302" style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--gold)', letterSpacing: '1px', textDecoration: 'none' }}>
                16302
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Mobile: tiny floating BTB badge when closed */}
      <style>{`
        #btb-widget:hover {
          box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 16px rgba(0,106,78,0.2) !important;
        }
        @media (max-width: 576px) {
          #btb-widget { max-width: 220px; }
        }
      `}</style>
    </>
  );
}

function InfoRow({ icon, color, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
      <span style={{ color, marginTop: 2, flexShrink: 0 }}>{icon}</span>
      {children}
    </div>
  );
}

const containerStyle = {
  position: 'fixed',
  bottom: 20,
  left: 20,
  zIndex: 999,
  maxWidth: 260,
  background: 'rgba(18,35,51,0.92)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(0,106,78,0.4)',
  borderRadius: 14,
  boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
  transition: 'box-shadow 0.3s ease',
  overflow: 'hidden',
};

const toggleStyle = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: 'none',
  border: 'none',
  padding: '10px 14px',
  cursor: 'pointer',
  gap: 8,
};

const flagBadgeStyle = {
  width: 28, height: 28,
  background: 'rgba(0,106,78,0.2)',
  border: '1px solid rgba(0,106,78,0.4)',
  borderRadius: 8,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: '0.9rem',
  flexShrink: 0,
};

const panelStyle = {
  padding: '0 14px 14px',
};

const infoTextStyle = {
  fontSize: '0.75rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.5,
};

const websiteLinkStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  background: 'rgba(0,106,78,0.12)',
  border: '1px solid rgba(0,106,78,0.25)',
  borderRadius: 8,
  padding: '7px 10px',
  marginTop: 10,
  color: 'var(--primary-light)',
  fontSize: '0.75rem',
  fontWeight: 600,
  textDecoration: 'none',
  transition: 'all 0.2s',
};

const hotlineStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: 'rgba(232,184,75,0.07)',
  border: '1px solid rgba(232,184,75,0.2)',
  borderRadius: 8,
  padding: '8px',
  marginTop: 8,
  gap: 2,
};

export default BTBWidget;
