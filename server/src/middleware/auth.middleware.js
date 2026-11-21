import jwt from 'jsonwebtoken';
import { respond } from '../utils/respond.js';
import User from '../models/User.model.js';
import { asyncWrap } from './asyncWrapper.js';

export const requireAuth = asyncWrap(async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return respond.fail(res, 'Not authenticated', 401);

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select('-password');
  if (!user) return respond.fail(res, 'User not found', 401);

  req.user = user;
  next();
});

export const requireAdmin = asyncWrap(async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return respond.fail(res, 'Not authenticated', 401);

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select('-password');
  if (!user || user.role !== 'admin') return respond.fail(res, 'Forbidden', 403);

  req.user = user;
  next();
});
