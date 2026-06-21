# 🔧 Phase 0 — Troubleshooting Guide

Stuck? Don't panic. Every error here has a solution. Find your error message below and follow the fix.

---

## ❌ Error: `'pnpm' is not recognized as an internal or external command`

**What it means:** pnpm is not installed or not on your system PATH.

**Fix:**
```powershell
npm install -g pnpm
```

If that still doesn't work, close PowerShell and **open a fresh terminal** — the PATH doesn't update in windows until you restart the terminal.

If still failing:
```powershell
# Try with the full path:
C:\Users\YourName\AppData\Roaming\npm\pnpm --version
```

---

## ❌ Error: `'node' is not recognized as an internal or external command`

**What it means:** Node.js is not installed.

**Fix:** Download and install Node.js from [https://nodejs.org](https://nodejs.org).
- Choose the **LTS** (Long-Term Support) version
- During installation, check "Add to PATH" when prompted
- **Restart PowerShell** after installation

---

## ❌ Error: `ERR_PNPM_WORKSPACE_PKG_NOT_FOUND` or workspace not found

**What it means:** pnpm can't find a workspace. Usually because `pnpm-workspace.yaml` has a typo or wrong indentation.

**Fix:** Check your `pnpm-workspace.yaml`:
```yaml
# ✅ Correct — exactly 2 spaces before the dash
packages:
  - "apps/*"
  - "server"
  - "shared/*"
```

```yaml
# ❌ Wrong — using tabs instead of spaces (YAML doesn't allow tabs)
packages:
	- "apps/*"
```

Use VS Code's "Show Whitespace" (`Ctrl + Shift + P` → "Toggle Render Whitespace") to see if you accidentally used tabs.

---

## ❌ Error: `ENOENT: no such file or directory, open '...\package.json'`

**What it means:** You're running `pnpm install` from the wrong folder.

**Fix:** Make sure you are inside the `naija-routes` root folder (not inside `apps/web` or anywhere else):
```powershell
# Check where you are:
pwd

# You should see something like:
# C:\Users\YourName\Desktop\naija-routes

# If you're in a sub-folder, navigate up:
cd ..
```

---

## ❌ Error: `command not found: vite` (when running `pnpm run dev`)

**What it means:** Vite wasn't installed. Usually because `pnpm install` wasn't run.

**Fix:**
```powershell
pnpm install
pnpm run dev
```

---

## ❌ Error: `Port 5173 is already in use`

**What it means:** Another process (maybe a previous dev server you forgot to stop) is already using that port.

**Fix — Option 1:** Stop the old server
```powershell
# Find what's using port 5173:
netstat -ano | findstr :5173

# The last column is the Process ID (PID). Kill it:
taskkill /PID <the-pid-number> /F
```

**Fix — Option 2:** Let Vite pick the next available port
Vite will automatically try `5174`, `5175`, etc. if `5173` is taken. Just run `pnpm run dev` and check which port it prints.

---

## ❌ Error: `Cannot read properties of undefined` in `turbo.json`

**What it means:** Your `turbo.json` has a JSON syntax error.

**Fix:** Validate your JSON at [https://jsonlint.com](https://jsonlint.com) by pasting the contents. Common mistakes:
- Trailing comma after the last item in an object: `"lint": {} ,` ← ❌
- Missing closing brace `}`
- Using single quotes `'` instead of double quotes `"`

---

## ❌ `create-vite` created the app but it's inside a nested folder

For example, you ran:
```powershell
npx create-vite apps/web
```
And now you have `apps/web/web/` with the actual files inside.

**Why it happened:** Some versions of create-vite append the project name as a folder.

**Fix:** Use the explicit `./` path and always check first:
```powershell
npx -y create-vite@latest ./apps/web --template vanilla
```

The `./` is important — it tells create-vite to put files directly in the `apps/web` folder you specify, not create a subfolder.

---

## ❌ CSS tokens aren't applying to my app

**Symptom:** You added `var(--color-primary)` in your app's CSS but the colour isn't changing.

**Why it happens:** The `tokens.css` file is in `shared/` — your app doesn't automatically know about it. You need to import it.

**Fix:** At the very top of `apps/web/src/style.css`, add:
```css
@import '../../../shared/web/css/tokens.css';
```

Or in your app's `index.html`, add a `<link>` tag:
```html
<link rel="stylesheet" href="/shared/web/css/tokens.css">
```

> Note: The `@import` approach is safer because Vite can resolve it at build time.

---

## ❌ `pnpm run dev` starts but immediately exits

**Why it happens:** One of the workspace `package.json` files doesn't have a `"dev"` script.

**Fix:** Check each app's `package.json` for the `"dev"` script. They should look like:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

If `"dev"` is missing, add it.

---

## ❌ Changes in `tokens.css` aren't hot-reloading in the browser

**Why it happens:** Vite's Hot Module Replacement (HMR) may not be watching files outside the app's own folder.

**Fix:** Simply refresh the browser manually (`Ctrl + R` or `F5`). During Phase 0, this is acceptable — HMR for cross-workspace files requires additional Vite configuration covered in a later phase.

---

## 🆘 Still Stuck?

If your error isn't listed here:

1. **Read the error message carefully** — usually the last 3 lines of the error tell you exactly what went wrong
2. **Google the exact error message** — add "pnpm monorepo" or "vite" to your search
3. **Check the Naija Routes PRD** (`prd_text.txt`) for context on the project structure
4. **Ask your instructor** — show them the full error output, not just the last line
