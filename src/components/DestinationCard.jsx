// src/components/DestinationCard.jsx
// Editorial Travel Card — Non-AI High-Craft Component
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaStar, FaHeart, FaRegHeart, FaArrowRight } from 'react-icons/fa';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';

function DestinationCard({ destination, className = '' }) {
  const { toggleWishlist, isWishlisted } = useBooking();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const wishlisted = isWishlisted(destination.id);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    toggleWishlist(destination);
  };

  const formatPrice = (price) =>
    `৳${Number(price || 0).toLocaleString('en-BD')}`;

  return (
    <article
      className={`destination-card ${className}`}
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        transition: 'var(--transition)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image Container */}
      <Link
        to={`/destinations/${destination.id}`}
        style={{
          position: 'relative',
          display: 'block',
          overflow: 'hidden',
          height: 230,
          textDecoration: 'none',
        }}
      >
        <img
          src={destination.image}
          alt={destination.name}
          className="card-img"
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80';
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--gradient-card)',
          }}
        />

        {/* Top Left: Single Clean Category Tag */}
        <div style={{ position: 'absolute', top: 14, left: 14 }}>
          <span className="category-pill">{destination.category}</span>
        </div>

        {/* Top Right: Tactile Wishlist Button */}
        <button
          onClick={handleWishlist}
          title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          aria-label="Toggle wishlist"
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: wishlisted ? 'var(--accent)' : 'rgba(10, 14, 12, 0.65)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(244, 245, 240, 0.14)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'var(--transition)',
          }}
        >
          {wishlisted ? <FaHeart size={13} /> : <FaRegHeart size={13} />}
        </button>

        {/* Bottom Left: Subtle Season / Coordinates Meta */}
        {destination.bestSeason && (
          <div
            style={{
              position: 'absolute',
              bottom: 12,
              left: 14,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              color: 'rgba(244, 245, 240, 0.82)',
              letterSpacing: '0.04em',
            }}
          >
            Best: {destination.bestSeason}
          </div>
        )}
      </Link>

      {/* Card Body */}
      <div
        style={{
          padding: '20px 20px 18px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        {/* Eyebrow: Division & Duration */}
        <div
          className="d-flex align-items-center justify-content-between mb-1"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          <span>{destination.division}</span>
          <span>{destination.duration}</span>
        </div>

        {/* Title & Rating */}
        <div className="d-flex align-items-baseline justify-content-between gap-2 mb-2">
          <Link
            to={`/destinations/${destination.id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <h5
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.12rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              {destination.name}
            </h5>
          </Link>
          <div
            className="d-flex align-items-center gap-1 flex-shrink-0"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              color: 'var(--gold)',
              fontWeight: 500,
            }}
          >
            <FaStar size={11} />
            <span>{destination.rating}</span>
          </div>
        </div>

        {/* Short Editorial Excerpt */}
        <p
          style={{
            fontSize: '0.86rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: 18,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {destination.shortDesc}
        </p>

        {/* Bottom Architectural Footer */}
        <div
          className="d-flex align-items-center justify-content-between mt-auto pt-3"
          style={{ borderTop: '1px solid var(--border-color)' }}
        >
          <div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.66rem',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                display: 'block',
              }}
            >
              Estimated / Person
            </span>
            <span className="price-tag">{formatPrice(destination.price)}</span>
          </div>

          <Link
            to={`/destinations/${destination.id}`}
            className="d-inline-flex align-items-center gap-2"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              textDecoration: 'none',
              padding: '7px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(244, 245, 240, 0.05)',
              border: '1px solid var(--border-color)',
              transition: 'var(--transition)',
            }}
          >
            Explore <FaArrowRight size={10} color="var(--gold)" />
          </Link>
        </div>
      </div>

      <style>{`
        .destination-card:hover {
          transform: translateY(-4px);
          border-color: rgba(212, 175, 106, 0.28) !important;
          box-shadow: var(--shadow-lg);
        }
        .destination-card:hover .card-img {
          transform: scale(1.05);
        }
      `}</style>
    </article>
  );
}

export default DestinationCard;
