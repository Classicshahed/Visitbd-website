-- =============================================================================
-- VisitBD — PostgreSQL / Supabase Production Schema
-- Run this in Supabase SQL Editor for cloud PostgreSQL deployment
-- =============================================================================

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  avatar TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  bio TEXT DEFAULT 'Exploring the beauty of Bangladesh!',
  join_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS destinations (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  division TEXT NOT NULL,
  category TEXT NOT NULL,
  short_desc TEXT NOT NULL,
  overview TEXT,
  rating NUMERIC(2,1) DEFAULT 4.5,
  price INTEGER DEFAULT 1000,
  duration TEXT,
  image TEXT,
  highlights JSONB DEFAULT '[]'::jsonb,
  activities JSONB DEFAULT '[]'::jsonb,
  best_season TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  tags JSONB DEFAULT '[]'::jsonb,
  featured BOOLEAN DEFAULT FALSE,
  travel_routes JSONB DEFAULT '[]'::jsonb,
  admin_created BOOLEAN DEFAULT FALSE,
  is_edited BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
  id BIGSERIAL PRIMARY KEY,
  destination_id BIGINT NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  destination_id BIGINT NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  destination_name TEXT NOT NULL,
  destination_image TEXT,
  travel_date DATE NOT NULL,
  travelers SMALLINT DEFAULT 1,
  transport_type TEXT DEFAULT 'Bus',
  total_cost INTEGER NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wishlists (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  destination_id BIGINT NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, destination_id)
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_destinations_category ON destinations(category);
CREATE INDEX IF NOT EXISTS idx_destinations_division ON destinations(division);
CREATE INDEX IF NOT EXISTS idx_reviews_destination ON reviews(destination_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_user ON wishlists(user_id);

