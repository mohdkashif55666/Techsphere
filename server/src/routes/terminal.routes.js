import { Router } from 'express';
import { z } from 'zod';
import TerminalTemplate from '../models/TerminalTemplate.model.js';
import Tool from '../models/Tool.model.js';
import { respond } from '../utils/respond.js';
import { asyncWrap } from '../middleware/asyncWrapper.js';
import { validate } from '../middleware/validate.middleware.js';

const router = Router();

const terminalAdvisorSchema = z.object({
  os: z.enum(['macos', 'linux', 'windows']),
  ramGB: z.number().min(2).max(256),
  vramGB: z.number().min(0).max(128).optional().default(0),
  stack: z.string(),
  goal: z.string(),
});

// POST /api/v1/terminal-advisor
router.post(
  '/',
  validate(terminalAdvisorSchema),
  asyncWrap(async (req, res) => {
    const { os, ramGB, vramGB, stack, goal } = req.body;

    // Find verified templates matching OS, stack, and goal
    let template = await TerminalTemplate.findOne({
      os,
      stack,
      goal,
      minRamGB: { $lte: ramGB },
    }).lean();

    // Fallback if exact stack not found: match by OS and goal
    if (!template) {
      template = await TerminalTemplate.findOne({
        os,
        goal,
        minRamGB: { $lte: ramGB },
      }).lean();
    }

    // Fallback to any OS match for goal
    if (!template) {
      template = await TerminalTemplate.findOne({ goal }).lean();
    }

    // Find local models that user's hardware can comfortably run
    const compatibleModels = await Tool.find({
      'capabilities.runsLocally': true,
      'localRequirements.minRamGB': { $lte: ramGB, $gt: 0 },
      'localRequirements.minVramGB': { $lte: vramGB },
    })
      .select('name slug scores pricing localRequirements')
      .sort({ 'scores.reasoning': -1 })
      .limit(4)
      .lean();

    return respond.ok(res, {
      template: template || {
        os,
        stack,
        goal,
        steps: [
          { label: 'Hardware note', command: `# Detected ${ramGB}GB RAM, ${vramGB}GB VRAM for ${os}` },
          { label: 'Check node environment', command: 'node -v && npm -v' },
        ],
        notes: 'Custom configured configuration. Verify commands before running.',
      },
      compatibleModels,
      hardwareSummary: { os, ramGB, vramGB },
    });
  })
);

export default router;
