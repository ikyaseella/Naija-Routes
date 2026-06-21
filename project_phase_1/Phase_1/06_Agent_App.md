# 06 — Park Agent App
**Naija Routes · Instructor-Led Project · Phase 1 MVP**

---

## The Reality of Nigerian Motor Parks

To build software for Nigerian motor parks, you must understand the environment:
- **Bright Sunlight:** Glare makes standard white UIs impossible to read.
- **Chaos & Speed:** Agents are managing screaming touts, luggage, and impatient passengers. They cannot navigate 5 different screens to sell one ticket.
- **Spotty Internet:** The network will drop. The app *must* still work.
- **Battery Drain:** Agents use cheap Android phones on 15% battery.

This is why the Park Agent App is built differently than the Traveller App.

### The UI Theme: "Field Terminal" (Design 1)
We use the **Design 1 "Field Terminal"** theme for the Agent App.

> 🎨 **Open the reference:** `dashboards/ui_agent_design1.html` — this is your canonical visual reference for the agent interface.

**Design 1 — "Field Terminal" Colour Palette:**
- **Background:** Dark Forest (`#0F1710`)
- **Surface Cards:** `#1A2B1D`
- **Text:** Light Mint/White (`#E8F5EA`)
- **Primary Green:** `#3CB371`
- **Accent (Gold):** `#FCD34D`

**Typography:**
- **Headings/UI:** `Space Grotesk` (clean, wide, readable)
- **Data/Numbers:** `Space Mono` (monospace for exact number alignment on receipts and prices)

---

## Step 1: Create the Agent App Structure

Run this in your terminal:
```powershell
New-Item -ItemType Directory -Path "naija-routes\apps\agent\css" -Force
New-Item -ItemType Directory -Path "naija-routes\apps\agent\js" -Force
New-Item -ItemType File -Path "naija-routes\apps\agent\css\agent.css" -Force
New-Item -ItemType File -Path "naija-routes\apps\agent\index.html" -Force
New-Item -ItemType File -Path "naija-routes\apps\agent\sell.html" -Force
New-Item -ItemType File -Path "naija-routes\apps\agent\scan.html" -Force
New-Item -ItemType File -Path "naija-routes\apps\agent\reconcile.html" -Force
New-Item -ItemType File -Path "naija-routes\apps\agent\js\scanner.js" -Force
New-Item -ItemType File -Path "naija-routes\apps\agent\js\sell.js" -Force
```

---

## Step 2: The Core Views

### 1. The Dashboard (`index.html`)
The agent's home screen. It shows:
- **Cash in hand:** (Total cash collected today).
- **Tickets Sold:** (Count for today).
- **Giant Action Buttons:** "SELL TICKET" and "SCAN QR".

### 2. Walk-up Sales (`sell.html`)
Not everyone books online. Agents must sell tickets to walk-up passengers.
The flow must be fast:
1. Select Route (e.g. Lagos → Abuja).
2. Enter Phone Number (NIN/Name auto-fills if they are a returning customer).
3. Select Seat.
4. Collect Cash → Print physical receipt (Bluetooth thermal printer) or send SMS.

### 3. QR Scanner (`scan.html`)
When an online Traveller arrives, the agent clicks "Scan". 
We use the `html5-qrcode` library to open the phone's camera right in the browser.

```html
<!-- Include the library in scan.html -->
<script src="https://unpkg.com/html5-qrcode"></script>

<div id="reader" width="600px"></div>

<script>
  function onScanSuccess(decodedText, decodedResult) {
    // decodedText is the QR Hash (e.g., "NR-2026-A8F2")
    // Call the backend to validate and board the passenger
    validateTicket(decodedText);
  }
  
  let html5QrcodeScanner = new Html5QrcodeScanner(
    "reader", { fps: 10, qrbox: 250 }
  );
  html5QrcodeScanner.render(onScanSuccess);
</script>
```

### 4. Cash Reconciliation (`reconcile.html`)
At the end of the day, the agent must remit the cash collected to the park manager or operator bank account.
This page tallies the exact cash expected and allows the agent to submit their daily report.

---

## Step 3: Offline-First Strategy (IndexedDB)

If the network drops while selling a walk-up ticket, the agent cannot tell the passenger to "wait for MTN to come back." 

We use **IndexedDB** — a database built directly into the mobile browser.

**The Offline Flow:**
1. Agent clicks "Confirm Sale".
2. JS checks `navigator.onLine`.
3. If offline, the sale data is saved to IndexedDB.
4. The UI immediately shows "Success" and prints the receipt.
5. In the background, a Service Worker continually checks for internet.
6. When the internet returns, the Service Worker reads IndexedDB and silently `POST`s the sales to the Express backend.

*(Instructor note: Setting up the full Service Worker is covered in Phase 3. For Phase 1, we will mock the local queue in `sell.js`).*

---

## Next Steps
Now that you understand the constraints, it's time to build the Agent App HTML files using the high-contrast dark theme.

**Checkpoint:** Ensure you have created the 4 HTML files and the dark CSS file.
