export const blueprintsData = [
  // ── DATABASE pillar ──────────────────────────────────────────────────────
  {
    slug: 'mongodb-schemas-indexes',
    pillar: 'database',
    title: 'MongoDB Schemas & Indexes',
    summary: 'Strict schema governance with Mongoose, compound indexes, and lifecycle hooks for production-ready MongoDB collections.',
    bodyMarkdown: `# MongoDB Schemas & Indexes

## Overview
A well-designed schema is the foundation of a performant MERN app. Mongoose gives you schema validation, virtuals, middleware hooks, and index management.

## Core Principles
- **Strict mode**: Always set \`{ strict: true }\` (it's the default) to reject unknown fields.
- **Timestamps**: Add \`{ timestamps: true }\` to every schema for free \`createdAt\`/\`updatedAt\`.
- **Indexes**: Define indexes in the schema file, not as migration scripts.
- **Embed vs Reference**: Embed data that is always read together; reference data that is queried independently.

## Schema Validation Pattern
Use Mongoose's built-in validation plus Zod on the route layer for belt-and-suspenders safety.

## Index Strategy
- Text index on searchable fields for \`$text\` queries.
- Compound index on fields used together in filter queries.
- Sparse index on optional unique fields (e.g. slug).

> ⚠️ Data in this guide uses placeholder values. Verify schema design against your production requirements.`,
    codeSnippets: [
      {
        label: 'Basic Mongoose Schema with Indexes',
        language: 'javascript',
        code: `import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: '' },
    price:       { type: Number, min: 0, required: true },
    category:    { type: String, required: true },
    tags:        [String],
    isActive:    { type: Boolean, default: true },
  },
  { timestamps: true, strict: true }
);

// Full-text search index
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Compound index for filtered list queries
productSchema.index({ category: 1, isActive: 1, price: 1 });

export default mongoose.model('Product', productSchema);`,
      },
      {
        label: 'Pre-save Hook Pattern',
        language: 'javascript',
        code: `// Auto-generate slug from name before saving
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});`,
      },
    ],
    tags: ['mongodb', 'mongoose', 'schema', 'indexes', 'database'],
    sortOrder: 1,
  },
  {
    slug: 'mongodb-aggregation-patterns',
    pillar: 'database',
    title: 'Aggregation Pipeline Patterns',
    summary: 'Common MongoDB aggregation patterns for analytics, joins, pagination, and computed fields in MERN applications.',
    bodyMarkdown: `# Aggregation Pipeline Patterns

## Overview
The MongoDB Aggregation Pipeline is the right tool for analytics, computed fields, cross-collection joins (\`$lookup\`), and complex filtering that \`find()\` cannot express efficiently.

## Key Stages
- **\$match**: Always put early to reduce documents before expensive stages.
- **\$lookup**: Join collections; avoid on large unindexed collections.
- **\$project**: Shape output; drop fields you don't need.
- **\$facet**: Parallel pipelines (used for paginated results + total count in one query).

> ⚠️ Test aggregations with \`explain()\` in MongoDB Compass before shipping to production.`,
    codeSnippets: [
      {
        label: 'Paginated results with total count ($facet)',
        language: 'javascript',
        code: `const results = await Tool.aggregate([
  { $match: { 'capabilities.openSource': true } },
  { $sort: { avgRating: -1 } },
  {
    $facet: {
      data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
      meta: [{ $count: 'total' }],
    },
  },
]);

const tools = results[0].data;
const total = results[0].meta[0]?.total ?? 0;`,
      },
    ],
    tags: ['mongodb', 'aggregation', 'pagination', 'analytics'],
    sortOrder: 2,
  },

  // ── BACKEND pillar ───────────────────────────────────────────────────────
  {
    slug: 'express-error-handling-cors-jwt',
    pillar: 'backend',
    title: 'Express Error Handling, CORS & JWT',
    summary: 'Centralized error middleware, CORS lockdown, httpOnly JWT cookies, and rate limiting for production Express APIs.',
    bodyMarkdown: `# Express Error Handling, CORS & JWT

## Central Error Middleware
Place this **after** all routes. Express identifies it as error middleware via its 4-argument signature \`(err, req, res, next)\`.

## CORS Strategy
Lock CORS to your client origin. Never use \`origin: '*'\` in production — it allows any site to make authenticated requests with cookies.

## JWT in httpOnly Cookies
Never store JWTs in \`localStorage\` — they are readable by JavaScript and vulnerable to XSS.
\`httpOnly + SameSite=Strict\` cookies are invisible to JavaScript and resist CSRF.

## Rate Limiting
Apply aggressive limits to auth routes. More lenient limits on search routes.

> ⚠️ Rotate JWT secrets and invalidate old tokens when a breach is suspected.`,
    codeSnippets: [
      {
        label: 'Central Error Middleware',
        language: 'javascript',
        code: `// Place AFTER all routes in src/index.js
export function errorMiddleware(err, req, res, _next) {
  const status = err.status || 500;
  const message =
    process.env.NODE_ENV === 'production' && status >= 500
      ? 'Internal server error'
      : err.message;

  res.status(status).json({ success: false, error: message });
}`,
      },
      {
        label: 'CORS + Helmet setup',
        language: 'javascript',
        code: `import helmet from 'helmet';
import cors from 'cors';

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,          // required for cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);`,
      },
      {
        label: 'Issue httpOnly JWT Cookie',
        language: 'javascript',
        code: `import jwt from 'jsonwebtoken';

export function issueToken(res, userId) {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  });
}`,
      },
    ],
    tags: ['express', 'jwt', 'cors', 'security', 'middleware'],
    sortOrder: 3,
  },
  {
    slug: 'express-async-validation-zod',
    pillar: 'backend',
    title: 'Async Routes & Zod Validation',
    summary: 'Async route wrapper pattern and Zod request validation middleware for clean, type-safe Express routes.',
    bodyMarkdown: `# Async Routes & Zod Validation

## The asyncWrap Pattern
Without this, unhandled promise rejections in async route handlers crash the process in older Node or silently hang in newer Node — they don't reach your error middleware. Wrap every async handler.

## Zod on the Route Layer
Define schemas once and reuse them as TypeScript types (client-side) and runtime validators (server-side). The validate middleware coerces the parsed data back onto \`req.body\` so your controller sees clean, typed values.`,
    codeSnippets: [
      {
        label: 'asyncWrap utility',
        language: 'javascript',
        code: `export const asyncWrap = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);`,
      },
      {
        label: 'Zod validation middleware',
        language: 'javascript',
        code: `import { z } from 'zod';

export const validate = (schema, source = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    const msg = result.error.errors
      .map((e) => \`\${e.path.join('.')}: \${e.message}\`)
      .join('; ');
    return res.status(422).json({ success: false, error: msg });
  }
  req[source] = result.data;
  next();
};

// Usage in route:
const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

router.post('/register', validate(registerSchema), asyncWrap(registerController));`,
      },
    ],
    tags: ['express', 'zod', 'validation', 'async', 'typescript'],
    sortOrder: 4,
  },

  // ── FRONTEND pillar ──────────────────────────────────────────────────────
  {
    slug: 'react-vite-tanstack-query',
    pillar: 'frontend',
    title: 'React + Vite + TanStack Query',
    summary: 'Server state management with TanStack Query, custom hooks, Vite proxy for development, and route-level code splitting.',
    bodyMarkdown: `# React + Vite + TanStack Query

## Why TanStack Query?
Traditional \`useEffect + useState\` for API data is verbose and error-prone. TanStack Query gives you caching, deduplication, background refetching, loading/error states, and stale-while-revalidate out of the box.

## Vite Proxy
In development, Vite can proxy API requests to your Express server, eliminating CORS issues during local development.

## Code Splitting
Use \`React.lazy\` + \`Suspense\` for route-level splitting so each page is only loaded when navigated to.`,
    codeSnippets: [
      {
        label: 'Vite proxy config',
        language: 'javascript',
        code: `// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
});`,
      },
      {
        label: 'Custom useTools query hook',
        language: 'javascript',
        code: `import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useTools({ q = '', page = 1, filters = {} } = {}) {
  return useQuery({
    queryKey: ['tools', q, page, filters],
    queryFn: () =>
      api.get('/tools', { params: { q, page, ...filters } }).then((r) => r.data),
    staleTime: 30_000,           // 30 s before background refetch
    keepPreviousData: true,      // no flash between page changes
  });
}`,
      },
      {
        label: 'Route-level code splitting',
        language: 'jsx',
        code: `import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PageSkeleton from './components/common/PageSkeleton';

const Home = lazy(() => import('./pages/Home'));
const Search = lazy(() => import('./pages/Search'));
const Find = lazy(() => import('./pages/Find'));

export default function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/find" element={<Find />} />
      </Routes>
    </Suspense>
  );
}`,
      },
    ],
    tags: ['react', 'vite', 'tanstack-query', 'hooks', 'performance'],
    sortOrder: 5,
  },
  {
    slug: 'react-hook-form-zod',
    pillar: 'frontend',
    title: 'React Hook Form + Zod',
    summary: 'Type-safe forms with React Hook Form and Zod resolvers. Covers multi-step wizard patterns used in the Guided Finder.',
    bodyMarkdown: `# React Hook Form + Zod

## Why React Hook Form?
Controlled inputs re-render on every keystroke. React Hook Form uses uncontrolled inputs under the hood, re-rendering only when needed — dramatically improving form performance.

## Zod Resolver
The \`@hookform/resolvers/zod\` adapter connects your Zod schema to RHF, providing real-time validation with type inference.

## Multi-step Wizard
Store the accumulated form state in a parent component (or Zustand store) and render one step at a time.`,
    codeSnippets: [
      {
        label: 'Single form with Zod',
        language: 'jsx',
        code: `import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'At least 6 characters'),
});

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} placeholder="Email" />
      {errors.email && <span>{errors.email.message}</span>}

      <input type="password" {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit">Log in</button>
    </form>
  );
}`,
      },
    ],
    tags: ['react', 'forms', 'zod', 'validation', 'rhf'],
    sortOrder: 6,
  },
];
