import { WEIGHTS, REASONING_MAP, SPEED_MAP, MAX_RESULTS } from '../config/recommendation.config.js';

/**
 * Pure recommendation function that scores and ranks tools according to user requirements.
 *
 * @param {Array} tools - list of tool documents
 * @param {Object} answers - answers from Guided Finder
 * @returns {Array} ranked list of tools with match scores and breakdown
 */
export function calculateRecommendations(tools, answers) {
  const {
    category,
    budget = 'freemium-ok', // 'free-only', 'freemium-ok', 'paid-ok'
    maxMonthlyBudget = 100,
    reasoningLevel = 'medium', // 'low', 'medium', 'high'
    speedDepth = 'balanced', // 'fast', 'balanced', 'slow-but-thorough'
    uiDesignLevel = 2, // 0-5
    extras = {}, // { hasApi, hasIdeIntegration, largeContext, agenticMode, openSource, multimodal, runsLocally }
    experienceLevel = 'intermediate', // 'beginner', 'intermediate', 'advanced'
  } = answers;

  // 1. Hard Filters
  const filtered = tools.filter((tool) => {
    // Budget filter
    if (budget === 'free-only') {
      const isFree =
        tool.pricing.model === 'free' ||
        tool.pricing.model === 'open-source';
      if (!isFree) return false;
    } else if (budget === 'freemium-ok') {
      if (tool.pricing.model === 'paid' && tool.pricing.startingPriceUSD > maxMonthlyBudget) {
        return false;
      }
    } else if (budget === 'paid-ok') {
      if (tool.pricing.startingPriceUSD > maxMonthlyBudget) {
        return false;
      }
    }

    // Required capabilities filters
    if (extras.openSource && !tool.capabilities?.openSource) return false;
    if (extras.runsLocally && !tool.capabilities?.runsLocally) return false;
    if (extras.hasApi && !tool.capabilities?.hasApi) return false;
    if (extras.hasIdeIntegration && !tool.capabilities?.hasIdeIntegration) return false;
    if (extras.multimodal && !tool.capabilities?.multimodal) return false;
    if (extras.agenticMode && !tool.capabilities?.agentic) return false;
    if (extras.largeContext && (tool.contextWindowTokens || 0) < 64000) return false;

    return true;
  });

  // 2. Scoring
  const scored = filtered.map((tool) => {
    // Category Fit (0 to 1)
    const catScore = tool.categoryFit instanceof Map
      ? (tool.categoryFit.get(category) ?? 5)
      : (tool.categoryFit?.[category] ?? 5);
    const normalizedCategory = Math.min(1, Math.max(0, catScore / 10));

    // Reasoning Match
    const toolReasoning = tool.scores?.reasoning ?? 5;
    const targetReasoningRange = REASONING_MAP[reasoningLevel] || { min: 4, max: 7 };
    let reasoningScore = 0.5;

    if (toolReasoning >= targetReasoningRange.min && toolReasoning <= targetReasoningRange.max) {
      reasoningScore = 1.0;
    } else if (toolReasoning > targetReasoningRange.max) {
      // Bonus if exceeds, unless user chose fast speed
      reasoningScore = speedDepth === 'fast' ? 0.75 : 1.0;
    } else {
      const diff = targetReasoningRange.min - toolReasoning;
      reasoningScore = Math.max(0.1, 1.0 - diff * 0.2);
    }

    // Speed Match
    const toolSpeed = tool.scores?.speed ?? 5;
    const targetSpeedThreshold = SPEED_MAP[speedDepth]?.min ?? 4;
    let speedScore = 0.5;
    if (speedDepth === 'fast') {
      speedScore = Math.min(1, toolSpeed / 10);
    } else if (speedDepth === 'balanced') {
      speedScore = toolSpeed >= 5 ? 1.0 : toolSpeed / 6;
    } else {
      // Slow but thorough values reasoning over speed
      speedScore = 0.8;
    }

    // UI Design Match
    const toolUiSense = tool.scores?.uiDesignSense ?? 5;
    const desiredUiSense = (uiDesignLevel / 5) * 10;
    const uiScore = 1 - Math.min(1, Math.abs(toolUiSense - desiredUiSense) / 10);

    // Capability Bonus
    let capCount = 0;
    let capTotal = 0;
    if (extras.hasApi) { capTotal++; if (tool.capabilities?.hasApi) capCount++; }
    if (extras.hasIdeIntegration) { capTotal++; if (tool.capabilities?.hasIdeIntegration) capCount++; }
    if (extras.multimodal) { capTotal++; if (tool.capabilities?.multimodal) capCount++; }
    if (extras.openSource) { capTotal++; if (tool.capabilities?.openSource) capCount++; }
    if (extras.runsLocally) { capTotal++; if (tool.capabilities?.runsLocally) capCount++; }
    if (extras.agenticMode) { capTotal++; if (tool.capabilities?.agentic) capCount++; }
    const capabilityScore = capTotal > 0 ? capCount / capTotal : 0.8;

    // Ease of use vs experience level
    const toolEase = tool.scores?.easeOfUse ?? 5;
    let easeScore = 0.7;
    if (experienceLevel === 'beginner') {
      easeScore = toolEase / 10;
    } else if (experienceLevel === 'advanced') {
      easeScore = 0.9; // Advanced users can handle any tool
    } else {
      easeScore = toolEase >= 5 ? 0.9 : 0.7;
    }

    // Community Rating
    const communityScore = Math.min(1, (tool.avgRating || 4.0) / 5);

    // Weighted Total Score (0-100)
    const rawScore =
      WEIGHTS.categoryFit * normalizedCategory +
      WEIGHTS.reasoning * reasoningScore +
      WEIGHTS.speed * speedScore +
      WEIGHTS.uiDesign * uiScore +
      WEIGHTS.capability * capabilityScore +
      WEIGHTS.easeOfUse * easeScore +
      WEIGHTS.community * communityScore;

    const finalScore = Math.min(100, Math.max(10, Math.round(rawScore * 100)));

    // Generate Rule-Based Explanation
    const reasons = [];
    if (normalizedCategory >= 0.8) {
      reasons.push(`Top-tier performance in ${category || 'your chosen category'}`);
    }
    if (toolReasoning >= 8) {
      reasons.push('high complex-reasoning precision');
    }
    if (tool.capabilities?.openSource) {
      reasons.push('fully open-source and transparent');
    }
    if (tool.capabilities?.runsLocally) {
      reasons.push('can run locally offline for privacy');
    }
    if (tool.capabilities?.agentic) {
      reasons.push('supports autonomous multi-step agentic execution');
    }
    if (tool.pricing.model === 'free' || tool.pricing.model === 'open-source') {
      reasons.push('zero cost');
    }

    const whyFits = reasons.length > 0
      ? `Selected for its ${reasons.slice(0, 3).join(', ')}.`
      : `Matches your requirement profile with a ${finalScore}% compatibility rating.`;

    return {
      tool,
      score: finalScore,
      breakdown: {
        category: Math.round(normalizedCategory * 100),
        reasoning: Math.round(reasoningScore * 100),
        speed: Math.round(speedScore * 100),
        uiDesign: Math.round(uiScore * 100),
        capabilities: Math.round(capabilityScore * 100),
        community: Math.round(communityScore * 100),
      },
      whyFits,
    };
  });

  // 3. Sort deterministically: highest score first, then tie-break by slug
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.tool.slug.localeCompare(b.tool.slug);
  });

  return scored.slice(0, MAX_RESULTS);
}
