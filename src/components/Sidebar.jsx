import { LayoutDashboard, ShoppingBag, LogOut, X } from 'lucide-react';

/**
 * Sidebar MDZZ Store Admin.
 * Desktop: tetap di kiri. Mobile: drawer overlay.
 */
export function Sidebar({
  activeTab = 'orders',
  onSelectTab,
  waitingCount = 0,
  totalCount = 0,
  isOpenMobile = false,
  onCloseMobile,
  onLogout,
}) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: null },
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingBag,
      badge: waitingCount > 0 ? `${waitingCount} perlu dicek` : totalCount > 0 ? String(totalCount) : null,
      badgeClass:
        waitingCount > 0
          ? 'bg-amber-500/15 text-amber-300'
          : 'bg-ink-800 text-slate-400',
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full w-64 max-w-[85vw] bg-ink-900 border-r border-ink-700 select-none safe-top safe-bottom">
      {/* Brand */}
      <div className="h-16 px-5 border-b border-ink-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent-500 text-ink-950 grid place-items-center font-extrabold text-lg">
            M
          </div>
          <div className="leading-tight">
            <div className="font-extrabold text-sm text-white tracking-tight">Mdzz STORE</div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
              Admin Panel
            </p>
          </div>
        </div>

        {isOpenMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Tutup menu navigasi"
            className="md:hidden p-2 -mr-2 rounded-lg text-slate-400 hover:text-white hover:bg-ink-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigasi */}
      <nav className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
          Menu
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectTab && onSelectTab(item.id);
                if (isOpenMobile && onCloseMobile) onCloseMobile();
              }}
              className={`relative w-full flex items-center justify-between pl-4 pr-3 h-11 rounded-lg text-sm font-semibold transition-colors group ${
                isActive
                  ? 'bg-ink-800 text-white'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-ink-850'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-r bg-accent-500" />
              )}
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-accent-400' : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-medium ${item.badgeClass}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-ink-700 space-y-3">
        <div className="flex items-center gap-2.5 px-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <p className="text-xs text-slate-300">Sesi aktif</p>
          <span className="ml-auto font-mono text-[10px] text-slate-500">HMAC</span>
        </div>

        <button
          type="button"
          onClick={onLogout}
          aria-label="Keluar dari sesi admin"
          className="w-full h-10 flex items-center justify-center gap-2 text-xs font-semibold text-slate-300 hover:text-rose-300 border border-ink-700 hover:border-rose-500/40 hover:bg-rose-500/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:flex shrink-0 sticky top-0 h-[100dvh] z-20">
        {sidebarContent}
      </aside>

      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-fade-in">
          <div
            className="fixed inset-0 bg-ink-950/80"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative z-10 animate-slide-in h-full flex">{sidebarContent}</div>
        </div>
      )}
    </>
  );
}
