import { useState } from 'react';
import { Lock, Loader2, AlertCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';

/**
 * Premium login screen for MDZZ Store Admin Dashboard
 * Deep navy theme with subtle ambient glow and show/hide password toggle.
 */
export function LoginModal({ onLogin, isLoggingIn, loginError, sessionExpiredMessage }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim() || isLoggingIn) return;

    const pwd = password;
    setPassword(''); // Clear password immediately from component state
    await onLogin(pwd);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-navy-950 text-slate-100 relative overflow-hidden">
      {/* Subtle ambient background glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-sky-500/5 rounded-full blur-2xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/15 border border-blue-500/30 text-blue-400 mb-4 shadow-lg shadow-blue-500/10">
            <ShieldCheck className="w-7 h-7" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white uppercase">
            MDZZ Store
          </h1>

          <p className="text-xs font-semibold text-blue-400 tracking-widest mt-1 uppercase">
            Admin Dashboard
          </p>

          <p className="text-xs text-slate-400 mt-2">
            Masuk untuk mengelola pesanan.
            <span className="sr-only">Login untuk mengelola pesanan toko.</span>
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-navy-900 border border-navy-700 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-navy-950/80">
          {/* Session Expired Notice */}
          {sessionExpiredMessage && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-3 p-3.5 bg-amber-500/10 border border-amber-500/25 rounded-xl text-amber-300 text-xs"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <span>{sessionExpiredMessage}</span>
            </div>
          )}

          {/* Login Error Notice */}
          {loginError && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-3 p-3.5 bg-rose-500/10 border border-rose-500/25 rounded-xl text-rose-300 text-xs"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="admin-password"
                className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-2"
              >
                Password Admin
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>

                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password admin"
                  autoFocus
                  required
                  disabled={isLoggingIn}
                  className="w-full pl-10 pr-10 py-2.5 bg-navy-950/80 border border-navy-700 hover:border-navy-600 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 transition-colors font-mono"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn || !password.trim()}
              aria-label="Masuk Dashboard"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-600/25 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-navy-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <span>Masuk ke Dashboard</span>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-slate-500 mt-6">
          Sesi admin bersifat sementara di memori dan tidak disimpan di browser.
        </p>
      </div>
    </div>
  );
}
