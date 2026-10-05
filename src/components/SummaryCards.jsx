import { Clock, CheckCircle2, XCircle, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { ORDER_STATUS } from '../utils/constants';

/**
 * SummaryCards component
 * Displays high-level order counts with WAITING_VERIFICATION having highest visual prominence.
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
      secondaryCode: 'WAITING_VERIFICATION',
      count: summary.waiting,
      icon: Clock,
      badgeText: summary.waiting > 0 ? `${summary.waiting} Perlu Tindakan` : 'Antrean Bersih',
      isPrimaryAction: true,
      containerClass:
        'bg-navy-900 border-amber-500/40 shadow-md shadow-amber-500/5 ring-1 ring-amber-500/20 hover:border-amber-400/60',
      iconBoxClass: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
      countClass: 'text-amber-300',
      badgeClass:
        summary.waiting > 0
          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
          : 'bg-navy-800 text-slate-400 border border-navy-700',
      filterValue: ORDER_STATUS.WAITING_VERIFICATION,
    },
    {
      id: ORDER_STATUS.SUCCESS,
      label: 'Berhasil',
      secondaryCode: 'SUCCESS',
      count: summary.success,
      icon: CheckCircle2,
      badgeText: 'Selesai',
      isPrimaryAction: false,
      containerClass: 'bg-navy-900 border-navy-700 hover:border-emerald-500/40',
      iconBoxClass: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
      countClass: 'text-emerald-400',
      badgeClass: 'bg-navy-800 text-slate-400 border border-navy-700',
      filterValue: ORDER_STATUS.SUCCESS,
    },
    {
      id: ORDER_STATUS.CANCELLED,
      label: 'Dibatalkan',
      secondaryCode: 'CANCELLED',
      count: summary.cancelled,
      icon: XCircle,
      badgeText: 'Dibatalkan',
      isPrimaryAction: false,
      containerClass: 'bg-navy-900 border-navy-700 hover:border-rose-500/40',
      iconBoxClass: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
      countClass: 'text-rose-400',
      badgeClass: 'bg-navy-800 text-slate-400 border border-navy-700',
      filterValue: ORDER_STATUS.CANCELLED,
    },
    {
      id: 'ALL',
      label: 'Total Pesanan',
      secondaryCode: 'TOTAL',
      count: summary.total,
      icon: ShoppingBag,
      badgeText: 'Semua Status',
      isPrimaryAction: false,
      containerClass: 'bg-navy-900 border-navy-700 hover:border-blue-500/40',
      iconBoxClass: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
      countClass: 'text-blue-400',
      badgeClass: 'bg-navy-800 text-slate-400 border border-navy-700',
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
            className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 hover:-translate-y-0.5 relative group ${
              card.containerClass
            } ${
              isSelected
                ? 'ring-2 ring-blue-500/80 border-blue-500/60 shadow-lg shadow-blue-500/5'
                : ''
            }`}
          >
            {/* Top row: Label & Icon */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-slate-200">
                  {card.label}
                </p>
                <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mt-0.5">
                  {card.secondaryCode}
                </p>
              </div>

              <div
                className={`p-2.5 rounded-xl shrink-0 transition-transform group-hover:scale-105 ${card.iconBoxClass}`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            {/* Middle row: Big number */}
            <div className="mt-4 flex items-baseline justify-between">
              <div className="flex items-center gap-2">
                {card.isPrimaryAction && summary.waiting > 0 && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                  </span>
                )}
                <span
                  className={`text-2xl sm:text-3xl font-bold tracking-tight font-mono ${card.countClass}`}
                >
                  {card.count}
                </span>
              </div>

              <span
                className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${card.badgeClass}`}
              >
                {card.badgeText}
              </span>
            </div>

            {/* Subtle filter hint */}
            <div className="mt-3 pt-2.5 border-t border-navy-700/50 flex items-center justify-between text-[11px] text-slate-400">
              <span className="group-hover:text-slate-200 transition-colors">
                {isSelected ? 'Sedang difilter' : 'Klik untuk filter'}
              </span>
              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
            </div>
          </button>
        );
      })}
    </div>
  );
}
