/**
 * Unified response shape: { success, data, error }
 */
export const respond = {
  ok(res, data, status = 200) {
    return res.status(status).json({ success: true, data });
  },
  fail(res, message, status = 400) {
    return res.status(status).json({ success: false, error: message });
  },
};
