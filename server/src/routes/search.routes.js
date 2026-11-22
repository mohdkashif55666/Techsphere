import { Router } from 'express';
import Tool from '../models/Tool.model.js';
import SearchLog from '../models/SearchLog.model.js';
import { respond } from '../utils/respond.js';
import { asyncWrap } from '../middleware/asyncWrapper.js';

const router = Router();

// GET /api/v1/search/suggestions?q=
router.get(
  '/suggestions',
  asyncWrap(async (req, res) => {
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    if (!q) {
      return respond.ok(res, { suggestions: [] });
    }

    // Escape regex metacharacters: typing "(" or "[" used to make new RegExp() throw (500)
    const regex = new RegExp(`^${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');
    const tools = await Tool.find(
      { $or: [{ name: regex }, { tags: regex }] },
      { name: 1, slug: 1, type: 1 }
    )
      .limit(6)
      .lean();

    const suggestions = tools.map((t) => ({
      text: t.name,
      slug: t.slug,
      type: t.type,
    }));

    return respond.ok(res, { suggestions });
  })
);

// GET /api/v1/search/trending
router.get(
  '/trending',
  asyncWrap(async (_req, res) => {
    // Top 3 distinct queries from search log or fallback defaults
    const topLogs = await SearchLog.aggregate([
      { $match: { query: { $ne: '' } } },
      { $group: { _id: '$query', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 },
    ]);

    let trending = topLogs.map((l) => l._id);
    if (trending.length === 0) {
      trending = ['MERN Stack', 'DeepSeek-V3', 'Local Ollama'];
    }

    return respond.ok(res, { trending });
  })
);

export default router;
