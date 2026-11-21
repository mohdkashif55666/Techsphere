import { Router } from 'express';
import Tool from '../models/Tool.model.js';
import User from '../models/User.model.js';
import Review from '../models/Review.model.js';
import SearchLog from '../models/SearchLog.model.js';
import Blueprint from '../models/Blueprint.model.js';
import TerminalTemplate from '../models/TerminalTemplate.model.js';
import PromptTemplate from '../models/PromptTemplate.model.js';
import { respond } from '../utils/respond.js';
import { asyncWrap } from '../middleware/asyncWrapper.js';
import { requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// Protect all admin routes
router.use(requireAdmin);

// GET /api/v1/admin/analytics
router.get(
  '/analytics',
  asyncWrap(async (_req, res) => {
    const [
      totalTools,
      totalUsers,
      totalReviews,
      totalBlueprints,
      totalTemplates,
      totalPrompts,
      recentSearches,
    ] = await Promise.all([
      Tool.countDocuments(),
      User.countDocuments(),
      Review.countDocuments(),
      Blueprint.countDocuments(),
      TerminalTemplate.countDocuments(),
      PromptTemplate.countDocuments(),
      SearchLog.find().sort({ createdAt: -1 }).limit(10).lean(),
    ]);

    return respond.ok(res, {
      counts: {
        tools: totalTools,
        users: totalUsers,
        reviews: totalReviews,
        blueprints: totalBlueprints,
        terminalTemplates: totalTemplates,
        prompts: totalPrompts,
      },
      recentSearches,
    });
  })
);

// GET /api/v1/admin/tools - List all tools for management
router.get(
  '/tools',
  asyncWrap(async (_req, res) => {
    const tools = await Tool.find().sort({ name: 1 }).lean();
    return respond.ok(res, { tools });
  })
);

// POST /api/v1/admin/tools - Create new tool
router.post(
  '/tools',
  asyncWrap(async (req, res) => {
    const tool = await Tool.create(req.body);
    return respond.ok(res, { tool }, 201);
  })
);

// PUT /api/v1/admin/tools/:id - Update tool
router.put(
  '/tools/:id',
  asyncWrap(async (req, res) => {
    const { id } = req.params;
    const tool = await Tool.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!tool) {
      return respond.fail(res, 'Tool not found', 404);
    }
    return respond.ok(res, { tool });
  })
);

// DELETE /api/v1/admin/tools/:id - Delete tool
router.delete(
  '/tools/:id',
  asyncWrap(async (req, res) => {
    const { id } = req.params;
    const tool = await Tool.findByIdAndDelete(id);
    if (!tool) {
      return respond.fail(res, 'Tool not found', 404);
    }
    return respond.ok(res, { message: 'Tool deleted successfully' });
  })
);

// GET /api/v1/admin/reviews - Moderation queue
router.get(
  '/reviews',
  asyncWrap(async (_req, res) => {
    const reviews = await Review.find()
      .populate('tool', 'name slug')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .lean();
    return respond.ok(res, { reviews });
  })
);

// PUT /api/v1/admin/reviews/:id/approve
router.put(
  '/reviews/:id/approve',
  asyncWrap(async (req, res) => {
    const { id } = req.params;
    const review = await Review.findByIdAndUpdate(
      id,
      { approved: true },
      { new: true }
    );
    if (!review) return respond.fail(res, 'Review not found', 404);
    return respond.ok(res, { review });
  })
);

export default router;
