// =============================================================
// NAIJA ROUTES — Auth API Routes
// File: server/src/routes/auth.routes.js
// Status: COMMENTED OUT — activate in Phase 1
// Endpoints (when active):
//   POST /api/v1/auth/otp/send
//   POST /api/v1/auth/otp/verify
//   POST /api/v1/auth/refresh
//   POST /api/v1/auth/logout
// =============================================================

import express from 'express';

// Uncomment these imports in Phase 1:
// import { supabaseAdmin } from '../config/supabase.js';
// import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// ------------------------------------------------------------------
// All route handlers are commented out — see 04_Auth_Service.md in
// Phase_0 for the full implementation code ready to paste in Phase 1.
// ------------------------------------------------------------------

/*
router.post('/otp/send', async (req, res) => { ... });
router.post('/otp/verify', async (req, res) => { ... });
router.post('/refresh', async (req, res) => { ... });
router.post('/logout', requireAuth, async (req, res) => { ... });
*/

// Status endpoint — safe to use during Phase 0
router.get('/status', (req, res) => {
  res.json({
    status: 'Auth routes scaffolded but not yet active.',
    activateIn: 'Phase 1',
    plannedEndpoints: [
      'POST /api/v1/auth/otp/send',
      'POST /api/v1/auth/otp/verify',
      'POST /api/v1/auth/refresh',
      'POST /api/v1/auth/logout',
    ],
  });
});

export default router;
