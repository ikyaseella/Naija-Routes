import express from 'express';
import { TicketService } from '../services/ticket.service.js';

const router = express.Router();

/**
 * GET /api/v1/tickets/:id
 * Retrieve a digital ticket by booking ID (includes QR Hash)
 */
router.get('/:id', async (req, res, next) => {
  try {
    const ticket = await TicketService.getTicketByBookingId(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/tickets/:hash/scan
 * Agent scans a QR code to board a passenger.
 */
router.post('/:hash/scan', async (req, res, next) => {
  try {
    const { hash } = req.params;
    
    // In Phase 2: extract agentId from the JWT token via auth middleware
    const agentId = 'mock-agent-123'; 

    const result = await TicketService.scanTicket(hash, agentId);
    
    res.status(200).json({
      success: true,
      message: 'Ticket scanned and passenger boarded successfully',
      data: result
    });
  } catch (error) {
    if (error.message.includes('Already scanned')) {
      return res.status(409).json({ error: 'This ticket has already been used' });
    }
    if (error.message.includes('Invalid ticket')) {
      return res.status(404).json({ error: 'Invalid QR Code' });
    }
    next(error);
  }
});

export default router;
