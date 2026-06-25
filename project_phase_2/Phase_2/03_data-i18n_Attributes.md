# 03 — Using data-i18n Attributes in HTML
**Naija Routes · Instructor-Led Project · Phase 2**

---

## 1. What Are data-i18n Attributes?

Custom HTML attributes that tell the i18n runtime which translation key to use for each element.

---

## 2. Basic Usage: Replacing Text Content

```html
<!-- Before -->
<button>Find Buses</button>

<!-- After -->
<button data-i18n="home.find_buses">Find Buses</button>
```

The runtime finds all `[data-i18n]` elements and replaces their `textContent`.

---

## 3. Placeholders (input fields)

```html
<!-- Before -->
<input placeholder="e.g. Emeka Okonkwo">

<!-- After -->
<input data-i18n-placeholder="booking.name_placeholder">
```

---

## 4. Tooltips

```html
<span data-i18n-title="common.learn_more">ℹ️</span>
```

---

## 5. Input Values

```html
<input type="submit" data-i18n-value="common.submit">
```

---

## 6. Other Attributes with data-i18n-attr

For attributes like `aria-label`:

```html
<button data-i18n="common.close" data-i18n-attr="aria-label">✕</button>
```

---

## 7. Dynamic Content (Interpolation)

Some translations need dynamic values:

```json
{
  "search": {
    "only_seats_left": "Only {count} seats left!"
  }
}
```

In HTML you'd still use `data-i18n="search.only_seats_left"`, but the dynamic `{count}` is replaced by JavaScript, not the HTML attribute. So this is typically done in JS with `I18N.t('search.only_seats_left', { count: 2 })`.

---

## 8. What NOT to Translate

- Dynamic data: passenger names, prices, dates, ticket numbers
- Emoji icons (keep them outside the data-i18n element)
- CSS classes and IDs
- HTML structure

---

## 9. Before and After Example

```html
<!-- BEFORE -->
<nav class="navbar">
  <a href="/" class="logo">🚌 NaijaRoutes</a>
  <a href="search.html">Routes</a>
  <a href="cargo.html">Cargo</a>
  <a href="#">Sign in</a>
</nav>

<!-- AFTER -->
<nav class="navbar">
  <a href="/" class="logo" data-i18n="nav.logo">🚌 NaijaRoutes</a>
  <a href="search.html" data-i18n="nav.routes">Routes</a>
  <a href="cargo.html" data-i18n="nav.cargo">Cargo</a>
  <a href="#" data-i18n="nav.sign_in">Sign in</a>
</nav>
```

---

## 10. Checking Your Work

After adding data-i18n, verify:

- Does the element show the correct default text?
- Switch to Yoruba — does the text change?
- Switch to Hausa — does the layout flip RTL?
- Are emojis still visible?
- Are dynamic values (prices, names) still showing correctly?
