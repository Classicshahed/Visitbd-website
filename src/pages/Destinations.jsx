// src/pages/Destinations.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { FaMapMarkedAlt, FaThLarge, FaMap, FaRedo } from 'react-icons/fa';
import SearchFilter from '../components/SearchFilter';
import DestinationCard from '../components/DestinationCard';
import LoadingSpinner from '../components/LoadingSpinner';
import MapView from '../components/MapView';
import { fetchDestinations } from '../services/api';

const DEFAULT_FILTERS = {
  search: '', category: 'All', division: 'All', sortBy: 'rating',
  priceMin: 0, priceMax: 20000, transport: 'All',
};

function Destinations() {
  const [allDestinations, setAllDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'

  const loadDestinations = () => {
    setLoading(true);
    setError(null);
    fetchDestinations()
      .then(data => { setAllDestinations(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  };

  useEffect(() => { loadDestinations(); }, []);

  const filtered = useMemo(() => {
    let data = [...allDestinations];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      data = data.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.division?.toLowerCase().includes(q) ||
        d.category?.toLowerCase().includes(q) ||
        d.shortDesc?.toLowerCase().includes(q) ||
        d.highlights?.some(h => h.toLowerCase().includes(q))
      );
    }
    if (filters.category !== 'All') data = data.filter(d => d.category === filters.category);
    if (filters.division !== 'All') data = data.filter(d => d.division?.includes(filters.division));

    // Price filter
    data = data.filter(d => d.price >= filters.priceMin && d.price <= filters.priceMax);

    // Transport filter
    if (filters.transport !== 'All') {
      data = data.filter(d =>
        d.travelRoutes?.some(r => r.type.toLowerCase().includes(filters.transport.toLowerCase()))
      );
    }

    // Sort
    switch (filters.sortBy) {
      case 'rating':     data.sort((a, b) => b.rating - a.rating); break;
      case 'price_asc':  data.sort((a, b) => a.price - b.price); break;
      case 'price_desc': data.sort((a, b) => b.price - a.price); break;
      case 'name':       data.sort((a, b) => a.name.localeCompare(b.name)); break;
    }

    return data;
  }, [allDestinations, filters]);

  return (
    <div className="page-wrapper" style={{ background: 'var(--dark)', minHeight: '100vh' }}>
      {/* Page Header */}
      <div style={{ background: 'var(--dark-2)', borderBottom: '1px solid var(--border-color)', padding: '48px 0 32px' }}>
        <div className="container" style={{ maxWidth: 1280 }}>
          <div className="d-flex align-items-end justify-content-between flex-wrap gap-3">
            <div>
              <div className="section-badge">🌏 Explore Bangladesh</div>
              <h1 className="section-title mt-2 mb-1">All Destinations</h1>
              <p className="section-subtitle" style={{ maxWidth: 480, marginBottom: 0 }}>
                From pristine beaches to misty hills — discover every corner of beautiful Bangladesh.
              </p>
            </div>

            {/* View Toggle */}
            <div style={{ display: 'flex', gap: 4, background: 'var(--dark-3)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', padding: 4 }}>
              <button
                onClick={() => setViewMode('grid')}
                id="view-grid-btn"
                style={viewToggleBtn(viewMode === 'grid')}
                title="Grid View"
              >
                <FaThLarge size={13} /> Grid
              </button>
              <button
                onClick={() => setViewMode('map')}
                id="view-map-btn"
                style={viewToggleBtn(viewMode === 'map')}
                title="Map View"
              >
                <FaMap size={13} /> Map
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container section-sm" style={{ maxWidth: 1280 }}>
        <SearchFilter filters={filters} onFilterChange={setFilters} resultCount={filtered.length} />

        {/* Error state */}
        {error && (
          <div style={{ background: 'rgba(244,42,65,0.1)', border: '1px solid rgba(244,42,65,0.3)', borderRadius: 'var(--radius-md)', padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.9rem' }}>⚠️ Failed to load destinations</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{error}</div>
            </div>
            <button onClick={loadDestinations} className="btn btn-sm" style={{ background: 'var(--accent)', color: '#fff', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px', border: 'none' }}>
              <FaRedo size={11} /> Retry
            </button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <LoadingSpinner fullPage text="Loading destinations..." />
        ) : viewMode === 'map' ? (
          /* MAP VIEW */
          <div>
            <div style={{ background: 'var(--dark-3)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FaMap size={14} color="var(--primary-light)" />
              <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                Showing <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> destination{filtered.length !== 1 ? 's' : ''} on the map. Click any marker for details.
              </span>
            </div>
            <MapView destinations={filtered} height="580px" />
          </div>
        ) : filtered.length === 0 ? (
          /* EMPTY STATE */
          <div className="text-center py-5">
            <FaMapMarkedAlt size={48} color="var(--text-muted)" />
            <h4 style={{ color: 'var(--text-muted)', marginTop: 16, fontFamily: 'var(--font-heading)' }}>No destinations found</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Try adjusting your search or filters</p>
            <button className="btn btn-outline-bd mt-2" onClick={() => setFilters(DEFAULT_FILTERS)}>Reset All Filters</button>
          </div>
        ) : (
          /* GRID VIEW */
          <div className="row g-4">
            {filtered.map((d, i) => (
              <div key={d.id} className="col-lg-4 col-md-6 fade-in-up" style={{ animationDelay: `${(i % 9) * 0.06}s` }}>
                <DestinationCard destination={d} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const viewToggleBtn = (active) => ({
  display: 'flex', alignItems: 'center', gap: 6,
  background: active ? 'var(--primary)' : 'transparent',
  border: 'none',
  color: active ? '#fff' : 'var(--text-secondary)',
  padding: '7px 14px',
  borderRadius: 'var(--radius-full)',
  fontFamily: 'var(--font-heading)',
  fontWeight: 600, fontSize: '0.82rem',
  cursor: 'pointer',
  transition: 'var(--transition)',
});

export default Destinations;
