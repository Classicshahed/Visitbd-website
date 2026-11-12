// src/components/CommandPalette.jsx
// Global Command Menu (Ctrl+K / Cmd+K) — Implemented per design-taste-frontend skill
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaArrowRight, FaCompass, FaTimes } from 'react-icons/fa';
import { fetchDestinations } from '../services/api';

function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Global keyboard shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (open) onClose();
        else onClose('toggle-open');
      } else if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 40);
      if (destinations.length === 0) {
        fetchDestinations()
          .then(setDestinations)
          .catch(() => {});
      }
    }
  }, [open, destinations.length]);

  if (!open) return null;

  const q = query.trim().toLowerCase();
  const filtered = destinations
    .filter(
      (d) =>
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.division?.toLowerCase().includes(q) ||
        d.category?.toLowerCase().includes(q) ||
        d.shortDesc?.toLowerCase().includes(q)
    )
    .slice(0, 6);

  const handleSelect = (dest) => {
    onClose();
    if (document.startViewTransition) {
      document.startViewTransition(() => navigate(`/destinations/${dest.id}`));
    } else {
      navigate(`/destinations/${dest.id}`);
    }
  };

  const handleKeyNav = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + Math.max(1, filtered.length)) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex]);
    }
  };

  return (
    <div
      onClick={() => onClose()}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(6, 9, 8, 0.78)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '11vh 16px 24px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 620,
          background: 'var(--dark-2)',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
        }}
      >
        {/* Search Input Header */}
        <div
          className="d-flex align-items-center gap-3 px-3 py-3"
          style={{ borderBottom: '1px solid var(--border-color)' }}
        >
          <FaSearch size={14} color="var(--gold)" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyNav}
            placeholder="Search destinations, divisions, or landscapes (e.g. Sajek, Beach, Sylhet)..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.94rem',
              fontFamily: 'var(--font-body)',
            }}
          />
          <button
            onClick={() => onClose()}
            style={{
              background: 'var(--dark-3)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.66rem',
              padding: '3px 8px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
            }}
          >
            ESC
          </button>
        </div>

        {/* Results */}
        <div style={{ maxHeight: 360, overflowY: 'auto', padding: 8 }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.66rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '6px 10px',
            }}
          >
            {q ? `Matching Destinations (${filtered.length})` : 'Quick Destination Index'}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-4" style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              No destinations found matching "{query}".
            </div>
          ) : (
            filtered.map((d, idx) => {
              const active = idx === selectedIndex;
              return (
                <button
                  key={d.id}
                  onClick={() => handleSelect(d)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 12px',
                    background: active ? 'var(--dark-3)' : 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                  }}
                >
                  <img
                    src={d.image}
                    alt={d.name}
                    width={46}
                    height={36}
                    style={{ borderRadius: 6, objectFit: 'cover', flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {d.name}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.68rem',
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                      }}
                    >
                      {d.division} · {d.category} · ৳{Number(d.price).toLocaleString('en-BD')}
                    </div>
                  </div>
                  <FaArrowRight size={11} color={active ? 'var(--gold)' : 'var(--text-muted)'} />
                </button>
              );
            })
          )}
        </div>

        {/* Footer Hint */}
        <div
          className="d-flex align-items-center justify-content-between px-3 py-2"
          style={{
            background: 'var(--dark)',
            borderTop: '1px solid var(--border-color)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.66rem',
            color: 'var(--text-muted)',
          }}
        >
          <span>↑↓ Navigate · ↵ Open Dossier</span>
          <button
            onClick={() => {
              onClose();
              navigate('/destinations');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary-light)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <FaCompass size={11} /> Full Directory →
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;

