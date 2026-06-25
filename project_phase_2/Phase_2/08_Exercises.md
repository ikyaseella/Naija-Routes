# 08 — Exercises: Multi-Language Support
**Naija Routes · Instructor-Led Project · Phase 2**

---

### Exercise 1: Add a New Language (French)

Add French (`fr`) as a 6th supported language.

**Steps:**
1. Copy `en.json` to `fr.json` inside the `locale/` directory
2. Translate at least 5 keys (e.g. `nav.logo`, `home.eyebrow`, `home.subtitle`, `footer.copyright`, `nav.book`) to French
3. Add `'fr'` to the `SUPPORTED_LANGS` array in `i18n.js`
4. Add a French option to the language switcher in one app (e.g. `web/index.html`)
5. Reload the page and switch to French — all 5 translated keys should appear in French

**Expected Outcome:** French appears in the language switcher dropdown and the page shows French text for the translated keys.

---

### Exercise 2: Spot the Missing `data-i18n`

Given this HTML snippet, identify which text would NOT translate when the user switches language:

```html
<div class="hero">
  <h1 data-i18n="home.heading">Book Your Trip</h1>
  <p data-i18n="home.subtitle">Travel across Nigeria with ease</p>
  <p class="tagline">Your journey starts here</p>
  <button data-i18n="home.cta">Search Routes</button>
</div>
```

**Steps:**
1. Identify which text is missing `data-i18n`
2. Add the missing attribute with an appropriate key (e.g. `home.tagline`)
3. Add the key to all 5 locale files

**Expected Outcome:** Every visible text element has a `data-i18n` attribute and translates when the language changes.

---

### Exercise 3: Add a New Translation Key

The home page needs a new "Trusted by 500+ operators" badge.

**Steps:**
1. Add the key `home.trust_badge` to all 5 locale JSON files with the translated text in each language
2. Add this HTML to the home page with the correct `data-i18n` attribute:
   ```html
   <div class="trust-badge">
     <span data-i18n="home.trust_badge">Trusted by 500+ operators</span>
   </div>
   ```
3. Test the page in all 5 languages

**Expected Outcome:** The badge text changes when switching between any of the 5 supported languages.

---

### Exercise 4: Fix a Broken Translation

The booking page shows `"—"` for unselected seats but this placeholder text doesn't translate.

**Steps:**
1. Find where `"—"` is hardcoded in `booking.js` (likely in the seat grid render function)
2. Import or call `I18N.t('booking.not_selected')` instead
3. Ensure the key `booking.not_selected` exists in all 5 locale files with the correct translation (e.g. `"—"` for English, `"—"` or a localized equivalent for others)
4. Test that the placeholder changes when the language is switched

**Expected Outcome:** The unselected seat indicator uses `I18N.t()` and responds to language changes.

---

### Exercise 5: RTL Debug

The admin dashboard sidebar doesn't flip properly in Hausa. The layout stays left-to-right instead of right-to-left.

**Steps:**
1. Open the admin dashboard in Hausa mode and note which elements are misaligned (sidebar, logo, nav links)
2. Add CSS rules to `i18n.css` under the `[dir="rtl"]` selector:
   - Sidebar items: `flex-direction: row-reverse;`
   - Logo: `margin-right` → `margin-left`
   - Nav links: `text-align: right;`
3. Verify the sidebar mirrors correctly

**Expected Outcome:** The admin dashboard sidebar mirrors correctly when Hausa is selected, with items aligned to the right.

---

### Exercise 6: JS Integration

The operator dashboard shows a dynamic greeting: `"Good morning, Alhaji Musa"`. This is currently hardcoded in `operator/index.js`.

**Steps:**
1. Add a new locale key `operator.greeting_morning` to all 5 locale files with the translated greeting text (use `{name}` as a placeholder)
2. Modify the JS to use `I18N.t('operator.greeting_morning', { name: 'Alhaji Musa' })` instead of the hardcoded string
3. Test the greeting changes when switching languages

**Expected Outcome:** The dynamic greeting uses `I18N.t()` with a `{name}` placeholder and displays correctly in every language.

---

### Exercise 7: Language Detection

Write a small test script that logs the language detection flow.

**Steps:**
1. Open the browser console on any Naija Routes page
2. Paste and run this test script:
   ```javascript
   console.log('Browser language:', navigator.language);
   console.log('localStorage lang:', localStorage.getItem('nr_lang'));
   console.log('Final language:', I18N.currentLang);
   console.log('Locale keys loaded:', Object.keys(I18N.locales));
   ```
3. Change the language, refresh, and run again
4. Report the output for each scenario

**Expected Outcome:** You can trace the language detection priority chain: saved preference → browser language → default (en).

---

### Exercise 8: Full Audit

Pick one page (e.g. `agent/sell.html`) and audit it for i18n completeness.

**Checklist:**
- [ ] Every visible static text has a `data-i18n` attribute
- [ ] Dynamic values (prices, passenger names, seat numbers) are NOT inside `data-i18n` elements
- [ ] Emojis and icons are placed outside `data-i18n` spans
- [ ] Language switcher is present and functional
- [ ] RTL layout works correctly for Hausa (sidebar, nav, text alignment)
- [ ] The page works correctly after switching language (no broken layouts, missing text, or console errors)

**Steps:**
1. Open the page in English and inspect every visible text node
2. Switch to Hausa and check RTL behavior
3. Switch to Yoruba, Igbo, and Pidgin — verify all text translates
4. Document any issues found

**Expected Outcome:** A complete audit report with any issues found and fixes applied.

---

**Submission:** Submit your modified files (locale JSONs, HTML, JS, CSS) as a pull request or ZIP file to the instructor portal.
