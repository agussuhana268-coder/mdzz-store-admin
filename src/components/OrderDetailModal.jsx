import { useEffect } from 'react';
import {
  X,
  User,
  Phone,
  Package,
  CreditCard,
  Calendar,
  CheckCircle,
  XCircle,
  ExternalLink,
  ShieldCheck,
  Cpu,
  KeyRound,
} from 'lucide-react';
import { STATUS_CONFIG, ORDER_STATUS } from '../utils/constants';
import {
  formatCurrency,
  formatDateTime,
  parseProduct,
  getWhatsAppUrl,
} from '../utils/formatters';

/**
 * OrderDetailModal displays detailed information about an order.
 * Accessible with Escape key and outside click to close.
 */
export function OrderDetailModal({
  order,
  isOpen,
  onClose,
  onOpenCompleteConfirm,
  onOpenCancelConfirm,
  isActionLoading = false,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isActionLoading) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isActionLoading, onClose]);

  if (!isOpen || !order) return null;

  const orderId = order.id || order.orderId || '-';
  const customerName =
    order.customerName || order.customer?.name || order.buyerName || '-';
  const customerPhone =
    order.customerContact ||
    order.customerPhone ||
    order.customer?.phone ||
    order.customer?.whatsapp ||
    order.whatsapp ||
    '';
  const productInfo = parseProduct(order.product || order.items || order.item);
  const totalAmount = order.total || order.totalPrice || order.amount || 0;
  const paymentMethod =
    order.paymentMethod ||
    order.payment ||
    order.payment_method ||
    'DANA QRIS';
  const status = order.status || ORDER_STATUS.WAITING_VERIFICATION;
  const createdAt = order.createdAt || order.created_at;
  const updatedAt = order.updatedAt || order.updated_at;

  const statusMeta = STATUS_CONFIG[status] || {
    label: status,
    badgeClass: 'bg-slate-500/15 text-slate-300 border border-slate-500/30',
    dotClass: 'bg-slate-400',
  };

  const isWaitingVerification = status === ORDER_STATUS.WAITING_VERIFICATION;
  const waUrl = customerPhone ? getWhatsAppUrl(customerPhone, orderId) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isActionLoading) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-detail-title"
    >
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div>
            <div className="flex items-center gap-3">
              <h2
                id="order-detail-title"
                className="text-lg font-bold text-white"
              >
                Detail Pesanan
              </h2>
              <span className="font-mono text-sm text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-lg border border-indigo-500/20">
                #{orderId}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Dibuat pada: {formatDateTime(createdAt)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isActionLoading}
            aria-label="Tutup modal"
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Banner */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/50 border border-slate-800">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Status Pesanan
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs ${statusMeta.badgeClass}`}
            >
              <span className={`w-2 h-2 rounded-full ${statusMeta.dotClass}`} />
              {statusMeta.label}
            </span>
          </div>

          {/* Customer & Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Details */}
            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-400" />
                Informasi Pembeli
              </h3>
              <div>
                <p className="text-xs text-slate-500">Nama Customer</p>
                <p className="text-sm font-medium text-slate-200 mt-0.5">
                  {customerName}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Kontak / WhatsApp</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-medium text-slate-200">
                    {customerPhone || '-'}
                  </span>
                  {waUrl && (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20"
                    >
                      <Phone className="w-3 h-3" />
                      Chat WA
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Package className="w-4 h-4 text-indigo-400" />
                Informasi Produk
              </h3>
              <div>
                <p className="text-xs text-slate-500">Nama Produk</p>
                <p className="text-sm font-medium text-slate-200 mt-0.5">
                  {productInfo.name}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <KeyRound className="w-3 h-3 text-slate-400" /> Lisensi
                  </p>
                  <p className="text-sm font-medium text-slate-300 mt-0.5">
                    {productInfo.license}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-slate-400" /> Kompatibilitas
                  </p>
                  <p className="text-sm font-medium text-slate-300 mt-0.5">
                    {productInfo.compatibility}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment & Timestamps */}
          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-slate-400" /> Metode Pembayaran
              </p>
              <p className="text-sm font-semibold text-slate-200 mt-1">
                {paymentMethod}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-400" /> Total Pembayaran
              </p>
              <p className="text-base font-bold text-indigo-400 mt-1">
                {formatCurrency(totalAmount)}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" /> Terakhir Diperbarui
              </p>
              <p className="text-sm text-slate-300 mt-1">
                {formatDateTime(updatedAt || createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/70 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isActionLoading}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            Tutup
          </button>

          {isWaitingVerification && (
            <div className="w-full sm:w-auto flex items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenCancelConfirm(order)}
                disabled={isActionLoading}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-rose-300 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                Batalkan
              </button>

              <button
                type="button"
                onClick={() => onOpenCompleteConfirm(order)}
                disabled={isActionLoading}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-950/40 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                Selesaikan Pesanan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
