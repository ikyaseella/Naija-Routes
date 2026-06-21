# 📚 Phase 0 — Core Concepts You Need to Know

Before you touch a single line of code, read this. Understanding **why** we use each tool will make every step feel logical instead of magical.

---

## 1. What is a Monorepo?

A **monorepo** (short for *mono-repository*) is a single Git repository that holds **multiple related projects** together.

### The Old Way (Polyrepo)
```
github.com/naija-routes/web-app       ← separate repo
github.com/naija-routes/agent-app     ← separate repo
github.com/naija-routes/operator-app  ← separate repo
github.com/naija-routes/backend-api   ← separate repo
```
**Problem:** If you update a shared button style, you have to update 3 repos, open 3 pull requests, and coordinate 3 deployments. Nightmare! 😩

### The Naija Routes Way (Monorepo)
```
github.com/naija-routes/naija-routes  ← ONE repo contains everything
  ├── apps/web/
  ├── apps/agent/
  ├── apps/operator/
  ├── server/
  └── shared/   ← shared code lives here, used by ALL apps
```
**Benefit:** One change to shared CSS tokens instantly applies to all three apps. One repo, one pull request, done. ✅

---

## 2. What is pnpm?

**pnpm** is a package manager — like `npm` or `yarn` — but smarter and faster.

### Why not just use npm?
| Feature | npm | pnpm |
|---|---|---|
| Disk space | Copies `node_modules` into EVERY project | Links packages, saving gigabytes |
| Speed | Slow on large installs | 2–3× faster |
| Monorepo support | Limited | Built-in workspace support |
| Security | Allows phantom dependencies | Strict — you only use what you declare |

> 💡 **Key Insight:** In a monorepo with 3 apps, `npm` would install React (for example) 3 times on your disk. `pnpm` installs it **once** and links it to all 3. This matters a lot when you're on a slow connection in Nigeria.

---

## 3. What is Turborepo?

**Turborepo** is a build system that understands how your apps relate to each other inside a monorepo.

Think of it as the **traffic controller** for your project.

### Without Turborepo:
To run all 3 apps, you'd open 3 different terminals and run `npm run dev` in each. Messy.

### With Turborepo:
```powershell
pnpm run dev   # This ONE command boots ALL three apps at once!
```

It also **caches** build results. If nothing changed in `apps/web`, it won't rebuild it — it uses the cached result. This makes builds **10–100× faster** on large projects.

---

## 4. What is Vite?

**Vite** (French for "fast") is a build tool and development server for frontend JavaScript projects.

### What it replaces:
The old way used **Webpack**, which was slow and complicated to configure. Vite is:
- ⚡ **Instant server start** — starts in milliseconds, not seconds
- 🔥 **Hot Module Replacement (HMR)** — when you edit a CSS file, the browser updates instantly without a full page reload
- 📦 **Optimised production builds** — produces small, fast bundles for deployment

### Why Vanilla JS (not React)?
The PRD specifies Vanilla JS for the web, agent, and operator apps because:
- Runs well on **low-end Android phones** common in Nigeria
- No framework = smaller bundle = faster load on 3G
- Easier for new developers to understand
- The backend API remains unchanged when React Native is added in Phase 3

---

## 5. What is a Design Token?

A **design token** is a named variable that stores a design decision — a colour, a font size, a spacing value.

Instead of writing:
```css
/* ❌ Bad — hardcoded everywhere, impossible to update */
button { background-color: #1E3A8A; }
header  { background-color: #1E3A8A; }
nav     { border-color: #1E3A8A; }
```

We write:
```css
/* ✅ Good — defined once as a token, used everywhere */
:root {
  --color-primary: #1E3A8A;
}

button { background-color: var(--color-primary); }
header  { background-color: var(--color-primary); }
nav     { border-color: var(--color-primary); }
```

Now if the brand colour changes, we update **one line** in `tokens.css` and every app updates automatically.

---

## 6. What is a Workspace?

A **workspace** is pnpm's name for an individual project inside the monorepo. Each app (`web`, `agent`, `operator`, `server`) is a workspace. The `pnpm-workspace.yaml` file tells pnpm where to find them.

---

## 7. Key File Roles — At a Glance

| File | What it does |
|---|---|
| `package.json` (root) | Defines the monorepo name, scripts, and shared dev tools |
| `pnpm-workspace.yaml` | Tells pnpm "these folders contain my workspaces" |
| `turbo.json` | Tells Turborepo how to run build, dev, and lint tasks |
| `apps/web/package.json` | The consumer website's own dependencies |
| `apps/agent/package.json` | The agent PWA's own dependencies |
| `apps/operator/package.json` | The operator dashboard's own dependencies |
| `shared/web/css/tokens.css` | The single source of truth for brand colours, spacing, fonts |

---

## ✅ Concept Check — Before Moving On

Answer these in your head (or on paper):

1. Why do we use a monorepo instead of separate repos?
2. What problem does pnpm solve that npm doesn't?
3. What is Turborepo's job in our project?
4. Why did we choose Vanilla JS over React for Phase 0?
5. If the Naija Routes brand colour changes from blue to purple, how many files do you need to edit?

If you can answer all five, you're ready to start building. 🚀
