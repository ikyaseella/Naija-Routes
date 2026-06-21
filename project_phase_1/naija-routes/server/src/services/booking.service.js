/**
 * Booking Service
 * Handles the state machine for creating bookings and locking seats.
 */

export class BookingService {
  /**
   * Lock a seat and create a pending booking.
   */
  static async createBooking({ scheduleId, seatNo, passenger }) {
    // 1. Check Redis to see if seat is locked
    // const isLocked = await redis.get(`seat_lock:${scheduleId}:${seatNo}`);
    // if (isLocked) throw new Error('Seat unavailable');

    // 2. Lock the seat in Redis for 10 minutes
    // await redis.set(`seat_lock:${scheduleId}:${seatNo}`, passenger.phone, 'EX', 600);

    // 3. Create booking in PostgreSQL
    // const booking = await db.query('INSERT INTO bookings ... RETURNING *');

    console.log(`[BookingService] Locked seat ${seatNo} on schedule ${scheduleId} for ${passenger.fullName}`);

    return {
      id: `bk-${Date.now()}`,
      status: 'PENDING',
      scheduleId,
      seatNo,
      passengerName: passenger.fullName,
      expiresAt: new Date(Date.now() + 10 * 60000).toISOString()
    };
  }
}
