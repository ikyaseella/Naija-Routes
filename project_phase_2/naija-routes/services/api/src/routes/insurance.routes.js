import express from 'express';
import { InsuranceService } from '../services/insurance.service.js';

const router = express.Router();

router.get('/providers', async (req, res, next) => {
  try {
    const providers = await InsuranceService.getProviders();
    res.json({ success: true, data: providers });
  } catch (err) { next(err); }
});

router.get('/plans', async (req, res, next) => {
  try {
    const { providerId } = req.query;
    const plans = await InsuranceService.getPlans(providerId || null);
    res.json({ success: true, data: plans });
  } catch (err) { next(err); }
});

router.get('/plans/:planId', async (req, res, next) => {
  try {
    const plan = await InsuranceService.getPlan(req.params.planId);
    res.json({ success: true, data: plan });
  } catch (err) {
    if (err.message === 'Insurance plan not found') return res.status(404).json({ error: err.message });
    next(err);
  }
});

router.post('/purchase', async (req, res, next) => {
  try {
    const { userId, bookingId, planId, passengerName, travelDate, route } = req.body;
    if (!userId || !bookingId || !planId) {
      return res.status(400).json({ error: 'Missing required: userId, bookingId, planId' });
    }
    const purchase = await InsuranceService.purchaseInsurance({ userId, bookingId, planId, passengerName, travelDate, route });
    res.status(201).json({ success: true, data: purchase });
  } catch (err) {
    if (err.message === 'Invalid insurance plan') return res.status(400).json({ error: err.message });
    next(err);
  }
});

router.get('/purchases', async (req, res, next) => {
  try {
    const { userId } = req.query;
    const purchases = await InsuranceService.getPurchases(userId || null);
    res.json({ success: true, data: purchases });
  } catch (err) { next(err); }
});

router.get('/purchases/booking/:bookingId', async (req, res, next) => {
  try {
    const purchase = await InsuranceService.getPurchaseByBooking(req.params.bookingId);
    res.json({ success: true, data: purchase });
  } catch (err) { next(err); }
});

router.post('/claims', async (req, res, next) => {
  try {
    const { purchaseId, userId, type, description, amountKobo } = req.body;
    if (!purchaseId || !userId || !amountKobo) {
      return res.status(400).json({ error: 'Missing required: purchaseId, userId, amountKobo' });
    }
    const claim = await InsuranceService.fileClaim({ purchaseId, userId, type, description, amountKobo });
    res.status(201).json({ success: true, data: claim });
  } catch (err) {
    if (err.message === 'Insurance purchase not found') return res.status(404).json({ error: err.message });
    if (err.message.includes('policy owner')) return res.status(403).json({ error: err.message });
    next(err);
  }
});

router.get('/claims', async (req, res, next) => {
  try {
    const { userId } = req.query;
    const claims = await InsuranceService.getClaims(userId || null);
    res.json({ success: true, data: claims });
  } catch (err) { next(err); }
});

router.get('/claims/:id', async (req, res, next) => {
  try {
    const claim = await InsuranceService.getClaim(req.params.id);
    res.json({ success: true, data: claim });
  } catch (err) {
    if (err.message === 'Claim not found') return res.status(404).json({ error: err.message });
    next(err);
  }
});

router.patch('/claims/:id/status', async (req, res, next) => {
  try {
    const { status, resolution } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required' });
    const claim = await InsuranceService.updateClaimStatus(req.params.id, status, resolution);
    res.json({ success: true, data: claim });
  } catch (err) {
    if (err.message === 'Claim not found') return res.status(404).json({ error: err.message });
    if (err.message.includes('Invalid status')) return res.status(400).json({ error: err.message });
    next(err);
  }
});

export default router;
