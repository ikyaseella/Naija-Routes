# 🚌 Naija Routes — Phase 0 Student Guide
## Setting Up the Project Foundation

> **Before you start:** Make sure you have read `Concepts.md` in this folder. It explains *why* we use every tool here. Don't skip it!

---

## 🎯 What You Will Accomplish

By the end of Phase 0, you will have:
- [ ] Installed all required tools on your computer
- [ ] Created the full monorepo folder structure
- [ ] Configured Turborepo to manage all your apps
- [ ] Scaffolded three frontend apps (web, agent, operator) using Vite
- [ ] Set up the backend server folder
- [ ] Created the shared CSS design token system
- [ ] Installed all dependencies and successfully started all apps
- [ ] Protected secrets with `.gitignore`
- [ ] Built the full server folder structure (`src/config`, `src/middleware`, `src/routes`, `migrations`)
- [ ] Created the Express app entry files (`app.js` and `server.js`)
- [ ] Created the environment variables file (`.env.example` → `.env`)
- [ ] Created the shared frontend auth helper (`shared/web/js/auth.js`)

**Estimated time:** 90–120 minutes (first time)

---

## 🛠️ Step 1 — Install Prerequisites

Before anything else, you need two tools installed on your computer.

### 1a. Check if Node.js is installed

Open **PowerShell** (press `Win + X` → "Windows PowerShell") and run:

```powershell
node --version
```

You should see something like `v20.11.0` or higher. If you get an error, download Node.js from [https://nodejs.org](https://nodejs.org) — choose the **LTS** version.

> ❓ **Why Node.js?** Node.js lets JavaScript run on your computer (outside of the browser). Our backend server and all our build tools are built on Node.js.

### 1b. Check your npm version

```powershell
npm --version
```

You should see `9.x.x` or higher. npm comes bundled with Node.js.

### 1c. Install pnpm

```powershell
npm install -g pnpm
```

Verify it worked:

```powershell
pnpm --version
```

You should see `9.x.x` or higher.

> ❓ **Why pnpm instead of npm?** In a monorepo with multiple apps, pnpm saves disk space by linking shared packages instead of duplicating them. It's also significantly faster on install. See `Concepts.md` for the full explanation.

---

## 📁 Step 2 — Create the Project Root

Navigate to your `Desktop` (or wherever you want the project to live) and create the main folder:

```powershell
cd Desktop
mkdir naija-routes
```

Now open this folder in **VS Code**:

```powershell
code naija-routes
```

> 💡 **From now on, all commands are run inside the `naija-routes` folder.** VS Code has a built-in terminal — open it with `` Ctrl + ` `` (backtick). This is the terminal you'll use for the rest of Phase 0.

---

## ⚙️ Step 3 — Configure the Monorepo

The monorepo needs three configuration files at the root level. Create them exactly as shown.

### 3a. Create `package.json`

This is the heartbeat of the entire project. Create a new file at the root called `package.json`:

```json
{
  "name": "naija-routes",
  "version": "1.0.0",
  "private": true,
  "description": "Nigeria's Road Transport & Logistics Aggregator",
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "format": "prettier --write \"**/*.{html,css,js,json,md}\""
  },
  "devDependencies": {
    "prettier": "^3.2.5",
    "turbo": "latest"
  },
  "packageManager": "pnpm@9.0.0"
}
```

**Breaking this down line by line:**

| Line | Meaning |
|---|---|
| `"private": true` | Prevents accidentally publishing this monorepo to npm |
| `"build": "turbo run build"` | When you run `pnpm build`, Turborepo builds ALL apps |
| `"dev": "turbo run dev"` | When you run `pnpm dev`, Turborepo starts ALL dev servers |
| `"prettier"` | A code formatter — keeps everyone's code style consistent |
| `"turbo": "latest"` | Turborepo itself — the build orchestrator |
| `"packageManager": "pnpm@9.0.0"` | Locks the project to pnpm so no one accidentally uses npm |

### 3b. Create `pnpm-workspace.yaml`

Create a new file called `pnpm-workspace.yaml`:

```yaml
packages:
  - "apps/*"
  - "server"
  - "shared/*"
```

**What this does:** This tells pnpm "go look in the `apps` folder and the `shared` folder — every sub-folder there is a workspace (a separate project I manage)."

> ⚠️ **Important:** YAML files are indentation-sensitive. Use exactly 2 spaces before the dashes, not tabs.

### 3c. Create `turbo.json`

Create a new file called `turbo.json`:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    }
  }
}
```

**Breaking this down:**

| Setting | Meaning |
|---|---|
| `"dependsOn": ["^build"]` | The `^` means "build my dependencies first". If `apps/web` depends on `shared`, build `shared` before `web`. |
| `"outputs": ["dist/**"]` | After a build, cache everything in the `dist` folder. Next time, use the cache instead of rebuilding. |
| `"cache": false` (dev) | Don't cache the dev server — it needs to restart fresh every time |
| `"persistent": true` (dev) | The dev server runs forever (until you stop it with `Ctrl + C`) |

---

## 🏗️ Step 4 — Scaffold the Applications

Now we'll create the actual app folders. We use Vite's project generator to create each one.

### 4a. Create the apps folder and scaffold the web app

```powershell
mkdir apps
npx -y create-vite@latest ./apps/web --template vanilla
```

> ❓ **What does `npx -y create-vite@latest` do?**
> - `npx` — runs a package from npm without permanently installing it
> - `-y` — automatically says "yes" to all prompts (non-interactive mode)
> - `create-vite@latest` — the Vite project generator
> - `./apps/web` — where to create the project
> - `--template vanilla` — use the plain JavaScript template (not React, Vue, etc.)

### 4b. Scaffold the agent app

```powershell
npx -y create-vite@latest ./apps/agent --template vanilla
```

### 4c. Scaffold the operator dashboard

```powershell
npx -y create-vite@latest ./apps/operator --template vanilla
```

### 4d. Set up the backend server folder

```powershell
mkdir server
cd server
npm init -y
cd ..
```

> ❓ **Why `npm init -y` and not `npx create-vite`?**
> The server is a Node.js backend — it doesn't need Vite (Vite is a frontend tool). We just initialize a basic Node.js project with `npm init -y` which creates a simple `package.json` for the server.

### ✅ Check Your Work

After these steps, your folder structure should look like this:

```
naija-routes/
├── apps/
│   ├── web/
│   │   ├── index.html
│   │   ├── package.json
│   │   └── src/
│   ├── agent/
│   │   ├── index.html
│   │   ├── package.json
│   │   └── src/
│   └── operator/
│       ├── index.html
│       ├── package.json
│       └── src/
├── server/
│   └── package.json
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

If yours looks different, **stop and ask your instructor** before continuing.

---

## 🎨 Step 5 — Create the Shared Design System

The design system is the single source of truth for all visual decisions: colours, fonts, spacing. All three apps will import from here.

### 5a. Create the shared CSS folder

```powershell
mkdir shared\web\css
```

> 💡 **On Mac/Linux** use forward slashes: `mkdir -p shared/web/css`

### 5b. Create `shared/web/css/tokens.css`

Create the file and paste in the following content:

```css
:root {
  /* ========================
     BRAND COLORS
     ======================== */
  --color-primary: #1E3A8A;       /* Deep Blue — main brand colour */
  --color-primary-light: #3B82F6; /* Lighter blue — hover states, links */
  --color-secondary: #F59E0B;     /* Amber/Gold — calls-to-action, highlights */
  --color-success: #10B981;       /* Emerald — confirmed bookings, success states */
  --color-danger: #EF4444;        /* Red — errors, cancellations, warnings */

  /* ========================
     NEUTRAL COLORS
     ======================== */
  --color-background: #F8FAFC;    /* Page background — very light grey */
  --color-surface: #FFFFFF;       /* Cards, modals — pure white */
  --color-text-primary: #0F172A;  /* Main body text — near black */
  --color-text-secondary: #64748B;/* Labels, captions — medium grey */
  --color-border: #E2E8F0;        /* Dividers, input borders — light grey */

  /* ========================
     TYPOGRAPHY
     ======================== */
  --font-family-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
                       Roboto, Helvetica, Arial, sans-serif;
  --font-size-xs:   0.75rem;   /* 12px — tiny labels */
  --font-size-sm:   0.875rem;  /* 14px — secondary text */
  --font-size-base: 1rem;      /* 16px — body text (default) */
  --font-size-lg:   1.125rem;  /* 18px — slightly larger body */
  --font-size-xl:   1.25rem;   /* 20px — sub-headings */
  --font-size-2xl:  1.5rem;    /* 24px — section headings */

  /* ========================
     SPACING SCALE
     ======================== */
  --spacing-1: 0.25rem;  /* 4px  */
  --spacing-2: 0.5rem;   /* 8px  */
  --spacing-3: 0.75rem;  /* 12px */
  --spacing-4: 1rem;     /* 16px — default padding/margin */
  --spacing-6: 1.5rem;   /* 24px */
  --spacing-8: 2rem;     /* 32px — large section gaps */

  /* ========================
     BORDERS & SHADOWS
     ======================== */
  --radius-sm:   0.25rem;  /* 4px  — small elements */
  --radius-md:   0.375rem; /* 6px  — buttons, inputs */
  --radius-lg:   0.5rem;   /* 8px  — cards */
  --radius-full: 9999px;   /* pill-shaped elements (badges, chips) */

  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
               0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
               0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
```

> ❓ **What is `:root`?**
> `:root` is a CSS pseudo-class that targets the very top of the HTML document. Variables defined here are available **globally** — in every CSS file, in every app. That's exactly what we want for a shared design system.

> ❓ **What does `var(--color-primary)` mean?**
> When you use a token in your CSS, you reference it with `var()`:
> ```css
> .button { background-color: var(--color-primary); }
> ```
> This tells the browser: "Go look up the variable named `--color-primary` and use its value here."

---

## 📦 Step 6 — Install All Dependencies & Run

### 6a. Install everything

From the root `naija-routes` folder, run:

```powershell
pnpm install
```

Watch the output. pnpm will:
1. Read `pnpm-workspace.yaml` to find all workspaces
2. Install Vite and its dependencies for `apps/web`, `apps/agent`, and `apps/operator`
3. Install `turbo` and `prettier` at the root
4. Link all shared packages

> ⏳ This may take 1–3 minutes on the first run. It will be much faster every run after because pnpm caches packages.

### 6b. Start the development servers

```powershell
pnpm run dev
```

You should see Turborepo fire up all three dev servers simultaneously. Look for output like:

```
web:dev: VITE v5.x.x ready in 312ms
web:dev:   ➜  Local: http://localhost:5173/

agent:dev: VITE v5.x.x ready in 289ms
agent:dev:   ➜  Local: http://localhost:5174/

operator:dev: VITE v5.x.x ready in 301ms
operator:dev:   ➜  Local: http://localhost:5175/
```

Open each URL in your browser:
- **Consumer Web App:** [http://localhost:5173](http://localhost:5173)
- **Agent App:** [http://localhost:5174](http://localhost:5174)
- **Operator Dashboard:** [http://localhost:5175](http://localhost:5175)

### 6c. Stop the servers

When you're done, stop all servers by pressing `Ctrl + C` in the terminal.

---

## 🔒 Step 7 — Protect Your Secrets (.gitignore)

Before you put anything sensitive in the project, you need a `.gitignore` file. This tells Git which files to **never upload to GitHub** — especially `.env` files that contain passwords and API keys.

### 7a. Create the file

In VS Code, right-click the root `naija-routes/` folder → **New File** → type `.gitignore`

Or use the terminal:

```powershell
New-Item -Path ".gitignore" -ItemType File
```

### 7b. Add this content to `.gitignore`

```
# ── Secrets — NEVER commit these ─────────────────
.env
.env.local
.env.*.local
*.pem
*.key

# ── Dependencies ─────────────────────────────────
node_modules/
.pnp
.pnp.js

# ── Build outputs ─────────────────────────────────
dist/
build/
out/

# ── Turborepo cache ───────────────────────────────
.turbo/

# ── Logs ─────────────────────────────────────────
logs/
*.log

# ── OS files ─────────────────────────────────────
.DS_Store
Thumbs.db

# ── VS Code ───────────────────────────────────────
.vscode/*
!.vscode/extensions.json

# ── Test coverage ─────────────────────────────────
coverage/
```

> ❓ **Why `.gitignore`?** Every project will have secrets — Supabase keys, payment API keys, database passwords. If these are committed to GitHub (even a private repo), they can be exposed in a data breach. `.gitignore` is your first line of defence.

> ⚠️ **The golden rule:** If it contains a password or API key, it goes in `.env`. If it's in `.env`, it's in `.gitignore`. No exceptions.

---

## 🗂️ Step 8 — Build the Server Folder Structure

Right now `server/` only has a `package.json`. We need to build the full internal structure that Node.js/Express expects.

### 8a. Create all the server folders at once

```powershell
New-Item -ItemType Directory -Force -Path "server\src\config"
New-Item -ItemType Directory -Force -Path "server\src\middleware"
New-Item -ItemType Directory -Force -Path "server\src\routes"
New-Item -ItemType Directory -Force -Path "server\src\services"
New-Item -ItemType Directory -Force -Path "server\src\utils"
New-Item -ItemType Directory -Force -Path "server\migrations"
New-Item -ItemType Directory -Force -Path "server\seeds"
```

> 💡 `New-Item -ItemType Directory -Force` is the PowerShell equivalent of `mkdir -p` on Mac/Linux. The `-Force` flag means "create parent folders too if they don't exist".

### 8b. What each folder is for

| Folder | Purpose |
|---|---|
| `server/src/config/` | Database, Redis, storage client setup |
| `server/src/middleware/` | Express middleware: auth, rate limiting, validation, CORS |
| `server/src/routes/` | One file per API resource: `auth.routes.js`, `booking.routes.js`, etc. |
| `server/src/services/` | Business logic: `booking.service.js`, `payment.service.js`, etc. |
| `server/src/utils/` | Shared helpers: QR code, currency conversion, waybill numbers |
| `server/migrations/` | SQL files that build the database schema |
| `server/seeds/` | SQL files that populate the database with test data |

### 8c. Also create the shared JS folder

```powershell
New-Item -ItemType Directory -Force -Path "shared\web\js"
```

### 8d. Update `server/package.json`

The `npm init -y` from Step 4 created a basic `package.json`. We need to update it properly. **Replace the entire content** of `server/package.json` with:

```json
{
  "name": "@naija-routes/server",
  "version": "0.1.0",
  "description": "Naija Routes — Node.js + Express.js Backend API",
  "type": "module",
  "main": "src/server.js",
  "scripts": {
    "dev": "node --watch src/server.js",
    "start": "node src/server.js",
    "test": "echo \"Tests not yet configured — add Jest in Phase 1\""
  },
  "dependencies": {
    "dotenv": "^16.4.5",
    "express": "^4.19.2"
  },
  "engines": {
    "node": ">=20.0.0"
  }
}
```

**What changed from the default:**

| Field | Why we changed it |
|---|---|
| `"name": "@naija-routes/server"` | Scoped name — follows monorepo convention |
| `"type": "module"` | Enables ES Modules (`import/export`) instead of CommonJS (`require`) |
| `"main": "src/server.js"` | Points to our actual entry file (not `index.js`) |
| `"dev": "node --watch src/server.js"` | `--watch` auto-restarts server when files change (like nodemon, built into Node 20) |
| `"express"` + `"dotenv"` | Express = web framework; dotenv = loads `.env` file into `process.env` |

---

## 🖥️ Step 9 — Create the Express Entry Files

The server needs two JavaScript files to boot up: `app.js` (configures Express) and `server.js` (starts the HTTP server).

### 9a. Create `server/src/app.js`

In VS Code, right-click `server/src/` → **New File** → type `app.js`

Or in the terminal:
```powershell
New-Item -Path "server\src\app.js" -ItemType File
```

Paste in this content:

```javascript
// =============================================================
// NAIJA ROUTES — Express App Configuration
// File: server/src/app.js
// This file sets up Express middleware and mounts all routes.
// =============================================================

import express from 'express';
import authRouter from './routes/auth.routes.js';

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(express.json());                    // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse form data

// ── Health Check ─────────────────────────────────────────────
// Visit http://localhost:3000/health to confirm server is running
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'naija-routes-api',
    version: '0.1.0',
    phase: 'Phase 0 — Foundation',
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ────────────────────────────────────────────────
// Auth (scaffolded — endpoints activated in Phase 1)
app.use('/api/v1/auth', authRouter);

// Phase 1+ routes (add as you build them):
// import searchRouter from './routes/search.routes.js';
// app.use('/api/v1/routes', searchRouter);

// ── 404 Handler ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} does not exist`,
  });
});

// ── Global Error Handler ──────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

export default app;
```

**Breaking this down:**

| Section | Purpose |
|---|---|
| `express.json()` | Allows the server to read JSON data sent in POST/PUT request bodies |
| `/health` endpoint | A quick way to confirm the server is running — hit this URL to check |
| `app.use('/api/v1/auth', authRouter)` | Mounts auth routes — all auth URLs start with `/api/v1/auth/` |
| 404 handler | Returns a proper JSON error when a URL doesn't exist (not an HTML page) |
| Error handler | Catches unexpected errors so the server doesn't crash silently |

### 9b. Create `server/src/server.js`

```powershell
New-Item -Path "server\src\server.js" -ItemType File
```

Paste in this content:

```javascript
// =============================================================
// NAIJA ROUTES — HTTP Server Bootstrap
// File: server/src/server.js
// This file starts the HTTP server on the configured port.
// =============================================================

import 'dotenv/config';   // Load .env file FIRST, before anything else
import app from './app.js';

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`
  ┌─────────────────────────────────────────┐
  │         NAIJA ROUTES API SERVER         │
  │─────────────────────────────────────────│
  │  Status  : Running ✓                    │
  │  Port    : ${PORT}                          │
  │  Env     : ${process.env.NODE_ENV || 'development'}              │
  │  Health  : http://localhost:${PORT}/health  │
  └─────────────────────────────────────────┘
  `);
});

// Graceful shutdown — clean up when Ctrl+C or process kill is received
process.on('SIGTERM', () => {
  console.log('Shutting down gracefully...');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  server.close(() => process.exit(0));
});
```

> ❓ **Why two files (`app.js` and `server.js`) instead of one?**
> Keeping them separate is a best practice. `app.js` only configures Express — it has no idea what port it runs on. This means in Phase 1 when we write automated tests, we can import `app.js` directly without actually starting an HTTP server. Tests run faster and don't clash on ports.

> ❓ **What is `import 'dotenv/config'`?**
> This loads all the variables from your `.env` file into `process.env` so that `process.env.SUPABASE_URL` etc. work throughout the app. It must be the FIRST import in `server.js`.

---

## 🔑 Step 10 — Set Up Environment Variables

Your app needs secret API keys (Supabase, later Paystack, Termii etc.) to work. These are stored in a `.env` file that is **never committed to Git**.

### 10a. Create `server/.env.example`

The `.env.example` file is a **template** that IS committed to Git. It shows the team what variables are needed, without the real values.

```powershell
New-Item -Path "server\.env.example" -ItemType File
```

Paste in this content:

```env
# ────────────────────────────────────────────────
# NAIJA ROUTES — Environment Variables Template
# Copy this file to .env and fill in your values.
# NEVER commit .env to Git.
# ────────────────────────────────────────────────

# App
NODE_ENV=development
PORT=3000

# ── Supabase ─────────────────────────────────────
# Get from: Supabase Dashboard → Settings → API
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-public-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key-here

# Direct database connection (for SQL migrations)
DATABASE_URL=postgresql://postgres:your-db-password@db.your-project-id.supabase.co:5432/postgres

# ── CORS ─────────────────────────────────────────
CORS_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:5175

# ── SMS — Activate in Phase 1 ────────────────────
# TERMII_API_KEY=your-termii-api-key
# TERMII_SENDER_ID=N-Routes

# ── Email — Activate in Phase 1 ──────────────────
# RESEND_API_KEY=re_your-resend-api-key

# ── Payment — Activate in Phase 2 ────────────────
# PAYSTACK_SECRET_KEY=sk_test_your-paystack-secret-key
# PAYSTACK_PUBLIC_KEY=pk_test_your-paystack-public-key
```

### 10b. Create your actual `.env` file

The real `.env` file with your actual keys:

```powershell
Copy-Item -Path "server\.env.example" -Destination "server\.env"
```

> 💡 `Copy-Item` is the PowerShell equivalent of `cp`. This copies the template to `.env` so you can fill in your real values.

Now open `server/.env` in VS Code and fill in your actual Supabase values from the Supabase dashboard (Settings → API).

### 10c. Verify `.env` is protected

Check that your `.gitignore` is working:

```powershell
git status
```

`.env` should **not** appear in the untracked files list. If it does, check your `.gitignore` is in the root folder and contains `.env`.

> ⚠️ **This is critically important.** One accidental commit of a real API key can result in fraudulent charges to your payment account or a data breach. Always double-check before your first `git commit`.

---

## ✅ Phase 0 Complete! — Final Checklist

Run through every item before moving to Step 3 (Database Schema):

**Tools & Setup**
- [ ] `node --version` returns v20 or higher
- [ ] `pnpm --version` returns v9 or higher

**Monorepo Config Files**
- [ ] `naija-routes/package.json` — has `"turbo"` and `"prettier"` in devDependencies
- [ ] `naija-routes/pnpm-workspace.yaml` — has 3 package paths (apps/*, server, shared/*)
- [ ] `naija-routes/turbo.json` — has build, dev, and lint pipelines
- [ ] `naija-routes/.gitignore` — contains `.env` entry

**Frontend Apps**
- [ ] `apps/web/index.html` exists
- [ ] `apps/agent/index.html` exists
- [ ] `apps/operator/index.html` exists

**Shared Design System**
- [ ] `shared/web/css/tokens.css` — all CSS custom properties defined
- [ ] `shared/web/js/` folder exists (for auth.js, added in Step 4)

**Server Structure**
- [ ] `server/package.json` — has `"type": "module"` and `"dev": "node --watch src/server.js"`
- [ ] `server/src/app.js` — Express app with health check
- [ ] `server/src/server.js` — HTTP bootstrap with graceful shutdown
- [ ] `server/src/config/` folder exists
- [ ] `server/src/middleware/` folder exists
- [ ] `server/src/routes/` folder exists
- [ ] `server/migrations/` folder exists
- [ ] `server/.env.example` — template with all variable names
- [ ] `server/.env` — your real keys filled in (never commit!)

**Running**
- [ ] `pnpm install` completes without errors from root
- [ ] `pnpm run dev` starts all three frontend apps
- [ ] `http://localhost:5173` opens in browser

🎉 **All boxes checked? You've built the full Naija Routes foundation. Move to `03_Database_Schema.md` next.**

---

## 🗺️ What's Coming Next?

**Next file:** `03_Database_Schema.md` — you'll create the Supabase project and run the SQL that creates all 12 database tables.

After that:
- `04_Auth_Service.md` — create all auth service files with code ready for Phase 1
- `05_CICD_Overview.md` — understand CI/CD (no implementation yet)
- `07_Exercises.md` — hands-on practice to cement everything you've built
