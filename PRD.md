# 🚌 NAIJA ROUTES - Product Requirements Document
### Nigeria's Road Transport & Logistics Aggregator

**Version:** 1.1 — Updated for Monorepo & Architecture Refactor  
**Status:** Approved — Ready for GitHub  
**Date:** 21 June 2026  
**Owner:** Product & Engineering Team  
**Classification:** Confidential  

---

## 1. Executive Summary

Naija Routes is Nigeria's first end-to-end road transport and logistics aggregator — a platform that unifies hundreds of fragmented bus operators, cargo companies, and informal motor parks into a single, trusted digital marketplace. Travellers search state-to-state routes, compare operators, and book tickets with full digital receipts. Cargo shippers track consignments in real time. Operators gain instant digital presence without upfront IT investment, managed by on-ground agents who onboard and serve them.

This document defines the full product scope: business problems, user personas, feature specifications, technology architecture, project structure, and go-to-market considerations for building and launching Naija Routes.

---

## 2. Business Problems We Must Solve

Nigeria's intercity road transport sector moves over 11 million passengers daily and handles the majority of domestic freight — yet it remains almost entirely offline, unstructured, and opaque. The following critical problems must be solved for Naija Routes to succeed.

### 2.1 The Fragmentation Problem
Nigeria has over 200 registered transport operators and thousands of informal motor parks. There is no single place to discover, compare, or book routes across operators. Travellers must physically visit parks or rely on unreliable word-of-mouth. Operators cannot reach digital customers even when they want to.

*   **Problem:** No unified route discovery.
*   **Who Suffers:** Travellers, new operators.
*   **Business Impact:** Market stays fragmented; price gouging and trust erosion occur due to lack of standardized pricing data.

### 2.2 The Offline Motor Park Problem
The majority of Nigeria's bus operators manage their business entirely offline — tickets are paper, manifests are handwritten, and no digital record exists. This creates ghost passengers, revenue leakage, safety risks, and zero accountability. Bringing these parks online requires a human-mediated agent model, not a self-serve app.
*   No digital ticketing → revenue leakage and no audit trail.
*   Paper manifests → impossible to verify passenger identity or track loads.
*   Zero data → operators cannot make informed business decisions.

### 2.3 The Trust & Safety Problem
Nigerian travellers have deep trust deficits with transport providers — fake tickets, overloaded vehicles, no journey tracking, and no recourse when things go wrong. Building trust is the #1 adoption barrier.
*   Counterfeit tickets are rampant in major motor parks.
*   No live tracking means families cannot monitor loved ones in transit.
*   Cargo goes missing with no documentation or accountability.

### 2.4 The Payment Problem
Nigeria's payment landscape is complex: significant populations remain unbanked or prefer cash; USSD banking is common; card infrastructure is unreliable in rural areas; and POS failures are frequent. A single payment method will exclude large user segments.
*   Cash-only parks cannot issue digital receipts or be aggregated easily.
*   Poor card infrastructure outside Lagos, Abuja, and Port Harcourt.
*   SMEs require invoice-based B2B payment flows for cargo, not consumer checkout.

### 2.5 The Information Asymmetry Problem
Travellers have no reliable information on departure times, seat availability, bus conditions, or operator reputation before arriving at a park. This results in wasted journeys, poor decisions, and repeated bad experiences.

### 2.6 The Multi-Language & Accessibility Problem
Nigeria has over 500 languages and three dominant regional languages: Yoruba, Hausa, and Igbo — alongside Nigerian Pidgin, which is the true lingua franca. English-only products exclude the majority of potential transport users, particularly in the North.

### 2.7 The Logistics & Cargo Problem
Nigeria's SME ecosystem sends and receives physical goods via road daily — but cargo is booked verbally, with no tracking, no insurance, and no digital record. This represents a massive B2B revenue opportunity.

### 2.8 The Operator Business Intelligence Problem
Operators have no data on their own performance — no occupancy rates, no route profitability analysis, no competitor benchmarking. This is why the industry stagnates despite its size.

---

## 3. Product Vision & Objectives

### 3.1 Vision Statement
> "To be the operating system of Nigerian road mobility — connecting every traveller, operator, park agent, and cargo shipper through one trusted, intelligent platform."

### 3.2 Strategic Objectives (12-Month Targets)
*   **O1: Aggregate supply at scale:** 500+ operators onboarded; 1,000+ active routes.
*   **O2: Build traveller trust:** 4.2+ average rating; <2% disputed bookings.
*   **O3: Monetise transactions:** ₦500M Gross Merchandise Value (GMV) in Year 1.
*   **O4: Enable hybrid payments:** Cash, card, transfer, USSD, and wallet live by Month 3.
*   **O5: Launch cargo vertical:** 100+ SME cargo clients; 50,000 waybills issued in Year 1.
*   **O6: Agent network scale:** 200 trained agents across 12 states by Month 6.

---

## 4. User Personas

*   **Urban Traveller (Emeka, Lagos):** 25–40, smartphone user, travels monthly state-to-state. Needs to search routes, compare, pay online, get QR tickets, and track the bus.
*   **Rural Traveller (Fatima, Kano):** 30–55, feature phone or basic Android, lower literacy. Needs USSD booking, agent-assisted purchase, and Hausa language UI.
*   **Cargo Shipper (Chukwuemeka, Onitsha):** 35–55, SME owner sending goods. Needs digital waybills, live tracking, insurance options, and B2B invoicing.
*   **Transport Operator (Alhaji Musa, Abuja):** 45–65, owns 5–20 buses. Needs a simple dashboard, automated manifest exports, and weekly payout reports.
*   **Park Agent (Tunde, Ibadan):** 20–35, local to motor park. Needs a mobile-first agent app with QR scanning, walk-up cash sales, and reconciliation tools.
*   **Corporate Client (Zenith Bank logistics team):** Needs corporate accounts, travel policy enforcement, bulk booking, and consolidated invoicing.

---

## 5. Feature Specifications

### 5.1 Core Feature Modules

| Feature Module | Description | Priority | Phase |
|---|---|---|---|
| **Route Search Engine** | Multi-operator search by origin/destination/date. Returns ranked results by price, time, and rating. | P0 | Phase 1 MVP |
| **Digital Booking & QR Tickets** | End-to-end booking flow with seat selection. Generates QR-coded digital ticket & PDF receipts. | P0 | Phase 1 MVP |
| **Hybrid Payment Gateway** | Card (Paystack/Flutterwave), bank transfers, USSD, mobile wallets, and cash-via-agent. | P0 | Phase 1 MVP |
| **Agent App** | Mobile-first PWA for park agents. Walk-up sales, QR code ticket scanning, and cash reconciliation. | P0 | Phase 1 MVP |
| **Operator Dashboard** | Web portal for transport operators: route, schedule, fleet management, and manifests. | P1 | Phase 1 MVP |
| **Live Bus Tracking** | GPS device integration on buses. Passenger-facing map with ETA. Family sharing link. | P1 | Phase 2 |
| **Cargo Module** | Cargo booking with itemized waybills, dimension input, pricing calculator, and tracking. | P1 | Phase 2 |
| **Multi-Language Support** | Full UI in English, Yoruba, Hausa, Igbo, and Nigerian Pidgin. | P1 | Phase 2 |
| **Ratings & Reviews** | Post-journey rating for operator, driver, vehicle condition, and punctuality. | P1 | Phase 2 |
| **Corporate Accounts** | Multi-user accounts with policy enforcement, bulk booking, and consolidated invoicing. | P2 | Phase 3 |
| **USSD Interface** | Full booking and ticket lookup via USSD code for feature phone users. | P2 | Phase 3 |
| **Insurance Integration** | Optional travel insurance upsell at checkout (AXA Mansard / Leadway partnership). | P2 | Phase 3 |
| **Demand Forecasting (AI)** | ML-powered occupancy forecasting and dynamic pricing recommendations. | P3 | Phase 4 |
| **Super App Layer** | Hotel booking, food/drinks at parks, and loyalty programs. | P3 | Phase 4 |

### 5.2 Non-Functional Requirements
*   **Performance:** Search results < 1.5s P95. Page load < 2s on 3G. Ticket generation < 500ms.
*   **Availability:** 99.9% uptime SLA. Graceful degradation to read-only mode during maintenance.
*   **Offline Support:** PWAs with offline ticket display for passengers and offline cash sales for agents.
*   **Security:** PCI-DSS compliance, AES-256 encryption at rest, TLS 1.3 in transit.
*   **Data Residency:** All user data stored on Nigerian infrastructure (AWS Lagos af-south-1).
*   **Accessibility:** WCAG 2.1 AA compliance. Large tap targets for lower-literacy and outdoor usage.

---

## 6. Technology Architecture Overview

The system architecture is structured to support mobile-readiness, offline reliability, low bandwidth, and integrations with local providers.

```
+---------------------------------------------------------------------------------+
|                                 SYSTEM LAYERS                                   |
+---------------------------------------------------------------------------------+
|  Applications      |  Web Platform (PWA), Agent PWA, Operator Portal, Admin    |
+--------------------+------------------------------------------------------------+
|  Core Services     |  Auth, Search, Booking, Payments, Tickets, Cargo, Reviews  |
+--------------------+------------------------------------------------------------+
|  Data Layer        |  PostgreSQL (Supabase), Redis (Upstash Cache), Typesense   |
+--------------------+------------------------------------------------------------+
|  Support Services  |  FastAPI ML Service, Node.js USSD Service                  |
+--------------------+------------------------------------------------------------+
|  Integrations      |  Paystack, Flutterwave, Termii SMS, Resend Email, NIBSS    |
+---------------------------------------------------------------------------------+
```

### 6.1 Core Frontend Technologies (Web Apps)
*   **Languages:** HTML5 + CSS3 + Vanilla JS (ES2022+). Enables zero framework overhead for low-end devices.
*   **Build Tool:** Vite 5. Replaces Webpack with native ES Modules and fast compilation.
*   **CSS Architecture:** CSS Custom Properties + BEM. Standardized design tokens.
*   **Maps & Tracking:** Leaflet.js + OpenStreetMap tiles. Light and cached for offline use.
*   **QR Scanner:** `html5-qrcode` library for browser camera scanner integration.
*   **Offline Sync:** IndexedDB (local browser queue) + Service Worker (Workbox).

### 6.2 Core Backend Technologies
*   **Runtime:** Node.js 20 LTS.
*   **API Framework:** Express.js 5.
*   **Primary Database:** PostgreSQL 16 (Supabase) with Row Level Security (RLS).
*   **Search Engine:** Typesense (self-hosted) for fast, typo-tolerant route searches.
*   **Cache & Locks:** Redis (Upstash) for session state and 10-minute seat locks.
*   **Task Queue:** BullMQ (Redis-backed) for asynchronous PDF generation and SMS dispatch.
*   **Real-time:** Socket.io for GPS streaming.

---

## 7. Monorepo Architecture

Naija Routes uses a **Turborepo-based monorepo** with **pnpm workspaces** to allow shared packages, independent application deployments, and unified tooling.

### 7.1 Workspace Overview

```text
naija-routes/
├── apps/
│   ├── web/               # Traveller PWA Website ("Deep Roots" theme)
│   ├── agent/             # Park Agent App PWA ("Field Terminal" theme)
│   ├── operator/          # Operator Dashboard ("Command Centre" theme)
│   ├── admin/             # Platform Admin Dashboard ("Mission Control" theme)
│   └── mobile/            # [Reserved] React Native + Expo app (Phase 3)
│
├── services/
│   ├── api/               # Express.js REST API Server
│   ├── ml-service/        # Python/FastAPI AI forecasting service
│   └── ussd-service/      # Node.js USSD gateway handler
│
├── packages/
│   ├── shared/            # Common constants, validators, and locales
│   ├── ui/                # Core design system components & styles
│   └── config/            # Monorepo configs (ESLint, Prettier, test runners)
│
├── infrastructure/        # Terraform configurations, Dockerfiles, Nginx proxy
├── scripts/               # Migration and database seeding utilities
├── docs/                  # API specifications (OpenAPI) and guides
└── .github/               # GitHub Actions CI/CD workflows
```

### 7.2 Team Ownership
*   **Frontend Team:** Web Platform, Agent Platform, Operator Dashboard, Admin UI.
*   **Mobile Team:** React Native Mobile App (Phase 3).
*   **Backend Team:** API Platform, USSD Service.
*   **Data Team:** ML Service (FastAPI forecasting and pricing).
*   **DevOps Team:** Infrastructure (AWS af-south-1, Cloudflare, Terraform, CI/CD).

### 7.3 Dependency Flow Diagram
```
Shared Packages (packages/shared, packages/ui, packages/config)
      │
      ▼
Applications Layer (apps/web, apps/agent, apps/operator, apps/admin)
      │
      ▼
API Services Layer (services/api)
      │
      ▼
Data & Storage (Supabase PostgreSQL, Upstash Redis, Typesense)
      │
      ▼
Support Services (services/ml-service, services/ussd-service)
```

---

## 8. Core Data Models (PostgreSQL Schema)

All tables utilize soft-delete (`deleted_at`) columns and Row Level Security.

*   `users`: `id`, `phone`, `email`, `full_name`, `lang_pref`, `role` (traveller | agent | operator | admin).
*   `operators`: `id`, `name`, `registration_no`, `nin_verified`, `rating_avg`, `states_served[]`, `bank_account`.
*   `routes`: `id`, `operator_id`, `origin`, `destination`, `origin_state`, `dest_state`, `distance_km`, `duration_hrs`.
*   `schedules`: `id`, `route_id`, `departure_time`, `days_of_week[]`, `base_price_kobo`, `vehicle_id`, `seats_total`.
*   `bookings`: `id`, `user_id`, `schedule_id`, `seat_no`, `status` (pending | confirmed | cancelled | completed), `payment_ref`.
*   `tickets`: `id`, `booking_id`, `qr_code_hash`, `pdf_url`, `issued_at`, `scanned_at`, `scanned_by_agent_id`.
*   `payments`: `id`, `booking_id`, `amount_kobo`, `method` (card | transfer | ussd | cash | wallet), `provider_ref`, `status`.
*   `vehicles`: `id`, `operator_id`, `plate_no`, `type` (bus | minibus | coaster), `seats`, `gps_device_id`.
*   `tracking_events`: `id`, `vehicle_id`, `lat`, `lng`, `speed_kmh`, `timestamp`, `event_type`.
*   `cargo_bookings`: `id`, `shipper_id`, `operator_id`, `origin`, `destination`, `weight_kg`, `description`, `waybill_no`, `status`.
*   `agents`: `id`, `user_id`, `park_id`, `commission_rate`, `cash_balance_kobo`, `status`.
*   `reviews`: `id`, `user_id`, `booking_id`, `operator_rating`, `driver_rating`, `vehicle_rating`, `punctuality_rating`, `body`.

---

## 9. API Design Principles & Key Endpoints

REST API endpoints are versioned under `/api/v1/`. Authentication uses Bearer JWT tokens.

*   `POST /api/v1/auth/otp/send` — Request verification OTP.
*   `POST /api/v1/auth/otp/verify` — Validate OTP and return JWT session.
*   `GET /api/v1/routes/search` — Fuzzy, sorted search for intercity routes.
*   `GET /api/v1/schedules/:id/seats` — Fetch layout and locked/reserved seats.
*   `POST /api/v1/bookings` — Request seat booking (starts 10-minute Redis lock).
*   `POST /api/v1/bookings/:id/pay` — Trigger Paystack checkout transaction.
*   `POST /api/v1/webhooks/paystack` — Asynchronous verification of card/transfer payouts.
*   `GET /api/v1/tickets/:id` — Retreive ticket detail & QR data.
*   `POST /api/v1/tickets/:qr_hash/scan` — Agent checks and records passenger boarding.
*   `POST /api/v1/agents/reconcile` — End-of-day agent cash tally & remittance.

---

## 10. Phased Delivery Roadmap

### Phase 0: Foundation
*   **Timeline:** Weeks 1–4
*   **Deliverables:** Turborepo monorepo configuration, initial design system tokens schema (`css/tokens.css`), Supabase/PostgreSQL schema migration, authentication service skeleton.
*   **Success Criteria:** Developer environments configured, schema deployed to staging Supabase, CI/CD action configured for build check.

### Phase 1: MVP Launch
*   **Timeline:** Weeks 5–16
*   **Deliverables:** Traveller Web App (Search, seat maps, checkout), Paystack payment integration, custom webhook signature verification, SMS confirmations (Termii), offline-capable Park Agent PWA (walk-up sales, QR code boarding scanner via browser, daily cash reconciliation), Operator Dashboard (revenue KPI widgets, routes, schedule management, manifest exports).
*   **Success Criteria:** 500 bookings in first 30 days; 20 operators live; agent Net Promoter Score (NPS) > 70.

### Phase 2: Core Growth
*   **Timeline:** Weeks 17–28
*   **Deliverables:** Live GPS tracking on bus routes, cargo shipment booking & digital waybills, multi-language support (Yoruba, Hausa, Igbo, Pidgin), ratings/reviews system, USSD booking fallback, operator web dashboard analytics.
*   **Success Criteria:** 5,000 monthly bookings; 4.0+ average operator rating; cargo GMV of ₦5M/month.

### Phase 3: Scale
*   **Timeline:** Weeks 29–44
*   **Deliverables:** Corporate business accounts with travel policies, travel insurance checkout integration, WhatsApp automated booking bot, mobile push notifications, auto-scaling deployment.
*   **Success Criteria:** 50,000 monthly bookings; 12 states active.

### Phase 4: Super App
*   **Timeline:** Weeks 45+
*   **Deliverables:** ML demand forecasting and dynamic pricing, booking of park amenities, dynamic route intelligence.
*   **Success Criteria:** Market leadership; profitable unit economics.

---

## 11. Success Metrics & KPIs
*   **North Star Metric:** Confirmed Bookings Per Month (CBPM).
*   **Operations Metrics:** Operator onboarding time < 24 hrs by Month 12.
*   **Payment Quality:** Successful payment checkout transaction rate > 95%.
*   **Customer Retention:** 30-day user retention > 45%.
