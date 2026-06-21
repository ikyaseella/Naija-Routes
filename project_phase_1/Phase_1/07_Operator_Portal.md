# 07 — Operator Portal
**Naija Routes · Instructor-Led Project · Phase 1 MVP**

---

## The Operator Persona

The bus operators (e.g., GUO, ABC Transport) are the lifeblood of Naija Routes. They provide the supply.

If the Traveller App is the "Storefront", the Operator Portal is the "Back Office". 

Operators care about three things:
1. **Money:** How much did we make today?
2. **Occupancy:** Are buses running empty?
3. **Control:** Can we change the schedule or pause a route?

### The UI Theme: "Command Centre" (Design 1)
Operators use this app on laptops and tablets in bright offices. We use the **Design 1 "Command Centre"** theme.

> 🎨 **Open the reference:** `dashboards/ui_operator_design1.html` — this is your canonical visual reference for the operator dashboard.

**Design 1 — "Command Centre" Attributes:**
- **Layout:** Dark Sidebar (`#0F172A`) + Light Content Area (`#F8FAFC`).
- **Typography:** `Plus Jakarta Sans` (clean, modern, highly legible at small sizes).
- **Style:** Clean white cards with subtle borders, highly data-dense tables.
- **Data Accents:** Green (`#16A34A`) for positive metrics, Red (`#DC2626`) for alerts, Gold (`#D97706`) for warnings.

---

## Step 1: Create the Operator App Structure

Run this in your terminal:
```powershell
New-Item -ItemType Directory -Path "naija-routes\apps\operator\css" -Force
New-Item -ItemType Directory -Path "naija-routes\apps\operator\js" -Force
New-Item -ItemType File -Path "naija-routes\apps\operator\css\operator.css" -Force
New-Item -ItemType File -Path "naija-routes\apps\operator\index.html" -Force
New-Item -ItemType File -Path "naija-routes\apps\operator\routes.html" -Force
New-Item -ItemType File -Path "naija-routes\apps\operator\bookings.html" -Force
New-Item -ItemType File -Path "naija-routes\apps\operator\js\dashboard.js" -Force
New-Item -ItemType File -Path "naija-routes\apps\operator\js\schedule.js" -Force
```

---

## Step 2: The Core Views

### 1. The Dashboard (`index.html`)
The first thing an operator sees. It must provide instant business intelligence.
- **KPI Cards:** Gross Revenue, Tickets Sold, Average Occupancy.
- **The Occupancy Donut Chart:** A visual representation of filled vs. empty seats. We can build this cleanly using CSS `conic-gradient` without needing a heavy charting library.
- **Active Trips List:** A quick list of buses departing today.

### 2. Route Management (`routes.html`)
Operators need to manage their routes (Lagos → Abuja) and the specific schedules (06:30 AM, 12:00 PM) attached to those routes.
- A data table listing all active routes.
- Buttons to "Edit Price", "Pause Route", or "Add Schedule".

### 3. Passenger Manifest (`bookings.html`)
Before a bus leaves, the driver needs the manifest.
- A table listing every passenger on a specific trip.
- Shows their Name, Phone, Next of Kin, and Boarding Status (Pending / Scanned).
- A button to "Export to CSV/PDF".

---

## Step 3: CSS Conic Gradients for Charts

In the dashboard, we want a Donut Chart showing occupancy (e.g. 75% full). 
Instead of importing Chart.js, we can use a CSS trick:

```css
.donut-chart {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  /* 75% Primary color, 25% Grey color */
  background: conic-gradient(
    var(--green) 0% 75%, 
    var(--border) 75% 100%
  );
  
  /* Create the hole in the middle */
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.donut-hole {
  width: 110px;
  height: 110px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 24px;
}
```

```html
<div class="donut-chart" style="background: conic-gradient(#16A34A 0% 75%, #E2E8F0 75% 100%)">
  <div class="donut-hole">75%</div>
</div>
```

This is lightweight and perfect for our MVP.

---

## Next Steps
Now that we have covered the requirements, let's write the HTML/CSS/JS for the Operator Portal.

**Checkpoint:** Ensure you understand the distinction between a `Route` (Lagos to Abuja) and a `Schedule` (The 6:30 AM bus on that route). This distinction is critical for the database schema.
