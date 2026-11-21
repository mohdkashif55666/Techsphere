import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User from '../models/User.model.js';
import { respond } from '../utils/respond.js';
import { asyncWrap } from '../middleware/asyncWrapper.js';
import { validate } from '../middleware/validate.middleware.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

function sendToken(res, user, status = 200) {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  res.cookie('token', token, cookieOptions);

  return respond.ok(
    res,
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarInitials: user.avatarInitials,
        savedTools: user.savedTools,
      },
    },
    status
  );
}

// POST /register
router.post(
  '/register',
  validate(registerSchema),
  asyncWrap(async (req, res) => {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return respond.fail(res, 'An account with this email already exists', 409);
    }

    const count = await User.countDocuments();
    // First user can be admin for convenience
    const role = count === 0 ? 'admin' : 'user';

    const user = await User.create({ name, email, password, role });
    return sendToken(res, user, 201);
  })
);

// POST /login
router.post(
  '/login',
  validate(loginSchema),
  asyncWrap(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return respond.fail(res, 'Invalid email or password', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return respond.fail(res, 'Invalid email or password', 401);
    }

    return sendToken(res, user, 200);
  })
);

// POST /logout
router.post('/logout', (req, res) => {
  res.clearCookie('token', cookieOptions);
  return respond.ok(res, { message: 'Logged out successfully' });
});

// GET /me
router.get(
  '/me',
  requireAuth,
  asyncWrap(async (req, res) => {
    return respond.ok(res, {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        avatarInitials: req.user.avatarInitials,
        savedTools: req.user.savedTools,
      },
    });
  })
);

export default router;
