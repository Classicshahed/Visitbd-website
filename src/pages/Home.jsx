// src/pages/Home.jsx
// Editorial Home Experience — Connected to SQLite Database via API Service
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaStar } from 'react-icons/fa';
import HeroSlider from '../components/HeroSlider';
import DestinationCard from '../components/DestinationCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchDestinations, fetchHomeImages } from '../services/api';

const METRICS = [
  { code: '01', value: '64', unit: 'DISTRICTS', label: 'Mapped Across 8 Divisions' },
  { code: '02', value: '120', unit: 'KM COAST', label: 'Unbroken Bay of Bengal Shoreline' },
  { code: '03', value: '10,000', unit: 'SQ KM', label: 'UNESCO Mangrove Biosphere' },
  { code: '04', value: '4.9', unit: '/ 5.0', label: 'Verified Traveler Dispatch Score' },
];

const EDITORIAL_PILLARS = [
  {
    num: '01',
    title: 'Verified Field Routes & Transit',
    desc: 'Every destination dossier includes real-world bus, rail, river launch, and air fare breakdowns from Dhaka with local ground logistics.',
  },
  {
    num: '02',
    title: 'Authentic Regional Curation',
    desc: 'From indigenous Lushai hill settlements in Rangamati to historic terracotta temples in Rajshahi—curated by local explorers.',
  },
  {
    num: '03',
    title: 'Seasonal & Ecological Timing',
    desc: 'Plan around monsoon cloud seas, winter migratory bird windows, and calm coral reef tides with precise seasonal guidance.',
  },
];

const DISPATCHES = [
  {
    name: 'Sarah Mitchell',
    origin: 'London, United Kingdom',
    route: 'Dhaka → Khagrachari → Sajek Valley',
    quote:
      'Watching dawn break over Konglak Para while clouds rolled below the ridge felt like standing at the edge of the world. The route breakdown made every jeep transfer effortless.',
    rating: 5,
  },
  {
    name: 'Kaito Tanaka',
    origin: 'Kyoto, Japan',
    route: 'Mongla → Karamjal → Katka Sanctuary',
    quote:
      'Three days aboard a wooden launch drifting through silent mangrove creeks in the Sundarbans. Spotting fresh pugmarks along the riverbank at low tide is unforgettable.',
    rating: 5,
  },
  {
    name: 'Amara Osei',
    origin: 'Accra, Ghana',
    route: "Chattogram → Marine Drive → Inani Beach",
    quote:
      'Driving the 80km coastal road between emerald cliffs and the Bay of Bengal at golden hour rivaled any coastal highway I have traveled in the Mediterranean.',
    rating: 5,
  },
];

const HOME_CATEGORIES = ['Featured', 'Beach', 'Hill', 'Forest', 'Heritage'];

function Home() {
  const [allDestinations, setAllDestinations] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Featured');
  const [loading, setLoading] = useState(true);
  const [whyUsImages, setWhyUsImages] = useState([
    'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
    'https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?w=600&q=80',
  ]);

  useEffect(() => {
    fetchDestinations()
      .then((data) => {
        setAllDestinations(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetchHomeImages().then((data) => {
      if (data?.whyUsImages) setWhyUsImages(data.whyUsImages);
    });
  }, []);

  const displayedDestinations =
    activeCategory === 'Featured'
      ? allDestinations.filter((d) => d.featured).slice(0, 6)
      : allDestinations.filter((d) => d.category === activeCategory).slice(0, 6);

  return (
    <div style={{ background: 'var(--dark)' }}>
      {/* Editorial Hero Showcase */}
      <HeroSlider />

      {/* Architectural Metrics Strip */}
      <section
        style={{
          background: 'var(--dark-2)',
          borderBottom: '1px solid var(--border-color)',
          padding: '40px 0',
        }}
      >
        <div className="container" style={{ maxWidth: 1280 }}>
          <div className="row g-4">
            {METRICS.map((m, i) => (
              <div
                key={m.code}
                className="col-6 col-lg-3"
                style={{
                  borderLeft: i > 0 ? '1px solid var(--border-color)' : 'none',
                  paddingLeft: i > 0 ? 24 : 12,
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    color: 'var(--gold)',
                    letterSpacing: '0.1em',
                    marginBottom: 6,
                  }}
                >
                  //{m.code} {m.unit}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: 'clamp(1.75rem, 3vw, 2.35rem)',
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.03em',
                    lineHeight: 1.05,
                    marginBottom: 4,
                  }}
                >
                  {m.value}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curated Destinations Section */}
      <section style={{ padding: 'var(--section-padding)' }} id="featured-destinations">
        <div className="container" style={{ maxWidth: 1280 }}>
          {/* Asymmetric Editorial Header */}
          <div className="row align-items-end justify-content-between mb-5 g-4">
            <div className="col-lg-6">
              <div className="section-badge">Curated Atlas</div>
              <h2 className="section-title mb-0">
                Signature Landscapes of{' '}
                <span className="font-serif-editorial" style={{ color: 'var(--gold-light)', fontSize: '1.08em' }}>
                  Bengal
                </span>
              </h2>
            </div>
            <div className="col-lg-6 d-flex flex-wrap gap-2 justify-content-lg-end">
              {HOME_CATEGORIES.map((cat) => {
                const active = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.74rem',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-sm)',
                      background: active ? 'var(--primary)' : 'var(--dark-2)',
                      border: `1px solid ${active ? 'var(--primary-light)' : 'var(--border-color)'}`,
                      color: active ? '#fff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {loading ? (
            <LoadingSpinner fullPage text="Loading destinations from database..." />
          ) : (
            <>
              <div className="row g-4">
                {(displayedDestinations.length > 0
                  ? displayedDestinations
                  : allDestinations.slice(0, 6)
                ).map((d) => (
                  <div key={d.id} className="col-lg-4 col-md-6 fade-in-up">
                    <DestinationCard destination={d} />
                  </div>
                ))}
              </div>

              <div
                className="d-flex align-items-center justify-content-between flex-wrap gap-3 mt-5 pt-4"
                style={{ borderTop: '1px solid var(--border-color)' }}
              >
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Showing curated highlights from {allDestinations.length} verified destinations in the
                  database.
                </span>
                <Link
                  to="/destinations"
                  className="btn btn-outline-bd d-inline-flex align-items-center gap-2"
                >
                  Explore Full Directory <FaArrowRight size={12} />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Editorial Feature — Field Craft & Philosophy */}
      <section
        style={{
          padding: 'var(--section-padding)',
          background: 'var(--dark-2)',
          borderTop: '1px solid var(--border-color)',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div className="container" style={{ maxWidth: 1280 }}>
          <div className="row g-5 align-items-center">
            <div className="col-lg-5">
              <div className="section-badge">Field Methodology</div>
              <h2 className="section-title mb-3">
                Designed for Independent{' '}
                <span className="font-serif-editorial" style={{ color: 'var(--gold-light)', fontSize: '1.08em' }}>
                  Exploration
                </span>
              </h2>
              <p className="section-subtitle mb-4">
                Bangladesh rewards travelers who look beyond the obvious. We pair local geographic
                data with transparent transit routes so you can navigate river deltas, hill tracts,
                and archaeological sites with confidence.
              </p>

              <div className="d-flex flex-column gap-4 mt-4">
                {EDITORIAL_PILLARS.map((item) => (
                  <div
                    key={item.num}
                    className="d-flex gap-3 align-items-start pt-3"
                    style={{ borderTop: '1px solid var(--border-color)' }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.78rem',
                        color: 'var(--gold)',
                        fontWeight: 600,
                        paddingTop: 2,
                      }}
                    >
                      /{item.num}
                    </span>
                    <div>
                      <h6
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          marginBottom: 5,
                          fontSize: '0.98rem',
                        }}
                      >
                        {item.title}
                      </h6>
                      <p
                        style={{
                          color: 'var(--text-secondary)',
                          fontSize: '0.86rem',
                          lineHeight: 1.65,
                          margin: 0,
                        }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-7">
              <div className="row g-3">
                {whyUsImages.map((src, i) => (
                  <div key={i} className="col-6">
                    <div
                      style={{
                        borderRadius: 'var(--radius-lg)',
                        overflow: 'hidden',
                        border: '1px solid var(--border-color)',
                        height: i % 2 === 0 ? 230 : 190,
                        marginTop: i === 1 ? 28 : i === 2 ? -28 : 0,
                      }}
                    >
                      <img
                        src={src}
                        alt="Bangladesh landscape"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        loading="lazy"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Traveler Field Dispatches */}
      <section style={{ padding: 'var(--section-padding)' }}>
        <div className="container" style={{ maxWidth: 1280 }}>
          <div className="row align-items-end justify-content-between mb-5">
            <div className="col-lg-6">
              <div className="section-badge">Traveler Dispatches</div>
              <h2 className="section-title mb-0">
                Notes from the{' '}
                <span className="font-serif-editorial" style={{ color: 'var(--gold-light)', fontSize: '1.08em' }}>
                  Field
                </span>
              </h2>
            </div>
            <div className="col-lg-5 text-lg-end">
              <p className="section-subtitle mb-0" style={{ fontSize: '0.9rem' }}>
                First-hand accounts logged by international and domestic travelers across Bangladesh.
              </p>
            </div>
          </div>

          <div className="row g-4">
            {DISPATCHES.map((d, i) => (
              <div key={i} className="col-lg-4">
                <div
                  style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '26px 24px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.68rem',
                          color: 'var(--primary-light)',
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {d.route}
                      </span>
                      <div className="d-flex gap-1" style={{ color: 'var(--gold)' }}>
                        {Array.from({ length: d.rating }).map((_, idx) => (
                          <FaStar key={idx} size={11} />
                        ))}
                      </div>
                    </div>
                    <p
                      style={{
                        color: 'var(--text-primary)',
                        fontSize: '0.94rem',
                        lineHeight: 1.75,
                        marginBottom: 24,
                      }}
                    >
                      "{d.quote}"
                    </p>
                  </div>

                  <div
                    className="pt-3 d-flex align-items-center justify-content-between"
                    style={{ borderTop: '1px solid var(--border-color)' }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontWeight: 700,
                          fontSize: '0.88rem',
                          color: 'var(--text-primary)',
                        }}
                      >
                        {d.name}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        {d.origin}
                      </div>
                    </div>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.66rem',
                        color: 'var(--text-muted)',
                      }}
                    >
                      VERIFIED
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Expedition Callout */}
      <section style={{ paddingBottom: 96 }}>
        <div className="container" style={{ maxWidth: 1280 }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #101A15 0%, #0C2E22 100%)',
              border: '1px solid rgba(212, 175, 106, 0.22)',
              borderRadius: 'var(--radius-xl)',
              padding: 'clamp(32px, 5vw, 56px)',
            }}
          >
            <div className="row align-items-center justify-content-between g-4">
              <div className="col-lg-7">
                <div className="section-badge">Begin Your Itinerary</div>
                <h2 className="section-title mb-2">
                  Ready to Map Your Journey Across{' '}
                  <span className="font-serif-editorial" style={{ color: 'var(--gold-light)', fontSize: '1.08em' }}>
                    Bangladesh?
                  </span>
                </h2>
                <p className="section-subtitle mb-0" style={{ maxWidth: 540 }}>
                  Save destinations to your personal wishlist, calculate bus and flight budgets, and
                  lock in your travel dates directly in your account.
                </p>
              </div>
              <div className="col-lg-auto d-flex gap-3 flex-wrap">
                <Link to="/destinations" className="btn btn-primary-bd" style={{ padding: '13px 28px' }}>
                  Browse All Destinations
                </Link>
                <Link to="/register" className="btn btn-outline-bd" style={{ padding: '13px 24px' }}>
                  Create Traveler Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
