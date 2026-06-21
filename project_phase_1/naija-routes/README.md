# Naija Routes 

Nigeria's first end-to-end road transport and logistics aggregator.

## Getting Started (Newbie Guide)

Welcome to the Naija Routes project! This repository uses **Turborepo** and **pnpm workspaces** to manage multiple applications (Web, Agent App, Operator Dashboard) and the backend API all in one place.

### Prerequisites

1. Install [Node.js](https://nodejs.org/) (version 20 LTS recommended).
2. Install `pnpm` package manager:
   ```bash
   npm install -g pnpm
   ```

### Installation

1. Clone the repository and navigate into the folder:
   ```bash
   cd naija-routes
   ```
2. Install all dependencies across all apps:
   ```bash
   pnpm install
   ```

### Running the Project Locally

To run all frontend apps and the backend server at the same time:

```bash
pnpm run dev
```

This command uses Turborepo to start the Vite dev servers for:
- `apps/web` (Consumer Web App)
- `apps/agent` (Park Agent App)
- `apps/operator` (Operator Dashboard)
- `server` (Node.js/Express Backend)

### Project Structure

```text
naija-routes/
├── apps/
│   ├── web/         # HTML/CSS/JS — Consumer-facing website
│   ├── agent/       # HTML/CSS/JS — Park agent PWA
│   └── operator/    # HTML/CSS/JS — Operator web dashboard
├── server/          # Node.js + Express.js Backend API
└── shared/          # Shared assets like CSS tokens
    └── web/css/tokens.css
```

### Design System (CSS)

We use Vanilla CSS with design tokens. Before adding hardcoded colors or margins, check `shared/web/css/tokens.css` for the standard CSS variables (`--color-primary`, `--spacing-4`, etc.).

---
*Happy coding! Feel free to ask your mentor for help with the Supabase/Database setup or if you get stuck on any task.*
