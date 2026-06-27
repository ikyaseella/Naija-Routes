import { apiClient } from '../core/api.js';

document.addEventListener('DOMContentLoaded', () => {
  const wDate = document.getElementById('wDate');
  if (wDate) {
    wDate.valueAsDate = new Date(Date.now() + 86400000);
  }
});

window.switchCargoTab = function (tab) {
  document.querySelectorAll('.cargo-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.cargo-panel').forEach(p => p.classList.remove('active'));
  if (tab === 'book') {
    document.querySelectorAll('.cargo-tab')[0].classList.add('active');
    document.getElementById('panel-book').classList.add('active');
  } else {
    document.querySelectorAll('.cargo-tab')[1].classList.add('active');
    document.getElementById('panel-track').classList.add('active');
  }
};

window.bookCargo = async function () {
  const payload = {
    shipperId: 'usr-web-' + Date.now(),
    shipperName: 'Web User',
    shipperPhone: '08000000000',
    operatorId: document.getElementById('wOperator').value,
    origin: document.getElementById('wOrigin').value,
    destination: document.getElementById('wDestination').value,
    travelDate: document.getElementById('wDate').value,
    weightKg: parseFloat(document.getElementById('wWeight').value),
    description: document.getElementById('wDescription').value,
    recipientName: document.getElementById('wRecipientName').value,
    recipientPhone: document.getElementById('wRecipientPhone').value,
  };
  try {
    const res = await fetch('http://localhost:3000/api/v1/cargo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!json.success) { alert(json.error || 'Failed'); return; }
    const d = json.data;
    document.getElementById('bookWaybill').textContent = d.waybillNo;
    document.getElementById('bookDetails').innerHTML = `
      <div class="row"><span class="lbl">Route</span><span class="val">${d.origin} → ${d.destination}</span></div>
      <div class="row"><span class="lbl">Weight</span><span class="val">${d.weightKg} kg</span></div>
      <div class="row"><span class="lbl">Date</span><span class="val">${d.travelDate}</span></div>
      <div class="row"><span class="lbl">Price</span><span class="val" style="color:var(--color-gold);">₦${(d.priceKobo / 100).toLocaleString()}</span></div>
      <div class="row"><span class="lbl">Recipient</span><span class="val">${d.recipientName}</span></div>
    `;
    document.getElementById('bookResult').style.display = 'block';
  } catch { alert('Backend must be running on port 3000'); }
};

window.trackWaybill = async function () {
  const wb = document.getElementById('trackWaybill').value.trim();
  if (!wb) { alert('Enter a waybill number'); return; }
  try {
    const res = await fetch(`http://localhost:3000/api/v1/cargo/waybill/${wb}`);
    const json = await res.json();
    if (!json.success) { alert('Waybill not found'); return; }
    const d = json.data;
    document.getElementById('trackWaybillDisplay').textContent = d.waybillNo;
    document.getElementById('trackDetails').innerHTML = `
      <div class="row"><span class="lbl">Route</span><span class="val">${d.origin} → ${d.destination}</span></div>
      <div class="row"><span class="lbl">Shipper</span><span class="val">${d.shipperName}</span></div>
      <div class="row"><span class="lbl">Recipient</span><span class="val">${d.recipientName} (${d.recipientPhone})</span></div>
      <div class="row"><span class="lbl">Status</span><span class="val"><span class="status-badge ${d.status}">${d.status.replace('_', ' ')}</span></span></div>
      <div class="row"><span class="lbl">Date</span><span class="val">${d.travelDate}</span></div>
      <div class="row"><span class="lbl">Operator</span><span class="val">${d.operatorName}</span></div>
    `;
    document.getElementById('trackResult').style.display = 'block';
  } catch { alert('Backend must be running on port 3000'); }
};
