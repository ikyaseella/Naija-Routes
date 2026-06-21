# ⚡ Phase 0 — Command Cheatsheet

Quick reference for all terminal commands used in Phase 0. Keep this open in a second tab.

> All commands are run in **PowerShell** from inside the `naija-routes/` folder unless stated otherwise.

---

## 🔍 Verification Commands

| Command | What it checks |
|---|---|
| `node --version` | Confirm Node.js is installed (need v20+) |
| `npm --version` | Confirm npm is installed (need v9+) |
| `pnpm --version` | Confirm pnpm is installed (need v9+) |

---

## 📦 Installation

| Command | What it does |
|---|---|
| `npm install -g pnpm` | Install pnpm globally on your system |
| `pnpm install` | Install ALL workspace dependencies from root |
| `pnpm install --filter web` | Install only the `web` app's dependencies |

---

## 🏗️ Scaffolding

| Command | What it does |
|---|---|
| `mkdir apps` | Create the `apps/` folder |
| `mkdir server` | Create the `server/` folder |
| `mkdir shared\web\css` | Create nested shared CSS folder (Windows) |
| `mkdir -p shared/web/css` | Create nested shared CSS folder (Mac/Linux) |
| `npx -y create-vite@latest ./apps/web --template vanilla` | Scaffold consumer web app |
| `npx -y create-vite@latest ./apps/agent --template vanilla` | Scaffold agent PWA |
| `npx -y create-vite@latest ./apps/operator --template vanilla` | Scaffold operator dashboard |
| `npm init -y` | Initialize a basic Node.js project (run inside `server/`) |

---

## 🚀 Running the Project

| Command | What it does |
|---|---|
| `pnpm run dev` | Start ALL dev servers simultaneously via Turborepo |
| `pnpm run build` | Build ALL apps for production via Turborepo |
| `pnpm run lint` | Lint ALL apps simultaneously via Turborepo |
| `pnpm run format` | Auto-format all `.js`, `.css`, `.html`, `.json`, `.md` files |
| `Ctrl + C` | Stop all running servers |

---

## 🎯 Targeted Commands (Run a task in ONE specific app)

| Command | What it does |
|---|---|
| `pnpm run dev --filter web` | Start ONLY the web app |
| `pnpm run dev --filter agent` | Start ONLY the agent app |
| `pnpm run dev --filter operator` | Start ONLY the operator app |
| `pnpm run build --filter web` | Build ONLY the web app |

---

## 🌐 Dev Server URLs

| App | URL |
|---|---|
| Consumer Web App | http://localhost:5173 |
| Park Agent App | http://localhost:5174 |
| Operator Dashboard | http://localhost:5175 |

> ⚠️ Ports may differ if something else is already using them. Check your terminal output for the actual URLs.

---

## 📁 Key File Locations

| File | Path |
|---|---|
| Root config | `naija-routes/package.json` |
| Workspace config | `naija-routes/pnpm-workspace.yaml` |
| Turbo pipeline | `naija-routes/turbo.json` |
| Design tokens | `naija-routes/shared/web/css/tokens.css` |
| Web app entry | `naija-routes/apps/web/index.html` |
| Agent app entry | `naija-routes/apps/agent/index.html` |
| Operator entry | `naija-routes/apps/operator/index.html` |
| Backend entry | `naija-routes/server/package.json` |

---

## 🎨 CSS Token Usage Quick Reference

```css
/* Colors */
var(--color-primary)          /* Deep blue #1E3A8A */
var(--color-primary-light)    /* Light blue #3B82F6 */
var(--color-secondary)        /* Amber/Gold #F59E0B */
var(--color-success)          /* Emerald #10B981 */
var(--color-danger)           /* Red #EF4444 */
var(--color-background)       /* Page bg #F8FAFC */
var(--color-surface)          /* Card bg #FFFFFF */
var(--color-text-primary)     /* Main text #0F172A */
var(--color-text-secondary)   /* Muted text #64748B */
var(--color-border)           /* Borders #E2E8F0 */

/* Spacing */
var(--spacing-1)  /* 4px  */
var(--spacing-2)  /* 8px  */
var(--spacing-3)  /* 12px */
var(--spacing-4)  /* 16px */
var(--spacing-6)  /* 24px */
var(--spacing-8)  /* 32px */

/* Font Sizes */
var(--font-size-xs)    /* 12px */
var(--font-size-sm)    /* 14px */
var(--font-size-base)  /* 16px */
var(--font-size-lg)    /* 18px */
var(--font-size-xl)    /* 20px */
var(--font-size-2xl)   /* 24px */

/* Border Radius */
var(--radius-sm)    /* 4px — small */
var(--radius-md)    /* 6px — buttons/inputs */
var(--radius-lg)    /* 8px — cards */
var(--radius-full)  /* pill shape */

/* Shadows */
var(--shadow-sm)  /* subtle */
var(--shadow-md)  /* medium */
var(--shadow-lg)  /* elevated */

/* Font Family */
var(--font-family-sans)  /* Inter + system fallbacks */
```

---

## 🔧 VS Code Shortcuts You'll Use Constantly

| Shortcut | Action |
|---|---|
| `` Ctrl + ` `` | Open/close integrated terminal |
| `Ctrl + Shift + P` | Open Command Palette |
| `Ctrl + P` | Quick file open |
| `Ctrl + B` | Toggle sidebar |
| `Alt + Click` | Multiple cursors |
| `Shift + Alt + F` | Format current file |
| `Ctrl + /` | Comment/uncomment line |
