# 20 — Cargo: Backend API
**Naija Routes · Instructor-Led Project · Phase 2**

---

## 1. What We Are Building

Cargo allows passengers to ship goods through the same transport operators they travel with. A shipper drops off an item at the motor park, an agent logs it with a waybill, and the recipient picks it up at the destination.

The database already has a `cargo_bookings` table with fields for waybill number, weight, origin/destination, recipient info, and status tracking.

---

## 2. The Cargo Service

File: `services/api/src/services/cargo.service.js`

### Mock Data

The service maintains an in-memory array of 4 sample cargo bookings:

| Waybill | Shipper | Route | Weight | Status |
|---|---|---|---|---|
| NR-20260625-A7F3 | Emeka Okonkwo | Lagos → Abuja | 15.5 kg | confirmed |
| NR-20260626-B8G4 | Fatima Bello | Kano → Lagos | 8.0 kg | pending |
| NR-20260627-C9H5 | Chisom Eze | Enugu → Port Harcourt | 22.0 kg | in_transit |
| NR-20260624-D1I6 | David Mark | Lagos → Ibadan | 5.0 kg | delivered |

Each booking includes: `shipperId`, `shipperName`, `shipperPhone`, `operatorId`, `operatorName`, `origin`, `destination`, `travelDate`, `weightKg`, `description`, `waybillNo`, `status`, `recipientName`, `recipientPhone`, `priceKobo`, `createdAt`, `updatedAt`.

### Available Operators

The service defines 2 operators with their serviceable routes:

```javascript
const OPERATORS = {
  'op-abc': { name: 'ABC Transport Ltd', routes: ['Lagos', 'Abuja', 'Ibadan', 'Kano'] },
  'op-gu001': { name: 'GUO Transport', routes: ['Lagos', 'Abuja', 'Enugu', 'Port Harcourt'] },
};
```

### Methods

| Method | Description |
|---|---|
| `createBooking({...})` | Validates inputs, generates waybill number (NR-YYYYMMDD-XXXX), calculates price (₦200/kg), creates booking |
| `getBookingByWaybill(waybillNo)` | Lookup by waybill number — public-facing |
| `getBookingById(id)` | Lookup by internal ID |
| `getUserBookings(userId)` | All bookings for a shipper |
| `getOperatorBookings(operatorId)` | All bookings for an operator |
| `updateStatus(id, status)` | Change status (validates against allowed values) |
| `getOperators()` | Return available operators with their routes |

### Waybill Number Format

```
NR-YYYYMMDD-XXXX
│  │         └── 4 random uppercase alphanumeric
│  └──────────── travel date
└─────────────── Naija Routes prefix
```

This format matches the database schema comment: `Waybill format: NR-YYYYMMDD-XXXX`.

### Validation Rules

| Field | Rule |
|---|---|
| `weightKg` | Must be 1–500 kg |
| `recipientName` | Required |
| `recipientPhone` | Required |
| `operatorId` | Must match a known operator |
| `status` | Must be one of: pending, confirmed, in_transit, delivered, cancelled |

### Pricing

Price is calculated at a flat rate of **₦200 per kg** (converted to kobo: `weightKg × 20000`):

```javascript
const pricePerKg = 20000; // ₦200 in kobo
const priceKobo = Math.round(weightKg * pricePerKg);
```

---

## 3. The Cargo Routes

File: `services/api/src/routes/cargo.routes.js`

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/cargo/operators` | List available operators with their routes |
| `POST` | `/api/v1/cargo` | Create a new cargo booking |
| `GET` | `/api/v1/cargo/waybill/:waybillNo` | Lookup by waybill (public tracking) |
| `GET` | `/api/v1/cargo/user/:userId` | Get all bookings for a user |
| `GET` | `/api/v1/cargo/operator/:operatorId` | Get all bookings for an operator |
| `PATCH` | `/api/v1/cargo/:id/status` | Update booking status |

**POST /api/v1/cargo** — Request body:
```json
{
  "shipperId": "usr-emeka",
  "shipperName": "Emeka Okonkwo",
  "shipperPhone": "08031234567",
  "operatorId": "op-abc",
  "origin": "Lagos",
  "destination": "Abuja",
  "travelDate": "2026-06-25",
  "weightKg": 10,
  "description": "Box of books",
  "recipientName": "Chisom Okafor",
  "recipientPhone": "08079876543"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "waybillNo": "NR-20260625-X7K2",
    "status": "pending",
    "priceKobo": 200000,
    ...
  }
}
```

---

## 4. Activation in app.js

```javascript
import cargoRouter from './routes/cargo.routes.js';
app.use('/api/v1/cargo', cargoRouter);
```

Health check updates to:
```javascript
phase: 'Phase 2 — Core Growth (Reviews + Live Tracking + Cargo)'
```

---

## 5. Testing the API

```bash
# List operators
curl http://localhost:3000/api/v1/cargo/operators

# Lookup by waybill
curl http://localhost:3000/api/v1/cargo/waybill/NR-20260625-A7F3

# Get operator bookings
curl http://localhost:3000/api/v1/cargo/operator/op-abc

# Create a new booking
curl -X POST http://localhost:3000/api/v1/cargo \
  -H "Content-Type: application/json" \
  -d '{"shipperId":"usr-test","shipperName":"Test User","shipperPhone":"08000000000","operatorId":"op-abc","origin":"Lagos","destination":"Abuja","travelDate":"2026-07-01","weightKg":5,"description":"Sample cargo","recipientName":"John Doe","recipientPhone":"08011111111"}'

# Update status
curl -X PATCH http://localhost:3000/api/v1/cargo/cgo-002/status \
  -H "Content-Type: application/json" \
  -d '{"status":"confirmed"}'
```

---

## 6. Cargo Status Flow

```
pending ──→ confirmed ──→ in_transit ──→ delivered
    │                                                      
    └─────────→ cancelled (from any state except delivered)
```

The status lifecycle mirrors a real logistics workflow:
1. **Pending** — waybill created, awaiting confirmation
2. **Confirmed** — operator has accepted the shipment
3. **In Transit** — goods are on the bus
4. **Delivered** — recipient has collected
5. **Cancelled** — shipment was cancelled

---

> 💡 **Key Insight:** The cargo feature follows the same mock-service pattern as reviews and tracking. The schema, validation, and business logic are fully built — only the data source needs to change in Phase 3 (from in-memory array to PostgreSQL).
