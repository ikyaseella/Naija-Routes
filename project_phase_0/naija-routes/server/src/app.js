// =============================================================
// NAIJA ROUTES — Express App Entry Point
// File: server/src/app.js
// Status: SCAFFOLDED — extend in Phase 1
// =============================================================

import express from 'express';
import authRouter from './routes/auth.routes.js';

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health check ─────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'naija-routes-api',
    version: '0.1.0',
    phase: 'Phase 0 — Foundation',
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ────────────────────────────────────────────────
// Auth (scaffolded, endpoints commented out until Phase 1)
app.use('/api/v1/auth', authRouter);

// Phase 1 routes (uncomment as you build them):
// import searchRouter from './routes/search.routes.js';
// import bookingRouter from './routes/booking.routes.js';
// import paymentRouter from './routes/payment.routes.js';
// import ticketRouter from './routes/ticket.routes.js';
// import operatorRouter from './routes/operator.routes.js';
// import agentRouter from './routes/agent.routes.js';
// app.use('/api/v1/routes', searchRouter);
// app.use('/api/v1/bookings', bookingRouter);
// app.use('/api/v1/pay', paymentRouter);
// app.use('/api/v1/tickets', ticketRouter);
// app.use('/api/v1/operators', operatorRouter);
// app.use('/api/v1/agents', agentRouter);

// ── 404 Handler ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} does not exist`,
  });
});

// ── Global Error Handler ──────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

export default app;
