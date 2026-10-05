import { useState, useCallback, useMemo } from 'react';
import { useAuth } from './hooks/useAuth';
import { useOrders } from './hooks/useOrders';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { OrderTableRow, OrderMobileCard } from './components/OrderRow';
import { OrderDetailModal } from './components/OrderDetailModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { LoginModal } from './components/LoginModal';
import { Toast } from './components/Toast';
import { TableSkeletonRows, MobileCardSkeleton } from './components/OrderSkeleton';
import { FILTER_OPTIONS, ORDER_STATUS } from './utils/constants';
import { parseProduct } from './utils/formatters';
import { AlertCircle, RefreshCw, ShoppingBag, Search, X } from 'lucide-react';

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

  // Navigation tab state
  const [activeTab, setActiveTab] = useState('orders');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Search filter query state
  const [searchQuery, setSearchQuery] = useState('');

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
        message: 'Login berhasil. Selamat datang di Admin Dashboard MDZZ Store.',
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
      addToast({
        type: 'success',
        message: 'Pesanan berhasil diselesaikan.',
      });
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
      addToast({
        type: 'info',
        message: 'Pesanan berhasil dibatalkan.',
      });
    }
  };

  // Client-side search filtering across orders
  const displayedOrders = useMemo(() => {
    if (!searchQuery.trim()) return orders;
    const q = searchQuery.toLowerCase().trim();
    return orders.filter((order) => {
      const id = String(order.id || order.orderId || '').toLowerCase();
      const customer = String(
        order.customerName || order.customer?.name || order.buyerName || ''
      ).toLowerCase();
      const contact = String(
        order.customerContact ||
        order.customerPhone ||
        order.customer?.phone ||
        order.customer?.whatsapp ||
        ''
      ).toLowerCase();
      const prodInfo = parseProduct(order.product || order.items || order.item);
      const prodName = String(prodInfo?.name || '').toLowerCase();

      return (
        id.includes(q) ||
        customer.includes(q) ||
        contact.includes(q) ||
        prodName.includes(q)
      );
    });
  }, [orders, searchQuery]);

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
    Boolean(
      confirmCompleteOrder &&
        actionInProgress[confirmCompleteOrder.id || confirmCompleteOrder.orderId]
    ) ||
    Boolean(
      confirmCancelOrder &&
        actionInProgress[confirmCancelOrder.id || confirmCancelOrder.orderId]
    );

  const handleLogoutAction = () => {
    logout();
    addToast({
      type: 'info',
      message: 'Anda telah keluar dari sesi admin.',
    });
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* 1. Left Sidebar (Fixed on Desktop, Drawer on Mobile) */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        waitingCount={summary.waiting}
        totalCount={summary.total}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onLogout={handleLogoutAction}
      />

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          title={activeTab === 'overview' ? 'Overview' : 'Pesanan'}
          description="Kelola dan verifikasi pesanan pelanggan MDZZ Store"
          isConnected={Boolean(token)}
          isRefreshing={isRefreshing}
          onRefresh={refresh}
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* Content Body with Generous Spacing */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* Section: Summary Metric Cards */}
          <section aria-label="Ringkasan Pesanan">
            <SummaryCards
              summary={summary}
              activeFilter={filter}
              onSelectFilter={(newFilter) => {
                setFilter(newFilter);
                setActiveTab('orders');
              }}
            />
          </section>

          {/* Section: Orders Management */}
          <section
            aria-label="Daftar Pesanan"
            className="bg-navy-900 border border-navy-700 rounded-2xl overflow-hidden shadow-xl shadow-navy-950/50"
          >
            {/* Header & Controls Toolbar */}
            <div className="p-4 sm:p-6 border-b border-navy-700/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Pesanan</span>
                  <span className="sr-only">Daftar Pesanan</span>
                  <span className="text-xs font-normal text-slate-400">
                    ({displayedOrders.length} transaksi)
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Kelola dan verifikasi pesanan pelanggan
                </p>
              </div>

              {/* Filter Buttons & Search Input */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search Bar */}
                <div className="relative min-w-[200px] sm:min-w-[240px]">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari ID, pembeli, kontak..."
                    className="w-full pl-9 pr-8 py-1.5 text-xs bg-navy-950/70 border border-navy-700 hover:border-navy-600 focus:border-blue-500 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Hapus pencarian"
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Status Filter Buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                  {FILTER_OPTIONS.map((opt) => {
                    const isActive = filter === opt.value;
                    const isWaiting = opt.value === ORDER_STATUS.WAITING_VERIFICATION;

                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFilter(opt.value)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isActive
                            ? isWaiting
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                              : 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold border border-blue-500'
                            : 'bg-navy-800 text-slate-400 hover:text-slate-200 hover:bg-navy-750 border border-navy-700'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Error Message Notice */}
            {error && (
              <div className="m-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
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

            {/* Main Content: Skeleton, Empty State, or Orders */}
            {isLoading ? (
              <>
                {/* Desktop Skeleton */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-navy-700/80 bg-navy-950/50 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        <th className="py-3 px-4">Order</th>
                        <th className="py-3 px-4">Pelanggan</th>
                        <th className="py-3 px-4">Produk</th>
                        <th className="py-3 px-4">Total</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Waktu</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <TableSkeletonRows rowCount={4} />
                    </tbody>
                  </table>
                </div>

                {/* Mobile Skeleton */}
                <div className="md:hidden p-4">
                  <MobileCardSkeleton count={3} />
                </div>
              </>
            ) : displayedOrders.length === 0 ? (
              /* Refined Empty State */
              <div className="py-16 px-4 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-navy-800/80 border border-navy-700 flex items-center justify-center text-slate-400 mb-3 shadow-inner">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-slate-200">
                  Belum ada pesanan
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  {searchQuery
                    ? `Tidak ada pesanan yang sesuai dengan kata kunci "${searchQuery}".`
                    : filter === 'ALL'
                    ? 'Pesanan baru akan muncul di sini setelah pelanggan melakukan checkout.'
                    : 'Tidak ada pesanan dengan filter status yang dipilih.'}
                </p>
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="mt-3 px-3 py-1.5 text-xs font-medium text-blue-400 bg-navy-800 hover:bg-navy-750 border border-navy-700 rounded-xl transition-colors"
                  >
                    Reset Pencarian
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={refresh}
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-navy-800 hover:bg-navy-750 border border-navy-700 rounded-xl transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Refresh Data</span>
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Desktop SaaS Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-navy-700/80 bg-navy-950/40 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        <th className="py-3 px-4">Order</th>
                        <th className="py-3 px-4">Pelanggan</th>
                        <th className="py-3 px-4">Produk</th>
                        <th className="py-3 px-4">Total</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Waktu</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-750/50">
                      {displayedOrders.map((order) => {
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

                {/* Mobile Responsive Cards */}
                <div className="md:hidden p-4 space-y-3">
                  {displayedOrders.map((order) => {
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
      </div>

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
        title="Selesaikan pesanan ini?"
        message="Pastikan pembayaran pelanggan sudah diterima sebelum menyelesaikan pesanan."
        confirmText="Selesaikan Pesanan"
        cancelText="Kembali"
        confirmVariant="primary"
        isLoading={isCurrentActionLoading}
        onConfirm={handleExecuteComplete}
        onCancel={() => setConfirmCompleteOrder(null)}
      />

      {/* Cancel Order Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(confirmCancelOrder)}
        title="Batalkan pesanan ini?"
        message="Tindakan ini tidak dapat dibatalkan. Yakin ingin membatalkan pesanan ini?"
        confirmText="Batalkan Pesanan"
        cancelText="Kembali"
        confirmVariant="danger"
        isLoading={isCurrentActionLoading}
        onConfirm={handleExecuteCancel}
        onCancel={() => setConfirmCancelOrder(null)}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
