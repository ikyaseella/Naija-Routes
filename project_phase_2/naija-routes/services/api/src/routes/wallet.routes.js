import express from 'express';
import { WalletService } from '../services/wallet.service.js';

const router = express.Router();

router.get('/:userId', async (req, res, next) => {
  try {
    const wallet = await WalletService.getWallet(req.params.userId);
    res.json({ success: true, data: wallet });
  } catch (err) {
    if (err.message === 'Wallet not found') return res.status(404).json({ error: err.message });
    next(err);
  }
});

router.post('/:userId/topup', async (req, res, next) => {
  try {
    const { amountKobo, method } = req.body;
    if (!amountKobo || amountKobo <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }
    const result = await WalletService.topUp(req.params.userId, amountKobo, method || 'card');
    res.json({ success: true, data: result });
  } catch (err) {
    if (err.message === 'Wallet not found') return res.status(404).json({ error: err.message });
    if (err.message === 'Invalid amount') return res.status(400).json({ error: err.message });
    next(err);
  }
});

router.get('/:userId/transactions', async (req, res, next) => {
  try {
    const transactions = await WalletService.getTransactions(req.params.userId);
    res.json({ success: true, data: transactions });
  } catch (err) {
    if (err.message === 'Wallet not found') return res.status(404).json({ error: err.message });
    next(err);
  }
});

router.get('/', (req, res) => {
  return res.status(501).json({ error: 'List all wallets not implemented' });
});

export default router;
