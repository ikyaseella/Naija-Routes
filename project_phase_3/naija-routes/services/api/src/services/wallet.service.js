import { supabaseAdmin } from '../config/supabase.js';

export class WalletService {
  static async getWallet(userId) {
    const { data, error } = await supabaseAdmin
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) throw new Error('Wallet not found');

    return {
      userId: data.user_id,
      balanceKobo: data.balance_kobo,
      lockedKobo: data.locked_kobo,
      availableKobo: data.balance_kobo - data.locked_kobo,
    };
  }

  static async topUp(userId, amountKobo, method = 'card') {
    if (amountKobo <= 0) throw new Error('Invalid amount');

    const { data: wallet, error: wErr } = await supabaseAdmin
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (wErr || !wallet) throw new Error('Wallet not found');

    const newBalance = wallet.balance_kobo + amountKobo;

    const { error: updateErr } = await supabaseAdmin
      .from('wallets')
      .update({ balance_kobo: newBalance })
      .eq('id', wallet.id);

    if (updateErr) throw new Error(updateErr.message);

    const ref = `TXN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    const { data: txn, error: txnErr } = await supabaseAdmin
      .from('wallet_transactions')
      .insert({
        wallet_id: wallet.id,
        user_id: userId,
        type: 'credit',
        amount_kobo: amountKobo,
        method,
        description: 'Wallet top-up',
        ref,
      })
      .select()
      .single();

    if (txnErr) throw new Error(txnErr.message);

    return {
      wallet: {
        userId,
        balanceKobo: newBalance,
        lockedKobo: wallet.locked_kobo,
        availableKobo: newBalance - wallet.locked_kobo,
      },
      transaction: {
        id: txn.id,
        userId: txn.user_id,
        type: txn.type,
        amountKobo: txn.amount_kobo,
        method: txn.method,
        description: txn.description,
        ref: txn.ref,
        createdAt: txn.created_at,
      },
    };
  }

  static async deduct(userId, amountKobo, description) {
    const { data: wallet, error: wErr } = await supabaseAdmin
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (wErr || !wallet) throw new Error('Wallet not found');

    const available = wallet.balance_kobo - wallet.locked_kobo;
    if (available < amountKobo) throw new Error('Insufficient balance');

    const newBalance = wallet.balance_kobo - amountKobo;

    const { error: updateErr } = await supabaseAdmin
      .from('wallets')
      .update({ balance_kobo: newBalance })
      .eq('id', wallet.id);

    if (updateErr) throw new Error(updateErr.message);

    const ref = `TXN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    const { data: txn, error: txnErr } = await supabaseAdmin
      .from('wallet_transactions')
      .insert({
        wallet_id: wallet.id,
        user_id: userId,
        type: 'debit',
        amount_kobo: amountKobo,
        method: 'wallet',
        description,
        ref,
      })
      .select()
      .single();

    if (txnErr) throw new Error(txnErr.message);

    return {
      wallet: {
        userId,
        balanceKobo: newBalance,
        lockedKobo: wallet.locked_kobo,
        availableKobo: newBalance - wallet.locked_kobo,
      },
      transaction: {
        id: txn.id,
        userId: txn.user_id,
        type: txn.type,
        amountKobo: txn.amount_kobo,
        method: txn.method,
        description: txn.description,
        ref: txn.ref,
        createdAt: txn.created_at,
      },
    };
  }

  static async getTransactions(userId) {
    const { data, error } = await supabaseAdmin
      .from('wallet_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return data.map(t => ({
      id: t.id,
      userId: t.user_id,
      type: t.type,
      amountKobo: t.amount_kobo,
      method: t.method,
      description: t.description,
      ref: t.ref,
      createdAt: t.created_at,
    }));
  }

  static async getAllTransactions(limit = 50) {
    const { data, error } = await supabaseAdmin
      .from('wallet_transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);

    return data.map(t => ({
      id: t.id,
      userId: t.user_id,
      type: t.type,
      amountKobo: t.amount_kobo,
      method: t.method,
      description: t.description,
      ref: t.ref,
      createdAt: t.created_at,
    }));
  }
}
