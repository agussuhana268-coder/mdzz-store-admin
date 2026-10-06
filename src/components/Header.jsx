import { RefreshCw, Menu } from 'lucide-react';

/**
 * Topbar: judul halaman, status koneksi, tombol refresh.
 */
export function Header({
  title = 'Overview & Pesanan',
  description = 'Kelola transaksi dan verifikasi pembayaran pelanggan',
  isConnected = true,
  isRefreshing = false,
  onRefresh,
  onToggleMobileMenu,
}) {
  return (
    <header className="sticky top-0 z-20 bg-ink-950/90 backdrop-blur border-b border-ink-700 px-4 sm:px-6 lg:px-8 h-16 flex items-center safe-top">
      <div className="flex w-full items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            aria-label="Buka menu navigasi"
            className="md:hidden h-10 w-10 grid place-items-center rounded-lg text-slate-300 hover:text-white bg-ink-900 border border-ink-700 focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
            
              </span>
              <h1 className="text-base sm:text-lg font-extrabold text-white truncate">{title}</h1>
            </div>
            {description && (
              <p className="text-xs text-slate-500 hidden lg:block mt-0.5 truncate">{description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div
            className="flex items-center gap-2 h-9 px-3 rounded-lg bg-ink-900 border border-ink-700 text-xs font-medium"
            title={isConnected ? 'Terhubung ke server Cloudflare' : 'Koneksi terputus'}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <span className="text-slate-300 hidden xs:inline">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label="Refresh data pesanan"
            title="Refresh data pesanan"
            className="inline-flex items-center gap-2 h-9 px-3 text-xs font-semibold text-slate-200 hover:text-white bg-ink-900 hover:bg-ink-800 border border-ink-700 hover:border-ink-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-accent-400' : 'text-slate-400'}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>
    </header>
  );
}
