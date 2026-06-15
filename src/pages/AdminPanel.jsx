// src/pages/AdminPanel.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Navigate, Link } from 'react-router-dom';
import {
  FaPlus, FaTrash, FaEdit, FaMapMarkerAlt, FaStar,
  FaChartBar, FaDatabase, FaCheckCircle, FaExclamationTriangle,
  FaTimes, FaSave, FaEye, FaSearch, FaSync,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { fetchDestinations, addDestination, editDestination, deleteDestination, fetchStats } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const CATEGORIES = ['Beach','Hill','Forest','Heritage','Lake','Tea Garden','Adventure','Cultural'];
const DIVISIONS  = ['Dhaka','Chittagong','Sylhet','Rajshahi','Khulna','Barisal','Rangpur','Mymensingh','Noakhali','Chittagong Hill Tracts'];
const SEASONS    = ['All Year','November to March','October to March','October to April','June to October (Monsoon Best)','All Year (Oct–Apr Best)'];

const EMPTY_FORM = {
  name:'', division:'', category:'', shortDesc:'', overview:'',
  rating:'4.0', price:'', duration:'', bestSeason:'', image:'',
  highlights:'', activities:'', tags:'',
};

// ─── Toast ────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  const colors = { success:{ bg:'#006A4E', border:'rgba(0,200,150,0.4)' }, error:{ bg:'#c0192d', border:'rgba(244,42,65,0.4)' }, info:{ bg:'#1565C0', border:'rgba(33,150,243,0.4)' } };
  const c = colors[type] || colors.info;
  return (
    <div style={{ position:'fixed', top:82, right:20, zIndex:9999, background:c.bg, border:`1px solid ${c.border}`, backdropFilter:'blur(8px)', color:'#fff', padding:'13px 20px', borderRadius:12, maxWidth:340, display:'flex', alignItems:'center', gap:10, boxShadow:'0 6px 28px rgba(0,0,0,0.45)', animation:'toastIn 0.3s ease', fontFamily:'var(--font-body)', fontSize:'0.88rem' }}>
      {type === 'success' ? <FaCheckCircle size={15}/> : type === 'error' ? <FaExclamationTriangle size={15}/> : <FaCheckCircle size={15}/>}
      <span>{message}</span>
      <button onClick={onClose} style={{ marginLeft:'auto', background:'none', border:'none', color:'rgba(255,255,255,0.7)', cursor:'pointer', padding:0 }}><FaTimes size={12}/></button>
    </div>
  );
}

// ─── Edit/Add Modal ───────────────────────────────────────────────
function DestinationModal({ dest, mode, onSave, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (dest && mode === 'edit') {
      setForm({
        name: dest.name || '',
        division: dest.division || '',
        category: dest.category || '',
        shortDesc: dest.shortDesc || '',
        overview: dest.overview || '',
        rating: String(dest.rating || 4.0),
        price: String(dest.price || ''),
        duration: dest.duration || '',
        bestSeason: dest.bestSeason || '',
        image: dest.image || '',
        highlights: (dest.highlights || []).join(', '),
        activities: (dest.activities || []).join(', '),
        tags: (dest.tags || []).join(', '),
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [dest, mode]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.division) e.division = 'Required';
    if (!form.category) e.category = 'Required';
    if (!form.shortDesc.trim()) e.shortDesc = 'Required';
    if (!form.price || isNaN(Number(form.price))) e.price = 'Enter a valid number';
    if (!form.duration.trim()) e.duration = 'Required';
    return e;
  };

  const handleChange = e => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: '' }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    const payload = {
      ...form,
      price: parseInt(form.price),
      rating: parseFloat(form.rating),
      highlights: form.highlights.split(',').map(h=>h.trim()).filter(Boolean),
      activities: form.activities.split(',').map(a=>a.trim()).filter(Boolean),
      tags: form.tags.split(',').map(t=>t.trim().toLowerCase()).filter(Boolean),
      image: form.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    };
    await onSave(payload);
    setSaving(false);
  };

  const Field = ({ name, label, required, type='text', component, ...rest }) => (
    <div className="col-md-6">
      <label style={labelSt}>{label}{required && <span style={{ color:'#F42A41' }}> *</span>}</label>
      {component || (
        <input id={`modal-${name}`} name={name} type={type} className="form-control" value={form[name]} onChange={handleChange} {...rest} />
      )}
      {errors[name] && <div style={{ color:'#ff4d63', fontSize:'0.72rem', marginTop:3 }}>{errors[name]}</div>}
    </div>
  );

  return (
    <div style={overlayStyle} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={modalStyle}>
        {/* Modal Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 28px 16px', borderBottom:'1px solid var(--border-color)' }}>
          <div>
            <h5 style={{ fontFamily:'var(--font-heading)', fontWeight:800, color:'var(--text-primary)', margin:0, fontSize:'1.1rem' }}>
              {mode === 'edit' ? `✏️ Edit: ${dest?.name}` : '➕ Add New Destination'}
            </h5>
            <p style={{ color:'var(--text-muted)', fontSize:'0.75rem', margin:0, marginTop:2 }}>
              {mode === 'edit' ? 'Changes saved to override store' : 'New destination added to database'}
            </p>
          </div>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,0.07)', border:'1px solid var(--border-color)', color:'var(--text-secondary)', width:34, height:34, borderRadius:8, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <FaTimes size={13}/>
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ overflowY:'auto', maxHeight:'calc(85vh - 130px)', padding:'20px 28px' }}>
          <form onSubmit={handleSubmit} id="modal-dest-form">
            <div className="row g-3">
              <Field name="name" label="Destination Name" required placeholder="e.g., Tanguar Haor" />
              <div className="col-md-6">
                <label style={labelSt}>Division <span style={{color:'#F42A41'}}>*</span></label>
                <select id="modal-division" name="division" className="form-select" value={form.division} onChange={handleChange}>
                  <option value="">Select Division</option>
                  {DIVISIONS.map(d=><option key={d} value={d}>{d}</option>)}
                </select>
                {errors.division && <div style={{ color:'#ff4d63', fontSize:'0.72rem', marginTop:3 }}>{errors.division}</div>}
              </div>

              <div className="col-md-4">
                <label style={labelSt}>Category <span style={{color:'#F42A41'}}>*</span></label>
                <select id="modal-category" name="category" className="form-select" value={form.category} onChange={handleChange}>
                  <option value="">Select Category</option>
                  {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <div style={{ color:'#ff4d63', fontSize:'0.72rem', marginTop:3 }}>{errors.category}</div>}
              </div>
              <div className="col-md-4">
                <label style={labelSt}>Price (BDT) <span style={{color:'#F42A41'}}>*</span></label>
                <input id="modal-price" name="price" type="number" className="form-control" value={form.price} onChange={handleChange} placeholder="3500" min="0"/>
                {errors.price && <div style={{ color:'#ff4d63', fontSize:'0.72rem', marginTop:3 }}>{errors.price}</div>}
              </div>
              <div className="col-md-4">
                <label style={labelSt}>Duration <span style={{color:'#F42A41'}}>*</span></label>
                <input id="modal-duration" name="duration" type="text" className="form-control" value={form.duration} onChange={handleChange} placeholder="2-3 days"/>
                {errors.duration && <div style={{ color:'#ff4d63', fontSize:'0.72rem', marginTop:3 }}>{errors.duration}</div>}
              </div>

              <div className="col-md-6">
                <label style={labelSt}>Rating (1–5)</label>
                <input id="modal-rating" name="rating" type="number" className="form-control" value={form.rating} onChange={handleChange} min="1" max="5" step="0.1"/>
              </div>
              <div className="col-md-6">
                <label style={labelSt}>Best Season</label>
                <select id="modal-season" name="bestSeason" className="form-select" value={form.bestSeason} onChange={handleChange}>
                  <option value="">Select Season</option>
                  {SEASONS.map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="col-12">
                <label style={labelSt}>Image URL</label>
                <input id="modal-image" name="image" type="url" className="form-control" value={form.image} onChange={handleChange} placeholder="https://images.unsplash.com/..."/>
              </div>

              {form.image && (
                <div className="col-12">
                  <img src={form.image} alt="preview" style={{ width:'100%', height:110, objectFit:'cover', borderRadius:10, border:'1px solid var(--border-color)' }} onError={e=>e.target.style.display='none'}/>
                </div>
              )}

              <div className="col-12">
                <label style={labelSt}>Short Description <span style={{color:'#F42A41'}}>*</span></label>
                <input id="modal-shortdesc" name="shortDesc" type="text" className="form-control" value={form.shortDesc} onChange={handleChange} placeholder="One-line tagline" maxLength={120}/>
                {errors.shortDesc && <div style={{ color:'#ff4d63', fontSize:'0.72rem', marginTop:3 }}>{errors.shortDesc}</div>}
              </div>
              <div className="col-12">
                <label style={labelSt}>Full Overview</label>
                <textarea id="modal-overview" name="overview" className="form-control" rows={3} value={form.overview} onChange={handleChange} style={{ resize:'vertical' }} placeholder="Detailed description..."/>
              </div>
              <div className="col-md-6">
                <label style={labelSt}>Highlights <span style={{ color:'var(--text-muted)', fontWeight:400 }}>(comma-separated)</span></label>
                <input id="modal-highlights" name="highlights" type="text" className="form-control" value={form.highlights} onChange={handleChange} placeholder="Beach, Waterfall, Temple"/>
              </div>
              <div className="col-md-6">
                <label style={labelSt}>Activities <span style={{ color:'var(--text-muted)', fontWeight:400 }}>(comma-separated)</span></label>
                <input id="modal-activities" name="activities" type="text" className="form-control" value={form.activities} onChange={handleChange} placeholder="Hiking, Boat ride, Photography"/>
              </div>
              <div className="col-12">
                <label style={labelSt}>Tags <span style={{ color:'var(--text-muted)', fontWeight:400 }}>(lowercase, comma-separated)</span></label>
                <input id="modal-tags" name="tags" type="text" className="form-control" value={form.tags} onChange={handleChange} placeholder="beach, family, adventure"/>
              </div>
            </div>

            {/* Footer */}
            <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:24, paddingTop:16, borderTop:'1px solid var(--border-color)' }}>
              <button type="button" onClick={onClose} style={cancelBtnSt}>Cancel</button>
              <button type="submit" id="modal-save-btn" style={saveBtnSt} disabled={saving}>
                {saving
                  ? <><span style={spinnerSt}/> Saving...</>
                  : <><FaSave size={13}/> {mode==='edit' ? 'Save Changes' : 'Add Destination'}</>}
              </button>
            </div>
          </form>
        </div>
      </div>
      <style>{`
        @keyframes toastIn { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes modalIn { from{opacity:0;transform:scale(0.96)} to{opacity:1;transform:scale(1)} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────
function StatCard({ emoji, label, value, sub, color }) {
  return (
    <div style={{ background:'var(--card-bg)', border:'1px solid var(--border-color)', borderRadius:16, padding:'22px 20px', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:-10, right:-10, fontSize:60, opacity:0.06 }}>{emoji}</div>
      <div style={{ fontSize:'2rem', marginBottom:8 }}>{emoji}</div>
      <div style={{ fontFamily:'var(--font-heading)', fontWeight:800, fontSize:'2rem', color, lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:'0.78rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.5px', marginTop:4 }}>{label}</div>
      {sub && <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginTop:2 }}>{sub}</div>}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────
export default function AdminPanel() {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated || user?.role !== 'admin') return <Navigate to="/login" replace/>;

  const [activeTab, setActiveTab]   = useState('manage');
  const [destinations, setDestinations] = useState([]);
  const [stats, setStats]           = useState(null);
  const [listLoading, setListLoading] = useState(false);
  const [toast, setToast]           = useState(null);
  const [modal, setModal]           = useState({ open:false, mode:'add', dest:null });
  const [search, setSearch]         = useState('');
  const [confirmId, setConfirmId]   = useState(null);

  const showToast = (message, type='success') => setToast({ message, type });

  // Load stats
  const loadStats = () => fetchStats().then(setStats).catch(()=>{});

  useEffect(() => { loadStats(); }, []);

  // Load destinations when Manage tab is active
  const loadDestinations = () => {
    setListLoading(true);
    fetchDestinations()
      .then(d => { setDestinations(d); setListLoading(false); })
      .catch(() => { showToast('Failed to load destinations', 'error'); setListLoading(false); });
  };

  useEffect(() => {
    if (activeTab === 'manage') loadDestinations();
  }, [activeTab]);

  // ── Handlers ──────────────────────────────────────────────────
  const openAdd = () => setModal({ open:true, mode:'add', dest:null });
  const openEdit = dest => setModal({ open:true, mode:'edit', dest });
  const closeModal = () => setModal({ open:false, mode:'add', dest:null });

  const handleSave = async (payload) => {
    try {
      if (modal.mode === 'edit') {
        await editDestination(modal.dest.id, payload);
        showToast(`✅ "${payload.name}" updated successfully!`);
      } else {
        await addDestination(payload);
        showToast(`✅ "${payload.name}" added successfully!`);
        setActiveTab('manage');
      }
      closeModal();
      loadDestinations();
      loadStats();
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    try {
      await deleteDestination(id);
      showToast(`🗑️ "${name}" removed.`);
      setConfirmId(null);
      setDestinations(p => p.filter(d => d.id !== id));
      loadStats();
    } catch {
      showToast('Delete failed', 'error');
    }
  };

  // Filtered list for search
  const filtered = destinations.filter(d =>
    !search || d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.division?.toLowerCase().includes(search.toLowerCase()) ||
    d.category?.toLowerCase().includes(search.toLowerCase())
  );

  const TABS = [
    { key:'stats',  icon:'📊', label:'Stats'     },
    { key:'add',    icon:'➕', label:'Add New'   },
    { key:'manage', icon:'📋', label:'Manage All' },
  ];

  const CATEGORY_COLORS = {
    Beach:'#00B4D8', Hill:'#4CAF50', Forest:'#2E7D32', Heritage:'#E8B84B',
    Lake:'#0288D1', 'Tea Garden':'#558B2F', Adventure:'#F42A41', Cultural:'#9C27B0', default:'#006A4E',
  };

  return (
    <div style={{ background:'var(--dark)', minHeight:'100vh' }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)}/>}
      {modal.open && (
        <DestinationModal
          dest={modal.dest}
          mode={modal.mode}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}

      {/* ── Header ──────────────────────────────────────────── */}
      <div style={{ background:'linear-gradient(135deg, #003d2e 0%, #006A4E 60%, #008a64 100%)', borderBottom:'1px solid rgba(0,200,120,0.15)', paddingTop:40, paddingBottom:0 }}>
        <div className="container" style={{ maxWidth:1280 }}>
          <div className="d-flex align-items-center gap-3 mb-4 flex-wrap">
            <div style={{ width:52, height:52, background:'rgba(255,255,255,0.15)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem' }}>🛡️</div>
            <div>
              <h1 style={{ fontFamily:'var(--font-heading)', fontWeight:900, fontSize:'1.6rem', color:'#fff', margin:0, letterSpacing:'-0.3px' }}>
                Admin Panel
              </h1>
              <p style={{ color:'rgba(255,255,255,0.65)', fontSize:'0.82rem', margin:0 }}>
                VisitBD Management · Logged in as <strong style={{ color:'rgba(255,255,255,0.9)' }}>{user?.name}</strong>
              </p>
            </div>
            <button
              onClick={openAdd}
              id="header-add-btn"
              style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:7, background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.25)', color:'#fff', padding:'9px 18px', borderRadius:999, cursor:'pointer', fontFamily:'var(--font-heading)', fontWeight:700, fontSize:'0.85rem', backdropFilter:'blur(4px)', transition:'all 0.2s' }}
            >
              <FaPlus size={12}/> Add Destination
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display:'flex', gap:2 }}>
            {TABS.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} id={`admin-tab-${tab.key}`}
                style={{ display:'flex', alignItems:'center', gap:6, background:'transparent', border:'none', color: activeTab===tab.key ? '#fff' : 'rgba(255,255,255,0.55)', borderBottom: activeTab===tab.key ? '2px solid #fff' : '2px solid transparent', padding:'10px 18px', cursor:'pointer', fontFamily:'var(--font-heading)', fontWeight:600, fontSize:'0.87rem', transition:'all 0.2s', whiteSpace:'nowrap' }}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────── */}
      <div className="container" style={{ maxWidth:1280, padding:'40px 15px 60px' }}>

        {/* STATS TAB */}
        {activeTab === 'stats' && (
          <div>
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h4 style={{ fontFamily:'var(--font-heading)', color:'var(--text-primary)', margin:0 }}>Site Statistics</h4>
              <button onClick={loadStats} style={{ background:'none', border:'1px solid var(--border-color)', color:'var(--text-muted)', padding:'6px 14px', borderRadius:999, cursor:'pointer', fontSize:'0.78rem', display:'flex', alignItems:'center', gap:5 }}>
                <FaSync size={11}/> Refresh
              </button>
            </div>
            {stats ? (
              <div className="row g-3 mb-5">
                <div className="col-6 col-md-4"><StatCard emoji="🗺️" label="Total Destinations" value={stats.total} color="var(--primary-light)" sub="Including admin additions"/></div>
                <div className="col-6 col-md-4"><StatCard emoji="⭐" label="Featured" value={stats.featured} color="var(--gold)" sub="Shown in hero sections"/></div>
                <div className="col-6 col-md-4"><StatCard emoji="🛡️" label="Admin Added" value={stats.adminAdded} color="#00B4D8" sub="via Admin Panel"/></div>
                <div className="col-6 col-md-4"><StatCard emoji="✏️" label="Edited" value={stats.edited} color="#9C27B0" sub="Base records modified"/></div>
                <div className="col-6 col-md-4"><StatCard emoji="🗑️" label="Deleted" value={stats.deleted} color="#F42A41" sub="Removed from listing"/></div>
                <div className="col-6 col-md-4"><StatCard emoji="🏷️" label="Categories" value={stats.categories} color="#558B2F" sub="Unique types"/></div>
              </div>
            ) : <LoadingSpinner text="Loading stats..."/>}

            <div style={{ background:'var(--card-bg)', border:'1px solid var(--border-color)', borderRadius:16, padding:24 }}>
              <h6 style={{ fontFamily:'var(--font-heading)', color:'var(--text-primary)', marginBottom:16 }}>Quick Actions</h6>
              <div className="d-flex gap-3 flex-wrap">
                <button onClick={openAdd} style={quickActionBtn('#006A4E')}><FaPlus size={13}/> Add New Destination</button>
                <button onClick={() => setActiveTab('manage')} style={quickActionBtn('#1565C0')}><FaDatabase size={13}/> View All Destinations</button>
                <Link to="/destinations" style={{ ...quickActionBtn('#7B1FA2'), textDecoration:'none', display:'inline-flex' }}><FaEye size={13}/> Preview Live Site</Link>
              </div>
            </div>
          </div>
        )}

        {/* ADD DESTINATION TAB */}
        {activeTab === 'add' && (
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <div style={{ background:'var(--card-bg)', border:'1px solid var(--border-color)', borderRadius:20, overflow:'hidden' }}>
                <div style={{ background:'linear-gradient(135deg, #003d2e 0%, #006A4E 100%)', padding:'24px 32px' }}>
                  <h4 style={{ fontFamily:'var(--font-heading)', fontWeight:800, color:'#fff', margin:0 }}>➕ Add New Destination</h4>
                  <p style={{ color:'rgba(255,255,255,0.65)', fontSize:'0.82rem', margin:'4px 0 0' }}>
                    Fill in the details below. New destinations appear on the live site instantly.
                  </p>
                </div>
                <div style={{ padding:32 }}>
                  <button onClick={openAdd} className="btn btn-primary-bd w-100" style={{ padding:14, fontSize:'1rem' }}>
                    <FaPlus size={14}/> &nbsp; Open Add Destination Form
                  </button>
                  <p style={{ textAlign:'center', color:'var(--text-muted)', fontSize:'0.8rem', marginTop:14 }}>
                    A full modal will open with all fields.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MANAGE TAB */}
        {activeTab === 'manage' && (
          <div>
            {/* Toolbar */}
            <div className="d-flex align-items-center gap-3 mb-4 flex-wrap">
              <h4 style={{ fontFamily:'var(--font-heading)', color:'var(--text-primary)', margin:0 }}>All Destinations</h4>
              <span style={{ background:'rgba(0,106,78,0.15)', border:'1px solid rgba(0,106,78,0.3)', color:'var(--primary-light)', padding:'3px 12px', borderRadius:999, fontSize:'0.75rem', fontWeight:700 }}>
                {filtered.length} shown
              </span>
              <div style={{ marginLeft:'auto', display:'flex', gap:8, alignItems:'center' }}>
                <div style={{ position:'relative' }}>
                  <FaSearch size={12} style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }}/>
                  <input
                    type="text" placeholder="Search..." value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ background:'var(--dark-3)', border:'1px solid var(--border-color)', color:'var(--text-primary)', borderRadius:999, padding:'7px 12px 7px 32px', fontSize:'0.82rem', width:180, outline:'none' }}
                  />
                </div>
                <button onClick={loadDestinations} style={{ background:'var(--dark-3)', border:'1px solid var(--border-color)', color:'var(--text-secondary)', padding:'8px 14px', borderRadius:999, cursor:'pointer', fontSize:'0.8rem', display:'flex', alignItems:'center', gap:5 }}>
                  <FaSync size={11}/> Refresh
                </button>
                <button onClick={openAdd} id="manage-add-btn" style={{ display:'flex', alignItems:'center', gap:6, background:'var(--primary)', border:'none', color:'#fff', padding:'8px 16px', borderRadius:999, cursor:'pointer', fontFamily:'var(--font-heading)', fontWeight:700, fontSize:'0.82rem' }}>
                  <FaPlus size={11}/> Add New
                </button>
              </div>
            </div>

            {listLoading ? <LoadingSpinner text="Loading destinations..."/> : (
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {filtered.map((dest, i) => {
                  const catColor = CATEGORY_COLORS[dest.category] || CATEGORY_COLORS.default;
                  const isConfirming = confirmId === dest.id;
                  return (
                    <div key={dest.id}
                      style={{ display:'grid', gridTemplateColumns:'60px 1fr auto', gap:16, alignItems:'center', background: i % 2 === 0 ? 'var(--card-bg)' : 'var(--dark-3)', border:`1px solid ${dest.adminCreated ? 'rgba(0,180,216,0.2)' : 'var(--border-color)'}`, borderRadius:14, padding:'14px 18px', transition:'box-shadow 0.2s' }}
                    >
                      {/* Thumbnail */}
                      <div style={{ position:'relative' }}>
                        <img
                          src={dest.image} alt={dest.name} width={58} height={48}
                          style={{ borderRadius:10, objectFit:'cover', display:'block', border:'2px solid rgba(255,255,255,0.06)' }}
                          onError={e => e.target.src='https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&q=60'}
                        />
                        {dest.adminCreated && (
                          <div style={{ position:'absolute', top:-4, right:-4, width:14, height:14, background:'#00B4D8', borderRadius:'50%', border:'2px solid var(--dark)', title:'Admin added' }}/>
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ minWidth:0 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                          <span style={{ fontFamily:'var(--font-heading)', fontWeight:700, color:'var(--text-primary)', fontSize:'0.93rem' }}>{dest.name}</span>
                          <span style={{ background:`${catColor}22`, border:`1px solid ${catColor}55`, color:catColor, padding:'2px 8px', borderRadius:999, fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.4px' }}>
                            {dest.category}
                          </span>
                          {dest.adminCreated && <span style={{ background:'rgba(0,180,216,0.12)', border:'1px solid rgba(0,180,216,0.3)', color:'#00B4D8', padding:'2px 7px', borderRadius:999, fontSize:'0.62rem', fontWeight:700 }}>Admin Added</span>}
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:4, flexWrap:'wrap' }}>
                          <span style={{ color:'var(--text-muted)', fontSize:'0.75rem', display:'flex', alignItems:'center', gap:3 }}><FaMapMarkerAlt size={10}/> {dest.division}</span>
                          <span style={{ color:'var(--gold)', fontSize:'0.75rem', display:'flex', alignItems:'center', gap:3 }}><FaStar size={10}/> {dest.rating}</span>
                          <span style={{ color:'var(--text-muted)', fontSize:'0.75rem' }}>{dest.duration}</span>
                        </div>
                        <div style={{ color:'var(--text-secondary)', fontSize:'0.75rem', marginTop:3, overflow:'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis', maxWidth:420 }}>{dest.shortDesc}</div>
                      </div>

                      {/* Actions */}
                      <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8, flexShrink:0 }}>
                        <div style={{ fontFamily:'var(--font-heading)', fontWeight:800, color:'var(--gold)', fontSize:'0.95rem' }}>
                          ৳{dest.price?.toLocaleString('en-BD')}
                        </div>

                        {isConfirming ? (
                          <div style={{ display:'flex', gap:5, alignItems:'center' }}>
                            <span style={{ fontSize:'0.72rem', color:'var(--accent)' }}>Confirm?</span>
                            <button onClick={() => handleDelete(dest.id, dest.name)} style={{ background:'#c0192d', border:'none', color:'#fff', padding:'4px 10px', borderRadius:6, cursor:'pointer', fontSize:'0.72rem', fontWeight:700 }}>Yes, Delete</button>
                            <button onClick={() => setConfirmId(null)} style={{ background:'var(--dark-3)', border:'1px solid var(--border-color)', color:'var(--text-secondary)', padding:'4px 8px', borderRadius:6, cursor:'pointer', fontSize:'0.72rem' }}>Cancel</button>
                          </div>
                        ) : (
                          <div style={{ display:'flex', gap:6 }}>
                            <Link to={`/destinations/${dest.id}`} target="_blank" title="Preview" style={{ display:'flex', alignItems:'center', gap:4, background:'rgba(255,255,255,0.06)', border:'1px solid var(--border-color)', color:'var(--text-secondary)', padding:'5px 10px', borderRadius:8, fontSize:'0.72rem', textDecoration:'none', fontWeight:600 }}>
                              <FaEye size={11}/> View
                            </Link>
                            <button onClick={() => openEdit(dest)} title="Edit" id={`edit-btn-${dest.id}`}
                              style={{ display:'flex', alignItems:'center', gap:4, background:'rgba(33,150,243,0.12)', border:'1px solid rgba(33,150,243,0.3)', color:'#42A5F5', padding:'5px 10px', borderRadius:8, cursor:'pointer', fontSize:'0.72rem', fontWeight:600 }}>
                              <FaEdit size={11}/> Edit
                            </button>
                            <button onClick={() => setConfirmId(dest.id)} title="Delete" id={`delete-btn-${dest.id}`}
                              style={{ display:'flex', alignItems:'center', gap:4, background:'rgba(244,42,65,0.1)', border:'1px solid rgba(244,42,65,0.3)', color:'#F42A41', padding:'5px 10px', borderRadius:8, cursor:'pointer', fontSize:'0.72rem', fontWeight:600 }}>
                              <FaTrash size={11}/> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {filtered.length === 0 && !listLoading && (
                  <div style={{ textAlign:'center', padding:'60px 0', color:'var(--text-muted)' }}>
                    <FaDatabase size={36} style={{ marginBottom:14 }}/>
                    <div style={{ fontSize:'0.9rem' }}>No destinations match your search.</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes toastIn { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes modalIn { from{opacity:0;transform:scale(0.97)} to{opacity:1;transform:scale(1)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}

// ── Inline styles ─────────────────────────────────────────────────
const overlayStyle = { position:'fixed', inset:0, background:'rgba(0,0,0,0.72)', backdropFilter:'blur(6px)', zIndex:9000, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' };
const modalStyle   = { background:'var(--dark-2)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:20, width:'100%', maxWidth:740, maxHeight:'90vh', boxShadow:'0 24px 80px rgba(0,0,0,0.7)', animation:'modalIn 0.25s ease', display:'flex', flexDirection:'column', overflow:'hidden' };
const labelSt      = { display:'block', color:'var(--text-secondary)', fontSize:'0.78rem', fontWeight:700, letterSpacing:'0.3px', marginBottom:5, textTransform:'uppercase' };
const saveBtnSt    = { display:'flex', alignItems:'center', gap:7, background:'linear-gradient(135deg, #006A4E, #008a64)', border:'none', color:'#fff', padding:'10px 22px', borderRadius:999, cursor:'pointer', fontFamily:'var(--font-heading)', fontWeight:700, fontSize:'0.88rem' };
const cancelBtnSt  = { display:'flex', alignItems:'center', gap:6, background:'var(--dark-3)', border:'1px solid var(--border-color)', color:'var(--text-secondary)', padding:'10px 18px', borderRadius:999, cursor:'pointer', fontFamily:'var(--font-heading)', fontWeight:600, fontSize:'0.88rem' };
const spinnerSt    = { display:'inline-block', width:13, height:13, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.7s linear infinite' };
const quickActionBtn = (color) => ({ display:'flex', alignItems:'center', gap:7, background:`${color}18`, border:`1px solid ${color}44`, color, padding:'10px 18px', borderRadius:999, cursor:'pointer', fontFamily:'var(--font-heading)', fontWeight:700, fontSize:'0.85rem' });
