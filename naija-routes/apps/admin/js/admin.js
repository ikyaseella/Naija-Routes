const hamburger = document.getElementById('mobileHamburger');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebarOverlay');

if (hamburger) {
  function toggleSidebar() {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
    document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggleSidebar);
  overlay.addEventListener('click', toggleSidebar);
}

const viewNames = {
  overview: 'overview', livefeed: 'live feed', routemap: 'route map',
  transactions: 'transactions', operators: 'operators', agents: 'agents',
  users: 'users', kyc: 'kyc queue', alerts: 'alerts', fleet: 'fleet tracking',
  cargo: 'cargo', announcements: 'announcements', config: 'config',
  payments: 'payment gateways', whatsapp: 'whatsapp bot', sms: 'sms / termii', email: 'email / resend', push: 'push notifications',
  security: 'security', audit: 'audit logs'
};

document.querySelectorAll('.sb-item[data-view]').forEach(item => {
  item.addEventListener('click', () => {
    const view = item.dataset.view;
    document.querySelectorAll('.sb-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const target = document.getElementById('view-' + view);
    if (target) target.classList.add('active');
    document.getElementById('bcSection').textContent = viewNames[view] || view;
    if (window.innerWidth <= 768) toggleSidebar();
  });
});

window.approveKYC = async function (btn) {
  const row = btn.closest('.kyc-row');
  const id = row.dataset.submissionId;
  const adminId = localStorage.getItem('userId') || 'admin';
  try {
    const res = await fetch('/api/v1/kyc/submissions/' + id + '/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'approved', reviewed_by: adminId, review_note: '' }),
    });
    const data = await res.json();
    if (!data.success) { alert(data.error || 'Failed to approve'); return; }
  } catch { alert('Server error'); return; }
  const status = row.querySelector('.kyc-status');
  status.className = 'kyc-status kyc-approved';
  status.textContent = 'Approved';
  btn.textContent = 'DONE';
  btn.style.background = 'var(--dim)';
  btn.style.color = 'var(--muted)';
  btn.style.cursor = 'default';
  btn.onclick = null;
  const rejectBtn = row.querySelector('.kyc-btn[style*="background:var(--red)"]');
  if (rejectBtn) rejectBtn.remove();
};

window.rejectKYC = async function (btn) {
  const row = btn.closest('.kyc-row');
  const id = row.dataset.submissionId;
  const note = prompt('Rejection reason (optional):');
  const adminId = localStorage.getItem('userId') || 'admin';
  try {
    const res = await fetch('/api/v1/kyc/submissions/' + id + '/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'rejected', reviewed_by: adminId, review_note: note || '' }),
    });
    const data = await res.json();
    if (!data.success) { alert(data.error || 'Failed to reject'); return; }
  } catch { alert('Server error'); return; }
  const status = row.querySelector('.kyc-status');
  status.className = 'kyc-status';
  status.style.cssText = 'background:var(--red-pale);color:var(--red);border:1px solid rgba(239,68,68,0.3);font-family:IBM Plex Mono,monospace;font-size:10px;padding:3px 8px;border-radius:3px;font-weight:700;text-transform:uppercase;text-align:center;';
  status.textContent = 'Rejected';
  btn.textContent = 'DONE';
  btn.style.background = 'var(--dim)';
  btn.style.color = 'var(--muted)';
  btn.style.cursor = 'default';
  btn.onclick = null;
  const approveBtn = row.querySelector('.kyc-btn[style*="background:var(--green)"]');
  if (approveBtn) approveBtn.remove();
};

window.showNewAnnouncement = function () {
  const form = document.getElementById('newAnnouncementForm');
  if (form) {
    form.style.display = 'block';
    form.scrollIntoView({ behavior: 'smooth' });
  }
};

window.postAnnouncement = function () {
  const title = document.getElementById('annTitle').value.trim();
  const body = document.getElementById('annBody').value.trim();
  if (!title || !body) { alert('Please fill in both title and message.'); return; }
  const list = document.getElementById('announcementList');
  const card = document.createElement('div');
  card.className = 'announcement-card';
  card.innerHTML = '<h4>' + title + '</h4><div class="ann-meta">Posted by Admin · Just now · <span class="status-badge active">Active</span></div><p style="font-size:13px;color:var(--text);">' + body + '</p>';
  list.insertBefore(card, list.firstChild);
  document.getElementById('newAnnouncementForm').style.display = 'none';
  document.getElementById('annTitle').value = '';
  document.getElementById('annBody').value = '';
};

window.filterFeed = function (query) {
  const type = document.getElementById('feedTypeFilter').value;
  document.querySelectorAll('#feedContainer .feed-item').forEach(item => {
    const text = item.textContent.toLowerCase();
    const itemType = item.dataset.type;
    const matchesType = type === 'all' || itemType === type;
    const matchesSearch = !query || text.includes(query.toLowerCase());
    item.style.display = matchesType && matchesSearch ? '' : 'none';
  });
};

let allTxData = [];

async function loadTransactions() {
  const method = document.getElementById('txMethodFilter').value;
  const status = document.getElementById('txStatusFilter').value;
  const query = document.getElementById('txSearch').value;
  const tbody = document.getElementById('txBody');
  tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--muted);padding:24px;">Loading...</td></tr>';

  try {
    const params = new URLSearchParams({ limit: '100' });
    if (status !== 'all') params.set('status', status);
    if (method !== 'all') params.set('method', method);
    const res = await fetch('/api/v1/payments?' + params.toString());
    const json = await res.json();
    allTxData = json.data || [];

    if (allTxData.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--muted);padding:24px;">No transactions found</td></tr>';
      return;
    }

    tbody.innerHTML = allTxData.map(tx => {
      const route = tx.bookings ? `${tx.bookings.origin || ''} → ${tx.bookings.destination || ''}` : '—';
      const amount = `₦${(tx.amount_kobo / 100).toLocaleString()}`;
      const methodLabel = tx.method?.charAt(0).toUpperCase() + tx.method?.slice(1) || '—';
      const statusClass = tx.status === 'success' ? 'active' : tx.status === 'failed' ? 'suspended' : 'pending';
      const amountColor = tx.status === 'success' ? 'var(--green)' : tx.status === 'failed' ? 'var(--red)' : 'var(--gold)';
      const time = tx.created_at ? new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—';

      if (query && !tx.ref?.toLowerCase().includes(query.toLowerCase()) && !route.toLowerCase().includes(query.toLowerCase())) return '';

      return `<tr data-method="${tx.method || 'other'}" data-status="${tx.status}">
        <td style="font-family:'IBM Plex Mono',monospace;">${tx.ref || tx.id?.slice(0, 8) || '—'}</td>
        <td>${tx.bookings?.user_id?.slice(0, 12) || '—'}</td>
        <td>${route}</td>
        <td style="color:${amountColor};font-weight:600;">${amount}</td>
        <td>${methodLabel}</td>
        <td><span class="status-badge ${statusClass}">${tx.status?.charAt(0).toUpperCase() + tx.status?.slice(1) || '—'}</span></td>
        <td style="color:var(--muted);font-size:11px;">${time}</td>
      </tr>`;
    }).filter(Boolean).join('');
  } catch {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--red);padding:24px;">⚠️ Could not load transactions (API offline)</td></tr>';
  }
}

window.filterTransactions = function (query) {
  loadTransactions();
};

window.filterOperators = function (query) {
  document.querySelectorAll('#opBody tr').forEach(row => {
    row.style.display = !query || row.textContent.toLowerCase().includes(query.toLowerCase()) ? '' : 'none';
  });
};

async function fetchAdminData() {
  try {
    const [healthRes, payStatsRes] = await Promise.all([
      fetch('/health').catch(() => null),
      fetch('/api/v1/payments/stats/all').catch(() => null),
    ]);

    if (healthRes && healthRes.ok) {
      const health = await healthRes.json();
      const indicator = document.querySelector('.live-indicator span');
      if (indicator) indicator.textContent = `LIVE — ${health.phase}`;
    }

    if (payStatsRes && payStatsRes.ok) {
      const payStats = (await payStatsRes.json()).data;
      document.querySelectorAll('.metric-block').forEach(el => {
        const lbl = el.querySelector('.metric-lbl')?.textContent?.trim();
        const valEl = el.querySelector('.metric-val');
        if (!lbl || !valEl) return;
        if (lbl.includes('GMV')) valEl.textContent = '₦' + (payStats.totalRevenueKobo / 100000).toFixed(1) + 'M';
        if (lbl.includes('Failed')) valEl.textContent = payStats.failedPayments;
      });
    }

  } catch (e) {
    console.log('Admin dashboard running with demo data');
  }
}

fetchAdminData();
setInterval(fetchAdminData, 30000);

window.toggleWA = function (btn) { btn.classList.toggle('on'); };

const WA_API = 'http://localhost:3000/api/v1/whatsapp';

async function loadWASettings() {
  try {
    const res = await fetch(WA_API + '/settings');
    const json = await res.json();
    if (!json.success) return;
    const s = json.data;
    setToggle('waEnabled', s.enabled);
    if (s.provider) document.getElementById('waProvider').value = s.provider;
    if (s.accountSid) document.getElementById('waAccountSid').value = s.accountSid;
    if (s.authToken) document.getElementById('waAuthToken').value = s.authToken;
    if (s.phoneNumber) document.getElementById('waPhone').value = s.phoneNumber;
    if (s.businessName) document.getElementById('waBusinessName').value = s.businessName;
    setToggle('waAutoReply', s.autoReply !== false);
    setToggle('waWorkHours', s.workingHoursOnly === true);
    if (s.workingHoursStart) document.getElementById('waWorkStart').value = s.workingHoursStart;
    if (s.workingHoursEnd) document.getElementById('waWorkEnd').value = s.workingHoursEnd;
    setToggle('waEscalate', s.supportEscalation !== false);
    if (s.supportPhone) document.getElementById('waSupportPhone').value = s.supportPhone;
    if (s.greetingMessage) document.getElementById('waGreeting').value = s.greetingMessage;
  } catch (e) { console.log('WhatsApp settings: using defaults'); }
}

function getWASettings() {
  return {
    enabled: document.getElementById('waEnabled').classList.contains('on'),
    provider: document.getElementById('waProvider').value,
    accountSid: document.getElementById('waAccountSid').value,
    authToken: document.getElementById('waAuthToken').value,
    phoneNumber: document.getElementById('waPhone').value,
    businessName: document.getElementById('waBusinessName').value,
    greetingMessage: document.getElementById('waGreeting').value,
    autoReply: document.getElementById('waAutoReply').classList.contains('on'),
    workingHoursOnly: document.getElementById('waWorkHours').classList.contains('on'),
    workingHoursStart: document.getElementById('waWorkStart').value,
    workingHoursEnd: document.getElementById('waWorkEnd').value,
    supportEscalation: document.getElementById('waEscalate').classList.contains('on'),
    supportPhone: document.getElementById('waSupportPhone').value,
  };
}

window.saveWASettings = async function () {
  const settings = getWASettings();
  try {
    const res = await fetch(WA_API + '/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    const json = await res.json();
    if (json.success) alert('✅ WhatsApp settings saved successfully!');
    else alert('❌ Error: ' + (json.error || 'Unknown'));
  } catch (e) { alert('❌ Cannot connect to API server.'); }
};

window.resetWASettings = function () {
  if (!confirm('Reset WhatsApp settings to defaults?')) return;
  const def = {
    enabled: false, provider: 'twilio', accountSid: '', authToken: '',
    phoneNumber: '', businessName: 'Naija Routes',
    greetingMessage: 'Welcome to Naija Routes! 🚌\nReply with:\n1. Book Trip\n2. Track Trip\n3. Routes\n4. Wallet\n5. Help\n0. Exit',
    autoReply: true, workingHoursOnly: false,
    workingHoursStart: '08:00', workingHoursEnd: '20:00',
    supportEscalation: true, supportPhone: '+2348012345678',
  };
  applyWASettings(def);
};

function applyWASettings(s) {
  setToggle('waEnabled', s.enabled);
  setToggle('waAutoReply', s.autoReply !== false);
  setToggle('waWorkHours', s.workingHoursOnly === true);
  setToggle('waEscalate', s.supportEscalation !== false);
  ['waProvider','waAccountSid','waAuthToken','waPhone','waBusinessName','waWorkStart','waWorkEnd','waSupportPhone','waGreeting'].forEach(id => {
    const el = document.getElementById(id);
    if (el && s[el.id.replace('wa','').replace(/^[A-Z]/,c=>c.toLowerCase())] !== undefined) el.value = s[el.id.replace('wa','').replace(/^[A-Z]/,c=>c.toLowerCase())];
  });
}

function setToggle(id, on) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('on', !!on);
}

window.testWhatsApp = async function () {
  const input = document.getElementById('waTestInput').value || '1';
  const resultEl = document.getElementById('waTestResult');
  resultEl.textContent = 'Sending...';
  try {
    const res = await fetch(WA_API + '/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });
    const json = await res.json();
    if (json.success) resultEl.textContent = json.data.text;
    else resultEl.textContent = 'Error: ' + (json.error || 'Unknown');
  } catch (e) {
    resultEl.textContent = '⚠️ Simulated response (API offline):\n\n' +
      (input === '1' || input.toLowerCase() === 'book'
        ? 'Where are you travelling FROM?\n(e.g., Lagos, Abuja, Port Harcourt)'
        : input === '2' || input.toLowerCase() === 'track'
        ? 'Enter your booking reference:\n(e.g., NR-A7F3K2)'
        : 'Welcome to Naija Routes! 🚌\n1. Book Trip\n2. Track Trip\n3. Routes\n4. Wallet\n5. Help\n0. Exit');
  }
};

window.togglePN = function (btn) { btn.classList.toggle('on'); };

const PN_API = 'http://localhost:3000/api/v1/notifications';

async function loadPNSettings() {
  try {
    const res = await fetch(PN_API + '/settings');
    const json = await res.json();
    if (!json.success) return;
    const s = json.data;
    setToggle('pnEnabled', s.enabled);
    if (s.provider) document.getElementById('pnProvider').value = s.provider;
    if (s.serverKey) document.getElementById('pnServerKey').value = s.serverKey;
    if (s.senderId) document.getElementById('pnSenderId').value = s.senderId;
    if (s.defaultTitle) document.getElementById('pnTitle').value = s.defaultTitle;
    if (s.defaultIcon) document.getElementById('pnIcon').value = s.defaultIcon;
    setToggle('pnBooking', s.bookingConfirmation !== false);
    setToggle('pnDeparture', s.departureReminder !== false);
    if (s.departureReminderMinutes) document.getElementById('pnReminderMin').value = s.departureReminderMinutes;
    setToggle('pnDelay', s.delayAlert !== false);
    setToggle('pnPromo', s.promotionEnabled !== false);
    setToggle('pnKYC', s.kycUpdates !== false);
    setToggle('pnPayment', s.paymentReceipts !== false);
  } catch (e) { console.log('Push settings: using defaults'); }
}

function getPNSettings() {
  return {
    enabled: document.getElementById('pnEnabled').classList.contains('on'),
    provider: document.getElementById('pnProvider').value,
    serverKey: document.getElementById('pnServerKey').value,
    senderId: document.getElementById('pnSenderId').value,
    defaultTitle: document.getElementById('pnTitle').value,
    defaultIcon: document.getElementById('pnIcon').value,
    bookingConfirmation: document.getElementById('pnBooking').classList.contains('on'),
    departureReminder: document.getElementById('pnDeparture').classList.contains('on'),
    departureReminderMinutes: parseInt(document.getElementById('pnReminderMin').value) || 60,
    delayAlert: document.getElementById('pnDelay').classList.contains('on'),
    promotionEnabled: document.getElementById('pnPromo').classList.contains('on'),
    kycUpdates: document.getElementById('pnKYC').classList.contains('on'),
    paymentReceipts: document.getElementById('pnPayment').classList.contains('on'),
  };
}

window.savePNSettings = async function () {
  const settings = getPNSettings();
  try {
    const res = await fetch(PN_API + '/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    const json = await res.json();
    if (json.success) alert('✅ Push notification settings saved!');
    else alert('❌ Error: ' + (json.error || 'Unknown'));
  } catch (e) { alert('❌ Cannot connect to API server.'); }
};

window.resetPNSettings = function () {
  if (!confirm('Reset push notification settings to defaults?')) return;
  setToggle('pnEnabled', false);
  setToggle('pnBooking', true);
  setToggle('pnDeparture', true);
  setToggle('pnDelay', true);
  setToggle('pnPromo', true);
  setToggle('pnKYC', true);
  setToggle('pnPayment', true);
  document.getElementById('pnProvider').value = 'firebase';
  document.getElementById('pnServerKey').value = '';
  document.getElementById('pnSenderId').value = '';
  document.getElementById('pnTitle').value = 'Naija Routes';
  document.getElementById('pnIcon').value = '/icons/logo.png';
  document.getElementById('pnReminderMin').value = '60';
};

window.sendTestPush = async function () {
  const title = document.getElementById('pnTestTitle').value;
  const body = document.getElementById('pnTestBody').value;
  const userGroup = document.getElementById('pnTestTarget').value;
  const resultEl = document.getElementById('pnTestResult');
  resultEl.textContent = 'Sending...';
  try {
    const res = await fetch(PN_API + '/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, userGroup }),
    });
    const json = await res.json();
    if (json.success) resultEl.textContent = `✅ Sent! Target: ${json.data.targetCount || 'all'} device(s)`;
    else resultEl.textContent = '❌ Error: ' + (json.error || 'Unknown');
  } catch (e) {
    resultEl.textContent = '⚠️ API offline — simulated: notification would be sent to ' + userGroup + ' users.';
  }
};

async function loadPNDevices() {
  try {
    const res = await fetch(PN_API + '/stats');
    const json = await res.json();
    if (!json.success) return;
    const s = json.data;
    document.getElementById('pnDeviceStats').innerHTML =
      `📱 <strong>${s.totalDevices}</strong> registered devices` +
      ` — Android: ${s.byPlatform.android}, iOS: ${s.byPlatform.ios}, Web: ${s.byPlatform.web}`;
  } catch (e) {
    document.getElementById('pnDeviceStats').innerHTML = '📱 Device tracking: API offline (demo mode)';
  }
}

document.querySelectorAll('.sb-item[data-view]').forEach(item => {
  item.addEventListener('click', () => {
    const view = item.dataset.view;
    if (view === 'whatsapp') { loadWASettings(); }
    if (view === 'push') { loadPNSettings(); loadPNDevices(); }
    if (view === 'sms') { loadSMSSettings(); }
    if (view === 'email') { loadEmailSettings(); }
    if (view === 'payments') { loadPaymentSettings(); }
    if (view === 'transactions') { loadTransactions(); }
  });
});

const SMS_API = '/api/v1/sms';

window.toggleSMS = function (el) { el.classList.toggle('on'); };

function collectSMSFields() {
  return {
    enabled: document.getElementById('smsEnabled').classList.contains('on'),
    apiKey: document.getElementById('smsApiKey').value,
    senderId: document.getElementById('smsSenderId').value,
    bookingConfirmation: document.getElementById('smsBooking').classList.contains('on'),
    departureReminder: document.getElementById('smsDeparture').classList.contains('on'),
    delayAlert: document.getElementById('smsDelay').classList.contains('on'),
    paymentReceipt: document.getElementById('smsPayment').classList.contains('on'),
    verificationCode: document.getElementById('smsVerify').classList.contains('on'),
  };
}

async function loadSMSSettings() {
  try {
    const res = await fetch(SMS_API + '/settings');
    const json = await res.json();
    if (!json.success) return;
    const s = json.data;
    document.getElementById('smsEnabled').classList.toggle('on', s.enabled);
    document.getElementById('smsApiKey').value = s.apiKey || '';
    document.getElementById('smsSenderId').value = s.senderId || 'N-Routes';
    document.getElementById('smsBooking').classList.toggle('on', s.bookingConfirmation !== false);
    document.getElementById('smsDeparture').classList.toggle('on', s.departureReminder !== false);
    document.getElementById('smsDelay').classList.toggle('on', s.delayAlert !== false);
    document.getElementById('smsPayment').classList.toggle('on', s.paymentReceipt !== false);
    document.getElementById('smsVerify').classList.toggle('on', s.verificationCode !== false);
    document.getElementById('smsStatus').textContent = s.enabled ? '● Connected' : '○ Disabled';
    document.getElementById('smsStatus').style.color = s.enabled ? 'var(--green)' : 'var(--muted)';
  } catch {
    document.getElementById('smsStatus').textContent = '⚠️ Offline';
    document.getElementById('smsStatus').style.color = 'var(--red)';
  }
}

window.saveSMSSettings = async function () {
  const btn = document.querySelector('#view-sms .btn-primary');
  btn.textContent = 'Saving...';
  btn.disabled = true;
  try {
    const res = await fetch(SMS_API + '/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(collectSMSFields()),
    });
    const json = await res.json();
    if (json.success) alert('SMS settings saved!');
    else alert('Error: ' + (json.error || 'Unknown'));
  } catch { alert('Could not save settings (API offline)'); }
  btn.textContent = '💾 Save SMS Settings';
  btn.disabled = false;
};

window.sendTestSMS = async function () {
  const to = document.getElementById('smsTestPhone').value;
  const message = document.getElementById('smsTestMsg').value;
  const resultEl = document.getElementById('smsTestResult');
  if (!to || !message) { resultEl.textContent = '❌ Please enter a phone number and message.'; return; }
  resultEl.textContent = 'Sending...';
  try {
    const res = await fetch(SMS_API + '/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, message }),
    });
    const json = await res.json();
    if (json.success && json.data.sent) resultEl.textContent = '✅ SMS sent!';
    else resultEl.textContent = '❌ ' + (json.data?.reason || json.error || 'Failed');
  } catch { resultEl.textContent = '⚠️ API offline — SMS would be sent to ' + to; }
};

window.checkSMSBalance = async function () {
  const el = document.getElementById('smsBalance');
  el.textContent = 'Checking...';
  try {
    const res = await fetch(SMS_API + '/balance');
    const json = await res.json();
    if (json.success) el.textContent = `₦${json.data.balance || 0}`;
    else el.textContent = 'Error';
  } catch { el.textContent = 'Offline'; }
};

// ── Payment Gateway Settings ──────────────────────
const PAY_API = '/api/v1/payments';

window.togglePaystack = function (el) { el.classList.toggle('on'); };
window.toggleFlutterwave = function (el) { el.classList.toggle('on'); };

function collectPaymentSettings() {
  return {
    paystack: {
      enabled: document.getElementById('psEnabled').classList.contains('on'),
      publicKey: document.getElementById('psPublicKey').value,
      secretKey: document.getElementById('psSecretKey').value,
      webhookSecret: document.getElementById('psWebhookSecret').value,
    },
    flutterwave: {
      enabled: document.getElementById('fwEnabled').classList.contains('on'),
      publicKey: document.getElementById('fwPublicKey').value,
      secretKey: document.getElementById('fwSecretKey').value,
    },
    primaryProvider: document.getElementById('pmtPrimaryProvider').value,
    feePercent: parseFloat(document.getElementById('pmtFeePercent').value) || 1.5,
  };
}

async function loadPaymentSettings() {
  try {
    const res = await fetch(PAY_API + '/settings');
    const json = await res.json();
    if (!json.success) return;
    const s = json.data || {};

    const ps = s.paystack || {};
    document.getElementById('psEnabled').classList.toggle('on', ps.enabled);
    document.getElementById('psPublicKey').value = ps.publicKey || '';
    document.getElementById('psSecretKey').value = ps.secretKey || '';
    document.getElementById('psWebhookSecret').value = ps.webhookSecret || '';
    document.getElementById('psStatus').textContent = ps.enabled ? '● Connected' : '○ Not configured';
    document.getElementById('psStatus').style.color = ps.enabled ? 'var(--green)' : 'var(--muted)';

    const fw = s.flutterwave || {};
    document.getElementById('fwEnabled').classList.toggle('on', fw.enabled);
    document.getElementById('fwPublicKey').value = fw.publicKey || '';
    document.getElementById('fwSecretKey').value = fw.secretKey || '';
    document.getElementById('fwStatus').textContent = fw.enabled ? '● Connected' : '○ Not configured';
    document.getElementById('fwStatus').style.color = fw.enabled ? 'var(--green)' : 'var(--muted)';

    if (s.primaryProvider) document.getElementById('pmtPrimaryProvider').value = s.primaryProvider;
    if (s.feePercent) document.getElementById('pmtFeePercent').value = s.feePercent;
  } catch {
    document.getElementById('psStatus').textContent = '⚠️ Offline';
    document.getElementById('psStatus').style.color = 'var(--red)';
    document.getElementById('fwStatus').textContent = '⚠️ Offline';
    document.getElementById('fwStatus').style.color = 'var(--red)';
  }
}

window.savePaymentSettings = async function () {
  const btn = document.querySelector('#view-payments .btn-primary');
  btn.textContent = 'Saving...';
  btn.disabled = true;
  try {
    const res = await fetch(PAY_API + '/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(collectPaymentSettings()),
    });
    const json = await res.json();
    if (json.success) alert('Payment settings saved!');
    else alert('Error: ' + (json.error || 'Unknown'));
  } catch { alert('Could not save settings (API offline)'); }
  btn.textContent = '💾 Save Payment Settings';
  btn.disabled = false;
};

window.testPaystackConnection = async function () {
  const statusEl = document.getElementById('psStatus');
  statusEl.textContent = 'Testing...';
  statusEl.style.color = 'var(--text)';
  try {
    const res = await fetch(PAY_API + '/test/paystack', { method: 'POST' });
    const json = await res.json();
    if (json.success && json.data.connected) {
      statusEl.textContent = `● Connected (${json.data.balance || 'OK'})`;
      statusEl.style.color = 'var(--green)';
    } else {
      statusEl.textContent = '✕ Failed: ' + (json.data?.error || 'Connection failed');
      statusEl.style.color = 'var(--red)';
    }
  } catch {
    statusEl.textContent = '⚠️ API offline';
    statusEl.style.color = 'var(--red)';
  }
};

window.testFlutterwaveConnection = async function () {
  const statusEl = document.getElementById('fwStatus');
  statusEl.textContent = 'Testing...';
  statusEl.style.color = 'var(--text)';
  try {
    const res = await fetch(PAY_API + '/test/flutterwave', { method: 'POST' });
    const json = await res.json();
    if (json.success && json.data.connected) {
      statusEl.textContent = '● Connected';
      statusEl.style.color = 'var(--green)';
    } else {
      statusEl.textContent = '✕ Failed: ' + (json.data?.error || 'Connection failed');
      statusEl.style.color = 'var(--red)';
    }
  } catch {
    statusEl.textContent = '⚠️ API offline';
    statusEl.style.color = 'var(--red)';
  }
};

window.resetPaymentSettings = function () {
  document.getElementById('psEnabled').classList.remove('on');
  document.getElementById('psPublicKey').value = '';
  document.getElementById('psSecretKey').value = '';
  document.getElementById('psWebhookSecret').value = '';
  document.getElementById('fwEnabled').classList.remove('on');
  document.getElementById('fwPublicKey').value = '';
  document.getElementById('fwSecretKey').value = '';
  document.getElementById('pmtPrimaryProvider').value = 'paystack';
  document.getElementById('pmtFeePercent').value = '1.5';
};

// ── Email (Resend) Settings ──────────────────────
const EMAIL_API = '/api/v1/email';

window.toggleEmail = function (el) { el.classList.toggle('on'); };

function collectEmailSettings() {
  return {
    enabled: document.getElementById('emEnabled').classList.contains('on'),
    apiKey: document.getElementById('emApiKey').value,
    fromEmail: document.getElementById('emFromEmail').value,
    fromName: document.getElementById('emFromName').value,
    bookingConfirmation: document.getElementById('emBooking').classList.contains('on'),
    paymentReceipt: document.getElementById('emPayment').classList.contains('on'),
    departureReminder: document.getElementById('emDeparture').classList.contains('on'),
    kycUpdates: document.getElementById('emKYC').classList.contains('on'),
    otpEnabled: document.getElementById('emOTP').classList.contains('on'),
  };
}

async function loadEmailSettings() {
  try {
    const res = await fetch(EMAIL_API + '/settings');
    const json = await res.json();
    if (!json.success) return;
    const s = json.data || {};
    document.getElementById('emEnabled').classList.toggle('on', s.enabled);
    document.getElementById('emApiKey').value = s.apiKey || '';
    document.getElementById('emFromEmail').value = s.fromEmail || 'noreply@naijaroutes.com';
    document.getElementById('emFromName').value = s.fromName || 'Naija Routes';
    document.getElementById('emBooking').classList.toggle('on', s.bookingConfirmation !== false);
    document.getElementById('emPayment').classList.toggle('on', s.paymentReceipt !== false);
    document.getElementById('emDeparture').classList.toggle('on', s.departureReminder !== false);
    document.getElementById('emKYC').classList.toggle('on', s.kycUpdates !== false);
    document.getElementById('emOTP').classList.toggle('on', s.otpEnabled !== false);
    document.getElementById('emStatus').textContent = s.enabled ? '● Connected' : '○ Not configured';
    document.getElementById('emStatus').style.color = s.enabled ? 'var(--green)' : 'var(--muted)';
  } catch {
    document.getElementById('emStatus').textContent = '⚠️ Offline';
    document.getElementById('emStatus').style.color = 'var(--red)';
  }
}

window.saveEmailSettings = async function () {
  const btn = document.querySelector('#view-email .btn-primary');
  btn.textContent = 'Saving...';
  btn.disabled = true;
  try {
    const res = await fetch(EMAIL_API + '/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(collectEmailSettings()),
    });
    const json = await res.json();
    if (json.success) alert('Email settings saved!');
    else alert('Error: ' + (json.error || 'Unknown'));
  } catch { alert('Could not save settings (API offline)'); }
  btn.textContent = '💾 Save Email Settings';
  btn.disabled = false;
};

window.sendTestEmail = async function () {
  const to = document.getElementById('emTestTo').value;
  const resultEl = document.getElementById('emTestResult');
  if (!to) { resultEl.textContent = '❌ Please enter a recipient email.'; return; }
  resultEl.textContent = 'Sending...';
  try {
    const res = await fetch(EMAIL_API + '/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to }),
    });
    const json = await res.json();
    if (json.success && json.data.sent) resultEl.textContent = '✅ Test email sent!';
    else resultEl.textContent = '❌ ' + (json.data?.error?.message || json.error || 'Failed');
  } catch { resultEl.textContent = '⚠️ API offline'; }
};

window.testEmailConnection = async function () {
  const el = document.getElementById('emStatus');
  el.textContent = 'Testing...';
  el.style.color = 'var(--text)';
  try {
    const res = await fetch(EMAIL_API + '/test/connection');
    const json = await res.json();
    if (json.success && json.data.connected) {
      el.textContent = '● Connected';
      el.style.color = 'var(--green)';
    } else {
      el.textContent = '✕ ' + (json.data?.error || 'Connection failed');
      el.style.color = 'var(--red)';
    }
  } catch {
    el.textContent = '⚠️ Offline';
    el.style.color = 'var(--red)';
  }
};

window.resetEmailSettings = function () {
  document.getElementById('emEnabled').classList.remove('on');
  document.getElementById('emApiKey').value = '';
  document.getElementById('emFromEmail').value = 'noreply@naijaroutes.com';
  document.getElementById('emFromName').value = 'Naija Routes';
  document.getElementById('emBooking').classList.add('on');
  document.getElementById('emPayment').classList.add('on');
  document.getElementById('emDeparture').classList.add('on');
  document.getElementById('emKYC').classList.add('on');
  document.getElementById('emOTP').classList.add('on');
};
