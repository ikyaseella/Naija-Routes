// =============================================================
// NAIJA ROUTES — JWT Authentication Middleware
// File: server/src/middleware/auth.js
// Status: COMMENTED OUT — activate in Phase 1
// =============================================================

/*
import { supabaseAdmin } from '../config/supabase.js';

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized', message: 'No token provided' });
    }
    const token = authHeader.substring(7);
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired token' });
    }
    const { data: profile } = await supabaseAdmin
      .from('users')
      .select('id, phone, full_name, role, lang_pref, is_verified')
      .eq('id', user.id)
      .single();
    if (!profile) {
      return res.status(401).json({ error: 'Unauthorized', message: 'User profile not found' });
    }
    req.user = profile;
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden', message: `Required role: ${allowedRoles.join(' or ')}` });
    }
    next();
  };
}

export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) { req.user = null; return next(); }
    const token = authHeader.substring(7);
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (!error && user) {
      const { data: profile } = await supabaseAdmin
        .from('users').select('id, phone, full_name, role, lang_pref').eq('id', user.id).single();
      req.user = profile || null;
    } else { req.user = null; }
    next();
  } catch (error) { req.user = null; next(); }
}
*/

// PLACEHOLDER EXPORTS — remove when activating above code in Phase 1
export const requireAuth = (req, res, next) => next();
export const requireRole = (...roles) => (req, res, next) => next();
export const optionalAuth = (req, res, next) => next();
