// src/components/HeroSlider.jsx
// Editorial Expedition Showcase — Non-AI High-Craft Hero Architecture
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaPlay, FaPause } from 'react-icons/fa';

const SLIDES = [
  {
    id: 2,
    index: '01',
    eyebrow: 'UNESCO BIOSPHERE · KHULNA DIVISION',
    coords: '21.9497° N, 89.1833° E',
    subtitle: 'The Sundarbans',
    titleItalic: 'Tidal Mangrove Sanctuary',
    description:
      'Navigate an ancient labyrinth of tidal waterways and mist-covered estuaries—home to the Royal Bengal Tiger and the largest halophytic mangrove forest on Earth.',
    image: '/sundarbans_hero.png',
    cta: '/destinations/2',
    season: 'Oct — Mar',
    duration: '3–4 Days',
  },
  {
    id: 1,
    index: '02',
    eyebrow: 'BAY OF BENGAL · CHITTAGONG COAST',
    coords: '21.4272° N, 92.0058° E',
    subtitle: "Cox's Bazar",
    titleItalic: '120 Kilometers of Unbroken Coast',
    description:
      'Where emerald coastal cliffs meet the warm swells of the Bay of Bengal along the longest unbroken natural sea beach in the world.',
    image: '/coxs_bazar_hero.png',
    cta: '/destinations/1',
    season: 'Nov — Mar',
    duration: '3–5 Days',
  },
  {
    id: 3,
    index: '03',
    eyebrow: 'LUSAI HILLS · RANGAMATI',
    coords: '23.3791° N, 92.2940° E',
    subtitle: 'Sajek Valley',
    titleItalic: 'Above the Monsoon Cloud Sea',
    description:
      'Perched 1,800 feet along the Chittagong Hill Tracts ridge, watch dawn break over a rolling ocean of clouds across indigenous hill settlements.',
    image: '/sajek.jpg',
    cta: '/destinations/3',
    season: 'Oct — Apr',
    duration: '2–3 Days',
  },
];

function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const goTo = useCallback((index) => {
    setCurrent(index);
  }, []);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [isPlaying, next]);

  const slide = SLIDES[current];

  return (
    <section
      id="hero-slider"
      style={{
        position: 'relative',
        minHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        background: 'var(--dark)',
        paddingTop: 90,
      }}
    >
      {/* Background photographic plates with subtle scale transition */}
      {SLIDES.map((s, i) => (
        <div
          key={s.id}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${s.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: i === current ? 1 : 0,
            transform: i === current ? 'scale(1.03)' : 'scale(1)',
            transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 6s ease-out',
            zIndex: 0,
          }}
        />
      ))}

      {/* Multi-layered editorial vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(10,14,12,0.88) 0%, rgba(10,14,12,0.52) 55%, rgba(10,14,12,0.3) 100%), linear-gradient(180deg, rgba(10,14,12,0.4) 0%, transparent 35%, rgba(10,14,12,0.96) 100%)',
          zIndex: 1,
        }}
      />

      {/* Main Editorial Content */}
      <div
        className="container my-auto py-5"
        style={{ position: 'relative', zIndex: 2, maxWidth: 1280 }}
      >
        <div className="row align-items-end">
          <div className="col-lg-8" key={slide.id} style={{ animation: 'heroReveal 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
            {/* Top Geographic Metadata Row */}
            <div className="d-flex align-items-center gap-3 flex-wrap mb-3">
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.14em',
                  color: 'var(--gold)',
                  textTransform: 'uppercase',
                }}
              >
                {slide.eyebrow}
              </span>
              <span style={{ color: 'rgba(244,245,240,0.2)' }}>/</span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: 'var(--text-secondary)',
                  letterSpacing: '0.05em',
                }}
              >
                {slide.coords}
              </span>
            </div>

            {/* Editorial Headline Pair */}
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.75rem, 6.2vw, 5.25rem)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                lineHeight: 1.02,
                letterSpacing: '-0.035em',
                marginBottom: 8,
              }}
            >
              {slide.subtitle}
            </h1>
            <div
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: 'clamp(1.65rem, 3.4vw, 2.75rem)',
                color: 'var(--gold-light)',
                lineHeight: 1.15,
                marginBottom: 22,
              }}
            >
              {slide.titleItalic}
            </div>

            {/* Description */}
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: 'clamp(0.95rem, 1.4vw, 1.08rem)',
                lineHeight: 1.75,
                maxWidth: 560,
                marginBottom: 32,
              }}
            >
              {slide.description}
            </p>

            {/* Actions & Field Notes */}
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <Link
                to={slide.cta}
                className="btn btn-primary-bd d-inline-flex align-items-center gap-2"
                style={{ padding: '13px 28px' }}
              >
                Explore Dossier <FaArrowRight size={12} />
              </Link>
              <Link
                to="/destinations"
                className="btn btn-outline-bd"
                style={{ padding: '12px 24px' }}
              >
                All 64 Districts & Sites
              </Link>
            </div>
          </div>

          {/* Right Field Spec Box (Desktop) */}
          <div className="col-lg-4 d-none d-lg-flex justify-content-end">
            <div
              style={{
                background: 'rgba(16, 22, 19, 0.72)',
                backdropFilter: 'blur(16px)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '22px 24px',
                width: 270,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: 14,
                }}
              >
                EXPEDITION BRIEF // {slide.index}
              </div>
              <div
                className="d-flex justify-content-between py-2"
                style={{ borderTop: '1px solid var(--border-color)' }}
              >
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Optimal Window</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                  {slide.season}
                </span>
              </div>
              <div
                className="d-flex justify-content-between py-2"
                style={{ borderTop: '1px solid var(--border-color)' }}
              >
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Recommended</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                  {slide.duration}
                </span>
              </div>
              <div
                className="d-flex justify-content-between pt-2"
                style={{ borderTop: '1px solid var(--border-color)' }}
              >
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Status</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: 'var(--primary-light)' }}>
                  ● Open for Travel
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Architectural Index Bar */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          borderTop: '1px solid var(--border-color)',
          background: 'rgba(10, 14, 12, 0.65)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="container" style={{ maxWidth: 1280 }}>
          <div className="row g-0 align-items-center">
            {SLIDES.map((s, i) => {
              const active = i === current;
              return (
                <div key={s.id} className="col-4">
                  <button
                    onClick={() => goTo(i)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      borderTop: active ? '2px solid var(--gold)' : '2px solid transparent',
                      padding: '16px 14px',
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                      opacity: active ? 1 : 0.55,
                    }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.7rem',
                          color: active ? 'var(--gold)' : 'var(--text-muted)',
                        }}
                      >
                        {s.index}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontWeight: 600,
                          fontSize: '0.86rem',
                          color: 'var(--text-primary)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {s.subtitle}
                      </span>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <button
          onClick={() => setIsPlaying((p) => !p)}
          aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          style={{
            position: 'absolute',
            right: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: '1px solid var(--border-color)',
            color: 'var(--text-secondary)',
            width: 32,
            height: 32,
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          {isPlaying ? <FaPause size={10} /> : <FaPlay size={10} />}
        </button>
      </div>

      <style>{`
        @keyframes heroReveal {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

export default HeroSlider;
