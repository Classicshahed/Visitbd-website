// src/services/api.js
// Dummy API Service — simulates REST with delay, full CRUD for ALL destinations

const API_BASE = '/data/destinations.json';
const ADMIN_KEY = 'bd_tourism_admin_destinations';  // Admin-added destinations
const EDITS_KEY = 'bd_tourism_edited_destinations'; // Overrides for any destination
const DELETED_KEY = 'bd_tourism_deleted_ids';       // IDs to exclude

const delay = (ms = 600) => new Promise(res => setTimeout(res, ms + Math.random() * 150));

// ── Storage helpers ────────────────────────────────────────────────
function getAdminDestinations() {
  try { return JSON.parse(localStorage.getItem(ADMIN_KEY) || '[]'); } catch { return []; }
}
function saveAdminDestinations(list) { localStorage.setItem(ADMIN_KEY, JSON.stringify(list)); }

function getEdits() {
  try { return JSON.parse(localStorage.getItem(EDITS_KEY) || '{}'); } catch { return {}; }
}
function saveEdits(obj) { localStorage.setItem(EDITS_KEY, JSON.stringify(obj)); }

function getDeletedIds() {
  try { return JSON.parse(localStorage.getItem(DELETED_KEY) || '[]'); } catch { return []; }
}
function saveDeletedIds(arr) { localStorage.setItem(DELETED_KEY, JSON.stringify(arr)); }

// ── GET All Destinations ───────────────────────────────────────────
export async function fetchDestinations() {
  await delay();
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const base = await res.json();
    const edits = getEdits();
    const deletedIds = getDeletedIds();
    const adminAdded = getAdminDestinations();

    // Apply edits to base destinations
    const processed = base
      .filter(d => !deletedIds.includes(d.id))
      .map(d => edits[d.id] ? { ...d, ...edits[d.id] } : d);

    // Merge admin-added (also filter deleted)
    const adminFiltered = adminAdded.filter(d => !deletedIds.includes(d.id))
      .map(d => edits[d.id] ? { ...d, ...edits[d.id] } : d);

    return [...processed, ...adminFiltered];
  } catch (err) {
    throw new Error('Failed to fetch destinations. Please retry.');
  }
}

// ── GET Single Destination ─────────────────────────────────────────
export async function fetchDestinationById(id) {
  await delay(300);
  const all = await fetchDestinations();
  const found = all.find(d => d.id === parseInt(id) || d.id === id);
  if (!found) throw new Error('Destination not found.');
  return found;
}

// ── POST Add Destination (Admin) ───────────────────────────────────
export async function addDestination(data) {
  await delay(700);
  const admin = getAdminDestinations();
  const newDest = {
    ...data,
    id: Date.now(),
    rating: parseFloat(data.rating) || 4.0,
    price: parseInt(data.price) || 1000,
    featured: false,
    adminCreated: true,
    createdAt: new Date().toISOString(),
  };
  admin.push(newDest);
  saveAdminDestinations(admin);
  return newDest;
}

// ── PUT Edit Destination (Any) ─────────────────────────────────────
export async function editDestination(id, data) {
  await delay(500);
  const edits = getEdits();
  edits[id] = { ...edits[id], ...data, updatedAt: new Date().toISOString() };
  saveEdits(edits);

  // Also update admin-added list if it's one of those
  const admin = getAdminDestinations();
  const idx = admin.findIndex(d => d.id === id);
  if (idx !== -1) {
    admin[idx] = { ...admin[idx], ...data, updatedAt: new Date().toISOString() };
    saveAdminDestinations(admin);
  }
  return { success: true };
}

// ── DELETE Destination (Any) ───────────────────────────────────────
export async function deleteDestination(id) {
  await delay(400);
  const deletedIds = getDeletedIds();
  if (!deletedIds.includes(id)) deletedIds.push(id);
  saveDeletedIds(deletedIds);

  // Also remove from admin list if present
  const admin = getAdminDestinations();
  saveAdminDestinations(admin.filter(d => d.id !== id));
  return { success: true };
}

// ── Stats ──────────────────────────────────────────────────────────
export async function fetchStats() {
  await delay(300);
  const all = await fetchDestinations();
  return {
    total: all.length,
    featured: all.filter(d => d.featured).length,
    adminAdded: getAdminDestinations().filter(d => !getDeletedIds().includes(d.id)).length,
    categories: [...new Set(all.map(d => d.category))].length,
    edited: Object.keys(getEdits()).length,
    deleted: getDeletedIds().length,
  };
}

// ── About Page Content ────────────────────────────────────────────
const ABOUT_KEY = 'bd_tourism_about_content';

export const DEFAULT_ABOUT = {
  heroSubtitle: 'We are a team of passionate Bangladeshi travelers on a mission to showcase the breathtaking beauty of our homeland to the world — one destination at a time.',
  missionText1: 'Bangladesh is one of the world\'s most underrated travel destinations. From the world\'s longest sea beach to a UNESCO-listed mangrove forest to cloud-capped hill stations, the country is overflowing with natural and cultural wonders.',
  missionText2: 'We built VisitBD to change that narrative. Our goal is simple: make Bangladesh a must-visit destination on every traveler\'s list, starting with its own people.',
  ctaTitle: 'Ready to Explore Bangladesh?',
  ctaSubtitle: 'Join thousands of travelers who have already discovered the magic of Bangladesh through VisitBD.',
  team: [
    { name: 'Rafiqul Islam', role: 'Founder & CEO', img: 'https://i.pravatar.cc/120?img=11', bio: 'Passionate traveler who has explored all 64 districts of Bangladesh.' },
    { name: 'Nusrat Jahan', role: 'Head of Content', img: 'https://i.pravatar.cc/120?img=47', bio: 'Travel writer and photographer with 8 years of experience.' },
    { name: 'Tanvir Ahmed', role: 'Tech Lead', img: 'https://i.pravatar.cc/120?img=15', bio: 'Building seamless digital experiences for travelers.' },
    { name: 'Maliha Rahman', role: 'Community Manager', img: 'https://i.pravatar.cc/120?img=44', bio: 'Connecting travelers and building our growing community.' },
  ],
};

export async function fetchAboutContent() {
  await delay(200);
  try {
    const saved = localStorage.getItem(ABOUT_KEY);
    if (saved) return { ...DEFAULT_ABOUT, ...JSON.parse(saved) };
  } catch {}
  return { ...DEFAULT_ABOUT };
}

export async function saveAboutContent(data) {
  await delay(400);
  localStorage.setItem(ABOUT_KEY, JSON.stringify(data));
  return { success: true };
}

// ── Contact Page Content ──────────────────────────────────────────
const CONTACT_KEY = 'bd_tourism_contact_content';

export const DEFAULT_CONTACT = {
  heroSubtitle: 'Have a question, partnership idea, or just want to say hello? We\'d love to hear from you!',
  office: 'Level 5, Banani Tower\nDhaka-1213, Bangladesh',
  phone: '+880 1700 000000\n+880 1800 000000',
  email: 'info@visitbd.com\nsupport@visitbd.com',
  hours: 'Sun–Thu: 9am – 6pm\nFri: 9am – 1pm',
  mapQuery: 'Banani,Dhaka,Bangladesh',
};

export async function fetchContactContent() {
  await delay(200);
  try {
    const saved = localStorage.getItem(CONTACT_KEY);
    if (saved) return { ...DEFAULT_CONTACT, ...JSON.parse(saved) };
  } catch {}
  return { ...DEFAULT_CONTACT };
}

export async function saveContactContent(data) {
  await delay(400);
  localStorage.setItem(CONTACT_KEY, JSON.stringify(data));
  return { success: true };
}

// ── Home Page Images Content ──────────────────────────────────────
const HOME_IMAGES_KEY = 'bd_tourism_home_images';

export const DEFAULT_HOME_IMAGES = {
  whyUsImages: [
    'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
    'https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?w=600&q=80',
  ],
  aboutMissionImage: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=700&q=80',
};

export async function fetchHomeImages() {
  await delay(200);
  try {
    const saved = localStorage.getItem(HOME_IMAGES_KEY);
    if (saved) return { ...DEFAULT_HOME_IMAGES, ...JSON.parse(saved) };
  } catch {}
  return { ...DEFAULT_HOME_IMAGES };
}

export async function saveHomeImages(data) {
  await delay(400);
  localStorage.setItem(HOME_IMAGES_KEY, JSON.stringify(data));
  return { success: true };
}

