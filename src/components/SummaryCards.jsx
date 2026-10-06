import { ArrowUpRight } from 'lucide-react';
import { ORDER_STATUS } from '../utils/constants';

/**
 * Strip statistik: satu panel dengan sel berpembatas hairline
 * (2x2 di mobile, 4 kolom di desktop). Tiap sel adalah filter.
 */
export function SummaryCards({
  summary = { waiting: 0, success: 0, cancelled: 0, total: 0 },
  activeFilter = 'ALL',
  onSelectFilter,
}) {
  const cells = [
    {
      label: 'Menunggu Verifikasi',
      code: 'WAITING_VERIFICATION',
      count: summary.waiting,
      note: summary.waiting > 0 ? `${summary.waiting} perlu tindakan` : 'Antrean bersih',
      countClass: 'text-amber-300',
      barClass: 'bg-amber-400',
      filterValue: ORDER_STATUS.WAITING_VERIFICATION,
      pulse: summary.waiting > 0,
    },
    {
      label: 'Berhasil',
      code: 'SUCCESS',
      count: summary.success,
      note: 'Selesai',
      countClass: 'text-emerald-400',
      barClass: 'bg-emerald-400',
      filterValue: ORDER_STATUS.SUCCESS,
    },
    {
      label: 'Dibatalkan',
      code: 'CANCELLED',
      count: summary.cancelled,
      note: 'Dibatalkan',
      countClass: 'text-rose-400',
      barClass: 'bg-rose-400',
      filterValue: ORDER_STATUS.CANCELLED,
    },
    {
      label: 'Total Pesanan',
      code: 'TOTAL',
      count: summary.total,
      note: 'Semua status',
      countClass: 'text-white',
      barClass: 'bg-accent-500',
      filterValue: 'ALL',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-ink-700 border border-ink-700 rounded-xl overflow-hidden">
      {cells.map((c) => {
        const isSelected = activeFilter === c.filterValue;

        return (
          <button
            key={c.code}
            type="button"
            onClick={() => onSelectFilter && onSelectFilter(c.filterValue)}
            className={`relative group text-left p-4 sm:p-5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-500 ${
              isSelected ? 'bg-ink-850' : 'bg-ink-900 hover:bg-ink-850'
            }`}
          >
            <span
              className={`absolute inset-x-0 top-0 h-[3px] ${c.barClass} ${
                isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
              } transition-opacity`}
            />

            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-semibold text-slate-300 leading-snug">{c.label}</p>
              <ArrowUpRight className="w-3.5 h-3.5 shrink-0 text-slate-600 group-hover:text-slate-300 transition-colors" />
            </div>

            <div className="mt-3 sm:mt-4 flex items-center gap-2">
              {c.pulse && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-70"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                </span>
              )}
              <span
                className={`text-3xl sm:text-4xl font-bold font-mono tabular-nums leading-none ${c.countClass}`}
              >
                {c.count}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2 text-[11px]">
              <span className="text-slate-500 truncate">{c.note}</span>
              <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-wider text-slate-600 truncate">
                {isSelected ? 'Aktif' : c.code}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
