// server/apiHandler.js
// Unified REST API Router for VisitBD (works in Vite dev/preview server & standalone Node HTTP server)

import {
  getDb,
  mapDestinationRow,
  seedDestinationsIfNeeded,
  hashPassword,
  verifyPassword,
  signToken,
  DEFAULT_ABOUT,
  DEFAULT_CONTACT,
  DEFAULT_HOME_IMAGES,
} from './db.js';

// In-memory sliding window rate limiter (per api-patterns skill)
const rateBuckets = new Map();
const RATE_LIMIT_MAX = 120;
const RATE_LIMIT_WINDOW_MS = 60_000;

function checkRateLimit(ip = 'local') {
  const now = Date.now();
  const bucket = rateBuckets.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
  if (now > bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + RATE_LIMIT_WINDOW_MS;
  }
  bucket.count += 1;
  rateBuckets.set(ip, bucket);
  return {
    allowed: bucket.count <= RATE_LIMIT_MAX,
    remaining: Math.max(0, RATE_LIMIT_MAX - bucket.count),
  };
}

function sendJson(res, status, payload, extraHeaders = {}) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  for (const [k, v] of Object.entries(extraHeaders)) {
    res.setHeader(k, v);
  }
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 5 * 1024 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error('Invalid JSON payload'));
      }
    });
    req.on('error', reject);
  });
}

export async function handleApiRequest(req, res) {
  if (req.method === 'OPTIONS') {
    return sendJson(res, 200, { ok: true });
  }

  const clientIp = req.headers?.['x-forwarded-for'] || req.socket?.remoteAddress || 'local';
  const rate = checkRateLimit(clientIp);
  res.setHeader('X-RateLimit-Limit', String(RATE_LIMIT_MAX));
  res.setHeader('X-RateLimit-Remaining', String(rate.remaining));
  if (!rate.allowed) {
    return sendJson(res, 429, {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please try again in a minute.',
      },
    });
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname.replace(/\/+$/, '') || '/';
  const method = req.method.toUpperCase();

  try {
    const db = getDb();

    // ── GET /api/health ──────────────────────────────────────────────
    if (pathname === '/api/health' && method === 'GET') {
      return sendJson(res, 200, {
        success: true,
        status: 'ok',
        database: 'SQLite (WAL Mode)',
        timestamp: new Date().toISOString(),
      });
    }

    // ── GET /api/stats ───────────────────────────────────────────────
    if (pathname === '/api/stats' && method === 'GET') {
      const total = db.prepare('SELECT COUNT(*) as c FROM destinations WHERE is_deleted = 0').get().c;
      const featured = db
        .prepare('SELECT COUNT(*) as c FROM destinations WHERE is_deleted = 0 AND featured = 1')
        .get().c;
      const adminAdded = db
        .prepare('SELECT COUNT(*) as c FROM destinations WHERE is_deleted = 0 AND admin_created = 1')
        .get().c;
      const edited = db
        .prepare('SELECT COUNT(*) as c FROM destinations WHERE is_deleted = 0 AND is_edited = 1')
        .get().c;
      const deleted = db.prepare('SELECT COUNT(*) as c FROM destinations WHERE is_deleted = 1').get().c;
      const categories = db
        .prepare('SELECT COUNT(DISTINCT category) as c FROM destinations WHERE is_deleted = 0')
        .get().c;
      const usersCount = db.prepare('SELECT COUNT(*) as c FROM users').get().c;
      const bookingsCount = db.prepare('SELECT COUNT(*) as c FROM bookings').get().c;
      const messagesCount = db.prepare('SELECT COUNT(*) as c FROM contact_messages').get().c;
      const unreadMessages = db
        .prepare("SELECT COUNT(*) as c FROM contact_messages WHERE status = 'unread'")
        .get().c;
      const reviewsCount = db.prepare('SELECT COUNT(*) as c FROM reviews').get().c;

      return sendJson(res, 200, {
        total,
        featured,
        adminAdded,
        edited,
        deleted,
        categories,
        usersCount,
        bookingsCount,
        messagesCount,
        unreadMessages,
        reviewsCount,
      });
    }

    // ── DESTINATIONS (with Cache-Control & optional envelope/cursor per api-patterns skill) ──
    if (pathname === '/api/destinations' && method === 'GET') {
      const category = parsedUrl.searchParams.get('category');
      const division = parsedUrl.searchParams.get('division');
      const cursor = Number(parsedUrl.searchParams.get('cursor') || 0);
      const limit = Number(parsedUrl.searchParams.get('limit') || 0);
      const envelope = parsedUrl.searchParams.get('envelope') === 'true';

      let sql = 'SELECT * FROM destinations WHERE is_deleted = 0';
      const params = [];
      if (category) {
        sql += ' AND category = ?';
        params.push(category);
      }
      if (division) {
        sql += ' AND division = ?';
        params.push(division);
      }
      if (cursor > 0) {
        sql += ' AND id > ?';
        params.push(cursor);
      }
      sql += ' ORDER BY id ASC';
      if (limit > 0) {
        sql += ' LIMIT ?';
        params.push(limit + 1);
      }

      const rawRows = db.prepare(sql).all(...params);
      const hasMore = limit > 0 && rawRows.length > limit;
      const sliced = limit > 0 ? rawRows.slice(0, limit) : rawRows;
      const mapped = sliced.map(mapDestinationRow);
      const nextCursor = hasMore ? mapped[mapped.length - 1]?.id : null;

      const cacheHeaders = {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      };

      if (envelope) {
        return sendJson(
          res,
          200,
          {
            success: true,
            data: mapped,
            meta: {
              cursor: nextCursor,
              hasMore,
              total: mapped.length,
            },
          },
          cacheHeaders
        );
      }
      return sendJson(res, 200, mapped, cacheHeaders);
    }

    if (pathname === '/api/destinations/reset' && method === 'POST') {
      seedDestinationsIfNeeded(db, true);
      const rows = db
        .prepare('SELECT * FROM destinations WHERE is_deleted = 0 ORDER BY id ASC')
        .all();
      return sendJson(res, 200, {
        success: true,
        count: rows.length,
        destinations: rows.map(mapDestinationRow),
      });
    }

    if (pathname === '/api/destinations' && method === 'POST') {
      const body = await readBody(req);
      if (!body.name || !body.division || !body.category) {
        return sendJson(res, 400, { error: 'Name, division, and category are required.' });
      }
      const stmt = db.prepare(`
        INSERT INTO destinations (
          name, division, category, short_desc, overview, rating, price, duration,
          image, highlights, activities, best_season, lat, lng, tags, featured,
          travel_routes, admin_created, is_edited, is_deleted
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, 0)
      `);
      const info = stmt.run(
        body.name.trim(),
        body.division,
        body.category,
        body.shortDesc || '',
        body.overview || body.shortDesc || '',
        parseFloat(body.rating) || 4.0,
        parseInt(body.price, 10) || 1000,
        body.duration || '2-3 days',
        body.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
        JSON.stringify(Array.isArray(body.highlights) ? body.highlights : []),
        JSON.stringify(Array.isArray(body.activities) ? body.activities : []),
        body.bestSeason || 'All Year',
        body.lat ?? null,
        body.lng ?? null,
        JSON.stringify(Array.isArray(body.tags) ? body.tags : []),
        body.featured ? 1 : 0,
        JSON.stringify(Array.isArray(body.travelRoutes) ? body.travelRoutes : [])
      );
      const created = db
        .prepare('SELECT * FROM destinations WHERE id = ?')
        .get(info.lastInsertRowid);
      return sendJson(res, 201, mapDestinationRow(created));
    }

    const destMatch = pathname.match(/^\/api\/destinations\/(\d+)$/);
    if (destMatch) {
      const destId = Number(destMatch[1]);

      if (method === 'GET') {
        const row = db
          .prepare('SELECT * FROM destinations WHERE id = ? AND is_deleted = 0')
          .get(destId);
        if (!row) return sendJson(res, 404, { error: 'Destination not found.' });
        const dest = mapDestinationRow(row);
        const reviews = db
          .prepare('SELECT * FROM reviews WHERE destination_id = ? ORDER BY created_at DESC')
          .all(destId);
        return sendJson(res, 200, { ...dest, reviews });
      }

      if (method === 'PUT') {
        const existing = db.prepare('SELECT * FROM destinations WHERE id = ?').get(destId);
        if (!existing) return sendJson(res, 404, { error: 'Destination not found.' });
        const body = await readBody(req);
        const current = mapDestinationRow(existing);

        const stmt = db.prepare(`
          UPDATE destinations SET
            name = ?,
            division = ?,
            category = ?,
            short_desc = ?,
            overview = ?,
            rating = ?,
            price = ?,
            duration = ?,
            image = ?,
            highlights = ?,
            activities = ?,
            best_season = ?,
            lat = ?,
            lng = ?,
            tags = ?,
            featured = ?,
            travel_routes = ?,
            is_edited = 1,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `);

        stmt.run(
          body.name ?? current.name,
          body.division ?? current.division,
          body.category ?? current.category,
          body.shortDesc ?? current.shortDesc,
          body.overview ?? current.overview,
          body.rating !== undefined ? parseFloat(body.rating) : current.rating,
          body.price !== undefined ? parseInt(body.price, 10) : current.price,
          body.duration ?? current.duration,
          body.image ?? current.image,
          JSON.stringify(body.highlights ?? current.highlights),
          JSON.stringify(body.activities ?? current.activities),
          body.bestSeason ?? current.bestSeason,
          body.lat !== undefined ? body.lat : current.lat,
          body.lng !== undefined ? body.lng : current.lng,
          JSON.stringify(body.tags ?? current.tags),
          body.featured !== undefined ? (body.featured ? 1 : 0) : current.featured ? 1 : 0,
          JSON.stringify(body.travelRoutes ?? current.travelRoutes),
          destId
        );

        const updated = db.prepare('SELECT * FROM destinations WHERE id = ?').get(destId);
        return sendJson(res, 200, { success: true, destination: mapDestinationRow(updated) });
      }

      if (method === 'DELETE') {
        db.prepare('UPDATE destinations SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(
          destId
        );
        return sendJson(res, 200, { success: true });
      }
    }

    // ── AUTHENTICATION & USERS ───────────────────────────────────────
    if (pathname === '/api/auth/login' && method === 'POST') {
      const { email, password } = await readBody(req);
      if (!email || !password) {
        return sendJson(res, 400, { success: false, message: 'Email and password are required.' });
      }
      const user = db
        .prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)')
        .get(email.trim());
      if (!user || !verifyPassword(password, user.password_hash)) {
        return sendJson(res, 401, { success: false, message: 'Invalid email or password.' });
      }
      const safeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        joinDate: user.join_date,
        bio: user.bio,
      };
      const token = signToken({ id: user.id, email: user.email, role: user.role });
      return sendJson(res, 200, { success: true, user: safeUser, token });
    }

    if (pathname === '/api/auth/register' && method === 'POST') {
      const { name, email, password } = await readBody(req);
      if (!name || !email || !password) {
        return sendJson(res, 400, { success: false, message: 'All fields are required.' });
      }
      const exists = db
        .prepare('SELECT id FROM users WHERE LOWER(email) = LOWER(?)')
        .get(email.trim());
      if (exists) {
        return sendJson(res, 409, {
          success: false,
          message: 'An account with this email already exists.',
        });
      }
      const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=006A4E&color=fff&size=128`;
      const joinDate = new Date().toISOString().split('T')[0];
      const info = db
        .prepare(
          `INSERT INTO users (name, email, password_hash, avatar, role, bio, join_date)
           VALUES (?, ?, ?, ?, 'user', 'Exploring the beauty of Bangladesh!', ?)`
        )
        .run(name.trim(), email.trim().toLowerCase(), hashPassword(password), avatar, joinDate);

      const safeUser = {
        id: Number(info.lastInsertRowid),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        avatar,
        role: 'user',
        joinDate,
        bio: 'Exploring the beauty of Bangladesh!',
      };
      const token = signToken({ id: safeUser.id, email: safeUser.email, role: safeUser.role });
      return sendJson(res, 201, { success: true, user: safeUser, token });
    }

    if (pathname === '/api/auth/profile' && method === 'PUT') {
      const body = await readBody(req);
      if (!body.id) return sendJson(res, 400, { error: 'User ID required' });
      const existing = db.prepare('SELECT * FROM users WHERE id = ?').get(Number(body.id));
      if (!existing) return sendJson(res, 404, { error: 'User not found' });

      const newName = body.name ?? existing.name;
      const newBio = body.bio ?? existing.bio;
      const newAvatar = body.avatar ?? existing.avatar;

      db.prepare('UPDATE users SET name = ?, bio = ?, avatar = ? WHERE id = ?').run(
        newName,
        newBio,
        newAvatar,
        Number(body.id)
      );

      return sendJson(res, 200, {
        success: true,
        user: {
          id: existing.id,
          name: newName,
          email: existing.email,
          avatar: newAvatar,
          role: existing.role,
          joinDate: existing.join_date,
          bio: newBio,
        },
      });
    }

    if (pathname === '/api/users' && method === 'GET') {
      const users = db
        .prepare('SELECT id, name, email, avatar, role, bio, join_date as joinDate, created_at FROM users ORDER BY id ASC')
        .all();
      return sendJson(res, 200, users);
    }

    // ── REVIEWS ──────────────────────────────────────────────────────
    if (pathname === '/api/reviews' && method === 'GET') {
      const destId = parsedUrl.searchParams.get('destinationId');
      const rows = destId
        ? db
            .prepare('SELECT * FROM reviews WHERE destination_id = ? ORDER BY created_at DESC')
            .all(Number(destId))
        : db.prepare('SELECT * FROM reviews ORDER BY created_at DESC').all();
      return sendJson(res, 200, rows);
    }

    if (pathname === '/api/reviews' && method === 'POST') {
      const body = await readBody(req);
      const { destinationId, userId, userName, userAvatar, rating, comment } = body;
      if (!destinationId || !userName || !comment) {
        return sendJson(res, 400, { error: 'Destination, name, and comment are required.' });
      }
      const cleanRating = Math.min(5, Math.max(1, Number(rating) || 5));
      const info = db
        .prepare(
          `INSERT INTO reviews (destination_id, user_id, user_name, user_avatar, rating, comment)
           VALUES (?, ?, ?, ?, ?, ?)`
        )
        .run(
          Number(destinationId),
          userId ? Number(userId) : null,
          userName.trim(),
          userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=006A4E&color=fff&size=128`,
          cleanRating,
          comment.trim()
        );

      // Recalculate destination average rating
      const avgRow = db
        .prepare('SELECT ROUND(AVG(rating), 1) as avgRating FROM reviews WHERE destination_id = ?')
        .get(Number(destinationId));
      if (avgRow && avgRow.avgRating) {
        db.prepare('UPDATE destinations SET rating = ? WHERE id = ?').run(
          avgRow.avgRating,
          Number(destinationId)
        );
      }

      const created = db.prepare('SELECT * FROM reviews WHERE id = ?').get(info.lastInsertRowid);
      return sendJson(res, 201, created);
    }

    const reviewMatch = pathname.match(/^\/api\/reviews\/(\d+)$/);
    if (reviewMatch && method === 'DELETE') {
      db.prepare('DELETE FROM reviews WHERE id = ?').run(Number(reviewMatch[1]));
      return sendJson(res, 200, { success: true });
    }

    // ── BOOKINGS (TRIP PLANNER) ──────────────────────────────────────
    if (pathname === '/api/bookings' && method === 'GET') {
      const userId = parsedUrl.searchParams.get('userId');
      const rows = userId
        ? db
            .prepare('SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC')
            .all(Number(userId))
        : db.prepare('SELECT * FROM bookings ORDER BY created_at DESC').all();
      return sendJson(res, 200, rows);
    }

    if (pathname === '/api/bookings' && method === 'POST') {
      const body = await readBody(req);
      const {
        userId,
        userName,
        userEmail,
        destinationId,
        destinationName,
        destinationImage,
        travelDate,
        travelers,
        transportType,
        totalCost,
        notes,
      } = body;

      if (!userId || !destinationId || !travelDate) {
        return sendJson(res, 400, { error: 'User, destination, and travel date are required.' });
      }

      const info = db
        .prepare(
          `INSERT INTO bookings (
            user_id, user_name, user_email, destination_id, destination_name,
            destination_image, travel_date, travelers, transport_type, total_cost, notes, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed')`
        )
        .run(
          Number(userId),
          userName || 'Traveler',
          userEmail || '',
          Number(destinationId),
          destinationName || '',
          destinationImage || '',
          travelDate,
          Number(travelers) || 1,
          transportType || 'Bus',
          Number(totalCost) || 0,
          notes || ''
        );

      const created = db.prepare('SELECT * FROM bookings WHERE id = ?').get(info.lastInsertRowid);
      return sendJson(res, 201, created);
    }

    const bookingMatch = pathname.match(/^\/api\/bookings\/(\d+)$/);
    if (bookingMatch) {
      const bookingId = Number(bookingMatch[1]);
      if (method === 'PATCH') {
        const { status } = await readBody(req);
        db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status || 'confirmed', bookingId);
        return sendJson(res, 200, { success: true });
      }
      if (method === 'DELETE') {
        db.prepare('DELETE FROM bookings WHERE id = ?').run(bookingId);
        return sendJson(res, 200, { success: true });
      }
    }

    // ── WISHLISTS ────────────────────────────────────────────────────
    if (pathname === '/api/wishlists' && method === 'GET') {
      const userId = parsedUrl.searchParams.get('userId');
      if (!userId) return sendJson(res, 200, []);
      const rows = db
        .prepare(
          `SELECT d.* FROM wishlists w
           JOIN destinations d ON d.id = w.destination_id
           WHERE w.user_id = ? AND d.is_deleted = 0
           ORDER BY w.created_at DESC`
        )
        .all(Number(userId));
      return sendJson(res, 200, rows.map(mapDestinationRow));
    }

    if (pathname === '/api/wishlists/toggle' && method === 'POST') {
      const { userId, destinationId } = await readBody(req);
      if (!userId || !destinationId) {
        return sendJson(res, 400, { error: 'userId and destinationId required' });
      }
      const existing = db
        .prepare('SELECT id FROM wishlists WHERE user_id = ? AND destination_id = ?')
        .get(Number(userId), Number(destinationId));
      if (existing) {
        db.prepare('DELETE FROM wishlists WHERE id = ?').run(existing.id);
        return sendJson(res, 200, { wishlisted: false });
      } else {
        db.prepare('INSERT INTO wishlists (user_id, destination_id) VALUES (?, ?)').run(
          Number(userId),
          Number(destinationId)
        );
        return sendJson(res, 200, { wishlisted: true });
      }
    }

    if (pathname === '/api/wishlists' && method === 'DELETE') {
      const userId = parsedUrl.searchParams.get('userId');
      const destinationId = parsedUrl.searchParams.get('destinationId');
      if (userId && destinationId) {
        db.prepare('DELETE FROM wishlists WHERE user_id = ? AND destination_id = ?').run(
          Number(userId),
          Number(destinationId)
        );
      } else if (userId) {
        db.prepare('DELETE FROM wishlists WHERE user_id = ?').run(Number(userId));
      }
      return sendJson(res, 200, { success: true });
    }

    // ── CONTACT MESSAGES ─────────────────────────────────────────────
    if (pathname === '/api/contact-messages' && method === 'GET') {
      const rows = db
        .prepare('SELECT * FROM contact_messages ORDER BY created_at DESC')
        .all();
      return sendJson(res, 200, rows);
    }

    if (pathname === '/api/contact-messages' && method === 'POST') {
      const { name, email, subject, message } = await readBody(req);
      if (!name || !email || !subject || !message) {
        return sendJson(res, 400, { error: 'All fields are required.' });
      }
      const info = db
        .prepare(
          `INSERT INTO contact_messages (name, email, subject, message, status)
           VALUES (?, ?, ?, ?, 'unread')`
        )
        .run(name.trim(), email.trim(), subject.trim(), message.trim());
      const created = db
        .prepare('SELECT * FROM contact_messages WHERE id = ?')
        .get(info.lastInsertRowid);
      return sendJson(res, 201, { success: true, message: created });
    }

    const msgMatch = pathname.match(/^\/api\/contact-messages\/(\d+)$/);
    if (msgMatch) {
      const msgId = Number(msgMatch[1]);
      if (method === 'PATCH') {
        const { status } = await readBody(req);
        db.prepare('UPDATE contact_messages SET status = ? WHERE id = ?').run(
          status || 'read',
          msgId
        );
        return sendJson(res, 200, { success: true });
      }
      if (method === 'DELETE') {
        db.prepare('DELETE FROM contact_messages WHERE id = ?').run(msgId);
        return sendJson(res, 200, { success: true });
      }
    }

    // ── SITE SETTINGS (ABOUT / CONTACT / HOME IMAGES) ────────────────
    const settingsMatch = pathname.match(/^\/api\/settings\/([a-z_]+)$/);
    if (settingsMatch) {
      const key = settingsMatch[1];
      const defaultsMap = {
        about_content: DEFAULT_ABOUT,
        contact_content: DEFAULT_CONTACT,
        home_images: DEFAULT_HOME_IMAGES,
      };
      if (method === 'GET') {
        const row = db.prepare('SELECT value FROM site_settings WHERE key = ?').get(key);
        const fallback = defaultsMap[key] || {};
        if (!row) return sendJson(res, 200, fallback);
        try {
          return sendJson(res, 200, { ...fallback, ...JSON.parse(row.value) });
        } catch {
          return sendJson(res, 200, fallback);
        }
      }
      if (method === 'PUT') {
        const body = await readBody(req);
        db.prepare(
          `INSERT INTO site_settings (key, value, updated_at)
           VALUES (?, ?, CURRENT_TIMESTAMP)
           ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`
        ).run(key, JSON.stringify(body));
        return sendJson(res, 200, { success: true });
      }
    }

    return sendJson(res, 404, { error: `API route not found: ${method} ${pathname}` });
  } catch (err) {
    console.error('[VisitBD API Error]:', err);
    return sendJson(res, 500, { error: err.message || 'Internal Server Error' });
  }
}

