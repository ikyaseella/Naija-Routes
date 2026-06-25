import express from 'express';
import { BookingService } from '../services/booking.service.js';

const router = express.Router();

/**
 * POST /api/v1/bookings
 * Lock a seat and create a pending booking.
 */
router.post('/', async (req, res, next) => {
  try {
    const { scheduleId, seatNo, passenger } = req.body;
    
    // 1. Validate payload
    if (!scheduleId || !seatNo || !passenger) {
      return res.status(400).json({ error: 'Invalid booking data' });
    }

    // 2. Call Service to handle Redis locking and DB creation
    const booking = await BookingService.createBooking({ scheduleId, seatNo, passenger });
    
    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    // If seat is taken, service will throw an error that we handle here
    if (error.message.includes('Seat unavailable')) {
      return res.status(409).json({ error: 'Seat is no longer available' });
    }
    next(error);
  }
});

/**
 * GET /api/v1/bookings/:id
 * Retrieve booking details.
 */
router.get('/:id', async (req, res, next) => {
  // Implementation deferred to Phase 2
  res.status(501).json({ error: 'Not implemented in Phase 1 MVP' });
});

export default router;
