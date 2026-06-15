# 🌿 VisitBD — সম্পূর্ণ কোডবেস ব্যাখ্যা (A Complete Beginner's Guide)
### বাংলা ও ইংরেজিতে | In Bengali & English

> [!IMPORTANT]
> এই ডকুমেন্টটি একজন একদম নতুন শিক্ষার্থীর কথা মাথায় রেখে লেখা হয়েছে। প্রতিটি ফাইলের প্রতিটি অংশ ব্যাখ্যা করা হয়েছে।
> This document is written for an absolute beginner. Every file, every concept is explained from scratch.

---

## 🤔 আগে বুঝি: ওয়েবসাইট আসলে কীভাবে কাজ করে? | How Does a Website Work?

কল্পনা করুন একটি বইয়ের দোকান:
Imagine a bookshop:

- **HTML** = বইয়ের বিষয়বস্তু (কী লেখা আছে) | The *content* of the book (what's written)
- **CSS** = বইয়ের ডিজাইন (রঙ, ফন্ট, লেআউট) | The *design* of the book (colors, fonts, layout)
- **JavaScript** = দোকানের কর্মী (ক্লিক করলে কী হবে, ডাটা দেখাবে) | The *shop staff* (what happens when you click, show data)
- **React** = একটি চালাক কর্মী যে ছোট ছোট কাজ ভাগ করে নেয় | A *smart worker* who divides work into small reusable tasks

---

## 📁 পুরো প্রজেক্টের মানচিত্র | The Full Project Map

```
website Design for tourism information/
│
├── index.html              ← সবকিছুর শুরু | THE STARTING POINT
├── vite.config.js          ← বিল্ড টুলের সেটিং | Build tool settings
├── package.json            ← প্রজেক্টের পরিচয়পত্র | Project ID card
│
└── src/                    ← সব কোড এখানে | ALL CODE IS HERE
    ├── main.jsx            ← React চালু করার চাবি | The ignition key
    ├── App.jsx             ← ট্রাফিক কন্ট্রোলার | Traffic controller
    ├── index.css           ← সব পেজের মূল ডিজাইন | Master design
    │
    ├── components/         ← ছোট পুনর্ব্যবহারযোগ্য যন্ত্রাংশ | Small reusable parts
    │   ├── Navbar.jsx
    │   ├── Footer.jsx
    │   ├── HeroSlider.jsx
    │   ├── DestinationCard.jsx
    │   ├── MapView.jsx
    │   ├── SearchFilter.jsx
    │   ├── TravelCostTable.jsx
    │   ├── LoadingSpinner.jsx
    │   ├── ProtectedRoute.jsx
    │   └── BTBWidget.jsx
    │
    ├── pages/              ← পুরো একটি পর্দা/স্ক্রিন | A complete screen
    │   ├── Home.jsx
    │   ├── Destinations.jsx
    │   ├── DestinationDetail.jsx
    │   ├── Login.jsx
    │   ├── Register.jsx
    │   ├── Dashboard.jsx
    │   ├── AdminPanel.jsx
    │   ├── About.jsx
    │   ├── Contact.jsx
    │   └── NotFound.jsx
    │
    ├── context/            ← সারা অ্যাপের শেয়ার্ড ডাটা | Shared data for whole app
    │   ├── AuthContext.jsx
    │   └── BookingContext.jsx
    │
    ├── hooks/              ← পুনর্ব্যবহারযোগ্য লজিক | Reusable logic
    │   └── useLocalStorage.js
    │
    └── services/           ← ডাটা আনা-নেওয়া | Data fetching / saving
        └── api.js
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PART 1 — THE FOUNDATION (ভিত্তি)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📄 FILE 1: `package.json` — প্রজেক্টের পরিচয়পত্র | Project's ID Card

```json
{
  "name": "website-design-for-tourism-information",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "react": "^19.2.6",
    "react-router-dom": "^7.17.0",
    "bootstrap": "^5.3.8",
    "leaflet": "^1.9.4",
    "react-icons": "^5.6.0"
  }
}
```

**বাংলায় ব্যাখ্যা:**
`package.json` হলো প্রজেক্টের পরিচয়পত্রের মতো। এটি বলে:
- প্রজেক্টের নাম কী
- কোন কোন লাইব্রেরি দরকার (`dependencies`)
- কীভাবে চালাতে হবে (`scripts` — `npm run dev` দিলে ওয়েবসাইট চালু হয়)

**English Explanation:**
Think of `package.json` like a shopping list for your project. It tells npm (Node Package Manager) exactly which external libraries to download so the project works.

| Key | মানে | Meaning |
|-----|------|---------|
| `react` | UI তৈরির মূল লাইব্রেরি | Core UI library |
| `react-router-dom` | পেজ নেভিগেশন | Page navigation |
| `bootstrap` | দ্রুত ডিজাইন | Quick styling |
| `leaflet` | ম্যাপ দেখানো | Show maps |
| `react-icons` | সুন্দর আইকন | Beautiful icons |

---

## 📄 FILE 2: `vite.config.js` — বিল্ড টুলের সেটিং | Build Tool Settings

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

**বাংলায় ব্যাখ্যা:**
Vite হলো একটি অত্যন্ত দ্রুত টুল যা আমাদের JSX কোডকে ব্রাউজার বোঝার মতো সাধারণ JavaScript এ রূপান্তর করে। এই ফাইলটি Vite কে বলে যে "তুমি React প্রজেক্টের জন্য কাজ করবে"।

**English Explanation:**
Browsers cannot directly understand JSX (the HTML-like syntax in React). Vite is the "translator" that converts our modern JSX code into plain JavaScript + HTML that any browser can run. This tiny config file tells Vite to use the React plugin.

---

## 📄 FILE 3: `index.html` — সবকিছুর শুরু | The One True Starting Point

```html
<!doctype html>
<html lang="en">
  <head>
    <title>VisitBD — Discover the Beauty of Bangladesh</title>
    <meta name="description" content="Explore Bangladesh's most breathtaking destinations..." />
    <!-- Google Fonts: Poppins, Inter, Hind Siliguri -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins..." rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>  <!-- ← এখানেই পুরো React অ্যাপ লোড হবে -->
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

**বাংলায় ব্যাখ্যা:**
এটি একটি ফাঁকা বাড়ির মতো। বাড়িতে মাত্র একটি ঘর আছে: `<div id="root">` — এই একটি `div` এর ভেতরেই আমাদের পুরো ওয়েবসাইট (শত শত কম্পোনেন্ট) লোড হয়। নিচের `<script>` ট্যাগ React কে চালু করে।

**বিশেষ বিষয়গুলো:**
- **SEO Meta Tags:** `<meta name="description">` — Google এ সার্চ করলে এই লেখাটি নিচে দেখায়
- **Open Graph Tags:** Facebook/Twitter তে শেয়ার করলে সুন্দর প্রিভিউ দেখায়
- **Google Fonts:** Poppins (হেডিং), Inter (সাধারণ লেখা), Hind Siliguri (বাংলা টেক্সট)

**English Explanation:**
`index.html` is the single HTML file in the whole project. It has only one job: provide an empty `<div id="root">` where React will inject the entire application. Everything the user sees is dynamically rendered inside that one div by JavaScript.

---

## 📄 FILE 4: `src/main.jsx` — React এর ইঞ্জিন চালু করা | Turning on the Engine

```javascript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap এর ডিজাইন
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Bootstrap এর ইন্টারেকশন
import 'leaflet/dist/leaflet.css'; // ম্যাপের ডিজাইন
import './index.css'; // আমাদের নিজের কাস্টম ডিজাইন
import App from './App.jsx'; // মূল অ্যাপ

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

**বাংলায় লাইন-বাই-লাইন:**
1. `createRoot(document.getElementById('root'))` — HTML থেকে `<div id="root">` খুঁজে বের করো
2. `.render(<App />)` — সেখানে আমাদের পুরো `App` কম্পোনেন্টটি আঁকো (রেন্ডার করো)
3. `<StrictMode>` — ডেভেলপমেন্টের সময় ভুল-ত্রুটি ধরার জন্য একটি extra layer
4. CSS imports — এগুলো সব পেজে সব সময় কাজ করে (Global styles)

**English Line-by-Line:**
1. Find the empty `div#root` in `index.html`
2. Inject (render) the entire `<App />` component tree inside it
3. `StrictMode` is like a strict teacher who warns about potential bugs during development — it has no effect on the final website users see
4. CSS imports here apply globally to EVERY page of the site

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PART 2 — THE BRAIN: App.jsx (কেন্দ্র)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📄 FILE 5: `src/App.jsx` — ট্রাফিক পুলিশ | The Traffic Controller

এটি পুরো অ্যাপের সবচেয়ে গুরুত্বপূর্ণ ফাইল।
This is the most important file in the whole app.

```javascript
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [pathname]);
  return null;
}
```
**বাংলায়:** যখনই নতুন পেজে যাওয়া হয়, পেজটি স্বয়ংক্রিয়ভাবে উপরে স্ক্রল করে।
**English:** Every time the URL changes, the page automatically scrolls back to the top.

```javascript
function Layout({ children }) {
  return (
    <>
      <Navbar />         {/* উপরের নেভিগেশন বার */}
      <main>{children}</main>  {/* পেজের মূল বিষয়বস্তু */}
      <Footer />         {/* নিচের ফুটার */}
      <BTBWidget />      {/* নিচে বাম দিকের ভাসমান উইজেট */}
    </>
  );
}
```
**বাংলায়:** `Layout` হলো একটি ছাঁচ। বেশিরভাগ পেজে Navbar + Page Content + Footer + BTBWidget থাকে। এই ছাঁচটি বারবার কোড লেখার ঝামেলা বাঁচায়।
**English:** `Layout` is a wrapper/template. Instead of adding Navbar and Footer to every single page, they are placed here once, and every page content goes in the `children` slot.

```javascript
function App() {
  return (
    <BrowserRouter>          {/* URL পড়ার ক্ষমতা দেয় */}
      <AuthProvider>         {/* লগইন তথ্য সারা অ্যাপে শেয়ার করে */}
        <BookingProvider>    {/* উইশলিস্ট তথ্য সারা অ্যাপে শেয়ার করে */}
          <ScrollToTop />
          <Routes>
            {/* পাবলিক রুট — যেকেউ দেখতে পারবে */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/destinations" element={<Layout><Destinations /></Layout>} />
            <Route path="/destinations/:id" element={<Layout><DestinationDetail /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />

            {/* অথ রুট — লেআউট ছাড়া (fullscreen login/register) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* প্রোটেক্টেড রুট — লগইন না থাকলে দেখা যাবে না */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <Layout><AdminPanel /></Layout>
              </ProtectedRoute>
            } />

            {/* ৪০৪ — কোনো পেজ না পেলে */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BookingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

**রাউটিং বোঝার সহজ উপায় | Easy Way to Understand Routing:**

| URL টাইপ করলে | কোন কম্পোনেন্ট দেখায় |
|---|---|
| `/` | Home.jsx |
| `/destinations` | Destinations.jsx |
| `/destinations/5` | DestinationDetail.jsx (id=5) |
| `/login` | Login.jsx (লেআউট ছাড়া) |
| `/dashboard` | Dashboard.jsx (লগইন না থাকলে → Login) |
| `/admin` | AdminPanel.jsx (লগইন না থাকলে → Login) |
| `/kichuneynei` | NotFound.jsx (404 পেজ) |

> [!NOTE]
> `<BrowserRouter>` হলো React Router এর বাক্সের মতো। এটি URL দেখে সিদ্ধান্ত নেয় কোন পেজ দেখাবে। এর ভেতর না থাকলে `<Link>` বা `<Route>` কাজ করবে না।
> `<BrowserRouter>` is the container that gives the app URL-awareness. Without it, navigation would not work.

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PART 3 — THE DESIGN SYSTEM (ডিজাইন)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📄 FILE 6: `src/index.css` — পুরো অ্যাপের মাস্টার ডিজাইন | Master Design File

```css
@import './styles/theme.css'; /* রঙ, ফন্ট, ভেরিয়েবল */

body {
  font-family: var(--font-body);
  background-color: var(--dark);  /* গাঢ় ব্যাকগ্রাউন্ড */
  color: var(--text-primary);
}
```

**বাংলায়:** এখানে `var(--dark)` মানে একটি CSS ভেরিয়েবল বা চলরাশি। `theme.css` ফাইলে এই রঙগুলো এক জায়গায় সংরক্ষিত আছে। ফলে রঙ পরিবর্তন করতে হলে সব জায়গায় না গিয়ে শুধু `theme.css` এ একবার করলেই হয়।

**English:** `var(--dark)` is a CSS custom property (variable). Instead of typing the same color code `#0D1B2A` everywhere, it's defined once in `theme.css` and reused. This is called **DRY (Don't Repeat Yourself)** — a fundamental principle in programming.

**এই ফাইলের কাজ | What this file does:**
- সব `<a>` ট্যাগ থেকে underline সরিয়ে দেয়
- scrollbar কে সবুজ রঙ করে
- Bootstrap এর ডিফল্ট রঙ override করে (dark theme বানায়)
- `form-control`, `dropdown-menu` ইত্যাদির dark version তৈরি করে

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PART 4 — COMPONENTS (কম্পোনেন্ট)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

> [!NOTE]
> **কম্পোনেন্ট কী? | What is a Component?**
> কম্পোনেন্ট হলো LEGO-র টুকরার মতো। একটি বড় ওয়েবসাইট অনেক ছোট ছোট LEGO-টুকরা দিয়ে তৈরি। প্রতিটি টুকরা আলাদাভাবে কাজ করে এবং বারবার ব্যবহার করা যায়।
> A Component is like a LEGO brick. A big website is made of many small reusable bricks. Each brick works independently.

---

## 🧩 COMPONENT 1: `Navbar.jsx` — উপরের নেভিগেশন বার

**এটি কী করে | What it does:**
- সবসময় পেজের উপরে fixed থাকে (স্ক্রল করলেও সরে না)
- স্ক্রল করলে ব্যাকগ্রাউন্ড আরও গাঢ় হয় (glass effect)
- মোবাইলে hamburger মেনু (☰) দেখায়
- লগইন থাকলে: প্রোফাইল ছবি ও dropdown দেখায়
- লগইন না থাকলে: Login ও Sign Up বাটন দেখায়

**গুরুত্বপূর্ণ কোড | Key Code:**
```javascript
const { user, isAuthenticated, logout } = useAuth(); // লগইন তথ্য
const { wishlistCount } = useBooking(); // উইশলিস্টে কয়টি আছে

// স্ক্রল ডিটেক্ট করা
useEffect(() => {
  const onScroll = () => setScrolled(window.scrollY > 50); // 50px স্ক্রল হলে
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll); // cleanup
}, []);
```

**বাংলায় `useEffect` ব্যাখ্যা:**
`useEffect` হলো একটি বিশেষ React হুক। এটি বলে "যখন কম্পোনেন্ট পেজে লোড হবে, তখন এই কাজটি করো।" এখানে এটি একটি scroll listener যোগ করে। `return` এর ভেতরে cleanup function আছে — কম্পোনেন্ট বন্ধ হলে listener সরিয়ে দেয়।

**English `useEffect` Explanation:**
`useEffect` runs code AFTER the component appears on the screen. Here it adds an event listener for scrolling. The `return` function is a cleanup — it removes the listener when Navbar is removed from the DOM to prevent memory leaks.

---

## 🧩 COMPONENT 2: `Footer.jsx` — পেজের নিচের অংশ

**এটি কী করে | What it does:**
- বছর স্বয়ংক্রিয়ভাবে আপডেট হয়: `new Date().getFullYear()`
- চারটি কলাম: Brand, Quick Links, Top Destinations, Contact + Newsletter
- Social media আইকন লিংক
- Email subscribe ইনপুট বক্স

**বিশেষ বিষয় | Special Detail:**
```javascript
const year = new Date().getFullYear(); // 2025, 2026, 2027... স্বয়ংক্রিয়
```
২০২৬ সালে `© 2026` দেখাবে, ২০২৭ সালে `© 2027` দেখাবে — কোনো কোড পরিবর্তন ছাড়াই!

---

## 🧩 COMPONENT 3: `ProtectedRoute.jsx` — সিকিউরিটি গার্ড | Security Guard

```javascript
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth(); // লগইন আছে?
  const location = useLocation(); // এখন কোন পেজে আছি?

  if (!isAuthenticated) {
    // লগইন নেই → Login পেজে পাঠাও, এবং মনে রাখো কোথায় যেতে চেয়েছিলাম
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children; // লগইন আছে → ভেতরে যেতে দাও
}
```

**বাস্তব জীবনের উদাহরণ | Real World Example:**
এটি একটি শপিং মলের সিকিউরিটি গার্ডের মতো। VIP লাউঞ্জে (Dashboard) ঢুকতে চাইলে সে প্রথমে কার্ড (লগইন) দেখতে চায়। কার্ড না থাকলে সে রিসেপশনে (Login পেজে) পাঠিয়ে দেয়।

**It's like a shopping mall security guard:** If you try to enter the VIP lounge (Dashboard) without your card (login), the guard sends you to reception (Login page), while remembering where you wanted to go so you can be redirected after login.

---

## 🧩 COMPONENT 4: `MapView.jsx` — ইন্টারেক্টিভ ম্যাপ | Interactive Map

```javascript
// Vite + Leaflet এর একটি পরিচিত বাগ ঠিক করা হচ্ছে
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://cdnjs.cloudflare.com/.../marker-icon.png',
  ...
});
```
**বাংলায়:** Leaflet লাইব্রেরি Vite এর সাথে সরাসরি ব্যবহার করলে ম্যাপ মার্কার (পিনের ছবি) দেখা যায় না। এই কোডটি সেই বাগ ঠিক করে।

```javascript
const CATEGORY_COLORS = {
  Beach: '#00B4D8',    // সমুদ্র সৈকত → নীল
  Hill: '#4CAF50',     // পাহাড় → সবুজ
  Forest: '#1B5E20',   // বন → গাঢ় সবুজ
  Heritage: '#E8B84B', // ঐতিহ্য → সোনালি
};
```
**বাংলায়:** প্রতিটি ক্যাটাগরির জন্য আলাদা রঙের ম্যাপ পিন আছে। Beach হলে নীল পিন, Hill হলে সবুজ পিন।

**MapView দুটি মোডে কাজ করে | Two Modes:**
1. **একক মোড (Single):** একটি গন্তব্যের পেজে → শুধু সেই জায়গার ম্যাপ দেখায়
2. **বহু মোড (Multi):** Destinations পেজে → সব জায়গা একসাথে ম্যাপে দেখায়, `FitBounds` দিয়ে সব মার্কার স্ক্রিনে আঁটিয়ে দেয়

---

## 🧩 COMPONENT 5: `LoadingSpinner.jsx` — লোডিং চক্র | Loading Circle

```javascript
function LoadingSpinner({ size = 'md', text = 'Loading...', fullPage = false }) {
```
**বাংলায়:** এটি একটি পুনর্ব্যবহারযোগ্য স্পিনার। তিনটি আকার: `sm`, `md`, `lg`। `fullPage={true}` দিলে পুরো পেজ ঢেকে স্পিনার দেখায়।

**Props কী? | What are Props?**
Props (Properties) হলো কম্পোনেন্টে তথ্য পাঠানোর উপায়।
```jsx
<LoadingSpinner size="lg" text="ডাটা লোড হচ্ছে..." fullPage={true} />
```
এভাবে বাইরে থেকে ভেতরে কাস্টম তথ্য পাঠানো যায়।

---

## 🧩 COMPONENT 6: `BTBWidget.jsx` — বাংলাদেশ পর্যটন বোর্ড উইজেট

**এটি কী করে | What it does:**
স্ক্রিনের নিচে বাম দিকে সবসময় ভাসমান (fixed) একটি ছোট বাটন থাকে। ক্লিক করলে Bangladesh Tourism Board এর ঠিকানা, ফোন, ইমেইল, ওয়েবসাইট এবং হটলাইন নম্বর (16302) দেখায়।

```javascript
const [open, setOpen] = useState(false); // বন্ধ/খোলা অবস্থা মনে রাখা

<button onClick={() => setOpen(p => !p)}> {/* ক্লিক করলে উল্টো করো */}
```

**`useState` কী? | What is useState?**
`useState` হলো React এর মেমোরি। সাধারণ ভেরিয়েবল রিফ্রেশ হলে মুছে যায়, কিন্তু `useState` দিয়ে রাখা তথ্য মনে থাকে এবং পরিবর্তন হলে UI আপডেট হয়।

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PART 5 — PAGES (পেজ)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📄 PAGE 1: `Home.jsx` — হোম পেজ

**হোম পেজে কী কী আছে | Sections in Home page:**
1. **HeroSlider** — স্লাইড শো ছবি
2. **Stats Bar** — `15+ Destinations`, `50K+ Travelers`, `4.8 Rating`
3. **Featured Destinations** — `featured: true` ট্যাগ করা জায়গাগুলো
4. **Why Choose Us** — ৩টি সুবিধা কার্ড
5. **Testimonials** — ৩ জন পর্যটকের মতামত
6. **CTA Banner** — "Get Started Free" বাটন

**ডাটা কোথা থেকে আসে | Where does data come from:**
```javascript
useEffect(() => {
  fetch('/data/destinations.json')   // JSON ফাইল থেকে ডাটা নিয়ে আসা
    .then(res => res.json())
    .then(data => {
      setDestinations(data.filter(d => d.featured)); // শুধু featured গুলো রাখো
      setLoading(false);
    });
}, []);
```

**বাংলায়:** `useEffect` পেজ লোড হওয়ার পর একবার `fetch` চালায়। `fetch` হলো ডাটা আনার টুল। JSON ফাইল থেকে ডাটা এসে `destinations` state এ জমা হয়, তারপর পেজ আপডেট হয়।

---

## 📄 PAGE 2: `Login.jsx` — লগইন পেজ

**বিশেষ বৈশিষ্ট্য | Special Features:**

1. **Demo credentials banner:**
```javascript
const fillDemo = () => setForm({ email: 'admin@travel.com', password: 'travel123' });
```
"Demo Credentials" এ ক্লিক করলে স্বয়ংক্রিয়ভাবে ইমেইল ও পাসওয়ার্ড পূরণ হয়।

2. **Already logged in check:**
```javascript
if (isAuthenticated) return <Navigate to={from} replace />;
```
লগইন থাকলে সরাসরি Dashboard এ পাঠিয়ে দেয়।

3. **Redirect after login:**
```javascript
const from = location.state?.from?.pathname || '/dashboard';
```
Dashboard যেতে গিয়ে Login এ এসে পড়লে, লগইনের পর সরাসরি Dashboard এ ফিরিয়ে দেয়।

4. **Password toggle:**
```javascript
const [showPw, setShowPw] = useState(false);
<input type={showPw ? 'text' : 'password'} />
```
👁️ আইকনে ক্লিক করলে পাসওয়ার্ড দেখা/লুকানো যায়।

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PART 6 — CONTEXT (কন্টেক্সট — শেয়ার্ড মেমোরি)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

> [!NOTE]
> **Context কেন দরকার? | Why is Context needed?**
>
> সমস্যা: Navbar এ লগইন থাকা ইউজারের নাম দেখাতে হবে। এই তথ্য Navbar পর্যন্ত পাঠাতে হলে: `App → Layout → Navbar`। অনেক পেজে এই পথ অনেক লম্বা হয়। এটাকে বলে "Prop Drilling"।
>
> সমাধান: Context একটি global store এর মতো। যেকোনো কম্পোনেন্ট সরাসরি ডাটা নিতে পারে, মাঝখানের কম্পোনেন্টগুলো দিয়ে পাস করতে হয় না।
>
> Problem: To pass user data from `App` to `Navbar`, we'd have to pass it through every component in between (prop drilling). Context solves this by creating a global data store any component can access directly.

---

## 📄 CONTEXT 1: `AuthContext.jsx` — ইউজার লগইন সিস্টেম

**Demo Users (প্রি-সেট ইউজার):**
```javascript
const DEMO_USERS = [
  { email: 'admin@travel.com', password: 'travel123', role: 'admin' },
  { email: 'rafi@example.com', password: 'password123', role: 'user' },
];
```

**login ফাংশন কীভাবে কাজ করে:**
```javascript
const login = useCallback((email, password) => {
  // 1. ইমেইল ও পাসওয়ার্ড মিলিয়ে দেখো
  const found = DEMO_USERS.find(u => u.email === email && u.password === password);
  
  if (!found) return { success: false, message: 'Invalid email or password.' };
  
  // 2. পাসওয়ার্ড ছাড়া তথ্য সেভ করো (সিকিউরিটি!)
  const { password: _pw, ...safeUser } = found;
  
  // 3. React state এ রাখো
  setUser(safeUser);
  
  // 4. localStorage এ সেভ করো (ব্রাউজার বন্ধ করলেও মনে থাকবে)
  localStorage.setItem(AUTH_KEY, JSON.stringify(safeUser));
  
  return { success: true };
}, []);
```

**বাংলায় Spread Operator ব্যাখ্যা:**
`const { password: _pw, ...safeUser } = found;`
এই লাইনটি `found` অবজেক্ট থেকে `password` বাদ দিয়ে বাকি সব তথ্য `safeUser` এ রাখে। পাসওয়ার্ড কখনো state বা localStorage এ সেভ হয় না।

**Page Refresh এরও মনে থাকে | Persists on Refresh:**
```javascript
const [user, setUser] = useState(() => {
  const saved = localStorage.getItem(AUTH_KEY);
  return saved ? JSON.parse(saved) : null;
});
```
পেজ রিফ্রেশ করলেও লগইন থাকে কারণ `localStorage` থেকে আগের তথ্য পড়ে নেয়।

---

## 📄 CONTEXT 2: `BookingContext.jsx` — উইশলিস্ট ও Recently Viewed

**তিনটি ফিচার | Three Features:**

1. **Wishlist (পছন্দের তালিকা):**
```javascript
const toggleWishlist = (destination) => {
  setWishlist(prev => {
    const exists = prev.some(d => d.id === destination.id);
    if (exists) return prev.filter(d => d.id !== destination.id); // সরিয়ে দাও
    return [...prev, destination]; // যোগ করো
  });
};
```
হার্ট বাটনে ক্লিক করলে জায়গা যুক্ত বা বাদ হয়।

2. **Recently Viewed (সম্প্রতি দেখা):**
```javascript
const addRecentView = (destination) => {
  setRecentlyViewed(prev => {
    const filtered = prev.filter(d => d.id !== destination.id); // পুরানো এন্ট্রি বাদ
    return [destination, ...filtered].slice(0, 6); // সর্বোচ্চ ৬টি রাখো
  });
};
```
সর্বশেষ দেখা ৬টি জায়গা Dashboard এ দেখা যায়।

3. **Compare (তুলনা করো):** সর্বোচ্চ ৩টি জায়গা পাশাপাশি তুলনা করার জন্য।

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PART 7 — HOOKS (হুক)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📄 HOOK: `useLocalStorage.js` — ব্রাউজার মেমোরিতে সহজে সেভ করা

```javascript
function useLocalStorage(key, initialValue) {
  // প্রথমে localStorage থেকে পড়ো, না থাকলে initialValue ব্যবহার করো
  const [storedValue, setStoredValue] = useState(() => {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  const setValue = (value) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore)); // ব্রাউজারে সেভ
  };

  return [storedValue, setValue];
}
```

**কীভাবে ব্যবহার হয় | How it's used:**
```javascript
// BookingContext.jsx এ:
const [wishlist, setWishlist] = useLocalStorage('bd_tourism_wishlist', []);
```
এখন `setWishlist` ডাকলে React state ও localStorage দুটোই একসাথে আপডেট হয়। পেজ বন্ধ করলেও wishlist মনে থাকে।

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PART 8 — SERVICES (সার্ভিস — ডাটা ম্যানেজমেন্ট)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📄 SERVICE: `api.js` — চালাক ডামি ডাটাবেস | The Clever Fake Database

এটি পুরো প্রজেক্টের সবচেয়ে চালাক অংশ।
This is the cleverest part of the whole project.

**তিনটি localStorage "টেবিল" | Three localStorage "tables":**

| Key | কাজ |
|-----|-----|
| `bd_tourism_admin_destinations` | Admin এর যোগ করা নতুন জায়গা |
| `bd_tourism_edited_destinations` | যেকোনো জায়গার পরিবর্তন |
| `bd_tourism_deleted_ids` | মুছে ফেলা জায়গার ID তালিকা |

**ডাটা পড়ার প্রক্রিয়া | Data Reading Process:**
```
JSON ফাইল (মূল ডাটা)
    ↓
deleted IDs বাদ দাও
    ↓
admin edits দিয়ে override করো
    ↓
admin যোগ করা নতুন জায়গা যুক্ত করো
    ↓
চূড়ান্ত ডাটা দেখাও
```

**সব ফাংশন:**
```javascript
fetchDestinations()    // সব জায়গার তালিকা
fetchDestinationById() // একটি জায়গার বিস্তারিত
addDestination()       // নতুন জায়গা যোগ করো (admin)
editDestination()      // জায়গার তথ্য পরিবর্তন করো
deleteDestination()    // জায়গা মুছে দাও
fetchStats()           // পরিসংখ্যান (total, featured, etc.)
```

**কেন আসল ডাটাবেস নেই? | Why no real database?**
এই প্রজেক্টটি একটি ফ্রন্টেন্ড প্রদর্শনী (frontend demo)। আসল ডাটাবেস তৈরি করতে server দরকার। localStorage ব্যবহার করে আমরা সার্ভার ছাড়াই CRUD (Create, Read, Update, Delete) অপারেশন দেখাতে পারছি।

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PART 9 — পুরো সিস্টেম একসাথে | HOW IT ALL WORKS TOGETHER
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ব্যবহারকারীর একটি সম্পূর্ণ যাত্রা | A Complete User Journey

```
1. ব্রাউজার খোলে 👤
   → index.html লোড হয়
   → main.jsx চালু হয়
   → App.jsx রুট ঠিক করে
   → "/" পেজ → Layout + Home দেখায়

2. হোম পেজে 🏠
   → HeroSlider ছবি স্লাইড করে
   → useEffect → fetch('/data/destinations.json')
   → Featured destinations লোড হয়
   → DestinationCard গুলো দেখায়

3. একটি কার্ডে ক্লিক করে 🖱️
   → URL হয় /destinations/3
   → App.jsx → DestinationDetail লোড করে
   → api.fetchDestinationById(3) চালায়
   → MapView ম্যাপে পিন দেখায়
   → BookingContext.addRecentView() → recently viewed এ যোগ

4. হার্ট বাটনে ক্লিক করে ❤️
   → লগইন নেই → ProtectedRoute → /login এ পাঠায়
   → লগইন করে → সরাসরি dashboard এ ফেরে

5. Admin লগইন করে ⚙️
   → AuthContext.login() → role: 'admin' পায়
   → Navbar এ "Admin Panel" লিংক দেখায়
   → /admin → AdminPanel
   → নতুন জায়গা যোগ → api.addDestination() → localStorage এ সেভ
   → Destinations পেজে সাথে সাথে দেখায়!
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PART 10 — গুরুত্বপূর্ণ React ধারণা | KEY REACT CONCEPTS USED
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| React ধারণা | কোথায় ব্যবহার | সহজ ব্যাখ্যা |
|------------|--------------|------------|
| `useState` | সব কম্পোনেন্টে | ডাটা মনে রাখা ও UI আপডেট |
| `useEffect` | Navbar (scroll), Home (fetch) | পেজ লোডের পর কাজ করা |
| `useContext` | Navbar, Login, DestinationCard | Global store থেকে ডাটা নেওয়া |
| `useCallback` | AuthContext functions | ফাংশন cache করে অপচয় রোধ |
| Props | LoadingSpinner, MapView | বাইরে থেকে তথ্য পাঠানো |
| JSX | সব ফাইলে | JavaScript এর মধ্যে HTML লেখা |
| `<Routes>/<Route>` | App.jsx | URL অনুযায়ী পেজ দেখানো |
| `<Link>` | Navbar, Footer | পেজ রিলোড ছাড়া নেভিগেট |

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# প্রেজেন্টেশন টিপস | PRESENTATION TIPS 🎯
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

> [!TIP]
> **Demo করার সেরা ক্রম | Best Demo Order:**
> 1. **হোম পেজ** দেখাও — HeroSlider, Destinations
> 2. **একটি Destination** এ ক্লিক করো — Detail পেজ + Map দেখাও
> 3. **Filter** ব্যবহার করো Destinations পেজে
> 4. **হার্ট বাটন** চাপো → Login এ redirect হওয়া দেখাও
> 5. `admin@travel.com / travel123` দিয়ে **লগইন** করো
> 6. **Admin Panel** এ গিয়ে নতুন destination যোগ করো
> 7. **Home** এ ফিরে এসে নতুন জায়গা দেখাও!
> 8. **Dashboard** এ Recently Viewed দেখাও

> [!NOTE]
> **প্রশ্নের জন্য প্রস্তুত থাকো | Be Ready for Questions:**
> - "ডাটা কোথায় সেভ হয়?" → Browser localStorage এ
> - "Real database নেই কেন?" → এটি frontend demo, server ছাড়াই CRUD দেখানো হচ্ছে
> - "Map কোথা থেকে আসে?" → OpenStreetMap (ফ্রি ও open-source)
> - "Login কি real?" → না, demo users আছে; real app এ Firebase/backend লাগবে

---

*এই ডকুমেন্টটি VisitBD Tourism Website এর সম্পূর্ণ কোডবেস ব্যাখ্যা করে — একজন শিক্ষার্থী থেকে উপস্থাপনকারী সবার জন্য।*
*This document explains the complete VisitBD codebase — for learners, developers, and presenters alike.*
