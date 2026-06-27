import { apiClient } from '../core/api.js';

const USER_ID = 'usr-emeka';
let walletData = null;

function showWalletError(msg) {
  const el = document.getElementById('walletError');
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 5000);
}

function showWalletSuccess(msg) {
  const el = document.getElementById('walletSuccess');
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 5000);
}

window.switchWalletTab = function (name) {
  document.querySelectorAll('.wallet-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.wallet-panel').forEach(p => p.classList.remove('active'));
  document.querySelector(`.wallet-tab[data-wtab="${name}"]`).classList.add('active');
  document.getElementById(`wpanel-${name}`).classList.add('active');
  if (name === 'transactions') renderTransactions();
};

window.selectAmount = function (btn, kobo) {
  document.querySelectorAll('.quick-amount').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  document.getElementById('topupAmount').value = kobo / 100;
};

window.refreshWallet = async function () {
  try {
    const res = await fetch(`http://localhost:3000/api/v1/wallet/${USER_ID}`);
    const json = await res.json();
    if (!json.success) { showWalletError('Failed to load wallet'); return; }
    walletData = json.data;
    const bal = walletData.balance_kobo || 0;
    document.getElementById('walletBalance').textContent = '₦' + (bal / 100).toLocaleString(undefined, { minimumFractionDigits: 2 });
    document.getElementById('walletAvailable').textContent = '₦' + (bal / 100).toLocaleString(undefined, { minimumFractionDigits: 2 });
    document.getElementById('walletUserId').textContent = 'User: ' + USER_ID;
    if (walletData.name) document.getElementById('walletUserId').textContent = walletData.name + ' · ' + USER_ID;
  } catch (e) {
    document.getElementById('walletBalance').textContent = '₦2,500.00';
    document.getElementById('walletAvailable').textContent = '₦2,500.00';
    document.getElementById('walletUserId').textContent = 'Demo Mode';
  }
  try {
    const txnRes = await fetch(`http://localhost:3000/api/v1/wallet/${USER_ID}/transactions`);
    const txnJson = await txnRes.json();
    if (txnJson.success) {
      const txns = txnJson.data || [];
      const totalTopups = txns.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount_kobo, 0);
      document.getElementById('walletTotalTopups').textContent = '₦' + (totalTopups / 100).toLocaleString(undefined, { minimumFractionDigits: 2 });
    }
  } catch (e) { /* demo mode */ }
};

window.submitTopup = async function () {
  const amountInput = document.getElementById('topupAmount');
  const amountNaira = parseFloat(amountInput.value);
  if (!amountNaira || amountNaira < 100) { showWalletError('Minimum top-up is ₦100'); return; }
  const amountKobo = Math.round(amountNaira * 100);
  const method = document.getElementById('topupMethod').value;

  try {
    const res = await fetch(`http://localhost:3000/api/v1/wallet/${USER_ID}/topup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amountKobo, method }),
    });
    const json = await res.json();
    if (json.success) {
      showWalletSuccess(`✅ ₦${amountNaira.toLocaleString()} added via ${method.replace('_', ' ')}`);
      amountInput.value = '';
      document.querySelectorAll('.quick-amount').forEach(b => b.classList.remove('selected'));
      await refreshWallet();
    } else {
      showWalletError(json.error || 'Top-up failed');
    }
  } catch (e) {
    showWalletSuccess('✅ (Demo) ₦' + amountNaira.toLocaleString() + ' added via ' + method.replace('_', ' '));
    amountInput.value = '';
    document.querySelectorAll('.quick-amount').forEach(b => b.classList.remove('selected'));
  }
};

async function renderTransactions() {
  const el = document.getElementById('txList');
  const filter = document.getElementById('txFilter').value;
  try {
    const res = await fetch(`http://localhost:3000/api/v1/wallet/${USER_ID}/transactions`);
    const json = await res.json();
    let txns = json.data || [];
    if (filter !== 'all') txns = txns.filter(t => t.type === filter);
    if (txns.length === 0) { el.innerHTML = '<p style="color:var(--color-slate-400);font-size:var(--text-sm);">No transactions yet.</p>'; return; }
    let html = '<table class="tx-table"><thead><tr><th>Date</th><th>Type</th><th>Method</th><th>Amount</th><th>Ref</th></tr></thead><tbody>';
    txns.forEach(t => {
      const cls = t.type === 'credit' ? 'tx-credit' : 'tx-debit';
      const sign = t.type === 'credit' ? '+' : '-';
      html += `<tr><td>${new Date(t.created_at || Date.now()).toLocaleDateString()}</td><td class="${cls}">${t.type}</td><td style="font-size:var(--text-xs);color:var(--color-slate-500);">${t.method || '—'}</td><td class="${cls}">${sign}₦${(t.amount_kobo / 100).toLocaleString()}</td><td style="font-size:var(--text-xs);font-family:monospace;">${(t.reference || '—').slice(0, 16)}</td></tr>`;
    });
    html += '</tbody></table>';
    el.innerHTML = html;
  } catch (e) {
    el.innerHTML = '<table class="tx-table"><thead><tr><th>Date</th><th>Type</th><th>Amount</th></tr></thead><tbody><tr><td>2026-06-25</td><td class="tx-credit">credit</td><td class="tx-credit">+₦2,500.00</td></tr><tr><td>2026-06-20</td><td class="tx-credit">credit</td><td class="tx-credit">+₦5,000.00</td></tr></tbody></table>';
  }
}

window.renderTransactions = renderTransactions;

refreshWallet();
