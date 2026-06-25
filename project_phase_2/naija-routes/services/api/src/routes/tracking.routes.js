import express from 'express';
import { TrackingService } from '../services/tracking.service.js';

const router = express.Router();

router.get('/vehicle/:vehicleId', async (req, res, next) => {
  try {
    const { vehicleId } = req.params;
    const location = await TrackingService.getVehicleLocation(vehicleId);
    if (!location) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json({ success: true, data: location });
  } catch (error) {
    next(error);
  }
});

router.get('/vehicle/:vehicleId/history', async (req, res, next) => {
  try {
    const { vehicleId } = req.params;
    const minutes = parseInt(req.query.minutes) || 30;
    const history = await TrackingService.getTrackingHistory(vehicleId, minutes);
    res.json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
});

router.get('/fleet/:operatorId', async (req, res, next) => {
  try {
    const { operatorId } = req.params;
    const fleet = await TrackingService.getOperatorFleet(operatorId);
    res.json({ success: true, data: fleet });
  } catch (error) {
    next(error);
  }
});

router.get('/active', async (req, res, next) => {
  try {
    const active = await TrackingService.getAllActiveVehicles();
    res.json({ success: true, data: active });
  } catch (error) {
    next(error);
  }
});

export default router;
