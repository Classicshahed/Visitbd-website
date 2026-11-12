// src/pages/About.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaHeart, FaGlobeAsia, FaUsers, FaAward, FaMapMarkedAlt } from 'react-icons/fa';
import { fetchAboutContent, fetchHomeImages } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const VALUES = [
  { icon: <FaLeaf size={24} />, title: 'Authentic', desc: 'Every destination we showcase has been personally visited and verified by our team.' },
  { icon: <FaHeart size={24} />, title: 'Passionate', desc: 'We truly love Bangladesh and want the world to discover its incredible hidden beauty.' },
  { icon: <FaUsers size={24} />, title: 'Community', desc: 'We\'re building a community of travelers who share their experiences and inspire others.' },
];

function About() {
  const [content, setContent] = useState(null);
  const [missionImage, setMissionImage] = useState('https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=700&q=80');

  useEffect(() => {
    fetchAboutContent().then(setContent);
    fetchHomeImages().then(data => {
      if (data.aboutMissionImage) setMissionImage(data.aboutMissionImage);
    });
  }, []);

  if (!content) {
    return (
      <div className="page-wrapper" style={{ background: 'var(--dark)', minHeight: '100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <LoadingSpinner text="Loading..." />
      </div>
    );
  }

  const team = content.team || [];

  return (
    <div className="page-wrapper" style={{ background: 'var(--dark)', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: 'var(--dark-2)', borderBottom: '1px solid var(--border-color)', padding: '60px 0' }}>
        <div className="container text-center" style={{ maxWidth: 760 }}>
          <div className="section-badge mx-auto">Our Chronicle</div>
          <h1 className="section-title mt-2 mb-3">
            Documenting the Living Landscapes of{' '}
            <span className="font-serif-editorial" style={{ color: 'var(--gold-light)', fontSize: '1.08em' }}>
              Bengal
            </span>
          </h1>
          <p className="section-subtitle">
            {content.heroSubtitle}
          </p>
        </div>
      </div>

      {/* Mission */}
      <section className="section section-dark">
        <div className="container" style={{ maxWidth: 1280 }}>
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <div className="section-badge">Field Mission</div>
              <h2 className="section-title mt-2 mb-3">Why We Built VisitBD</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: 20 }}>
                {content.missionText1}
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: 28 }}>
                {content.missionText2}
              </p>
              <div className="divider-gold" />
              <div className="d-flex flex-column gap-3 mt-4">
                {VALUES.map((v, i) => (
                  <div key={i} className="d-flex gap-3 align-items-start">
                    <div style={{ width: 48, height: 48, background: 'rgba(0,106,78,0.12)', border: '1px solid rgba(0,106,78,0.25)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-light)', flexShrink: 0 }}>
                      {v.icon}
                    </div>
                    <div>
                      <h6 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3 }}>{v.title}</h6>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.87rem', lineHeight: 1.6, margin: 0 }}>{v.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-6">
              <div style={{ position: 'relative' }}>
                <img src={missionImage} alt="Bangladesh beauty" style={{ width: '100%', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)' }} />
                <div style={{ position: 'absolute', bottom: -20, right: -20, background: 'var(--gradient-primary)', borderRadius: 'var(--radius-lg)', padding: '20px 24px', boxShadow: 'var(--shadow-glow-green)' }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '2rem', color: '#fff', lineHeight: 1 }}>15+</div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '1px' }}>Destinations</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: 'var(--gradient-primary)', padding: '60px 0' }}>
        <div className="container" style={{ maxWidth: 1280 }}>
          <div className="row g-4 text-center">
            {[
              { icon: <FaMapMarkedAlt size={28} />, value: '15+', label: 'Destinations Listed' },
              { icon: <FaUsers size={28} />, value: '50,000+', label: 'Travelers Helped' },
              { icon: <FaAward size={28} />, value: '4.8★', label: 'Average Rating' },
              { icon: <FaGlobeAsia size={28} />, value: '64', label: 'Districts Covered' },
            ].map((s, i) => (
              <div key={i} className="col-6 col-md-3">
                <div style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '2rem', color: '#fff', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section section-dark-2">
        <div className="container" style={{ maxWidth: 1280 }}>
          <div className="text-center mb-5">
            <div className="section-badge mx-auto">👥 Our People</div>
            <h2 className="section-title mt-2">Meet the Team</h2>
          </div>
          <div className="row g-4 justify-content-center">
            {team.map((member, i) => (
              <div key={i} className="col-lg-3 col-md-6 col-sm-6">
                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '28px 20px', textAlign: 'center', transition: 'var(--transition)' }}>
                  <img src={member.img} alt={member.name} width={80} height={80} style={{ borderRadius: '50%', border: '3px solid var(--primary)', marginBottom: 14, objectFit: 'cover' }} />
                  <h6 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{member.name}</h6>
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{member.role}</span>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.83rem', lineHeight: 1.6, marginTop: 10, marginBottom: 0 }}>{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section-dark">
        <div className="container text-center" style={{ maxWidth: 640 }}>
          <h2 className="section-title mb-3">{content.ctaTitle}</h2>
          <p className="section-subtitle mb-4">{content.ctaSubtitle}</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/destinations" className="btn btn-primary-bd" style={{ padding: '13px 28px' }}>Browse Destinations</Link>
            <Link to="/register" className="btn btn-outline-bd" style={{ padding: '13px 28px' }}>Create Free Account</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
