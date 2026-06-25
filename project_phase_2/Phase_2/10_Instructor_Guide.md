# 10 — Instructor Guide: Phase 2 — Multi-Language Support
**Naija Routes · Instructor-Led Project · Phase 2**

---

## Prerequisites

- Students completed Phase 0 and Phase 1
- The monorepo is running (`pnpm dev` from root)
- All 4 apps (web, agent, operator, admin) accessible in browser
- Students understand the basic HTML/CSS/JS structure of the project
- Students have read Phase 2 files 01–07

---

## Session Plan (4 sessions)

### Session 1: Concepts & Locale Files (90 min)

| Time | Activity |
|---|---|
| 0:00–0:15 | **Teach:** What is i18n? Why does Nigeria need multi-language support? Discuss the 5 languages and their regional significance |
| 0:15–0:30 | **Demo:** Open `en.json` and `yo.json` side by side — compare key structures and translations |
| 0:30–0:45 | **Explain:** How the Vite middleware serves locale files via `/__i18n/` |
| 0:45–1:25 | **Activity:** Students add 3 new keys to all 5 locale files and verify they load in the browser console |
| 1:25–1:30 | **Wrap-up:** Key point — locale keys must match **exactly** across all files or the fallback chain kicks in |

**Key Point:** Keys must match exactly across all files. A single typo in one locale file silently falls back to English.

---

### Session 2: HTML Integration (90 min)

| Time | Activity |
|---|---|
| 0:00–0:15 | **Teach:** How `data-i18n` attributes work — the `I18N` module scans the DOM and replaces textContent on language change |
| 0:15–0:30 | **Demo:** Show a page before and after adding `data-i18n` attributes. Use browser dev tools to inspect the DOM changes |
| 0:30–0:45 | **Whiteboard:** Which elements get `data-i18n`? Static text only. Prices, names, dates, and seat numbers stay dynamic |
| 0:45–1:25 | **Activity:** Students add `data-i18n` attributes to a page that doesn't have them yet (e.g. `agent/sell.html`) |
| 1:25–1:30 | **Wrap-up:** Key point — only static text gets `data-i18n`, never dynamic data values |

**Key Point:** `data-i18n` is for static text only. Dynamic values (prices, passenger names, timestamps) must remain outside translated elements.

---

### Session 3: Language Switcher & RTL (60 min)

| Time | Activity |
|---|---|
| 0:00–0:15 | **Teach:** How `I18N.setLanguage()` works — updates `localStorage`, fetches the locale JSON, re-scans the DOM, and applies RTL if needed |
| 0:15–0:25 | **Demo:** Switch between English and Hausa — show the full layout mirroring (sidebar, nav, text alignment) |
| 0:25–0:35 | **Explain:** The `<html dir="rtl">` attribute and how CSS `[dir="rtl"]` selectors flip layout without duplicating stylesheets |
| 0:35–0:55 | **Activity:** Students add a language switcher (dropdown or flag icons) to a new page and wire it to `I18N.setLanguage()` |
| 0:55–1:00 | **Wrap-up:** Key point — RTL affects layout, not just text. Buttons, icons, and margins all need RTL-aware CSS |

**Key Point:** RTL is a layout concern, not just a text direction. Sidebars, navigation, padding, and margins all need `[dir="rtl"]` overrides.

---

### Session 4: JS Integration & Exercises (90 min)

| Time | Activity |
|---|---|
| 0:00–0:15 | **Teach:** `I18N.t()` for dynamic text in JavaScript — string interpolation with `{placeholders}`, fallback behavior |
| 0:15–0:25 | **Demo:** Show `sell.js` and `scanner.js` before and after adding `I18N.t()` for dynamic labels |
| 0:25–0:35 | **Explain:** The `onChange()` callback — re-render dynamic content when the language changes without a page reload |
| 0:35–0:45 | **Teach:** Always provide fallbacks for `I18N.t()` — `I18N.t('key', { name }, 'Default text')` |
| 0:45–1:25 | **Activity:** Students complete Exercises 1–8 from `08_Exercises.md` |
| 1:25–1:30 | **Wrap-up:** Key point — `I18N.t()` is for JS-generated text, `data-i18n` is for static HTML text. Know which tool to use where |

**Key Point:** Always provide fallback text for `I18N.t()`. If the key is missing from every locale, the fallback is what the user sees.

---

## Common Pitfalls

| # | Pitfall | Why It Happens | How to Fix |
|---|---|---|---|
| 1 | **Typo in keys** | `"nav.logo"` vs `"navlogo"` — JSON keys must match exactly everywhere | Use a lint script that compares keys across all locale files |
| 2 | **Missing trailing comma** | JSON is strict — no trailing commas allowed | Use a JSON validator or IDE extension |
| 3 | **Forgetting to update all 5 files** | Adding a key to `en.json` but not `yo.json` → Yoruba silently falls back to English | Maintain a checklist when adding new keys |
| 4 | **Translating dynamic values** | Putting `data-i18n` on a price or passenger name element | Remember: static text only, never dynamic data |
| 5 | **Emoji inside `data-i18n`** | Emoji should stay outside the translated element — they are universal | Place emoji in a sibling `<span>` or outside the `data-i18n` element |
| 6 | **Not hard-refreshing after locale edits** | Locale JSON files are served by middleware — a soft refresh may show cached data | Use Ctrl+F5 (hard refresh) after editing locale files |
| 7 | **Forgetting RTL overrides** | Adding a RTL language but not providing `[dir="rtl"]` CSS → layout breaks | Always test Hausa after any layout change |
| 8 | **Nesting `data-i18n` inside `data-i18n`** | Translating a parent element that already contains translated children | Only the innermost text node should have `data-i18n` |

---

## Troubleshooting Guide

| Problem | Cause | Fix |
|---|---|---|
| Text not changing when switching language | `data-i18n` key doesn't exist in locale file, or there's a typo | Check the key spelling in both HTML and JSON |
| RTL not working | `meta.dir` property missing in locale file | Add `"dir": "rtl"` to the `meta` object in `ha.json` |
| Language switcher not showing / broken styles | `i18n.css` not linked in the page `<head>` | Add `<link rel="stylesheet" href="/css/i18n.css">` |
| Console error: 404 for locale JSON | Vite middleware not configured for `/__i18n/` | Check `vite.config.js` has the i18n plugin registered |
| Language preference resets on refresh | `localStorage` not being set or cleared | Check for private browsing mode; verify `nr_lang` key name |
| Some text stays in English after switching | Key is missing in the selected language's JSON file | Add the missing key to that language's file |
| Layout breaks in Hausa but fine in English | Missing `[dir="rtl"]` CSS overrides | Add RTL-specific rules in `i18n.css` |
| Dynamic greeting not updating after language switch | JS only runs on page load, not on `onChange()` callback | Register a re-render function with `I18N.onChange()` |

---

## Discussion Questions

1. **Why is Pidgin important for Naija Routes even though it's not an "official" language?**  
   *Guide: Discuss market penetration, user comfort, and the fact that Pidgin is the most widely spoken lingua franca in Nigeria.*

2. **How would you handle languages with different sentence structures (e.g., Subject-Verb-Object vs Subject-Object-Verb)?**  
   *Guide: This requires template-based translation where entire sentences are keys, not just words. Discuss the difference between word-level and sentence-level i18n.*

3. **Should users be able to set their language preference before signing up? How would you implement that?**  
   *Guide: Yes — store the preference in `localStorage` before authentication. On signup, persist it to the user profile in the database. Discuss the trade-offs of cookie vs localStorage.*

4. **What challenges might arise when adding a language like Fulfulde or Kanuri?**  
   *Guide: Discuss script differences (Latin vs Ajami script), lack of digital translation resources, character encoding, font availability, and smaller speaker populations for testing.*

---

---

## Part B: Reviews & Ratings — Session Plan (2 sessions)

### Session 5: Backend API (60 min)

| Time | Activity |
|---|---|
| 0:00–0:10 | **Teach:** What is a review service? Review schema (4 rating dimensions + text body) |
| 0:10–0:20 | **Demo:** Walk through `review.service.js` — mock data structure, static methods |
| 0:20–0:30 | **Demo:** Walk through `review.routes.js` — POST validation, GET response format |
| 0:30–0:45 | **Activity:** Students test the API with curl (GET reviews, POST new review) |
| 0:45–0:55 | **Discuss:** Why mock services? How does the pattern simplify Phase 3 DB migration? |
| 0:55–1:00 | **Wrap-up:** Key point — the service layer is the only code that changes in Phase 3 |

**Common Issues:**
- Students forget to start the backend (`cd services/api && pnpm dev`)
- POST requests missing required fields get 400 — show validation in action
- Students confuse endpoint paths (e.g. `/api/v1/reviews/operator/:id` vs `/api/v1/operators/:id/reviews`)

### Session 6: Frontend UI (90 min)

| Time | Activity |
|---|---|
| 0:00–0:15 | **Teach:** Three parts: star widget → review form → thank-you message |
| 0:15–0:30 | **Demo:** Open `apps/web/ticket.html`, show the review-prompt div, inspect star buttons |
| 0:30–0:45 | **Demo:** Walk through the JavaScript — click handling, form toggle, submitReview() |
| 0:45–1:15 | **Activity:** Students add driver rating stars (Exercise 2) or validation (Exercise 6) |
| 1:15–1:25 | **Demo:** Open `apps/operator/reviews.html`, show rating summary + review cards |
| 1:25–1:30 | **Wrap-up:** Key point — the traveller submits reviews, the operator views them |

**Common Issues:**
- Star buttons not responding — check that `querySelectorAll('.star-btn')` finds elements
- `submitReview()` not logging — check console for errors (typos in function name)

---

## Discussion Questions — Reviews

1. **Why did we use 4 separate rating dimensions instead of just 1 overall star rating?**  
   *Guide: Discuss how granular feedback helps operators improve specific areas. A 3-star overall could mean different things — poor vehicle but great driver.*

2. **Should reviews be anonymous or show the passenger's name? What are the trade-offs?**  
   *Guide: Named reviews build accountability (no fake reviews). Anonymous reviews encourage honesty. Discuss moderation strategies.*

3. **How would you prevent a user from reviewing the same trip multiple times?**  
   *Guide: A unique constraint on `(user_id, booking_id)` in the database. Check this in the service layer before creating a review.*

4. **Should operators be able to respond to reviews? How would that change the data model?**  
   *Guide: Add a `reply` column or a separate `review_replies` table. Discuss the UX implications of operator reply notifications.*

---

## Grading Rubric

### Part A — i18n (Exercises 1–8)

| Exercise | Key Skill Assessed | Passing Criteria |
|---|---|---|
| **Ex 1** — Add French | Creating and registering locale files | French appears in switcher, 5+ keys translate |
| **Ex 2** — Missing `data-i18n` | Identifying untranslated text | All text nodes have `data-i18n` attribute |
| **Ex 3** — New translation key | Adding keys across all locales | Key present in all 5 files, renders correctly |
| **Ex 4** — Fix broken translation | Using `I18N.t()` in JS | Unselected seat indicator translates |
| **Ex 5** — RTL Debug | Writing `[dir="rtl"]` CSS | Sidebar mirrors correctly in Hausa |
| **Ex 6** — JS Integration | String interpolation with placeholders | Greeting uses `I18N.t()` with `{name}` |
| **Ex 7** — Language Detection | Understanding detection priority chain | Correct console output for all scenarios |
| **Ex 8** — Full Audit | Comprehensive i18n review | All checklist items pass, issues documented |

### Part B — Reviews (Exercises 1–8)

| Exercise | Key Skill Assessed | Passing Criteria |
|---|---|---|
| **Ex 1** — Add review endpoint | Creating API routes and service methods | Recent endpoint returns 2 reviews |
| **Ex 2** — Driver rating stars | DOM manipulation with i18n attributes | Two star sets, both ratings logged |
| **Ex 3** — Average calculation | Aggregation logic from mock data | Averages match mathematical calculation |
| **Ex 4** — Empty state | Handling zero-data UI states | "No reviews" message displays correctly |
| **Ex 5** — Star helper function | String generation and reuse | `renderStars(4)` returns "★★★★☆" |
| **Ex 6** — Form validation | Client-side input validation | Cannot submit without selecting a rating |
| **Ex 7** — Date formatting | Date manipulation with locale | Dates display in Nigerian locale format |
| **Ex 8** — Full audit | Comprehensive reviews feature review | All checklist items pass, issues documented |

---

## Part C: Live Bus Tracking — Session Plan (2 sessions)

### Session 7: Backend API (60 min)

| Time | Activity |
|---|---|
| 0:00–0:10 | **Teach:** What is vehicle tracking? The `tracking_events` partitioned table, GPS device IDs |
| 0:10–0:20 | **Demo:** Walk through `tracking.service.js` — CITIES lookup, FLEET data, interpolate() |
| 0:20–0:30 | **Demo:** Walk through `tracking.routes.js` — 4 GET endpoints |
| 0:30–0:45 | **Activity:** Students test the API with curl |
| 0:45–0:55 | **Discuss:** Position interpolation vs real GPS |
| 0:55–1:00 | **Wrap-up:** Mock service enables UI without hardware |

### Session 8: Frontend Maps (90 min)

| Time | Activity |
|---|---|
| 0:00–0:15 | **Teach:** Leaflet.js basics — tiles, markers, popups |
| 0:15–0:30 | **Demo:** `apps/web/tracking.html` — lookup, map, share |
| 0:30–0:45 | **Demo:** `apps/operator/tracking.html` — fleet list + map |
| 0:45–1:15 | **Activity:** Students add legend or ETA (Exercises 3/6) |
| 1:15–1:25 | **Discuss:** Polling vs WebSockets |
| 1:25–1:30 | **Wrap-up:** Leaflet is free, no API key needed |

### Grading Rubric — Part C

| Exercise | Key Skill Assessed | Passing Criteria |
|---|---|---|
| **Ex 1** — Add vehicle to fleet | Mock data structure | 6th vehicle appears in API + map |
| **Ex 2** — Track by booking ref | VEHICLE_MAP mapping | Both ref and plate resolve correctly |
| **Ex 3** — ETA calculation | Distance math + DOM update | ETA displays in minutes |
| **Ex 4** — Driver rating | Extending service + rendering | Stars appear on fleet cards |
| **Ex 5** — No signal indicator | Error handling + UX | Warning banner on API failure |
| **Ex 6** — Map legend | Leaflet Control API | Color legend on fleet map |
| **Ex 7** — Live clock | setInterval + formatting | Clock updates every second |
| **Ex 8** — Full audit | Comprehensive review | All checklist items pass |

---

## Part D: Cargo / Freight — Session Plan (2 sessions)

### Session 9: Backend API (60 min)

| Time | Activity |
|---|---|
| 0:00–0:10 | **Teach:** Cargo business model — shipper, operator, recipient, waybill lifecycle |
| 0:10–0:20 | **Demo:** Walk through `cargo.service.js` — mock data, validation, waybill generation, pricing |
| 0:20–0:30 | **Demo:** Walk through `cargo.routes.js` — 6 endpoints |
| 0:30–0:45 | **Activity:** Students test the API (create booking, lookup waybill, update status) |
| 0:45–0:55 | **Discuss:** Waybill number format, status lifecycle, pricing strategy |
| 0:55–1:00 | **Wrap-up:** Key point — three frontends share one backend |

### Session 10: Frontend Pages (90 min)

| Time | Activity |
|---|---|
| 0:00–0:20 | **Demo:** `apps/agent/cargo.html` — form, submit, receipt |
| 0:20–0:40 | **Demo:** `apps/web/cargo.html` — book tab, track tab, nav integration |
| 0:40–1:00 | **Demo:** `apps/operator/cargo.html` — table, filter, search, status updates |
| 1:00–1:20 | **Activity:** Students add print button (Ex 5) or status timeline (Ex 6) |
| 1:20–1:30 | **Wrap-up:** Compare the 3 frontends — same data, different views |

## Grading Rubric — Part D

| Exercise | Key Skill Assessed | Passing Criteria |
|---|---|---|
| **Ex 1** — Dynamic pricing | Operator-specific service logic | Different operators give different prices |
| **Ex 2** — My Bookings tab | API fetch + DOM rendering | User bookings display with clickable waybills |
| **Ex 3** — Delivery date estimate | Date calculation + display | Delivery date shows in receipt and track view |
| **Ex 4** — Route validation | Input validation + user feedback | Same origin/destination is rejected |
| **Ex 5** — Print waybill | CSS media queries + print API | Print dialog shows only the receipt |
| **Ex 6** — Status timeline | Visual timeline component | Clear status progression visualization |
| **Ex 7** — SMS notification | Simulated side effect + UI feedback | Console logs SMS on status change |
| **Ex 8** — Full audit | Comprehensive review | All checklist items pass |
