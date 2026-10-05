import { LayoutDashboard, ShoppingBag, LogOut, ShieldCheck, X, Zap } from 'lucide-react';

/**
 * Modern compact sidebar for MDZZ Store Admin Dashboard
 * Supports desktop fixed sidebar and mobile drawer navigation.
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
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingBag,
      badge: waitingCount > 0 ? `${waitingCount} perlu dicek` : totalCount > 0 ? String(totalCount) : null,
      badgeClass:
        waitingCount > 0
          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
          : 'bg-navy-800 text-slate-400 border border-navy-700',
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-navy-900 border-r border-navy-700/80 w-64 select-none">
      {/* Top Branding */}
      <div className="p-6 border-b border-navy-700/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-sm shadow-blue-500/10">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-wider text-white uppercase flex items-center gap-1.5">
              <span>MDZZ STORE</span>
            </div>
            <p className="text-[11px] font-medium text-blue-400/90 tracking-wide uppercase">
              Admin Panel
            </p>
          </div>
        </div>

        {/* Mobile close button */}
        {isOpenMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Tutup menu navigasi"
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Navigation */}
      <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Menu Utama
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
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-blue-600/15 text-blue-300 border border-blue-500/30 shadow-sm shadow-blue-500/5'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-navy-800/80 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${item.badgeClass}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info & Logout */}
      <div className="p-4 border-t border-navy-700/60 space-y-3 bg-navy-950/40">
        {/* Session Status Card */}
        <div className="p-3 rounded-xl bg-navy-800/60 border border-navy-700/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <div>
              <p className="text-[11px] font-medium text-slate-200">Sesi Aktif</p>
              <p className="text-[10px] text-slate-400">HMAC In-Memory</p>
            </div>
          </div>
          <div className="text-blue-400 p-1 bg-blue-500/10 rounded-md">
            <Zap className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={onLogout}
          aria-label="Keluar dari sesi admin"
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-medium text-rose-300 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed Left) */}
      <aside className="hidden md:flex shrink-0 sticky top-0 h-screen z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Overlay) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-fade-in">
          <div
            className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative z-10 animate-slide-in h-full flex">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
