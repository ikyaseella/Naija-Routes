import express from 'express';

const router = express.Router();

/**
 * GET /api/v1/operators/:id/dashboard
 * Retrieve KPI data for the operator dashboard.
 */
router.get('/:id/dashboard', async (req, res, next) => {
  // Phase 1 Mock Implementation
  res.status(200).json({
    success: true,
    data: {
      revenueKobo: 84500000,
      ticketsSold: 68,
      activeDepartures: 12,
      occupancyPercentage: 82
    }
  });
});

/**
 * GET /api/v1/operators/:id/routes
 * Retrieve all routes managed by this operator.
 */
router.get('/:id/routes', async (req, res, next) => {
  res.status(501).json({ error: 'Not implemented in Phase 1 MVP' });
});

export default router;
