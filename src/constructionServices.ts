import { supabase } from './supabaseClient';
import { SBUILD_TENANT_ID } from './articleServices';

export interface ConstructionCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  count?: number;
}

/**
 * Không còn dữ liệu mẫu: danh sách hạng mục thi công chỉ lấy từ dữ liệu thật
 * (Supabase / bộ nhớ đệm của dữ liệu thật). Giữ export này (mảng rỗng) để các
 * component cũ vẫn dùng làm giá trị khởi tạo mà không hiển thị dữ liệu ảo.
 */
export const DEFAULT_CONSTRUCTION_CATEGORIES: ConstructionCategory[] = [];

const LOCAL_STORAGE_KEY = 'sbuild_construction_categories';

/**
 * Lấy danh sách các Hạng mục thi công từ tenant_settings (hoặc localStorage - bản sao của dữ liệu thật)
 */
export async function getConstructionCategories(): Promise<ConstructionCategory[]> {
  try {
    // 1. Thử lấy từ Supabase tenant_settings
    const { data, error } = await supabase
      .from('tenant_settings')
      .select('footer_config')
      .eq('tenant_id', SBUILD_TENANT_ID)
      .limit(1)
      .maybeSingle();

    if (!error && data?.footer_config?.construction_categories && Array.isArray(data.footer_config.construction_categories) && data.footer_config.construction_categories.length > 0) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.footer_config.construction_categories));
      }
      return data.footer_config.construction_categories;
    }
  } catch (err) {
    console.warn('Lỗi khi tải construction_categories từ Supabase, sử dụng bộ nhớ đệm:', err);
  }

  // 2. Fallback sang localStorage nếu có (bản sao dữ liệu thật đã lưu trước đó)
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        // ignore parse error
      }
    }
  }

  // 3. Không có dữ liệu thật: trả về rỗng (không dùng dữ liệu mẫu)
  return [];
}

/**
 * Lưu danh sách Hạng mục thi công lên Supabase tenant_settings và localStorage
 */
export async function saveConstructionCategories(categories: ConstructionCategory[]): Promise<boolean> {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(categories));
  }

  try {
    const { data: current } = await supabase
      .from('tenant_settings')
      .select('id, footer_config')
      .eq('tenant_id', SBUILD_TENANT_ID)
      .limit(1)
      .maybeSingle();

    if (current?.id) {
      const fc = current.footer_config || {};
      fc.construction_categories = categories;
      const { error } = await supabase
        .from('tenant_settings')
        .update({ footer_config: fc })
        .eq('id', current.id);

      if (error) throw error;
      return true;
    }
  } catch (err) {
    console.error('Lỗi khi lưu construction_categories vào tenant_settings:', err);
  }

  return true;
}

/**
 * Tách danh sách hạng mục thi công từ tags của sản phẩm
 * Format hỗ trợ:
 * - "hm:Ốp lát gạch"
 * - hoặc tag trùng khớp với tên/slug của bất kỳ hạng mục thi công nào
 */
export function extractConstructionCategories(
  tags: string[] | undefined | null,
  knownCategories: ConstructionCategory[] = DEFAULT_CONSTRUCTION_CATEGORIES
): string[] {
  if (!tags || !Array.isArray(tags)) return [];

  const knownNames = new Set(knownCategories.map(c => c.name.toLowerCase()));
  const knownSlugs = new Set(knownCategories.map(c => c.slug.toLowerCase()));
  const result = new Set<string>();

  for (const tag of tags) {
    if (!tag) continue;
    const cleanTag = tag.trim();
    if (cleanTag.startsWith('hm:')) {
      const name = cleanTag.slice(3).trim();
      if (name) result.add(name);
    } else if (cleanTag.startsWith('cc:')) {
      const name = cleanTag.slice(3).trim();
      if (name) result.add(name);
    } else {
      const lower = cleanTag.toLowerCase();
      if (knownNames.has(lower)) {
        const match = knownCategories.find(c => c.name.toLowerCase() === lower);
        result.add(match ? match.name : cleanTag);
      } else if (knownSlugs.has(lower)) {
        const match = knownCategories.find(c => c.slug.toLowerCase() === lower);
        if (match) result.add(match.name);
      }
    }
  }

  return Array.from(result);
}

/**
 * Tách các tag thông thường (loại bỏ tag định danh hạng mục thi công)
 */
export function extractNormalTags(
  tags: string[] | undefined | null,
  knownCategories: ConstructionCategory[] = DEFAULT_CONSTRUCTION_CATEGORIES
): string[] {
  if (!tags || !Array.isArray(tags)) return [];
  const knownNames = new Set(knownCategories.map(c => c.name.toLowerCase()));

  return tags.filter(tag => {
    if (!tag) return false;
    const clean = tag.trim();
    if (clean.startsWith('hm:') || clean.startsWith('cc:')) return false;
    if (knownNames.has(clean.toLowerCase())) return false;
    return true;
  });
}

/**
 * Đóng gói tags thông thường và hạng mục thi công thành mảng tags chuẩn lưu DB
 */
export function encodeProductTags(
  normalTags: string[],
  constructionCategories: string[],
  subcategory?: string
): string[] {
  const cleanNormal = (normalTags || []).map(t => t.trim()).filter(t => Boolean(t) && !t.startsWith('sub:') && !t.startsWith('dmc:'));
  const cleanCC = (constructionCategories || []).map(c => `hm:${c.trim()}`).filter(Boolean);
  const subTag = subcategory?.trim() ? [`sub:${subcategory.trim()}`] : [];
  
  return Array.from(new Set([...cleanNormal, ...cleanCC, ...subTag]));
}
