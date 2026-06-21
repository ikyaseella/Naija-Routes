# 04 — Digital Tickets & QR Codes
**Naija Routes · Instructor-Led Project · Phase 1 MVP**

---

## What is a Digital Ticket?

Gone are the days of paper manifests and physical receipts. Once a user successfully pays for their booking, the Naija Routes backend immediately:
1. Updates the booking status to `CONFIRMED`.
2. Generates a secure, random **QR Code Hash**.
3. Creates a `tickets` record in the database linked to the booking.
4. Generates a PDF version of the ticket (for users who want to print it).
5. Returns the ticket data to the frontend to display.

> 🎨 **Visual Reference:** The exact ticket design is visible in `dashboards/ui_traveller_design1.html` — scroll to the "Your ticket lives on your phone" section. The ticket card mockup shows the precise layout your `ticket.html` must match.

---

## Step 1: The Ticket Display UI (ticket.html)

When the payment is successful, the user is redirected to `ticket.html`.

Create the file:
```powershell
New-Item -ItemType File -Path "naija-routes\apps\web\ticket.html" -Force
```

### The Anatomy of the Ticket Card (Design 1 — "Deep Roots")

The ticket is designed to be **glanceable**. Motor parks are chaotic; the passenger just needs to show their screen to the agent. Match the Design 1 mockup precisely:

```
┌─────────────────────────────────────────┐
│  [Header: Dark Emerald Gradient]        │
│  ABC Transport · Booking #NR-XXXX-XXXX  │
│  Lagos  ✈  Abuja                        │
├─────────────────────────────────────────┤
│  [Body: White]                          │
│  Passenger  │  Date      │  Seat        │
│  Emeka Obi  │  25 Dec    │  12A         │
│  Departure  │  Park      │  Class       │
│  06:00 AM   │  Jibowu    │  Executive   │
│  - - - - - - - - - - - - - - - - - -   │ ← dashed divider
│                                         │
│              [QR Code]                  │
│           NR-20251225-8847              │
└─────────────────────────────────────────┘
```

**Ticket CSS (Design 1 tokens):**
```css
.ticket-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 32px 80px rgba(0,0,0,0.12);
  max-width: 480px;
  margin: 0 auto;
}

/* Header uses same gradient as the hero section */
.ticket-header {
  background: linear-gradient(135deg, var(--green-deep), var(--green-mid));
  padding: 24px;
  color: white;
}

/* Dashed divider between ticket body and QR section */
.ticket-divider {
  display: flex;
  align-items: center;
  margin: 16px -24px;
}
.ticket-divider::before,
.ticket-divider::after {
  content: '';
  flex: 1;
  border-top: 2px dashed #E2E8F0;
  margin: 0 24px;
}
/* The circular "notch" in the middle of the divider */
.ticket-dot {
  width: 28px;
  height: 28px;
  background: var(--cream);   /* matches page background */
  border-radius: 50%;
  border: 2px dashed #E2E8F0;
  flex-shrink: 0;
}
```

---

## Step 2: Generating the QR Code (Frontend vs Backend)

How does a string of text become a scannable square?

For the MVP, we use the lightweight library `qrcode.js` on the frontend. The backend sends the secure *hash* string (e.g. `"nr-ticket:4f8a92"`), and the frontend renders it as an image.

### Rendering a QR Code in HTML

```html
<!-- 1. The container for the QR code -->
<div id="qrcode"></div>

<!-- 2. Include the library -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>

<!-- 3. Generate it — using Design 1 dark colour for the QR itself -->
<script>
  new QRCode(document.getElementById("qrcode"), {
    text: "NR-2026-A8F2",        // The data the agent's scanner will read
    width: 180,
    height: 180,
    colorDark : "#1A1A1A",       // var(--charcoal) — dark squares
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H
  });
</script>
```

**The reference number below the QR:**
```css
.ticket-ref {
  font-size: 11px;
  color: var(--slate);
  margin-top: 8px;
  letter-spacing: 2px;
  text-align: center;
  font-family: 'Inter', sans-serif;
}
```

---

## Step 3: Security — Why Not Just Use the Booking ID?

**Crucial Security Concept:** You should *never* make the QR code data just the `bookingId` (like `1234`). 

If a malicious user knows the booking ID is `1234`, they could guess that `1235` is a valid ticket, generate their own QR code for `1235`, and steal someone else's seat!

Instead, we use a **Cryptographic Hash**.

When the backend creates the ticket, it does this (Node.js pseudo-code):
```javascript
const crypto = require('crypto');
// Create a random 16-character string
const qrHash = crypto.randomBytes(8).toString('hex'); 
```

The database stores `booking_id: 1234, qr_hash: "a1b2c3d4e5f6"`.
The QR code displays `"a1b2c3d4e5f6"`.

When the agent scans it, they send `"a1b2c3d4e5f6"` to the backend. It is completely un-guessable.

---

## Step 4: PDF Generation (Background Job)

While the HTML ticket is great for phones, some people want a PDF. 

Generating PDFs is computationally expensive for a Node.js server. If 50 people buy tickets at once, generating 50 PDFs will freeze your Express server.

**The Solution: Background Jobs (BullMQ)**
Instead of making the PDF immediately, the backend adds a "job" to a Redis queue. A separate "Worker" process picks up the job, creates the PDF using `PDFKit`, uploads it to Cloudflare R2 (cloud storage), and updates the database with the PDF URL.

For Phase 1, we will mock the PDF download button, but this is how the real system scales.

**Mock download button (Design 1 styling):**
```html
<button class="cta-outline" style="margin-top: 16px; width: 100%;">
  ⬇️ Download PDF Backup
</button>
```

Using the `.cta-outline` class from `components.css`:
```css
.cta-outline {
  background: transparent;
  color: var(--green-mid);
  border: 2px solid var(--green-mid);
  padding: 12px 28px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all .2s;
}
.cta-outline:hover {
  background: var(--green-mid);
  color: white;
}
```

---

## Next Steps
Now that the Traveller can search, book, pay, and get a ticket, the consumer app is complete!

Next, we switch gears and build the **Park Agent App** — the offline-first dashboard agents use to scan these exact QR codes.

**Checkpoint:** Your `ticket.html` should cleanly display a ticket card and generate a real QR code when opened. Compare it side-by-side with the ticket mockup in `dashboards/ui_traveller_design1.html` — the header gradient, dashed divider, and QR area must match.
