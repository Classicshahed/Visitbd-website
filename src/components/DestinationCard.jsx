// src/components/DestinationCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaClock, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';

function DestinationCard({ destination, className = '' }) {
  const { toggleWishlist, isWishlisted } = useBooking();
  const { isAuthenticated } = useAuth();
  const wishlisted = isWishlisted(destination.id);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    toggleWishlist(destination);
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 })
      .format(price)
      .replace('BDT', '৳');

  return (
    <div className={`destination-card ${className}`} style={cardStyle}>
      {/* Image */}
      <div style={{ position: 'relative', overflow: 'hidden', height: '220px' }}>
        <img
          src={destination.image}
          alt={destination.name}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 0.5s ease',
          }}
          className="card-img"
          loading="lazy"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80'; }}
        />
        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'var(--gradient-card)' }} />

        {/* Category pill */}
        <div style={{ position: 'absolute', top: 14, left: 14 }}>
          <span className="category-pill">{destination.category}</span>
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          style={wishlistBtnStyle(wishlisted)}
          title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-label="Toggle wishlist"
        >
          {wishlisted ? <FaHeart size={15} /> : <FaRegHeart size={15} />}
        </button>

        {/* Featured badge */}
        {destination.featured && (
          <div style={{ position: 'absolute', bottom: 14, left: 14 }}>
            <span className="badge-gold" style={{ fontSize: '0.68rem' }}>⭐ Featured</span>
          </div>
        )}

        {/* Rating */}
        <div style={{ position: 'absolute', bottom: 14, right: 14 }}>
          <div style={ratingBadgeStyle}>
            <FaStar size={11} color="#E8B84B" />
            <span>{destination.rating}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '18px' }}>
        <div className="d-flex align-items-start justify-content-between mb-1">
          <h5 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 0, lineHeight: 1.3 }}>
            {destination.name}
          </h5>
        </div>

        <div className="d-flex align-items-center gap-1 mb-2">
          <FaMapMarkerAlt size={12} color="var(--accent)" />
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{destination.division}</span>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '14px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {destination.shortDesc}
        </p>

        {/* Duration & Price row */}
        <div className="d-flex align-items-center justify-content-between mb-14">
          <div className="d-flex align-items-center gap-1">
            <FaClock size={12} color="var(--text-muted)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{destination.duration}</span>
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginRight: 2 }}>from</span>
            <span className="price-tag">{formatPrice(destination.price)}</span>
          </div>
        </div>

        {/* Highlights */}
        <div className="d-flex flex-wrap gap-1 mb-16" style={{ marginTop: '10px', marginBottom: '14px' }}>
          {destination.highlights.slice(0, 3).map((h, i) => (
            <span key={i} style={tagStyle}>{h}</span>
          ))}
        </div>

        {/* CTA */}
        <Link
          to={`/destinations/${destination.id}`}
          style={ctaStyle}
          className="btn-explore"
        >
          Explore Destination →
        </Link>
      </div>

      <style>{cardHoverCSS}</style>
    </div>
  );
}

const cardStyle = {
  background: 'var(--card-bg)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-lg)',
  overflow: 'hidden',
  transition: 'var(--transition)',
  cursor: 'pointer',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
};

const wishlistBtnStyle = (active) => ({
  position: 'absolute',
  top: 14,
  right: 14,
  width: 34,
  height: 34,
  borderRadius: '50%',
  border: 'none',
  background: active ? 'var(--accent)' : 'rgba(13,27,42,0.7)',
  backdropFilter: 'blur(8px)',
  color: active ? '#fff' : 'var(--text-secondary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'var(--transition)',
  zIndex: 2,
});

const ratingBadgeStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  background: 'rgba(13,27,42,0.75)',
  backdropFilter: 'blur(8px)',
  borderRadius: '20px',
  padding: '4px 10px',
  fontSize: '0.78rem',
  fontWeight: 700,
  color: '#E8B84B',
};

const tagStyle = {
  background: 'rgba(0,106,78,0.12)',
  border: '1px solid rgba(0,106,78,0.2)',
  color: '#4db88c',
  padding: '2px 8px',
  borderRadius: '20px',
  fontSize: '0.7rem',
  fontWeight: 500,
};

const ctaStyle = {
  display: 'block',
  width: '100%',
  textAlign: 'center',
  padding: '10px',
  background: 'var(--gradient-primary)',
  color: '#fff',
  borderRadius: 'var(--radius-md)',
  fontWeight: 600,
  fontSize: '0.88rem',
  fontFamily: 'var(--font-heading)',
  transition: 'var(--transition)',
  border: 'none',
};

const cardHoverCSS = `
  .destination-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.5), 0 0 20px rgba(0,106,78,0.15);
    border-color: rgba(0,106,78,0.3);
  }
  .destination-card:hover .card-img {
    transform: scale(1.06);
  }
  .btn-explore:hover {
    opacity: 0.88;
    transform: none;
  }
`;

export default DestinationCard;
