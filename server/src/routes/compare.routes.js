import { Router } from 'express';
import Tool from '../models/Tool.model.js';
import { respond } from '../utils/respond.js';
import { asyncWrap } from '../middleware/asyncWrapper.js';

const router = Router();

// GET /api/v1/compare?slugs=a,b,c
router.get(
  '/',
  asyncWrap(async (req, res) => {
    const { slugs } = req.query;
    if (!slugs) {
      return respond.fail(res, 'Slugs parameter is required', 400);
    }

    const slugList = slugs
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 3); // Max 3 tools

    if (slugList.length === 0) {
      return respond.fail(res, 'At least one valid slug must be provided', 400);
    }

    const tools = await Tool.find({ slug: { $in: slugList } })
      .populate('openAlternatives', 'name slug vendor type pricing')
      .populate('commercialEquivalents', 'name slug vendor type pricing')
      .lean();

    return respond.ok(res, { tools });
  })
);

export default router;
