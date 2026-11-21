import pptxgen from 'pptxgenjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pptx = new pptxgen();

// Presentation Settings (16:9 widescreen)
pptx.layout = 'LAYOUT_16x9';
pptx.author = 'TechSphere Engineering Team';
pptx.company = 'TechSphere';
pptx.title = 'TechSphere - Product Overview & Technical Architecture';

// Color Palette Definition
const C = {
  bgLight: 'F8F9FA',
  white: 'FFFFFF',
  ink: '202124',
  muted: '5F6368',
  subtle: '80868B',
  blue: '1A73E8',
  blueBg: 'E8F0FE',
  border: 'E0E0E0',
  cardBg: 'FFFFFF',
  green: '1E8E3E',
  amber: 'B06000',
  darkBg: '161B18',
};

// Helper to create consistent header across slides
function addHeader(slide, title, category) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.8,
    y: 0.5,
    w: 11.7,
    h: 0.05,
    fill: { color: C.blue },
  });

  if (category) {
    slide.addText(category.toUpperCase(), {
      x: 0.8,
      y: 0.65,
      w: 10,
      h: 0.3,
      fontSize: 10,
      fontFace: 'Arial',
      color: C.blue,
      bold: true,
      charSpacing: 2,
    });
  }

  slide.addText(title, {
    x: 0.8,
    y: 0.95,
    w: 11.5,
    h: 0.55,
    fontSize: 22,
    fontFace: 'Arial',
    color: C.ink,
    bold: true,
  });
}

// -------------------------------------------------------------
// SLIDE 1: Title Slide (Cover)
// -------------------------------------------------------------
{
  const slide = pptx.addSlide();
  slide.background = { color: C.bgLight };

  // Decorative Accent Box
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 1.5,
    w: 11.7,
    h: 4.5,
    fill: { color: C.white },
    line: { color: C.border, width: 1 },
    rectRadius: 0.2,
  });

  // Top Accent Stripe
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.8,
    y: 1.5,
    w: 11.7,
    h: 0.1,
    fill: { color: C.blue },
  });

  slide.addText('TECHSPHERE', {
    x: 1.4,
    y: 2.1,
    w: 10,
    h: 0.4,
    fontSize: 14,
    fontFace: 'Arial',
    color: C.blue,
    bold: true,
    charSpacing: 4,
  });

  slide.addText('The Search Engine & Architecture Registry for Machine Intelligence & Open Compute', {
    x: 1.4,
    y: 2.6,
    w: 10.5,
    h: 1.2,
    fontSize: 28,
    fontFace: 'Arial',
    color: C.ink,
    bold: true,
  });

  slide.addText('Mapping tasks to optimal commercial models and verified self-hosted open-source alternatives.', {
    x: 1.4,
    y: 3.9,
    w: 10,
    h: 0.6,
    fontSize: 14,
    fontFace: 'Arial',
    color: C.muted,
  });

  // Metadata Footer
  slide.addText('MERN Stack Architecture • Product Requirements & Architecture Blueprint • 2026 Edition', {
    x: 1.4,
    y: 5.1,
    w: 10,
    h: 0.4,
    fontSize: 11,
    fontFace: 'Arial',
    color: C.subtle,
  });
}

// -------------------------------------------------------------
// SLIDE 2: Executive Summary & Problem Space
// -------------------------------------------------------------
{
  const slide = pptx.addSlide();
  slide.background = { color: C.bgLight };
  addHeader(slide, 'The Problem: Cognitive Overload & Vendor Lock-in', 'Executive Overview');

  // Box 1: The Explosion of AI Tools
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 1.8,
    w: 3.6,
    h: 4.8,
    fill: { color: C.white },
    line: { color: C.border, width: 1 },
    rectRadius: 0.15,
  });
  slide.addText('01. MODEL PROLIFERATION', {
    x: 1.1,
    y: 2.1,
    w: 3.0,
    h: 0.3,
    fontSize: 10,
    fontFace: 'Arial',
    color: C.blue,
    bold: true,
  });
  slide.addText('Fragmented Landscape', {
    x: 1.1,
    y: 2.45,
    w: 3.0,
    h: 0.4,
    fontSize: 16,
    fontFace: 'Arial',
    color: C.ink,
    bold: true,
  });
  slide.addText([
    { text: '• Over 200+ commercial AI APIs and coding assistants launch monthly.\n\n', options: { bullet: false } },
    { text: '• Developers face analysis paralysis choosing between frontier models (Claude 3.7, GPT-4.5) and specialized weights.\n\n', options: { bullet: false } },
    { text: '• No unified catalog answers: "Which model fits my exact task constraints?"', options: { bullet: false } },
  ], {
    x: 1.1,
    y: 3.0,
    w: 3.0,
    h: 3.2,
    fontSize: 12,
    fontFace: 'Arial',
    color: C.muted,
  });

  // Box 2: Vendor Lock-in & Privacy
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 4.8,
    y: 1.8,
    w: 3.6,
    h: 4.8,
    fill: { color: C.white },
    line: { color: C.border, width: 1 },
    rectRadius: 0.15,
  });
  slide.addText('02. DATA PRIVACY & COST', {
    x: 5.1,
    y: 2.1,
    w: 3.0,
    h: 0.3,
    fontSize: 10,
    fontFace: 'Arial',
    color: C.blue,
    bold: true,
  });
  slide.addText('Skyrocketing SaaS Costs', {
    x: 5.1,
    y: 2.45,
    w: 3.0,
    h: 0.4,
    fontSize: 16,
    fontFace: 'Arial',
    color: C.ink,
    bold: true,
  });
  slide.addText([
    { text: '• Teams accumulate massive per-seat subscriptions ($20–$50/seat/month).\n\n', options: { bullet: false } },
    { text: '• Proprietary codebases sent to external cloud APIs breach strict corporate security policies.\n\n', options: { bullet: false } },
    { text: '• Lack of transparency on which local models can replace cloud APIs cleanly.', options: { bullet: false } },
  ], {
    x: 5.1,
    y: 3.0,
    w: 3.0,
    h: 3.2,
    fontSize: 12,
    fontFace: 'Arial',
    color: C.muted,
  });

  // Box 3: The Hardware Gap
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 8.8,
    y: 1.8,
    w: 3.7,
    h: 4.8,
    fill: { color: C.white },
    line: { color: C.border, width: 1 },
    rectRadius: 0.15,
  });
  slide.addText('03. LOCAL COMPUTE FRICTION', {
    x: 9.1,
    y: 2.1,
    w: 3.1,
    h: 0.3,
    fontSize: 10,
    fontFace: 'Arial',
    color: C.blue,
    bold: true,
  });
  slide.addText('Hardware Configuration Gap', {
    x: 9.1,
    y: 2.45,
    w: 3.1,
    h: 0.4,
    fontSize: 16,
    fontFace: 'Arial',
    color: C.ink,
    bold: true,
  });
  slide.addText([
    { text: '• Open-source models (DeepSeek-V3, Qwen 2.5, Phi-4) now match frontier quality.\n\n', options: { bullet: false } },
    { text: '• Developers do not know what quantizations their local RAM/VRAM can actually execute.\n\n', options: { bullet: false } },
    { text: '• Missing exact one-click terminal commands (Ollama, vLLM, llama.cpp).', options: { bullet: false } },
  ], {
    x: 9.1,
    y: 3.0,
    w: 3.1,
    h: 3.2,
    fontSize: 12,
    fontFace: 'Arial',
    color: C.muted,
  });
}

// -------------------------------------------------------------
// SLIDE 3: The Solution - TechSphere
// -------------------------------------------------------------
{
  const slide = pptx.addSlide();
  slide.background = { color: C.bgLight };
  addHeader(slide, 'The Solution: Task-Based AI Search & Alternative Mapping', 'Product Vision');

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 1.8,
    w: 11.7,
    h: 1.4,
    fill: { color: C.white },
    line: { color: C.border, width: 1 },
    rectRadius: 0.15,
  });

  slide.addText('CORE PRODUCT PHILOSOPHY', {
    x: 1.1,
    y: 2.05,
    w: 11,
    h: 0.25,
    fontSize: 10,
    fontFace: 'Arial',
    color: C.blue,
    bold: true,
  });

  slide.addText('A Google-style high-precision search engine for developers that answers: "Which model should I use for this exact task, and what is the best open-source alternative I can run offline for free?"', {
    x: 1.1,
    y: 2.35,
    w: 11.1,
    h: 0.7,
    fontSize: 14,
    fontFace: 'Arial',
    color: C.ink,
    bold: true,
  });

  // Feature Highlights Row
  const cards = [
    {
      num: '01',
      title: 'Commercial → Open Mapping',
      desc: 'Direct pairs linking proprietary enterprise tools (Claude, Cursor, Copilot) to verified local open equivalents (DeepSeek, Aider, Continue.dev).',
    },
    {
      num: '02',
      title: 'Guided Compatibility Finder',
      desc: '60-second questionnaire evaluating reasoning depth, budget, speed requirements, and UI-design capabilities with algorithmic match scoring.',
    },
    {
      num: '03',
      title: 'Zero-Guess Terminal Advisor',
      desc: 'Instant translation of developer system specs (8GB–64GB RAM, Apple Silicon, Nvidia GPU) into copy-paste Ollama terminal commands.',
    },
  ];

  cards.forEach((c, i) => {
    const xPos = 0.8 + i * 4.0;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos,
      y: 3.5,
      w: 3.7,
      h: 3.1,
      fill: { color: C.white },
      line: { color: C.border, width: 1 },
      rectRadius: 0.15,
    });

    slide.addText(c.num, {
      x: xPos + 0.3,
      y: 3.8,
      w: 3.1,
      h: 0.3,
      fontSize: 14,
      fontFace: 'Arial',
      color: C.blue,
      bold: true,
    });

    slide.addText(c.title, {
      x: xPos + 0.3,
      y: 4.2,
      w: 3.1,
      h: 0.5,
      fontSize: 14,
      fontFace: 'Arial',
      color: C.ink,
      bold: true,
    });

    slide.addText(c.desc, {
      x: xPos + 0.3,
      y: 4.8,
      w: 3.1,
      h: 1.6,
      fontSize: 12,
      fontFace: 'Arial',
      color: C.muted,
    });
  });
}

// -------------------------------------------------------------
// SLIDE 4: The Six Functional Pillars
// -------------------------------------------------------------
{
  const slide = pptx.addSlide();
  slide.background = { color: C.bgLight };
  addHeader(slide, 'Six Core Pillars of the Platform Architecture', 'System Scope');

  const pillars = [
    { title: '1. Model & Tool Register', tag: 'CORE DIRECTORY', desc: 'Curated database with compound indexing across categories, licenses, benchmark ratings, and verified 2026 specs.' },
    { title: '2. Guided Recommendation Engine', tag: 'ALGORITHM', desc: 'Dynamic scoring matrix calculating percentage fit across 8 capability vectors with optional Gemini-powered contextual blurbs.' },
    { title: '3. Hardware & Terminal Advisor', tag: 'LOCAL COMPUTE', desc: 'Live RAM/VRAM profiler yielding precise CLI bootstrap commands for Ollama, vLLM, and llama.cpp.' },
    { title: '4. Side-by-Side Comparison Matrix', tag: 'BENCHMARKING', desc: 'Multi-parameter head-to-head comparison across 3 models: context size, token rates, and agentic autonomy.' },
    { title: '5. MERN Architecture Blueprints', tag: 'DEVELOPER GUIDES', desc: 'Production-ready MongoDB schema templates, Express JWT auth middleware, and React 18 state management patterns.' },
    { title: '6. Prompt Stencils Catalog', tag: 'WORKFLOW TEMPLATES', desc: 'Curated code generation and system prompt blueprints optimized for deep-reasoning and code-review tasks.' },
  ];

  pillars.forEach((p, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const xPos = 0.8 + col * 4.0;
    const yPos = 1.8 + row * 2.5;

    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos,
      y: yPos,
      w: 3.7,
      h: 2.2,
      fill: { color: C.white },
      line: { color: C.border, width: 1 },
      rectRadius: 0.12,
    });

    slide.addText(p.tag, {
      x: xPos + 0.25,
      y: yPos + 0.2,
      w: 3.2,
      h: 0.25,
      fontSize: 9,
      fontFace: 'Arial',
      color: C.blue,
      bold: true,
    });

    slide.addText(p.title, {
      x: xPos + 0.25,
      y: yPos + 0.5,
      w: 3.2,
      h: 0.4,
      fontSize: 13,
      fontFace: 'Arial',
      color: C.ink,
      bold: true,
    });

    slide.addText(p.desc, {
      x: xPos + 0.25,
      y: yPos + 0.95,
      w: 3.2,
      h: 1.1,
      fontSize: 11,
      fontFace: 'Arial',
      color: C.muted,
    });
  });
}

// -------------------------------------------------------------
// SLIDE 5: Pillar 1 & Signature Feature (Commercial → Open)
// -------------------------------------------------------------
{
  const slide = pptx.addSlide();
  slide.background = { color: C.bgLight };
  addHeader(slide, 'Commercial to Open-Source Model Pairing Index', 'Pillar Deep Dive');

  slide.addText('Verified 2026 Mappings: Commercial Frontier Model ➔ Free / Open Alternative', {
    x: 0.8,
    y: 1.8,
    w: 11.7,
    h: 0.4,
    fontSize: 13,
    fontFace: 'Arial',
    color: C.muted,
  });

  const mappings = [
    { task: 'Full-Stack MERN Routing & Coding', com: 'Claude 3.7 Sonnet', open: 'DeepSeek-V3 (Open)', tag: 'Coding & Architecture', saving: '100% Free / Self-Host' },
    { task: 'Complex STEM & Algorithmic Reasoning', com: 'OpenAI o3 / GPT-4.5', open: 'DeepSeek-R1 (Open Weights)', tag: 'Deep Reasoning', saving: 'Open Weights / Local' },
    { task: 'Autonomous In-Editor AI Code Completion', com: 'GitHub Copilot Enterprise', open: 'Continue.dev + Ollama Qwen 2.5', tag: 'IDE Extension', saving: 'Zero Data Leaks' },
    { task: 'Agentic Multi-File Refactoring', com: 'Cursor Composer', open: 'Aider + DeepSeek-V3 / Cline', tag: 'Agentic Coding', saving: 'CLI Terminal Driven' },
    { task: 'Edge & Embedded Offline Intelligence', com: 'Gemini 2.0 Flash API', open: 'Microsoft Phi-4 (14B) / Mistral 7B', tag: 'Offline Compute', saving: 'Runs on 8GB RAM' },
  ];

  mappings.forEach((m, idx) => {
    const yPos = 2.4 + idx * 0.85;

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8,
      y: yPos,
      w: 11.7,
      h: 0.75,
      fill: { color: C.white },
      line: { color: C.border, width: 1 },
      rectRadius: 0.1,
    });

    slide.addText(m.task, {
      x: 1.1,
      y: yPos + 0.12,
      w: 4.5,
      h: 0.28,
      fontSize: 12,
      fontFace: 'Arial',
      color: C.ink,
      bold: true,
    });

    slide.addText([
      { text: m.com + ' ', options: { color: C.muted } },
      { text: '➔ ', options: { color: C.blue, bold: true } },
      { text: m.open, options: { color: C.blue, bold: true } },
    ], {
      x: 1.1,
      y: yPos + 0.42,
      w: 6.0,
      h: 0.25,
      fontSize: 11,
      fontFace: 'Arial',
    });

    // Tag
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 8.2,
      y: yPos + 0.2,
      w: 2.2,
      h: 0.35,
      fill: { color: C.bgLight },
      line: { color: C.border, width: 1 },
      rectRadius: 0.08,
    });
    slide.addText(m.tag, {
      x: 8.2,
      y: yPos + 0.25,
      w: 2.2,
      h: 0.25,
      fontSize: 9,
      fontFace: 'Arial',
      color: C.muted,
      align: 'center',
    });

    // Saving Badge
    slide.addText(m.saving, {
      x: 10.6,
      y: yPos + 0.25,
      w: 1.8,
      h: 0.25,
      fontSize: 10,
      fontFace: 'Arial',
      color: C.green,
      bold: true,
      align: 'right',
    });
  });
}

// -------------------------------------------------------------
// SLIDE 6: Guided Finder Algorithm
// -------------------------------------------------------------
{
  const slide = pptx.addSlide();
  slide.background = { color: C.bgLight };
  addHeader(slide, 'Algorithmic Guided Recommendation Engine', 'Intelligence Layer');

  // Left Column: Step-by-Step Questionnaire
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 1.8,
    w: 5.6,
    h: 4.8,
    fill: { color: C.white },
    line: { color: C.border, width: 1 },
    rectRadius: 0.15,
  });

  slide.addText('QUESTIONNAIRE INPUT VECTOR', {
    x: 1.1,
    y: 2.1,
    w: 5.0,
    h: 0.3,
    fontSize: 10,
    fontFace: 'Arial',
    color: C.blue,
    bold: true,
  });

  const questions = [
    { num: 'Step 1', title: 'Target Objective', sub: 'Coding, STEM Reasoning, Design, Agentic workflows' },
    { num: 'Step 2', title: 'Budget Constraints', sub: 'Free only, Open source, Commercial paid tier' },
    { num: 'Step 3', title: 'Reasoning Depth Needed', sub: 'Scale 1-10: Quick autocomplete vs. multi-step CoT' },
    { num: 'Step 4', title: 'Latency vs Depth Preference', sub: 'Sub-second real-time streaming vs deep analysis' },
    { num: 'Step 5', title: 'UI / Design Comprehension', sub: 'Front-end CSS/JSX precision vs raw algorithmic logic' },
    { num: 'Step 6', title: 'Execution Environment', sub: 'Strictly offline local machine vs hosted cloud API' },
  ];

  questions.forEach((q, i) => {
    slide.addText(`${q.num}: ${q.title}`, {
      x: 1.1,
      y: 2.5 + i * 0.65,
      w: 5.0,
      h: 0.25,
      fontSize: 11,
      fontFace: 'Arial',
      color: C.ink,
      bold: true,
    });
    slide.addText(q.sub, {
      x: 1.1,
      y: 2.75 + i * 0.65,
      w: 5.0,
      h: 0.3,
      fontSize: 10,
      fontFace: 'Arial',
      color: C.muted,
    });
  });

  // Right Column: Algorithmic Scoring & Fallback
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.8,
    y: 1.8,
    w: 5.7,
    h: 4.8,
    fill: { color: C.white },
    line: { color: C.border, width: 1 },
    rectRadius: 0.15,
  });

  slide.addText('SCORING & SYNTHESIS ENGINE', {
    x: 7.1,
    y: 2.1,
    w: 5.1,
    h: 0.3,
    fontSize: 10,
    fontFace: 'Arial',
    color: C.blue,
    bold: true,
  });

  slide.addText('Multi-Criteria Weighted Ranking', {
    x: 7.1,
    y: 2.45,
    w: 5.1,
    h: 0.35,
    fontSize: 15,
    fontFace: 'Arial',
    color: C.ink,
    bold: true,
  });

  slide.addText([
    { text: '• Weighted Score Formula:\n   Score = w_cat(Category) + w_cost(Budget) + w_res(Reasoning) + w_loc(Execution)\n\n', options: { bullet: false } },
    { text: '• Deterministic Rule Engine:\n   Evaluates candidate tools stored in MongoDB with 100% predictable accuracy and zero latency.\n\n', options: { bullet: false } },
    { text: '• Dual-Mode "Why This Fits You" Synthesis:\n   - Mode A (Optional Gemini API): 2-sentence contextual explanation customized to user exact stack.\n   - Mode B (Rule Fallback): Deterministic template synthesis when zero API keys are provided.\n\n', options: { bullet: false } },
    { text: '• Zero API Key Dependency: 100% of the scoring and ranking engine executes with no external dependencies.', options: { bullet: false } },
  ], {
    x: 7.1,
    y: 2.9,
    w: 5.1,
    h: 3.4,
    fontSize: 11,
    fontFace: 'Arial',
    color: C.muted,
  });
}

// -------------------------------------------------------------
// SLIDE 7: Hardware Advisor & Local Compute
// -------------------------------------------------------------
{
  const slide = pptx.addSlide();
  slide.background = { color: C.bgLight };
  addHeader(slide, 'Quick Stack Terminal Advisor & Compute Engine', 'Local AI Enablement');

  slide.addText('Directly bridging developer hardware capacity to executable Ollama / CLI terminal commands', {
    x: 0.8,
    y: 1.8,
    w: 11.7,
    h: 0.4,
    fontSize: 13,
    fontFace: 'Arial',
    color: C.muted,
  });

  const hardwareTiers = [
    {
      ram: '8 GB RAM',
      target: 'Lightweight Laptops & Mobile',
      model: 'Mistral 7B / Qwen 2.5 7B',
      cmd: 'ollama run mistral:7b',
      capability: 'Fast general-purpose assistant, lightweight code completion, runs smoothly with 0 GPU allocation.',
    },
    {
      ram: '16 GB RAM',
      target: 'Standard Developer Workstation',
      model: 'Phi-4 (14B) / Qwen 2.5 Coder 14B',
      cmd: 'ollama run phi4',
      capability: 'Complex STEM logic, full TypeScript/Python code synthesis, balanced memory utilization.',
    },
    {
      ram: '32 GB RAM',
      target: 'High-Performance Developer Workstation',
      model: 'DeepSeek-V3 (Q4_K_M) / Llama 3.3 70B',
      cmd: 'ollama run deepseek-v3',
      capability: 'Frontier-level code routing, multi-file refactoring, massive context processing capacity.',
    },
    {
      ram: '64 GB+ RAM',
      target: 'Dedicated Compute / M3 Max / Studio',
      model: 'DeepSeek-R1 (Full Reasoning) / Qwen 72B',
      cmd: 'ollama run deepseek-r1:70b',
      capability: 'Unrestricted chain-of-thought verification, autonomous agent loops, enterprise code base indexing.',
    },
  ];

  hardwareTiers.forEach((t, i) => {
    const yPos = 2.4 + i * 1.05;

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8,
      y: yPos,
      w: 11.7,
      h: 0.95,
      fill: { color: C.white },
      line: { color: C.border, width: 1 },
      rectRadius: 0.1,
    });

    // RAM badge
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 1.1,
      y: yPos + 0.2,
      w: 1.8,
      h: 0.55,
      fill: { color: C.blueBg },
      line: { color: C.blue, width: 1 },
      rectRadius: 0.08,
    });
    slide.addText(t.ram, {
      x: 1.1,
      y: yPos + 0.32,
      w: 1.8,
      h: 0.3,
      fontSize: 12,
      fontFace: 'Arial',
      color: C.blue,
      bold: true,
      align: 'center',
    });

    // Details
    slide.addText(t.target + '  •  ' + t.model, {
      x: 3.2,
      y: yPos + 0.15,
      w: 4.8,
      h: 0.3,
      fontSize: 12,
      fontFace: 'Arial',
      color: C.ink,
      bold: true,
    });

    slide.addText(t.capability, {
      x: 3.2,
      y: yPos + 0.48,
      w: 4.8,
      h: 0.4,
      fontSize: 10,
      fontFace: 'Arial',
      color: C.muted,
    });

    // Terminal command box
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 8.2,
      y: yPos + 0.22,
      w: 4.0,
      h: 0.5,
      fill: { color: 'F1F3F4' },
      line: { color: C.border, width: 1 },
      rectRadius: 0.06,
    });

    slide.addText(t.cmd, {
      x: 8.35,
      y: yPos + 0.32,
      w: 3.7,
      h: 0.3,
      fontSize: 11,
      fontFace: 'Courier New',
      color: C.ink,
      bold: true,
    });
  });
}

// -------------------------------------------------------------
// SLIDE 8: Technical Architecture
// -------------------------------------------------------------
{
  const slide = pptx.addSlide();
  slide.background = { color: C.bgLight };
  addHeader(slide, 'Full-Stack MERN Technical Architecture', 'System Design');

  const layers = [
    {
      title: 'CLIENT LAYER',
      sub: 'React 18 + Vite SPA',
      tech: '• Tailwind CSS Design Tokens\n• TanStack Query (Server State)\n• React Router v6 SPA Routing\n• React Hook Form + Zod\n• Lucide Icons (AA Contrast)\n• Responsive 375px to 1440px',
    },
    {
      title: 'API GATEWAY / SERVER',
      sub: 'Node.js + Express (ESM)',
      tech: '• Express REST API Endpoints\n• JWT httpOnly Cookie Auth\n• Zod Schema Validation\n• Helmet Security & CORS\n• Rate Limiting & Morgan Logging\n• Modular Router / Service Pattern',
    },
    {
      title: 'DATABASE & COMPUTE',
      sub: 'MongoDB + Atlas / In-Memory',
      tech: '• Mongoose Object Modeling\n• Full-text Search Indexes\n• Compound Filter Indexes\n• In-Memory MongoDB Fallback\n• Automated 2026 Seeder\n• Vitest Unit / E2E Test Suite',
    },
  ];

  layers.forEach((l, i) => {
    const xPos = 0.8 + i * 4.0;

    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos,
      y: 1.8,
      w: 3.7,
      h: 4.8,
      fill: { color: C.white },
      line: { color: C.border, width: 1 },
      rectRadius: 0.15,
    });

    slide.addShape(pptx.ShapeType.rect, {
      x: xPos,
      y: 1.8,
      w: 3.7,
      h: 0.08,
      fill: { color: C.blue },
    });

    slide.addText(l.title, {
      x: xPos + 0.3,
      y: 2.1,
      w: 3.1,
      h: 0.25,
      fontSize: 10,
      fontFace: 'Arial',
      color: C.blue,
      bold: true,
      charSpacing: 2,
    });

    slide.addText(l.sub, {
      x: xPos + 0.3,
      y: 2.4,
      w: 3.1,
      h: 0.4,
      fontSize: 14,
      fontFace: 'Arial',
      color: C.ink,
      bold: true,
    });

    slide.addText(l.tech, {
      x: xPos + 0.3,
      y: 3.0,
      w: 3.1,
      h: 3.2,
      fontSize: 11,
      fontFace: 'Arial',
      color: C.muted,
      lineSpacing: 18,
    });
  });
}

// -------------------------------------------------------------
// SLIDE 9: Security, Privacy & Data Integrity
// -------------------------------------------------------------
{
  const slide = pptx.addSlide();
  slide.background = { color: C.bgLight };
  addHeader(slide, 'Data Integrity, Security Standards & Zero Fake Metrics', 'Trust & Reliability');

  const principles = [
    {
      title: 'Zero Fake Social Proof',
      desc: 'Eliminated all synthetic "★ 4.8, 250 reviews" placeholders. Unreviewed items explicitly state "Unrated" with community submission queues. Real reviews require authenticated user submission and moderation.',
    },
    {
      title: 'Verified 2026 Model Catalog',
      desc: 'Accurate model releases and specifications (Claude 3.7 Sonnet, DeepSeek-V3, GPT-4.5, Llama 3.3, Phi-4). Pruned misleading pairings (e.g., Bolt.new as Cursor alternative) in favor of authentic developer workflows (Aider, Continue).',
    },
    {
      title: 'Defense-in-Depth Web Security',
      desc: 'HTTP-only secure JWT cookies for session security preventing XSS exfiltration, bcrypt salt-hashing for passwords, Helmet for HTTP header protection, and strict express-rate-limit guards on recommendation endpoints.',
    },
    {
      title: 'Zero API Key Dependency',
      desc: 'System executes end-to-end without requiring third-party credentials. If GEMINI_API_KEY is present, it enriches blurbs; otherwise, the deterministic rule synthesis engine produces clear, reliable recommendations automatically.',
    },
  ];

  principles.forEach((p, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const xPos = 0.8 + col * 6.0;
    const yPos = 1.8 + row * 2.5;

    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos,
      y: yPos,
      w: 5.7,
      h: 2.2,
      fill: { color: C.white },
      line: { color: C.border, width: 1 },
      rectRadius: 0.12,
    });

    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos + 0.3,
      y: yPos + 0.25,
      w: 0.35,
      h: 0.35,
      fill: { color: C.blueBg },
      line: { color: C.blue, width: 1 },
      rectRadius: 0.08,
    });
    slide.addText('✓', {
      x: xPos + 0.3,
      y: yPos + 0.28,
      w: 0.35,
      h: 0.3,
      fontSize: 14,
      fontFace: 'Arial',
      color: C.blue,
      bold: true,
      align: 'center',
    });

    slide.addText(p.title, {
      x: xPos + 0.8,
      y: yPos + 0.25,
      w: 4.6,
      h: 0.35,
      fontSize: 14,
      fontFace: 'Arial',
      color: C.ink,
      bold: true,
    });

    slide.addText(p.desc, {
      x: xPos + 0.8,
      y: yPos + 0.65,
      w: 4.6,
      h: 1.35,
      fontSize: 11,
      fontFace: 'Arial',
      color: C.muted,
    });
  });
}

// -------------------------------------------------------------
// SLIDE 10: Target Audience & User Personas
// -------------------------------------------------------------
{
  const slide = pptx.addSlide();
  slide.background = { color: C.bgLight };
  addHeader(slide, 'Target User Personas & Practical Use Cases', 'Market Segmentation');

  const personas = [
    {
      role: 'Full-Stack Software Engineer',
      focus: 'Daily Code Generation & Architecture',
      need: 'Needs exact model recommendations for boilerplate generation, Prisma/Mongoose schemas, and JWT middleware that balance token cost and accuracy.',
      outcome: 'Uses TechSphere to discover DeepSeek-V3 and Aider for local offline development, saving $240/yr in subscription seats.',
    },
    {
      role: 'Engineering Lead / CTO',
      focus: 'Team Compliance, Cost & Security',
      need: 'Evaluating enterprise AI tooling while enforcing data governance, preventing corporate IP leaks, and reducing API expenditure.',
      outcome: 'Adopts TechSphere MERN Blueprints and Hardware Advisor to deploy internal Ollama clusters for self-hosted developer coding.',
    },
    {
      role: 'AI / ML Researcher & Tinkerer',
      focus: 'Local Compute & Open Weights',
      need: 'Wants to quickly benchmark new open-source models, compare context windows, and find terminal launch commands for their specific hardware.',
      outcome: 'Relies on the Side-by-Side Matrix and Hardware Terminal Advisor for instant quantizations and Ollama deployment scripts.',
    },
  ];

  personas.forEach((p, idx) => {
    const xPos = 0.8 + idx * 4.0;

    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos,
      y: 1.8,
      w: 3.7,
      h: 4.8,
      fill: { color: C.white },
      line: { color: C.border, width: 1 },
      rectRadius: 0.15,
    });

    slide.addText('PERSONA ' + (idx + 1), {
      x: xPos + 0.3,
      y: 2.1,
      w: 3.1,
      h: 0.25,
      fontSize: 10,
      fontFace: 'Arial',
      color: C.blue,
      bold: true,
    });

    slide.addText(p.role, {
      x: xPos + 0.3,
      y: 2.4,
      w: 3.1,
      h: 0.5,
      fontSize: 15,
      fontFace: 'Arial',
      color: C.ink,
      bold: true,
    });

    slide.addText(p.focus, {
      x: xPos + 0.3,
      y: 2.9,
      w: 3.1,
      h: 0.3,
      fontSize: 10,
      fontFace: 'Arial',
      color: C.subtle,
      italic: true,
    });

    slide.addText('CORE CHALLENGE', {
      x: xPos + 0.3,
      y: 3.3,
      w: 3.1,
      h: 0.2,
      fontSize: 9,
      fontFace: 'Arial',
      color: C.ink,
      bold: true,
    });

    slide.addText(p.need, {
      x: xPos + 0.3,
      y: 3.55,
      w: 3.1,
      h: 1.1,
      fontSize: 11,
      fontFace: 'Arial',
      color: C.muted,
    });

    slide.addText('TECHSPHERE IMPACT', {
      x: xPos + 0.3,
      y: 4.7,
      w: 3.1,
      h: 0.2,
      fontSize: 9,
      fontFace: 'Arial',
      color: C.green,
      bold: true,
    });

    slide.addText(p.outcome, {
      x: xPos + 0.3,
      y: 4.95,
      w: 3.1,
      h: 1.3,
      fontSize: 11,
      fontFace: 'Arial',
      color: C.ink,
    });
  });
}

// -------------------------------------------------------------
// SLIDE 11: Roadmap & Future Expansion
// -------------------------------------------------------------
{
  const slide = pptx.addSlide();
  slide.background = { color: C.bgLight };
  addHeader(slide, 'Product Roadmap & Engineering Milestones', 'Future Development');

  const roadmapPhases = [
    {
      phase: 'Phase 1: Foundation (Current)',
      badge: 'COMPLETED & LIVE',
      badgeColor: C.green,
      items: [
        'Full MERN Prototype with in-memory DB',
        'Google-style Search & Category Filters',
        'Commercial ➔ Open Source Register',
        'Guided Finder scoring engine',
        'Hardware RAM Terminal Advisor',
        'Clean Design System v2 & AA contrast',
      ],
    },
    {
      phase: 'Phase 2: Community & Live Sync',
      badge: 'Q1 2027 MILESTONE',
      badgeColor: C.blue,
      items: [
        'Live Hugging Face / Ollama library sync',
        'Automated model release webhooks',
        'Community benchmark leaderboard',
        'User review moderation dashboard',
        'Saved tool profiles & exportable stacks',
        'API Token cost tracking calculator',
      ],
    },
    {
      phase: 'Phase 3: Native CLI & Extensions',
      badge: 'Q2 2027 EXPANSION',
      badgeColor: C.amber,
      items: [
        'Official `techsphere` CLI binary (npm/brew)',
        'VS Code extension for in-IDE recommendations',
        'One-click local model deployment daemon',
        'Enterprise self-hosted Docker registry',
        'Fine-tuning playbook blueprints',
        'Multi-model fallback proxy gateway',
      ],
    },
  ];

  roadmapPhases.forEach((rp, idx) => {
    const xPos = 0.8 + idx * 4.0;

    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos,
      y: 1.8,
      w: 3.7,
      h: 4.8,
      fill: { color: C.white },
      line: { color: C.border, width: 1 },
      rectRadius: 0.15,
    });

    slide.addText(rp.badge, {
      x: xPos + 0.3,
      y: 2.1,
      w: 3.1,
      h: 0.25,
      fontSize: 9,
      fontFace: 'Arial',
      color: rp.badgeColor,
      bold: true,
    });

    slide.addText(rp.phase, {
      x: xPos + 0.3,
      y: 2.4,
      w: 3.1,
      h: 0.5,
      fontSize: 14,
      fontFace: 'Arial',
      color: C.ink,
      bold: true,
    });

    const bulletPoints = rp.items.map((it) => `• ${it}`).join('\n\n');
    slide.addText(bulletPoints, {
      x: xPos + 0.3,
      y: 3.1,
      w: 3.1,
      h: 3.2,
      fontSize: 11,
      fontFace: 'Arial',
      color: C.muted,
    });
  });
}

// -------------------------------------------------------------
// SLIDE 12: Summary & Call to Action (Closing)
// -------------------------------------------------------------
{
  const slide = pptx.addSlide();
  slide.background = { color: C.bgLight };

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 1.2,
    w: 11.7,
    h: 5.1,
    fill: { color: C.white },
    line: { color: C.border, width: 1 },
    rectRadius: 0.2,
  });

  slide.addShape(pptx.ShapeType.rect, {
    x: 0.8,
    y: 1.2,
    w: 11.7,
    h: 0.1,
    fill: { color: C.blue },
  });

  slide.addText('CONCLUSION & ACCESS', {
    x: 1.4,
    y: 1.8,
    w: 10,
    h: 0.3,
    fontSize: 11,
    fontFace: 'Arial',
    color: C.blue,
    bold: true,
    charSpacing: 3,
  });

  slide.addText('TechSphere: Empowering Developers to Build with Open, Transparent Intelligence', {
    x: 1.4,
    y: 2.2,
    w: 10.5,
    h: 0.9,
    fontSize: 24,
    fontFace: 'Arial',
    color: C.ink,
    bold: true,
  });

  slide.addText([
    { text: '✓  High-speed task search with zero decorative noise or marketing buzzwords.\n\n', options: { bold: true, color: C.ink } },
    { text: '✓  Clear commercial-to-open alternative mappings reducing vendor dependency.\n\n', options: { bold: true, color: C.ink } },
    { text: '✓  Instant hardware-to-command terminal calculation for local compute.\n\n', options: { bold: true, color: C.ink } },
    { text: '✓  Full-stack production MERN architecture designed for enterprise extensibility.', options: { bold: true, color: C.ink } },
  ], {
    x: 1.4,
    y: 3.2,
    w: 10.5,
    h: 1.8,
    fontSize: 13,
    fontFace: 'Arial',
    color: C.muted,
  });

  slide.addText('Live Demo: http://localhost:5173  •  API Health: http://localhost:5001/api/v1/health', {
    x: 1.4,
    y: 5.4,
    w: 10.5,
    h: 0.4,
    fontSize: 12,
    fontFace: 'Arial',
    color: C.blue,
    bold: true,
  });
}

// Output Paths
const outputPathRoot = path.join(__dirname, '..', 'TechSphere_Presentation.pptx');
const outputPathBrain = 'C:\\Users\\mohdk\\.gemini\\antigravity\\brain\\f4d36f85-6351-4e83-b3c4-eb0c9053e5d8\\TechSphere_Presentation.pptx';

await pptx.writeFile({ fileName: outputPathRoot });
console.log(`Successfully generated: ${outputPathRoot}`);

await pptx.writeFile({ fileName: outputPathBrain });
console.log(`Successfully generated in artifacts: ${outputPathBrain}`);
