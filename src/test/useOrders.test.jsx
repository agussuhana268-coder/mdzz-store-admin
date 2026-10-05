import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useOrders } from '../hooks/useOrders';
import * as adminApi from '../api/adminApi';
import { ORDER_STATUS } from '../utils/constants';

vi.mock('../api/adminApi', () => ({
  getOrders: vi.fn(),
  completeOrder: vi.fn(),
  cancelOrder: vi.fn(),
}));

describe('useOrders Hook', () => {
  const mockToken = 'mock-valid-token-123';
  const mockOrders = [
    {
      id: 'ORD-001',
      customerName: 'Budi Santoso',
      product: 'Windows 11 Pro',
      total: 150000,
      status: ORDER_STATUS.WAITING_VERIFICATION,
      createdAt: '2026-10-01T10:00:00Z',
    },
    {
      id: 'ORD-002',
      customerName: 'Siti Aminah',
      product: 'Office 2021',
      total: 200000,
      status: ORDER_STATUS.SUCCESS,
      createdAt: '2026-10-01T11:00:00Z',
    },
    {
      id: 'ORD-003',
      customerName: 'Joko Widodo',
      product: 'Antivirus Pro',
      total: 80000,
      status: ORDER_STATUS.CANCELLED,
      createdAt: '2026-10-01T12:00:00Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('fetches orders and calculates summary correctly', async () => {
    adminApi.getOrders.mockResolvedValue({
      success: true,
      orders: mockOrders,
    });

    const { result, unmount } = renderHook(() =>
      useOrders({
        token: mockToken,
        onUnauthorized: vi.fn(),
        onNotify: vi.fn(),
        enablePolling: false,
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.orders).toHaveLength(3);
    });

    // WAITING_VERIFICATION is prioritized
    expect(result.current.orders[0].id).toBe('ORD-001');

    // Summary calculation
    expect(result.current.summary).toEqual({
      waiting: 1,
      success: 1,
      cancelled: 1,
      total: 3,
    });

    unmount();
  });

  it('handles filter change and fetches with status query', async () => {
    adminApi.getOrders
      .mockResolvedValueOnce({ success: true, orders: mockOrders })
      .mockResolvedValueOnce({
        success: true,
        orders: [mockOrders[0]],
      });

    const { result, unmount } = renderHook(() =>
      useOrders({
        token: mockToken,
        onUnauthorized: vi.fn(),
        onNotify: vi.fn(),
        enablePolling: false,
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setFilter(ORDER_STATUS.WAITING_VERIFICATION);
    });

    await waitFor(() => {
      expect(adminApi.getOrders).toHaveBeenCalledWith(
        mockToken,
        ORDER_STATUS.WAITING_VERIFICATION,
        expect.any(Object)
      );
    });

    unmount();
  });

  it('completes order successfully and triggers refresh', async () => {
    adminApi.getOrders.mockResolvedValue({
      success: true,
      orders: mockOrders,
    });
    adminApi.completeOrder.mockResolvedValueOnce({ success: true });

    const onNotify = vi.fn();
    const { result, unmount } = renderHook(() =>
      useOrders({
        token: mockToken,
        onUnauthorized: vi.fn(),
        onNotify,
        enablePolling: false,
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    let success;
    await act(async () => {
      success = await result.current.completeOrder('ORD-001');
    });

    expect(success).toBe(true);
    expect(adminApi.completeOrder).toHaveBeenCalledWith(
      mockToken,
      'ORD-001',
      expect.any(Object)
    );
    expect(onNotify).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'success' })
    );

    unmount();
  });

  it('cancels order successfully and triggers refresh', async () => {
    adminApi.getOrders.mockResolvedValue({
      success: true,
      orders: mockOrders,
    });
    adminApi.cancelOrder.mockResolvedValueOnce({ success: true });

    const onNotify = vi.fn();
    const { result, unmount } = renderHook(() =>
      useOrders({
        token: mockToken,
        onUnauthorized: vi.fn(),
        onNotify,
        enablePolling: false,
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    let success;
    await act(async () => {
      success = await result.current.cancelOrder('ORD-001');
    });

    expect(success).toBe(true);
    expect(adminApi.cancelOrder).toHaveBeenCalledWith(
      mockToken,
      'ORD-001',
      expect.any(Object)
    );
    expect(onNotify).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'success' })
    );

    unmount();
  });

  it('polls orders every 15 seconds and cleans up interval on unmount', async () => {
    vi.useFakeTimers();

    adminApi.getOrders.mockResolvedValue({
      success: true,
      orders: mockOrders,
    });

    const { unmount } = renderHook(() =>
      useOrders({
        token: mockToken,
        onUnauthorized: vi.fn(),
        onNotify: vi.fn(),
        enablePolling: true,
        pollingInterval: 15000,
      })
    );

    // Initial mount call
    expect(adminApi.getOrders).toHaveBeenCalledTimes(1);

    // Advance 15 seconds with async timer advancement
    await act(async () => {
      await vi.advanceTimersByTimeAsync(15000);
    });
    expect(adminApi.getOrders).toHaveBeenCalledTimes(2);

    // Advance another 15 seconds
    await act(async () => {
      await vi.advanceTimersByTimeAsync(15000);
    });
    expect(adminApi.getOrders).toHaveBeenCalledTimes(3);

    unmount();

    // After unmount, advance by 30 seconds
    await act(async () => {
      await vi.advanceTimersByTimeAsync(30000);
    });
    // Should NOT increase after unmount
    expect(adminApi.getOrders).toHaveBeenCalledTimes(3);

    vi.useRealTimers();
  });
});
