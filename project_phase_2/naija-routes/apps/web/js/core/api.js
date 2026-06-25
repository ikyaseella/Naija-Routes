/**
 * Naija Routes — Core API Client
 * ─────────────────────────────────────────
 * A wrapper around the native fetch() API to handle
 * common tasks like setting the base URL, attaching
 * auth tokens, and standardizing error handling.
 */

const API_BASE = '/api/v1';

export const apiClient = {
  /**
   * Helper to get standard headers, injecting JWT if available
   */
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    // In Phase 2, we will read this from localStorage after OTP login
    const token = localStorage.getItem('nr_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  },

  /**
   * Handle the raw fetch response, parsing JSON and throwing standard errors
   */
  async handleResponse(response) {
    if (response.status === 204) {
      return null;
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = data?.message || `API Error: ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  },

  /**
   * Perform a GET request
   * @param {string} endpoint - e.g. '/routes/search?origin=Lagos'
   */
  async get(endpoint) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error(`[API GET ${endpoint}] Failed:`, error.message);
      throw error;
    }
  },

  /**
   * Perform a POST request
   * @param {string} endpoint - e.g. '/bookings'
   * @param {object} payload - Request body object
   */
  async post(endpoint, payload) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error(`[API POST ${endpoint}] Failed:`, error.message);
      throw error;
    }
  },

  /**
   * Perform a PATCH request
   */
  async patch(endpoint, payload) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error(`[API PATCH ${endpoint}] Failed:`, error.message);
      throw error;
    }
  }
};
