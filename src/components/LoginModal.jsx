import { useState } from 'react';
import { Shield, Lock, Loader2, AlertCircle } from 'lucide-react';

/**
 * Professional login screen for MDZZ Store Admin Dashboard
 */
export function LoginModal({ onLogin, isLoggingIn, loginError, sessionExpiredMessage }) {
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim() || isLoggingIn) return;
    
    const pwd = password;
    setPassword(''); // Clear password input immediately for security
    await onLogin(pwd);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-slate-100">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-4 shadow-lg shadow-indigo-500/5">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            MDZZ Store
          </h1>
          <p className="text-sm font-medium text-indigo-400 tracking-wide mt-1 uppercase">
            Admin Dashboard
          </p>
          <p className="text-sm text-slate-400 mt-2">
            Login untuk mengelola pesanan toko.
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-950/50 backdrop-blur-md">
          {/* Session Expired Notice if applicable */}
          {sessionExpiredMessage && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-3 p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-sm"
            >
              <AlertCircle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
              <span>{sessionExpiredMessage}</span>
            </div>
          )}

          {/* Login Error Notice */}
          {loginError && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-3 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-sm"
            >
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
              >
                Password Admin
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password admin"
                  autoFocus
                  required
                  disabled={isLoggingIn}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn || !password.trim()}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <span>Masuk Dashboard</span>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          Sesi admin bersifat sementara di memori dan tidak disimpan di browser.
        </p>
      </div>
    </div>
  );
}
