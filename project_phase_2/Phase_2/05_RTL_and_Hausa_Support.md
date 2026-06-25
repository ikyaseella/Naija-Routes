# 05 — RTL Support and Hausa (Ajami Script)

---

#### 1. What is RTL?
RTL = Right-to-Left. Some scripts read from right to left, including Arabic, Hebrew, and Hausa Ajami (Arabic-based Hausa writing).

#### 2. Why Hausa Needs RTL
- Hausa is written in two scripts: Boko (Latin, LTR) and Ajami (Arabic, RTL)
- Many Hausa speakers, especially in northern Nigeria, use Ajami
- Even for Boko script, having RTL support signals that the platform respects Hausa language and culture

#### 3. How We Handle It
Each locale JSON file has a `meta.dir` field:
```json
{
  "meta": {
    "lang_name": "Hausa",
    "lang_code": "ha",
    "dir": "rtl"
  }
}
```
English, Yoruba, Igbo, and Pidgin are `"ltr"`. Hausa is `"rtl"`.

#### 4. The Runtime Switch
In `i18n.js`, when language changes:
```js
function setDirection(lang) {
  const dir = translations.meta?.dir || 'ltr'
  document.documentElement.setAttribute('dir', dir)
  document.documentElement.setAttribute('lang', lang)
}
```
This sets `<html dir="rtl" lang="ha">` which automatically:
- Flips text alignment
- Flips table column order
- Reverses flexbox direction (in some cases)

#### 5. CSS Overrides for RTL
Some layouts need explicit overrides. In `i18n.css`:
```css
[dir="rtl"] .navbar__links {
  flex-direction: row-reverse;
}
[dir="rtl"] .search-hero__form-row {
  flex-direction: row-reverse;
}
[dir="rtl"] .seat-map__row {
  flex-direction: row-reverse;
}
```
These selectors only apply when `dir="rtl"` is on the `<html>` element.

#### 6. Testing RTL
1. Open any page
2. Switch to Hausa
3. Check:
   - Text aligns to the right
   - Nav links reverse order
   - Form inputs start from right
   - Search rows reverse
   - Seat map rows reverse
   - Dropdowns and selects look correct
4. Switch back to English — everything should return to LTR

#### 7. Common RTL Issues
- **Icons with directional meaning**: A "→" arrow should become "←" in RTL. Use CSS or Unicode bidirectional characters.
- **Margin/padding**: `margin-left: auto` should become `margin-right: auto`. Use logical properties like `margin-inline-start`.
- **Background positions**: `background-position: left center` should flip. Use `background-position-x`.
- **Third-party libraries**: Some may not respect `dir` attribute.
