import { Router } from 'express';
import RegistryEntry from '../models/RegistryEntry.model.js';
import Tool from '../models/Tool.model.js';
import { respond } from '../utils/respond.js';
import { asyncWrap } from '../middleware/asyncWrapper.js';

const router = Router();

// GET /api/v1/registry
router.get(
  '/',
  asyncWrap(async (req, res) => {
    const { category, limit = 20 } = req.query;
    const filter = category ? { category } : {};

    const [entries, latestTool] = await Promise.all([
      RegistryEntry.find(filter)
        .sort({ sortOrder: 1 })
        .limit(parseInt(limit, 10) || 20)
        .populate('commercialTool', 'name slug vendor type scores pricing')
        .populate('openTool', 'name slug vendor type scores pricing')
        .lean(),
      Tool.findOne({}, { lastVerifiedAt: 1 }).sort({ lastVerifiedAt: -1 }).lean(),
    ]);

    const latestYear = latestTool?.lastVerifiedAt
      ? new Date(latestTool.lastVerifiedAt).getFullYear()
      : 2026;

    return respond.ok(res, {
      entries,
      meta: {
        total: entries.length,
        latestYear,
        updatedBadge: `Updated ${latestYear}`,
      },
    });
  })
);

export default router;
