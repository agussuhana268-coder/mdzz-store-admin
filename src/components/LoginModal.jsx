import { useState } from 'react';
import { Lock, Loader2, AlertCircle, Eye, EyeOff, ArrowRight } from 'lucide-react';

const REMEMBER_KEY = 'mdzz_admin_remember';

// Baca/tulis storage selalu dibungkus try/catch (mode privat / storage diblokir)
function readSaved() {
  try {
    return localStorage.getItem(REMEMBER_KEY) || '';
  } catch {
    return '';
  }
}
function writeSaved(value) {
  try {
    if (value) localStorage.setItem(REMEMBER_KEY, value);
    else localStorage.removeItem(REMEMBER_KEY);
  } catch {
    /* abaikan */
  }
}

/**
 * Halaman login MDZZ Store Admin.
 * Desktop: split-screen (panel brand + form). Mobile: satu kolom penuh.
 * "Ingat saya" menyimpan password di browser ini agar tidak perlu mengetik ulang.
 */
export function LoginModal({ onLogin, isLoggingIn, loginError, sessionExpiredMessage }) {
  const [password, setPassword] = useState(() => readSaved());
  const [remember, setRemember] = useState(() => Boolean(readSaved()));
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim() || isLoggingIn) return;

    const pwd = password;
    if (!remember) setPassword(''); // tanpa "ingat saya": bersihkan segera
    const ok = await onLogin(pwd);

    // Simpan hanya jika login berhasil; hapus jika gagal / tidak dicentang
    writeSaved(ok && remember ? pwd : '');
  };

  return (
    <div className="min-h-[100dvh] grid lg:grid-cols-[1.15fr_1fr] bg-ink-950 text-slate-100">
      {/* Panel brand — hanya tampil di desktop */}
      <aside
        className="hidden lg:flex relative flex-col justify-between p-12 xl:p-16 bg-ink-900 border-r border-ink-700 bg-grid"
        aria-hidden="true"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent-500 text-ink-950 grid place-items-center font-extrabold text-lg">
            M
          </div>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">
            Office dashboard
          </span>
        </div>

        <div className="max-w-lg">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent-400 mb-5">
            
          </p>
          <h2 className="text-4xl xl:text-5xl font-extrabold leading-[1.08] text-white">
            Mdzz <span className="text-accent-400">Xiters</span>
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-slate-400 max-w-md">
            Pantau pembayaran, verifikasi Rekening Business,
            dan tutup pesanan pelanggan dari satu layar yang ringkas.
          </p>
        </div>

        <dl className="grid grid-cols-3 gap-6 border-t border-ink-700 pt-6">
          {[
            ['15 dtk', 'Auto-refresh'],
            ['HMAC', 'Sesi aman'],
            ['Realtime', 'Antrean pesanan'],
          ].map(([v, l]) => (
            <div key={l}>
              <dt className="font-mono text-lg font-semibold text-white">{v}</dt>
              <dd className="text-[11px] text-slate-500 mt-0.5">{l}</dd>
            </div>
          ))}
        </dl>
      </aside>

      {/* Form login */}
      <main className="flex items-center justify-center px-5 py-10 sm:px-8 safe-top safe-bottom">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <div className="lg:hidden w-10 h-10 rounded-lg bg-accent-500 text-ink-950 grid place-items-center font-extrabold text-xl mb-5">
              M
            </div>
            <h1 className="text-2xl sm:text-[28px] font-extrabold text-white">Mdzz Store</h1>
            <p className="text-sm font-semibold text-accent-400 mt-1">Admin Dashboard</p>
            <p className="text-sm text-slate-400 mt-3">
              Masuk untuk mengelola pesanan.
              <span className="sr-only">Login untuk mengelola pesanan toko.</span>
            </p>
          </div>

          {sessionExpiredMessage && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-3 p-3.5 bg-amber-500/10 border border-amber-500/25 rounded-lg text-amber-300 text-xs"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <span>{sessionExpiredMessage}</span>
            </div>
          )}

          {loginError && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-3 p-3.5 bg-rose-500/10 border border-rose-500/25 rounded-lg text-rose-300 text-xs"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold text-slate-300 mb-2"
              >
                Password Admin
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>

                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password admin"
                  autoFocus
                  required
                  disabled={isLoggingIn}
                  className="w-full pl-10 pr-11 h-12 bg-ink-900 border border-ink-700 hover:border-ink-600 rounded-lg text-white placeholder-slate-500 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/70 focus:border-accent-500 disabled:opacity-50 transition-colors font-mono"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                  className="absolute inset-y-0 right-0 w-11 flex items-center justify-center text-slate-500 hover:text-slate-200 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <label
              htmlFor="remember-me"
              className="flex items-start gap-3 cursor-pointer select-none"
            >
              <input
                id="remember-me"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                disabled={isLoggingIn}
                className="mt-0.5 h-4 w-4 rounded border-ink-600 bg-ink-900 accent-accent-500 cursor-pointer"
              />
              <span>
                <span className="block text-sm text-slate-200">Ingat saya</span>
                <span className="block text-[11px] text-slate-500 mt-0.5">
                  Password disimpan di browser ini. Jangan aktifkan di perangkat bersama.
                </span>
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoggingIn || !password.trim()}
              aria-label="Masuk Dashboard"
              className="w-full h-12 flex items-center justify-center gap-2 px-4 bg-accent-500 hover:bg-accent-400 text-ink-950 font-bold text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-ink-950 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-[11px] text-slate-500 mt-8 leading-relaxed">
            Token sesi hanya disimpan di memori. Password tersimpan hanya jika &ldquo;Ingat
            saya&rdquo; dicentang.
          </p>
        </div>
      </main>
    </div>
  );
}
