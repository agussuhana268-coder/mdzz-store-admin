import { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

/**
 * Polished Toast notification component
 * Deep navy theme with clear semantic colors and smooth dismiss.
 */
export function Toast({ toasts = [], onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration || 4500);

    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />,
    error: <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />,
    info: <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />,
  };

  const bgStyles = {
    success: 'bg-navy-900 border-emerald-500/30 text-emerald-200 shadow-lg shadow-navy-950/60',
    error: 'bg-navy-900 border-rose-500/30 text-rose-200 shadow-lg shadow-navy-950/60',
    warning: 'bg-navy-900 border-amber-500/30 text-amber-200 shadow-lg shadow-navy-950/60',
    info: 'bg-navy-900 border-blue-500/30 text-blue-200 shadow-lg shadow-navy-950/60',
  };

  const currentType = toast.type || 'info';

  return (
    <div
      role="alert"
      className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border backdrop-blur-md shadow-xl transition-all duration-200 animate-slide-in ${
        bgStyles[currentType] || bgStyles.info
      }`}
    >
      {icons[currentType] || icons.info}
      <div className="flex-1 text-xs font-medium text-slate-100 pr-1 leading-snug">
        {toast.message}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Tutup notifikasi"
        className="text-slate-400 hover:text-slate-200 p-0.5 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
