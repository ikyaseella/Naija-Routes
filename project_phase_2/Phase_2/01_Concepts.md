# 🌍 Phase 2 Concepts — Multi-Language Support (i18n)
**Naija Routes · Instructor-Led Project · Phase 2**

---

## 1. What Is Internationalization (i18n)?

i18n = **i** + 18 letters + **n** = **i**nternationalizatio**n**

It's the practice of designing software so it can be adapted to multiple languages and regions without code changes. Translation is just one piece — i18n also covers date formats, number formats, currency symbols, text direction, and cultural conventions.

> A properly internationalized app can add a new language with nothing more than a JSON file. No HTML changes. No CSS changes. No JS changes. Just data.

---

## 2. Why This Matters for Nigeria

Nigeria has **500+ languages**. The 3 major ones — Yoruba (South West), Hausa (North), and Igbo (South East) — are spoken by tens of millions each. And **Nigerian Pidgin** is the true lingua franca, spoken by 75%+ of the population.

Most transport users in the North speak Hausa as their primary language. An English-only interface excludes millions of potential users. The Naija Routes PRD explicitly requires support for all 5 languages, and the `users` table already has a `lang_pref` column ready to go.

| Language | Speakers | Script | Direction | Our Support |
|---|---|---|---|---|
| English | 200M+ | Latin | LTR | ✅ Full |
| Yoruba | 45M+ | Latin | LTR | ✅ Full |
| Hausa | 50M+ | Latin + Ajami (Arabic) | LTR + RTL | ✅ Full |
| Igbo | 30M+ | Latin | LTR | ✅ Full |
| Pidgin | 120M+ | Latin | LTR | ✅ Full |

---

## 3. How i18n Works in Naija Routes

Three layers, each with a single responsibility:

```
Layer 1: JSON Translation Files  (packages/shared/web/i18n/*.json)
Layer 2: JavaScript Runtime      (packages/shared/web/js/i18n.js)
Layer 3: HTML data Attributes    (data-i18n="nav.logo")
```

- **Layer 1** — Each language has a JSON file with the same keys, just translated values.
- **Layer 2** — `i18n.js` loads the right JSON, scans the page, and replaces text on the fly.
- **Layer 3** — Every piece of visible text in the HTML gets a `data-i18n` attribute instead of hardcoded text.

This is the same pattern used by big platforms like Airbnb, Uber, and LinkedIn.

---

## 4. The 5 Translation Files

All locale files live in a single folder inside the shared package:

```
packages/shared/web/i18n/
├── en.json    # English (base/default)
├── yo.json    # Yoruba
├── ha.json    # Hausa
├── ig.json    # Igbo
└── pcm.json   # Pidgin
```

Every file contains the **exact same keys**. Only the values change. English is our "base" locale — if a key is missing in Yoruba, the system falls back to the English value.

---

## 5. Key Naming Convention

Keys use **dot notation** — a category prefix followed by the specific name:

```
nav.logo          → "NaijaRoutes"
home.eyebrow      → "Nigeria's #1 Transport Aggregator"
search.from_label → "From"
search.to_label   → "To"
booking.title     → "Select Your Seat"
ticket.download   → "Download Ticket"
```

This keeps keys organised and easy to find. When you see `search.from_label` you immediately know it belongs to the search page and it's a form label.

---

## 6. The i18n.js Runtime

When a page loads, here's exactly what happens:

1. **Check storage** — `localStorage.getItem('lang')` for a saved preference
2. **Detect browser** — If no saved language, check `navigator.language`
3. **Fetch JSON** — Request the right locale file via `fetch('/__i18n/yo.json')`
4. **Scan DOM** — Find every `[data-i18n]` element on the page
5. **Replace text** — Set `textContent` to the translated value
6. **Set direction** — Update `<html dir="rtl">` for Hausa

The whole process takes under 50ms. Users see the page in English first (flash of untranslated content), then it instantly switches. A tiny CSS trick hides that flash.

---

## 7. RTL — Right to Left

Hausa can be written in **Ajami** — the Arabic script. Arabic reads right-to-left, which means the entire UI layout must flip:

- Text aligns to the right
- Nav items reverse order
- Inputs and buttons shift
- Icons mirror horizontally

Our system detects when Hausa is selected and sets `dir="rtl"` on the `<html>` tag. The `i18n.css` file contains all the RTL overrides using the `[dir="rtl"]` attribute selector:

```css
[dir="rtl"] .nav-links { flex-direction: row-reverse; }
[dir="rtl"] .search-box { text-align: right; }
```

CSS handles most of the work — no JavaScript layout calculations needed.

---

## 8. What Changes in Each App

Adding i18n touches every file, but the pattern is always the same:

- **Every HTML file** — Hardcoded text gets replaced with `data-i18n="..."` attributes
- **Every nav** — A language switcher dropdown appears in the header
- **Every JS file** — Dynamic strings (error messages, confirmations) use `I18N.t('key')`
- **Vite configs** — Each app gets a proxy rule so `/__i18n/` serves locale files from the shared package

You do this work **once** per app. After that, adding a new language is just a new JSON file.

---

> 💡 **Key Insight:** i18n isn't just about translation. It's about **respect** — showing users their language matters. A Yoruba speaker who sees Naija Routes in Yoruba is far more likely to trust and book.
