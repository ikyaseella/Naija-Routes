# Naija Routes

Naija Routes is a Nigerian road transport & logistics aggregator. Travellers search state-to-state, compare buses/cargo options across all operators, and book seamlessly. A unique agent-tech model brings offline motor parks online. Live tracking, digital tickets, multi-language, and hybrid payments included.

This repository is structured as follows:

## Repository Structure

- **[PRD.md](PRD.md)**: Product Requirement Document detailing the vision, user roles, system architecture, and phase roadmaps.
- **[naija-routes/](naija-routes/)**: The core monorepo for the project, configured with **Turborepo** and **pnpm workspaces**.
  - **[apps/](naija-routes/apps/)**: Frontend applications (Consumer Web, Park Agent, Operator Dashboard).
  - **[services/](naija-routes/services/)**: Backend API services (Node.js + Express).
  - **[packages/](naija-routes/packages/)**: Shared configuration and design tokens.
- **[project_phase_0/](project_phase_0/)**: Learning modules and implementation for Phase 0 (Supabase setup, Turborepo skeleton, auth routing).
- **[project_phase_1/](project_phase_1/)**: Learning modules and implementation for Phase 1 (Core ticketing, booking engine, seat layout, Paystack, agent portal).

For instructions on setting up and running the project locally, please refer to the **[naija-routes/README.md](naija-routes/README.md)**.
