import { Router } from 'express';
import User from '../models/User.model.js';
import Tool from '../models/Tool.model.js';
import { respond } from '../utils/respond.js';
import { asyncWrap } from '../middleware/asyncWrapper.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// GET /api/v1/favorites
router.get(
  '/',
  requireAuth,
  asyncWrap(async (req, res) => {
    const user = await User.findById(req.user._id).populate('savedTools');
    return respond.ok(res, { favorites: user.savedTools || [] });
  })
);

// POST /api/v1/favorites/:toolId - Toggle favorite
router.post(
  '/:toolId',
  requireAuth,
  asyncWrap(async (req, res) => {
    const { toolId } = req.params;
    const tool = await Tool.findById(toolId);
    if (!tool) {
      return respond.fail(res, 'Tool not found', 404);
    }

    const user = await User.findById(req.user._id);
    const index = user.savedTools.findIndex((id) => id.toString() === toolId);
    let isSaved = false;

    if (index > -1) {
      user.savedTools.splice(index, 1);
      isSaved = false;
    } else {
      user.savedTools.push(tool._id);
      isSaved = true;
    }

    await user.save();
    return respond.ok(res, { isSaved, savedTools: user.savedTools });
  })
);

export default router;
