import express from 'express';
import { UssdService } from '../services/ussd.service.js';

const router = express.Router();

router.post('/webhook', (req, res) => {
  const { sessionId, msisdn, input, network } = req.body;
  if (!sessionId || !msisdn) {
    return res.status(400).json({ error: 'Missing sessionId or msisdn' });
  }

  const result = UssdService.handleRequest({ sessionId, msisdn, input: (input || '').trim() });
  res.json(result);
});

router.get('/simulate', (req, res) => {
  const { session, msisdn, input } = req.query;
  const sessionId = session || `sim-${Date.now()}`;
  const result = UssdService.handleRequest({ sessionId, msisdn: msisdn || '08000000000', input: (input || '').trim() });
  res.json({ sessionId, ...result });
});

router.get('/sessions', (req, res) => {
  const activeSessions = Object.keys(UssdService.sessions).map(id => ({
    sessionId: id,
    level: UssdService.sessions[id].level,
    msisdn: UssdService.sessions[id].msisdn,
  }));
  res.json({ success: true, count: activeSessions.length, data: activeSessions });
});

export default router;
