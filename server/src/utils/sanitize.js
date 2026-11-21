/**
 * Strips MongoDB query operators (keys starting with $) from user input
 * to prevent NoSQL injection.
 */
export function sanitize(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map(sanitize);

  return Object.fromEntries(
    Object.entries(obj)
      .filter(([key]) => !key.startsWith('$'))
      .map(([key, val]) => [key, sanitize(val)])
  );
}
