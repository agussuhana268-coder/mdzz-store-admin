import { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

/**
 * Toast notification component
 * Renders floating toasts in top-right or bottom-right corner.
 */
export function Toast({ toasts = [], onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
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
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <XCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-400 shrink-0" />,
  };

  const bgStyles = {
    success: 'bg-slate-900/95 border-emerald-500/30 text-emerald-200 shadow-emerald-950/20',
    error: 'bg-slate-900/95 border-rose-500/30 text-rose-200 shadow-rose-950/20',
    warning: 'bg-slate-900/95 border-amber-500/30 text-amber-200 shadow-amber-950/20',
    info: 'bg-slate-900/95 border-sky-500/30 text-sky-200 shadow-sky-950/20',
  };

  const currentType = toast.type || 'info';

  return (
    <div
      role="alert"
      className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border backdrop-blur-md shadow-lg transition-all duration-200 animate-slide-in ${
        bgStyles[currentType] || bgStyles.info
      }`}
    >
      {icons[currentType] || icons.info}
      <div className="flex-1 text-sm font-medium text-slate-100 pr-1 leading-snug">
        {toast.message}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Tutup notifikasi"
        className="text-slate-400 hover:text-slate-200 p-0.5 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
