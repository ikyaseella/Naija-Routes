// =============================================================
// NAIJA ROUTES — Frontend Auth Helper
// File: shared/web/js/auth.js
// Status: COMMENTED OUT — activate in Phase 1
// Usage: Import into apps/web, apps/agent, apps/operator
// =============================================================

/*
const TOKEN_KEY    = 'naija_access_token';
const REFRESH_KEY  = 'naija_refresh_token';
const USER_KEY     = 'naija_user';

export const Auth = {

  setSession(user, accessToken, refreshToken) {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getToken()   { return localStorage.getItem(TOKEN_KEY); },
  getUser()    { const u = localStorage.getItem(USER_KEY); return u ? JSON.parse(u) : null; },
  isLoggedIn() { return !!localStorage.getItem(TOKEN_KEY); },
  hasRole(r)   { const u = this.getUser(); return u ? u.role === r : false; },

  clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  },

  async fetchWithAuth(url, options = {}) {
    const token = this.getToken();
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });
  },

  async sendOTP(phone) {
    const res = await fetch('/api/v1/auth/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    return res.json();
  },

  async verifyOTP(phone, otpCode) {
    const res = await fetch('/api/v1/auth/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, token: otpCode }),
    });
    const data = await res.json();
    if (data.success) {
      this.setSession(data.user, data.session.access_token, data.session.refresh_token);
    }
    return data;
  },

  async logout() {
    await this.fetchWithAuth('/api/v1/auth/logout', { method: 'POST' });
    this.clearSession();
    window.location.href = '/';
  },
};
*/

// PLACEHOLDER — safe no-op implementation until Phase 1
export const Auth = {
  isLoggedIn:    () => false,
  getUser:       () => null,
  getToken:      () => null,
  hasRole:       () => false,
  clearSession:  () => {},
  fetchWithAuth: (url, opts) => fetch(url, opts),
  sendOTP:       async () => ({ success: false, message: 'Auth not yet activated' }),
  verifyOTP:     async () => ({ success: false, message: 'Auth not yet activated' }),
  logout:        async () => {},
};
