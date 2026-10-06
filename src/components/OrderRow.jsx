import {
  CheckCircle2,
  XCircle,
  Eye,
  Phone,
  CreditCard,
  Calendar,
} from 'lucide-react';
import { STATUS_CONFIG, ORDER_STATUS } from '../utils/constants';
import {
  formatCurrency,
  formatDateShort,
  parseProduct,
  getWhatsAppUrl,
} from '../utils/formatters';

/**
 * Desktop table row for orders
 * SaaS-styled with deep navy theme and compact status pills.
 */
export function OrderTableRow({
  order,
  onSelect,
  onOpenCompleteConfirm,
  onOpenCancelConfirm,
  isActionLoading = false,
}) {
  const orderId = order.id || order.orderId || '-';
  const customerName =
    order.customerName || order.customer?.name || order.buyerName || '-';
  const customerPhone =
    order.customerContact ||
    order.customerPhone ||
    order.customer?.phone ||
    order.customer?.whatsapp ||
    '';
  const productInfo = parseProduct(order.product || order.items || order.item);
  const totalAmount = order.total || order.totalPrice || order.amount || 0;
  const paymentMethod =
    order.paymentMethod || order.payment || order.payment_method || 'DANA QRIS';
  const status = order.status || ORDER_STATUS.WAITING_VERIFICATION;
  const createdAt = order.createdAt || order.created_at;

  const statusMeta = STATUS_CONFIG[status] || {
    label: status,
    badgeClass: 'bg-ink-800 text-slate-300 border border-ink-700',
    dotClass: 'bg-slate-400',
  };

  const isWaiting = status === ORDER_STATUS.WAITING_VERIFICATION;
  const waUrl = customerPhone ? getWhatsAppUrl(customerPhone, orderId) : null;

  return (
    <tr
      className={`border-b border-ink-700/60 transition-colors hover:bg-ink-850/60 group ${
        isWaiting ? 'bg-amber-500/[0.03]' : ''
      }`}
    >
      {/* 1. Order ID */}
      <td className="py-3.5 px-4 whitespace-nowrap">
        <button
          type="button"
          onClick={() => onSelect(order)}
          title="Klik untuk detail pesanan"
          className="font-mono text-xs font-semibold text-accent-400 hover:text-accent-300 hover:underline focus:outline-none focus:ring-1 focus:ring-accent-500 rounded py-0.5 px-1 bg-ink-800/60 border border-ink-700/80 inline-flex items-center gap-1 transition-colors"
        >
          <span>#{orderId}</span>
        </button>
      </td>

      {/* 2. Pelanggan */}
      <td className="py-3.5 px-4 whitespace-nowrap">
        <div className="text-sm font-medium text-slate-100">
          {customerName}
        </div>
        {customerPhone && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
            <span className="font-mono text-[11px] text-slate-400">{customerPhone}</span>
            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Chat WhatsApp"
                className="text-emerald-400 hover:text-emerald-300 transition-colors inline-flex items-center"
              >
                <Phone className="w-3 h-3" />
              </a>
            )}
          </div>
        )}
      </td>

      {/* 3. Produk */}
      <td className="py-3.5 px-4">
        <div className="max-w-[220px]">
          <div className="text-sm font-medium text-slate-200 truncate" title={productInfo.name}>
            {productInfo.name}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            {productInfo.license !== '-' && (
              <span className="inline-block text-[10px] font-medium text-slate-400 bg-ink-800 px-1.5 py-0.5 rounded border border-ink-700">
                {productInfo.license}
              </span>
            )}
            {productInfo.compatibility !== '-' && (
              <span className="inline-block text-[10px] font-medium text-slate-400 bg-ink-800 px-1.5 py-0.5 rounded border border-ink-700">
                {productInfo.compatibility}
              </span>
            )}
          </div>
        </div>
      </td>

      {/* 4. Total */}
      <td className="py-3.5 px-4 whitespace-nowrap">
        <div className="text-sm font-semibold font-mono text-slate-100">
          {formatCurrency(totalAmount)}
        </div>
        <div className="text-[11px] text-slate-400">
          {paymentMethod}
        </div>
      </td>

      {/* 5. Status */}
      <td className="py-3.5 px-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${statusMeta.badgeClass}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusMeta.dotClass}`} />
          {statusMeta.label}
        </span>
      </td>

      {/* 6. Waktu */}
      <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-400 font-mono">
        {formatDateShort(createdAt)}
      </td>

      {/* 7. Action */}
      <td className="py-3.5 px-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-1.5">
          {isWaiting ? (
            <>
              {/* Primary Blue action for Complete */}
              <button
                type="button"
                onClick={() => onOpenCompleteConfirm(order)}
                disabled={isActionLoading}
                title="Selesaikan Pesanan"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-ink-950 font-bold bg-accent-500 hover:bg-accent-400 rounded-lg shadow-sm shadow-accent-600/30 transition-all focus:outline-none focus:ring-2 focus:ring-accent-500 disabled:opacity-50"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Selesaikan</span>
              </button>

              {/* Danger/Red action for Cancel */}
              <button
                type="button"
                onClick={() => onOpenCancelConfirm(order)}
                disabled={isActionLoading}
                title="Batalkan Pesanan"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-300 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:opacity-50"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Batal</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onSelect(order)}
              title="Lihat Detail Pesanan"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-ink-800 hover:bg-ink-750 border border-ink-700 hover:border-ink-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500"
            >
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>Detail</span>
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

/**
 * Mobile responsive card for orders
 */
export function OrderMobileCard({
  order,
  onSelect,
  onOpenCompleteConfirm,
  onOpenCancelConfirm,
  isActionLoading = false,
}) {
  const orderId = order.id || order.orderId || '-';
  const customerName =
    order.customerName || order.customer?.name || order.buyerName || '-';
  const customerPhone =
    order.customerContact ||
    order.customerPhone ||
    order.customer?.phone ||
    order.customer?.whatsapp ||
    '';
  const productInfo = parseProduct(order.product || order.items || order.item);
  const totalAmount = order.total || order.totalPrice || order.amount || 0;
  const paymentMethod =
    order.paymentMethod || order.payment || order.payment_method || 'DANA QRIS';
  const status = order.status || ORDER_STATUS.WAITING_VERIFICATION;
  const createdAt = order.createdAt || order.created_at;

  const statusMeta = STATUS_CONFIG[status] || {
    label: status,
    badgeClass: 'bg-ink-800 text-slate-300 border border-ink-700',
    dotClass: 'bg-slate-400',
  };

  const isWaiting = status === ORDER_STATUS.WAITING_VERIFICATION;
  const waUrl = customerPhone ? getWhatsAppUrl(customerPhone, orderId) : null;

  return (
    <div
      className={`p-4 rounded-xl border transition-all duration-200 ${
        isWaiting
          ? 'bg-ink-900 border-amber-500/40 shadow-sm shadow-amber-500/5'
          : 'bg-ink-900/90 border-ink-700/80 hover:border-ink-600'
      }`}
    >
      {/* Top: Order ID + Status */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-ink-700/70">
        <button
          type="button"
          onClick={() => onSelect(order)}
          className="font-mono text-xs font-semibold text-accent-400 hover:text-accent-300 px-2 py-0.5 rounded bg-ink-800 border border-ink-700 inline-flex items-center gap-1"
        >
          <span>#{orderId}</span>
        </button>

        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${statusMeta.badgeClass}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dotClass}`} />
          {statusMeta.label}
        </span>
      </div>

      {/* Body: Product, Customer, Total */}
      <div className="py-3 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 pr-2">
            <h4 className="text-sm font-semibold text-slate-100 leading-snug">
              {productInfo.name}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
              <span className="font-medium text-slate-300">{customerName}</span>
              {customerPhone && (
                <>
                  <span>•</span>
                  <span className="font-mono text-[11px]">{customerPhone}</span>
                </>
              )}
              {waUrl && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Chat WhatsApp"
                  className="text-emerald-400 hover:text-emerald-300 inline-flex items-center ml-0.5"
                >
                  <Phone className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-sm font-bold font-mono text-slate-100">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-ink-800/80">
          <span className="flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5 text-slate-500" />
            {paymentMethod}
          </span>
          <span className="flex items-center gap-1 font-mono text-[11px]">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            {formatDateShort(createdAt)}
          </span>
        </div>
      </div>

      {/* Footer: Actions */}
      <div className="pt-3 border-t border-ink-700/70 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => onSelect(order)}
          className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-ink-800 hover:bg-ink-750 border border-ink-700 rounded-lg transition-colors"
        >
          Detail
        </button>

        {isWaiting && (
          <>
            <button
              type="button"
              onClick={() => onOpenCancelConfirm(order)}
              disabled={isActionLoading}
              className="px-3 py-1.5 text-xs font-medium text-rose-300 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-colors disabled:opacity-50"
            >
              Batalkan
            </button>

            <button
              type="button"
              onClick={() => onOpenCompleteConfirm(order)}
              disabled={isActionLoading}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-ink-950 font-bold bg-accent-500 hover:bg-accent-400 rounded-lg shadow-sm shadow-accent-600/30 transition-colors disabled:opacity-50"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Selesaikan</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
