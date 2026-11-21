import { Router } from 'express';
import { z } from 'zod';
import Tool from '../models/Tool.model.js';
import { calculateRecommendations } from '../services/recommendation.service.js';
import { polishExplanation } from '../services/gemini.service.js';
import { respond } from '../utils/respond.js';
import { asyncWrap } from '../middleware/asyncWrapper.js';
import { validate } from '../middleware/validate.middleware.js';

const router = Router();

const recommendSchema = z.object({
  category: z.string().optional(),
  budget: z.enum(['free-only', 'freemium-ok', 'paid-ok']).optional(),
  maxMonthlyBudget: z.number().optional(),
  reasoningLevel: z.enum(['low', 'medium', 'high']).optional(),
  speedDepth: z.enum(['fast', 'balanced', 'slow-but-thorough']).optional(),
  uiDesignLevel: z.number().min(0).max(5).optional(),
  extras: z.record(z.boolean()).optional(),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
});

// POST /api/v1/recommend
router.post(
  '/',
  validate(recommendSchema),
  asyncWrap(async (req, res) => {
    const answers = req.body;

    const allTools = await Tool.find({})
      .populate('openAlternatives', 'name slug vendor type pricing capabilities')
      .populate('commercialEquivalents', 'name slug vendor type pricing capabilities')
      .lean();

    const recommendations = calculateRecommendations(allTools, answers);

    // Polish top 3 explanations if Gemini key is active (asynchronously with timeout safeguard)
    const enhanced = await Promise.all(
      recommendations.map(async (item, idx) => {
        if (idx < 3) {
          const polished = await polishExplanation(item.tool.name, answers, item.whyFits);
          return { ...item, whyFits: polished };
        }
        return item;
      })
    );

    return respond.ok(res, {
      results: enhanced,
      totalCount: enhanced.length,
      params: answers,
    });
  })
);

export default router;
