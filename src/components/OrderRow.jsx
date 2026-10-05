import {
  CheckCircle,
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
    badgeClass: 'bg-slate-500/15 text-slate-300 border border-slate-500/30',
    dotClass: 'bg-slate-400',
  };

  const isWaiting = status === ORDER_STATUS.WAITING_VERIFICATION;
  const waUrl = customerPhone ? getWhatsAppUrl(customerPhone, orderId) : null;

  return (
    <tr
      className={`border-b border-slate-800/80 transition-colors hover:bg-slate-800/40 ${
        isWaiting ? 'bg-amber-500/[0.02]' : ''
      }`}
    >
      {/* Order ID */}
      <td className="py-4 px-4 whitespace-nowrap">
        <button
          type="button"
          onClick={() => onSelect(order)}
          className="font-mono text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded"
        >
          #{orderId}
        </button>
      </td>

      {/* Product */}
      <td className="py-4 px-4">
        <div className="max-w-[200px]">
          <div className="text-sm font-medium text-slate-200 truncate" title={productInfo.name}>
            {productInfo.name}
          </div>
          {productInfo.license !== '-' && (
            <span className="inline-block mt-0.5 text-[11px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded border border-slate-700/60">
              {productInfo.license}
            </span>
          )}
        </div>
      </td>

      {/* Customer */}
      <td className="py-4 px-4 whitespace-nowrap">
        <div className="text-sm font-medium text-slate-200">
          {customerName}
        </div>
        {customerPhone && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
            <span>{customerPhone}</span>
            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Chat WhatsApp"
                className="text-emerald-400 hover:text-emerald-300"
              >
                <Phone className="w-3 h-3 inline" />
              </a>
            )}
          </div>
        )}
      </td>

      {/* Total */}
      <td className="py-4 px-4 whitespace-nowrap text-sm font-semibold text-slate-200">
        {formatCurrency(totalAmount)}
      </td>

      {/* Payment */}
      <td className="py-4 px-4 whitespace-nowrap">
        <span className="text-xs text-slate-400 bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700/60">
          {paymentMethod}
        </span>
      </td>

      {/* Status */}
      <td className="py-4 px-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${statusMeta.badgeClass}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dotClass}`} />
          {statusMeta.label}
        </span>
      </td>

      {/* Date */}
      <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-400">
        {formatDateShort(createdAt)}
      </td>

      {/* Actions */}
      <td className="py-4 px-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-1.5">
          {isWaiting ? (
            <>
              <button
                type="button"
                onClick={() => onOpenCompleteConfirm(order)}
                disabled={isActionLoading}
                title="Selesaikan Pesanan"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Selesaikan</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenCancelConfirm(order)}
                disabled={isActionLoading}
                title="Batalkan Pesanan"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-300 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:opacity-50"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Batal</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onSelect(order)}
              title="Lihat Detail"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700/80 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              <Eye className="w-3.5 h-3.5" />
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
    badgeClass: 'bg-slate-500/15 text-slate-300 border border-slate-500/30',
    dotClass: 'bg-slate-400',
  };

  const isWaiting = status === ORDER_STATUS.WAITING_VERIFICATION;
  const waUrl = customerPhone ? getWhatsAppUrl(customerPhone, orderId) : null;

  return (
    <div
      className={`p-4 rounded-2xl border transition-all duration-200 ${
        isWaiting
          ? 'bg-slate-900/90 border-amber-500/40 shadow-md shadow-amber-500/5'
          : 'bg-slate-900/70 border-slate-800'
      }`}
    >
      {/* Top: Order ID + Status */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
        <button
          type="button"
          onClick={() => onSelect(order)}
          className="font-mono text-sm font-semibold text-indigo-400 hover:text-indigo-300"
        >
          #{orderId}
        </button>

        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs ${statusMeta.badgeClass}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dotClass}`} />
          {statusMeta.label}
        </span>
      </div>

      {/* Body */}
      <div className="py-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="text-sm font-semibold text-slate-100">
              {productInfo.name}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
              <span>{customerName}</span>
              {customerPhone && <span>• {customerPhone}</span>}
              {waUrl && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Chat WhatsApp"
                  className="text-emerald-400 hover:text-emerald-300 ml-1 inline-flex items-center"
                >
                  <Phone className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-sm font-bold text-slate-200">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <span className="flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5 text-slate-500" />
            {paymentMethod}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            {formatDateShort(createdAt)}
          </span>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => onSelect(order)}
          className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl"
        >
          Detail
        </button>

        {isWaiting && (
          <>
            <button
              type="button"
              onClick={() => onOpenCancelConfirm(order)}
              disabled={isActionLoading}
              className="px-3 py-1.5 text-xs font-medium text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl disabled:opacity-50"
            >
              Batalkan
            </button>

            <button
              type="button"
              onClick={() => onOpenCompleteConfirm(order)}
              disabled={isActionLoading}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-sm disabled:opacity-50"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Selesaikan
            </button>
          </>
        )}
      </div>
    </div>
  );
}
