import { useEffect, useState } from 'react';
import {
  X,
  User,
  Phone,
  Package,
  CreditCard,
  Calendar,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Copy,
  Check,
  Cpu,
  KeyRound,
  Clock,
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
 * Structured into clean sections: Pelanggan, Produk, Pembayaran, Timeline.
 * Includes Copy Order ID button.
 */
export function OrderDetailModal({
  order,
  isOpen,
  onClose,
  onOpenCompleteConfirm,
  onOpenCancelConfirm,
  isActionLoading = false,
}) {
  const [copied, setCopied] = useState(false);

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
    badgeClass: 'bg-ink-800 text-slate-300 border border-ink-700',
    dotClass: 'bg-slate-400',
  };

  const isWaitingVerification = status === ORDER_STATUS.WAITING_VERIFICATION;
  const waUrl = customerPhone ? getWhatsAppUrl(customerPhone, orderId) : null;

  const handleCopyOrderId = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(orderId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Fallback ignore if clipboard is unavailable in certain sandboxes
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isActionLoading) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-detail-title"
    >
      <div className="w-full max-w-2xl bg-ink-900 border border-ink-700 rounded-xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 border-b border-ink-700 bg-ink-850/50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2
                id="order-detail-title"
                className="text-lg font-bold text-white tracking-tight"
              >
                Detail Pesanan
              </h2>

              {/* Order ID with Copy Button */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-ink-800 border border-ink-700">
                <span className="font-mono text-xs font-semibold text-accent-400">
                  #{orderId}
                </span>
                <button
                  type="button"
                  onClick={handleCopyOrderId}
                  aria-label="Salin ID Pesanan"
                  title="Salin ID Pesanan"
                  className="text-slate-400 hover:text-white p-0.5 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-accent-500"
                >
                  {copied ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                      <Check className="w-3.5 h-3.5" />
                      Tersalin
                    </span>
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-1">
              Informasi lengkap transaksi pelanggan di MDZZ Store
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isActionLoading}
            aria-label="Tutup modal"
            className="text-slate-400 hover:text-slate-200 p-2 rounded-lg bg-ink-800/80 hover:bg-ink-800 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Status Alert Banner */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-ink-850/60 border border-ink-700/80">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Status Pesanan
              </span>
              <span className="text-xs text-slate-300 mt-0.5 block">
                {statusMeta.description || 'Status pesanan saat ini'}
              </span>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusMeta.badgeClass}`}
            >
              <span className={`w-2 h-2 rounded-full ${statusMeta.dotClass}`} />
              {statusMeta.label}
            </span>
          </div>

          {/* Section 1: Pelanggan */}
          <div className="p-4 rounded-lg bg-ink-850/40 border border-ink-700/80 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-accent-400 flex items-center gap-2">
              <User className="w-4 h-4" />
              Pelanggan
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <p className="text-xs text-slate-400">Nama Lengkap</p>
                <p className="text-sm font-medium text-slate-100 mt-0.5">
                  {customerName}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Kontak WhatsApp</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-medium font-mono text-slate-200">
                    {customerPhone || '-'}
                  </span>
                  {waUrl && (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 transition-colors"
                    >
                      <Phone className="w-3 h-3" />
                      Chat WhatsApp
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Produk */}
          <div className="p-4 rounded-lg bg-ink-850/40 border border-ink-700/80 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-accent-400 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Produk
            </h3>

            <div className="space-y-3 pt-1">
              <div>
                <p className="text-xs text-slate-400">Nama Produk</p>
                <p className="text-sm font-semibold text-slate-100 mt-0.5">
                  {productInfo.name}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-2.5 rounded-lg bg-ink-900 border border-ink-750">
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                    Lisensi
                  </p>
                  <p className="text-xs font-medium text-slate-200 mt-1 font-mono">
                    {productInfo.license}
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-ink-900 border border-ink-750">
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-slate-400" />
                    Kompatibilitas
                  </p>
                  <p className="text-xs font-medium text-slate-200 mt-1 font-mono">
                    {productInfo.compatibility}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Pembayaran */}
          <div className="p-4 rounded-lg bg-ink-850/40 border border-ink-700/80 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-accent-400 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Pembayaran
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div>
                <p className="text-xs text-slate-400">Total Nominal</p>
                <p className="text-base font-bold font-mono text-accent-400 mt-0.5">
                  {formatCurrency(totalAmount)}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Metode Pembayaran</p>
                <p className="text-sm font-medium text-slate-200 mt-0.5">
                  {paymentMethod}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Status Pembayaran</p>
                <p className="text-sm font-medium text-slate-200 mt-0.5">
                  {statusMeta.label}
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Timeline */}
          <div className="p-4 rounded-lg bg-ink-850/40 border border-ink-700/80 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-accent-400 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Timeline
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 font-mono text-xs">
              <div>
                <p className="text-slate-400 flex items-center gap-1 font-sans">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" /> Dibuat (Created)
                </p>
                <p className="text-slate-200 mt-1">
                  {formatDateTime(createdAt)}
                </p>
              </div>

              <div>
                <p className="text-slate-400 flex items-center gap-1 font-sans">
                  <Clock className="w-3.5 h-3.5 text-slate-500" /> Terakhir Diperbarui (Updated)
                </p>
                <p className="text-slate-200 mt-1">
                  {formatDateTime(updatedAt || createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-ink-700 bg-ink-850/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isActionLoading}
            className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-ink-800 hover:bg-ink-750 border border-ink-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            Tutup
          </button>

          {isWaitingVerification && (
            <div className="w-full sm:w-auto flex items-center gap-2.5">
              {/* Danger/Red: Batalkan Pesanan */}
              <button
                type="button"
                onClick={() => onOpenCancelConfirm(order)}
                disabled={isActionLoading}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-medium text-rose-300 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                <span>Batalkan Pesanan</span>
              </button>

              {/* Primary Blue: Selesaikan Pesanan */}
              <button
                type="button"
                onClick={() => onOpenCompleteConfirm(order)}
                disabled={isActionLoading}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-ink-950 font-bold bg-accent-500 hover:bg-accent-400 rounded-lg shadow-md shadow-accent-600/30 transition-all focus:outline-none focus:ring-2 focus:ring-accent-500 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Selesaikan Pesanan</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
