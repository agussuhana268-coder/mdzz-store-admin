import { RefreshCw, Menu } from 'lucide-react';

/**
 * Topbar Header for MDZZ Store Admin Dashboard
 * Displays page title, connection status indicator, and quick actions.
 */
export function Header({
  title = 'Overview & Pesanan',
  description = 'Kelola transaksi dan verifikasi pembayaran pelanggan MDZZ Store',
  isConnected = true,
  isRefreshing = false,
  onRefresh,
  onToggleMobileMenu,
}) {
  return (
    <header className="sticky top-0 z-20 bg-navy-950/85 backdrop-blur-md border-b border-navy-700/80 px-4 sm:px-6 lg:px-8 py-3.5 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Context */}
        <div className="flex items-center gap-3">
          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={onToggleMobileMenu}
            aria-label="Buka menu navigasi"
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white bg-navy-900 border border-navy-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs uppercase tracking-widest text-blue-400 hidden sm:inline">
                MDZZ STORE /
              </span>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {title}
              </h1>
            </div>
            {description && (
              <p className="text-xs text-slate-400 hidden sm:block mt-0.5">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Right: Status Indicator & Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Subtle Connection Status Indicator */}
          <div
            className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-navy-900/90 border border-navy-700/80 text-xs font-medium"
            title={isConnected ? 'Terhubung ke server Cloudflare' : 'Koneksi terputus'}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected
                  ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50 animate-pulse'
                  : 'bg-rose-500 shadow-sm shadow-rose-500/50'
              }`}
            />
            <span className="text-slate-300">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label="Refresh data pesanan"
            title="Refresh data pesanan"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-navy-900 hover:bg-navy-850 border border-navy-700 hover:border-navy-600 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                isRefreshing ? 'animate-spin text-blue-400' : 'text-slate-400'
              }`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>
    </header>
  );
}
