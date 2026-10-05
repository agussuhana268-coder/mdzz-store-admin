import { useState, useCallback } from 'react';
import { useAuth } from './hooks/useAuth';
import { useOrders } from './hooks/useOrders';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { OrderTableRow, OrderMobileCard } from './components/OrderRow';
import { OrderDetailModal } from './components/OrderDetailModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { LoginModal } from './components/LoginModal';
import { Toast } from './components/Toast';
import { FILTER_OPTIONS, ORDER_STATUS } from './utils/constants';
import { Loader2, AlertCircle, RefreshCw, Inbox } from 'lucide-react';

export default function App() {
  // Authentication state (strictly in-memory)
  const {
    token,
    isAuthenticated,
    isLoggingIn,
    loginError,
    sessionExpiredMessage,
    login,
    logout,
    handleUnauthorized,
  } = useAuth();

  // Toast notification state
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 7);
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Handle successful login
  const handleLoginSubmit = async (password) => {
    const success = await login(password);
    if (success) {
      addToast({
        type: 'success',
        message: 'Login berhasil. Selamat datang di Admin Dashboard.',
      });
    }
  };

  // Orders management hook
  const {
    orders,
    summary,
    filter,
    setFilter,
    isLoading,
    isRefreshing,
    error,
    actionInProgress,
    refresh,
    completeOrder,
    cancelOrder,
  } = useOrders({
    token,
    onUnauthorized: handleUnauthorized,
    onNotify: addToast,
  });

  // Modal states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [confirmCompleteOrder, setConfirmCompleteOrder] = useState(null);
  const [confirmCancelOrder, setConfirmCancelOrder] = useState(null);

  // Complete Order handler
  const handleExecuteComplete = async () => {
    if (!confirmCompleteOrder) return;
    const orderId = confirmCompleteOrder.id || confirmCompleteOrder.orderId;
    const success = await completeOrder(orderId);
    if (success) {
      setConfirmCompleteOrder(null);
      setSelectedOrder(null);
    }
  };

  // Cancel Order handler
  const handleExecuteCancel = async () => {
    if (!confirmCancelOrder) return;
    const orderId = confirmCancelOrder.id || confirmCancelOrder.orderId;
    const success = await cancelOrder(orderId);
    if (success) {
      setConfirmCancelOrder(null);
      setSelectedOrder(null);
    }
  };

  // If unauthenticated, display professional Login screen
  if (!isAuthenticated) {
    return (
      <>
        <LoginModal
          onLogin={handleLoginSubmit}
          isLoggingIn={isLoggingIn}
          loginError={loginError}
          sessionExpiredMessage={sessionExpiredMessage}
        />
        <Toast toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  const isCurrentActionLoading =
    Boolean(confirmCompleteOrder && actionInProgress[confirmCompleteOrder.id || confirmCompleteOrder.orderId]) ||
    Boolean(confirmCancelOrder && actionInProgress[confirmCancelOrder.id || confirmCancelOrder.orderId]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <Header
        isConnected={Boolean(token)}
        isRefreshing={isRefreshing}
        onRefresh={refresh}
        onLogout={() => {
          logout();
          addToast({
            type: 'info',
            message: 'Anda telah keluar dari sesi admin.',
          });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Section: Summary Metric Cards */}
        <section aria-label="Ringkasan Pesanan">
          <SummaryCards
            summary={summary}
            activeFilter={filter}
            onSelectFilter={setFilter}
          />
        </section>

        {/* Section: Orders Management */}
        <section
          aria-label="Daftar Pesanan"
          className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl"
        >
          {/* Filter Bar & Header */}
          <div className="p-4 sm:p-6 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Daftar Pesanan
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Kelola status pembayaran dan verifikasi order customer
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {FILTER_OPTIONS.map((opt) => {
                const isActive = filter === opt.value;
                const isWaiting = opt.value === ORDER_STATUS.WAITING_VERIFICATION;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFilter(opt.value)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isActive
                        ? isWaiting
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                          : 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold'
                        : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-700/60'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="m-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={refresh}
                className="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 rounded-lg text-xs font-semibold text-rose-200 transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
              <p className="text-sm font-medium">Memuat data pesanan...</p>
            </div>
          ) : orders.length === 0 ? (
            /* Empty State */
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3 px-4 text-center">
              <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-slate-500">
                <Inbox className="w-8 h-8" />
              </div>
              <div>
                <p className="text-base font-semibold text-slate-300">
                  Tidak ada pesanan ditemukan
                </p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  {filter === 'ALL'
                    ? 'Belum ada pesanan yang masuk ke toko.'
                    : 'Tidak ada pesanan dengan status yang dipilih.'}
                </p>
              </div>
              <button
                type="button"
                onClick={refresh}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh Data
              </button>
            </div>
          ) : (
            <>
              {/* Desktop Table View (Hidden on mobile) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Produk</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Pembayaran</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Tanggal</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {orders.map((order) => {
                      const id = order.id || order.orderId;
                      return (
                        <OrderTableRow
                          key={id}
                          order={order}
                          onSelect={setSelectedOrder}
                          onOpenCompleteConfirm={setConfirmCompleteOrder}
                          onOpenCancelConfirm={setConfirmCancelOrder}
                          isActionLoading={Boolean(actionInProgress[id])}
                        />
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View (Hidden on desktop) */}
              <div className="md:hidden p-4 space-y-3">
                {orders.map((order) => {
                  const id = order.id || order.orderId;
                  return (
                    <OrderMobileCard
                      key={id}
                      order={order}
                      onSelect={setSelectedOrder}
                      onOpenCompleteConfirm={setConfirmCompleteOrder}
                      onOpenCancelConfirm={setConfirmCancelOrder}
                      isActionLoading={Boolean(actionInProgress[id])}
                    />
                  );
                })}
              </div>
            </>
          )}
        </section>
      </main>

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        onOpenCompleteConfirm={setConfirmCompleteOrder}
        onOpenCancelConfirm={setConfirmCancelOrder}
        isActionLoading={isCurrentActionLoading}
      />

      {/* Complete Order Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(confirmCompleteOrder)}
        title="Konfirmasi Selesaikan Pesanan"
        message="Apakah pembayaran order ini sudah diverifikasi di DANA Business?"
        confirmText="Ya, Selesaikan"
        cancelText="Batal"
        confirmVariant="primary"
        isLoading={isCurrentActionLoading}
        onConfirm={handleExecuteComplete}
        onCancel={() => setConfirmCompleteOrder(null)}
      />

      {/* Cancel Order Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(confirmCancelOrder)}
        title="Konfirmasi Pembatalan Pesanan"
        message="Yakin ingin membatalkan order ini?"
        confirmText="Ya, Batalkan"
        cancelText="Batal"
        confirmVariant="danger"
        isLoading={isCurrentActionLoading}
        onConfirm={handleExecuteCancel}
        onCancel={() => setConfirmCancelOrder(null)}
      />

      {/* Toasts */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
