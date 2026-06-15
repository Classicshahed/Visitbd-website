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
