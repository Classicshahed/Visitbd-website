// server/index.js
// Standalone Node.js HTTP Server for VisitBD REST API + SQLite Database

import http from 'node:http';
import { handleApiRequest } from './apiHandler.js';
import { getDb } from './db.js';

const PORT = process.env.PORT || 4000;

// Initialize database on startup
getDb();

const server = http.createServer((req, res) => {
  if (req.url && req.url.startsWith('/api')) {
    handleApiRequest(req, res);
  } else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        service: 'VisitBD Backend API Server',
        status: 'online',
        endpoints: '/api/health, /api/destinations, /api/auth/login, /api/bookings, /api/reviews, /api/contact-messages',
      })
    );
  }
});

server.listen(PORT, () => {
  console.log(`🚀 VisitBD Database & API Server running at http://localhost:${PORT}/api`);
});

