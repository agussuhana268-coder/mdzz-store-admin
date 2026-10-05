import { useState, useCallback } from 'react';
import { login as apiLogin } from '../api/adminApi';

/**
 * Custom hook to manage admin authentication.
 * State is strictly in-memory (never persisted to localStorage/sessionStorage).
 */
export function useAuth() {
  const [token, setToken] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [sessionExpiredMessage, setSessionExpiredMessage] = useState(null);

  const isAuthenticated = Boolean(token);

  const login = useCallback(async (password) => {
    if (!password || !password.trim()) {
      setLoginError('Password tidak boleh kosong.');
      return false;
    }

    setIsLoggingIn(true);
    setLoginError(null);
    setSessionExpiredMessage(null);

    try {
      const res = await apiLogin(password.trim());
      if (res && res.token) {
        // Save session token strictly in React in-memory state
        setToken(res.token);
        return true;
      }
      setLoginError('Respon server tidak valid.');
      return false;
    } catch (err) {
      const message = err?.message || 'Password salah atau server sedang bermasalah.';
      setLoginError(message);
      return false;
    } finally {
      setIsLoggingIn(false);
    }
  }, []);

  const logout = useCallback((reason = null) => {
    // Clear session token from React memory
    setToken(null);
    setLoginError(null);
    if (reason) {
      setSessionExpiredMessage(reason);
    } else {
      setSessionExpiredMessage(null);
    }
  }, []);

  const handleUnauthorized = useCallback(() => {
    logout('Sesi admin telah berakhir. Silakan login kembali.');
  }, [logout]);

  return {
    token,
    isAuthenticated,
    isLoggingIn,
    loginError,
    sessionExpiredMessage,
    login,
    logout,
    handleUnauthorized,
  };
}
