# 17 — Live Bus Tracking: Traveller & Operator Pages
**Naija Routes · Instructor-Led Project · Phase 2**

---

## 1. Two Frontends, One Backend

The tracking feature has two frontends:

| Page | App | URL | Who Uses It |
|---|---|---|---|
| `tracking.html` | Traveller Web | `/tracking.html` | Passengers tracking their booked bus |
| `tracking.html` | Operator Portal | `/tracking.html` | Operators monitoring their fleet |

Both use the **same backend API** but display different views of the data.

---

## 2. Traveller Tracking Page (`apps/web/tracking.html`)

### Page Layout

```
┌─────────────────────────────────────┐
│  Track Your Bus                      │
│  Enter booking ref or plate number   │
│  [______________________] [Track]    │
├─────────────────────────────────────┤
│                                     │
│         🗺  Interactive Map          │
│         (Leaflet.js + OSM)          │
│                                     │
├──────────┬──────────┬───────────────┤
│ 65 km/h  │ Moving   │ Chidi Okafor  │
│ Speed    │ Status   │ Driver        │
├──────────┴──────────┴───────────────┤
│ Lagos → Abuja (Route)               │
├─────────────────────────────────────┤
│ Share with family                    │
│ [https://.../tracking.html?vehicle=…]│
└─────────────────────────────────────┘
```

### Key Features

1. **Lookup** — users enter their booking reference or vehicle plate number. A mapping object (`VEHICLE_MAP`) links booking references to vehicle IDs.

2. **Interactive Map** — uses [Leaflet.js](https://leafletjs.com/) with OpenStreetMap tiles. No API key needed.

3. **Auto-refresh** — polls the API every 10 seconds for updated location.

4. **Status-colored marker** — the bus marker changes color based on status:
   - Moving: green
   - Stopped: amber
   - Offline/error: red

5. **Share Link** — generates a shareable URL with `?vehicle=veh-001` param so family members can track the bus too.

6. **Lookup via URL** — `tracking.html?vehicle=veh-001` loads directly, useful for sharing.

### Code Highlights

```javascript
// Vehicle lookup mapping
const VEHICLE_MAP = {
  'NR-A7F3K2': 'veh-001', 'LSD-481-KA': 'veh-001',
  'NR-B8G4H3': 'veh-002', 'GGE-204-BD': 'veh-002',
  // ...
};

// Poll every 10 seconds
refreshInterval = setInterval(() => fetchVehicle(vehicleId), 10000);

// Custom marker with status color
const icon = L.divIcon({
  html: `<div style="width:28px;height:28px;
    background:${iconColor};border:3px solid white;
    border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  className: '',
});
```

### Nav Integration

The "Track Bus" link in the navigation bar now points to `tracking.html` (was previously `#`) on all web pages (`index.html`, `search.html`, `booking.html`, `ticket.html`).

The search results page also has a "📍 Track Bus" link in the amenities section of each result card, allowing users to jump directly to tracking from their search results.

---

## 3. Operator Fleet Tracking Page (`apps/operator/tracking.html`)

### Page Layout

```
┌──────────────────────────────────────────────────┐
│  Fleet Tracking                     [🔄 Refresh] │
│  [Total: 5] [Moving: 3] [Stopped: 1] [Arrived: 1]│
├──────────────────┬───────────────────────────────┤
│  ┌────────────┐  │                               │
│  │ LSD-481-KA ●│  │        🗺 Map View            │
│  │ Chidi Okafor│  │    (all vehicles shown)       │
│  │ Lgs → Abuja │  │                               │
│  │ ⚡ 65 km/h  │  │                               │
│  ├────────────┤  │                               │
│  │ GGE-204-BD ●│  │                               │
│  │ Musa Bello  │  │                               │
│  │ Lgs → Ibdan │  │                               │
│  │ ⚡ 42 km/h  │  │                               │
│  └────────────┘  │                               │
└──────────────────┴───────────────────────────────┘
```

### Key Features

1. **Split layout** — vehicle list on the left (320px), full-size map on the right.

2. **Status chips** — color-coded count badges showing how many vehicles are moving, stopped, arrived, or offline.

3. **Vehicle cards** — each card shows plate number, driver name, route, speed, and a color-coded status dot. Clicking a card centers the map on that vehicle.

4. **All-vehicle map markers** — every fleet vehicle appears on the map with a status-colored dot. Markers have popups showing plate, driver, speed, and status.

5. **Auto-refresh** — polls every 15 seconds. Manual refresh button is also available.

6. **Active card highlight** — the selected vehicle's card is highlighted with a green border and shadow.

### Sidebar Integration

The operator sidebar now has a "📍 Fleet Tracking" link in the Operations section (between Schedules and Drivers), with `active` class on the tracking page.

---

## 4. The Map Library — Leaflet.js

We use [Leaflet.js](https://leafletjs.com/) because:
- **Free** — no API key required
- **Open source** — MIT license
- **Lightweight** — ~40KB gzipped
- **Works offline** — can use cached tiles
- **Simple API** — `L.map()`, `L.marker()`, `L.tileLayer()`

CDN links used:
```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
```

Map tiles come from OpenStreetMap's tile server:
```javascript
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap'
}).addTo(map);
```

---

## 5. i18n Keys

New tracking keys added to all 5 locale files:

| Key | English |
|---|---|
| `tracking.title` | Track Your Bus |
| `tracking.subtitle` | Enter your booking reference or vehicle plate... |
| `tracking.lookup_placeholder` | e.g. NR-A7F3K2 or LSD-481-KA |
| `tracking.track_btn` | Track |
| `tracking.speed` | Speed (km/h) |
| `tracking.status` | Status |
| `tracking.driver` | Driver |
| `tracking.route` | Route |
| `tracking.share_title` | Share with family |
| `tracking.share_desc` | Send this link so your loved ones can track your bus too. |
| `tracking.operator_title` | Fleet Tracking |
| `tracking.refresh` | Refresh |
| `search.track_bus` | Track Bus |

---

> 💡 **Key Insight:** The same Leaflet.js library powers both the traveller single-bus view and the operator fleet view. The difference is just data — one vehicle vs. many. This is a great example of "don't repeat yourself" in frontend architecture.
