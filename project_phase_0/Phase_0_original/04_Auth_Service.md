# 🔐 Phase 0 — Step 4: Authentication Service
## Supabase Auth — Setup & Code (Commented Out for Phase 1)

> **Status:** The concepts are explained and ALL code is written below.
> The code is commented out with `/* ... */` or prefixed with `//` and will be activated in Phase 1.
> **Do not uncomment or connect** until instructed — focus on understanding the structure now.

---

## How Naija Routes Authentication Works

```
User enters phone number
         │
         ▼
Supabase sends OTP via SMS (Termii in production)
         │
         ▼
User enters OTP code
         │
         ▼
Supabase verifies OTP → issues JWT access token + refresh token
         │
         ▼
Frontend stores JWT in localStorage
         │
         ▼
Every API request includes: Authorization: Bearer <JWT>
         │
         ▼
Backend middleware verifies JWT → reads user role from token
         │
         ▼
Role-based access: traveller / agent / operator / admin
```

---

## What is JWT?

**JWT** (JSON Web Token) is a compact, self-contained token that proves who you are.

Structure: `header.payload.signature`

When decoded, the payload looks like:
```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "phone": "+2348012345678",
  "role": "traveller",
  "iat": 1750123456,
  "exp": 1750209856
}
```

| Field | Meaning |
|---|---|
| `sub` | Subject — the user's UUID from our `users` table |
| `phone` | Their verified phone number |
| `role` | `traveller`, `agent`, `operator`, or `admin` |
| `iat` | Issued At — when the token was created (Unix timestamp) |
| `exp` | Expiry — when the token stops working (24 hours later) |

The backend **verifies the signature** of every token using Supabase's public key — no database lookup needed for every request.

---

## File Structure We're Setting Up

```
naija-routes/
└── server/
    └── src/
        ├── config/
        │   └── supabase.js      ← Supabase client (commented)
        └── middleware/
            └── auth.js          ← JWT verification middleware (commented)
```

And for the frontend apps:

```
naija-routes/
└── shared/
    └── web/
        └── js/
            └── auth.js          ← Frontend auth helpers (commented)
```

---

## Step 1 — Install the Supabase SDK

> ⏸️ **Do NOT run these commands yet.** Read them, understand what they do, and note them for Phase 1.

```powershell
# Install Supabase client for the backend server
# (run from inside naija-routes/server/)
# npm install @supabase/supabase-js

# Install for frontend apps (run from each app folder OR at root)
# pnpm add @supabase/supabase-js --filter web
# pnpm add @supabase/supabase-js --filter agent
# pnpm add @supabase/supabase-js --filter operator
```

---

## Step 2 — Backend: Supabase Client Configuration

This file creates the Supabase client that all server code will use to talk to the database.

### Create the file

In VS Code, right-click `server/src/config/` → **New File** → type `supabase.js`

Or in the terminal (from the `naija-routes/` root):
```powershell
New-Item -Path "server\src\config\supabase.js" -ItemType File
```

Paste in this content:

```javascript
// =============================================================
// NAIJA ROUTES — Supabase Client Configuration
// File: server/src/config/supabase.js
// Status: COMMENTED OUT — activate in Phase 1
// =============================================================

/*
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// -------------------------------------------------------
// Validate required environment variables
// -------------------------------------------------------
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// -------------------------------------------------------
// Admin client — uses service_role key
// Has full database access, bypasses Row Level Security
// USE ONLY in server-side code, NEVER expose to frontend
// -------------------------------------------------------
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// -------------------------------------------------------
// Public client — uses anon key
// Respects Row Level Security policies
// Safe to use in server-side code that mimics frontend access
// -------------------------------------------------------
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);
*/

// PLACEHOLDER — remove this when activating above code
export const supabaseAdmin = null;
export const supabase = null;
```

---

## Step 3 — Backend: JWT Auth Middleware

This middleware runs on every protected API route and verifies the user's JWT token.

### Create the file

In VS Code, right-click `server/src/middleware/` → **New File** → type `auth.js`

Or in the terminal:
```powershell
New-Item -Path "server\src\middleware\auth.js" -ItemType File
```

Paste in this content:

```javascript
// =============================================================
// NAIJA ROUTES — JWT Authentication Middleware
// File: server/src/middleware/auth.js
// Status: COMMENTED OUT — activate in Phase 1
// =============================================================

/*
import { supabaseAdmin } from '../config/supabase.js';

// -------------------------------------------------------
// requireAuth
// Attaches the verified user to req.user
// Returns 401 if token is missing or invalid
// -------------------------------------------------------
export async function requireAuth(req, res, next) {
  try {
    // 1. Extract Bearer token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No authentication token provided'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // 2. Verify token with Supabase
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token'
      });
    }

    // 3. Fetch full user profile from our users table
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('id, phone, full_name, role, lang_pref, is_verified')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User profile not found'
      });
    }

    // 4. Attach user to request object for downstream handlers
    req.user = profile;

    next(); // Continue to the route handler

  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication check failed'
    });
  }
}


// -------------------------------------------------------
// requireRole(...roles)
// Must be used AFTER requireAuth
// Returns 403 if user's role is not in the allowed list
//
// Usage:
//   router.get('/admin/users', requireAuth, requireRole('admin'), handler)
//   router.post('/bookings', requireAuth, requireRole('traveller', 'agent'), handler)
// -------------------------------------------------------
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}`
      });
    }

    next();
  };
}


// -------------------------------------------------------
// optionalAuth
// Like requireAuth but doesn't block if token is missing
// Used for public routes that show extra data when logged in
// (e.g. search results showing "your previous booking" if logged in)
// -------------------------------------------------------
export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null; // No user, but continue
      return next();
    }

    const token = authHeader.substring(7);
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (!error && user) {
      const { data: profile } = await supabaseAdmin
        .from('users')
        .select('id, phone, full_name, role, lang_pref')
        .eq('id', user.id)
        .single();

      req.user = profile || null;
    } else {
      req.user = null;
    }

    next();
  } catch (error) {
    req.user = null;
    next(); // Never block on optional auth
  }
}
*/

// PLACEHOLDER EXPORTS — remove when activating above code
export const requireAuth = (req, res, next) => next();
export const requireRole = (...roles) => (req, res, next) => next();
export const optionalAuth = (req, res, next) => next();
```

---

## Step 4 — Backend: Auth Routes

This file defines all the API endpoints for logging in and out.

### Create the file

In VS Code, right-click `server/src/routes/` → **New File** → type `auth.routes.js`

Or in the terminal:
```powershell
New-Item -Path "server\src\routes\auth.routes.js" -ItemType File
```

Paste in this content:

```javascript
// =============================================================
// NAIJA ROUTES — Auth API Routes
// File: server/src/routes/auth.routes.js
// Status: COMMENTED OUT — activate in Phase 1
// Endpoints:
//   POST /api/v1/auth/otp/send
//   POST /api/v1/auth/otp/verify
//   POST /api/v1/auth/refresh
//   POST /api/v1/auth/logout
// =============================================================

import express from 'express';
// import { supabaseAdmin } from '../config/supabase.js'; // Uncomment in Phase 1
// import { requireAuth } from '../middleware/auth.js';   // Uncomment in Phase 1

const router = express.Router();

/*
// -------------------------------------------------------
// POST /api/v1/auth/otp/send
// Sends a 6-digit OTP to the given phone number via SMS
// -------------------------------------------------------
router.post('/otp/send', async (req, res) => {
  try {
    const { phone } = req.body;

    // Validate Nigerian phone number format
    const nigerianPhoneRegex = /^(\+234|0)[789]\d{9}$/;
    if (!nigerianPhoneRegex.test(phone)) {
      return res.status(400).json({
        error: 'Invalid phone number',
        message: 'Please provide a valid Nigerian phone number (e.g. +2348012345678)'
      });
    }

    // Normalise to international format
    const normalizedPhone = phone.startsWith('0')
      ? '+234' + phone.substring(1)
      : phone;

    // Supabase sends OTP via its configured SMS provider
    const { error } = await supabaseAdmin.auth.signInWithOtp({
      phone: normalizedPhone
    });

    if (error) {
      console.error('OTP send error:', error);
      return res.status(500).json({
        error: 'OTP Failed',
        message: 'Could not send OTP. Please try again.'
      });
    }

    return res.json({
      success: true,
      message: 'OTP sent successfully',
      phone: normalizedPhone
    });

  } catch (error) {
    console.error('Auth OTP send error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


// -------------------------------------------------------
// POST /api/v1/auth/otp/verify
// Verifies the OTP and returns JWT tokens + user profile
// -------------------------------------------------------
router.post('/otp/verify', async (req, res) => {
  try {
    const { phone, token } = req.body;

    if (!phone || !token) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Phone and OTP token are required'
      });
    }

    // Verify OTP with Supabase
    const { data, error } = await supabaseAdmin.auth.verifyOtp({
      phone,
      token,
      type: 'sms'
    });

    if (error || !data.user) {
      return res.status(401).json({
        error: 'Invalid OTP',
        message: 'The code you entered is incorrect or has expired'
      });
    }

    // Check if user profile exists; create it if first login
    let { data: profile } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (!profile) {
      // First time login — create profile with default 'traveller' role
      const { data: newProfile, error: insertError } = await supabaseAdmin
        .from('users')
        .insert({
          id: data.user.id,
          phone: phone,
          role: 'traveller',
          is_verified: true
        })
        .select()
        .single();

      if (insertError) {
        console.error('Profile creation error:', insertError);
        return res.status(500).json({ error: 'Profile creation failed' });
      }

      profile = newProfile;
    }

    return res.json({
      success: true,
      user: {
        id: profile.id,
        phone: profile.phone,
        full_name: profile.full_name,
        role: profile.role,
        lang_pref: profile.lang_pref
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at
      }
    });

  } catch (error) {
    console.error('Auth OTP verify error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


// -------------------------------------------------------
// POST /api/v1/auth/refresh
// Exchanges a refresh token for a new access token
// -------------------------------------------------------
router.post('/refresh', async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({ error: 'Refresh token required' });
    }

    const { data, error } = await supabaseAdmin.auth.refreshSession({
      refresh_token
    });

    if (error || !data.session) {
      return res.status(401).json({
        error: 'Session expired',
        message: 'Please log in again'
      });
    }

    return res.json({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at
    });

  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


// -------------------------------------------------------
// POST /api/v1/auth/logout
// Invalidates the user's session
// -------------------------------------------------------
router.post('/logout', requireAuth, async (req, res) => {
  try {
    await supabaseAdmin.auth.admin.signOut(req.headers.authorization.substring(7));
    return res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});
*/

// TEMPORARY: placeholder route so the file is valid JS
router.get('/status', (req, res) => {
  res.json({ status: 'Auth routes not yet activated. Activate in Phase 1.' });
});

export default router;
```

---

## Step 5 — Frontend: Auth Helper

This shared file lets all three frontend apps (web, agent, operator) log users in and out and make authenticated API calls.

### Create the file

In VS Code, right-click `shared/web/js/` → **New File** → type `auth.js`

Or in the terminal:
```powershell
New-Item -Path "shared\web\js\auth.js" -ItemType File
```

Paste in this content:

```javascript
// =============================================================
// NAIJA ROUTES — Frontend Auth Helper
// File: shared/web/js/auth.js
// Status: COMMENTED OUT — activate in Phase 1
// Usage: Import in apps/web, apps/agent, apps/operator
// =============================================================

/*
// -------------------------------------------------------
// Token storage helpers
// -------------------------------------------------------
const TOKEN_KEY = 'naija_access_token';
const REFRESH_KEY = 'naija_refresh_token';
const USER_KEY = 'naija_user';

export const Auth = {

  // Store session data after login
  setSession(user, accessToken, refreshToken) {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Get the current access token (for API calls)
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Get the current logged-in user
  getUser() {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  // Check if a user is logged in
  isLoggedIn() {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  // Check if user has a specific role
  hasRole(role) {
    const user = this.getUser();
    return user ? user.role === role : false;
  },

  // Clear all auth data (logout)
  clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Make an authenticated API call
  async fetchWithAuth(url, options = {}) {
    const token = this.getToken();
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(options.headers || {})
      }
    });
  },

  // Send OTP to phone number
  async sendOTP(phone) {
    const response = await fetch('/api/v1/auth/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });
    return response.json();
  },

  // Verify OTP and log in
  async verifyOTP(phone, otpCode) {
    const response = await fetch('/api/v1/auth/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, token: otpCode })
    });

    const data = await response.json();

    if (data.success) {
      this.setSession(data.user, data.session.access_token, data.session.refresh_token);
    }

    return data;
  },

  // Log out
  async logout() {
    await this.fetchWithAuth('/api/v1/auth/logout', { method: 'POST' });
    this.clearSession();
    window.location.href = '/';
  }
};
*/

// PLACEHOLDER — export an empty object until auth is activated in Phase 1
export const Auth = {
  isLoggedIn: () => false,
  getUser: () => null,
  getToken: () => null,
  hasRole: () => false,
  clearSession: () => {},
  fetchWithAuth: (url, opts) => fetch(url, opts),
};
```

---

## Role-Based Access: Who Can Do What

| Action | Traveller | Agent | Operator | Admin |
|---|---|---|---|---|
| Search routes | ✅ | ✅ | ✅ | ✅ |
| Book a ticket | ✅ | ✅ | ❌ | ✅ |
| Sell tickets (walk-up) | ❌ | ✅ | ❌ | ✅ |
| Scan QR tickets | ❌ | ✅ | ❌ | ✅ |
| View own bookings | ✅ | ❌ | ❌ | ✅ |
| Manage routes/schedules | ❌ | ❌ | ✅ | ✅ |
| View revenue dashboard | ❌ | ❌ | ✅ | ✅ |
| Approve operators (KYC) | ❌ | ❌ | ❌ | ✅ |
| Manage all users | ❌ | ❌ | ❌ | ✅ |

---

## ✅ Phase 0 Auth Checklist

**File creation** (terminal or VS Code):
- [ ] Created `server/src/config/` folder
- [ ] Created `server/src/middleware/` folder
- [ ] Created `server/src/routes/` folder
- [ ] Created `shared/web/js/` folder
- [ ] Created `server/src/config/supabase.js` with commented code
- [ ] Created `server/src/middleware/auth.js` with commented code
- [ ] Created `server/src/routes/auth.routes.js` with commented code
- [ ] Created `shared/web/js/auth.js` with commented code

**Understanding** (answer these before moving on):
- [ ] Drawn the OTP flow diagram from memory
- [ ] Can explain what a JWT is and name 3 fields in its payload
- [ ] Can explain the difference between `requireAuth` and `optionalAuth`
- [ ] Can list all 4 user roles and one thing each role can do that others cannot

> 🔖 **Phase 1 task:** Uncomment all the code in these files, run `pnpm add @supabase/supabase-js --filter server`, and connect the OTP login flow to the web app's login page.
