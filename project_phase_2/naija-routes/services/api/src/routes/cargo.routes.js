import express from 'express';
import { CargoService } from '../services/cargo.service.js';

const router = express.Router();

router.get('/operators', async (req, res, next) => {
  try {
    const operators = await CargoService.getOperators();
    res.json({ success: true, data: operators });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { shipperId, shipperName, shipperPhone, operatorId, origin, destination, travelDate, weightKg, description, recipientName, recipientPhone } = req.body;

    if (!shipperId || !shipperName || !shipperPhone || !operatorId || !origin || !destination || !travelDate || !weightKg || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const booking = await CargoService.createBooking({ shipperId, shipperName, shipperPhone, operatorId, origin, destination, travelDate, weightKg, description, recipientName, recipientPhone });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    if (error.message.startsWith('Invalid') || error.message.startsWith('Weight') || error.message.startsWith('Recipient')) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
});

router.get('/waybill/:waybillNo', async (req, res, next) => {
  try {
    const booking = await CargoService.getBookingByWaybill(req.params.waybillNo);
    if (!booking) {
      return res.status(404).json({ error: 'Waybill not found' });
    }
    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
});

router.get('/user/:userId', async (req, res, next) => {
  try {
    const bookings = await CargoService.getUserBookings(req.params.userId);
    res.json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
});

router.get('/operator/:operatorId', async (req, res, next) => {
  try {
    const bookings = await CargoService.getOperatorBookings(req.params.operatorId);
    res.json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await CargoService.updateStatus(req.params.id, status);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json({ success: true, data: booking });
  } catch (error) {
    if (error.message.startsWith('Invalid')) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
});

export default router;
