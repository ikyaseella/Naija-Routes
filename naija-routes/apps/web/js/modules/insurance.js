import { apiClient } from '../core/api.js';

const USER_ID = 'usr-emeka';
let selectedProvider = null;

window.switchInsTab = function (name) {
  document.querySelectorAll('.ins-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.ins-panel').forEach(p => p.classList.remove('active'));
  document.querySelector(`.ins-tab[data-tab="${name}"]`).classList.add('active');
  document.getElementById(`panel-${name}`).classList.add('active');
  if (name === 'plans') loadPlans();
  if (name === 'purchases') loadPurchases();
  if (name === 'claims') loadClaims();
  if (name === 'file') loadClaimForm();
};

async function loadPlans() {
  const provEl = document.getElementById('providerList');
  const planEl = document.getElementById('planList');
  try {
    const res = await fetch('http://localhost:3000/api/v1/insurance/providers');
    const json = await res.json();
    const providers = json.data || [];
    provEl.innerHTML = providers.map(p => `
      <div class="ins-provider-card ${selectedProvider === p.id ? 'selected' : ''}" onclick="window.selectProvider('${p.id}')">
        <div class="ins-provider-name">${p.name}</div>
        <div class="ins-provider-rating">★ ${p.rating} · ${p.plans.length} plans</div>
        <div class="ins-provider-desc">${p.description}</div>
        <div style="font-size:var(--text-xs);color:var(--color-slate-400);margin-top:var(--space-2);">📞 ${p.contactPhone}</div>
      </div>
    `).join('');
    if (!selectedProvider && providers.length) selectedProvider = providers[0].id;
    renderPlans(providers);
  } catch (e) { provEl.innerHTML = '<p style="color:var(--color-red);">Failed to load providers.</p>'; }
}

window.selectProvider = function (id) {
  selectedProvider = id;
  document.querySelectorAll('.ins-provider-card').forEach(c => c.classList.remove('selected'));
  const card = document.querySelector(`.ins-provider-card[onclick*="${id}"]`);
  if (card) card.classList.add('selected');
  loadPlans();
};

function renderPlans(providers) {
  const el = document.getElementById('planList');
  const allPlans = providers.flatMap(p => (p.plans || []).map(pl => ({ ...pl, providerName: p.name })));
  if (!allPlans.length) { el.innerHTML = '<p style="color:var(--color-slate-400);">No plans available.</p>'; return; }
  el.innerHTML = allPlans.map(pl => `
    <div class="ins-plan-card" onclick="window.purchasePlan('${pl.id}')">
      <div class="ins-plan-name">${pl.providerName} — ${pl.name}</div>
      <div class="ins-plan-price">₦${(pl.priceKobo / 100).toLocaleString()}</div>
      <ul class="ins-plan-coverage">${pl.coverage.map(c => `<li>${c}</li>`).join('')}</ul>
      <div style="font-size:var(--text-xs);color:var(--color-slate-400);margin-top:var(--space-3);">Max payout: ₦${(pl.maxPayoutKobo / 100).toLocaleString()}</div>
    </div>
  `).join('');
}

window.purchasePlan = async function (planId) {
  if (!confirm('Purchase this insurance plan?')) return;
  try {
    const res = await fetch('http://localhost:3000/api/v1/insurance/purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: USER_ID, bookingId: `bk-${Date.now()}`, planId, passengerName: 'Emeka Okonkwo', travelDate: new Date().toISOString().split('T')[0], route: 'Lagos → Abuja' }),
    });
    const json = await res.json();
    if (json.success) {
      const successEl = document.getElementById('insSuccess');
      successEl.textContent = `Policy purchased! Ref: ${json.data.id}`;
      successEl.style.display = 'block';
      setTimeout(() => successEl.style.display = 'none', 5000);
      loadPurchases();
    } else { showInsError(json.error); }
  } catch (e) { showInsError('Purchase failed.'); }
};

async function loadPurchases() {
  const el = document.getElementById('purchasesList');
  try {
    const res = await fetch(`http://localhost:3000/api/v1/insurance/purchases?userId=${USER_ID}`);
    const json = await res.json();
    const purchases = json.data || [];
    if (!purchases.length) { el.innerHTML = '<div style="padding:var(--space-8);text-align:center;color:var(--color-slate-400);">No insurance policies purchased yet.</div>'; return; }
    el.innerHTML = '<div class="ins-purchases">' + purchases.map(p => `
      <div class="ins-item">
        <div><strong>${p.plan?.providerName || p.providerId}</strong> — ${p.plan?.name || p.planId}<br><span style="color:var(--color-slate-400);font-size:var(--text-xs);">${p.route} · ${p.travelDate} · Ref: ${p.id}</span></div>
        <div style="font-weight:var(--weight-bold);">₦${(p.priceKobo / 100).toLocaleString()}</div>
        <div><span class="ins-badge ins-badge-active">${p.status}</span></div>
      </div>
    `).join('') + '</div>';
  } catch (e) { el.innerHTML = '<p style="color:var(--color-red);">Failed to load.</p>'; }
}

async function loadClaims() {
  const el = document.getElementById('claimsList');
  try {
    const res = await fetch(`http://localhost:3000/api/v1/insurance/claims?userId=${USER_ID}`);
    const json = await res.json();
    const claims = json.data || [];
    if (!claims.length) { el.innerHTML = '<div style="padding:var(--space-8);text-align:center;color:var(--color-slate-400);">No claims filed yet.</div>'; return; }
    el.innerHTML = '<div class="ins-claims">' + claims.map(c => {
      const badgeClass = c.status === 'approved' ? 'ins-badge-approved' : c.status === 'rejected' ? 'ins-badge-rejected' : 'ins-badge-pending';
      return `<div class="ins-item">
        <div><strong>${c.type.replace(/_/g, ' ')}</strong><br><span style="color:var(--color-slate-400);font-size:var(--text-xs);">${c.description?.substring(0, 60)}... · ${c.filedAt?.split('T')[0]}</span></div>
        <div style="font-weight:var(--weight-bold);">₦${(c.amountKobo / 100).toLocaleString()}</div>
        <div><span class="ins-badge ${badgeClass}">${c.status}</span></div>
      </div>`;
    }).join('') + '</div>';
  } catch (e) { el.innerHTML = '<p style="color:var(--color-red);">Failed to load.</p>'; }
}

async function loadClaimForm() {
  const sel = document.getElementById('claimPurchase');
  sel.innerHTML = '<option value="">Loading...</option>';
  try {
    const res = await fetch(`http://localhost:3000/api/v1/insurance/purchases?userId=${USER_ID}`);
    const json = await res.json();
    const purchases = json.data || [];
    sel.innerHTML = '<option value="">Select policy</option>' + purchases.map(p => `<option value="${p.id}">${p.id} — ${p.plan?.providerName || p.providerId} (${p.route})</option>`).join('');
  } catch (e) { sel.innerHTML = '<option value="">No policies found</option>'; }
}

window.submitClaim = async function (e) {
  e.preventDefault();
  const body = {
    purchaseId: document.getElementById('claimPurchase').value,
    userId: USER_ID,
    type: document.getElementById('claimType').value,
    description: document.getElementById('claimDesc').value,
    amountKobo: parseInt(document.getElementById('claimAmount').value) * 100,
  };
  try {
    const res = await fetch('http://localhost:3000/api/v1/insurance/claims', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    const json = await res.json();
    if (json.success) {
      const successEl = document.getElementById('insSuccess');
      successEl.textContent = `Claim filed! Ref: ${json.data.id}`;
      successEl.style.display = 'block';
      document.getElementById('claimForm').reset();
      setTimeout(() => successEl.style.display = 'none', 5000);
    } else { showInsError(json.error); }
  } catch (e) { showInsError('Failed to file claim.'); }
};

function showInsError(msg) {
  const el = document.getElementById('insError');
  el.textContent = msg; el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 5000);
}

document.addEventListener('DOMContentLoaded', () => {
  loadPlans();
});
