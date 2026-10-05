import { RefreshCw, LogOut, ShieldCheck } from 'lucide-react';

/**
 * Header component for MDZZ Store Admin Dashboard
 */
export function Header({
  isConnected = true,
  isRefreshing = false,
  onRefresh,
  onLogout,
}) {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  MDZZ Store
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-slate-800 text-indigo-400 border border-indigo-500/20 rounded-full">
                  Admin
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Dashboard Verifikasi Pesanan
              </p>
            </div>
          </div>

          {/* Status & Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Connection Indicator */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                isConnected
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                }`}
              />
              <span className="hidden xs:inline">
                {isConnected ? 'Connected' : 'Sesi Berakhir'}
              </span>
            </div>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              aria-label="Refresh data pesanan"
              title="Refresh pesanan"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {/* Logout Button */}
            <button
              type="button"
              onClick={onLogout}
              aria-label="Keluar dari sesi admin"
              title="Logout"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-rose-300 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
