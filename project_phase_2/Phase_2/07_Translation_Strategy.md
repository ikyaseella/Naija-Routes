# 07 — Translation Strategy

---

#### 1. Our 5 Languages

| Language | Code | Speakers | Script | Direction |
|---|---|---|---|---|
| English | `en` | All Nigerians (official) | Latin | LTR |
| Yoruba | `yo` | ~45M (SW Nigeria) | Latin | LTR |
| Hausa | `ha` | ~50M (Northern Nigeria) | Latin + Ajami | RTL (Ajami) |
| Igbo | `ig` | ~30M (SE Nigeria) | Latin | LTR |
| Pidgin | `pcm` | ~120M (nationwide) | Latin | LTR |

#### 2. Translation Quality
- Not machine translation — each translation was written by a fluent speaker
- Culturally appropriate phrases, not literal word-for-word
- Pidgin uses natural Nigerian Pidgin phrasing like "Wetin dey happen?" not "What is happening?"
- Yoruba uses standard Yoruba orthography (with tone marks where needed)
- Hausa uses standard Hausa Boko orthography

#### 3. What We Translate
- All navigation: menu items, tabs, sidebar links
- All labels: form fields, buttons, headings
- All messages: alerts, errors, confirmations, tooltips
- All static text: descriptions, instructions, footnotes

#### 4. What We DON'T Translate
- Brand name: "NaijaRoutes" stays the same
- Dynamic data: passenger names, prices in naira, dates, times, ticket numbers
- Emojis: kept outside the data-i18n element
- Technical abbreviations: "GPS", "QR", "KYC", "POS" stay as-is
- CSS classes and IDs

#### 5. The Emoji Rule
```html
<!-- CORRECT: emoji outside the translated text -->
<span>🎫 <span data-i18n="agent.sell_title">Sell Ticket</span></span>

<!-- WRONG: emoji inside the translated text (would need translation in every language) -->
<span data-i18n="agent.sell_title_with_emoji">🎫 Sell Ticket</span>
```

#### 6. Placeholder Convention
Use `{curly_braces}` for dynamic values:
```json
{
  "search": {
    "only_seats_left": "Only {count} seats left!"
  },
  "agent": {
    "park_location": "{park}, {state}"
  }
}
```

#### 7. Adding a New Language
Step-by-step:
1. Copy `en.json` to `newlang.json`
2. Translate all values (not keys!)
3. Add `'newlang'` to `SUPPORTED_LANGS` array in `i18n.js`
4. Add the language option to the switcher in every HTML file
5. Test every page in the new language

#### 8. The Fallback System
```
1. Try selected language → "yo.json"
2. If key missing → try "en.json"
3. If key also missing → show raw key "nav.logo"
```
This means you don't need 100% complete translations to launch. Missing keys will gracefully fall back to English.
