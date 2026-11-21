import Tool from '../models/Tool.model.js';
import RegistryEntry from '../models/RegistryEntry.model.js';
import Blueprint from '../models/Blueprint.model.js';
import TerminalTemplate from '../models/TerminalTemplate.model.js';
import PromptTemplate from '../models/PromptTemplate.model.js';
import Category from '../models/Category.model.js';

import { toolsData } from '../../seed/tools.seed.js';
import { registryData } from '../../seed/registry.seed.js';
import { blueprintsData } from '../../seed/blueprints.seed.js';
import { terminalsData } from '../../seed/terminals.seed.js';
import { promptsData, categoriesData } from '../../seed/prompts.seed.js';

export async function seedIfEmpty(force = false) {
  const toolCount = await Tool.countDocuments();
  if (toolCount > 0 && !force) {
    return; // Already populated
  }

  if (force) {
    await Promise.all([
      Tool.deleteMany({}),
      RegistryEntry.deleteMany({}),
      Blueprint.deleteMany({}),
      TerminalTemplate.deleteMany({}),
      PromptTemplate.deleteMany({}),
      Category.deleteMany({}),
    ]);
  }

  console.log('🌱 Populating database with updated 2026 dataset…');

  const tools = await Tool.insertMany(toolsData);
  const toolMap = Object.fromEntries(tools.map((t) => [t.slug, t._id]));

  // Curated, technically verified commercial-to-open mappings (Issue 13 resolved)
  const altPairs = [
    // Frontier Commercial API -> High-end Open Weights (DeepSeek-V3, R1, Qwen)
    ['claude-37-sonnet', ['deepseek-v3', 'deepseek-r1', 'qwen-25-coder-32b']],
    ['gpt-45', ['llama-33-70b', 'deepseek-r1']],
    ['gpt-4o', ['deepseek-v3', 'phi-4', 'mistral-7b']],
    ['gemini-2-flash', ['deepseek-v3', 'phi-4']],
    // Commercial AI IDE -> Open-source IDE / CLI assistant
    ['cursor', ['continue-dev', 'aider']],
    ['github-copilot', ['continue-dev', 'aider']],
    // Generative UI Platform -> Open-source frontend coding
    ['v0-vercel', ['qwen-25-coder-32b']],
  ];

  for (const [commercialSlug, openSlugs] of altPairs) {
    const cId = toolMap[commercialSlug];
    if (!cId) continue;
    const openIds = openSlugs.map((s) => toolMap[s]).filter(Boolean);

    await Tool.findByIdAndUpdate(cId, { openAlternatives: openIds });
    for (const openId of openIds) {
      await Tool.findByIdAndUpdate(openId, {
        $addToSet: { commercialEquivalents: cId },
      });
    }
  }

  const registryDocs = registryData.map(({ commercialSlug, openSlug, ...rest }) => ({
    ...rest,
    commercialTool: toolMap[commercialSlug],
    openTool: toolMap[openSlug],
  })).filter((r) => r.commercialTool && r.openTool);

  await Promise.all([
    RegistryEntry.insertMany(registryDocs),
    Blueprint.insertMany(blueprintsData),
    TerminalTemplate.insertMany(terminalsData),
    PromptTemplate.insertMany(promptsData),
    Category.insertMany(categoriesData),
  ]);

  console.log('✅ Database populated with reviewed 2026 models and clean mappings.');
}
