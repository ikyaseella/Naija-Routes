# 02 — Traveller Web App
**Naija Routes · Instructor-Led Project · Phase 1 MVP**

---

## The Traveller Experience

The Traveller Web App is the consumer face of Naija Routes. It is built using standard HTML, CSS, and vanilla JavaScript. We are not using a framework like React here because:
1. It keeps the bundle size extremely small for users on 3G networks.
2. It teaches you the core DOM manipulation fundamentals that frameworks hide.

### The UI Theme: "Deep Roots" (Design 1)
We are using the **"Deep Roots"** Design 1 visual language for the consumer app.

> 🎨 **Open the reference:** `dashboards/ui_traveller_design1.html` — this is your canonical visual reference. All styles, spacing, and colours in your Traveller app must match this design.

**Design 1 — "Deep Roots" Colour Palette:**
```css
:root {
  --green-deep:   #0A3D20;   /* Nav background */
  --green-mid:    #1B6B3A;   /* Primary buttons, active states */
  --green-light:  #2E9E57;   /* Hover states */
  --gold:         #D4A017;   /* Gold accent — CTA buttons, highlights */
  --gold-light:   #F0C842;   /* Gold hover */
  --cream:        #FDF8F0;   /* Page background */
  --charcoal:     #1A1A1A;   /* Headings */
  --slate:        #4A5568;   /* Body text, muted labels */
  --mist:         #EDF2EF;   /* Light card backgrounds, dividers */
}
```

**Typography:**
- **Headings:** `Syne` (weight 700–800) — bold, modern display font
- **Body:** `Inter` (weight 300–600) — clean, readable

**Import via Google Fonts:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500;600&display=swap">
```

---

## Responsive Design Strategy

The Traveller App is used primarily on mobile. Design 1 is fully responsive across 3 breakpoints:

```
Desktop (> 1024px) → Full hero + multi-column search grid
Tablet (768–1024px) → 2-column search, 2-column stats
Mobile (< 768px)   → Hamburger nav, stacked search, single column
Small (< 480px)    → Compact mode, single column stats
```

**Hamburger Navigation on Mobile:**
The sticky `<nav>` must hide `.nav-links` and show a hamburger button on mobile. Clicking it slides in a full-height drawer panel:

```javascript
const hamburger = document.getElementById('hamburgerBtn');
const drawer = document.getElementById('mobileDrawer');
const overlay = document.getElementById('drawerOverlay');

hamburger.addEventListener('click', () => {
  drawer.classList.add('open');
  document.body.style.overflow = 'hidden';
});
overlay.addEventListener('click', () => {
  drawer.classList.remove('open');
  document.body.style.overflow = '';
});
```

---

## Step 1: Design Tokens & Base CSS

Instead of hardcoding colours like `color: #1B6B3A` across 50 files, we define them once in `tokens.css` using CSS custom properties (variables).

### 1a. Create the CSS structure

Run this in your terminal to create the CSS folders and files:

```powershell
New-Item -ItemType Directory -Path "naija-routes\apps\web\css" -Force
New-Item -ItemType File -Path "naija-routes\apps\web\css\tokens.css" -Force
New-Item -ItemType File -Path "naija-routes\apps\web\css\base.css" -Force
New-Item -ItemType File -Path "naija-routes\apps\web\css\components.css" -Force
```

### 1b. Add Design Tokens

Open `apps/web/css/tokens.css` and add the **Design 1 "Deep Roots"** variables from the palette above.

Notice how we define a primary colour, then a darker (`-deep`) and lighter (`-light`) version for hover states and backgrounds.

### 1c. Add Base & Components CSS

- `base.css` handles the CSS reset, typography (import Syne + Inter), and standard layout classes.
- `components.css` contains reusable UI pieces like `.btn-primary` (green), `.btn-gold` (gold CTA), `.card`, and `.form-input`.

**Key component patterns from Design 1:**
```css
/* Navigation — sticky, dark green background */
nav {
  background: var(--green-deep);
  height: 64px;
  position: sticky;
  top: 0;
  z-index: 100;
}

/* Search button — solid emerald */
.search-btn {
  background: var(--green-mid);
  color: white;
  border-radius: 10px;
  font-weight: 700;
}

/* Route cards — white with coloured top banner */
.route-card {
  background: white;
  border-radius: 14px;
  border: 1px solid rgba(0,0,0,0.06);
}
.route-card-banner {
  height: 8px;
  background: linear-gradient(90deg, var(--green-mid), var(--gold));
}
```

---

## Step 2: The Landing Page (index.html)

The landing page has one main job: get the user to search for a route.

Create the file:
```powershell
New-Item -ItemType File -Path "naija-routes\apps\web\index.html" -Force
```

### Key Elements of the Landing Page (matching Design 1)

1. **Design Label Banner** (for development only): A dark strip at the top identifying the design.
2. **The Sticky Nav:** Logo + links on desktop, hamburger + drawer on mobile. Background: `var(--green-deep)`.
3. **The Hero Section:** Dark emerald gradient background. Contains:
   - Country badge pill: "🇳🇬 Nigeria's #1 Transport Aggregator"
   - `<h1>` in Syne font: "Every Bus. Every Park. *One Platform.*"
   - Subtext in white at 65% opacity
4. **The Search Widget:** A white card with `border-radius: 16px` and heavy `box-shadow`. Contains:
   - Tab switcher (Bus, Cargo, Corporate)
   - From / Swap / To / Date / Search button grid
5. **Stats Strip:** Dark emerald background, 4 columns (500+, 1,200, 36, 98%).
6. **Popular Routes Grid:** White cards with the gradient top banner.
7. **Digital Ticket Feature:** 2-column split — text on left, ticket mockup on right.
8. **Footer:** Dark emerald with gold brand name.

**How the Search Works:**
When the user clicks "Find Buses", capture the form inputs and navigate to `search.html` with URL parameters.

```javascript
// Inside your search form event listener
const origin = document.getElementById('origin').value;
const destination = document.getElementById('destination').value;
const date = document.getElementById('date').value;

window.location.href = `search.html?origin=${origin}&destination=${destination}&date=${date}`;
```

---

## Step 3: The Search Results Page (search.html)

Create the file:
```powershell
New-Item -ItemType File -Path "naija-routes\apps\web\search.html" -Force
New-Item -ItemType Directory -Path "naija-routes\apps\web\js\modules" -Force
New-Item -ItemType File -Path "naija-routes\apps\web\js\modules\search.js" -Force
```

The search page reads the URL parameters, makes an API call, and displays the results.

### The Layout (Desktop)
- **Left Sidebar:** Filters (Time of day, specific operators, AC/No-AC, max price).
- **Main Area:** A list of operator result cards.

### The Operator Card (Design 1 styling)
Each result card must show:
- Operator Name & Logo/Initials
- Departure Time → Arrival Time (Duration)
- Price (bold in `var(--green-mid)`)
- Rating (e.g. ★ 4.5)
- **Call to action:** "Select Seats" button in `var(--green-mid)` background

### Responsive Adaptation
- On **tablet**: sidebar becomes a horizontal filter bar above results
- On **mobile**: filters collapse into a "Filter" button that opens a bottom sheet

---

## Step 4: The Javascript Architecture

We will organize our JavaScript logically.

Create the core API wrapper:
```powershell
New-Item -ItemType Directory -Path "naija-routes\apps\web\js\core" -Force
New-Item -ItemType File -Path "naija-routes\apps\web\js\core\api.js" -Force
```

### Why an API Wrapper?
Instead of calling `fetch()` randomly across our app, we create a central `apiClient` in `api.js`. This ensures that every request:
1. Has the correct base URL (`/api/v1`)
2. Automatically attaches the JWT token if the user is logged in
3. Handles standard errors (like 401 Unauthorized) in one place

**Example api.js skeleton:**
```javascript
const API_BASE = '/api/v1';

export const apiClient = {
  async get(endpoint) {
    const response = await fetch(`${API_BASE}${endpoint}`);
    if (!response.ok) throw new Error('API request failed');
    return response.json();
  },
  
  async post(endpoint, data) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
}
```

---

## Next Steps
In the next lesson, we will move from search results into the critical **Seat Selection and Booking flow**.

**Checkpoint:** At this stage, you should have `tokens.css`, `base.css`, `components.css`, `index.html`, and `search.html` structured with mock data, and your page should visually match `dashboards/ui_traveller_design1.html`.
