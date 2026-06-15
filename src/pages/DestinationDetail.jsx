// src/pages/DestinationDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaClock, FaHeart, FaRegHeart, FaArrowLeft, FaCheckCircle, FaCalendarAlt, FaListUl } from 'react-icons/fa';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import DestinationCard from '../components/DestinationCard';
import LoadingSpinner from '../components/LoadingSpinner';
import MapView from '../components/MapView';
import TravelCostTable from '../components/TravelCostTable';
import { fetchDestinationById, fetchDestinations } from '../services/api';

function DestinationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toggleWishlist, isWishlisted, addRecentView } = useBooking();

  const [destination, setDestination] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  const GALLERY = destination ? [
    destination.image,
    `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80`,
    `https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80`,
    `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80`,
  ] : [];

  useEffect(() => {
    setLoading(true);
    setActiveImg(0);
    Promise.all([
      fetchDestinationById(id),
      fetchDestinations()
    ]).then(([dest, all]) => {
      setDestination(dest);
      addRecentView(dest);
      setRelated(all.filter(d => d.id !== dest.id && d.category === dest.category).slice(0, 3));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-wrapper"><LoadingSpinner fullPage text="Loading destination..." /></div>;
  if (!destination) return (
    <div className="page-wrapper d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <h3 style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-heading)' }}>Destination not found</h3>
      <Link to="/destinations" className="btn btn-primary-bd mt-3">Browse All</Link>
    </div>
  );

  const wishlisted = isWishlisted(destination.id);
  const formatPrice = (p) => `৳${p?.toLocaleString('en-BD')}`;

  const DETAIL_TABS = [
    { key: 'overview', label: '📝 Overview' },
    { key: 'activities', label: '🎯 Activities' },
    { key: 'travel', label: '🚌 How to Get There' },
    { key: 'map', label: '🗺️ Location Map' },
  ];

  return (
    <div className="page-wrapper" style={{ background: 'var(--dark)', minHeight: '100vh' }}>
      {/* Back bar */}
      <div style={{ background: 'var(--dark-2)', borderBottom: '1px solid var(--border-color)', padding: '14px 0' }}>
        <div className="container" style={{ maxWidth: 1280 }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-body)', fontSize: '0.85rem' }}>
            <FaArrowLeft size={12} /> Back to Destinations
          </button>
        </div>
      </div>

      <div className="container section-sm" style={{ maxWidth: 1280 }}>
        <div className="row g-5">
          {/* LEFT */}
          <div className="col-lg-8">
            {/* Gallery */}
            <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', height: 400, position: 'relative', marginBottom: 10 }}>
              <img src={GALLERY[activeImg]} alt={destination.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.4s ease' }} onError={e => e.target.src = GALLERY[0]} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 60%,rgba(13,27,42,0.7) 100%)' }} />
              <span className="category-pill" style={{ position: 'absolute', top: 16, left: 16 }}>{destination.category}</span>
              {destination.featured && (
                <span className="badge-gold" style={{ position: 'absolute', top: 16, right: 16, fontSize: '0.68rem' }}>⭐ Featured</span>
              )}
            </div>

            {/* Thumbnails */}
            <div className="d-flex gap-2 mb-4">
              {GALLERY.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} style={{ border: 'none', padding: 0, cursor: 'pointer', borderRadius: 8, overflow: 'hidden', width: 68, height: 50, outline: activeImg === i ? '2px solid var(--primary)' : 'none', outlineOffset: 2, flexShrink: 0 }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: activeImg === i ? 1 : 0.6, transition: 'opacity 0.2s' }} />
                </button>
              ))}
            </div>

            {/* Title + Wishlist */}
            <div className="d-flex align-items-start justify-content-between mb-2 flex-wrap gap-3">
              <div>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', color: 'var(--text-primary)', marginBottom: 6 }}>
                  {destination.name}
                </h1>
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  <div className="d-flex align-items-center gap-1">
                    <FaMapMarkerAlt size={12} color="var(--accent)" />
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{destination.division}</span>
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <FaStar size={12} color="var(--gold)" />
                    <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.88rem' }}>{destination.rating}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Traveler Rating</span>
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <FaClock size={12} color="var(--text-muted)" />
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{destination.duration}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => { if (!isAuthenticated) { navigate('/login'); return; } toggleWishlist(destination); }} style={{ display: 'flex', alignItems: 'center', gap: 6, background: wishlisted ? 'var(--accent)' : 'var(--dark-3)', border: `1px solid ${wishlisted ? 'var(--accent)' : 'var(--border-color)'}`, color: '#fff', padding: '9px 16px', borderRadius: 'var(--radius-full)', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', transition: 'var(--transition)', fontFamily: 'var(--font-heading)' }} id="detail-wishlist-btn">
                {wishlisted ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
                {wishlisted ? 'Saved' : 'Save'}
              </button>
            </div>

            {/* Highlights */}
            <div className="d-flex flex-wrap gap-2 mb-4">
              {destination.highlights?.map((h, i) => (
                <span key={i} style={{ background: 'rgba(0,106,78,0.12)', border: '1px solid rgba(0,106,78,0.25)', color: '#4db88c', padding: '4px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 500 }}>✦ {h}</span>
              ))}
            </div>

            {/* Detail Tabs */}
            <div className="d-flex gap-1 mb-4" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 0 }}>
              {DETAIL_TABS.map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} id={`detail-tab-${tab.key}`}
                  style={{ background: 'transparent', border: 'none', color: activeTab === tab.key ? 'var(--primary-light)' : 'var(--text-secondary)', borderBottom: activeTab === tab.key ? '2px solid var(--primary)' : '2px solid transparent', padding: '8px 12px', cursor: 'pointer', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.82rem', transition: 'var(--transition)', whiteSpace: 'nowrap' }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="mb-5">
              {activeTab === 'overview' && (
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '0.95rem' }}>
                  {destination.overview || destination.description || destination.shortDesc}
                </p>
              )}

              {activeTab === 'activities' && (
                <div>
                  <div className="row g-2">
                    {(destination.activities || destination.highlights || []).map((act, i) => (
                      <div key={i} className="col-sm-6">
                        <div className="d-flex align-items-center gap-2" style={{ background: 'var(--dark-3)', borderRadius: 'var(--radius-md)', padding: '10px 14px', border: '1px solid var(--border-color)' }}>
                          <FaCheckCircle size={13} color="var(--primary-light)" />
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.87rem' }}>{act}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {destination.bestSeason && (
                    <div className="d-flex align-items-center gap-2 mt-4" style={{ background: 'rgba(232,184,75,0.08)', border: '1px solid rgba(232,184,75,0.2)', borderRadius: 'var(--radius-md)', padding: '12px 16px' }}>
                      <FaCalendarAlt size={14} color="var(--gold)" />
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                        <strong style={{ color: 'var(--gold)' }}>Best time to visit:</strong> {destination.bestSeason}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'travel' && (
                <TravelCostTable routes={destination.travelRoutes} />
              )}

              {activeTab === 'map' && destination.lat && destination.lng && (
                <div>
                  <MapView singleDestination={destination} height="380px" />
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8 }}>
                    📍 {destination.name}, {destination.division} — Coordinates: {destination.lat.toFixed(4)}, {destination.lng.toFixed(4)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Booking Panel */}
          <div className="col-lg-4">
            <div style={{ position: 'sticky', top: 90 }}>
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 28 }}>
                <div className="text-center mb-4">
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Starting from</span>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '2rem', color: 'var(--gold)', lineHeight: 1.2 }}>
                    {formatPrice(destination.price)}
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>per person (approx)</span>
                </div>

                {[
                  { icon: <FaClock size={13} />, label: 'Duration', value: destination.duration },
                  { icon: <FaCalendarAlt size={13} />, label: 'Best Season', value: destination.bestSeason || 'Year-round' },
                  { icon: <FaMapMarkerAlt size={13} />, label: 'Division', value: destination.division },
                  { icon: <FaStar size={13} />, label: 'Rating', value: `${destination.rating} / 5.0` },
                ].map((item, i) => (
                  <div key={i} className="d-flex align-items-center justify-content-between py-2" style={{ borderTop: '1px solid var(--border-color)' }}>
                    <div className="d-flex align-items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                      {item.icon}
                      <span style={{ fontSize: '0.82rem' }}>{item.label}</span>
                    </div>
                    <span style={{ color: 'var(--text-primary)', fontSize: '0.82rem', fontWeight: 600 }}>{item.value}</span>
                  </div>
                ))}

                <div className="mt-4 d-flex flex-column gap-2">
                  <button onClick={() => { if (!isAuthenticated) navigate('/login'); }} className="btn btn-primary-bd w-100" id="book-now-btn" style={{ padding: 13 }}>
                    {isAuthenticated ? '📅 Plan This Trip' : '🔐 Login to Plan'}
                  </button>
                  <button
                    onClick={() => { if (!isAuthenticated) { navigate('/login'); return; } toggleWishlist(destination); }}
                    className="btn w-100"
                    style={{ background: wishlisted ? 'rgba(244,42,65,0.1)' : 'var(--dark-3)', border: `1px solid ${wishlisted ? 'var(--accent)' : 'var(--border-color)'}`, color: wishlisted ? 'var(--accent)' : 'var(--text-secondary)', padding: 11 }}
                    id="save-trip-btn"
                  >
                    {wishlisted ? '❤️ Saved to Wishlist' : '🤍 Save to Wishlist'}
                  </button>
                  <button onClick={() => setActiveTab('travel')} className="btn w-100" style={{ background: 'rgba(0,106,78,0.1)', border: '1px solid rgba(0,106,78,0.25)', color: 'var(--primary-light)', padding: 11 }}>
                    🚌 See Travel Costs
                  </button>
                </div>

                {/* Tags */}
                <div className="d-flex flex-wrap gap-2 mt-4">
                  {destination.tags?.map(tag => (
                    <span key={tag} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', padding: '3px 10px', borderRadius: 20, fontSize: '0.7rem' }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Destinations */}
        {related.length > 0 && (
          <div className="mt-5">
            <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', marginBottom: 24 }}>
              More {destination.category} Destinations
            </h4>
            <div className="row g-4">
              {related.map(d => (
                <div key={d.id} className="col-lg-4 col-md-6">
                  <DestinationCard destination={d} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DestinationDetail;
