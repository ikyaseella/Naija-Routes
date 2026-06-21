# 🔄 Phase 0 — Step 5: CI/CD Pipeline
## What It Is, How It Works & What We'll Build Later

> **Status for Phase 0:** We are **not implementing** the CI/CD pipeline right now. This document gives you the full understanding of what it is so you're prepared when we set it up in a later phase. Bookmark this!

---

## What is CI/CD?

**CI/CD** stands for **Continuous Integration / Continuous Deployment**.

It is a system that automatically tests, checks, and deploys your code every time a developer pushes changes to GitHub — without anyone having to do it manually.

Think of it as having a **robot team member** who:
1. Picks up every new code change as soon as it's pushed
2. Runs all the tests to make sure nothing is broken
3. Checks that the code is properly formatted
4. Deploys the working code to the live server

---

## 🔁 The Two Halves

### CI — Continuous Integration
**"Does this new code break anything?"**

Every time someone pushes code or opens a pull request, the CI system automatically runs:
- ✅ Linting (checks code style rules)
- ✅ Unit tests (does individual logic work?)
- ✅ Integration tests (do components work together?)
- ✅ Build check (does the project compile without errors?)

If ANY of these fail, the pull request is **blocked** and shown as red on GitHub. No broken code can merge.

### CD — Continuous Deployment
**"Push this working code to the live server."**

After a pull request is merged and CI passes, the CD system automatically:
1. Builds the production bundle (`pnpm run build`)
2. Deploys the new version to **staging** (a test environment)
3. After manual approval → deploys to **production** (real users)

---

## 🏗️ Our CI/CD Stack (to be implemented later)

As specified in the PRD:

| Tool | Role |
|---|---|
| **GitHub Actions** | The CI/CD engine — runs automated workflows on every push/PR |
| **AWS CodeDeploy** | Deploys built artifacts to our AWS ECS containers |
| **Turborepo Remote Cache** | Caches build outputs so CI doesn't rebuild unchanged apps |

---

## 📂 The Files We Will Create

When we implement CI/CD, we'll add these files to the repo:

```
naija-routes/
└── .github/
    └── workflows/
        ├── ci.yml      ← Runs on every Pull Request
        └── deploy.yml  ← Runs on merge to main
```

---

## 📄 What `ci.yml` Will Do

```yaml
# This is a PREVIEW — not yet implemented
name: CI

on:
  pull_request:
    branches: [main, develop]

jobs:
  test-and-lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v3
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Lint all apps
        run: pnpm run lint

      - name: Build all apps (checks for compile errors)
        run: pnpm run build
```

**What each step does:**
| Step | Purpose |
|---|---|
| `actions/checkout@v4` | Downloads the code from GitHub onto the CI server |
| `pnpm/action-setup@v3` | Installs pnpm on the CI server |
| `actions/setup-node@v4` | Installs Node.js 20 on the CI server |
| `pnpm install` | Installs all dependencies |
| `pnpm run lint` | Checks code style — fails if lint errors exist |
| `pnpm run build` | Tries to build all apps — fails if there are compile errors |

---

## 📄 What `deploy.yml` Will Do

```yaml
# This is a PREVIEW — not yet implemented
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install & Build
        run: |
          pnpm install
          pnpm run build

      - name: Deploy to Staging
        run: |
          aws deploy create-deployment \
            --application-name naija-routes \
            --deployment-group-name staging \
            --s3-location bucket=naija-routes-builds,key=latest.zip
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

**Note the `${{ secrets.AWS_ACCESS_KEY_ID }}`** — GitHub stores sensitive credentials as **Secrets** so they're never visible in code.

---

## 🌿 Git Branch Strategy

Our CI/CD system works alongside a disciplined Git branching strategy:

```
main          ← Production-ready code only. Every merge triggers a deploy.
  │
  └── develop ← Integration branch. All features merge here first.
        │
        ├── feature/route-search     ← One branch per feature
        ├── feature/booking-flow
        └── fix/payment-webhook-bug
```

**The flow:**
1. Developer creates a `feature/` branch from `develop`
2. Developer pushes code → **CI runs automatically** on the branch
3. Developer opens a Pull Request to merge into `develop`
4. CI must be ✅ green before the PR can be merged
5. When `develop` is merged into `main` → **CD deploys to production**

---

## 🧩 Key Concepts to Remember

| Term | Meaning |
|---|---|
| **Pipeline** | The sequence of automated steps (install → lint → test → build → deploy) |
| **Workflow** | A GitHub Actions YAML file defining one pipeline |
| **Job** | A group of steps within a workflow that run on the same server |
| **Step** | A single command or action within a job |
| **Secret** | An encrypted environment variable stored in GitHub — used for API keys, passwords |
| **Artifact** | A file produced by a build step (e.g., the `dist/` folder) |
| **Runner** | The virtual machine GitHub spins up to run your workflow (`ubuntu-latest`) |

---

## ✅ What Good CI/CD Gives Us

| Benefit | How it helps Naija Routes |
|---|---|
| **No broken code in production** | A failed booking flow can't be accidentally deployed |
| **Faster reviews** | Reviewers don't manually test basic functionality — CI does it |
| **Audit trail** | Every deployment is logged with who triggered it and what changed |
| **Rollback safety** | If production breaks, we can redeploy the previous version in minutes |
| **Team confidence** | Developers can push code without fear of breaking others' work |

---

## 📚 Further Reading (When You're Ready)

- [GitHub Actions official docs](https://docs.github.com/en/actions)
- [Turborepo CI guide](https://turbo.build/repo/docs/guides/ci-vendors/github-actions)
- [pnpm in CI environments](https://pnpm.io/continuous-integration)

---

> 🔖 **Remember:** We will implement the actual `.github/workflows/` files in a future phase. When we do, come back to this document — everything here will make the implementation feel familiar.
