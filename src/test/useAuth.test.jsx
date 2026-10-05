import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '../hooks/useAuth';
import * as adminApi from '../api/adminApi';

vi.mock('../api/adminApi', () => ({
  login: vi.fn(),
}));

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('initializes with unauthenticated state and null token', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoggingIn).toBe(false);
    expect(result.current.loginError).toBeNull();
    expect(result.current.sessionExpiredMessage).toBeNull();
  });

  it('handles login success and stores token strictly in React in-memory state', async () => {
    adminApi.login.mockResolvedValueOnce({
      success: true,
      token: 'mock-session-token-xyz',
      expiresIn: 14400,
    });

    const { result } = renderHook(() => useAuth());

    let success;
    await act(async () => {
      success = await result.current.login('test-password');
    });

    expect(success).toBe(true);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.token).toBe('mock-session-token-xyz');
    expect(result.current.loginError).toBeNull();

    // Verify token is NOT written to browser storage
    expect(localStorage.getItem('token')).toBeNull();
    expect(sessionStorage.getItem('token')).toBeNull();
    expect(localStorage.length).toBe(0);
    sessionStorage.clear();
  });

  it('handles login error cleanly without crashing', async () => {
    adminApi.login.mockRejectedValueOnce(
      new Error('Password salah atau server sedang bermasalah.')
    );

    const { result } = renderHook(() => useAuth());

    let success;
    await act(async () => {
      success = await result.current.login('wrong-password');
    });

    expect(success).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.token).toBeNull();
    expect(result.current.loginError).toBe(
      'Password salah atau server sedang bermasalah.'
    );
  });

  it('rejects empty password gracefully', async () => {
    const { result } = renderHook(() => useAuth());

    let success;
    await act(async () => {
      success = await result.current.login('   ');
    });

    expect(success).toBe(false);
    expect(result.current.loginError).toBe('Password tidak boleh kosong.');
    expect(adminApi.login).not.toHaveBeenCalled();
  });

  it('logs out and clears token from memory', async () => {
    adminApi.login.mockResolvedValueOnce({
      success: true,
      token: 'mock-token',
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('pass');
    });

    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.token).toBeNull();
    expect(result.current.sessionExpiredMessage).toBeNull();
  });

  it('triggers logout and displays session expired notice on unauthorized (401)', async () => {
    adminApi.login.mockResolvedValueOnce({
      success: true,
      token: 'mock-token',
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('pass');
    });

    act(() => {
      result.current.handleUnauthorized();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.token).toBeNull();
    expect(result.current.sessionExpiredMessage).toBe(
      'Sesi admin telah berakhir. Silakan login kembali.'
    );
  });
});
