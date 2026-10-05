import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  login,
  getOrders,
  completeOrder,
  cancelOrder,
} from '../api/adminApi';
import { API_BASE_URL } from '../utils/constants';

describe('Admin API Client', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('login sends POST request with password in body', async () => {
    const mockResponse = {
      success: true,
      token: 'jwt-hmac-token-123',
      expiresIn: 14400,
    };

    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => mockResponse,
    });

    const res = await login('secretpass');

    expect(globalThis.fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/api/admin/login`,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ password: 'secretpass' }),
      })
    );
    expect(res).toEqual(mockResponse);
  });

  it('getOrders attaches Bearer token and sends GET request', async () => {
    const mockOrders = [
      { id: 'ORD-1', status: 'WAITING_VERIFICATION' },
      { id: 'ORD-2', status: 'SUCCESS' },
    ];

    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => ({ success: true, orders: mockOrders }),
    });

    const res = await getOrders('test-token-abc');

    expect(globalThis.fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/api/admin/orders`,
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token-abc',
        }),
      })
    );
    expect(res.orders).toEqual(mockOrders);
  });

  it('getOrders supports filtering by status parameter', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => ({ success: true, orders: [] }),
    });

    await getOrders('test-token', 'WAITING_VERIFICATION');

    expect(globalThis.fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/api/admin/orders?status=WAITING_VERIFICATION`,
      expect.any(Object)
    );
  });

  it('completeOrder calls POST /api/admin/orders/:orderId/complete with Bearer token', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => ({ success: true, message: 'Order completed' }),
    });

    const res = await completeOrder('token-123', 'ORD-999');

    expect(globalThis.fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/api/admin/orders/ORD-999/complete`,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer token-123',
        }),
      })
    );
    expect(res.success).toBe(true);
  });

  it('cancelOrder calls POST /api/admin/orders/:orderId/cancel with Bearer token', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => ({ success: true, message: 'Order cancelled' }),
    });

    const res = await cancelOrder('token-123', 'ORD-888');

    expect(globalThis.fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/api/admin/orders/ORD-888/cancel`,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer token-123',
        }),
      })
    );
    expect(res.success).toBe(true);
  });

  it('handles 401 unauthorized by invoking onUnauthorized callback', async () => {
    const onUnauthorized = vi.fn();

    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 401,
      headers: { get: () => 'application/json' },
      json: async () => ({ error: 'Unauthorized: Session expired' }),
    });

    await expect(
      getOrders('expired-token', '', { onUnauthorized })
    ).rejects.toThrow();

    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });
});
