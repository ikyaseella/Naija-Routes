# 05 — Payment Integration (Paystack)
**Naija Routes · Instructor-Led Project · Phase 1 MVP**

---

## The Payment Problem in Nigeria

If Naija Routes was built in Europe, we could just use Stripe for credit cards. In Nigeria, the payment landscape is much more complex:
- **Card failures are common:** Users often face "Issuer Inoperative" errors.
- **Bank transfers are preferred:** Many users prefer sending money to a virtual account.
- **USSD is required:** For users without smartphone data.
- **Mobile Wallets are rising:** OPay and PalmPay are dominant.

This is why we use **Paystack**. It aggregates all these methods into a single popup checkout.

---

## Step 1: The Paystack Flow

Naija Routes never touches credit card numbers directly. We use Paystack's "Inline" checkout.

### The sequence:
1. User clicks "Proceed to Payment" on `booking.html`.
2. Frontend calls our API `POST /bookings` to lock the seat.
3. API returns `bookingId = 1234`.
4. Frontend loads the Paystack Javascript SDK.
5. Frontend calls `PaystackPop.setup({...})`.
6. User enters their card / does a bank transfer in the popup.
7. Paystack charges them and returns `status: "success"`.
8. **Crucial Step:** Frontend redirects to `ticket.html`.
9. **More Crucial Step:** Paystack sends a hidden **Webhook** to our backend to confirm the payment.

---

## Step 2: Webhooks (Why the frontend lies)

Never trust the frontend when it comes to money. 

If a user modifies the Javascript in their browser, they can trick the frontend into thinking the payment was successful. 

To prevent this, our backend *must* listen for Webhooks.
A webhook is simply Paystack calling an API endpoint on our server *directly* (Server-to-Server).

**Backend route (`payment.routes.js`):**
```javascript
router.post('/webhooks/paystack', (req, res) => {
  // 1. Verify the signature using our SECRET KEY to ensure it's actually Paystack
  
  // 2. Check the event type
  if (req.body.event === 'charge.success') {
    const bookingId = req.body.data.metadata.booking_id;
    const amount = req.body.data.amount;
    
    // 3. Update the database
    updateBookingStatus(bookingId, 'CONFIRMED');
    
    // 4. Generate the ticket QR Code
    generateTicket(bookingId);
  }
  
  res.status(200).send('OK');
});
```

---

## Step 3: Naira vs. Kobo

**Golden Rule of E-Commerce:** Never store money as a decimal (`₦12500.50`) in the database. Floating-point math in Javascript will eventually cause errors (e.g., `0.1 + 0.2 = 0.30000000000000004`).

**Always store money in its smallest unit.**
In Nigeria, this is the **Kobo** (100 Kobo = 1 Naira).

- ₦12,500 should be stored as `1250000` (integer) in PostgreSQL.
- When calling the Paystack API, you pass `amount: 1250000`.
- When displaying it on the frontend, you divide by 100: `amount / 100`.

---

## Step 4: Scaffold the Payment Service

For Phase 1, we will mock the payment in the UI, but we must build the backend structure for it.

Create the file:
```powershell
New-Item -ItemType File -Path "naija-routes\server\src\services\payment.service.js" -Force
```

**Stub implementation for now:**
```javascript
// naija-routes/server/src/services/payment.service.js

export class PaymentService {
  /**
   * We will implement the real Paystack API call here in Phase 2.
   * For now, this just simulates a successful payment.
   */
  static async verifyPayment(reference) {
    console.log(`Mock verification for ${reference}`);
    return {
      status: 'success',
      amount: 1300000 // 13,000 Naira in Kobo
    };
  }
}
```

---

## Next Steps
With the Traveller app and payments understood, we now move to the operational side of Naija Routes: The **Park Agent App**.

**Checkpoint:** Understand why we store money in Kobo and why Webhooks are essential for payment security.
