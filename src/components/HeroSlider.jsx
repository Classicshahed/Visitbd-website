// src/components/HeroSlider.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaPlay, FaPause, FaMapMarkerAlt } from 'react-icons/fa';

const SLIDES = [
  {
    id: 1,
    title: "World's Longest",
    titleHighlight: "Sea Beach",
    subtitle: "Cox's Bazar",
    description: "120 kilometers of unbroken golden sand along the Bay of Bengal — a natural wonder that takes your breath away.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=85",
    location: "Chittagong Division",
    cta: "/destinations/1",
    badge: "🏖️ Most Popular",
  },
  {
    id: 2,
    title: "Queen of",
    titleHighlight: "the Hills",
    subtitle: "Sajek Valley",
    description: "Clouds drift below your feet at 1800 feet above sea level. Wake up to a sea of clouds at sunrise over the Chittagong Hill Tracts.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=85",
    location: "Rangamati District",
    cta: "/destinations/3",
    badge: "⛰️ Top Rated",
  },
  {
    id: 3,
    title: "Land of the",
    titleHighlight: "Royal Bengal Tiger",
    subtitle: "The Sundarbans",
    description: "The world's largest mangrove forest — a UNESCO World Heritage site teeming with the majestic Royal Bengal Tiger.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=85",
    location: "Khulna Division",
    cta: "/destinations/2",
    badge: "🌿 UNESCO Heritage",
  },
];

function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const goTo = useCallback((index) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent(index);
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating]);

  const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + SLIDES.length) % SLIDES.length), [current, goTo]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(next, 5500);
    return () => clearInterval(timer);
  }, [isPlaying, next]);

  const slide = SLIDES[current];

  return (
    <div style={heroStyle} id="hero-slider">
      {/* Background images */}
      {SLIDES.map((s, i) => (
        <div
          key={s.id}
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${s.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: i === current ? 1 : 0,
            transition: 'opacity 0.8s ease',
            zIndex: 0,
          }}
        />
      ))}

      {/* Dark overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'var(--gradient-hero)', zIndex: 1 }} />

      {/* Content */}
      <div className="container h-100 d-flex align-items-center" style={{ position: 'relative', zIndex: 2, maxWidth: 1280 }}>
        <div className="col-lg-8 col-md-10" key={current} style={{ animation: 'heroEnter 0.7s ease forwards' }}>
          {/* Badge */}
          <div className="section-badge mb-3" style={{ display: 'inline-flex' }}>
            <span>{slide.badge}</span>
          </div>

          {/* Location */}
          <div className="d-flex align-items-center gap-2 mb-2">
            <FaMapMarkerAlt size={13} color="var(--accent)" />
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{slide.location}</span>
          </div>

          {/* Title */}
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', color: 'var(--text-secondary)', fontWeight: 400, marginBottom: 4 }}>
              {slide.title}
            </p>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', fontWeight: 800, lineHeight: 1.05, marginBottom: 0 }}>
              <span className="gradient-text">{slide.subtitle}</span>
            </h1>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.2rem, 3vw, 2rem)', color: 'var(--gold)', fontWeight: 600, marginTop: 4 }}>
              {slide.titleHighlight}
            </p>
          </div>

          {/* Description */}
          <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', lineHeight: 1.7, maxWidth: 560, marginBottom: 32 }}>
            {slide.description}
          </p>

          {/* CTAs */}
          <div className="d-flex gap-3 flex-wrap">
            <Link to={slide.cta} className="btn-primary-bd btn" style={{ padding: '14px 32px', fontSize: '0.95rem' }}>
              Explore Now →
            </Link>
            <Link to="/destinations" className="btn btn-outline-bd" style={{ padding: '14px 32px', fontSize: '0.95rem' }}>
              All Destinations
            </Link>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ position: 'absolute', bottom: 40, left: 0, right: 0, zIndex: 3 }}>
        <div className="container d-flex align-items-center justify-content-between" style={{ maxWidth: 1280 }}>
          {/* Dots */}
          <div className="d-flex gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                style={{
                  width: i === current ? 28 : 8,
                  height: 8,
                  borderRadius: 4,
                  border: 'none',
                  background: i === current ? 'var(--primary-light)' : 'rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  padding: 0,
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Arrow + play controls */}
          <div className="d-flex gap-2">
            <button onClick={() => setIsPlaying(p => !p)} style={controlBtnStyle} aria-label={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? <FaPause size={12} /> : <FaPlay size={12} />}
            </button>
            <button onClick={prev} style={controlBtnStyle} aria-label="Previous slide"><FaChevronLeft size={14} /></button>
            <button onClick={next} style={controlBtnStyle} aria-label="Next slide"><FaChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* Slide counter */}
      <div style={{ position: 'absolute', top: 90, right: 40, zIndex: 3 }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
          0{current + 1} / 0{SLIDES.length}
        </span>
      </div>

      <style>{`
        @keyframes heroEnter {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

const heroStyle = {
  position: 'relative',
  height: '100vh',
  minHeight: 600,
  overflow: 'hidden',
  marginTop: -70,
};

const controlBtnStyle = {
  width: 38, height: 38,
  borderRadius: '50%',
  border: '1px solid rgba(255,255,255,0.2)',
  background: 'rgba(13,27,42,0.5)',
  backdropFilter: 'blur(8px)',
  color: 'rgba(255,255,255,0.8)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
  transition: 'var(--transition)',
};

export default HeroSlider;
