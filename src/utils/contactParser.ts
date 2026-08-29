export interface ContactItem {
  id: string;
  raw: string;
  clean: string;
  label: string;
  type: 'phone' | 'zalo' | 'email' | 'facebook' | 'url';
}

/**
 * Universal multi-contact string parser.
 * Supports strings formatted as:
 * - Single value: "0909 876 817"
 * - Multiple comma or newline separated values with optional labels in parentheses:
 *   "0909 876 817 (Phòng Kinh Doanh), 0912 345 678 (Hỗ Trợ Kỹ Thuật 24/7)"
 */
export function parseMultiContact(
  input: string | undefined | null,
  defaultType: 'phone' | 'zalo' | 'email' | 'facebook' = 'phone'
): ContactItem[] {
  if (!input || typeof input !== 'string') return [];

  // Split by comma or newline
  const rawList = input
    .split(/,|\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  return rawList.map((itemStr, idx) => {
    // Check for optional label in parentheses: "0909 876 817 (Kinh Doanh)"
    const match = itemStr.match(/^([^()]+)(?:\(([^()]+)\))?$/);
    let val = itemStr;
    let label = '';

    if (match) {
      val = (match[1] || '').trim();
      label = (match[2] || '').trim();
    }

    let clean = val;
    if (defaultType === 'phone') {
      clean = val.replace(/[^\d+]/g, '');
    } else if (defaultType === 'zalo') {
      if (!val.startsWith('http')) {
        const phoneOnly = val.replace(/[^\d+]/g, '');
        clean = phoneOnly ? `https://zalo.me/${phoneOnly}` : val;
      }
    }

    const defaultLabel =
      rawList.length > 1
        ? defaultType === 'phone'
          ? `Số điện thoại ${idx + 1}`
          : defaultType === 'zalo'
          ? `Kênh Zalo ${idx + 1}`
          : `Liên hệ ${idx + 1}`
        : 'Liên hệ chính';

    return {
      id: `${defaultType}-${idx}-${clean}`,
      raw: val,
      clean,
      label: label || defaultLabel,
      type: defaultType,
    };
  });
}
