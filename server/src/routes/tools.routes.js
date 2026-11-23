import { Router } from 'express';
import Tool from '../models/Tool.model.js';
import SearchLog from '../models/SearchLog.model.js';
import { respond } from '../utils/respond.js';
import { asyncWrap } from '../middleware/asyncWrapper.js';

const router = Router();

// GET /api/v1/tools - Text search + filters + sort + pagination
router.get(
  '/',
  asyncWrap(async (req, res) => {
    const {
      q,
      category,
      pricing,
      reasoning,
      speed,
      uiLevel,
      openSource,
      runsLocally,
      page = 1,
      limit = 10,
      sortBy = 'featured',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const filter = {};

    if (q && q.trim()) {
      const cleanQ = q.trim();
      const escaped = cleanQ.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { name: { $regex: escaped, $options: 'i' } },
        { description: { $regex: escaped, $options: 'i' } },
        { tags: { $regex: escaped, $options: 'i' } },
        { vendor: { $regex: escaped, $options: 'i' } },
      ];
    }

    if (category) {
      const safeCategory = String(category).replace(/[^a-zA-Z0-9]/g, '');
      if (safeCategory) {
        filter[`categoryFit.${safeCategory}`] = { $gte: 5 };
      }
    }

    if (pricing) {
      const pricingList = String(pricing)
        .split(',')
        .map((p) => p.trim())
        .filter((p) => ['free', 'freemium', 'paid', 'open-source'].includes(p));
      if (pricingList.length > 0) {
        filter['pricing.model'] = { $in: pricingList };
      }
    }

    if (reasoning) {
      const minReasoning = parseInt(reasoning, 10) || 0;
      if (minReasoning > 0) filter['scores.reasoning'] = { $gte: minReasoning };
    }

    if (speed) {
      const minSpeed = parseInt(speed, 10) || 0;
      if (minSpeed > 0) filter['scores.speed'] = { $gte: minSpeed };
    }

    if (uiLevel) {
      const minUi = parseInt(uiLevel, 10) || 0;
      if (minUi > 0) filter['scores.uiDesignSense'] = { $gte: minUi };
    }

    if (openSource === 'true') {
      filter['capabilities.openSource'] = true;
    }

    if (runsLocally === 'true') {
      filter['capabilities.runsLocally'] = true;
    }

    let sort = {};
    if (sortBy === 'rating') {
      sort = { avgRating: -1 };
    } else if (sortBy === 'newest') {
      sort = { lastVerifiedAt: -1 };
    } else if (sortBy === 'name') {
      sort = { name: 1 };
    } else {
      sort = { isFeatured: -1, avgRating: -1, name: 1 };
    }

    let queryObj = Tool.find(filter)
      .populate('openAlternatives', 'name slug vendor type pricing capabilities')
      .populate('commercialEquivalents', 'name slug vendor type pricing capabilities');

    const [tools, total] = await Promise.all([
      queryObj.sort(sort).skip(skip).limit(limitNum).lean(),
      Tool.countDocuments(filter),
    ]);

    // Log query asynchronously
    if (q && q.trim()) {
      SearchLog.create({
        query: q.trim(),
        filters: { category, pricing, openSource, runsLocally },
        resultCount: total,
      }).catch(() => {});
    }

    return respond.ok(res, {
      tools,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  })
);

// GET /api/v1/tools/:slug
router.get(
  '/:slug',
  asyncWrap(async (req, res) => {
    const { slug } = req.params;
    const tool = await Tool.findOne({ slug })
      .populate('openAlternatives')
      .populate('commercialEquivalents');

    if (!tool) {
      return respond.fail(res, 'Tool not found', 404);
    }

    return respond.ok(res, { tool });
  })
);

export default router;
