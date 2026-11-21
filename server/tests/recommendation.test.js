import { describe, it, expect } from 'vitest';
import { calculateRecommendations } from '../src/services/recommendation.service.js';

describe('Recommendation Scoring Engine', () => {
  const sampleTools = [
    {
      name: 'Claude 3.5 Sonnet',
      slug: 'claude-35-sonnet',
      pricing: { model: 'paid', startingPriceUSD: 20 },
      scores: { reasoning: 9, speed: 7, uiDesignSense: 7, easeOfUse: 8 },
      categoryFit: { fullStack: 9, backend: 9, ml: 6 },
      capabilities: { openSource: false, runsLocally: false, hasApi: true, hasIdeIntegration: true },
      contextWindowTokens: 200000,
      avgRating: 4.8,
    },
    {
      name: 'DeepSeek-V3',
      slug: 'deepseek-v3',
      pricing: { model: 'open-source', startingPriceUSD: 0 },
      scores: { reasoning: 9, speed: 7, uiDesignSense: 6, easeOfUse: 7 },
      categoryFit: { fullStack: 9, backend: 9, ml: 8 },
      capabilities: { openSource: true, runsLocally: true, hasApi: true, hasIdeIntegration: false },
      contextWindowTokens: 128000,
      avgRating: 4.6,
    },
    {
      name: 'Mistral 7B',
      slug: 'mistral-7b',
      pricing: { model: 'open-source', startingPriceUSD: 0 },
      scores: { reasoning: 5, speed: 9, uiDesignSense: 4, easeOfUse: 9 },
      categoryFit: { fullStack: 6, backend: 6, ml: 6 },
      capabilities: { openSource: true, runsLocally: true, hasApi: false, hasIdeIntegration: false },
      contextWindowTokens: 32000,
      avgRating: 4.2,
    },
  ];

  it('hard-filters out paid tools when budget is free-only', () => {
    const results = calculateRecommendations(sampleTools, {
      category: 'fullStack',
      budget: 'free-only',
      reasoningLevel: 'high',
    });

    const hasPaid = results.some((r) => r.tool.pricing.model === 'paid');
    expect(hasPaid).toBe(false);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].tool.slug).toBe('deepseek-v3');
  });

  it('ranks high-reasoning tools top when reasoningLevel=high', () => {
    const results = calculateRecommendations(sampleTools, {
      category: 'fullStack',
      budget: 'paid-ok',
      reasoningLevel: 'high',
      speedDepth: 'slow-but-thorough',
    });

    expect(results[0].tool.scores.reasoning).toBeGreaterThanOrEqual(9);
  });

  it('breaks ties deterministically by slug', () => {
    const tiedTools = [
      {
        name: 'Tool B',
        slug: 'tool-b',
        pricing: { model: 'free', startingPriceUSD: 0 },
        scores: { reasoning: 5, speed: 5, uiDesignSense: 5, easeOfUse: 5 },
        categoryFit: { fullStack: 5 },
        capabilities: {},
        avgRating: 5.0,
      },
      {
        name: 'Tool A',
        slug: 'tool-a',
        pricing: { model: 'free', startingPriceUSD: 0 },
        scores: { reasoning: 5, speed: 5, uiDesignSense: 5, easeOfUse: 5 },
        categoryFit: { fullStack: 5 },
        capabilities: {},
        avgRating: 5.0,
      },
    ];

    const results = calculateRecommendations(tiedTools, { category: 'fullStack' });
    expect(results[0].tool.slug).toBe('tool-a');
    expect(results[1].tool.slug).toBe('tool-b');
  });

  it('filters by runsLocally requirement', () => {
    const results = calculateRecommendations(sampleTools, {
      category: 'fullStack',
      budget: 'paid-ok',
      extras: { runsLocally: true },
    });

    results.forEach((r) => {
      expect(r.tool.capabilities.runsLocally).toBe(true);
    });
  });
});
