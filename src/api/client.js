import { API_BASE_URL } from '../utils/constants';

export class ApiError extends Error {
  constructor(message, status = 0, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Maps HTTP status codes to user-friendly messages without exposing internal stack traces
 */
export function getFriendlyErrorMessage(status, serverMessage = '') {
  if (status === 401) {
    return 'Sesi admin telah berakhir. Silakan login kembali.';
  }
  if (status === 403) {
    return 'Akses ditolak. Anda tidak memiliki izin untuk tindakan ini.';
  }
  if (status === 404) {
    return 'Data atau pesanan tidak ditemukan.';
  }
  if (status === 429) {
    return 'Terlalu banyak permintaan. Mohon tunggu beberapa saat.';
  }
  if (status >= 500) {
    return 'Server sedang bermasalah. Coba lagi.';
  }
  if (serverMessage && typeof serverMessage === 'string' && serverMessage.length <= 150) {
    return serverMessage;
  }
  return 'Terjadi masalah saat memproses permintaan.';
}

/**
 * Base fetch client for MDZZ Store Admin API
 * Never logs credentials, tokens, or sensitive headers.
 */
export async function apiClient(endpoint, {
  token = null,
  method = 'GET',
  body = null,
  headers = {},
  signal = null,
  onUnauthorized = null,
} = {}) {
  const url = `${API_BASE_URL.replace(/\/+$/, '')}${endpoint}`;

  const requestHeaders = {
    Accept: 'application/json',
    ...headers,
  };

  if (body !== null && typeof body === 'object') {
    requestHeaders['Content-Type'] = 'application/json';
  }

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (err) {
    if (err && err.name === 'AbortError') {
      throw err;
    }
    // Network or server unreachable error
    throw new ApiError('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.', 0);
  }

  let responseData = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      responseData = await response.json();
    } catch {
      responseData = null;
    }
  } else {
    try {
      const text = await response.text();
      responseData = { message: text };
    } catch {
      responseData = null;
    }
  }

  if (response.status === 401) {
    if (typeof onUnauthorized === 'function') {
      onUnauthorized();
    }
    const message = responseData?.error || responseData?.message || getFriendlyErrorMessage(401);
    throw new ApiError(message, 401, responseData);
  }

  if (!response.ok) {
    const serverMsg = responseData?.error || responseData?.message;
    const friendlyMsg = getFriendlyErrorMessage(response.status, serverMsg);
    throw new ApiError(friendlyMsg, response.status, responseData);
  }

  return responseData;
}
