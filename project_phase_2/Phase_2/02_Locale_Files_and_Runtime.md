# 02 — Locale Files and the i18n Runtime
**Naija Routes · Instructor-Led Project · Phase 2**

---

## 1. Where Translation Files Live

All translation files are in the shared package:

```
packages/shared/web/i18n/
├── en.json    # English (default/base)
├── yo.json    # Yoruba
├── ha.json    # Hausa
├── ig.json    # Igbo
└── pcm.json   # Pidgin
```

Each file is a plain JSON object. They all have exactly the same keys. The values are translated.

---

## 2. The JSON Structure

```json
{
  "nav": {
    "logo": "NaijaRoutes",
    "routes": "Routes",
    "sign_in": "Sign in"
  },
  "home": {
    "eyebrow": "Nigeria's #1 Transport Aggregator",
    "headline_line1": "Every Bus.",
    "find_buses": "Find Buses"
  }
}
```

- Keys use dot notation (category.subcategory)
- Categories match app sections: nav, home, search, booking, ticket, agent, operator, admin, common
- Values can contain `{placeholders}` for dynamic content

---

## 3. Adding a New Language

Steps:

1. Copy `en.json` to `fr.json`
2. Translate all values to French
3. Add `'fr'` to the `SUPPORTED_LANGS` array in `i18n.js`
4. Add a French option to the language switcher in each HTML file

---

## 4. The i18n.js Runtime

This is the brain. Located at `packages/shared/web/js/i18n.js`.

**`I18N.init()`** — Called on DOMContentLoaded. Detects language, loads locale, applies translations.

```javascript
document.addEventListener('DOMContentLoaded', () => I18N.init());
```

**`I18N.t('key', {params})`** — The translate function. Returns translated text. Supports `{placeholder}` interpolation.

```javascript
const label = I18N.t('search.only_seats_left', { count: 2 });
// Returns "Only 2 seats left!" in English
```

**`I18N.setLanguage('yo')`** — Switches language. Fetches new locale, re-scans DOM, saves to localStorage.

```javascript
I18N.setLanguage('yo'); // Switch to Yoruba instantly
```

**`I18N.applyTranslations()`** — Re-scans the DOM for `[data-i18n]` elements. Useful after adding new HTML dynamically.

```javascript
// After injecting new HTML via JS:
I18N.applyTranslations();
```

**`I18N.buildLanguageSwitcher(container)`** — Creates a `<select>` dropdown and appends it to a container.

```javascript
I18N.buildLanguageSwitcher(document.getElementById('lang-container'));
```

**`I18N.onChange(callback)`** — Register a callback that fires when language changes.

```javascript
I18N.onChange((lang) => {
  console.log(`Language changed to ${lang}`);
});
```

---

## 5. How Locale Files Are Served

Each app has a Vite config with a custom middleware:

```js
// /__i18n/ maps to packages/shared/web/i18n/
// So /__i18n/yo.json serves the Yoruba translation file
```

This keeps locale files in one place (shared package) but accessible from all apps.

---

## 6. The Language Detection Flow

1. Check `localStorage` → if `nr_lang` exists, use it
2. Check browser language → `navigator.language` → slice to first 2 chars
3. Fallback → English
4. Fetch the locale file for the detected language
5. If fetch fails → fallback to English
6. Apply translations to the page

---

## 7. The Fallback Chain

```
Selected Language → English (fallback) → Key name (last resort)
```

If a key is missing in Yoruba, it falls back to English. If also missing in English, it shows the raw key like `nav.logo`.
