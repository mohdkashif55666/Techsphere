/**
 * Wraps async route handlers so unhandled promise rejections
 * are forwarded to Express's central error middleware.
 */
export const asyncWrap = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
