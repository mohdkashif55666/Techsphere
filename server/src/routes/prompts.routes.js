import { Router } from 'express';
import PromptTemplate from '../models/PromptTemplate.model.js';
import { respond } from '../utils/respond.js';
import { asyncWrap } from '../middleware/asyncWrapper.js';

const router = Router();

// GET /api/v1/prompts
router.get(
  '/',
  asyncWrap(async (_req, res) => {
    const prompts = await PromptTemplate.find({})
      .sort({ sortOrder: 1 })
      .lean();

    return respond.ok(res, { prompts });
  })
);

// POST /api/v1/prompts/:id/copy
router.post(
  '/:id/copy',
  asyncWrap(async (req, res) => {
    const { id } = req.params;
    const prompt = await PromptTemplate.findByIdAndUpdate(
      id,
      { $inc: { copyCount: 1 } },
      { new: true }
    );

    if (!prompt) {
      return respond.fail(res, 'Prompt template not found', 404);
    }

    return respond.ok(res, { copyCount: prompt.copyCount });
  })
);

export default router;
