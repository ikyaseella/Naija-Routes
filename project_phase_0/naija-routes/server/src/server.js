// =============================================================
// NAIJA ROUTES — HTTP Server Bootstrap
// File: server/src/server.js
// Starts the Express app on the configured port
// =============================================================

import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`
  ┌─────────────────────────────────────────┐
  │         NAIJA ROUTES API SERVER         │
  │─────────────────────────────────────────│
  │  Status  : Running ✓                    │
  │  Port    : ${PORT}                          │
  │  Env     : ${process.env.NODE_ENV || 'development'}              │
  │  Health  : http://localhost:${PORT}/health  │
  │  Auth    : http://localhost:${PORT}/api/v1/auth/status │
  └─────────────────────────────────────────┘
  `);
});

// Handle graceful shutdown (Ctrl+C or process kill)
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});
