import express from 'express';
import { ReviewService } from '../services/review.service.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { userId, bookingId, operatorId, ratings, body } = req.body;

    if (!userId || !bookingId || !operatorId || !ratings) {
      return res.status(400).json({ error: 'Missing required fields: userId, bookingId, operatorId, ratings' });
    }

    if (!ratings.operator || ratings.operator < 1 || ratings.operator > 5) {
      return res.status(400).json({ error: 'Operator rating must be between 1 and 5' });
    }

    const review = await ReviewService.createReview({ userId, bookingId, operatorId, ratings, body });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
});

router.get('/operator/:operatorId', async (req, res, next) => {
  try {
    const { operatorId } = req.params;
    const reviews = await ReviewService.getOperatorReviews(operatorId);
    const averages = await ReviewService.getOperatorAverageRating(operatorId);

    res.json({
      success: true,
      data: {
        reviews,
        averages
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get('/operator/:operatorId/averages', async (req, res, next) => {
  try {
    const { operatorId } = req.params;
    const averages = await ReviewService.getOperatorAverageRating(operatorId);

    res.json({ success: true, data: averages });
  } catch (error) {
    next(error);
  }
});

export default router;
