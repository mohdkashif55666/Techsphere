import { respond } from '../utils/respond.js';

/**
 * Validates req.body (or req.query / req.params) against a Zod schema.
 * Usage: router.post('/path', validate(schema), controller)
 */
export const validate = (schema, source = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    const message = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
    return respond.fail(res, message, 422);
  }
  req[source] = result.data; // replace with parsed (coerced) data
  next();
};
