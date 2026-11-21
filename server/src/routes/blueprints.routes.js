import { Router } from 'express';
import Blueprint from '../models/Blueprint.model.js';
import { respond } from '../utils/respond.js';
import { asyncWrap } from '../middleware/asyncWrapper.js';

const router = Router();

// GET /api/v1/blueprints
router.get(
  '/',
  asyncWrap(async (req, res) => {
    const { pillar } = req.query;
    const filter = pillar ? { pillar } : {};

    const blueprints = await Blueprint.find(filter)
      .sort({ sortOrder: 1 })
      .lean();

    return respond.ok(res, { blueprints });
  })
);

// GET /api/v1/blueprints/:slug
router.get(
  '/:slug',
  asyncWrap(async (req, res) => {
    const { slug } = req.params;
    const blueprint = await Blueprint.findOne({ slug }).lean();

    if (!blueprint) {
      return respond.fail(res, 'Blueprint not found', 404);
    }

    return respond.ok(res, { blueprint });
  })
);

export default router;
