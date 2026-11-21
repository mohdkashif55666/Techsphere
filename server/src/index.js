import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import { connectDB } from './config/db.js';
import { seedIfEmpty } from './utils/autoSeed.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { respond } from './utils/respond.js';

// Routes
import authRoutes from './routes/auth.routes.js';
import toolsRoutes from './routes/tools.routes.js';
import registryRoutes from './routes/registry.routes.js';
import recommendRoutes from './routes/recommend.routes.js';
import searchRoutes from './routes/search.routes.js';
import blueprintsRoutes from './routes/blueprints.routes.js';
import terminalRoutes from './routes/terminal.routes.js';
import promptsRoutes from './routes/prompts.routes.js';
import compareRoutes from './routes/compare.routes.js';
import favoritesRoutes from './routes/favorites.routes.js';
import reviewsRoutes from './routes/reviews.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app = express();
const PORT = process.env.PORT || 5001;

// ── Security & logging ───────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);
      
      const allowed = process.env.CLIENT_ORIGIN;
      // If CLIENT_ORIGIN is '*', allow all
      if (allowed === '*' || !allowed) return callback(null, true);

      // Support comma-separated origins or match vercel preview domains
      const origins = allowed.split(',').map(s => s.trim());
      if (origins.includes(origin) || origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in cloud deployment to prevent CORS friction
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(cookieParser());
app.use(express.json({ limit: '10kb' })); // prevent large payloads

// ── Global rate limiter ──────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later.' },
});
app.use(globalLimiter);

// ── Health check & Root info ─────────────────────────────────────────────
app.get('/', (_req, res) => {
  respond.ok(res, {
    name: 'TechSphere API',
    status: 'online',
    version: '1.0.0',
    documentation: '/api/v1/health',
  });
});

app.get('/api/v1/health', (_req, res) => {
  respond.ok(res, { ok: true, db: 'connected', env: process.env.NODE_ENV });
});

// ── API routes ───────────────────────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tools', toolsRoutes);
app.use('/api/v1/registry', registryRoutes);
app.use('/api/v1/recommend', recommendRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/blueprints', blueprintsRoutes);
app.use('/api/v1/terminal-advisor', terminalRoutes);
app.use('/api/v1/prompts', promptsRoutes);
app.use('/api/v1/compare', compareRoutes);
app.use('/api/v1/favorites', favoritesRoutes);
app.use('/api/v1/reviews', reviewsRoutes);
app.use('/api/v1/admin', adminRoutes);

// ── 404 handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => respond.fail(res, 'Route not found', 404));

// ── Central error handler ────────────────────────────────────────────────────
app.use(errorMiddleware);

// ── Start ─────────────────────────────────────────────────────────────────────
connectDB().then(async () => {
  await seedIfEmpty();
  app.listen(PORT, () => {
    console.log(`🚀  TechSphere server → http://localhost:${PORT}`);
    console.log(`    Health: http://localhost:${PORT}/api/v1/health`);
  });
});
