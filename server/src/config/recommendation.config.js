/**
 * Recommendation engine scoring weights.
 * All weights must sum to 1.00.
 * Tune here without touching service logic.
 */
export const WEIGHTS = {
  categoryFit:   0.30,
  reasoning:     0.20,
  speed:         0.15,
  uiDesign:      0.10,
  capability:    0.10,
  easeOfUse:     0.08,
  community:     0.07,
};

/** Pricing tiers ordered by cost (used for budget hard-filter) */
export const PRICING_ORDER = ['free', 'freemium', 'paid'];

/** Reasoning level labels → numeric score threshold (0-10) */
export const REASONING_MAP = {
  low:    { min: 0, max: 4 },
  medium: { min: 4, max: 7 },
  high:   { min: 7, max: 10 },
};

/** Speed preference → tool.scores.speed threshold */
export const SPEED_MAP = {
  fast:    { min: 7 },
  balanced: { min: 4 },
  'slow-but-thorough': { min: 0 },
};

/** Max tools returned by recommend endpoint */
export const MAX_RESULTS = 10;
