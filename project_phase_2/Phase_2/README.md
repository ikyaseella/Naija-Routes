# 🌍 Phase 2 — Core Growth: i18n + Reviews & Ratings
**Naija Routes · Instructor-Led Project · Phase 2**

---

## 🎯 What We Are Building in Phase 2

Phase 2 adds two major features to Naija Routes: **Multi-Language Support** and **Ratings & Reviews**.

Nigeria speaks over 500 languages. But most travel apps are English-only. That means millions of Yoruba, Hausa, Igbo, and Pidgin speakers can't use them comfortably. So first, we make Naija Routes speak **your language**.

Then we add the ability for passengers to **rate their trips** and for operators to **see their reviews** — building trust and accountability across the platform.

| Feature | What It Does | Languages |
|---|---|---|
| 🌍 Multi-Language Support | Full UI translation system | English, Yoruba, Hausa, Igbo, Pidgin |
| 🔄 Language Switcher | Dropdown to change language on the fly | All 4 apps |
| 📐 RTL Support | Right-to-left layout for Hausa (Ajami script) | Hausa |
| ⚙️ i18n Runtime | Loads locale files, detects browser language | Shared package |
| ⭐ Ratings & Reviews | Rate your trip after booking | Backend API + Web + Operator |
| 📍 Live Bus Tracking | Real-time bus location on interactive map | Backend API + Web + Operator |
| 📦 Cargo / Freight | Book cargo shipments, generate waybills, track delivery status | Backend API + Web + Agent + Operator |

By the end of Phase 2, a traveller in Kano can:
1. Open Naija Routes on their phone
2. Switch the UI to **Hausa** (or Yoruba, Igbo, Pidgin)
3. Search Lagos → Abuja entirely in their chosen language
4. Book a seat with labels and buttons in Hausa
5. Receive their ticket in Hausa
6. **Rate their journey** with stars and a written review
7. An operator in Lagos can **view all their reviews** in a dashboard

---

## 📚 Phase 2 Files

### Part A — Multi-Language Support (i18n)

| File | Topic |
|---|---|
| `01_Concepts.md` | What is i18n? Why it matters for Nigeria |
| `02_Locale_Files_and_Runtime.md` | JSON translation files + the I18N.js engine |
| `03_data-i18n_Attributes.md` | Replacing hardcoded text with data attributes |
| `04_Language_Switcher.md` | The dropdown that changes language on every page |
| `05_RTL_and_Hausa_Support.md` | Making the UI work for Hausa (Arabic script) |
| `06_JS_Module_Integration.md` | Using I18N.t() in JavaScript files |
| `07_Translation_Strategy.md` | How we handle 5 languages, emojis, and placeholders |
| `08_Exercises.md` | Practice what you've learned (Part A) |
| `09_Quiz.md` | Test your knowledge (Part A) |
| `10_Instructor_Guide.md` | Teaching notes for the instructor |

### Part B — Ratings & Reviews

| File | Topic |
|---|---|
| `11_Reviews_Backend.md` | Backend API — review routes and service |
| `12_Reviews_Frontend.md` | Rating prompt on the traveller ticket page |
| `13_Reviews_Operator_Portal.md` | Reviews dashboard for operators |
| `14_Exercises.md` | Practice what you've learned (Part B) |
| `15_Quiz.md` | Test your knowledge (Part B) |

### Part C — Live Bus Tracking

| File | Topic |
|---|---|
| `16_Tracking_Backend.md` | Backend API — tracking service, routes, position interpolation |
| `17_Tracking_Frontend.md` | Traveller tracking page + Operator fleet dashboard |
| `18_Exercises.md` | Practice what you've learned (Part C) |
| `19_Quiz.md` | Test your knowledge (Part C) |

### Part D — Cargo / Freight

| File | Topic |
|---|---|
| `20_Cargo_Backend.md` | Backend API — cargo service, waybill generation, status flow |
| `21_Cargo_Frontend.md` | Agent Log Cargo + Web booking/tracking + Operator dashboard |
| `22_Exercises.md` | Practice what you've learned (Part D) |
| `23_Quiz.md` | Test your knowledge (Part D) |

---

## 🔗 Key Files Changed

### Backend
| File | Change |
|---|---|
| `services/api/src/services/review.service.js` | New — mock review CRUD with sample data |
| `services/api/src/routes/review.routes.js` | New — POST + GET review endpoints |
| `services/api/src/app.js` | Activated review router, updated health check |

### Frontend — Traveller Web
| File | Change |
|---|---|
| `apps/web/ticket.html` | Added star rating widget + review form after payment |

### Frontend — Operator Portal
| File | Change |
|---|---|
| `apps/operator/reviews.html` | New — reviews dashboard with summary + review cards |
| `apps/operator/index.html` | Sidebar Reviews link → `reviews.html` |
| `apps/operator/bookings.html` | Sidebar Reviews link → `reviews.html` |
| `apps/operator/routes.html` | Sidebar Reviews link → `reviews.html` |

### Backend — Tracking
| File | Change |
|---|---|
| `services/api/src/services/tracking.service.js` | New — mock GPS service with position interpolation, fleet management |
| `services/api/src/routes/tracking.routes.js` | New — 4 GET endpoints for vehicle/fleet/history/active |
| `services/api/src/app.js` | Activated tracking router, updated health check |

### Frontend — Traveller Web
| File | Change |
|---|---|
| `apps/web/tracking.html` | New — interactive Leaflet map, vehicle lookup, share link |
| `apps/web/search.html` | Added "📍 Track Bus" link to each result card |
| `apps/web/index.html` | Nav "Track Bus" → `tracking.html` |
| `apps/web/search.html` | Nav "Track Bus" → `tracking.html` |
| `apps/web/booking.html` | Nav "Track Bus" → `tracking.html` |
| `apps/web/ticket.html` | Nav "Track Bus" → `tracking.html` |

### Frontend — Operator Portal
| File | Change |
|---|---|
| `apps/operator/tracking.html` | New — fleet dashboard with map + vehicle list + status counts |
| `apps/operator/index.html` | Sidebar added "📍 Fleet Tracking" link |

### Shared i18n
| File | Change |
|---|---|
| `packages/shared/web/i18n/*.json` | Added `"review"` section with 17 keys in all 5 languages |
| `packages/shared/web/i18n/*.json` | Added `"tracking"` section with 17 keys + `search.track_bus` in all 5 languages |
| `packages/shared/web/i18n/*.json` | Added `"cargo"` section with ~45 keys in all 5 languages |

### Backend — Cargo
| File | Change |
|---|---|
| `services/api/src/services/cargo.service.js` | New — mock cargo booking CRUD, waybill generation, pricing |
| `services/api/src/routes/cargo.routes.js` | New — 6 endpoints for create, lookup, list, update status |
| `services/api/src/app.js` | Activated cargo router, updated health check |

### Frontend — Agent App
| File | Change |
|---|---|
| `apps/agent/cargo.html` | New — Log Cargo form with waybill receipt |
| `apps/agent/index.html` | "Log Cargo" quick action → `cargo.html` |

### Frontend — Traveller Web
| File | Change |
|---|---|
| `apps/web/cargo.html` | New — Book shipment + Track waybill tabs |
| `apps/web/index.html` | Nav "Cargo" → `cargo.html` |
| `apps/web/search.html` | Nav "Cargo" → `cargo.html` |
| `apps/web/booking.html` | Nav "Cargo" → `cargo.html` |
| `apps/web/ticket.html` | Nav "Cargo" → `cargo.html` |
| `apps/web/tracking.html` | Nav "Cargo" → `cargo.html` |

### Frontend — Operator Portal
| File | Change |
|---|---|
| `apps/operator/cargo.html` | New — Cargo bookings table with status management |
| `apps/operator/index.html` | Sidebar added "📦 Cargo" link |

---

**Prerequisites:** Phase 0 + Phase 1 (Monorepo setup, 4 apps running)
**Time:** 3–4 sessions
