# 👥 VisitBD — দলীয় কাজের বিভাজন | Team Work Division
### শিক্ষকের কাছে উপস্থাপনার জন্য | For Teacher Presentation

> প্রজেক্ট: **VisitBD — Discover the Beauty of Bangladesh**
> মোট কোড: **28 ফাইল | 4,109 লাইন | 201 KB**
> দলের সদস্য: **৪ জন**

---

## 👤 সদস্য ১ — Rafiqul Islam
### ভূমিকা: Project Lead & Core Architecture (প্রজেক্ট প্রধান ও মূল কাঠামো নির্মাণ)

| বিষয় | বিবরণ |
|------|-------|
| 🔧 **Role** | Team Leader, Project Setup, Routing & State Management |
| 📁 **Files** | `index.html`, `vite.config.js`, `package.json`, `src/main.jsx`, `src/App.jsx`, `src/context/AuthContext.jsx`, `src/context/BookingContext.jsx`, `src/hooks/useLocalStorage.js`, `src/components/ProtectedRoute.jsx` |
| 📝 **Lines of Code** | ~**450 lines** |

### কাজের বিবরণ | Work Description

**বাংলায়:**
- প্রজেক্টের মূল কাঠামো (Vite + React) সেটআপ করেছেন
- `index.html` এ SEO meta tags, Open Graph, Google Fonts যোগ করেছেন
- `App.jsx` এ সমস্ত Route সংজ্ঞায়িত করেছেন (Public, Protected, 404)
- `AuthContext.jsx` — পুরো লগইন/লগআউট/রেজিস্ট্রেশন সিস্টেম তৈরি করেছেন
- `BookingContext.jsx` — উইশলিস্ট, Recently Viewed, Compare ফিচার তৈরি করেছেন
- `ProtectedRoute.jsx` — লগইন না থাকলে পেজ ব্লক করার সিস্টেম
- `useLocalStorage` হুক দিয়ে ব্রাউজারে ডাটা স্থায়ীভাবে সেভ করার ব্যবস্থা করেছেন

**English:**
- Set up the entire project foundation using Vite + React
- Configured SEO, Open Graph, and typography in `index.html`
- Defined all routes in `App.jsx` (public, protected, and 404 routes)
- Built the complete authentication system in `AuthContext.jsx`
- Created the wishlist & booking state management in `BookingContext.jsx`
- Implemented the security guard (`ProtectedRoute`) for login-protected pages
- Built the `useLocalStorage` custom hook for persistent browser data

### গুরুত্বপূর্ণ কোড উদাহরণ | Key Code Highlight
```javascript
// ProtectedRoute — লগইন না থাকলে Login পেজে পাঠায়
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
```

---

## 👤 সদস্য ২ — Nusrat Jahan
### ভূমিকা: UI Designer & Component Builder (UI ডিজাইন ও কম্পোনেন্ট নির্মাণ)

| বিষয় | বিবরণ |
|------|-------|
| 🎨 **Role** | UI/UX Design, Design System, Navbar, Footer, Hero, Spinner |
| 📁 **Files** | `src/styles/theme.css`, `src/index.css`, `src/components/Navbar.jsx`, `src/components/Footer.jsx`, `src/components/HeroSlider.jsx`, `src/components/LoadingSpinner.jsx`, `src/components/BTBWidget.jsx` |
| 📝 **Lines of Code** | ~**1,130 lines** |

### কাজের বিবরণ | Work Description

**বাংলায়:**
- `theme.css` — পুরো অ্যাপের রঙ, ফন্ট, shadow, gradient এর ডিজাইন সিস্টেম তৈরি করেছেন (CSS Variables)
- `index.css` — Bootstrap override করে dark theme বানিয়েছেন, scrollbar কাস্টম করেছেন
- `Navbar.jsx` — স্ক্রল-সেনসিটিভ glass effect navbar, মোবাইল hamburger মেনু, লগইন/লগআউট ড্রপডাউন
- `Footer.jsx` — ৪ কলামের footer, সোশ্যাল মিডিয়া, newsletter subscription বক্স
- `HeroSlider.jsx` — হোম পেজের আকর্ষণীয় ছবি স্লাইডার
- `LoadingSpinner.jsx` — পুনর্ব্যবহারযোগ্য loading animation (sm/md/lg size)
- `BTBWidget.jsx` — বাংলাদেশ পর্যটন বোর্ডের floating info widget

**English:**
- Built the complete design system (`theme.css`) with CSS variables for colors, fonts, shadows, and gradients
- Overrode Bootstrap defaults with a custom dark theme in `index.css`
- Created the scroll-aware glassmorphism Navbar with mobile hamburger menu
- Designed the 4-column Footer with social links and newsletter input
- Built the HeroSlider image slideshow for the homepage
- Created the reusable `LoadingSpinner` component
- Built the fixed Bangladesh Tourism Board floating widget

### গুরুত্বপূর্ণ কোড উদাহরণ | Key Code Highlight
```css
/* theme.css — সমগ্র অ্যাপের রঙের সিস্টেম */
:root {
  --primary: #006A4E;          /* বাংলাদেশের সবুজ */
  --gold: #E8B84B;             /* সোনালি রঙ */
  --gradient-primary: linear-gradient(135deg, #006A4E, #00875f);
  --font-heading: 'Poppins', sans-serif;
  --font-body: 'Inter', sans-serif;
}
```

---

## 👤 সদস্য ৩ — Tanvir Ahmed
### ভূমিকা: Data & Feature Developer (ডাটা ও ফিচার ডেভেলপার)

| বিষয় | বিবরণ |
|------|-------|
| 💾 **Role** | Data Management, API Service, Map Integration, Search & Filter |
| 📁 **Files** | `src/services/api.js`, `public/data/destinations.json`, `src/components/MapView.jsx`, `src/components/SearchFilter.jsx`, `src/components/TravelCostTable.jsx`, `src/components/DestinationCard.jsx` |
| 📝 **Lines of Code** | ~**705 lines** |

### কাজের বিবরণ | Work Description

**বাংলায়:**
- `destinations.json` — ১৫টি বাংলাদেশি পর্যটন স্থানের সম্পূর্ণ ডাটা তৈরি করেছেন (নাম, বিবরণ, ছবি, ম্যাপ কো-অর্ডিনেট, মূল্য, রেটিং)
- `api.js` — পুরো CRUD সিস্টেম: ডাটা পড়া, নতুন জায়গা যোগ, সম্পাদনা, মুছে ফেলা — সব localStorage দিয়ে
- `MapView.jsx` — Leaflet ম্যাপ ইন্টিগ্রেশন, ক্যাটাগরি অনুযায়ী রঙিন পিন, পপআপ কার্ড
- `SearchFilter.jsx` — নাম, ক্যাটাগরি, বিভাগ, মূল্য, রেটিং দিয়ে ফিল্টার সিস্টেম
- `TravelCostTable.jsx` — ঢাকা থেকে যাতায়াত খরচের টেবিল
- `DestinationCard.jsx` — প্রতিটি পর্যটন স্থানের কার্ড (ছবি, রেটিং, উইশলিস্ট বাটন)

**English:**
- Created complete data for 15 Bangladesh tourist destinations in `destinations.json`
- Built the entire CRUD API service using localStorage as a fake database
- Integrated Leaflet maps with color-coded category pins and popup info cards
- Built the advanced search and filter system (by name, category, division, price, rating)
- Created the travel cost comparison table from Dhaka
- Designed the destination card component with wishlist toggle

### গুরুত্বপূর্ণ কোড উদাহরণ | Key Code Highlight
```javascript
// api.js — Dummy CRUD system
export async function fetchDestinations() {
  const base = await fetch('/data/destinations.json').then(r => r.json());
  const edits = getEdits();
  const deletedIds = getDeletedIds();
  // Base data + Admin edits + Admin additions — all merged!
  return [...base.filter(d => !deletedIds.includes(d.id))
                 .map(d => edits[d.id] ? {...d, ...edits[d.id]} : d),
          ...getAdminDestinations()];
}
```

---

## 👤 সদস্য ৪ — Maliha Rahman
### ভূমিকা: Pages & User Experience Developer (পেজ ও ব্যবহারকারী অভিজ্ঞতা)

| বিষয় | বিবরণ |
|------|-------|
| 🖥️ **Role** | All Pages (Home, Destinations, Detail, Login, Register, Dashboard, Admin, About, Contact, 404) |
| 📁 **Files** | `src/pages/Home.jsx`, `src/pages/Destinations.jsx`, `src/pages/DestinationDetail.jsx`, `src/pages/Login.jsx`, `src/pages/Register.jsx`, `src/pages/Dashboard.jsx`, `src/pages/AdminPanel.jsx`, `src/pages/About.jsx`, `src/pages/Contact.jsx`, `src/pages/NotFound.jsx` |
| 📝 **Lines of Code** | ~**1,850 lines** |

### কাজের বিবরণ | Work Description

**বাংলায়:**
- `Home.jsx` — হোম পেজ: HeroSlider, Statistics, Featured Destinations, Why Us, Testimonials, CTA
- `Destinations.jsx` — সব গন্তব্যের গ্রিড ভিউ, SearchFilter সংযুক্ত, MapView সুইচ
- `DestinationDetail.jsx` — একটি জায়গার বিস্তারিত পেজ: গ্যালারি, ম্যাপ, খরচ, সেরা সময়, উইশলিস্ট
- `Login.jsx` — লগইন ফর্ম, demo credentials, পাসওয়ার্ড দেখানো/লুকানো
- `Register.jsx` — নতুন অ্যাকাউন্ট তৈরি ফর্ম
- `Dashboard.jsx` — ব্যক্তিগত ড্যাশবোর্ড: উইশলিস্ট, Recently Viewed, প্রোফাইল
- `AdminPanel.jsx` — অ্যাডমিন প্যানেল: ডেস্টিনেশন যোগ/সম্পাদনা/মুছে ফেলা, পরিসংখ্যান
- `About.jsx` — আমাদের সম্পর্কে, টিম পরিচিতি, মিশন
- `Contact.jsx` — যোগাযোগ ফর্ম ও তথ্য
- `NotFound.jsx` — ৪০৪ এরর পেজ

**English:**
- Built the complete Home page with all sections
- Created the Destinations listing page with grid/map view toggle
- Built the DestinationDetail page with gallery, map, cost info, wishlist
- Created the Login and Register forms with validation
- Built the personalized user Dashboard
- Created the full Admin Panel with CRUD operations and statistics dashboard
- Designed the About, Contact, and 404 pages

### গুরুত্বপূর্ণ কোড উদাহরণ | Key Code Highlight
```javascript
// AdminPanel.jsx — শুধু admin role দেখতে পারবে
const { user } = useAuth();
if (user?.role !== 'admin') {
  return <Navigate to="/" />;  // অ্যাডমিন না হলে ফিরিয়ে দাও
}
```

---

## 📊 সারসংক্ষেপ ছক | Summary Table

| সদস্য | ভূমিকা | ফাইল | লাইন | অবদান |
|-------|--------|------|------|-------|
| **Rafiqul Islam** | Project Lead & Architecture | 9 | ~450 | Routing, Auth, State |
| **Nusrat Jahan** | UI/UX Designer | 7 | ~1,130 | Design System, Navbar, Footer |
| **Tanvir Ahmed** | Data & Features | 6 | ~705 | API, Maps, Search, Cards |
| **Maliha Rahman** | Pages Developer | 10 | ~1,850 | All 10 Pages |
| **মোট / Total** | | **32 ফাইল** | **~4,135 লাইন** | |

---

## 🎯 শিক্ষকের কাছে উপস্থাপনার পরামর্শ | Tips for Teacher Presentation

> [!TIP]
> **প্রতিটি সদস্য তাদের নিজের অংশ demo করবেন:**
>
> 1. **Rafiqul** → `App.jsx` খুলে routing দেখাবে, `/admin` তে ProtectedRoute কীভাবে কাজ করে
> 2. **Nusrat** → `theme.css` খুলে CSS variables দেখাবে, Navbar scroll effect live দেখাবে
> 3. **Tanvir** → Admin Panel থেকে নতুন destination যোগ করবে, Map view দেখাবে
> 4. **Maliha** → Home → Destinations → Detail → Login → Dashboard যাত্রা দেখাবে

> [!NOTE]
> **প্রজেক্টের বিশেষত্ব যা উল্লেখ করতে হবে | Special Features to Highlight:**
> - ✅ কোনো real backend/server নেই — শুধু `localStorage` দিয়ে সব CRUD কাজ করে
> - ✅ Fully Responsive — Mobile, Tablet, Desktop সব ডিভাইসে কাজ করে
> - ✅ SEO Optimized — Google এর জন্য Meta tags আছে
> - ✅ Role-based Access — Admin ও Regular User আলাদা সুবিধা পায়
> - ✅ Real Map Integration — OpenStreetMap দিয়ে বাংলাদেশের আসল ম্যাপ
> - ✅ Bangla Support — Google Fonts এ Hind Siliguri ফন্ট যুক্ত
