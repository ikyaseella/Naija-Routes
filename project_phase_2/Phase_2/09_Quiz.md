# 09 — Quiz: Multi-Language Support
**Naija Routes · Instructor-Led Project · Phase 2**

---

### Question 1
What does "i18n" stand for?

- a) Internationalization — 18 letters between **i** and **n** ✓
- b) 18 languages supported
- c) Internet 18 network
- d) Internalization

---

### Question 2
Which of these languages uses RTL (Right-to-Left) layout in our system?

- a) Yoruba
- b) Hausa ✓
- c) Igbo
- d) Pidgin

---

### Question 3
True or False: Every locale JSON file must have EXACTLY the same keys.

**Answer:** True. If a key is missing from a locale file, the system falls back to English, but the goal is to maintain identical key structures across all locale files.

---

### Question 4
What attribute replaces text content in HTML?

Fill in the blank: `data-______="home.eyebrow"`

**Answer:** `i18n`

---

### Question 5
Which function switches the UI language at runtime?

- a) `I18N.switch()`
- b) `I18N.setLanguage()` ✓
- c) `I18N.change()`
- d) `I18N.update()`

---

### Question 6
True or False: Emojis should be placed inside the element with `data-i18n` so they also translate.

**Answer:** False. Emojis should stay outside `data-i18n` elements because they are universal and don't need translation. Including them inside would unnecessarily complicate the locale JSON files.

---

### Question 7
What is the fallback chain when a translation key is missing?

**Answer:** Selected language → English (`en.json`) → raw key name (displayed as-is)

---

### Question 8
Which Vite middleware path serves the locale JSON files?

- a) `/locale/`
- b) `/__i18n/` ✓
- c) `/translations/`
- d) `/i18n/`

---

### Question 9
What localStorage key stores the user's language preference?

- a) `nr_language`
- b) `lang_pref`
- c) `nr_lang` ✓
- d) `i18n_lang`

---

### Question 10
True or False: You must restart the Vite dev server every time you edit a locale JSON file.

**Answer:** False. Locale JSON files are served by middleware and a hard refresh (Ctrl+F5) is sufficient. However, some middleware caches may require a full server restart if caching is enabled.
