import { apiClient } from '../core/api.js';

/**
 * Booking Module Logic
 * Handles the seat selection state machine, form validation, and checkout API call.
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('bookingForm');
  const checkoutBtn = document.getElementById('checkoutBtn');
  
  if (!form || !checkoutBtn) return;

  // Form submission handler (Checkout)
  checkoutBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    // 1. Validate Form
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const passengerDetails = {
      fullName: document.getElementById('fullName').value,
      phone: document.getElementById('phone').value,
      nokName: document.getElementById('nokName').value,
      nokPhone: document.getElementById('nokPhone').value
    };

    const seatNo = document.getElementById('summarySeat').textContent;
    if (seatNo === '—') {
      alert('Please select a seat first.');
      return;
    }

    // 2. Lock Seat and Create Booking via API
    try {
      checkoutBtn.disabled = true;
      checkoutBtn.textContent = 'Locking Seat...';

      // Example of actual API call:
      /*
      const payload = {
        scheduleId: 'mock-schedule-id',
        seatNo: seatNo,
        passenger: passengerDetails
      };
      
      const response = await apiClient.post('/bookings', payload);
      const bookingId = response.data.id;
      
      // 3. Trigger Paystack (Mocked for Phase 1 UI)
      initiatePaystack(bookingId, passengerDetails.phone);
      */

      // Mock delay for UI
      setTimeout(() => {
        window.location.href = 'ticket.html';
      }, 1500);

    } catch (error) {
      alert(error.message || 'Failed to create booking. Seat may be taken.');
      checkoutBtn.disabled = false;
      checkoutBtn.textContent = 'Proceed to Payment';
    }
  });
});

function initiatePaystack(bookingId, phone) {
  // Paystack inline script logic would go here
  console.log(`Starting payment for booking ${bookingId}`);
}
