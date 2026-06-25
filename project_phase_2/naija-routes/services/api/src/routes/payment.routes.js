import express from 'express';
import { PaymentService } from '../services/payment.service.js';

const router = express.Router();

router.post('/initiate', (req, res, next) => {
  try {
    const { bookingId, userId, method, amountKobo, metadata } = req.body;
    if (!bookingId || !userId || !method || !amountKobo) {
      return res.status(400).json({ error: 'Missing required fields: bookingId, userId, method, amountKobo' });
    }
    const payment = PaymentService.initiatePayment({ bookingId, userId, method, amountKobo, metadata });
    res.status(201).json({ success: true, data: payment });
  } catch (err) {
    if (err.message.includes('Invalid payment method') || err.message.includes('Amount must be greater')) {
      return res.status(400).json({ error: err.message });
    }
    if (err.message === 'Insufficient balance') {
      return res.status(402).json({ error: err.message });
    }
    next(err);
  }
});

router.post('/:id/confirm', (req, res, next) => {
  try {
    const payment = PaymentService.confirmPayment(req.params.id);
    res.json({ success: true, data: payment });
  } catch (err) {
    if (err.message === 'Payment not found') return res.status(404).json({ error: err.message });
    if (err.message.includes('already')) return res.status(409).json({ error: err.message });
    next(err);
  }
});

router.post('/:id/fail', (req, res, next) => {
  try {
    const payment = PaymentService.failPayment(req.params.id);
    res.json({ success: true, data: payment });
  } catch (err) {
    if (err.message === 'Payment not found') return res.status(404).json({ error: err.message });
    if (err.message.includes('already')) return res.status(409).json({ error: err.message });
    next(err);
  }
});

router.get('/:id', (req, res, next) => {
  try {
    const payment = PaymentService.getPayment(req.params.id);
    res.json({ success: true, data: payment });
  } catch (err) {
    if (err.message === 'Payment not found') return res.status(404).json({ error: err.message });
    next(err);
  }
});

router.get('/user/:userId', (req, res, next) => {
  try {
    const payments = PaymentService.getPaymentsByUser(req.params.userId);
    res.json({ success: true, data: payments });
  } catch (err) {
    next(err);
  }
});

router.get('/booking/:bookingId', (req, res, next) => {
  try {
    const payments = PaymentService.getPaymentsByBooking(req.params.bookingId);
    res.json({ success: true, data: payments });
  } catch (err) {
    next(err);
  }
});

router.get('/stats/all', (req, res) => {
  const stats = PaymentService.getStats();
  res.json({ success: true, data: stats });
});

export default router;
