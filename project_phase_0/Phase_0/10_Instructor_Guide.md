# 🎓 Naija Routes — Phase 0 Instructor Guide

**Who this is for:** The instructor/facilitator leading students through Phase 0.
**Student-facing file:** See `Student_Guide.md` — students follow that, not this.

This guide gives you the **complete picture**: every command, the teaching rationale behind each step, common classroom blockers, and how to pace the session.

---

## 📋 Session Overview

| Item | Detail |
|---|---|
| **Phase goal** | Set up the full monorepo foundation |
| **Recommended session length** | 3 hours (with breaks) |
| **Max class size** | 12–15 students |
| **Prerequisites** | Students must have Node.js installed before class |
| **Deliverable** | All students run `pnpm run dev` and see three localhost URLs |

---

## 🗓️ Suggested Session Flow

| Time | Activity |
|---|---|
| 0:00 – 0:30 | Concepts lecture (use `Concepts.md` as your script) |
| 0:30 – 0:45 | Q&A on concepts, verify all students have Node.js |
| 0:45 – 1:30 | Live coding: Steps 1–4 (follow along together) |
| 1:30 – 1:45 | ☕ Break |
| 1:45 – 2:15 | Live coding: Steps 5–6, first `pnpm run dev` together |
| 2:15 – 2:45 | Students independently do Exercise 1 (rebuild from scratch) |
| 2:45 – 3:00 | Debrief, introduce Exercise 2, assign remaining exercises as homework |

---

## 📚 Step 1: Install Prerequisites

### Teaching objective
Students understand what Node.js and pnpm are and why both are needed.

### Before class
Email students to install Node.js LTS from [https://nodejs.org](https://nodejs.org) before they arrive. This saves 15 minutes of session time.

**Commands to demonstrate:**
```powershell
node --version    # Should show v20.x.x or higher
npm --version     # Should show 9.x.x or higher
npm install -g pnpm
pnpm --version    # Should show 9.x.x or higher
```

### 🧑‍🏫 Teaching Note
Explain the difference between npm and pnpm using the analogy in `Concepts.md` (shared library vs. photocopying books). Spend 3–4 minutes on this — students often install both and get confused about which to use.

### ⚠️ Common Blocker
**Windows Execution Policy error:**
```
pnpm : File C:\...\pnpm.ps1 cannot be loaded because running scripts is disabled on this system.
```
**Fix:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Run this once and then re-run `npm install -g pnpm`.

---

## 📁 Step 2: Create the Project Root

```powershell
mkdir naija-routes
code naija-routes
```

### 🧑‍🏫 Teaching Note
Show students how to open VS Code's integrated terminal (`` Ctrl + ` ``). Emphasise that **all future commands must be run from inside this folder**. This is the #1 cause of errors in the session.

---

## ⚙️ Step 3: Configure Turborepo and pnpm Workspaces

**Create these three files at the project root.**

### `package.json`
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

### `pnpm-workspace.yaml`
```yaml
packages:
  - "apps/*"
  - "server"
  - "shared/*"
```

### `turbo.json`
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

### 🧑‍🏫 Teaching Note
**On `package.json`:** Walk through each field. Ask students "What happens if we remove `"private": true`?" — they should think about it for 30 seconds before you explain.

**On `pnpm-workspace.yaml`:** Demonstrate the YAML indentation rule. Show them VS Code's "Toggle Render Whitespace" feature. YAML indentation errors will be a common problem.

**On `turbo.json`:** The `"dependsOn": ["^build"]` concept is subtle. Use the analogy: "If you're making tea, you need to boil water first. Turborepo makes sure dependencies run in the right order."

### ⚠️ Common Blocker
Students copy-paste JSON with smart quotes (`"` and `"`) from word processors. JSON only accepts straight quotes (`"`). Warn them explicitly.

---

## 🏗️ Step 4: Scaffold the Applications

```powershell
mkdir apps
npx -y create-vite@latest ./apps/web --template vanilla
npx -y create-vite@latest ./apps/agent --template vanilla
npx -y create-vite@latest ./apps/operator --template vanilla
mkdir server
cd server
npm init -y
cd ..
```

### 🧑‍🏫 Teaching Note
**Why Vanilla JS and not React?** The PRD explicitly states this: lower-end Android devices are common in Nigeria, and React adds framework overhead (bundle size, runtime). A vanilla JS app loads faster on 3G. The architecture is API-first, so adding React Native in Phase 3 doesn't require any backend changes.

**After scaffolding:** Walk students through the generated file structure. Ask: "Why does each app have its own `package.json`?" Answer: Each app is an independent project with its own dependencies. Turborepo just orchestrates them.

### ⚠️ Common Blocker
Students run `npx create-vite apps/web` (without `./`) and get a nested `apps/web/web` folder. The `./` before the path is critical — enforce it.

---

## 🎨 Step 5: Shared Design System (CSS Tokens)

```powershell
mkdir shared\web\css
```

**Create `shared/web/css/tokens.css`:**

```css
:root {
  /* Brand Colors */
  --color-primary: #1E3A8A;
  --color-primary-light: #3B82F6;
  --color-secondary: #F59E0B;
  --color-success: #10B981;
  --color-danger: #EF4444;

  /* Neutral Colors */
  --color-background: #F8FAFC;
  --color-surface: #FFFFFF;
  --color-text-primary: #0F172A;
  --color-text-secondary: #64748B;
  --color-border: #E2E8F0;

  /* Typography */
  --font-family-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
                       Roboto, Helvetica, Arial, sans-serif;
  --font-size-xs:   0.75rem;
  --font-size-sm:   0.875rem;
  --font-size-base: 1rem;
  --font-size-lg:   1.125rem;
  --font-size-xl:   1.25rem;
  --font-size-2xl:  1.5rem;

  /* Spacing */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;

  /* Borders and Shadows */
  --radius-sm:   0.25rem;
  --radius-md:   0.375rem;
  --radius-lg:   0.5rem;
  --radius-full: 9999px;

  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
               0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
               0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
```

### 🧑‍🏫 Teaching Note
**Live demonstration:** After creating the file, open an app's CSS, use `var(--color-primary)` on the body, and show it working in the browser. Students connect faster when they see the token system in action immediately.

**The key question to ask class:** "If I want to change the brand colour from blue to red, how many files do I need to edit?" Answer: ONE. That's the entire point of design tokens.

---

## 📦 Step 6: Install and Run

```powershell
pnpm install
pnpm run dev
```

### Expected output:
```
web:dev:       ➜  Local: http://localhost:5173/
agent:dev:     ➜  Local: http://localhost:5174/
operator:dev:  ➜  Local: http://localhost:5175/
```

### 🧑‍🏫 Teaching Note
**The wow moment:** When all three servers start in one command, pause and let it sink in. Say: "We started three separate frontend applications with ONE command. That's the power of Turborepo." Students should feel the payoff of all the setup work.

**Show the browser:** Open all three localhost URLs side by side. They look identical for now — that's fine. The structure is what matters in Phase 0.

**Stop the servers:** Teach `Ctrl + C`. Ask: "What happens if we only change code in `apps/web` — will Turborepo rebuild `apps/agent`?" (No — only changed workspaces are rebuilt.)

### ⚠️ Common Blocker
**Port conflict:** If a student already has another Vite app running from a previous experiment, port 5173 is taken. Teach them to always `Ctrl + C` to stop servers before starting new ones.

---

## 📊 Class Assessment

After the session, have students complete in this order:
1. **`Quiz.md`** — Knowledge check (15 mins, done independently in class or as homework)
2. **Exercise 1** from `Exercises.md` — Rebuild from scratch (30 mins, done in class if time allows)
3. **Exercises 2–6** — Assigned as homework before the next session

---

## 🗂️ Phase 0 Folder Contents Reference

| File | Who reads it | When |
|---|---|---|
| `Concepts.md` | Students | BEFORE starting any code |
| `Student_Guide.md` | Students | During the coding session |
| `Cheatsheet.md` | Students | Throughout the session and as homework reference |
| `Exercises.md` | Students | After completing the guide |
| `Quiz.md` | Students | After exercises, for self-assessment |
| `Troubleshooting.md` | Students | When stuck on errors |
| `Instructor_Guide.md` | Instructor only | Session preparation and delivery |

---

## ✅ Phase 0 Completion Criteria

A student has completed Phase 0 when they can:
- [ ] Explain in their own words what a monorepo is and why we use it
- [ ] Explain what Turborepo and pnpm do without looking at notes
- [ ] Rebuild the entire structure from scratch in under 20 minutes (Exercise 1)
- [ ] Run `pnpm run dev` and successfully access all three localhost URLs
- [ ] Score at least 14/20 on the Quiz
- [ ] Use a CSS token in an app's stylesheet correctly

---

## 🚀 Transitioning to Phase 1

Before ending the session, give students a preview of Phase 1:
- They will build the **Route Search page** in `apps/web`
- They will create the first **API endpoint** in `server/`
- They will connect the frontend to the backend for the first time

Emphasise: everything they set up in Phase 0 is the platform that makes Phase 1 possible.
