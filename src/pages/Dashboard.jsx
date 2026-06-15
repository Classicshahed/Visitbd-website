// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaHistory, FaUser, FaSignOutAlt, FaMapMarkerAlt, FaStar, FaTrash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';

const TABS = ['wishlist', 'recent', 'profile'];

function Dashboard() {
  const { user, logout } = useAuth();
  const { wishlist, removeFromWishlist, clearWishlist, recentlyViewed, clearRecentlyViewed } = useBooking();
  const [activeTab, setActiveTab] = useState('wishlist');

  const formatPrice = (p) => `৳${p?.toLocaleString('en-BD')}`;

  return (
    <div className="page-wrapper" style={{ background: 'var(--dark)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'var(--dark-2)', borderBottom: '1px solid var(--border-color)', padding: '40px 0 0' }}>
        <div className="container" style={{ maxWidth: 1280 }}>
          <div className="d-flex align-items-center gap-4 pb-4 flex-wrap">
            <img src={user?.avatar} alt={user?.name} width={72} height={72} style={{ borderRadius: '50%', border: '3px solid var(--primary)', objectFit: 'cover' }} />
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: 3 }}>
                Hello, {user?.name?.split(' ')[0]}! 👋
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: 4 }}>{user?.email}</p>
              <div style={{ display: 'inline-block', background: 'rgba(0,106,78,0.15)', border: '1px solid rgba(0,106,78,0.3)', color: 'var(--primary-light)', padding: '2px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase' }}>
                {user?.role}
              </div>
            </div>
            <button
              onClick={logout}
              className="ms-auto d-flex align-items-center gap-2"
              style={{ background: 'rgba(244,42,65,0.1)', border: '1px solid rgba(244,42,65,0.3)', color: 'var(--accent)', padding: '8px 16px', borderRadius: 'var(--radius-full)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'var(--font-heading)' }}
              id="dashboard-logout-btn"
            >
              <FaSignOutAlt size={13} /> Logout
            </button>
          </div>

          {/* Tab nav */}
          <div className="d-flex gap-1">
            {[
              { key: 'wishlist', icon: <FaHeart size={13} />, label: `Wishlist (${wishlist.length})` },
              { key: 'recent', icon: <FaHistory size={13} />, label: `Recent (${recentlyViewed.length})` },
              { key: 'profile', icon: <FaUser size={13} />, label: 'Profile' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                id={`tab-${tab.key}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'transparent', border: 'none',
                  color: activeTab === tab.key ? 'var(--primary-light)' : 'var(--text-secondary)',
                  borderBottom: activeTab === tab.key ? '2px solid var(--primary)' : '2px solid transparent',
                  padding: '10px 16px', cursor: 'pointer',
                  fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.88rem',
                  transition: 'var(--transition)',
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container section-sm" style={{ maxWidth: 1280 }}>
        {/* WISHLIST TAB */}
        {activeTab === 'wishlist' && (
          <div>
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', margin: 0 }}>
                My Wishlist
              </h4>
              {wishlist.length > 0 && (
                <button onClick={clearWishlist} style={clearBtnStyle} id="clear-wishlist-btn">
                  <FaTrash size={12} /> Clear All
                </button>
              )}
            </div>
            {wishlist.length === 0 ? (
              <EmptyState icon={<FaHeart size={40} color="var(--text-muted)" />} title="No saved destinations yet" desc="Explore destinations and tap the heart icon to save them here." link="/destinations" linkText="Browse Destinations" />
            ) : (
              <div className="row g-4">
                {wishlist.map(d => (
                  <div key={d.id} className="col-lg-4 col-md-6">
                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', transition: 'var(--transition)' }}>
                      <div style={{ position: 'relative', height: 160 }}>
                        <img src={d.image} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 40%,rgba(13,27,42,0.8) 100%)' }} />
                        <button onClick={() => removeFromWishlist(d.id)} style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(244,42,65,0.8)', border: 'none', color: '#fff', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FaTrash size={11} />
                        </button>
                      </div>
                      <div style={{ padding: '14px' }}>
                        <h6 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: 4 }}>{d.name}</h6>
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center gap-1">
                            <FaMapMarkerAlt size={11} color="var(--accent)" />
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{d.division}</span>
                          </div>
                          <div className="d-flex align-items-center gap-1">
                            <FaStar size={11} color="var(--gold)" />
                            <span style={{ fontSize: '0.78rem', color: 'var(--gold)', fontWeight: 700 }}>{d.rating}</span>
                          </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between mt-2">
                          <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.95rem' }}>{formatPrice(d.price)}</span>
                          <Link to={`/destinations/${d.id}`} style={{ fontSize: '0.78rem', color: 'var(--primary-light)', fontWeight: 600 }}>View →</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* RECENTLY VIEWED TAB */}
        {activeTab === 'recent' && (
          <div>
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', margin: 0 }}>Recently Viewed</h4>
              {recentlyViewed.length > 0 && (
                <button onClick={clearRecentlyViewed} style={clearBtnStyle} id="clear-recent-btn"><FaTrash size={12} /> Clear</button>
              )}
            </div>
            {recentlyViewed.length === 0 ? (
              <EmptyState icon={<FaHistory size={40} color="var(--text-muted)" />} title="No recently viewed destinations" desc="Visit any destination page to see your browsing history here." link="/destinations" linkText="Start Exploring" />
            ) : (
              <div className="d-flex flex-column gap-3">
                {recentlyViewed.map((d, i) => (
                  <Link key={d.id} to={`/destinations/${d.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: 14, transition: 'var(--transition)' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, minWidth: 20 }}>#{i + 1}</span>
                      <img src={d.image} alt={d.name} width={60} height={48} style={{ borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{d.name}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{d.division} · {d.category}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.9rem' }}>{formatPrice(d.price)}</div>
                        <div style={{ color: 'var(--primary-light)', fontSize: '0.75rem' }}>View →</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 32, textAlign: 'center' }}>
                <img src={user?.avatar} alt={user?.name} width={90} height={90} style={{ borderRadius: '50%', border: '3px solid var(--primary)', marginBottom: 16 }} />
                <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', marginBottom: 4 }}>{user?.name}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>{user?.email}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', fontStyle: 'italic', marginBottom: 24 }}>"{user?.bio}"</p>
                <div className="row g-3 text-center mb-4">
                  {[
                    { label: 'Wishlist', value: wishlist.length },
                    { label: 'Viewed', value: recentlyViewed.length },
                    { label: 'Member Since', value: user?.joinDate || 'N/A' },
                  ].map((s, i) => (
                    <div key={i} className="col-4">
                      <div style={{ background: 'var(--dark-3)', borderRadius: 'var(--radius-md)', padding: '12px 8px' }}>
                        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary-light)' }}>{s.value}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/destinations" className="btn btn-primary-bd w-100">Continue Exploring</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ icon, title, desc, link, linkText }) {
  return (
    <div className="text-center py-5">
      {icon}
      <h5 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-muted)', marginTop: 16, marginBottom: 8 }}>{title}</h5>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 20 }}>{desc}</p>
      <Link to={link} className="btn btn-outline-bd">{linkText}</Link>
    </div>
  );
}

const clearBtnStyle = {
  display: 'flex', alignItems: 'center', gap: 5,
  background: 'rgba(244,42,65,0.08)', border: '1px solid rgba(244,42,65,0.25)',
  color: 'var(--accent)', padding: '6px 14px', borderRadius: 'var(--radius-full)',
  cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, transition: 'var(--transition)',
  fontFamily: 'var(--font-heading)',
};

export default Dashboard;
