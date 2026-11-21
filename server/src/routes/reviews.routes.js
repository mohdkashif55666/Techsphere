import { Router } from 'express';
import { z } from 'zod';
import Review from '../models/Review.model.js';
import Tool from '../models/Tool.model.js';
import { respond } from '../utils/respond.js';
import { asyncWrap } from '../middleware/asyncWrapper.js';
import { validate } from '../middleware/validate.middleware.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

const createReviewSchema = z.object({
  toolId: z.string(),
  rating: z.number().min(1).max(5),
  body: z.string().max(1000).optional().default(''),
});

// GET /api/v1/reviews?toolId=
router.get(
  '/',
  asyncWrap(async (req, res) => {
    const { toolId } = req.query;
    const filter = { approved: true };
    if (toolId) filter.tool = toolId;

    const reviews = await Review.find(filter)
      .populate('user', 'name avatarInitials')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return respond.ok(res, { reviews });
  })
);

// POST /api/v1/reviews
router.post(
  '/',
  requireAuth,
  validate(createReviewSchema),
  asyncWrap(async (req, res) => {
    const { toolId, rating, body } = req.body;

    const tool = await Tool.findById(toolId);
    if (!tool) {
      return respond.fail(res, 'Tool not found', 404);
    }

    // Auto-approve or queue for moderation
    const review = await Review.create({
      tool: toolId,
      user: req.user._id,
      rating,
      body,
      approved: true, // Auto-approve for demo simplicity
    });

    // Update tool average rating and count
    const stats = await Review.aggregate([
      { $match: { tool: tool._id, approved: true } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    if (stats.length > 0) {
      tool.avgRating = parseFloat(stats[0].avg.toFixed(1));
      tool.ratingCount = stats[0].count;
      await tool.save();
    }

    return respond.ok(res, { review }, 201);
  })
);

export default router;
