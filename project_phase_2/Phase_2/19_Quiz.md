# 19 — Quiz: Live Bus Tracking
**Naija Routes · Instructor-Led Project · Phase 2**

---

### Question 1
What database table stores GPS tracking events?

- a) `gps_pings`
- b) `tracking_events` ✓
- c) `vehicle_locations`
- d) `gps_logs`

---

### Question 2
How is the tracking data partitioned in the database?

- a) By vehicle ID
- b) By operator
- c) By month ✓
- d) By GPS device

---

### Question 3
True or False: The current tracking feature uses real GPS data from Teltonika trackers.

**Answer:** False. It uses mock/interpolated data. Real GPS integration comes in Phase 3.

---

### Question 4
Which endpoint returns all vehicles for a specific operator?

- a) `GET /api/v1/tracking/vehicle/:id`
- b) `GET /api/v1/tracking/fleet/:operatorId` ✓
- c) `GET /api/v1/tracking/operator/:id`
- d) `GET /api/v1/operators/:id/fleet`

---

### Question 5
What map library does the tracking page use?

- a) Google Maps API
- b) Mapbox GL JS
- c) Leaflet.js ✓
- d) OpenLayers

---

### Question 6
True or False: The traveller tracking page requires an API key to display the map.

**Answer:** False. Leaflet.js uses OpenStreetMap tiles which are free and require no API key.

---

### Question 7
What does the `interpolate()` function in the tracking service do?

- a) Calculates the distance between two cities
- b) Estimates vehicle position between origin and destination based on time ✓
- c) Converts GPS coordinates to human-readable addresses
- d) Calculates fuel consumption based on speed

---

### Question 8
How often does the traveller tracking page refresh the vehicle location?

- a) Every 5 seconds
- b) Every 10 seconds ✓
- c) Every 30 seconds
- d) Every 60 seconds

---

### Question 9
True or False: The same Leaflet.js library powers both the single-vehicle traveller view and the multi-vehicle operator fleet view.

**Answer:** True. Both pages use Leaflet with the same tile layer. The difference is only in how many markers are displayed.

---

### Question 10
What 5 vehicle statuses are supported by the tracking system?

Fill in the blanks: `______`, `______`, `______`, `______`, `______`

**Answer:** `moving`, `stopped`, `arrived`, `departed`, `offline`

---

### Question 11
Which nav link was updated from `href="#"` to `href="tracking.html"` across all web app pages?

- a) Routes
- b) Cargo
- c) Track Bus ✓
- d) Help

---

### Question 12
What is the purpose of the `VEHICLE_MAP` object in `tracking.html`?

- a) To store vehicle colors
- b) To map booking references and plate numbers to vehicle IDs ✓
- c) To cache vehicle locations locally
- d) To store driver information
