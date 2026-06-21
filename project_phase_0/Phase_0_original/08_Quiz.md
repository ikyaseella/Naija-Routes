# 🧠 Phase 0 — Knowledge Quiz

Test your understanding. Answer without looking at any notes first. Then check your answers at the bottom.

> **How to use this quiz:**
> 1. Write your answers on paper or in a separate notes file
> 2. Only scroll to the Answer Key after attempting ALL questions
> 3. Score yourself honestly — this is for your own benefit

---

## Section A — Multiple Choice

**Q1.** What is the primary reason Naija Routes uses a monorepo instead of separate repos?

- a) It's easier to set up
- b) Shared code (like design tokens) can be used by all apps without duplication
- c) GitHub only allows one repo per account
- d) pnpm requires a monorepo to work

---

**Q2.** What does `"private": true` in the root `package.json` do?

- a) Prevents other developers from reading your code
- b) Hides the project from GitHub
- c) Prevents the package from being published to the npm registry
- d) Enables private workspace features in Turborepo

---

**Q3.** When you run `pnpm run dev`, what actually happens first?

- a) pnpm starts the Node.js backend server
- b) Turborepo reads `turbo.json` and orchestrates running all `dev` scripts in parallel
- c) Vite builds a production bundle
- d) pnpm checks for package updates

---

**Q4.** In `turbo.json`, what does `"dependsOn": ["^build"]` mean?

- a) This task depends on the "^" character being present in the build
- b) Build this package first, before anything else
- c) Build my dependencies (other workspaces I depend on) before building me
- d) This task requires Turborepo version ^1.0

---

**Q5.** What is the purpose of `shared/web/css/tokens.css`?

- a) To store JavaScript utility functions shared across apps
- b) To define CSS variables that all apps use for consistent brand colours and spacing
- c) To configure Vite's CSS processing options
- d) To store the Naija Routes API authentication tokens

---

**Q6.** If you add a new app at `apps/dashboard`, do you need to update `pnpm-workspace.yaml`?

- a) Yes — add `"apps/dashboard"` to the packages list
- b) No — `"apps/*"` already matches any folder inside `apps/`
- c) Yes — update both `pnpm-workspace.yaml` and `turbo.json`
- d) No — pnpm automatically detects new folders

---

**Q7.** Why does `turbo.json` set `"cache": false` for the `dev` task?

- a) Caching is a paid Turborepo feature
- b) The dev server output changes constantly and should never be cached
- c) Caching is only available for `build` tasks
- d) `false` means use maximum cache

---

**Q8.** In a CSS file, how do you use the `--color-primary` token?

- a) `color: --color-primary;`
- b) `color: token(--color-primary);`
- c) `color: var(--color-primary);`
- d) `color: css-var(--color-primary);`

---

## Section B — Short Answer

**Q9.** Explain in one sentence what `pnpm install` does when run from the monorepo root.

---

**Q10.** What is the difference between `npx create-vite` and `npm install vite`?

---

**Q11.** What does the `--template vanilla` flag do when running `create-vite`?

---

**Q12.** After Phase 0 is complete, which three localhost ports are the apps running on?

---

**Q13.** What is the role of `pnpm-workspace.yaml` in the project?

---

## Section C — Practical

**Q14.** A student on your team adds hardcoded colours everywhere in their CSS:
```css
.navbar { background-color: #1E3A8A; }
.button { background-color: #1E3A8A; }
.badge  { border-color: #1E3A8A; }
```

Write a one-paragraph explanation of why this is wrong and what they should do instead.

---

**Q15.** Your `pnpm run dev` command is only starting TWO apps instead of three. List three possible reasons this could happen and how you'd diagnose each one.

---

## Section D — True or False

| # | Statement | Your Answer |
|---|---|---|
| 16 | `turbo.json` must be updated every time you add a new app | T / F |
| 17 | All three Vite apps in Phase 0 use the same template: `vanilla` | T / F |
| 18 | The `server/` folder was scaffolded with `create-vite` | T / F |
| 19 | CSS Custom Properties defined in `:root` are globally available | T / F |
| 20 | pnpm can only manage one project at a time (no workspaces) | T / F |

---

---

# ✅ Answer Key

*(Scroll down only after you've answered all questions!)*

<br><br><br><br><br>

---

## Section A Answers

| Q | Answer | Explanation |
|---|---|---|
| 1 | **b** | Shared code like tokens.css lives once in `shared/` and all apps can use it |
| 2 | **c** | Prevents accidental `npm publish` — the whole monorepo is not meant to be a public package |
| 3 | **b** | Turborepo reads its pipeline config and runs each workspace's `dev` script in parallel |
| 4 | **c** | The `^` prefix means "workspace dependencies" — build them first |
| 5 | **b** | CSS design tokens provide a single source of truth for all visual values |
| 6 | **b** | The wildcard `apps/*` matches ALL sub-folders in `apps/` automatically |
| 7 | **b** | Dev servers have live, changing output — caching it would be wrong |
| 8 | **c** | `var()` is the correct CSS syntax for reading a custom property |

## Section B Answers

**Q9.** `pnpm install` reads `pnpm-workspace.yaml` to find all workspaces, then installs all their declared dependencies into a single shared store while creating symlinks in each workspace's `node_modules`.

**Q10.** `npx create-vite` runs a **project generator** (one-time scaffolding tool) to create a new app with files and config. `npm install vite` installs the Vite library as a dependency into an **existing** project.

**Q11.** `--template vanilla` tells create-vite to generate a plain HTML/CSS/JavaScript project without any framework (no React, Vue, Svelte, etc.).

**Q12.** Web: `5173`, Agent: `5174`, Operator: `5175`

**Q13.** It tells pnpm which folders are workspaces — independent projects within the monorepo — so pnpm can manage their dependencies and link them to each other.

## Section C Answers

**Q14.** Hardcoding `#1E3A8A` in three places means if the brand colour ever changes, you must find and update every single instance across every file in every app — a process that's error-prone and time-consuming. Instead, they should define the colour once as a CSS custom property (`--color-primary: #1E3A8A`) in `shared/web/css/tokens.css` and reference it everywhere with `var(--color-primary)`. This way, a brand colour change requires editing exactly one line.

**Q15.** Possible reasons:
1. **The third app's `package.json` is missing the `"dev"` script** → Check each `apps/*/package.json` for a `"dev": "vite"` entry
2. **The third app's folder is named incorrectly** (e.g., `app/operator` instead of `apps/operator`) → Run `ls apps/` to verify folder names match `pnpm-workspace.yaml`
3. **Port conflict** → The third server may have started but immediately crashed because its port was taken — check the terminal output carefully for error lines between the success lines

## Section D Answers

| # | Answer | Explanation |
|---|---|---|
| 16 | **False** | `turbo.json` pipelines apply to ALL workspaces generically — adding a new app doesn't require updating it |
| 17 | **True** | All three used `--template vanilla` |
| 18 | **False** | `server/` used `npm init -y`, not create-vite |
| 19 | **True** | `:root` variables cascade down to the entire document |
| 20 | **False** | pnpm was specifically designed with workspace (monorepo) support built in |

---

## 📊 Scoring

| Score | Result |
|---|---|
| 18–20 correct | 🏆 Phase 0 Master — you're ready for Phase 1 |
| 14–17 correct | ✅ Good understanding — review the questions you missed |
| 10–13 correct | 📖 Re-read `Concepts.md` and `Student_Guide.md`, then retry |
| Below 10 | 🔁 Work through the guide again step by step with your instructor |
