import { WalletService } from './wallet.service.js';

const PAYMENT_METHODS = ['card', 'bank_transfer', 'ussd', 'cash', 'wallet', 'opay', 'palmpay'];

export class PaymentService {
  static payments = [
    {
      id: 'pay-1001', bookingId: 'bk-1745012345678', userId: 'usr-emeka', method: 'card', amountKobo: 950000,
      status: 'success', provider: 'Paystack', providerRef: 'PS-8A3F2K', ref: 'NR-PAY-A7F3K2',
      metadata: { cardLast4: '4242', bank: 'GTBank' }, createdAt: new Date(Date.now() - 43200000).toISOString(),
    },
    {
      id: 'pay-1002', bookingId: 'bk-1745087654321', userId: 'usr-chidi', method: 'wallet', amountKobo: 1250000,
      status: 'success', provider: 'Wallet', providerRef: 'WAL-B4C8X1', ref: 'NR-PAY-B4C8X1',
      metadata: {}, createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 'pay-1003', bookingId: 'bk-1745099999999', userId: 'usr-fatima', method: 'card', amountKobo: 500000,
      status: 'failed', provider: 'Paystack', providerRef: null, ref: 'NR-PAY-F3D9A1',
      metadata: { error: 'Card declined', code: 'declined_do_not_honor' }, createdAt: new Date(Date.now() - 1800000).toISOString(),
    },
  ];

  static initiatePayment({ bookingId, userId, method, amountKobo, metadata = {} }) {
    if (!bookingId || !userId || !method || !amountKobo) {
      throw new Error('Missing required fields: bookingId, userId, method, amountKobo');
    }
    if (!PAYMENT_METHODS.includes(method)) {
      throw new Error(`Invalid payment method: ${method}. Valid: ${PAYMENT_METHODS.join(', ')}`);
    }
    if (amountKobo <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    const ref = `NR-PAY-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const payment = {
      id: `pay-${Date.now()}`,
      bookingId,
      userId,
      method,
      amountKobo,
      status: 'pending',
      provider: null,
      providerRef: null,
      ref,
      metadata,
      createdAt: new Date().toISOString(),
    };

    if (method === 'wallet') {
      try {
        const { wallet, transaction } = WalletService.deduct(userId, amountKobo, `Booking payment ${ref}`);
        payment.status = 'success';
        payment.provider = 'Wallet';
        payment.providerRef = transaction.ref;
        payment.metadata.walletTxnId = transaction.id;
        payment.metadata.newBalanceKobo = wallet.balanceKobo;
      } catch (err) {
        payment.status = 'failed';
        payment.metadata.error = err.message;
      }
    } else if (method === 'cash') {
      payment.status = 'pending';
      payment.provider = 'Cash';
    } else {
      const success = Math.random() > 0.15;
      if (success) {
        payment.status = 'success';
        payment.provider = method === 'card' ? 'Paystack' : method === 'bank_transfer' ? 'Bank Transfer' : 'USSD';
        payment.providerRef = `PS-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      } else {
        payment.status = 'failed';
        payment.metadata.error = 'Transaction declined. Please try again.';
      }
    }

    this.payments.push(payment);
    return payment;
  }

  static confirmPayment(paymentId) {
    const payment = this.payments.find(p => p.id === paymentId);
    if (!payment) throw new Error('Payment not found');
    if (payment.status !== 'pending') throw new Error(`Payment already ${payment.status}`);

    payment.status = 'success';
    payment.providerRef = `PS-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    payment.provider = 'Paystack';
    return payment;
  }

  static failPayment(paymentId) {
    const payment = this.payments.find(p => p.id === paymentId);
    if (!payment) throw new Error('Payment not found');
    if (payment.status !== 'pending') throw new Error(`Payment already ${payment.status}`);

    payment.status = 'failed';
    payment.metadata.error = 'Transaction declined by provider';
    return payment;
  }

  static getPayment(paymentId) {
    const payment = this.payments.find(p => p.id === paymentId);
    if (!payment) throw new Error('Payment not found');
    return payment;
  }

  static getPaymentsByUser(userId) {
    return this.payments.filter(p => p.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  static getPaymentsByBooking(bookingId) {
    return this.payments.filter(p => p.bookingId === bookingId);
  }

  static getAllPayments(limit = 20) {
    return [...this.payments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, limit);
  }

  static getStats() {
    const all = this.payments;
    const successful = all.filter(p => p.status === 'success');
    const failed = all.filter(p => p.status === 'failed');
    const totalKobo = successful.reduce((sum, p) => sum + p.amountKobo, 0);

    return {
      totalPayments: all.length,
      successfulPayments: successful.length,
      failedPayments: failed.length,
      totalRevenueKobo: totalKobo,
      walletPayments: all.filter(p => p.method === 'wallet').length,
      cardPayments: all.filter(p => p.method === 'card').length,
      byMethod: {
        card: all.filter(p => p.method === 'card').length,
        wallet: all.filter(p => p.method === 'wallet').length,
        bank_transfer: all.filter(p => p.method === 'bank_transfer').length,
        cash: all.filter(p => p.method === 'cash').length,
        ussd: all.filter(p => p.method === 'ussd').length,
      },
    };
  }
}
