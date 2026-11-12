// src/components/MapView.jsx
// 100% Free, Keyless Interactive Map Engine (OpenStreetMap + Esri Satellite + Nominatim Free Geocoding API)
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';

// Fix Leaflet default marker icon in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Division coordinate fallbacks when a destination has no explicit lat/lng
const DIVISION_COORDS = {
  Dhaka: [23.8103, 90.4125],
  Chittagong: [22.3569, 91.7832],
  'Chittagong Hill Tracts': [23.1634, 92.1982],
  Sylhet: [24.8949, 91.8687],
  Rajshahi: [24.3745, 88.6042],
  Khulna: [22.8456, 89.5403],
  Barisal: [22.701, 90.3535],
  Rangpur: [25.7439, 89.2752],
  Mymensingh: [24.7471, 90.4203],
  Noakhali: [22.8696, 91.0994],
};

// 100% Free, No-API-Key Map Tile Layers
const FREE_TILE_LAYERS = {
  street: {
    label: '🗺️ Street (OSM)',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  satellite: {
    label: '🛰️ Satellite (Esri)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics',
  },
  topo: {
    label: '⛰️ Terrain (Topo)',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors, SRTM | &copy; OpenTopoMap',
  },
};

function createCustomIcon(color = '#0F7656', size = 36) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size + 6}" viewBox="0 0 36 42">
      <circle cx="18" cy="18" r="16" fill="${color}" stroke="#F4F5F0" stroke-width="2.5" opacity="0.96"/>
      <polygon points="10,30 18,42 26,30" fill="${color}" opacity="0.96"/>
      <circle cx="18" cy="18" r="6.5" fill="#F4F5F0" opacity="0.95"/>
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
  Hill: '#22A87E',
  Forest: '#0F7656',
  Heritage: '#D4AF6A',
  Lake: '#0288D1',
  'Tea Garden': '#558B2F',
  Adventure: '#E03E4E',
  Cultural: '#9C27B0',
  default: '#0F7656',
};

function FitBounds({ destinations, flyToCoord }) {
  const map = useMap();
  useEffect(() => {
    if (flyToCoord) {
      map.flyTo(flyToCoord, 12, { duration: 1.2 });
      return;
    }
    if (destinations.length > 1) {
      const bounds = destinations.map((d) => [d.lat, d.lng]);
      map.fitBounds(bounds, { padding: [45, 45] });
    } else if (destinations.length === 1) {
      map.setView([destinations[0].lat, destinations[0].lng], 12);
    }
  }, [destinations, flyToCoord, map]);
  return null;
}

function resolveCoords(dest) {
  if (!dest) return [23.685, 90.356];
  const lat = Number(dest.lat);
  const lng = Number(dest.lng);
  if (!Number.isNaN(lat) && !Number.isNaN(lng) && lat !== 0 && lng !== 0) {
    return [lat, lng];
  }
  return DIVISION_COORDS[dest.division] || [23.8103, 90.4125];
}

function MapView({ destinations = [], height = '520px', singleDestination = null }) {
  const [layerKey, setLayerKey] = useState('street');
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchedPin, setSearchedPin] = useState(null);

  const rawList = singleDestination ? [singleDestination] : destinations;
  const displayList = rawList.filter(Boolean).map((d) => {
    const [lat, lng] = resolveCoords(d);
    return { ...d, lat, lng };
  });

  const center =
    displayList.length === 1 ? [displayList[0].lat, displayList[0].lng] : [23.685, 90.356];
  const zoom = singleDestination ? 12 : 7;

  const formatPrice = (p) => `৳${Number(p || 0).toLocaleString('en-BD')}`;

  // Free OpenStreetMap Nominatim Geocoding Search (No API Key Required)
  const handleFreeGeocodeSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=bd&q=${encodeURIComponent(
        searchQuery.trim()
      )}`;
      const res = await fetch(url, {
        headers: { 'Accept-Language': 'en' },
      });
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const hit = data[0];
        setSearchedPin({
          lat: parseFloat(hit.lat),
          lng: parseFloat(hit.lon),
          name: hit.display_name.split(',').slice(0, 2).join(', '),
        });
      }
    } catch {
      // ignore network error
    } finally {
      setSearching(false);
    }
  };

  const activeLayer = FREE_TILE_LAYERS[layerKey] || FREE_TILE_LAYERS.street;

  return (
    <div
      style={{
        height,
        width: '100%',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
        position: 'relative',
      }}
    >
      {/* Top Overlay Controls: Free Place Search + Map Style Switcher */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 52,
          right: 12,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          flexWrap: 'wrap',
          pointerEvents: 'none',
        }}
      >
        {/* Free Nominatim Place Search */}
        <form
          onSubmit={handleFreeGeocodeSearch}
          style={{
            display: 'flex',
            gap: 4,
            background: 'rgba(10, 14, 12, 0.88)',
            backdropFilter: 'blur(10px)',
            padding: 4,
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-strong)',
            pointerEvents: 'auto',
          }}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search any location in BD..."
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.76rem',
              padding: '4px 8px',
              width: 175,
            }}
          />
          <button
            type="submit"
            disabled={searching}
            style={{
              background: 'var(--primary)',
              border: 'none',
              color: '#fff',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              padding: '4px 10px',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            {searching ? '...' : 'Go'}
          </button>
        </form>

        {/* Layer Switcher */}
        <div
          style={{
            display: 'flex',
            gap: 4,
            background: 'rgba(10, 14, 12, 0.88)',
            backdropFilter: 'blur(10px)',
            padding: 4,
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-strong)',
            pointerEvents: 'auto',
          }}
        >
          {Object.entries(FREE_TILE_LAYERS).map(([key, info]) => (
            <button
              key={key}
              type="button"
              onClick={() => setLayerKey(key)}
              style={{
                background: layerKey === key ? 'var(--primary)' : 'transparent',
                border: 'none',
                color: layerKey === key ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.7rem',
                fontFamily: 'var(--font-mono)',
                padding: '4px 9px',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              {info.label}
            </button>
          ))}
        </div>
      </div>

      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%', background: '#101613' }}
        zoomControl={true}
      >
        <TileLayer
          key={layerKey}
          attribution={activeLayer.attribution}
          url={activeLayer.url}
        />

        <FitBounds
          destinations={displayList}
          flyToCoord={searchedPin ? [searchedPin.lat, searchedPin.lng] : null}
        />

        {/* Searched Custom Pin */}
        {searchedPin && (
          <Marker
            position={[searchedPin.lat, searchedPin.lng]}
            icon={createCustomIcon('#E03E4E', 38)}
          >
            <Popup>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#111' }}>
                <strong>📍 {searchedPin.name}</strong>
                <div style={{ fontSize: '0.72rem', color: '#555', marginTop: 2 }}>
                  {searchedPin.lat.toFixed(4)}° N, {searchedPin.lng.toFixed(4)}° E
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Destination Markers */}
        {displayList.map((dest) => {
          const color = CATEGORY_COLORS[dest.category] || CATEGORY_COLORS.default;
          const icon = createCustomIcon(color);
          return (
            <Marker key={dest.id} position={[dest.lat, dest.lng]} icon={icon}>
              <Popup maxWidth={240} className="custom-popup">
                <div style={{ fontFamily: 'Inter, sans-serif', padding: '4px 0' }}>
                  {dest.image && (
                    <div
                      style={{
                        margin: '-14px -20px 10px',
                        overflow: 'hidden',
                        height: 100,
                        borderRadius: '8px 8px 0 0',
                      }}
                    >
                      <img
                        src={dest.image}
                        alt={dest.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        background: color,
                        color: '#fff',
                        padding: '2px 8px',
                        borderRadius: 20,
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                      }}
                    >
                      {dest.category || 'Location'}
                    </span>
                    {dest.rating && (
                      <span style={{ color: '#D4AF6A', fontWeight: 700, fontSize: '0.8rem' }}>
                        ★ {dest.rating}
                      </span>
                    )}
                  </div>

                  <strong
                    style={{
                      display: 'block',
                      fontSize: '0.95rem',
                      color: '#0A0E0C',
                      marginBottom: 2,
                    }}
                  >
                    {dest.name}
                  </strong>
                  <div style={{ fontSize: '0.75rem', color: '#555', marginBottom: 4 }}>
                    📍 {dest.division}
                  </div>

                  {dest.price && !dest.isOffice && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 8,
                      }}
                    >
                      <span style={{ color: '#0F7656', fontWeight: 700, fontSize: '0.85rem' }}>
                        from {formatPrice(dest.price)}
                      </span>
                      <Link
                        to={`/destinations/${dest.id}`}
                        style={{
                          background: '#0F7656',
                          color: '#fff',
                          padding: '4px 10px',
                          borderRadius: 6,
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          textDecoration: 'none',
                        }}
                      >
                        Explore →
                      </Link>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Legend for multi-view */}
      {!singleDestination && (
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            zIndex: 1000,
            background: 'rgba(10, 14, 12, 0.88)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--border-color)',
            borderRadius: 10,
            padding: '10px 14px',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.66rem',
              color: 'var(--text-muted)',
              marginBottom: 6,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Categories
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 12px', maxWidth: 210 }}>
            {Object.entries(CATEGORY_COLORS)
              .filter(([k]) => k !== 'default')
              .map(([cat, color]) => (
                <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: color,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                    {cat}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MapView;
