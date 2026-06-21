/**
 * Ticket Service
 * Handles generating and verifying cryptographic QR hashes for tickets.
 */

import crypto from 'crypto';

export class TicketService {
  
  /**
   * Retrieves a ticket for a confirmed booking
   */
  static async getTicketByBookingId(bookingId) {
    // Phase 1 Mock Implementation
    console.log(`[TicketService] Fetching ticket for booking ${bookingId}`);
    
    return {
      id: 'tkt-1',
      bookingId,
      qrCodeHash: 'NR-TICKET-8A92-F1-HASH-SECURE',
      passengerName: 'Emeka Okonkwo',
      seatNo: '3C',
      route: 'Lagos → Abuja',
      departureTime: '2026-12-25T06:30:00Z',
      status: 'ACTIVE'
    };
  }

  /**
   * Called when an agent scans a QR Code
   */
  static async scanTicket(hash, agentId) {
    // 1. Verify hash exists in database
    // const ticket = await db.query('SELECT * FROM tickets WHERE qr_code_hash = $1', [hash]);
    // if (!ticket) throw new Error('Invalid ticket');

    // 2. Check if already scanned
    // if (ticket.scanned_at) throw new Error('Already scanned');

    // 3. Mark as scanned
    // await db.query('UPDATE tickets SET scanned_at = NOW(), scanned_by_agent_id = $1 WHERE id = $2', [agentId, ticket.id]);

    console.log(`[TicketService] Ticket ${hash} successfully scanned by agent ${agentId}`);

    return {
      passengerName: 'Emeka Okonkwo',
      seatNo: '3C',
      scannedAt: new Date().toISOString()
    };
  }

  /**
   * Utility to generate a new cryptographically secure QR hash
   */
  static generateHash() {
    return `NR-TICKET-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
  }
}
