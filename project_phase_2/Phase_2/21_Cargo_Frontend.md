# 21 — Cargo: Agent, Web & Operator Frontends
**Naija Routes · Instructor-Led Project · Phase 2**

---

## 1. Three Frontends for Cargo

The cargo feature has 3 frontend pages, each serving a different user:

| Page | App | URL | Who Uses It |
|---|---|---|---|
| `cargo.html` | Agent | `/cargo.html` | Park agents logging shipments |
| `cargo.html` | Web (Traveller) | `/cargo.html` | Passengers booking cargo + tracking waybills |
| `cargo.html` | Operator | `/cargo.html` | Operators managing cargo bookings |

---

## 2. Agent Cargo Page (`apps/agent/cargo.html`)

The agent's "Log Cargo" page is a single-purpose form for creating waybills at the motor park.

### Layout

```
┌────────────────────────────────┐
│ ← Back                         │
│ Log a Cargo Shipment           │
│                                │
│ Shipper Name  [_____________]  │
│ Shipper Phone [_____________]  │
│ Origin        [__▼ Lagos ___]  │
│ Destination   [__▼ Abuja __]   │
│ Weight (kg)   [___10____]      │
│ Travel Date   [__2026-06-25_]  │
│ Description   [______________] │
│ Recipient Name  [___________]  │
│ Recipient Phone [___________]  │
│ Operator     [__▼ ABC Trans_]  │
│                                │
│ [     Create Waybill      ]    │
└────────────────────────────────┘

After submission:

┌────────────────────────────────┐
│ ✅ Waybill Created              │
│                                │
│    NR-20260625-X7K2            │
│                                │
│ Shipper: Chisom Eze            │
│ Route: Lagos → Abuja           │
│ Date: 2026-06-25               │
│ Weight: 10 kg                  │
│ Item: Box of books             │
│ Recipient: John Doe            │
│ Price: ₦2,000                  │
│ Status: █ Pending              │
│                                │
│ [     Book Another       ]     │
└────────────────────────────────┘
```

### Key Features

1. **Fresh form** — date defaults to tomorrow, shipper fields have sample values for testing
2. **Operator dropdown** — populated with available operators from the service
3. **Waybill receipt** — after submission, shows the waybill number in large text, all details, and a "Book Another" button
4. **Price calculation** — displays the computed price based on weight

### Nav Integration

The "Log Cargo" quick action button on the agent dashboard (`index.html`) now links to `cargo.html` instead of `#`.

---

## 3. Traveller Cargo Page (`apps/web/cargo.html`)

The web cargo page has two tabs: "Book Shipment" and "Track Waybill".

### Tab 1: Book Shipment

A booking form similar to the agent version, styled to match the web app's dark theme (Deep Roots). Includes a shipper section, cargo details, and recipient information.

### Tab 2: Track Waybill

A simple lookup form where anyone can enter a waybill number and see the current status:

```
┌────────────────────────────────┐
│ 🔍 Track Waybill                │
│                                │
│ Waybill Number [_____________] │
│                                │
│ [           Track          ]   │
│                                │
│ ┌────────────────────────────┐ │
│ │  NR-20260625-A7F3          │ │
│ │                            │ │
│ │ Route:   Lagos → Abuja     │ │
│ │ Shipper: Emeka Okonkwo     │ │
│ │ Status:  ● Confirmed       │ │
│ │ Date:    2026-06-25        │ │
│ │ Operator: ABC Transport    │ │
│ └────────────────────────────┘ │
└────────────────────────────────┘
```

### Nav Integration

The "Cargo" link in the top navigation bar now points to `cargo.html` (was previously `#`) on all 5 web pages: `index.html`, `search.html`, `booking.html`, `ticket.html`, `tracking.html`.

---

## 4. Operator Cargo Page (`apps/operator/cargo.html`)

The operator cargo page is a full management dashboard with a table of bookings and status controls.

### Layout

```
┌──────────────────────────────────────────────────┐
│ Cargo Bookings                                   │
│ [Total: 3] [Total Weight: 28.5 kg]               │
│ [Active: 1] [Delivered: 1]                       │
│                                                  │
│ [All Status ▼] [Search....................]      │
│                                                  │
│ ┌──────┬────────┬──────────┬──────┬────────┬────┐│
│ │Waybill│Shipper│ Route   │Weight│Recipient│Act.││
│ ├──────┼────────┼──────────┼──────┼────────┼────┤│
│ │NR-...│Emeka   │Lagos→Abj│15.5kg│Chisom  │ ▼  ││
│ │NR-...│Fatima  │Kano→Los │ 8.0kg│Amina   │ ▼  ││
│ │NR-...│David   │Los→Ibdan│ 5.0kg│Tunde   │ ▼  ││
│ └──────┴────────┴──────────┴──────┴────────┴────┘│
└──────────────────────────────────────────────────┘
```

### Key Features

1. **Summary cards** — total shipments, total weight, active count, delivered count
2. **Status filter dropdown** — filter by any status (all, pending, confirmed, etc.)
3. **Search field** — real-time filtering by waybill, shipper name, or recipient name
4. **Status actions** — each row has a dropdown to change the booking status immediately

### Sidebar Integration

The operator sidebar has a new "📦 Cargo" link in the Routes & Revenue section (between Analytics and Payouts), marked `active` on the cargo page.

---

## 5. i18n Keys

The cargo feature adds ~45 new translation keys across all 5 languages covering:
- Form labels (shipper name, weight, origin, destination, etc.)
- Status filters (pending, confirmed, in_transit, delivered, cancelled)
- Placeholder text
- Summary card labels
- Table headers and action labels

---

> 💡 **Key Insight:** Each of the three cargo pages serves a different purpose with a different UI, but they all use the same backend API. The agent creates bookings, the traveller tracks them, and the operator manages them — a clean separation of concerns.
