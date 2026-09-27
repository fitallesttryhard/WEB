import { supabase } from './supabaseClient';

export const SBUILD_TENANT_ID = '00000000-0000-0000-0000-000000000002';
const LOCAL_STORAGE_KEY = 'sbuild_material_subcategories';

export const DEFAULT_SUBCATEGORIES: Record<string, string[]> = {
  'Nẹp nhôm': [
    'Nẹp nhôm chữ V góc',
    'Nẹp nhôm chữ U trang trí',
    'Nẹp nhôm chữ T trang trí',
    'Nẹp nhôm bo góc gạch men',
    'Nẹp nhôm chống trơn sàn',
    'Nẹp nhôm lập là / la nhôm',
    'Nẹp nhôm chữ L kết thúc'
  ],
  'Nẹp inox': [
    'Nẹp inox chữ V',
    'Nẹp inox chữ U',
    'Nẹp inox chữ T',
    'Nẹp inox bo góc tròn',
    'Nẹp inox la phẳng'
  ],
  'Nẹp nhựa': [
    'Nẹp nhựa PVC bo góc tròn',
    'Nẹp nhựa chữ V',
    'Nẹp chỉ ngắt nước',
    'Nẹp trát tường & góc bả'
  ],
  'Dụng cụ': [
    'Bay răng cưa',
    'Kìm siết ke cân bằng',
    'Búa cao su',
    'Thước nivo & ke góc'
  ],
  'Phụ kiện': [
    'Ke cân bằng gạch',
    'Nêm chêm cân bằng',
    'Nút bịt đầu nẹp',
    'Khung & phụ kiện giàn giáo'
  ],
  'Hóa chất': [
    'Keo dán gạch',
    'Keo chà ron',
    'Keo dán nẹp chuyên dụng',
    'Phụ gia chống thấm'
  ]
};

// Global in-memory cache
let cachedSubcategoriesMap: Record<string, string[]> | null = null;

/**
 * Tải danh mục con từ Cache / LocalStorage / Supabase
 */
export async function getSubcategoriesMap(): Promise<Record<string, string[]>> {
  if (cachedSubcategoriesMap) {
    return cachedSubcategoriesMap;
  }

  // 1. Thử đọc từ localStorage
  if (typeof window !== 'undefined') {
    try {
      const local = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (local) {
        const parsed = JSON.parse(local);
        if (parsed && typeof parsed === 'object') {
          cachedSubcategoriesMap = { ...DEFAULT_SUBCATEGORIES, ...parsed };
          return cachedSubcategoriesMap;
        }
      }
    } catch {
      // Bỏ qua lỗi parse
    }
  }

  // 2. Thử đọc từ Supabase tenant_settings
  try {
    const { data, error } = await supabase
      .from('tenant_settings')
      .select('footer_config')
      .eq('tenant_id', SBUILD_TENANT_ID)
      .maybeSingle();

    if (!error && data?.footer_config?.material_subcategories) {
      const fromDb = data.footer_config.material_subcategories;
      const merged = { ...DEFAULT_SUBCATEGORIES, ...fromDb };
      cachedSubcategoriesMap = merged;
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
      }
      return merged;
    }
  } catch (err) {
    console.warn('Lỗi khi tải material_subcategories từ Supabase:', err);
  }

  // 3. Fallback
  cachedSubcategoriesMap = DEFAULT_SUBCATEGORIES;
  return DEFAULT_SUBCATEGORIES;
}

/**
 * Lưu danh mục con vào Supabase và LocalStorage
 */
export async function saveSubcategoriesMap(
  map: Record<string, string[]>
): Promise<boolean> {
  cachedSubcategoriesMap = map;
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(map));
  }

  try {
    const { data: existing } = await supabase
      .from('tenant_settings')
      .select('id, footer_config')
      .eq('tenant_id', SBUILD_TENANT_ID)
      .maybeSingle();

    const fc = (existing?.footer_config && typeof existing.footer_config === 'object')
      ? { ...existing.footer_config }
      : {};

    fc.material_subcategories = map;

    if (existing?.id) {
      await supabase
        .from('tenant_settings')
        .update({ footer_config: fc })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('tenant_settings')
        .insert([{ tenant_id: SBUILD_TENANT_ID, footer_config: fc }]);
    }
    return true;
  } catch (err) {
    console.error('Lỗi khi lưu subcategories vào tenant_settings:', err);
    return false;
  }
}

/**
 * Lấy danh sách subcategories cho 1 danh mục cha cụ thể
 */
export function getSubcategoriesForCategory(
  categoryName: string,
  map?: Record<string, string[]>
): string[] {
  const source = map || cachedSubcategoriesMap || DEFAULT_SUBCATEGORIES;
  if (!categoryName) return [];

  // Tìm kiếm theo tên chính xác hoặc không phân biệt hoa thường
  for (const [key, list] of Object.entries(source)) {
    if (key.trim().toLowerCase() === categoryName.trim().toLowerCase()) {
      return list;
    }
  }

  // Tìm kiếm mờ (vd: "nep-nhom" hoặc "nẹp nhôm")
  const normCat = categoryName.toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const [key, list] of Object.entries(source)) {
    const normKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (normKey === normCat || normKey.includes(normCat) || normCat.includes(normKey)) {
      return list;
    }
  }

  return [];
}

/**
 * Trích xuất danh mục con từ product tags hoặc suy luận từ tên sản phẩm
 */
export function extractSubcategory(
  tags: any,
  productName?: string,
  categoryName?: string,
  knownSubcategories?: string[]
): string {
  // 1. Kiểm tra tiền tố 'sub:' hoặc 'dmc:' trong tags
  if (Array.isArray(tags)) {
    for (const tag of tags) {
      if (typeof tag === 'string') {
        const t = tag.trim();
        if (t.toLowerCase().startsWith('sub:')) {
          return t.substring(4).trim();
        }
        if (t.toLowerCase().startsWith('dmc:')) {
          return t.substring(4).trim();
        }
      }
    }
  }

  // 2. Kiểm tra nếu tags trùng khớp với 1 danh mục con đã biết
  const availableSubcats = knownSubcategories && knownSubcategories.length > 0
    ? knownSubcategories
    : (categoryName ? getSubcategoriesForCategory(categoryName) : []);

  if (Array.isArray(tags) && availableSubcats.length > 0) {
    for (const tag of tags) {
      if (typeof tag === 'string') {
        const found = availableSubcats.find(s => s.toLowerCase() === tag.trim().toLowerCase());
        if (found) return found;
      }
    }
  }

  // 3. Suy luận thông minh từ tên sản phẩm nếu thuộc danh mục
  const name = (productName || '').toLowerCase();
  const cat = (categoryName || '').toLowerCase();

  if (cat.includes('nhôm') || cat.includes('nep-nhom')) {
    if (name.includes('chữ v') || name.includes('góc v') || name.includes(' v ')) return 'Nẹp nhôm chữ V góc';
    if (name.includes('chữ u') || name.includes('chỉ âm') || name.includes(' u ')) return 'Nẹp nhôm chữ U trang trí';
    if (name.includes('chữ t') || name.includes(' t ')) return 'Nẹp nhôm chữ T trang trí';
    if (name.includes('bo góc') || name.includes('gạch men') || name.includes('yv') || name.includes('bo tròn')) return 'Nẹp nhôm bo góc gạch men';
    if (name.includes('chống trơn') || name.includes('bậc thang') || name.includes('cầu thang')) return 'Nẹp nhôm chống trơn sàn';
    if (name.includes('lập là') || name.includes('la nhôm') || name.includes('chỉ la')) return 'Nẹp nhôm lập là / la nhôm';
    if (name.includes('chữ l') || name.includes('kết thúc') || name.includes(' l ')) return 'Nẹp nhôm chữ L kết thúc';
    return 'Nẹp nhôm chữ V góc'; // default fallback for nep nhom
  }

  if (cat.includes('inox') || cat.includes('nep-inox')) {
    if (name.includes('chữ v') || name.includes('góc v')) return 'Nẹp inox chữ V';
    if (name.includes('chữ u') || name.includes('chỉ âm')) return 'Nẹp inox chữ U';
    if (name.includes('chữ t')) return 'Nẹp inox chữ T';
    if (name.includes('bo góc') || name.includes('bo tròn')) return 'Nẹp inox bo góc tròn';
    if (name.includes('la ') || name.includes('la phẳng')) return 'Nẹp inox la phẳng';
    return 'Nẹp inox chữ V';
  }

  if (cat.includes('nhựa') || cat.includes('pvc')) {
    if (name.includes('bo góc') || name.includes('bo tròn')) return 'Nẹp nhựa PVC bo góc tròn';
    if (name.includes('chữ v') || name.includes('góc v')) return 'Nẹp nhựa chữ V';
    if (name.includes('ngắt nước') || name.includes('chỉ ngắt nước')) return 'Nẹp chỉ ngắt nước';
    if (name.includes('trát tường') || name.includes('góc bả') || name.includes('gờ trát')) return 'Nẹp trát tường & góc bả';
    return 'Nẹp nhựa PVC bo góc tròn';
  }

  if (cat.includes('dụng cụ')) {
    if (name.includes('bay') || name.includes('răng cưa')) return 'Bay răng cưa';
    if (name.includes('kìm') || name.includes('siết ke')) return 'Kìm siết ke cân bằng';
    if (name.includes('búa') || name.includes('cao su')) return 'Búa cao su';
    if (name.includes('thước') || name.includes('nivo') || name.includes('ke góc')) return 'Thước nivo & ke góc';
    return 'Dụng cụ thi công khác';
  }

  if (cat.includes('phụ kiện')) {
    if (name.includes('ke cân bằng') || name.includes('ke dấu cộng')) return 'Ke cân bằng gạch';
    if (name.includes('nêm') || name.includes('chêm')) return 'Nêm chêm cân bằng';
    if (name.includes('nút bịt') || name.includes('nắp bịt')) return 'Nút bịt đầu nẹp';
    if (name.includes('giàn giáo') || name.includes('khung') || name.includes('thép')) return 'Khung & phụ kiện giàn giáo';
    return 'Phụ kiện khác';
  }

  if (cat.includes('hóa chất') || cat.includes('keo')) {
    if (name.includes('dán gạch') || name.includes('superbond')) return 'Keo dán gạch';
    if (name.includes('chà ron') || name.includes('chít mạch') || name.includes('nano')) return 'Keo chà ron';
    if (name.includes('dán nẹp') || name.includes('titebond') || name.includes('silicon')) return 'Keo dán nẹp chuyên dụng';
    if (name.includes('chống thấm') || name.includes('phụ gia')) return 'Phụ gia chống thấm';
    return 'Hóa chất xây dựng khác';
  }

  // 4. Nếu có subcategory khớp với availableSubcats
  if (availableSubcats.length > 0) {
    return availableSubcats[0];
  }

  return 'Sản phẩm tiêu chuẩn';
}

/**
 * Đóng gói subcategory vào tags
 */
export function encodeSubcategoryTag(subcategory: string): string {
  return `sub:${subcategory.trim()}`;
}
