// src/pages/Contact.jsx
import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFacebook, FaInstagram, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.includes('@')) e.email = 'Valid email is required';
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (form.message.trim().length < 10) e.message = 'Message must be at least 10 characters';
    return e;
  };

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="page-wrapper" style={{ background: 'var(--dark)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'var(--dark-2)', borderBottom: '1px solid var(--border-color)', padding: '60px 0' }}>
        <div className="container text-center" style={{ maxWidth: 640 }}>
          <div className="section-badge mx-auto">✉️ Get in Touch</div>
          <h1 className="section-title mt-2 mb-3">Contact Us</h1>
          <p className="section-subtitle">Have a question, partnership idea, or just want to say hello? We'd love to hear from you!</p>
        </div>
      </div>

      <div className="container section-sm" style={{ maxWidth: 1280 }}>
        <div className="row g-5">
          {/* Contact Info */}
          <div className="col-lg-4">
            <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', marginBottom: 24 }}>Contact Information</h4>
            <div className="d-flex flex-column gap-4 mb-5">
              {[
                { icon: <FaMapMarkerAlt size={18} />, title: 'Office', text: 'Level 5, Banani Tower\nDhaka-1213, Bangladesh' },
                { icon: <FaPhone size={18} />, title: 'Phone', text: '+880 1700 000000\n+880 1800 000000' },
                { icon: <FaEnvelope size={18} />, title: 'Email', text: 'info@visitbd.com\nsupport@visitbd.com' },
                { icon: <FaClock size={18} />, title: 'Hours', text: 'Sun–Thu: 9am – 6pm\nFri: 9am – 1pm' },
              ].map((item, i) => (
                <div key={i} className="d-flex gap-3 align-items-start">
                  <div style={{ width: 44, height: 44, background: 'rgba(0,106,78,0.12)', border: '1px solid rgba(0,106,78,0.25)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-light)', flexShrink: 0, marginTop: 2 }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: 3, fontFamily: 'var(--font-heading)' }}>{item.title}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{item.text}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <h6 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', marginBottom: 14, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Follow Us</h6>
            <div className="d-flex gap-2">
              {[FaFacebook, FaInstagram].map((Icon, i) => (
                <a key={i} href="#" style={{ width: 38, height: 38, background: 'var(--dark-3)', border: '1px solid var(--border-color)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', transition: 'var(--transition)' }}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="col-lg-8">
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '36px' }}>
              {submitted ? (
                <div className="text-center py-4">
                  <FaCheckCircle size={56} color="var(--primary-light)" />
                  <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', marginTop: 16, marginBottom: 8 }}>Message Sent! 🎉</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  <button className="btn btn-outline-bd mt-3" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }} id="send-another-btn">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} id="contact-form">
                  <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', marginBottom: 24 }}>Send a Message</h4>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Your Name</label>
                      <input id="contact-name" type="text" name="name" className="form-control" placeholder="Full name" value={form.name} onChange={handleChange} />
                      {errors.name && <div style={{ color: '#ff5568', fontSize: '0.78rem', marginTop: 4 }}>{errors.name}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email Address</label>
                      <input id="contact-email" type="email" name="email" className="form-control" placeholder="your@email.com" value={form.email} onChange={handleChange} />
                      {errors.email && <div style={{ color: '#ff5568', fontSize: '0.78rem', marginTop: 4 }}>{errors.email}</div>}
                    </div>
                    <div className="col-12">
                      <label className="form-label">Subject</label>
                      <input id="contact-subject" type="text" name="subject" className="form-control" placeholder="How can we help?" value={form.subject} onChange={handleChange} />
                      {errors.subject && <div style={{ color: '#ff5568', fontSize: '0.78rem', marginTop: 4 }}>{errors.subject}</div>}
                    </div>
                    <div className="col-12">
                      <label className="form-label">Message</label>
                      <textarea id="contact-message" name="message" className="form-control" rows={5} placeholder="Write your message here..." value={form.message} onChange={handleChange} style={{ resize: 'vertical' }} />
                      {errors.message && <div style={{ color: '#ff5568', fontSize: '0.78rem', marginTop: 4 }}>{errors.message}</div>}
                    </div>
                    <div className="col-12">
                      <button type="submit" id="contact-submit-btn" className="btn btn-primary-bd d-flex align-items-center gap-2" style={{ padding: '12px 28px' }} disabled={loading}>
                        {loading ? (
                          <><span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> Sending...</>
                        ) : (
                          <><FaPaperPlane size={13} /> Send Message</>
                        )}
                      </button>
                    </div>
                  </div>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </form>
              )}
            </div>

            {/* Map */}
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)', height: 240, marginTop: 24 }}>
              <iframe
                title="VisitBD Office Location"
                src="https://maps.google.com/maps?q=Banani,Dhaka,Bangladesh&z=13&output=embed"
                width="100%" height="100%" style={{ border: 0 }} loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
