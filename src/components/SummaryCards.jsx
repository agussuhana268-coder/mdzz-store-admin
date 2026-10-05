import { Clock, CheckCircle2, XCircle, Package } from 'lucide-react';
import { ORDER_STATUS } from '../utils/constants';

/**
 * SummaryCards component
 * Displays high-level order counts with WAITING_VERIFICATION as visual priority.
 */
export function SummaryCards({
  summary = { waiting: 0, success: 0, cancelled: 0, total: 0 },
  activeFilter = 'ALL',
  onSelectFilter,
}) {
  const cards = [
    {
      id: ORDER_STATUS.WAITING_VERIFICATION,
      label: 'Menunggu Verifikasi',
      count: summary.waiting,
      icon: Clock,
      badgeText: 'Perlu Tindakan',
      containerClass:
        'bg-slate-900/90 border-amber-500/40 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/20',
      iconClass: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
      countClass: 'text-amber-400',
      pulseDot: true,
      filterValue: ORDER_STATUS.WAITING_VERIFICATION,
    },
    {
      id: ORDER_STATUS.SUCCESS,
      label: 'Berhasil',
      count: summary.success,
      icon: CheckCircle2,
      badgeText: 'Selesai',
      containerClass: 'bg-slate-900/80 border-slate-800 hover:border-slate-700',
      iconClass: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
      countClass: 'text-emerald-400',
      pulseDot: false,
      filterValue: ORDER_STATUS.SUCCESS,
    },
    {
      id: ORDER_STATUS.CANCELLED,
      label: 'Dibatalkan',
      count: summary.cancelled,
      icon: XCircle,
      badgeText: 'Batal',
      containerClass: 'bg-slate-900/80 border-slate-800 hover:border-slate-700',
      iconClass: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
      countClass: 'text-rose-400',
      pulseDot: false,
      filterValue: ORDER_STATUS.CANCELLED,
    },
    {
      id: 'ALL',
      label: 'Total Pesanan',
      count: summary.total,
      icon: Package,
      badgeText: 'Semua',
      containerClass: 'bg-slate-900/80 border-slate-800 hover:border-slate-700',
      iconClass: 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30',
      countClass: 'text-indigo-400',
      pulseDot: false,
      filterValue: 'ALL',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeFilter === card.filterValue;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectFilter && onSelectFilter(card.filterValue)}
            className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              card.containerClass
            } ${
              isSelected ? 'ring-2 ring-indigo-500/70 border-indigo-500/50' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {card.label}
              </span>
              <div className={`p-2 rounded-xl shrink-0 ${card.iconClass}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <div className="flex items-center gap-2">
                {card.pulseDot && (
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                )}
                <span className={`text-2xl sm:text-3xl font-bold tracking-tight ${card.countClass}`}>
                  {card.count}
                </span>
              </div>
              <span className="text-xs font-medium text-slate-500">
                {card.badgeText}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
