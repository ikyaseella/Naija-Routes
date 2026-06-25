# 04 — Adding the Language Switcher
**Naija Routes · Instructor-Led Project · Phase 2**

---

## 1. What Is the Language Switcher?

A dropdown `<select>` element in the navigation that lets users change the UI language instantly — no page reload needed.

---

## 2. Where It Lives

- **Traveller Web App** → In the navbar, next to "Sign in"
- **Agent App** → In the nav tabs row
- **Operator Portal** → In the sidebar, at the bottom
- **Admin Dashboard** → In the sidebar, at the bottom

---

## 3. The HTML

```html
<select class="language-switcher__select" onchange="I18N.setLanguage(this.value)">
  <option value="en">English</option>
  <option value="yo">Yoruba</option>
  <option value="ha">Hausa</option>
  <option value="ig">Igbo</option>
  <option value="pcm">Pidgin</option>
</select>
```

---

## 4. How setLanguage() Works

1. Checks if the language code is supported
2. Fetches the locale JSON file via HTTP (`/__i18n/yo.json`)
3. If fetch fails, falls back to English
4. Replaces the current translations object
5. Saves the choice to `localStorage.setItem('nr_lang', 'yo')`
6. Sets `document.documentElement.lang = 'yo'`
7. Sets `document.documentElement.dir = 'rtl'` (for Hausa)
8. Calls `applyTranslations()` to update all `[data-i18n]` elements
9. Fires a custom event `i18n:change` so JS modules can react

---

## 5. The Custom Events

```js
// Listen for language changes in your JS code
document.addEventListener('i18n:change', (e) => {
  console.log('Language changed to:', e.detail.lang)
  // Re-render dynamic content with new language
})
```

---

## 6. Styling the Switcher

The `i18n.css` file provides base styles:

```css
.language-switcher__select {
  padding: 0.375rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
}
```

Each app may override the colors to match its theme.

---

## 7. Testing the Switcher

1. Open the app in your browser
2. Click the language dropdown
3. Select "Yoruba" → all text should change to Yoruba
4. Select "Hausa" → text changes, layout flips RTL
5. Refresh the page → language should persist
6. Clear localStorage → language should auto-detect from browser

---

## 8. Common Issues

- **Dropdown not showing**: Check that i18n.css is linked
- **Language doesn't persist**: Check localStorage write permissions
- **Text not changing**: Check that data-i18n keys match the JSON exactly
- **Console errors**: Check the `/__i18n/` middleware is configured in vite.config.js
