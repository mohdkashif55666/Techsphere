/**
 * TechSphere seed script
 * Run: npm run seed --prefix server
 *
 * ⚠️  This script DROPS and recreates all collections.
 *     Do NOT run against production data.
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB, closeDB } from '../src/config/db.js';

import Tool from '../src/models/Tool.model.js';
import RegistryEntry from '../src/models/RegistryEntry.model.js';
import Blueprint from '../src/models/Blueprint.model.js';
import TerminalTemplate from '../src/models/TerminalTemplate.model.js';
import PromptTemplate from '../src/models/PromptTemplate.model.js';
import Category from '../src/models/Category.model.js';

import { toolsData } from './tools.seed.js';
import { registryData } from './registry.seed.js';
import { blueprintsData } from './blueprints.seed.js';
import { terminalsData } from './terminals.seed.js';
import { promptsData, categoriesData } from './prompts.seed.js';

async function seed() {
  console.log('\n🌱  TechSphere seed starting…\n');
  await connectDB();

  // ── Drop collections ─────────────────────────────────────────────────────
  await Promise.all([
    Tool.deleteMany({}),
    RegistryEntry.deleteMany({}),
    Blueprint.deleteMany({}),
    TerminalTemplate.deleteMany({}),
    PromptTemplate.deleteMany({}),
    Category.deleteMany({}),
  ]);
  console.log('🗑   Cleared all collections');

  // ── Tools ─────────────────────────────────────────────────────────────────
  const tools = await Tool.insertMany(toolsData);
  console.log(`✅  Inserted ${tools.length} tools`);

  // Build slug → ObjectId map for cross-references
  const toolMap = Object.fromEntries(tools.map((t) => [t.slug, t._id]));

  // ── Wire open/commercial alternatives ────────────────────────────────────
  // (These cross-reference the same tool collection)
  const altPairs = [
    ['claude-37-sonnet', ['deepseek-v3', 'deepseek-r1', 'qwen-25-coder-32b']],
    ['gpt-45', ['llama-33-70b', 'deepseek-r1']],
    ['gpt-4o', ['deepseek-v3', 'phi-4', 'mistral-7b']],
    ['gemini-2-flash', ['deepseek-v3', 'phi-4']],
    ['cursor', ['continue-dev', 'aider']],
    ['github-copilot', ['continue-dev', 'aider']],
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
  console.log('✅  Wired open/commercial alternatives');

  // ── Registry ─────────────────────────────────────────────────────────────
  const registryDocs = registryData.map(({ commercialSlug, openSlug, ...rest }) => ({
    ...rest,
    commercialTool: toolMap[commercialSlug],
    openTool: toolMap[openSlug],
  })).filter((r) => r.commercialTool && r.openTool);

  const registry = await RegistryEntry.insertMany(registryDocs);
  console.log(`✅  Inserted ${registry.length} registry entries`);

  // ── Blueprints ────────────────────────────────────────────────────────────
  const blueprints = await Blueprint.insertMany(blueprintsData);
  console.log(`✅  Inserted ${blueprints.length} blueprints`);

  // ── Terminal Templates ────────────────────────────────────────────────────
  const terminals = await TerminalTemplate.insertMany(terminalsData);
  console.log(`✅  Inserted ${terminals.length} terminal templates`);

  // ── Prompts ───────────────────────────────────────────────────────────────
  const prompts = await PromptTemplate.insertMany(promptsData);
  console.log(`✅  Inserted ${prompts.length} prompt templates`);

  // ── Categories ────────────────────────────────────────────────────────────
  const categories = await Category.insertMany(categoriesData);
  console.log(`✅  Inserted ${categories.length} categories`);

  // ── Summary ───────────────────────────────────────────────────────────────
  const latestVerifiedAt = tools
    .map((t) => t.lastVerifiedAt)
    .filter(Boolean)
    .sort((a, b) => b - a)[0];

  console.log('\n📊  Seed summary:');
  console.log(`    Tools:              ${tools.length}`);
  console.log(`    Registry entries:   ${registry.length}`);
  console.log(`    Blueprints:         ${blueprints.length}`);
  console.log(`    Terminal templates: ${terminals.length}`);
  console.log(`    Prompt templates:   ${prompts.length}`);
  console.log(`    Categories:         ${categories.length}`);
  console.log(`    Latest verified:    ${latestVerifiedAt?.toISOString().slice(0, 10) ?? 'n/a'}`);
  console.log('\n✨  Seed complete!\n');

  await closeDB();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
