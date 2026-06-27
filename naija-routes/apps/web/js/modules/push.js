const VAPID_PUBLIC_KEY = 'BEl62iJRbm8Gp9w0iRZq0G9xJQ0m0Lq5F0y0Z0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0Q0';
const API_BASE = '/api/v1/notifications';
const SW_PATH = '/sw.js';

let swRegistration = null;

export async function initPush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return { supported: false, reason: 'Not supported' };
  }
  try {
    swRegistration = await navigator.serviceWorker.register(SW_PATH, { scope: '/' });
    await updateUIState();
    return { supported: true };
  } catch (err) {
    console.error('SW registration failed:', err);
    return { supported: false, reason: err.message };
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export async function subscribe() {
  if (!swRegistration) return { success: false, reason: 'Service worker not ready' };
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return { success: false, reason: 'Permission denied' };

    const subscription = await swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    const payload = {
      userId: localStorage.getItem('userId') || 'anonymous',
      token: JSON.stringify(subscription),
      platform: 'web',
      deviceName: navigator.userAgent,
    };

    const res = await fetch(`${API_BASE}/devices/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('pushSubscribed', 'true');
      await updateUIState();
      return { success: true };
    }
    return { success: false, reason: 'Server registration failed' };
  } catch (err) {
    return { success: false, reason: err.message };
  }
}

export async function unsubscribe() {
  try {
    const subscription = await swRegistration?.pushManager?.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      const token = JSON.stringify(subscription);
      await fetch(`${API_BASE}/devices/unregister`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
    }
    localStorage.setItem('pushSubscribed', 'false');
    await updateUIState();
    return { success: true };
  } catch (err) {
    return { success: false, reason: err.message };
  }
}

export async function getLogs(limit = 20) {
  try {
    const res = await fetch(`${API_BASE}/logs?limit=${limit}`);
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

async function updateUIState() {
  const btn = document.getElementById('pushToggle');
  const statusEl = document.getElementById('pushStatus');
  if (!btn || !statusEl) return;
  const sub = await swRegistration?.pushManager?.getSubscription();
  const subscribed = !!sub;
  btn.textContent = subscribed ? 'Disable Notifications' : 'Enable Notifications';
  btn.className = subscribed ? 'btn btn-danger' : 'btn btn-primary';
  statusEl.textContent = subscribed ? 'Notifications are enabled' : 'Notifications are disabled';
  statusEl.style.color = subscribed ? 'var(--color-success)' : 'var(--color-slate-500)';
}

window.initPush = initPush;
window.subscribe = subscribe;
window.unsubscribe = unsubscribe;
window.getLogs = getLogs;
