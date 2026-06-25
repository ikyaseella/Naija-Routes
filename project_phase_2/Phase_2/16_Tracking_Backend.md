# 16 — Live Bus Tracking: Backend API
**Naija Routes · Instructor-Led Project · Phase 2**

---

## 1. What We Are Building

Live Bus Tracking allows travellers to see the real-time location of their booked bus on a map, and operators to monitor their entire fleet from a single dashboard.

The feature has three layers:
1. **Backend API** — serves vehicle locations, fleet status, and tracking history
2. **Traveller page** — a "Track Your Bus" page with an interactive map
3. **Operator page** — a fleet tracking dashboard with all vehicles on one map

The database already has a `tracking_events` table (partitioned by month) and a `gps_device_id` column on `vehicles`. The backend uses mock data for now — real GPS device integration comes in Phase 3.

---

## 2. The Tracking Service

File: `services/api/src/services/tracking.service.js`

The service uses a `FLEET` object that maps operator IDs to their vehicles. Each vehicle has:
- `id` — unique vehicle identifier
- `plate` — number plate (e.g. LSD-481-KA)
- `model` — bus model (Toyota Hiace, Mercedes Sprinter, etc.)
- `route` — array of city codes (e.g. `['lagos', 'abuja']`)
- `driver` — driver name

**City coordinates** are defined in a `CITIES` lookup table with real Nigerian city coordinates:

```javascript
const CITIES = {
  lagos:   { name: 'Lagos',     lat: 6.5244, lng: 3.3792 },
  abuja:   { name: 'Abuja',     lat: 9.0765, lng: 7.3986 },
  ibadan:  { name: 'Ibadan',    lat: 7.3775, lng: 3.9470 },
  kano:    { name: 'Kano',      lat: 12.0022,lng: 8.5920 },
  // ...
};
```

### Methods

| Method | Description |
|---|---|
| `getVehicleLocation(vehicleId)` | Returns current position, speed, status, and route for one vehicle |
| `getOperatorFleet(operatorId)` | Returns all vehicles for an operator with their latest locations + status counts |
| `getTrackingHistory(vehicleId, minutes)` | Returns an array of historical GPS pings for the last N minutes |
| `getAllActiveVehicles()` | Returns locations for all vehicles across all operators |

### Position Interpolation

Since we don't have real GPS data, positions are **interpolated** between the vehicle's origin and destination city based on the current time of day:

```javascript
function interpolate(routeId, progress) {
  const from = CITIES[route[0]];
  const to = CITIES[route[1]];
  return {
    lat: from.lat + (to.lat - from.lat) * progress,
    lng: from.lng + (to.lng - from.lng) * progress,
  };
}
```

The `progress` value cycles from 0 to 1 based on the system clock, so the bus appears to travel back and forth along its route throughout the day.

### Vehicle Statuses

Each vehicle has a status that cycles through 5 states:

| Status | Meaning | Color |
|---|---|---|
| `moving` | Currently in transit | Green (#22C55E) |
| `stopped` | Parked temporarily | Amber (#F59E0B) |
| `arrived` | Reached destination | Blue (#3B82F6) |
| `departed` | Departed from origin | Cyan |
| `offline` | No connection | Red (#EF4444) |

---

## 3. The Tracking Routes

File: `services/api/src/routes/tracking.routes.js`

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/tracking/vehicle/:vehicleId` | Get current location for a single vehicle |
| `GET` | `/api/v1/tracking/vehicle/:vehicleId/history` | Get GPS history (query param: `minutes`, default 30) |
| `GET` | `/api/v1/tracking/fleet/:operatorId` | Get fleet status for an operator |
| `GET` | `/api/v1/tracking/active` | Get all active vehicles across the platform |

**Response example — single vehicle:**
```json
{
  "success": true,
  "data": {
    "vehicleId": "veh-001",
    "plate": "LSD-481-KA",
    "driver": "Chidi Okafor",
    "route": ["Lagos", "Abuja"],
    "lat": 8.56,
    "lng": 6.60,
    "speedKmh": 65,
    "status": "moving",
    "lastUpdated": "2026-06-24T14:30:00Z"
  }
}
```

**Response example — fleet:**
```json
{
  "success": true,
  "data": {
    "fleet": [ /* array of vehicle locations */ ],
    "counts": { "moving": 3, "stopped": 1, "arrived": 1, "departed": 0, "offline": 0 }
  }
}
```

---

## 4. Activation in app.js

The tracking router follows the same Phase 2 pattern as the review router:

```javascript
import trackingRouter from './routes/tracking.routes.js';
// app.use('/api/v1/pay', paymentRouter);
app.use('/api/v1/tracking', trackingRouter);
// app.use('/api/v1/cargo', cargoRouter);
```

The health check also updates:
```javascript
phase: 'Phase 2 — Core Growth (Reviews + Live Tracking)'
```

---

## 5. Testing the API

```bash
# Single vehicle location
curl http://localhost:3000/api/v1/tracking/vehicle/veh-001

# Operator fleet (5 vehicles)
curl http://localhost:3000/api/v1/tracking/fleet/op-abc

# Vehicle history (last 15 minutes)
curl http://localhost:3000/api/v1/tracking/vehicle/veh-001/history?minutes=15

# All active vehicles
curl http://localhost:3000/api/v1/tracking/active
```

---

## 6. Next Phase — Real GPS Integration

In Phase 3, the mock data will be replaced with:
- **Teltonika OBD trackers** sending GPS pings via MQTT/HTTP
- **Real-time ingestion** into the `tracking_events` partitioned table
- **WebSocket connections** pushing location updates to the frontend (instead of polling every 10s)
- **Geofencing** — alerts when a bus enters/exits a terminal

The service layer is designed so that only the method implementations change — the route structure and frontend code stay the same.

---

> 💡 **Key Insight:** The position interpolation creates a convincing "live tracking" experience without any real GPS data. Each bus appears to travel along its route, changing speed and status over time — good enough for UI development and testing.
