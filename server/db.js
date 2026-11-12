// server/db.js
// Relational SQLite Database Engine (Node.js native node:sqlite)
// Automatically creates tables and seeds initial data from public/data/destinations.json

import { DatabaseSync } from 'node:sqlite';
import { scryptSync, randomBytes, timingSafeEqual, createHmac } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, 'visitbd.sqlite');
const SEED_JSON_PATH = path.join(__dirname, '..', 'public', 'data', 'destinations.json');
const JWT_SECRET = process.env.JWT_SECRET || 'visitbd-super-secret-jwt-key-2026';

let dbInstance = null;

// ── Password, UUIDv7 & Token Helpers (per database-architect skill) ─
export function generateUuidV7() {
  const now = BigInt(Date.now());
  const timeHex = now.toString(16).padStart(12, '0');
  const rand = randomBytes(10).toString('hex');
  return `${timeHex.slice(0, 8)}-${timeHex.slice(8, 12)}-7${rand.slice(0, 3)}-8${rand.slice(3, 6)}-${rand.slice(6, 18)}`;
}

export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const derived = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [salt, key] = storedHash.split(':');
  const keyBuffer = Buffer.from(key, 'hex');
  const derivedBuffer = scryptSync(password, salt, 64);
  return timingSafeEqual(keyBuffer, derivedBuffer);
}

export function signToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(
    JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 })
  ).toString('base64url');
  const signature = createHmac('sha256', JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');
  return `${header}.${body}.${signature}`;
}

export function verifyToken(token) {
  try {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSig = createHmac('sha256', JWT_SECRET)
      .update(`${header}.${body}`)
      .digest('base64url');
    if (signature !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

// ── Default CMS Settings ────────────────────────────────────────────
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

export const DEFAULT_CONTACT = {
  heroSubtitle:
    "Have a question, partnership idea, or just want to say hello? We'd love to hear from you!",
  office: 'Level 5, Banani Tower\nDhaka-1213, Bangladesh',
  phone: '+880 1700 000000\n+880 1800 000000',
  email: 'info@visitbd.com\nsupport@visitbd.com',
  hours: 'Sun–Thu: 9am – 6pm\nFri: 9am – 1pm',
  mapQuery: 'Banani,Dhaka,Bangladesh',
};

export const DEFAULT_HOME_IMAGES = {
  whyUsImages: [
    'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
    'https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?w=600&q=80',
  ],
  aboutMissionImage: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=700&q=80',
};

// ── Initialize & Seed Database ──────────────────────────────────────
export function getDb() {
  if (dbInstance) return dbInstance;

  dbInstance = new DatabaseSync(DB_PATH);
  dbInstance.exec('PRAGMA journal_mode = WAL;');
  dbInstance.exec('PRAGMA foreign_keys = ON;');

  // Create Schema
  dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      avatar TEXT,
      role TEXT DEFAULT 'user' CHECK(role IN ('admin', 'user')),
      bio TEXT DEFAULT 'Exploring the beauty of Bangladesh!',
      join_date TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS destinations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      division TEXT NOT NULL,
      category TEXT NOT NULL,
      short_desc TEXT NOT NULL,
      overview TEXT,
      rating REAL DEFAULT 4.5,
      price INTEGER DEFAULT 1000,
      duration TEXT,
      image TEXT,
      highlights TEXT DEFAULT '[]',
      activities TEXT DEFAULT '[]',
      best_season TEXT,
      lat REAL,
      lng REAL,
      tags TEXT DEFAULT '[]',
      featured INTEGER DEFAULT 0,
      travel_routes TEXT DEFAULT '[]',
      admin_created INTEGER DEFAULT 0,
      is_edited INTEGER DEFAULT 0,
      is_deleted INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      destination_id INTEGER NOT NULL,
      user_id INTEGER,
      user_name TEXT NOT NULL,
      user_avatar TEXT,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      comment TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      user_name TEXT NOT NULL,
      user_email TEXT NOT NULL,
      destination_id INTEGER NOT NULL,
      destination_name TEXT NOT NULL,
      destination_image TEXT,
      travel_date TEXT NOT NULL,
      travelers INTEGER DEFAULT 1,
      transport_type TEXT DEFAULT 'Bus',
      total_cost INTEGER NOT NULL,
      notes TEXT,
      status TEXT DEFAULT 'confirmed' CHECK(status IN ('pending', 'confirmed', 'cancelled')),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS wishlists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      destination_id INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, destination_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'unread' CHECK(status IN ('unread', 'read', 'resolved')),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_destinations_category ON destinations(category);
    CREATE INDEX IF NOT EXISTS idx_destinations_division ON destinations(division);
    CREATE INDEX IF NOT EXISTS idx_destinations_cat_div ON destinations(category, division) WHERE is_deleted = 0;
    CREATE INDEX IF NOT EXISTS idx_reviews_destination ON reviews(destination_id, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_wishlists_user ON wishlists(user_id);
    CREATE INDEX IF NOT EXISTS idx_messages_unread ON contact_messages(created_at DESC) WHERE status = 'unread';
  `);

  // Seed Users if empty
  const userCount = dbInstance.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount === 0) {
    const insertUser = dbInstance.prepare(`
      INSERT INTO users (name, email, password_hash, avatar, role, bio, join_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    insertUser.run(
      'Admin User',
      'admin@travel.com',
      hashPassword('travel123'),
      'https://ui-avatars.com/api/?name=Admin+User&background=006A4E&color=fff&size=128',
      'admin',
      'Passionate traveler exploring the beauty of Bangladesh.',
      '2024-01-15'
    );
    insertUser.run(
      'Rafi Ahmed',
      'rafi@example.com',
      hashPassword('password123'),
      'https://ui-avatars.com/api/?name=Rafi+Ahmed&background=F42A41&color=fff&size=128',
      'user',
      'Adventure seeker & hill-station lover.',
      '2024-03-22'
    );
  }

  // Seed Destinations if empty
  seedDestinationsIfNeeded(dbInstance);

  // Seed Site Settings if empty
  const insertSetting = dbInstance.prepare(`
    INSERT OR IGNORE INTO site_settings (key, value) VALUES (?, ?)
  `);
  insertSetting.run('about_content', JSON.stringify(DEFAULT_ABOUT));
  insertSetting.run('contact_content', JSON.stringify(DEFAULT_CONTACT));
  insertSetting.run('home_images', JSON.stringify(DEFAULT_HOME_IMAGES));

  // Seed Sample Reviews if empty
  const reviewCount = dbInstance.prepare('SELECT COUNT(*) as count FROM reviews').get().count;
  if (reviewCount === 0) {
    const insertReview = dbInstance.prepare(`
      INSERT INTO reviews (destination_id, user_id, user_name, user_avatar, rating, comment, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    insertReview.run(
      1,
      2,
      'Rafi Ahmed',
      'https://ui-avatars.com/api/?name=Rafi+Ahmed&background=F42A41&color=fff&size=128',
      5,
      'Marine Drive at sunset is unforgettable! Highly recommend visiting Inani Beach early in the morning.',
      '2025-01-18T10:30:00Z'
    );
    insertReview.run(
      2,
      2,
      'Rafi Ahmed',
      'https://ui-avatars.com/api/?name=Rafi+Ahmed&background=F42A41&color=fff&size=128',
      5,
      'A 3-day launch safari through the Sundarbans canals was the best wildlife experience of my life.',
      '2025-02-04T14:15:00Z'
    );
    insertReview.run(
      3,
      1,
      'Admin User',
      'https://ui-avatars.com/api/?name=Admin+User&background=006A4E&color=fff&size=128',
      5,
      'Waking up above the clouds at Konglak Para in Sajek Valley feels surreal.',
      '2025-02-12T08:00:00Z'
    );
  }

  return dbInstance;
}

export function seedDestinationsIfNeeded(db = getDb(), forceReset = false) {
  if (forceReset) {
    db.exec('DELETE FROM destinations;');
  }
  const count = db.prepare('SELECT COUNT(*) as count FROM destinations').get().count;
  if (count === 0 && fs.existsSync(SEED_JSON_PATH)) {
    const raw = fs.readFileSync(SEED_JSON_PATH, 'utf8');
    const items = JSON.parse(raw);
    const stmt = db.prepare(`
      INSERT INTO destinations (
        id, name, division, category, short_desc, overview, rating, price, duration,
        image, highlights, activities, best_season, lat, lng, tags, featured,
        travel_routes, admin_created, is_edited, is_deleted
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0)
    `);

    for (const d of items) {
      stmt.run(
        d.id,
        d.name,
        d.division || 'Dhaka',
        d.category || 'Heritage',
        d.shortDesc || '',
        d.overview || d.shortDesc || '',
        Number(d.rating) || 4.5,
        Number(d.price) || 1000,
        d.duration || '2-3 days',
        d.image || '',
        JSON.stringify(d.highlights || []),
        JSON.stringify(d.activities || []),
        d.bestSeason || 'November to March',
        d.lat ?? null,
        d.lng ?? null,
        JSON.stringify(d.tags || []),
        d.featured ? 1 : 0,
        JSON.stringify(d.travelRoutes || [])
      );
    }
  }
}

// Helper to map SQLite row to Frontend destination shape
export function mapDestinationRow(row) {
  if (!row) return null;
  const safeParse = (str, fallback = []) => {
    try {
      return str ? JSON.parse(str) : fallback;
    } catch {
      return fallback;
    }
  };
  return {
    id: row.id,
    name: row.name,
    division: row.division,
    category: row.category,
    shortDesc: row.short_desc,
    overview: row.overview,
    rating: Number(row.rating),
    price: Number(row.price),
    duration: row.duration,
    image: row.image,
    highlights: safeParse(row.highlights, []),
    activities: safeParse(row.activities, []),
    bestSeason: row.best_season,
    lat: row.lat !== null ? Number(row.lat) : null,
    lng: row.lng !== null ? Number(row.lng) : null,
    tags: safeParse(row.tags, []),
    featured: Boolean(row.featured),
    travelRoutes: safeParse(row.travel_routes, []),
    adminCreated: Boolean(row.admin_created),
    isEdited: Boolean(row.is_edited),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

