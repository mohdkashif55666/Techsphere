import { respond } from '../utils/respond.js';

// eslint-disable-next-line no-unused-vars
export function errorMiddleware(err, req, res, _next) {
  const isDev = process.env.NODE_ENV === 'development';

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return respond.fail(res, messages.join('; '), 422);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return respond.fail(res, `Duplicate value for ${field}`, 409);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') return respond.fail(res, 'Invalid token', 401);
  if (err.name === 'TokenExpiredError') return respond.fail(res, 'Token expired', 401);

  const status = err.status || err.statusCode || 500;
  const message = isDev ? err.message : status >= 500 ? 'Internal server error' : err.message;

  if (isDev) console.error(err);

  return respond.fail(res, message, status);
}
