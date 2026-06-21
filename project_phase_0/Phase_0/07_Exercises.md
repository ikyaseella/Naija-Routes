# 🏋️ Phase 0 — Hands-On Exercises

These exercises are designed to test and deepen your understanding of what you built in Phase 0. Try each one **on your own first**. Hints are provided if you get stuck.

> **Rule:** Don't copy-paste from the Student Guide. Type everything yourself. Muscle memory is real.

---

## Exercise 1 — The "From Scratch" Challenge
**⏱️ Estimated time: 20–30 mins | 🌟 Difficulty: Beginner**

Delete your `naija-routes` folder and **rebuild the entire Phase 0 from memory** without looking at the guide.

Only look at the guide if you are completely stuck after trying for at least 5 minutes.

**Goal:** Be able to scaffold the entire monorepo structure in under 20 minutes.

**Success criteria:**
- All three Vite apps start successfully with `pnpm run dev`
- No errors in the terminal

---

## Exercise 2 — Extend the Design Tokens
**⏱️ Estimated time: 10–15 mins | 🌟 Difficulty: Beginner**

Open `shared/web/css/tokens.css` and add the following new tokens **on your own** (no copy-paste from anywhere):

1. A `--color-warning` token using an orange colour (`#F97316`)
2. A `--font-size-3xl` token for a heading size of `2rem` (32px)
3. A `--spacing-12` token with a value of `3rem`
4. A `--shadow-none` token with a value of `none`

**Verify it works:** In `apps/web/src/style.css`, use one of your new tokens on the `body` element.

<details>
<summary>💡 Hint (click to reveal)</summary>

In `style.css`:
```css
body {
  font-size: var(--font-size-base);
  /* try adding padding using your new token: */
  padding: var(--spacing-12);
}
```
Open the browser at `http://localhost:5173` and inspect the body's computed padding in DevTools.
</details>

---

## Exercise 3 — Add a Fourth App
**⏱️ Estimated time: 15–20 mins | 🌟 Difficulty: Intermediate**

The PRD mentions a future **mobile app** folder. Your task is to:

1. Scaffold a new Vite app at `apps/mobile` using the `vanilla` template
2. Register it in `pnpm-workspace.yaml` (it should already be covered by `apps/*`)
3. Verify that `pnpm run dev` now starts **four** servers simultaneously

**Question to answer:** After adding the app, did you need to change `pnpm-workspace.yaml`? Why or why not?

<details>
<summary>💡 Hint (click to reveal)</summary>

The `pnpm-workspace.yaml` already has `"apps/*"` which matches ALL sub-folders inside `apps/`. So `apps/mobile` is automatically included — no changes needed. This is the power of the wildcard `*` pattern.
</details>

---

## Exercise 4 — Understand the Build Cache
**⏱️ Estimated time: 10 mins | 🌟 Difficulty: Intermediate**

This exercise demonstrates Turborepo's caching superpower.

1. Run `pnpm run build` — note how long it takes (look for the time in the output)
2. Run `pnpm run build` **again** immediately without changing anything
3. Compare the times and look for the word `FULL TURBO` in the output

**Questions to answer:**
- What did Turborepo say on the second build?
- Why was the second build faster?
- What does `"outputs": ["dist/**"]` in `turbo.json` have to do with this?

<details>
<summary>💡 Hint (click to reveal)</summary>

Turborepo hashes all your input files. If the hash hasn't changed, it restores the cached `dist/**` folder instead of rebuilding. You should see something like:
```
Tasks:    3 successful, 3 cached, 3 total
Time:     312ms >>> FULL TURBO
```
The "FULL TURBO" means 100% of the work came from cache — zero actual computation!
</details>

---

## Exercise 5 — Trace a Token
**⏱️ Estimated time: 10–15 mins | 🌟 Difficulty: Intermediate**

This exercise teaches you how the shared design system connects to each app.

**Task:**
1. In `shared/web/css/tokens.css`, change `--color-primary` from `#1E3A8A` (deep blue) to `#7C3AED` (purple)
2. Add a reference to this token in `apps/web/src/style.css`:
   ```css
   h1 { color: var(--color-primary); }
   ```
3. In `apps/web/index.html`, add an `<h1>` tag in the body
4. Start the dev server and verify the heading is purple

**Restore** the original colour when you're done.

**The key lesson:** One token change → immediate effect across all apps that use it.

<details>
<summary>💡 Hint — If tokens.css isn't working in your app</summary>

You may need to import the shared tokens file in your app's CSS. In `apps/web/src/style.css`, add at the very top:

```css
@import '../../../shared/web/css/tokens.css';
```

The `../../../` navigates up three levels: from `src/` → `web/` → `apps/` → `naija-routes/`, then into `shared/web/css/`.
</details>

---

## Exercise 6 — Read a Real Codebase
**⏱️ Estimated time: 15–20 mins | 🌟 Difficulty: Intermediate**

Open the file `naija-routes/apps/web/package.json` in VS Code.

Answer these questions **without Googling** (use `Concepts.md` or the Student Guide):

1. What is the `"name"` field used for in a workspace?
2. What does `"type": "module"` mean? (Hint: ES Modules vs CommonJS)
3. What does the `"dev"` script (`"vite"`) actually do when you run it?
4. Why does this `package.json` not have `"turbo"` in it, but the root one does?

---

## 🏆 Bonus Challenge — Write the `shared/package.json`
**⏱️ Estimated time: 15 mins | 🌟 Difficulty: Advanced**

The `shared/` folder doesn't have its own `package.json` yet, but it should — so other workspaces can reference it properly.

Create `shared/web/package.json` with:
- A `name` of `@naija-routes/design-tokens`
- Version `1.0.0`
- A `"main"` field pointing to `css/tokens.css`

Then in `apps/web/package.json`, add it as a dependency:
```json
{
  "dependencies": {
    "@naija-routes/design-tokens": "workspace:*"
  }
}
```

Run `pnpm install` and observe what happens in `node_modules`.

> 💡 `workspace:*` is pnpm's syntax for "use the version from inside this monorepo, not from the internet."

---

## 📝 Exercise Completion Log

Track your progress here:

| Exercise | Attempted | Completed | Notes |
|---|---|---|---|
| 1 — From Scratch | ☐ | ☐ | |
| 2 — Extend Tokens | ☐ | ☐ | |
| 3 — Fourth App | ☐ | ☐ | |
| 4 — Build Cache | ☐ | ☐ | |
| 5 — Trace a Token | ☐ | ☐ | |
| 6 — Read Codebase | ☐ | ☐ | |
| Bonus — shared pkg | ☐ | ☐ | |
