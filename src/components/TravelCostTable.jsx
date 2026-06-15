// src/components/TravelCostTable.jsx
import React from 'react';
import { FaBus, FaTrain, FaPlane, FaShip, FaCar, FaSubway, FaMoneyBillWave } from 'react-icons/fa';

const TYPE_CONFIG = {
  Bus: { icon: <FaBus size={14} />, color: '#4CAF50', bg: 'rgba(76,175,80,0.12)', border: 'rgba(76,175,80,0.3)' },
  'Train+Bus': { icon: <FaTrain size={14} />, color: '#2196F3', bg: 'rgba(33,150,243,0.12)', border: 'rgba(33,150,243,0.3)' },
  Train: { icon: <FaTrain size={14} />, color: '#2196F3', bg: 'rgba(33,150,243,0.12)', border: 'rgba(33,150,243,0.3)' },
  Air: { icon: <FaPlane size={14} />, color: '#FF9800', bg: 'rgba(255,152,0,0.12)', border: 'rgba(255,152,0,0.3)' },
  'Air+Bus': { icon: <FaPlane size={14} />, color: '#FF9800', bg: 'rgba(255,152,0,0.12)', border: 'rgba(255,152,0,0.3)' },
  'Air+Local': { icon: <FaPlane size={14} />, color: '#FF9800', bg: 'rgba(255,152,0,0.12)', border: 'rgba(255,152,0,0.3)' },
  'Bus+Boat': { icon: <FaBus size={14} />, color: '#00BCD4', bg: 'rgba(0,188,212,0.12)', border: 'rgba(0,188,212,0.3)' },
  'Bus+Local': { icon: <FaBus size={14} />, color: '#4CAF50', bg: 'rgba(76,175,80,0.12)', border: 'rgba(76,175,80,0.3)' },
  'Bus+Launch': { icon: <FaShip size={14} />, color: '#009688', bg: 'rgba(0,150,136,0.12)', border: 'rgba(0,150,136,0.3)' },
  'Launch+Bus': { icon: <FaShip size={14} />, color: '#009688', bg: 'rgba(0,150,136,0.12)', border: 'rgba(0,150,136,0.3)' },
  'Tour Package': { icon: <FaShip size={14} />, color: '#9C27B0', bg: 'rgba(156,39,176,0.12)', border: 'rgba(156,39,176,0.3)' },
  Ship: { icon: <FaShip size={14} />, color: '#0288D1', bg: 'rgba(2,136,209,0.12)', border: 'rgba(2,136,209,0.3)' },
  Jeep: { icon: <FaCar size={14} />, color: '#795548', bg: 'rgba(121,85,72,0.12)', border: 'rgba(121,85,72,0.3)' },
  'Local Transport': { icon: <FaSubway size={14} />, color: '#607D8B', bg: 'rgba(96,125,139,0.12)', border: 'rgba(96,125,139,0.3)' },
  Total: { icon: <FaMoneyBillWave size={14} />, color: '#E8B84B', bg: 'rgba(232,184,75,0.12)', border: 'rgba(232,184,75,0.3)' },
};

const DEFAULT_CONFIG = { icon: <FaBus size={14} />, color: '#006A4E', bg: 'rgba(0,106,78,0.12)', border: 'rgba(0,106,78,0.3)' };

function TravelCostTable({ routes = [] }) {
  if (!routes || routes.length === 0) return null;

  const formatCost = (min, max) => {
    if (!min && !max) return 'Varies';
    if (min === max) return `৳${min.toLocaleString('en-BD')}`;
    return `৳${min.toLocaleString('en-BD')} – ৳${max.toLocaleString('en-BD')}`;
  };

  return (
    <div>
      <h5 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', marginBottom: 14, fontSize: '1.05rem' }}>
        🚌 Travel Cost Breakdown
      </h5>
      <div style={{ background: 'var(--dark-3)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 140px', padding: '10px 16px', background: 'rgba(0,106,78,0.1)', borderBottom: '1px solid var(--border-color)' }}>
          <span style={hdrStyle}>Transport</span>
          <span style={hdrStyle}>Route</span>
          <span style={{ ...hdrStyle, textAlign: 'right' }}>Est. Round Trip</span>
        </div>

        {/* Rows */}
        {routes.map((route, i) => {
          const config = TYPE_CONFIG[route.type] || DEFAULT_CONFIG;
          return (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr 140px',
                padding: '12px 16px',
                borderBottom: i < routes.length - 1 ? '1px solid var(--border-color)' : 'none',
                alignItems: 'center',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {/* Type badge */}
              <div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  background: config.bg, border: `1px solid ${config.border}`,
                  color: config.color, padding: '4px 10px', borderRadius: 20,
                  fontSize: '0.72rem', fontWeight: 700,
                }}>
                  {route.icon || config.icon} {route.type}
                </span>
              </div>

              {/* Route path */}
              <span style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {route.path}
              </span>

              {/* Cost */}
              <span style={{ textAlign: 'right', fontWeight: 700, fontSize: '0.88rem', color: route.type === 'Total' ? 'var(--gold)' : 'var(--text-primary)' }}>
                {formatCost(route.minCost, route.maxCost)}
              </span>
            </div>
          );
        })}
      </div>
      <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 8, fontStyle: 'italic' }}>
        * Costs are approximate round-trip estimates for 1 person and may vary by season and operator.
      </p>
    </div>
  );
}

const hdrStyle = {
  fontSize: '0.72rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.8px',
  color: 'var(--text-muted)',
};

export default TravelCostTable;
