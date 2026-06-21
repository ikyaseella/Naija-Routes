# 📂 Phase 0 — Monorepo Foundation
## Naija Routes Instructor-Led Learning Materials

This folder contains all learning content for **Phase 0** of the Naija Routes project.
Students follow the numbered files in order. The number = the step sequence.

---

## 📖 Reading Order

| # | File | Audience | Description |
|---|---|---|---|
| — | [`README.md`](./README.md) | Everyone | You are here — start here |
| 1 | [`01_Concepts.md`](./01_Concepts.md) | 🎓 Students | Read FIRST — the WHY behind every tool |
| 2 | [`02_Monorepo_and_Design_System.md`](./02_Monorepo_and_Design_System.md) | 🎓 Students | Set up Turborepo, pnpm, Vite apps & CSS tokens |
| 3 | [`03_Database_Schema.md`](./03_Database_Schema.md) | 🎓 Students | PostgreSQL schema — all 12 tables, Supabase setup |
| 4 | [`04_Auth_Service.md`](./04_Auth_Service.md) | 🎓 Students | Supabase Auth — code scaffolded, commented for Phase 1 |
| 5 | [`05_CICD_Overview.md`](./05_CICD_Overview.md) | 🎓 Students | What CI/CD is — reference doc, not implemented yet |
| 6 | [`06_Cheatsheet.md`](./06_Cheatsheet.md) | 🎓 Students | All commands & tokens in one place (keep open) |
| 7 | [`07_Exercises.md`](./07_Exercises.md) | 🎓 Students | Hands-on practice tasks |
| 8 | [`08_Quiz.md`](./08_Quiz.md) | 🎓 Students | Self-assessment with answer key |
| 9 | [`09_Troubleshooting.md`](./09_Troubleshooting.md) | 🎓 Students | Errors? Check here first |
| 10 | [`10_Instructor_Guide.md`](./10_Instructor_Guide.md) | 👨‍🏫 Instructor only | Teaching notes, pacing, classroom blockers |

---

## 🎯 Phase 0 Deliverables

By the end of this phase, the following will be complete:

| Deliverable | Status | Where |
|---|---|---|
| ✅ Monorepo setup | **Done** | `naija-routes/` — Turborepo + pnpm workspaces |
| ✅ Design system | **Done** | `shared/web/css/tokens.css` |
| ✅ DB schema | **Done** | `server/migrations/001_initial_schema.sql` |
| ✅ Auth service | **Scaffolded** | `server/src/` — code written, commented out for Phase 1 |
| 📋 CI/CD pipeline | **Overview only** | `05_CICD_Overview.md` — implemented in a future phase |
| ⏭️ Paystack integration | **Skipped** | Integrated with ecommerce in a future phase |

---

## 📁 Codebase Structure After Phase 0

```
naija-routes/
├── .gitignore
├── package.json               ← Root monorepo config
├── pnpm-workspace.yaml        ← Workspace definitions
├── turbo.json                 ← Build pipeline
│
├── apps/
│   ├── web/                   ← Consumer web app (Vite + Vanilla JS)
│   ├── agent/                 ← Park agent PWA (Vite + Vanilla JS)
│   └── operator/              ← Operator dashboard (Vite + Vanilla JS)
│
├── server/
│   ├── .env.example           ← Environment variables template
│   ├── package.json
│   ├── migrations/
│   │   └── 001_initial_schema.sql  ← 12-table PostgreSQL schema
│   └── src/
│       ├── app.js             ← Express app + route mounts
│       ├── server.js          ← HTTP server bootstrap
│       ├── config/
│       │   └── supabase.js    ← Supabase client (commented out)
│       ├── middleware/
│       │   └── auth.js        ← JWT auth middleware (commented out)
│       └── routes/
│           └── auth.routes.js ← OTP auth endpoints (commented out)
│
└── shared/
    └── web/
        ├── css/
        │   └── tokens.css     ← Design tokens (colours, spacing, type)
        └── js/
            └── auth.js        ← Frontend auth helper (commented out)
```

---

## ⏱️ Time Estimate

| Activity | Time |
|---|---|
| `01_Concepts.md` (read) | 20 mins |
| `02_Monorepo_and_Design_System.md` (build) | 45–60 mins |
| `03_Database_Schema.md` (Supabase setup + SQL) | 30–45 mins |
| `04_Auth_Service.md` (read + create files) | 20–30 mins |
| `05_CICD_Overview.md` (read only) | 15 mins |
| `07_Exercises.md` | 60–90 mins |
| `08_Quiz.md` | 15 mins |
| **Total** | **~3.5–4.5 hours** |
