export const promptsData = [
  {
    title: 'Google Anti-Gravity MERN Prototype Stencil',
    description: 'Ready-to-copy prompt for generating full MERN apps with Google-style UI.',
    body: `Act as an expert full-stack engineer and system architect specializing in the MERN stack (MongoDB, Express, React/Vite, Node.js) and educational technology platforms.

Generate a fully functional web prototype for "TechSphere AI" designed for tech professionals and CS students.

Functional Requirements:
1. AI Tool & Alternative Finder: Searchable index mapping commercial models (GPT-4o, Claude 3.5 Sonnet) to free/open-source alternatives (DeepSeek-V3, Llama 3, Qwen) categorized by task.
2. MERN Architecture Guide: Direct blueprints for schema validation, secure express middleware, and Vite state hooks.
3. Quick Stack Terminal Advisor: Interactive tool prompting users for hardware and target stack to yield precise terminal start commands.

Design Constraints:
- Google-inspired ultra-minimalist aesthetic (clean white canvas, soft rounded inputs, Google Blue #1A73E8 accents).
- Pure high-readability typography, subtle liquid glass button interactions, and zero heavy distractions.`,
    tags: ['mern', 'fullstack', 'prototype', 'google-style', 'anti-gravity'],
    sortOrder: 1,
  },
  {
    title: 'React Component Refactoring Stencil',
    description: 'Prompt to refactor a React component with TypeScript, proper hooks, and Tailwind.',
    body: `Act as a senior React engineer (React 18, TypeScript, Tailwind CSS).

Refactor the following React component to:
1. Use TypeScript with proper interface/type definitions
2. Replace class-based patterns with hooks (useState, useCallback, useMemo)
3. Extract reusable sub-components where appropriate
4. Apply Tailwind CSS utility classes (replace inline styles or CSS modules)
5. Add aria-labels and keyboard navigation for accessibility
6. Add JSDoc comments for exported components and props

Constraints:
- Do not change the visual output
- Keep animation via CSS transitions only
- Use named exports

[Paste your component here]`,
    tags: ['react', 'typescript', 'refactoring', 'tailwind', 'accessibility'],
    sortOrder: 2,
  },
  {
    title: 'Express REST API Endpoint Stencil',
    description: 'Prompt to generate a complete, validated, secured Express route with Mongoose.',
    body: `Act as a senior Node.js/Express engineer.

Generate a complete REST API endpoint with the following specification:

Resource: [RESOURCE_NAME]
Method: [GET | POST | PUT | DELETE]
Path: /api/v1/[path]

Requirements:
1. Zod validation schema for request body/query/params
2. Mongoose model interaction with proper error handling
3. asyncWrap pattern (no try/catch blocks in controllers)
4. Consistent response shape: { success: boolean, data?, error? }
5. Rate limiting annotation where appropriate
6. JWT auth guard if the route requires authentication
7. Input sanitization (strip $ operators)

Include: route definition, controller, Zod schema, and any necessary middleware.`,
    tags: ['express', 'api', 'mongoose', 'validation', 'backend'],
    sortOrder: 3,
  },
  {
    title: 'MongoDB Schema Design Stencil',
    description: 'Prompt to design an optimal MongoDB schema with indexes for a given domain.',
    body: `Act as a MongoDB/Mongoose expert.

Design a production-ready Mongoose schema for the following domain:

Domain: [DESCRIBE YOUR DATA]
Expected collection size: [small <10k | medium 10k-1M | large >1M]
Query patterns:
- [List your most common query patterns]
- [e.g. "find by userId and status, sorted by createdAt desc"]

Requirements:
1. Strict schema with proper types and validation
2. Embed vs. reference decision with justification
3. All necessary indexes (text, compound, sparse) with explanation
4. Pre-save hooks for computed fields (e.g. slug, timestamps)
5. Static methods for common queries
6. Timestamp fields (createdAt/updatedAt)
7. Comment on sharding key if collection will exceed 100GB`,
    tags: ['mongodb', 'mongoose', 'schema', 'database', 'design'],
    sortOrder: 4,
  },
];

export const categoriesData = [
  { name: 'Full-Stack', slug: 'fullStack', label: 'Full-Stack', icon: 'Layers', sortOrder: 1 },
  { name: 'Frontend/UI', slug: 'frontend', label: 'Frontend / UI', icon: 'Monitor', sortOrder: 2 },
  { name: 'Backend/API', slug: 'backend', label: 'Backend / API', icon: 'Server', sortOrder: 3 },
  { name: 'ML/Deep Learning', slug: 'ml', label: 'ML / Deep Learning', icon: 'Brain', sortOrder: 4 },
  { name: 'Data Analysis', slug: 'dataAnalysis', label: 'Data Analysis', icon: 'BarChart2', sortOrder: 5 },
  { name: 'DevOps/Cloud', slug: 'devOps', label: 'DevOps / Cloud', icon: 'Cloud', sortOrder: 6 },
  { name: 'Mobile', slug: 'mobile', label: 'Mobile', icon: 'Smartphone', sortOrder: 7 },
  { name: 'Cybersecurity', slug: 'cybersecurity', label: 'Cybersecurity', icon: 'Shield', sortOrder: 8 },
  { name: 'Debugging/Code Review', slug: 'debugging', label: 'Debugging / Code Review', icon: 'Bug', sortOrder: 9 },
  { name: 'Docs/Tests', slug: 'docs', label: 'Docs / Tests', icon: 'FileText', sortOrder: 10 },
  { name: 'Research/Learning', slug: 'research', label: 'Research / Learning', icon: 'BookOpen', sortOrder: 11 },
  { name: 'UI/UX Design', slug: 'uiUx', label: 'UI / UX Design', icon: 'Palette', sortOrder: 12 },
  { name: 'Agents/Automation', slug: 'agents', label: 'Agents / Automation', icon: 'Zap', sortOrder: 13 },
];
