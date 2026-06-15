// src/components/MapView.jsx
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';

// Fix Leaflet default marker icon broken in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom SVG marker factory
function createCustomIcon(color = '#006A4E', size = 36) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size + 6}" viewBox="0 0 36 42">
      <circle cx="18" cy="18" r="16" fill="${color}" stroke="white" stroke-width="2.5" opacity="0.95"/>
      <polygon points="10,30 18,42 26,30" fill="${color}" opacity="0.95"/>
      <circle cx="18" cy="18" r="7" fill="white" opacity="0.9"/>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [size, size + 6],
    iconAnchor: [size / 2, size + 6],
    popupAnchor: [0, -(size + 6)],
  });
}

const CATEGORY_COLORS = {
  Beach: '#00B4D8',
  Hill: '#4CAF50',
  Forest: '#1B5E20',
  Heritage: '#E8B84B',
  Lake: '#0288D1',
  'Tea Garden': '#558B2F',
  Adventure: '#F42A41',
  Cultural: '#9C27B0',
  default: '#006A4E',
};

// Auto-fit bounds component
function FitBounds({ destinations }) {
  const map = useMap();
  useEffect(() => {
    if (destinations.length > 0) {
      const bounds = destinations.map(d => [d.lat, d.lng]);
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [destinations, map]);
  return null;
}

function MapView({ destinations = [], height = '520px', singleDestination = null }) {
  const center = singleDestination
    ? [singleDestination.lat, singleDestination.lng]
    : [23.685, 90.356]; // Bangladesh center

  const zoom = singleDestination ? 11 : 7;

  const displayList = singleDestination ? [singleDestination] : destinations;

  const formatPrice = (p) => `৳${p?.toLocaleString('en-BD')}`;

  return (
    <div style={{ height, width: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)', position: 'relative' }}>
      <MapContainer
        center={[center[0], center[1]]}
        zoom={zoom}
        style={{ height: '100%', width: '100%', background: '#1A2E42' }}
        zoomControl={true}
      >
        {/* Dark tile layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Auto-fit bounds for multi-destination view */}
        {!singleDestination && displayList.length > 1 && (
          <FitBounds destinations={displayList} />
        )}

        {/* Markers */}
        {displayList.map(dest => {
          const color = CATEGORY_COLORS[dest.category] || CATEGORY_COLORS.default;
          const icon = createCustomIcon(color);
          return (
            <Marker key={dest.id} position={[dest.lat, dest.lng]} icon={icon}>
              <Popup maxWidth={240} className="custom-popup">
                <div style={{ fontFamily: 'Inter, sans-serif', padding: '4px 0' }}>
                  {/* Image */}
                  <div style={{ margin: '-14px -20px 10px', overflow: 'hidden', height: 100, borderRadius: '8px 8px 0 0' }}>
                    <img src={dest.image} alt={dest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>

                  {/* Category badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <span style={{ background: color, color: '#fff', padding: '2px 8px', borderRadius: 20, fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' }}>
                      {dest.category}
                    </span>
                    <span style={{ color: '#E8B84B', fontWeight: 700, fontSize: '0.8rem' }}>★ {dest.rating}</span>
                  </div>

                  {/* Name */}
                  <strong style={{ display: 'block', fontSize: '0.95rem', color: '#0D1B2A', marginBottom: 2 }}>
                    {dest.name}
                  </strong>
                  <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: 4 }}>📍 {dest.division}</div>

                  {/* Price & link */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                    <span style={{ color: '#006A4E', fontWeight: 700, fontSize: '0.85rem' }}>from {formatPrice(dest.price)}</span>
                    <a
                      href={`/destinations/${dest.id}`}
                      style={{ background: '#006A4E', color: '#fff', padding: '4px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600, textDecoration: 'none' }}
                    >
                      Explore →
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Legend for multi-view */}
      {!singleDestination && (
        <div style={{ position: 'absolute', bottom: 12, left: 12, zIndex: 1000, background: 'rgba(13,27,42,0.85)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px' }}>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Categories</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 12px', maxWidth: 200 }}>
            {Object.entries(CATEGORY_COLORS).filter(([k]) => k !== 'default').map(([cat, color]) => (
              <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.7)' }}>{cat}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MapView;
