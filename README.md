# 🇧🇩 VisitBD — Bangladesh Tourism Information Website

A modern, fully-featured **frontend-only** tourism information web app for Bangladesh, built with **ReactJS (Vite)**, **Bootstrap 5**, and **Leaflet maps**. Showcases 15 iconic Bangladeshi destinations with interactive maps, advanced filtering, an admin panel, and a simulated data API — all without any backend or database.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

### Installation

```bash
# 1. Clone or download the project
cd "website Design for tourism information"

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be live at **http://localhost:5173**

### Build for Production
```bash
npm run build
npm run preview   # preview the production build locally
```

---

## 🔑 Login Credentials

| Role  | Email                  | Password    | Access                        |
|-------|------------------------|-------------|-------------------------------|
| Admin | `admin@travel.com`     | `travel123` | Full site + Admin Panel CRUD  |
| User  | `user@travel.com`      | `user123`   | Dashboard, Wishlist           |

> You can also register a new account via the **Register** page.

---

## 📁 Project Structure

```
website Design for tourism information/
│
├── public/
│   ├── data/
│   │   └── destinations.json       ← 15 destination records (source of truth)
│   └── images/                     ← Static destination images
│
├── src/
│   ├── components/                 ← Reusable UI components
│   │   ├── Navbar.jsx              ← Top navigation (auth-aware, admin link)
│   │   ├── Footer.jsx              ← Site footer with links
│   │   ├── HeroSlider.jsx          ← Auto-playing fullscreen hero carousel
│   │   ├── DestinationCard.jsx     ← Destination grid card with wishlist
│   │   ├── SearchFilter.jsx        ← Advanced filter bar (search, category, price, transport)
│   │   ├── MapView.jsx             ← Leaflet interactive map component
│   │   ├── TravelCostTable.jsx     ← Route & cost breakdown table
│   │   ├── BTBWidget.jsx           ← Bangladesh Tourism Board floating widget
│   │   ├── ProtectedRoute.jsx      ← Auth guard for protected pages
│   │   └── LoadingSpinner.jsx      ← Reusable loading indicator
│   │
│   ├── pages/                      ← Route-level page components
│   │   ├── Home.jsx                ← Landing page (hero + featured + stats)
│   │   ├── Destinations.jsx        ← All destinations (grid/map toggle)
│   │   ├── DestinationDetail.jsx   ← Single destination with tabs & map
│   │   ├── AdminPanel.jsx          ← Admin CRUD (add/edit/delete all destinations)
│   │   ├── Dashboard.jsx           ← User wishlist & recent views
│   │   ├── Login.jsx               ← Auth login page
│   │   ├── Register.jsx            ← New account registration
│   │   ├── About.jsx               ← About VisitBD page
│   │   ├── Contact.jsx             ← Contact form page
│   │   └── NotFound.jsx            ← 404 error page
│   │
│   ├── context/
│   │   ├── AuthContext.jsx         ← Global auth state (login/logout/role)
│   │   └── BookingContext.jsx      ← Global wishlist & recent views state
│   │
│   ├── services/
│   │   └── api.js                  ← Dummy API (simulates REST + localStorage)
│   │
│   ├── hooks/
│   │   └── useLocalStorage.js      ← Custom hook for localStorage state
│   │
│   ├── styles/
│   │   └── theme.css               ← Design tokens, Bootstrap overrides, Leaflet styles
│   │
│   ├── index.css                   ← Global base styles
│   ├── App.jsx                     ← Root router & layout
│   └── main.jsx                    ← React entry point
│
├── index.html                      ← HTML shell (Google Fonts, meta tags)
├── package.json
└── vite.config.js
```

---

## 🗺️ Pages & Features

### 🏠 Home (`/`)
- Fullscreen **Hero Slider** cycling through featured destinations with auto-play, pause, and manual controls
- **Statistics bar** — 15+ Destinations, 50K+ Travelers, 4.8 Avg Rating
- **Featured Destinations** section with destination cards
- **Bangladesh Tourism Board** collapsible widget in the bottom-left corner

### 📍 Destinations (`/destinations`)
- **Grid View** — responsive 3-column card layout with all 15 destinations
- **Map View** — Leaflet interactive map of Bangladesh with colour-coded markers by category; click any marker to see a popup with image, price, and link
- **Advanced Search & Filter:**
  - 🔍 Text search (name, division, description, highlights)
  - 🏷️ Category filter (Beach, Hill, Forest, Heritage, Lake, Tea Garden, Adventure, Cultural)
  - 🗺️ Division filter (all 8 divisions)
  - 💰 Dual price-range sliders (৳0 – ৳20,000 BDT)
  - 🚌 Transport type filter (Bus, Train, Air)
  - 🔃 Sort (Top Rated, Price ↑, Price ↓, A–Z)
- Active filters shown as **removable chips**; result count updates live

### 📄 Destination Detail (`/destinations/:id`)
- Full photo gallery with 4 thumbnails
- **Tabbed interface:**
  - 📝 **Overview** — full description
  - 🎯 **Activities** — checklist of things to do + best season badge
  - 🚌 **How to Get There** — travel routes & cost table (Bus/Train/Air/Ship)
  - 🗺️ **Location Map** — single-marker Leaflet map with coordinates
- **Booking panel** (sticky sidebar) — price, duration, season, rating; Save to Wishlist
- **Related destinations** by same category

### 🛡️ Admin Panel (`/admin`) — Admin Only
> Login as `admin@travel.com / travel123` to access

**Stats Tab:**
- Live counters: Total Destinations, Featured, Admin Added, Edited, Deleted, Categories

**Manage All Tab:**
- Table listing all 15 base + admin-added destinations
- Each row shows: thumbnail, name, category badge (colour-coded), division, rating, price, short description
- **Actions per row:**
  - 👁️ **View** — opens the live destination page in a new tab
  - ✏️ **Edit** — opens a pre-filled modal to update any field (saved as override in localStorage)
  - 🗑️ **Delete** — inline confirm → permanently removes from listing (stored in localStorage)
- 🔍 Search bar to filter the manage list
- 🔄 Refresh button to reload from the API

**Add New:**
- Click **"Add New"** (header button or toolbar button) to open a modal form
- Fields: Name, Division, Category, Price, Duration, Rating, Best Season, Image URL (with live preview), Short Description, Full Overview, Highlights, Activities, Tags
- New destination instantly appears in the live site

### 👤 Dashboard (`/dashboard`) — Logged-in Users
- Wishlist management (add/remove saved destinations)
- Recently viewed destinations history

### 🔐 Login (`/login`) & Register (`/register`)
- Glassmorphism login card over a beach background
- **Demo Credentials** quick-fill button
- Auth state persisted in `localStorage` across page refreshes

### ℹ️ About (`/about`) & Contact (`/contact`)
- Company mission, values, and team
- Interactive contact form (frontend only)

---

## 🏛️ Bangladesh Tourism Board Widget

A **fixed bottom-left** floating widget appears on every page showing official contact info:

| Field    | Value                              |
|----------|------------------------------------|
| Address  | 233 Airport Road, Tejgaon, Dhaka-1215 |
| Phone    | +880-2-55107270                    |
| Hotline  | 16302                              |
| Email    | info@tourismboard.gov.bd           |
| Website  | parjatan.gov.bd                    |

Click the widget to expand/collapse it.

---

## 💾 Data Architecture

This is a **100% frontend project** — no server, no database. All data is managed through:

### Static JSON
`public/data/destinations.json` — the single source of truth for the 15 base destinations. Never modified at runtime.

### Dummy API Service (`src/services/api.js`)
Simulates REST endpoints with artificial delays (600–800ms):

| Function              | Simulates     | Storage                          |
|-----------------------|---------------|----------------------------------|
| `fetchDestinations()` | GET /all      | Merges JSON + edits + admin-added |
| `fetchDestinationById(id)` | GET /:id  | Looks up from merged list        |
| `addDestination(data)` | POST /add    | `bd_tourism_admin_destinations`  |
| `editDestination(id, data)` | PUT /:id | `bd_tourism_edited_destinations` |
| `deleteDestination(id)` | DELETE /:id | `bd_tourism_deleted_ids`         |
| `fetchStats()`        | GET /stats    | Computed from all sources        |

### localStorage Keys

| Key                              | Purpose                              |
|----------------------------------|--------------------------------------|
| `bd_tourism_user`                | Logged-in user session               |
| `bd_tourism_admin_destinations`  | Admin-added destinations (array)     |
| `bd_tourism_edited_destinations` | Field overrides for any destination (object, keyed by ID) |
| `bd_tourism_deleted_ids`         | IDs to exclude from listings (array) |
| `bd_tourism_wishlist`            | User's saved destination IDs         |
| `bd_tourism_recent_views`        | Recently viewed destinations         |

### Reset All Data
To restore the site to its original state, open **browser DevTools Console** and run:
```javascript
localStorage.clear();
location.reload();
```

---

## 🎨 Design System

### Color Palette (Bangladesh-Inspired)

| Token               | Value     | Meaning                        |
|---------------------|-----------|--------------------------------|
| `--primary`         | `#006A4E` | 🇧🇩 Flag green — primary actions |
| `--primary-light`   | `#00875f` | Hover states, links            |
| `--accent`          | `#F42A41` | 🇧🇩 Flag red — alerts, badges   |
| `--gold`            | `#E8B84B` | Premium highlights, prices     |
| `--dark`            | `#0D1B2A` | Page backgrounds               |
| `--card-bg`         | `#1A2940` | Card surfaces                  |
| `--text-primary`    | `#F0F4F8` | Headings                       |
| `--text-secondary`  | `#9BB0C5` | Body text                      |

### Typography

| Font              | Usage                               |
|-------------------|-------------------------------------|
| **Poppins**       | Headings, buttons, labels           |
| **Hind Siliguri** | Cultural accent (Bengali-inspired)  |
| **Inter**         | Body text, descriptions             |

### Components
- **Glassmorphism** cards on login/hero overlays
- **Category badges** — each category has a distinct colour (Beach=teal, Hill=green, Heritage=gold, etc.)
- **Dark scrollbars** with Bangladesh green accent
- **Leaflet popups** — custom dark theme matching the UI
- **Toast notifications** — green (success), red (error)

---

## 📦 Tech Stack

| Technology         | Version  | Purpose                              |
|--------------------|----------|--------------------------------------|
| React              | 19.x     | UI framework                         |
| Vite               | 8.x      | Build tool & dev server              |
| React Router DOM   | 7.x      | Client-side routing                  |
| Bootstrap          | 5.3.x    | Layout, grid, utility classes        |
| React Icons        | 5.x      | Icon library (FaXxx components)      |
| Leaflet            | 1.9.x    | Interactive maps                     |
| React Leaflet      | 5.x      | React wrapper for Leaflet            |

---

## 🗺️ The 15 Destinations

| # | Name               | Division            | Category   | Price (BDT) | Rating |
|---|--------------------|---------------------|------------|-------------|--------|
| 1 | Cox's Bazar        | Chittagong          | Beach      | ৳3,000      | 4.9    |
| 2 | Sundarbans         | Khulna              | Forest     | ৳10,000     | 4.8    |
| 3 | Sajek Valley       | Chittagong Hill Tracts | Hill    | ৳4,500      | 4.9    |
| 4 | Saint Martin's Island | Chittagong       | Beach      | ৳6,000      | 4.8    |
| 5 | Srimangal          | Sylhet              | Tea Garden | ৳2,500      | 4.7    |
| 6 | Kuakata            | Barisal             | Beach      | ৳2,500      | 4.5    |
| 7 | Bandarban          | Chittagong          | Hill       | ৳5,000      | 4.8    |
| 8 | Rangamati          | Chittagong          | Lake       | ৳3,500      | 4.7    |
| 9 | Paharpur           | Rajshahi            | Heritage   | ৳1,500      | 4.6    |
| 10 | Lalbagh Fort      | Dhaka               | Heritage   | ৳300        | 4.4    |
| 11 | Ahsan Manzil      | Dhaka               | Heritage   | ৳200        | 4.3    |
| 12 | Ratargul          | Sylhet              | Forest     | ৳2,000      | 4.6    |
| 13 | Bichanakandi      | Sylhet              | Adventure  | ৳2,000      | 4.7    |
| 14 | Jaflong           | Sylhet              | Cultural   | ৳2,000      | 4.5    |
| 15 | Nijhum Dwip       | Noakhali            | Adventure  | ৳2,500      | 4.4    |

---

## 🔧 How to Add More Destinations

### Option A — Via Admin Panel (Recommended, no code)
1. Log in as **admin@travel.com / travel123**
2. Go to `/admin`
3. Click **"Add New"**
4. Fill in the form and click **"Add Destination"**
5. The new destination is immediately available on the live site

### Option B — Edit the JSON file (for permanent base data)
Edit `public/data/destinations.json` and add a new object following this schema:

```json
{
  "id": 16,
  "name": "Your Destination Name",
  "division": "Sylhet",
  "category": "Lake",
  "shortDesc": "One-line description shown on cards",
  "overview": "Full paragraph description for the detail page",
  "image": "https://images.unsplash.com/photo-XXXXX?w=800&q=80",
  "rating": 4.5,
  "price": 2500,
  "duration": "2-3 days",
  "bestSeason": "November to March",
  "featured": false,
  "highlights": ["Highlight 1", "Highlight 2"],
  "activities": ["Activity 1", "Activity 2"],
  "tags": ["tag1", "tag2"],
  "lat": 24.123,
  "lng": 91.456,
  "travelRoutes": [
    {
      "type": "Bus",
      "from": "Dhaka",
      "to": "Destination",
      "duration": "5 hrs",
      "cost": 500
    }
  ]
}
```

---

## 🛠️ Available Scripts

```bash
npm run dev        # Start dev server at http://localhost:5173
npm run build      # Build production bundle → dist/
npm run preview    # Preview production build locally
npm run lint       # Run ESLint checks
```

---

## ⚠️ Known Limitations

- **Frontend-only** — No real server. All "API calls" use localStorage + static JSON.
- **Sessions reset on localStorage.clear()** — This wipes all admin edits, added destinations, wishlists, and login sessions.
- **Images** — Hero slider images and logos are stored locally. Destination gallery images are sourced from Unsplash and require an internet connection to display correctly.
- **Map tiles** — Leaflet uses CartoDB tile servers. Requires internet connection.
- **Auth is simulated** — Passwords are checked client-side (not secure for production).

---

## 📜 License

This project is for **educational and demonstration purposes only**.  
All destination content and images are used for illustrative purposes.

**Bangladesh Tourism Board** official contact:  
🌐 [parjatan.gov.bd](https://parjatan.gov.bd) | ☎ 16302

---

*Built with ❤️ for Bangladesh — the land of rivers, forests, and golden sands.*
