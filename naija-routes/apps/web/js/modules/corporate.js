import { apiClient } from '../core/api.js';

const CORP_ID = 'corp-001';
let corpData = null;

function showError(msg) {
  const el = document.getElementById('corpError');
  el.textContent = msg; el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 5000);
}

function showSuccess(msg) {
  const el = document.getElementById('corpSuccess');
  el.textContent = msg; el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 5000);
}

window.switchCorpTab = function (name) {
  document.querySelectorAll('.corp-tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.corp-tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.corp-tab-btn[data-tab="${name}"]`).classList.add('active');
  document.getElementById(`tab-${name}`).classList.add('active');
  if (name === 'book' && corpData) populateBookForm();
  if (name === 'bookings' && corpData) renderBookings();
  if (name === 'employees' && corpData) renderEmployees();
  if (name === 'invoices' && corpData) renderInvoices();
  if (name === 'policy' && corpData) renderPolicy();
};

async function loadDashboard() {
  try {
    const res = await fetch(`http://localhost:3000/api/v1/corporate/${CORP_ID}/dashboard`);
    const json = await res.json();
    if (!json.success) { showError('Failed to load dashboard'); return; }
    corpData = json.data;

    const corp = corpData.corporate;
    document.getElementById('corpName').textContent = corp.name;
    document.getElementById('corpBadge').textContent = corp.status === 'active' ? '● Active' : 'Inactive';
    document.getElementById('corpWelcomeSub').textContent = `${corp.employeeCount} employees · ${corp.departments.length} departments`;

    const s = corpData.summary;
    document.getElementById('metricBookings').textContent = s.totalBookings;
    document.getElementById('metricActive').textContent = s.activeBookings;
    document.getElementById('metricPending').textContent = s.pendingApprovals;
    document.getElementById('metricSpend').textContent = '₦' + (s.monthlySpendKobo / 100).toLocaleString();
    document.getElementById('budgetUsed').textContent = s.budgetUsedPercent + '%';
    document.getElementById('budgetBar').style.width = Math.min(s.budgetUsedPercent, 100) + '%';
    if (s.budgetUsedPercent > 80) document.getElementById('budgetBar').style.background = s.budgetUsedPercent > 95 ? 'var(--color-red)' : 'var(--color-gold)';

    renderRecentBookings();
  } catch (e) { showError('Cannot connect to server. Make sure the API is running on port 3000.'); }
}

function renderRecentBookings() {
  const el = document.getElementById('recentBookings');
  if (!corpData.recentBookings || corpData.recentBookings.length === 0) { el.innerHTML = '<p style="color:var(--color-slate-400);">No bookings yet.</p>'; return; }
  let html = '<table class="corp-table"><thead><tr><th>Ref</th><th>Route</th><th>Date</th><th>Seats</th><th>Amount</th><th>Status</th></tr></thead><tbody>';
  corpData.recentBookings.forEach(b => {
    const statusClass = b.status === 'booked' || b.status === 'approved' ? 'corp-status-booked' : b.status === 'pending_approval' ? 'corp-status-pending' : 'corp-status-cancelled';
    html += `<tr><td>${b.id}</td><td>${b.route}</td><td>${b.travelDate}</td><td>${b.seats.join(', ')}</td><td>₦${(b.totalKobo / 100).toLocaleString()}</td><td><span class="corp-status ${statusClass}">${b.status}</span></td></tr>`;
  });
  html += '</tbody></table>';
  el.innerHTML = html;
}

async function populateBookForm() {
  const deptSelect = document.getElementById('bookDept');
  const empSelect = document.getElementById('bookEmployee');
  const dateInput = document.getElementById('bookDate');
  dateInput.value = new Date().toISOString().split('T')[0];

  if (deptSelect.options.length > 1) return;
  try {
    const [deptRes, empRes, polRes] = await Promise.all([
      fetch(`http://localhost:3000/api/v1/corporate/${CORP_ID}/departments`),
      fetch(`http://localhost:3000/api/v1/corporate/${CORP_ID}/employees`),
      fetch(`http://localhost:3000/api/v1/corporate/${CORP_ID}/policy`),
    ]);
    const depts = (await deptRes.json()).data || [];
    const emps = (await empRes.json()).data || [];
    const policy = (await polRes.json()).data || null;

    depts.forEach(d => { const o = document.createElement('option'); o.value = d.id; o.textContent = d.name; deptSelect.appendChild(o); });
    emps.forEach(e => { const o = document.createElement('option'); o.value = e.id; o.textContent = `${e.name} (${e.departmentId})`; empSelect.appendChild(o); });

    if (policy) {
      const warn = document.getElementById('bookPolicyWarning');
      warn.innerHTML = `<strong>Policy:</strong> Max ₦${(policy.maxPricePerBookingKobo / 100).toLocaleString()} per booking · Approval needed above ₦${(policy.requiresApprovalAboveKobo / 100).toLocaleString()} · Routes: ${policy.allowedRoutes.join(', ')}`;
      warn.style.display = 'block';
    }
  } catch (e) { /* silent */ }
}

window.submitBulkBook = async function (e) {
  e.preventDefault();
  const seats = parseInt(document.getElementById('bookSeats').value);
  const passengerText = document.getElementById('bookPassengers').value.trim();
  const passengerNames = passengerText ? passengerText.split('\n').map(s => s.trim()).filter(Boolean) : [];

  const body = {
    departmentId: document.getElementById('bookDept').value,
    employeeId: document.getElementById('bookEmployee').value,
    scheduleId: document.getElementById('bookSchedule').value,
    route: document.getElementById('bookRoute').value,
    operator: document.getElementById('bookOperator').value,
    travelDate: document.getElementById('bookDate').value,
    seats: Array.from({ length: seats }, (_, i) => `${String.fromCharCode(65 + (i % 4))}${Math.floor(i / 4) + 1}`),
    passengerNames,
  };

  try {
    const res = await fetch(`http://localhost:3000/api/v1/corporate/${CORP_ID}/bookings`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    const json = await res.json();
    if (json.success) {
      showSuccess(`Booking ${json.data.id} created! Status: ${json.data.status}`);
      document.getElementById('bulkBookForm').reset();
      corpData = null; loadDashboard();
    } else { showError(json.error); }
  } catch (e) { showError('Failed to submit booking.'); }
};

async function renderBookings() {
  const el = document.getElementById('bookingsList');
  try {
    const res = await fetch(`http://localhost:3000/api/v1/corporate/${CORP_ID}/bookings`);
    const json = await res.json();
    const bookings = json.data || [];
    if (bookings.length === 0) { el.innerHTML = '<p style="color:var(--color-slate-400);">No bookings found.</p>'; return; }
    let html = '<table class="corp-table"><thead><tr><th>Ref</th><th>Route</th><th>Operator</th><th>Date</th><th>Seats</th><th>Amount</th><th>Status</th><th></th></tr></thead><tbody>';
    bookings.forEach(b => {
      const sClass = b.status === 'booked' || b.status === 'approved' ? 'corp-status-booked' : b.status === 'pending_approval' ? 'corp-status-pending' : 'corp-status-cancelled';
      const canCancel = b.status !== 'cancelled';
      const canApprove = b.status === 'pending_approval';
      html += `<tr><td>${b.id}</td><td>${b.route}</td><td>${b.operator}</td><td>${b.travelDate}</td><td>${b.seats.join(', ')}</td><td>₦${(b.totalKobo / 100).toLocaleString()}</td><td><span class="corp-status ${sClass}">${b.status}</span></td><td>`;
      if (canApprove) html += `<button class="btn btn-sm btn-primary" onclick="window.approveBook('${b.id}')" style="font-size:11px;padding:4px 10px;">Approve</button> `;
      if (canCancel) html += `<button class="btn btn-sm" onclick="window.cancelBook('${b.id}')" style="font-size:11px;padding:4px 10px;background:transparent;border:1px solid var(--color-red);color:var(--color-red);">Cancel</button>`;
      html += `</td></tr>`;
    });
    html += '</tbody></table>';
    el.innerHTML = html;
  } catch (e) { el.innerHTML = '<p style="color:var(--color-red);">Failed to load bookings.</p>'; }
}

window.approveBook = async function (id) {
  try {
    const res = await fetch(`http://localhost:3000/api/v1/corporate/bookings/${id}/approve`, { method: 'PATCH' });
    const json = await res.json();
    if (json.success) { showSuccess('Booking approved!'); renderBookings(); } else { showError(json.error); }
  } catch (e) { showError('Failed to approve.'); }
};

window.cancelBook = async function (id) {
  try {
    const res = await fetch(`http://localhost:3000/api/v1/corporate/bookings/${id}/cancel`, { method: 'PATCH' });
    const json = await res.json();
    if (json.success) { showSuccess('Booking cancelled.'); renderBookings(); } else { showError(json.error); }
  } catch (e) { showError('Failed to cancel.'); }
};

async function renderEmployees() {
  const el = document.getElementById('employeesList');
  try {
    const res = await fetch(`http://localhost:3000/api/v1/corporate/${CORP_ID}/employees`);
    const json = await res.json();
    const emps = json.data || [];
    if (emps.length === 0) { el.innerHTML = '<p style="color:var(--color-slate-400);">No employees configured.</p>'; return; }
    let html = '<table class="corp-table"><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th></tr></thead><tbody>';
    emps.forEach(e => { html += `<tr><td>${e.name}</td><td>${e.email}</td><td>${e.phone}</td><td>${e.role === 'travel_admin' ? 'Travel Admin' : 'Traveller'}</td></tr>`; });
    html += '</tbody></table>';
    el.innerHTML = html;
  } catch (e) { el.innerHTML = '<p style="color:var(--color-red);">Failed to load employees.</p>'; }
}

async function renderInvoices() {
  const el = document.getElementById('invoicesList');
  try {
    const res = await fetch(`http://localhost:3000/api/v1/corporate/${CORP_ID}/invoices`);
    const json = await res.json();
    const invoices = json.data || [];
    if (invoices.length === 0) { el.innerHTML = '<p style="color:var(--color-slate-400);">No invoices yet.</p>'; return; }
    let html = '';
    invoices.forEach(inv => {
      const statusColor = inv.status === 'paid' ? 'corp-invoice-paid' : inv.status === 'overdue' ? 'corp-invoice-overdue' : 'corp-invoice-due';
      html += `<div class="corp-invoice"><div class="corp-invoice-header"><div><strong>${inv.month}</strong> · <span class="${statusColor}">${inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}</span></div><div class="corp-invoice-total ${statusColor}">₦${(inv.totalKobo / 100).toLocaleString()}</div></div>`;
      if (inv.lineItems && inv.lineItems.length) {
        html += '<table class="corp-table" style="margin-bottom:var(--space-3);"><thead><tr><th>Date</th><th>Description</th><th>Amount</th></tr></thead><tbody>';
        inv.lineItems.forEach(item => { html += `<tr><td>${item.date}</td><td>${item.description}</td><td>₦${(item.amountKobo / 100).toLocaleString()}</td></tr>`; });
        html += '</tbody></table>';
      }
      html += `<div style="font-size:var(--text-xs);color:var(--color-slate-500);">Due: ${inv.dueDate} · Paid: ₦${(inv.paidKobo / 100).toLocaleString()} · Outstanding: ₦${(inv.dueKobo / 100).toLocaleString()}</div></div>`;
    });
    el.innerHTML = html;
  } catch (e) { el.innerHTML = '<p style="color:var(--color-red);">Failed to load invoices.</p>'; }
}

async function renderPolicy() {
  const el = document.getElementById('policyDisplay');
  try {
    const res = await fetch(`http://localhost:3000/api/v1/corporate/${CORP_ID}/policy`);
    const json = await res.json();
    const p = json.data;
    if (!p) { el.innerHTML = '<p style="color:var(--color-slate-400);">No travel policy configured.</p>'; return; }
    el.innerHTML = `
      <div class="corp-policy-card"><h4>${p.name}</h4>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-2);font-size:var(--text-sm);">
          <div><strong>Max per booking:</strong> ₦${(p.maxPricePerBookingKobo / 100).toLocaleString()}</div>
          <div><strong>Approval needed above:</strong> ₦${(p.requiresApprovalAboveKobo / 100).toLocaleString()}</div>
          <div><strong>Booking window:</strong> ${p.bookingWindowDays} days</div>
          <div><strong>Same-day booking:</strong> ${p.sameDayBooking ? 'Allowed' : 'Not allowed'}</div>
        </div>
        <div style="margin-top:var(--space-3);"><strong>Allowed Routes:</strong><br>${p.allowedRoutes.map(r => `<span class="tag">${r}</span>`).join(' ')}</div>
        <div style="margin-top:var(--space-2);"><strong>Preferred Operators:</strong><br>${p.allowedOperators.map(o => `<span class="tag">${o}</span>`).join(' ')}</div>
      </div>`;
  } catch (e) { el.innerHTML = '<p style="color:var(--color-red);">Failed to load policy.</p>'; }
}

loadDashboard();
