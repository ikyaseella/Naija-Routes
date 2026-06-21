import express from 'express';
import { SearchService } from '../services/search.service.js';

const router = express.Router();

/**
 * GET /api/v1/routes/search
 * Search for available routes by origin, destination, and date.
 */
router.get('/search', async (req, res, next) => {
  try {
    const { origin, destination, date, passengers } = req.query;
    
    // In a real app, we'd use Joi/Zod to validate these required params
    if (!origin || !destination || !date) {
      return res.status(400).json({ error: 'Missing required search parameters' });
    }

    const results = await SearchService.findRoutes({ origin, destination, date, passengers });
    
    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    next(error);
  }
});

export default router;
