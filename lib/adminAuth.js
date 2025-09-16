import { verifyToken } from './auth';

export function isAdmin(req) {
  const cookie = req.headers.cookie || '';
  const tokenMatch = cookie.match(/admin_token=([^;]+)/);
  if (!tokenMatch) return false;
  const token = tokenMatch[1];
  const payload = verifyToken(token);
  return payload && payload.role === 'admin';
}

export function requireAdmin(req, res) {
  if (!isAdmin(req)) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}
