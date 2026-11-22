import { Router } from 'express';
import Tool from '../models/Tool.model.js';
import SearchLog from '../models/SearchLog.model.js';
import { respond } from '../utils/respond.js';
import { asyncWrap } from '../middleware/asyncWrapper.js';

const router = Router();

// Query-string values are untrusted: Express parses ?a[$ne]=x into an object.
// Accepting plain strings only means no user input can ever become a Mongo operator,
// so the filter we build below (which legitimately uses $in / $gte / $or) must NOT
// be run through a "strip $ keys" sanitizer.
const asString = (v) => (typeof v === 'string' ? v.trim() : '');

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const PRICING_MODELS = ['free', 'freemium', 'paid', 'open-source'];

// A tool counts for a Task button when its categoryFit score (0-10) is at least this.
// At the old cutoff of 5, every Task button matched 15-16 of the 16 tools, so clicking
// one looked like the filter did nothing. 8 = "strong fit" and actually narrows the list.
const MIN_CATEGORY_FIT = 8;

// Fields the search box looks in. This deliberately includes bestFor / strengths / vendor:
// the old $text index only covered name, description and tags, so a query like
// "MERN Stack" (where "MERN" only appears in bestFor) found nothing.
const SEARCH_FIELDS = ['name', 'vendor', 'description', 'tags', 'bestFor', 'strengths'];

// GET /api/v1/tools - Text search + filters + sort + pagination
router.get(
  '/',
  asyncWrap(async (req, res) => {
    const q = asString(req.query.q);
    const category = asString(req.query.category);
    const pricing = asString(req.query.pricing);
    const reasoning = asString(req.query.reasoning);
    const speed = asString(req.query.speed);
    const uiLevel = asString(req.query.uiLevel);
    const openSource = asString(req.query.openSource);
    const runsLocally = asString(req.query.runsLocally);
    const sortBy = asString(req.query.sortBy) || 'featured';
    const page = asString(req.query.page) || '1';
    const limit = asString(req.query.limit) || '10';

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const filter = {};

    if (q) {
      // Case-insensitive substring match per word, across all SEARCH_FIELDS; a tool
      // matches if ANY word matches (same OR behaviour the old $text search had).
      const terms = [...new Set(q.split(/\s+/).filter((t) => t.length >= 2))].slice(0, 8);
      if (terms.length) {
        filter.$or = terms.flatMap((term) => {
          const rx = new RegExp(escapeRegex(term), 'i');
          return SEARCH_FIELDS.map((field) => ({ [field]: rx }));
        });
      }
    }

    // category becomes a field path (categoryFit.<category>), so only allow plain slugs
    if (category && /^[A-Za-z]+$/.test(category)) {
      filter[`categoryFit.${category}`] = { $gte: MIN_CATEGORY_FIT };
    }

    if (pricing) {
      const requested = pricing
        .split(',')
        .map((p) => p.trim())
        .filter((p) => PRICING_MODELS.includes(p));
      // "Free" in the UI means "costs nothing to start": free, freemium or open-source
      // (the seed data has no tool whose pricing.model is literally "free").
      if (requested.includes('free')) {
        requested.push('freemium', 'open-source');
      }
      if (requested.length) {
        filter['pricing.model'] = { $in: [...new Set(requested)] };
      }
    }

    if (reasoning) {
      const minReasoning = parseInt(reasoning, 10) || 0;
      filter['scores.reasoning'] = { $gte: minReasoning };
    }

    if (speed) {
      const minSpeed = parseInt(speed, 10) || 0;
      filter['scores.speed'] = { $gte: minSpeed };
    }

    if (uiLevel) {
      const minUi = parseInt(uiLevel, 10) || 0;
      filter['scores.uiDesignSense'] = { $gte: minUi };
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

    const queryObj = Tool.find(filter)
      .populate('openAlternatives', 'name slug vendor type pricing capabilities')
      .populate('commercialEquivalents', 'name slug vendor type pricing capabilities');

    const [tools, total] = await Promise.all([
      queryObj.sort(sort).skip(skip).limit(limitNum).lean(),
      Tool.countDocuments(filter),
    ]);

    // Log query asynchronously
    if (q) {
      SearchLog.create({
        query: q,
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
