import { apiClient } from './client';

/**
 * Authenticate admin with password
 * @param {string} password
 * @returns {Promise<{ success: boolean, token: string, expiresIn: number }>}
 */
export async function login(password) {
  return apiClient('/api/admin/login', {
    method: 'POST',
    body: { password },
  });
}

/**
 * Fetch orders with optional status filter
 * @param {string} token - Session token from React state
 * @param {string} [status] - Optional filter (e.g. 'WAITING_VERIFICATION', 'SUCCESS', 'CANCELLED')
 * @param {object} [options] - Optional signal or onUnauthorized
 */
export async function getOrders(token, status = '', options = {}) {
  let endpoint = '/api/admin/orders';
  if (status && status !== 'ALL') {
    endpoint += `?status=${encodeURIComponent(status)}`;
  }
  return apiClient(endpoint, {
    token,
    method: 'GET',
    ...options,
  });
}

/**
 * Complete order after verifying payment in DANA Business
 * @param {string} token
 * @param {string} orderId
 * @param {object} [options]
 */
export async function completeOrder(token, orderId, options = {}) {
  return apiClient(`/api/admin/orders/${encodeURIComponent(orderId)}/complete`, {
    token,
    method: 'POST',
    ...options,
  });
}

/**
 * Cancel an order in WAITING_VERIFICATION state
 * @param {string} token
 * @param {string} orderId
 * @param {object} [options]
 */
export async function cancelOrder(token, orderId, options = {}) {
  return apiClient(`/api/admin/orders/${encodeURIComponent(orderId)}/cancel`, {
    token,
    method: 'POST',
    ...options,
  });
}

/**
 * Fetch customer fallback order detail if needed
 * @param {string} orderId
 * @param {object} [options]
 */
export async function getOrderFallback(orderId, options = {}) {
  return apiClient(`/api/orders/${encodeURIComponent(orderId)}`, {
    method: 'GET',
    ...options,
  });
}
