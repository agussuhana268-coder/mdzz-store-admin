import { useState, useEffect, useCallback, useRef } from 'react';
import { getOrders, completeOrder, cancelOrder } from '../api/adminApi';
import { ORDER_STATUS, POLLING_INTERVAL_MS } from '../utils/constants';

/**
 * Custom hook to manage orders list, filtering, polling, and action operations.
 */
export function useOrders({
  token,
  onUnauthorized,
  onNotify,
  enablePolling = true,
  pollingInterval = POLLING_INTERVAL_MS,
}) {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [actionInProgress, setActionInProgress] = useState({});

  // Summary counts
  const [summary, setSummary] = useState({
    waiting: 0,
    success: 0,
    cancelled: 0,
    total: 0,
  });

  const isFetchingRef = useRef(false);
  const isMountedRef = useRef(true);

  // Keep stable refs for external callbacks to prevent infinite re-render loops
  const onUnauthorizedRef = useRef(onUnauthorized);
  onUnauthorizedRef.current = onUnauthorized;
  const onNotifyRef = useRef(onNotify);
  onNotifyRef.current = onNotify;

  // Compute summary stats from orders array
  const calculateSummary = useCallback((orderList) => {
    let waiting = 0;
    let success = 0;
    let cancelled = 0;

    for (const ord of orderList) {
      const status = ord.status;
      if (status === ORDER_STATUS.WAITING_VERIFICATION) {
        waiting++;
      } else if (status === ORDER_STATUS.SUCCESS) {
        success++;
      } else if (status === ORDER_STATUS.CANCELLED) {
        cancelled++;
      }
    }

    return {
      waiting,
      success,
      cancelled,
      total: orderList.length,
    };
  }, []);

  // Fetch orders from API
  const fetchOrders = useCallback(
    async (currentFilter = filter, isManualRefresh = false) => {
      if (!token) return;

      // Prevent concurrent overlapping fetches
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      if (isManualRefresh) {
        setIsRefreshing(true);
      }
      setError(null);

      try {
        const res = await getOrders(token, currentFilter, {
          onUnauthorized: () => onUnauthorizedRef.current?.(),
        });

        if (!isMountedRef.current) return;

        // Support both { success: true, orders: [...] } and direct array [...]
        const rawOrders = Array.isArray(res)
          ? res
          : Array.isArray(res?.orders)
          ? res.orders
          : [];

        // Sort: WAITING_VERIFICATION first, then by date descending
        const sorted = [...rawOrders].sort((a, b) => {
          if (
            a.status === ORDER_STATUS.WAITING_VERIFICATION &&
            b.status !== ORDER_STATUS.WAITING_VERIFICATION
          ) {
            return -1;
          }
          if (
            b.status === ORDER_STATUS.WAITING_VERIFICATION &&
            a.status !== ORDER_STATUS.WAITING_VERIFICATION
          ) {
            return 1;
          }
          const dateA = new Date(a.createdAt || a.created_at || 0).getTime();
          const dateB = new Date(b.createdAt || b.created_at || 0).getTime();
          return dateB - dateA;
        });

        setOrders(sorted);

        // If 'ALL' is selected, update global summary.
        // If filtered, update at least the current active status count.
        if (currentFilter === 'ALL') {
          setSummary(calculateSummary(sorted));
        } else {
          setSummary((prev) => ({
            ...prev,
            ...(currentFilter === ORDER_STATUS.WAITING_VERIFICATION && {
              waiting: sorted.length,
            }),
            ...(currentFilter === ORDER_STATUS.SUCCESS && {
              success: sorted.length,
            }),
            ...(currentFilter === ORDER_STATUS.CANCELLED && {
              cancelled: sorted.length,
            }),
          }));
        }
      } catch (err) {
        if (!isMountedRef.current) return;
        if (err?.status === 401) {
          // Handled by onUnauthorized callback
          return;
        }
        const errMsg = err?.message || 'Gagal mengambil data pesanan.';
        setError(errMsg);
        if (isManualRefresh && onNotifyRef.current) {
          onNotifyRef.current({
            type: 'error',
            message: errMsg,
          });
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
        isFetchingRef.current = false;
      }
    },
    [token, filter, calculateSummary]
  );

  // Manual refresh trigger
  const refresh = useCallback(() => {
    return fetchOrders(filter, true);
  }, [fetchOrders, filter]);

  // Handle filter change
  const handleFilterChange = useCallback((newFilter) => {
    setFilter(newFilter);
    setIsLoading(true);
  }, []);

  // Fetch when token or filter changes
  useEffect(() => {
    if (!token) return;
    fetchOrders(filter, false);
  }, [token, filter, fetchOrders]);

  // Polling setup with tab visibility check and cleanup
  useEffect(() => {
    if (!token || !enablePolling) return;

    const intervalId = setInterval(() => {
      // Only poll if tab is visible
      if (typeof document !== 'undefined' && document.hidden) {
        return;
      }
      fetchOrders(filter, false);
    }, pollingInterval);

    const handleVisibilityChange = () => {
      if (typeof document !== 'undefined' && !document.hidden) {
        // Tab became active again, refresh once immediately
        fetchOrders(filter, false);
      }
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    return () => {
      clearInterval(intervalId);
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      }
    };
  }, [token, filter, fetchOrders, enablePolling, pollingInterval]);

  // Track component mount status
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Action: Complete Order
  const handleCompleteOrder = useCallback(
    async (orderId) => {
      if (!token || !orderId) return false;
      setActionInProgress((prev) => ({ ...prev, [orderId]: 'complete' }));

      try {
        await completeOrder(token, orderId, {
          onUnauthorized: () => onUnauthorizedRef.current?.(),
        });
        if (onNotifyRef.current) {
          onNotifyRef.current({
            type: 'success',
            message: `Pesanan #${orderId} berhasil diselesaikan.`,
          });
        }
        await fetchOrders(filter, false);
        return true;
      } catch (err) {
        if (err?.status !== 401 && onNotifyRef.current) {
          onNotifyRef.current({
            type: 'error',
            message: err?.message || `Gagal menyelesaikan pesanan #${orderId}.`,
          });
        }
        return false;
      } finally {
        setActionInProgress((prev) => {
          const updated = { ...prev };
          delete updated[orderId];
          return updated;
        });
      }
    },
    [token, filter, fetchOrders]
  );

  // Action: Cancel Order
  const handleCancelOrder = useCallback(
    async (orderId) => {
      if (!token || !orderId) return false;
      setActionInProgress((prev) => ({ ...prev, [orderId]: 'cancel' }));

      try {
        await cancelOrder(token, orderId, {
          onUnauthorized: () => onUnauthorizedRef.current?.(),
        });
        if (onNotifyRef.current) {
          onNotifyRef.current({
            type: 'success',
            message: `Pesanan #${orderId} berhasil dibatalkan.`,
          });
        }
        await fetchOrders(filter, false);
        return true;
      } catch (err) {
        if (err?.status !== 401 && onNotifyRef.current) {
          onNotifyRef.current({
            type: 'error',
            message: err?.message || `Gagal membatalkan pesanan #${orderId}.`,
          });
        }
        return false;
      } finally {
        setActionInProgress((prev) => {
          const updated = { ...prev };
          delete updated[orderId];
          return updated;
        });
      }
    },
    [token, filter, fetchOrders]
  );

  return {
    orders,
    summary,
    filter,
    setFilter: handleFilterChange,
    isLoading,
    isRefreshing,
    error,
    actionInProgress,
    refresh,
    completeOrder: handleCompleteOrder,
    cancelOrder: handleCancelOrder,
  };
}
