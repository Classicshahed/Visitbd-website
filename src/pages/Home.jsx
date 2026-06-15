// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaUsers, FaMapMarkedAlt, FaAward, FaShieldAlt, FaHeadset, FaArrowRight } from 'react-icons/fa';
import HeroSlider from '../components/HeroSlider';
import DestinationCard from '../components/DestinationCard';
import LoadingSpinner from '../components/LoadingSpinner';

const STATS = [
  { icon: <FaMapMarkedAlt size={24} />, value: '15+', label: 'Destinations' },
  { icon: <FaUsers size={24} />, value: '50K+', label: 'Happy Travelers' },
  { icon: <FaStar size={24} />, value: '4.8', label: 'Avg. Rating' },
  { icon: <FaAward size={24} />, value: '10+', label: 'Years Experience' },
];

const WHY_US = [
  { icon: <FaShieldAlt size={28} />, title: 'Safe & Trusted', desc: 'All our listed destinations are verified and traveler-reviewed for your safety and peace of mind.' },
  { icon: <FaAward size={28} />, title: 'Best Experiences', desc: 'Curated selection of the most breathtaking, authentic, and unique destinations Bangladesh has to offer.' },
  { icon: <FaHeadset size={28} />, title: '24/7 Support', desc: 'Our travel experts are always available to guide you through every step of your Bangladesh adventure.' },
];

const TESTIMONIALS = [
  { name: 'Sarah Mitchell', country: '🇬🇧 UK', text: 'Sajek Valley left me absolutely speechless. The cloud sea at sunrise was one of the most magical moments of my life. VisitBD made the whole trip effortless!', avatar: 'https://i.pravatar.cc/80?img=47', rating: 5 },
  { name: 'Kaito Tanaka', country: '🇯🇵 Japan', text: "The Sundarbans boat safari was beyond incredible. Spotting a Royal Bengal Tiger in the wild is something I'll never forget. Truly world-class wildlife!", avatar: 'https://i.pravatar.cc/80?img=12', rating: 5 },
  { name: 'Amara Osei', country: '🇬🇭 Ghana', text: "Cox's Bazar is truly stunning — the longest beach I've ever seen. The seafood, the people, the sunsets... I'm already planning my return trip!", avatar: 'https://i.pravatar.cc/80?img=32', rating: 5 },
];

function Home() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/destinations.json')
      .then(res => res.json())
      .then(data => {
        setDestinations(data.filter(d => d.featured));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <HeroSlider />

      {/* Stats Bar */}
      <section style={{ background: 'var(--dark-2)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '32px 0' }}>
        <div className="container" style={{ maxWidth: 1280 }}>
          <div className="row g-3">
            {STATS.map((s, i) => (
              <div key={i} className="col-6 col-md-3">
                <div className="d-flex align-items-center gap-3 justify-content-center">
                  <div style={{ color: 'var(--primary-light)' }}>{s.icon}</div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.6rem', color: 'var(--text-primary)', lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="section section-dark" id="featured-destinations">
        <div className="container" style={{ maxWidth: 1280 }}>
          <div className="text-center mb-5">
            <div className="section-badge mx-auto">✨ Hand Picked</div>
            <h2 className="section-title mb-3">Featured Destinations</h2>
            <p className="section-subtitle mx-auto" style={{ maxWidth: 520 }}>
              Explore Bangladesh's most breathtaking and unforgettable travel destinations, curated just for you.
            </p>
          </div>

          {loading ? (
            <LoadingSpinner fullPage text="Loading destinations..." />
          ) : (
            <>
              <div className="row g-4">
                {destinations.slice(0, 6).map(d => (
                  <div key={d.id} className="col-lg-4 col-md-6 fade-in-up">
                    <DestinationCard destination={d} />
                  </div>
                ))}
              </div>
              <div className="text-center mt-5">
                <Link to="/destinations" className="btn-primary-bd btn d-inline-flex align-items-center gap-2">
                  View All Destinations <FaArrowRight size={14} />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section section-dark-2">
        <div className="container" style={{ maxWidth: 1280 }}>
          <div className="row g-5 align-items-center">
            <div className="col-lg-5">
              <div className="section-badge">🇧🇩 Bangladesh First</div>
              <h2 className="section-title mt-2 mb-3">Why Travel with VisitBD?</h2>
              <p className="section-subtitle mb-4">
                We are passionate about showcasing the incredible, often underrated beauty of Bangladesh to the world. Every recommendation is authentic, every experience is unforgettable.
              </p>
              <div className="divider-gold" />
              <div className="d-flex flex-column gap-4 mt-4">
                {WHY_US.map((item, i) => (
                  <div key={i} className="d-flex gap-3 align-items-start">
                    <div style={whyIconStyle}>{item.icon}</div>
                    <div>
                      <h6 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{item.title}</h6>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-7">
              <div className="row g-3">
                {[
                  'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600&q=80',
                  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
                  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
                  'https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?w=600&q=80',
                ].map((src, i) => (
                  <div key={i} className={`col-6 ${i === 0 ? 'mt-0' : i === 2 ? 'mt-0' : 'mt-3'}`}>
                    <img src={src} alt="Bangladesh travel" style={{ width: '100%', height: i % 2 === 0 ? 200 : 160, objectFit: 'cover', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }} loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section section-dark">
        <div className="container" style={{ maxWidth: 1280 }}>
          <div className="text-center mb-5">
            <div className="section-badge mx-auto">💬 Reviews</div>
            <h2 className="section-title mb-3">What Travelers Say</h2>
            <div className="divider-primary mx-auto" />
          </div>
          <div className="row g-4">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="col-lg-4 col-md-6">
                <div style={testimonialCardStyle}>
                  <div className="d-flex gap-1 mb-3">
                    {Array(t.rating).fill(0).map((_, j) => <FaStar key={j} size={14} color="var(--gold)" />)}
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>
                    "{t.text}"
                  </p>
                  <div className="d-flex align-items-center gap-3">
                    <img src={t.avatar} alt={t.name} width={44} height={44} style={{ borderRadius: '50%', border: '2px solid var(--primary)' }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>{t.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t.country}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ background: 'var(--gradient-primary)', padding: '70px 0' }}>
        <div className="container text-center" style={{ maxWidth: 1280 }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#fff', marginBottom: 12 }}>
            Ready to Explore Bangladesh?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', maxWidth: 500, margin: '0 auto 28px' }}>
            Create your free account and start saving your dream destinations today.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/register" className="btn" style={{ background: '#fff', color: 'var(--primary)', padding: '14px 32px', borderRadius: 'var(--radius-full)', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
              Get Started Free
            </Link>
            <Link to="/destinations" className="btn" style={{ background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.5)', color: '#fff', padding: '14px 32px', borderRadius: 'var(--radius-full)', fontWeight: 600, fontFamily: 'var(--font-heading)' }}>
              Browse Destinations
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

const whyIconStyle = {
  width: 52, height: 52,
  background: 'rgba(0,106,78,0.12)',
  border: '1px solid rgba(0,106,78,0.25)',
  borderRadius: 'var(--radius-md)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: 'var(--primary-light)',
  flexShrink: 0,
};

const testimonialCardStyle = {
  background: 'var(--card-bg)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-lg)',
  padding: '24px',
  height: '100%',
  transition: 'var(--transition)',
};

export default Home;
