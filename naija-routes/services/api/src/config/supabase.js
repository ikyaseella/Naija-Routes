// =============================================================
// NAIJA ROUTES — Supabase Client Configuration
// File: server/src/config/supabase.js
// Status: COMMENTED OUT — activate in Phase 1
// =============================================================

/*
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);
*/

// PLACEHOLDER — remove when activating above code in Phase 1
export const supabaseAdmin = null;
export const supabase = null;
