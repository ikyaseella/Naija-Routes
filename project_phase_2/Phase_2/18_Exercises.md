# 18 — Exercises: Live Bus Tracking
**Naija Routes · Instructor-Led Project · Phase 2**

---

### Exercise 1: Add a New Vehicle to the Fleet

Add a 6th vehicle to ABC Transport's fleet: a Toyota Coaster with plate `LAG-999-ZZ` on the Lagos → Port Harcourt route, driven by "Blessing Adeyemi".

**Steps:**
1. Add the vehicle to the `FLEET` object in `tracking.service.js` under `'op-abc'`
2. Make sure `Port Harcourt` exists in the `CITIES` object (it should already)
3. Restart the server and verify the new vehicle appears in `GET /api/v1/tracking/fleet/op-abc`
4. Verify the vehicle appears on the operator fleet tracking page

**Expected Outcome:** A 6th vehicle appears in the fleet list, on the map, and in the API response.

---

### Exercise 2: Track by Booking Reference

The traveller tracking page currently maps booking references to vehicle IDs in a hardcoded object. Add a new reference `NR-Z9Y8X7` that maps to vehicle `veh-003`.

**Steps:**
1. Add `'NR-Z9Y8X7': 'veh-003'` to the `VEHICLE_MAP` in `tracking.html`
2. Also add the plate `ABJ-119-XY` (which already maps to `veh-003`)
3. Test by entering `NR-Z9Y8X7` or `ABJ-119-XY` in the lookup field
4. Verify the bus shows on the map with driver "Suleiman Yusuf" on the Abuja → Kano route

**Expected Outcome:** Both the booking reference and plate number successfully look up the same vehicle.

---

### Exercise 3: Add ETA Calculation

The traveller tracking page shows speed but not estimated arrival time. Add an ETA display.

**Steps:**
1. Add a new info card in `tracking.html` with `id="vEta"` and label with `data-i18n="tracking.eta"` (you'll need to add the key to locale files)
2. In `fetchVehicle()`, calculate ETA based on remaining distance and current speed
3. Use the Haversine formula to calculate distance from current position to destination city
4. Display ETA in minutes (e.g. "Arriving in ~45 min")
5. Handle the case where speed is 0 (show "—")

**Expected Outcome:** The ETA card shows estimated arrival time based on the bus's current speed and distance to destination.

---

### Exercise 4: Add Driver Rating to Operator Fleet Cards

The fleet tracking cards show driver name but not their rating. Add a driver rating display.

**Steps:**
1. Add a `driverRating` field to each vehicle in the `FLEET` object (e.g. `driverRating: 4.5`)
2. Update `getVehicleLocation()` to include the rating in its return object
3. Update `renderFleetList()` to show the rating as stars next to the driver name
4. Create a helper function `renderStars(rating)` if you haven't already

**Expected Outcome:** Each fleet card shows the driver's rating as gold stars next to their name.

---

### Exercise 5: Add a "No Signal" Indicator

When the API is unreachable, the tracking pages silently keep the last known position. Add a visual "no signal" warning.

**Steps:**
1. In `tracking.html` (traveller), add a hidden `<div id="noSignalWarning">` with appropriate message
2. In `fetchVehicle()`, catch the error and show the warning
3. When the next successful fetch happens, hide the warning
4. Style the warning as a yellow/amber banner at the top of the tracking info
5. Use `data-i18n="tracking.no_signal"` (add the key to locale files)

**Expected Outcome:** When the API is down, a "No signal — showing last known position" banner appears. When the API recovers, the banner disappears.

---

### Exercise 6: Add a Map Legend

The operator fleet map uses colored dots but has no legend explaining what each color means.

**Steps:**
1. Add a legend div to the bottom-right of the map (use Leaflet's `Control` API or a custom positioned div)
2. Show 5 color entries: Green = Moving, Amber = Stopped, Blue = Arrived, Cyan = Departed, Red = Offline
3. Use `data-i18n` keys for the status labels (e.g. `tracking.fleet_moving`, `tracking.fleet_stopped`)
4. Position the legend so it doesn't overlap with the vehicle list

**Expected Outcome:** A color legend on the fleet map helps operators understand the status dot colors at a glance.

---

### Exercise 7: Add Real-time Clock to Tracking Page

The traveller tracking page shows last updated time but not the current time. Add a live clock.

**Steps:**
1. Add a clock display in the tracking info section (e.g. next to the speed card)
2. Use `setInterval()` to update the clock every second
3. Format as Nigerian time: `14:30:25 WAT`
4. Use `new Date().toLocaleTimeString('en-NG')`
5. Label it with `data-i18n="tracking.current_time"`

**Expected Outcome:** A live clock shows the current Nigerian time and updates every second.

---

### Exercise 8: Full Audit

Pick one tracking page (traveller or operator) and audit it against these criteria:

**Checklist:**
- [ ] All static labels have `data-i18n` attributes
- [ ] Map loads correctly with OpenStreetMap tiles
- [ ] Markers display with correct status colors
- [ ] All vehicle info cards show correct data from API
- [ ] Auto-refresh works (markers update without page reload)
- [ ] Error state is handled (no crash when API is down)
- [ ] Share link works (copies correct URL)
- [ ] Language switcher works on the tracking page
- [ ] All `tracking.*` keys exist in all 5 locale files
- [ ] Mobile responsive (map + layout adapt to small screens)

**Steps:**
1. Open the tracking page in the browser
2. Test with a valid vehicle (e.g. NR-A7F3K2)
3. Test with an invalid reference (should show appropriate error)
4. Disconnect the backend and verify error handling
5. Switch languages and verify tracking text translates
6. Open on a mobile-sized viewport and check layout

**Expected Outcome:** A complete audit report with any issues found and fixes applied.

---

**Submission:** Submit your modified files as a pull request or ZIP to the instructor portal.
