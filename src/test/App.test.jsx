import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';
import * as adminApi from '../api/adminApi';

vi.mock('../api/adminApi', () => ({
  login: vi.fn(),
  getOrders: vi.fn(),
  completeOrder: vi.fn(),
  cancelOrder: vi.fn(),
}));

describe('App Integration', () => {
  const mockOrders = [
    {
      id: 'ORD-101',
      customerName: 'Ahmad Dahlan',
      customerContact: '08123456789',
      product: { name: 'Windows 11 Pro', license: 'Retail', compatibility: 'PC' },
      total: 125000,
      paymentMethod: 'DANA QRIS',
      status: 'WAITING_VERIFICATION',
      createdAt: '2026-10-05T08:00:00Z',
    },
    {
      id: 'ORD-102',
      customerName: 'Dewi Sartika',
      customerContact: '08198765432',
      product: 'Office 365 Personal',
      total: 350000,
      paymentMethod: 'DANA QRIS',
      status: 'SUCCESS',
      createdAt: '2026-10-05T09:00:00Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login screen when unauthenticated', () => {
    render(<App />);

    expect(screen.getByText('Mdzz Store')).toBeInTheDocument();
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    expect(
      screen.getByText('Login untuk mengelola pesanan toko.')
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Masukkan password admin')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /masuk dashboard/i })
    ).toBeInTheDocument();
  });

  it('handles login flow, transitions to dashboard, and displays orders', async () => {
    adminApi.login.mockResolvedValueOnce({
      success: true,
      token: 'valid-session-token-xyz',
      expiresIn: 14400,
    });
    adminApi.getOrders.mockResolvedValue({
      success: true,
      orders: mockOrders,
    });

    render(<App />);

    const passwordInput = screen.getByPlaceholderText(
      'Masukkan password admin'
    );
    const submitBtn = screen.getByRole('button', { name: /masuk dashboard/i });

    fireEvent.change(passwordInput, { target: { value: 'mypassword' } });
    fireEvent.click(submitBtn);

    // Dashboard header should appear
    await waitFor(() => {
      expect(screen.getByText('Connected')).toBeInTheDocument();
    });

    // Orders and summary should be visible
    expect(screen.getByText('Daftar Pesanan')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getAllByText(/ORD-101/)[0]).toBeInTheDocument();
    });
    expect(screen.getAllByText('Ahmad Dahlan')[0]).toBeInTheDocument();
    expect(screen.getAllByText(/ORD-102/)[0]).toBeInTheDocument();
    expect(screen.getAllByText('Dewi Sartika')[0]).toBeInTheDocument();
  });

  it('opens confirmation modal and executes complete order flow', async () => {
    adminApi.login.mockResolvedValueOnce({
      success: true,
      token: 'valid-session-token-xyz',
      expiresIn: 14400,
    });
    adminApi.getOrders.mockResolvedValue({
      success: true,
      orders: mockOrders,
    });
    adminApi.completeOrder.mockResolvedValueOnce({ success: true });

    render(<App />);

    fireEvent.change(screen.getByPlaceholderText('Masukkan password admin'), {
      target: { value: 'mypassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: /masuk dashboard/i }));

    await waitFor(() => {
      expect(screen.getAllByText(/ORD-101/)[0]).toBeInTheDocument();
    });

    // Click "Selesaikan" button for WAITING_VERIFICATION order
    const completeBtns = screen.getAllByRole('button', { name: /selesaikan/i });
    fireEvent.click(completeBtns[0]);

    // Confirmation modal should be visible
    expect(
      screen.getByText('Konfirmasi Selesaikan Pesanan')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Apakah pembayaran order ini sudah diverifikasi di DANA Business?'
      )
    ).toBeInTheDocument();

    // Click confirm in modal
    const confirmActionBtn = screen.getByRole('button', {
      name: 'Ya, Selesaikan',
    });
    fireEvent.click(confirmActionBtn);

    await waitFor(() => {
      expect(adminApi.completeOrder).toHaveBeenCalledWith(
        'valid-session-token-xyz',
        'ORD-101',
        expect.any(Object)
      );
    });
  });

  it('logs out and returns to login view when Keluar is clicked', async () => {
    adminApi.login.mockResolvedValueOnce({
      success: true,
      token: 'valid-session-token-xyz',
      expiresIn: 14400,
    });
    adminApi.getOrders.mockResolvedValue({
      success: true,
      orders: mockOrders,
    });

    render(<App />);

    fireEvent.change(screen.getByPlaceholderText('Masukkan password admin'), {
      target: { value: 'mypassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: /masuk dashboard/i }));

    await waitFor(() => {
      expect(screen.getByText('Connected')).toBeInTheDocument();
    });

    // Click Keluar
    const logoutBtn = screen.getByRole('button', { name: /keluar/i });
    fireEvent.click(logoutBtn);

    // Should return to login view
    await waitFor(() => {
      expect(
        screen.getByPlaceholderText('Masukkan password admin')
      ).toBeInTheDocument();
    });
  });

  it('automatically logs out to login screen when 401 Unauthorized occurs', async () => {
    adminApi.login.mockResolvedValueOnce({
      success: true,
      token: 'expired-session-token',
      expiresIn: 14400,
    });
    // First call succeeds, next call triggers 401
    adminApi.getOrders
      .mockResolvedValueOnce({ success: true, orders: mockOrders })
      .mockImplementationOnce(async (_tok, _status, options) => {
        if (options?.onUnauthorized) options.onUnauthorized();
        const err = new Error('Sesi admin telah berakhir.');
        err.status = 401;
        throw err;
      });

    render(<App />);

    fireEvent.change(screen.getByPlaceholderText('Masukkan password admin'), {
      target: { value: 'mypassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: /masuk dashboard/i }));

    await waitFor(() => {
      expect(screen.getByText('Connected')).toBeInTheDocument();
    });

    // Click refresh to trigger the second call which returns 401
    const refreshBtn = screen.getByRole('button', { name: /refresh/i });
    fireEvent.click(refreshBtn);

    // Should automatically log out and show session expired notice on login screen
    await waitFor(() => {
      expect(
        screen.getByText('Sesi admin telah berakhir. Silakan login kembali.')
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Masukkan password admin')
      ).toBeInTheDocument();
    });
  });
});
