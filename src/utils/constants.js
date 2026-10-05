export const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ||
  'https://mdzz-store-api.agussuhana268.workers.dev';

export const ORDER_STATUS = {
  WAITING_VERIFICATION: 'WAITING_VERIFICATION',
  SUCCESS: 'SUCCESS',
  CANCELLED: 'CANCELLED',
  PENDING_PAYMENT: 'PENDING_PAYMENT',
};

export const FILTER_OPTIONS = [
  { label: 'Semua', value: 'ALL' },
  { label: 'Menunggu Verifikasi', value: ORDER_STATUS.WAITING_VERIFICATION },
  { label: 'Berhasil', value: ORDER_STATUS.SUCCESS },
  { label: 'Dibatalkan', value: ORDER_STATUS.CANCELLED },
];

export const STATUS_CONFIG = {
  [ORDER_STATUS.WAITING_VERIFICATION]: {
    label: 'Menunggu Verifikasi',
    badgeClass: 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-medium',
    dotClass: 'bg-amber-400 animate-pulse',
    description: 'Pembayaran perlu diverifikasi di DANA Business',
  },
  [ORDER_STATUS.SUCCESS]: {
    label: 'Berhasil',
    badgeClass: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-medium',
    dotClass: 'bg-emerald-400',
    description: 'Pesanan telah selesai',
  },
  [ORDER_STATUS.CANCELLED]: {
    label: 'Dibatalkan',
    badgeClass: 'bg-rose-500/15 text-rose-400 border border-rose-500/30 font-medium',
    dotClass: 'bg-rose-400',
    description: 'Pesanan dibatalkan',
  },
  [ORDER_STATUS.PENDING_PAYMENT]: {
    label: 'Menunggu Pembayaran',
    badgeClass: 'bg-slate-500/15 text-slate-400 border border-slate-500/30 font-medium',
    dotClass: 'bg-slate-400',
    description: 'Customer belum melakukan pembayaran',
  },
};

export const POLLING_INTERVAL_MS = 15000; // 15 detik
