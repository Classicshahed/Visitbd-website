// src/components/SearchFilter.jsx
import React from 'react';
import { FaSearch, FaFilter, FaTimes, FaBus, FaTrain, FaPlane } from 'react-icons/fa';

const CATEGORIES = ['All', 'Beach', 'Hill', 'Forest', 'Heritage', 'Lake', 'Tea Garden', 'Adventure', 'Cultural'];
const DIVISIONS = ['All', 'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Noakhali', 'Chittagong Hill Tracts'];
const SORT_OPTIONS = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'name', label: 'A to Z' },
];
const TRANSPORTS = [
  { value: 'All', label: 'All Transport', icon: null },
  { value: 'Bus', label: 'Bus', icon: <FaBus size={11} /> },
  { value: 'Train', label: 'Train', icon: <FaTrain size={11} /> },
  { value: 'Air', label: 'Air', icon: <FaPlane size={11} /> },
];

const PRICE_MAX = 20000;
const PRICE_MIN = 0;

function SearchFilter({ filters, onFilterChange, resultCount }) {
  const { search, category, division, sortBy, priceMin = 0, priceMax = PRICE_MAX, transport = 'All' } = filters;

  const set = (key, value) => onFilterChange({ ...filters, [key]: value });

  const handleReset = () => onFilterChange({
    search: '', category: 'All', division: 'All', sortBy: 'rating',
    priceMin: PRICE_MIN, priceMax: PRICE_MAX, transport: 'All',
  });

  const hasActive = search || category !== 'All' || division !== 'All' || sortBy !== 'rating'
    || priceMin !== PRICE_MIN || priceMax !== PRICE_MAX || transport !== 'All';

  const formatBDT = (v) => v >= 1000 ? `৳${(v / 1000).toFixed(0)}k` : `৳${v}`;

  return (
    <div style={containerStyle}>
      {/* Row 1: Search + Category + Division + Sort */}
      <div className="row g-2 mb-3 align-items-center">
        <div className="col-lg-4 col-md-5">
          <div style={{ position: 'relative' }}>
            <FaSearch size={13} color="var(--text-muted)" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', zIndex: 1 }} />
            <input
              id="destination-search"
              type="text"
              placeholder="Search destinations, activities..."
              value={search}
              onChange={e => set('search', e.target.value)}
              className="form-control"
              style={{ paddingLeft: 36, paddingRight: search ? 36 : 14 }}
            />
            {search && (
              <button onClick={() => set('search', '')} style={clearBtnStyle}>
                <FaTimes size={11} />
              </button>
            )}
          </div>
        </div>

        <div className="col-lg-2 col-md-3 col-6">
          <select id="category-filter" className="form-select" value={category} onChange={e => set('category', e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c === 'All' ? 'All Types' : c}</option>)}
          </select>
        </div>

        <div className="col-lg-2 col-md-4 col-6">
          <select id="division-filter" className="form-select" value={division} onChange={e => set('division', e.target.value)}>
            {DIVISIONS.map(d => <option key={d} value={d}>{d === 'All' ? 'All Divisions' : d}</option>)}
          </select>
        </div>

        <div className="col-lg-2 col-md-4 col-6">
          <select id="sort-filter" className="form-select" value={sortBy} onChange={e => set('sortBy', e.target.value)}>
            {SORT_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        {hasActive && (
          <div className="col-lg-1 col-md-2 col-6">
            <button onClick={handleReset} style={resetBtnStyle} title="Reset all filters" id="reset-filters-btn">
              <FaTimes size={13} /> Reset
            </button>
          </div>
        )}
      </div>

      {/* Row 2: Price Range + Transport */}
      <div className="row g-2 align-items-center">
        {/* Price Range */}
        <div className="col-lg-5 col-md-6">
          <div style={priceSliderContainer}>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span style={labelStyle}>💰 Budget (BDT)</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 700 }}>
                {formatBDT(priceMin)} – {priceMax >= PRICE_MAX ? 'Any' : formatBDT(priceMax)}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                id="price-min-slider"
                type="range"
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={500}
                value={priceMin}
                onChange={e => set('priceMin', Math.min(Number(e.target.value), priceMax - 500))}
                style={rangeStyle}
              />
              <input
                id="price-max-slider"
                type="range"
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={500}
                value={priceMax}
                onChange={e => set('priceMax', Math.max(Number(e.target.value), priceMin + 500))}
                style={rangeStyle}
              />
            </div>
          </div>
        </div>

        {/* Transport Filter */}
        <div className="col-lg-4 col-md-6">
          <div>
            <span style={{ ...labelStyle, display: 'block', marginBottom: 4 }}>🚌 Transport</span>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {TRANSPORTS.map(t => (
                <button
                  key={t.value}
                  id={`transport-${t.value.toLowerCase()}`}
                  onClick={() => set('transport', t.value)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    background: transport === t.value ? 'var(--primary)' : 'var(--dark-3)',
                    border: `1px solid ${transport === t.value ? 'var(--primary)' : 'var(--border-color)'}`,
                    color: transport === t.value ? '#fff' : 'var(--text-secondary)',
                    padding: '5px 10px', borderRadius: 'var(--radius-full)',
                    cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600,
                    transition: 'var(--transition)', fontFamily: 'var(--font-heading)',
                  }}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Result Count */}
        <div className="col-lg-3 text-lg-end">
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <span style={{ color: 'var(--primary-light)', fontWeight: 700 }}>{resultCount}</span>{' '}
            destination{resultCount !== 1 ? 's' : ''} found
          </span>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActive && (
        <div className="d-flex flex-wrap gap-2 align-items-center mt-3 pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
          <FaFilter size={11} color="var(--text-muted)" />
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Active:</span>
          {search && <Chip label={`"${search}"`} onRemove={() => set('search', '')} />}
          {category !== 'All' && <Chip label={category} onRemove={() => set('category', 'All')} />}
          {division !== 'All' && <Chip label={division} onRemove={() => set('division', 'All')} />}
          {transport !== 'All' && <Chip label={transport} onRemove={() => set('transport', 'All')} />}
          {(priceMin !== PRICE_MIN || priceMax !== PRICE_MAX) && (
            <Chip label={`${formatBDT(priceMin)}–${priceMax >= PRICE_MAX ? 'Any' : formatBDT(priceMax)}`} onRemove={() => { set('priceMin', PRICE_MIN); set('priceMax', PRICE_MAX); }} />
          )}
        </div>
      )}

      <style>{`
        input[type='range'] { accent-color: #006A4E; }
        input[type='range']::-webkit-slider-thumb { background: #006A4E; }
      `}</style>
    </div>
  );
}

function Chip({ label, onRemove }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(0,106,78,0.15)', border: '1px solid rgba(0,106,78,0.3)', color: 'var(--primary-light)', padding: '3px 10px', borderRadius: '20px', fontSize: '0.74rem', fontWeight: 500 }}>
      {label}
      <button onClick={onRemove} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, lineHeight: 1, display: 'flex', alignItems: 'center' }}>
        <FaTimes size={9} />
      </button>
    </span>
  );
}

const containerStyle = { background: 'var(--dark-3)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '20px 24px', marginBottom: '32px' };
const clearBtnStyle = { position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 };
const resetBtnStyle = { display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(244,42,65,0.08)', border: '1px solid rgba(244,42,65,0.25)', color: 'var(--accent)', padding: '7px 12px', borderRadius: 'var(--radius-full)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, fontFamily: 'var(--font-heading)', whiteSpace: 'nowrap', width: '100%', justifyContent: 'center' };
const priceSliderContainer = { background: 'rgba(0,106,78,0.08)', border: '1px solid rgba(0,106,78,0.2)', borderRadius: 'var(--radius-md)', padding: '10px 14px' };
const labelStyle = { fontSize: '0.73rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' };
const rangeStyle = { flex: 1, height: 4, cursor: 'pointer', appearance: 'none', background: 'var(--dark)', borderRadius: 2, outline: 'none' };

export default SearchFilter;
