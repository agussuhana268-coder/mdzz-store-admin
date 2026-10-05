/**
 * Format currency to Indonesian Rupiah (IDR)
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return 'Rp 0';
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

/**
 * Format date string into Indonesian readable date & time
 */
export function formatDateTime(dateString) {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return String(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  } catch {
    return String(dateString);
  }
}

/**
 * Format date into short format for table
 */
export function formatDateShort(dateString) {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return String(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return String(dateString);
  }
}

/**
 * Safely parse product details whether it is string, JSON string, or object
 */
export function parseProduct(product) {
  if (!product) {
    return {
      name: 'Produk Tidak Diketahui',
      license: '-',
      compatibility: '-',
      raw: null,
    };
  }

  let data = product;

  if (typeof product === 'string') {
    // Attempt JSON parse if it looks like JSON
    if (product.trim().startsWith('{') || product.trim().startsWith('[')) {
      try {
        data = JSON.parse(product);
      } catch {
        // Just a plain title string
        return {
          name: product,
          license: '-',
          compatibility: '-',
          raw: product,
        };
      }
    } else {
      return {
        name: product,
        license: '-',
        compatibility: '-',
        raw: product,
      };
    }
  }

  // If array, take first item or join names
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return { name: '-', license: '-', compatibility: '-', raw: data };
    }
    const first = data[0];
    if (typeof first === 'object' && first !== null) {
      return {
        name: first.name || first.title || first.productName || 'Produk Digital',
        license: first.license || first.licenseType || '-',
        compatibility: first.compatibility || '-',
        raw: data,
      };
    }
    return {
      name: data.join(', '),
      license: '-',
      compatibility: '-',
      raw: data,
    };
  }

  // If object
  if (typeof data === 'object') {
    const name = data.name || data.title || data.productName || data.item || 'Produk Digital';
    const license = data.license || data.licenseType || data.type || '-';
    const compatibility = data.compatibility || data.platform || '-';
    return {
      name,
      license,
      compatibility,
      raw: data,
    };
  }

  return {
    name: String(product),
    license: '-',
    compatibility: '-',
    raw: product,
  };
}

/**
 * Clean phone number for WhatsApp link
 */
export function getWhatsAppUrl(phone, orderId) {
  if (!phone) return null;
  const clean = String(phone).replace(/\D/g, '');
  let formatted = clean;
  if (formatted.startsWith('0')) {
    formatted = '62' + formatted.slice(1);
  }
  const message = encodeURIComponent(`Halo, terkait pesanan #${orderId || ''} di MDZZ Store:`);
  return `https://wa.me/${formatted}?text=${message}`;
}
