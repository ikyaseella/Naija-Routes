// =============================================================
// NAIJA ROUTES — Express App Entry Point
// File: server/src/app.js
// Phase: Phase 1 MVP — all core routes active
// =============================================================

import express from 'express';
import authRouter from './routes/auth.routes.js';
import searchRouter from './routes/search.routes.js';
import bookingRouter from './routes/booking.routes.js';
import ticketRouter from './routes/ticket.routes.js';
import operatorRouter from './routes/operator.routes.js';
import agentRouter from './routes/agent.routes.js';

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── CORS — allow web, agent, and operator frontends ──────────
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// ── Health check ─────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'naija-routes-api',
    version: '1.0.0',
    phase: 'Phase 1 — MVP Launch',
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes — Phase 1 ──────────────────────────────────────
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/routes', searchRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/tickets', ticketRouter);
app.use('/api/v1/operators', operatorRouter);
app.use('/api/v1/agents', agentRouter);

// Phase 2 routes (scaffolded — activate in Phase 2):
// import paymentRouter from './routes/payment.routes.js';
// import trackingRouter from './routes/tracking.routes.js';
// import cargoRouter from './routes/cargo.routes.js';
// import reviewRouter from './routes/review.routes.js';
// app.use('/api/v1/pay', paymentRouter);
// app.use('/api/v1/tracking', trackingRouter);
// app.use('/api/v1/cargo', cargoRouter);
// app.use('/api/v1/reviews', reviewRouter);

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
  res.status(err.statusCode || 500).json({
    error: err.name || 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

export default app;
