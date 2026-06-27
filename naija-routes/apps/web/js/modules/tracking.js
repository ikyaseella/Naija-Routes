const API_BASE = '/api/v1/tracking';
const WS_URL = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`;

let map = null;
let marker = null;
let refreshInterval = null;
let socket = null;

function connectSocket(vehicleId) {
  if (socket?.connected) socket.disconnect();
  socket = io(WS_URL, { transports: ['websocket', 'polling'] });
  socket.on('connect', () => {
    socket.emit('track:subscribe', vehicleId);
  });
  socket.on('track:update', (data) => {
    updateUI(data);
    updateMap(data.lat, data.lng, data.status, data.plate);
  });
  socket.on('disconnect', () => {
    startPolling(vehicleId);
  });
}

function startPolling(vehicleId) {
  if (refreshInterval) clearInterval(refreshInterval);
  fetchVehicle(vehicleId);
  refreshInterval = setInterval(() => fetchVehicle(vehicleId), 10000);
}

export async function lookupVehicle() {
  const input = document.getElementById('lookupInput').value.trim();
  if (!input) return;

  document.getElementById('emptyState').style.display = 'none';
  document.getElementById('trackingContent').style.display = 'block';
  document.getElementById('loadSpinner').style.display = 'block';
  document.getElementById('shareLink').value = `${window.location.origin}/tracking.html?vehicle=${encodeURIComponent(input)}`;

  if (refreshInterval) clearInterval(refreshInterval);
  if (socket?.connected) socket.disconnect();

  try {
    const res = await fetch(`${API_BASE}/vehicle/${input}`);
    const json = await res.json();
    if (json.success) {
      document.getElementById('loadSpinner').style.display = 'none';
      updateUI(json.data);
      updateMap(json.data.lat, json.data.lng, json.data.status, json.data.plate);

      if (typeof io !== 'undefined') {
        connectSocket(input);
      } else {
        startPolling(input);
      }
    } else {
      document.getElementById('loadSpinner').style.display = 'none';
      alert('Vehicle not found. Please check the plate number or booking reference.');
    }
  } catch {
    document.getElementById('loadSpinner').style.display = 'none';
    alert('Could not connect to tracking service');
  }
}

async function fetchVehicle(vehicleId) {
  try {
    const res = await fetch(`${API_BASE}/vehicle/${vehicleId}`);
    const json = await res.json();
    if (json.success) updateUI(json.data);
  } catch { /* keep last known */ }
}

function updateUI(v) {
  document.getElementById('vSpeed').textContent = v.speedKmh;
  const statusEl = document.getElementById('vStatus');
  statusEl.textContent = v.status?.charAt(0).toUpperCase() + v.status?.slice(1) || '—';
  statusEl.className = 'val';
  document.getElementById('vDriver').textContent = v.driver || '—';
  document.getElementById('vRoute').textContent = v.route?.join(' → ') || '—';
}

function updateMap(lat, lng, status, plate) {
  if (!map) {
    map = L.map('trackingMap').setView([lat, lng], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);
  }
  const iconColor = status === 'moving' ? '#22C55E' : status === 'stopped' ? '#F59E0B' : '#EF4444';
  const icon = L.divIcon({
    html: `<div style="width:28px;height:28px;background:${iconColor};border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
    iconSize: [28, 28], iconAnchor: [14, 14], className: '',
  });
  if (marker) {
    marker.setLatLng([lat, lng]);
    marker.setIcon(icon);
  } else {
    marker = L.marker([lat, lng], { icon }).addTo(map);
    marker.bindPopup(`<b>${plate || ''}</b><br>Status: ${status}`);
  }
  map.setView([lat, lng], map.getZoom());
}

const urlVehicle = new URLSearchParams(window.location.search).get('vehicle');
if (urlVehicle) {
  document.getElementById('lookupInput').value = urlVehicle;
  document.getElementById('emptyState').style.display = 'none';
  document.getElementById('trackingContent').style.display = 'block';
  lookupVehicle();
}

window.lookupVehicle = lookupVehicle;
