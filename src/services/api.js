// src/services/api.js
// Production API Service — connects to the VisitBD SQLite / REST Database Backend (/api/*)
// Includes graceful fallback if running on static-only hosting

const STATIC_JSON = '/data/destinations.json';

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('bd_tourism_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(endpoint, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.message || `HTTP Error ${res.status}`);
  }
  return data;
}

// ── DESTINATIONS CRUD ──────────────────────────────────────────────
export async function fetchDestinations() {
  try {
    return await apiRequest('/api/destinations');
  } catch {
    const res = await fetch(STATIC_JSON);
    if (!res.ok) throw new Error('Failed to fetch destinations.');
    return await res.json();
  }
}

export async function fetchDestinationById(id) {
  try {
    return await apiRequest(`/api/destinations/${id}`);
  } catch {
    const all = await fetchDestinations();
    const found = all.find((d) => d.id === parseInt(id, 10) || d.id === id);
    if (!found) throw new Error('Destination not found.');
    return { ...found, reviews: [] };
  }
}

export async function addDestination(data) {
  return await apiRequest('/api/destinations', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function editDestination(id, data) {
  return await apiRequest(`/api/destinations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteDestination(id) {
  return await apiRequest(`/api/destinations/${id}`, {
    method: 'DELETE',
  });
}

export async function resetDestinations() {
  return await apiRequest('/api/destinations/reset', {
    method: 'POST',
  });
}

// ── STATS ──────────────────────────────────────────────────────────
export async function fetchStats() {
  return await apiRequest('/api/stats');
}

// ── AUTHENTICATION & USERS ─────────────────────────────────────────
export async function loginUser(email, password) {
  return await apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function registerUser(name, email, password) {
  return await apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export async function updateUserProfile(data) {
  return await apiRequest('/api/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function fetchUsers() {
  return await apiRequest('/api/users');
}

// ── REVIEWS ────────────────────────────────────────────────────────
export async function fetchReviews(destinationId) {
  const qs = destinationId ? `?destinationId=${destinationId}` : '';
  return await apiRequest(`/api/reviews${qs}`);
}

export async function addReview(data) {
  return await apiRequest('/api/reviews', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteReview(id) {
  return await apiRequest(`/api/reviews/${id}`, {
    method: 'DELETE',
  });
}

// ── BOOKINGS (TRIP PLANNER) ────────────────────────────────────────
export async function fetchBookings(userId) {
  const qs = userId ? `?userId=${userId}` : '';
  return await apiRequest(`/api/bookings${qs}`);
}

export async function createBooking(data) {
  return await apiRequest('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateBookingStatus(id, status) {
  return await apiRequest(`/api/bookings/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function deleteBooking(id) {
  return await apiRequest(`/api/bookings/${id}`, {
    method: 'DELETE',
  });
}

// ── WISHLISTS (DB SYNCED) ──────────────────────────────────────────
export async function fetchUserWishlist(userId) {
  if (!userId) return [];
  return await apiRequest(`/api/wishlists?userId=${userId}`);
}

export async function toggleUserWishlist(userId, destinationId) {
  return await apiRequest('/api/wishlists/toggle', {
    method: 'POST',
    body: JSON.stringify({ userId, destinationId }),
  });
}

export async function removeUserWishlistItem(userId, destinationId) {
  return await apiRequest(`/api/wishlists?userId=${userId}&destinationId=${destinationId}`, {
    method: 'DELETE',
  });
}

export async function clearUserWishlist(userId) {
  return await apiRequest(`/api/wishlists?userId=${userId}`, {
    method: 'DELETE',
  });
}

// ── CONTACT MESSAGES ───────────────────────────────────────────────
export async function submitContactMessage(data) {
  return await apiRequest('/api/contact-messages', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function fetchContactMessages() {
  return await apiRequest('/api/contact-messages');
}

export async function updateContactMessageStatus(id, status) {
  return await apiRequest(`/api/contact-messages/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function deleteContactMessage(id) {
  return await apiRequest(`/api/contact-messages/${id}`, {
    method: 'DELETE',
  });
}

// ── SITE SETTINGS (ABOUT / CONTACT / HOME IMAGES) ──────────────────
export const DEFAULT_ABOUT = {
  heroSubtitle:
    'We are a team of passionate Bangladeshi travelers on a mission to showcase the breathtaking beauty of our homeland to the world — one destination at a time.',
  missionText1:
    "Bangladesh is one of the world's most underrated travel destinations. From the world's longest sea beach to a UNESCO-listed mangrove forest to cloud-capped hill stations, the country is overflowing with natural and cultural wonders.",
  missionText2:
    "We built VisitBD to change that narrative. Our goal is simple: make Bangladesh a must-visit destination on every traveler's list, starting with its own people.",
  ctaTitle: 'Ready to Explore Bangladesh?',
  ctaSubtitle:
    'Join thousands of travelers who have already discovered the magic of Bangladesh through VisitBD.',
  team: [
    {
      name: 'Rafiqul Islam',
      role: 'Founder & CEO',
      img: 'https://i.pravatar.cc/120?img=11',
      bio: 'Passionate traveler who has explored all 64 districts of Bangladesh.',
    },
    {
      name: 'Nusrat Jahan',
      role: 'Head of Content',
      img: 'https://i.pravatar.cc/120?img=47',
      bio: 'Travel writer and photographer with 8 years of experience.',
    },
    {
      name: 'Tanvir Ahmed',
      role: 'Tech Lead',
      img: 'https://i.pravatar.cc/120?img=15',
      bio: 'Building seamless digital experiences for travelers.',
    },
    {
      name: 'Maliha Rahman',
      role: 'Community Manager',
      img: 'https://i.pravatar.cc/120?img=44',
      bio: 'Connecting travelers and building our growing community.',
    },
  ],
};

export async function fetchAboutContent() {
  try {
    return await apiRequest('/api/settings/about_content');
  } catch {
    return { ...DEFAULT_ABOUT };
  }
}

export async function saveAboutContent(data) {
  return await apiRequest('/api/settings/about_content', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export const DEFAULT_CONTACT = {
  heroSubtitle:
    "Have a question, partnership idea, or just want to say hello? We'd love to hear from you!",
  office: 'Level 5, Banani Tower\nDhaka-1213, Bangladesh',
  phone: '+880 1700 000000\n+880 1800 000000',
  email: 'info@visitbd.com\nsupport@visitbd.com',
  hours: 'Sun–Thu: 9am – 6pm\nFri: 9am – 1pm',
  mapQuery: 'Banani,Dhaka,Bangladesh',
};

export async function fetchContactContent() {
  try {
    return await apiRequest('/api/settings/contact_content');
  } catch {
    return { ...DEFAULT_CONTACT };
  }
}

export async function saveContactContent(data) {
  return await apiRequest('/api/settings/contact_content', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

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
  try {
    return await apiRequest('/api/settings/home_images');
  } catch {
    return { ...DEFAULT_HOME_IMAGES };
  }
}

export async function saveHomeImages(data) {
  return await apiRequest('/api/settings/home_images', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
