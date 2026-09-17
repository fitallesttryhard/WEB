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

export const DEFAULT_CONSTRUCTION_CATEGORIES: ConstructionCategory[] = [
  {
    id: 'cc-1',
    name: 'Ốp lát gạch',
    slug: 'op-lat-gach',
    description: 'Nẹp góc gạch men, nẹp chỉ ron, nẹp tạo phẳng bề mặt ốp lát gạch đá cao cấp.',
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'cc-2',
    name: 'Trát tường',
    slug: 'trat-tuong',
    description: 'Nẹp góc trát tường, nẹp chỉ ngắt nước mốc trát và định hình cạnh vữa sắc nét.',
    image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'cc-3',
    name: 'Thạch cao',
    slug: 'thach-cao',
    description: 'Nẹp góc thạch cao, nẹp chỉ âm trần, khe co giãn vách ngăn tấm thạch cao.',
    image_url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'cc-4',
    name: 'Hoàn thiện nội thất',
    slug: 'hoan-thien-noi-that',
    description: 'Nẹp sàn gỗ, nẹp kết thúc sàn, nẹp len chân tường và nẹp thảm trải sàn nội thất.',
    image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'cc-5',
    name: 'Hoàn thiện ngoại thất',
    slug: 'hoan-thien-ngoai-that',
    description: 'Nẹp ban công, nẹp viền cửa sổ ngoài trời chịu nắng mưa và chống nứt cạnh tường.',
    image_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'cc-6',
    name: 'Thi công đèn LED',
    slug: 'thi-cong-den-led',
    description: 'Nẹp nhôm định hình dải LED âm trần, tủ kệ, khe sáng trang trí kiến trúc hiện đại.',
    image_url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'cc-7',
    name: 'Chống thấm',
    slug: 'chong-tham',
    description: 'Nẹp và phụ kiện xử lý mối nối chống thấm cổ ống, mạch ngừng và khe co giãn công trình.',
    image_url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop'
  }
];

const LOCAL_STORAGE_KEY = 'sbuild_construction_categories';

/**
 * Lấy danh sách các Hạng mục thi công từ tenant_settings (hoặc localStorage / mặc định)
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

  // 2. Fallback sang localStorage nếu có
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

  // 3. Fallback sang danh sách mặc định
  return DEFAULT_CONSTRUCTION_CATEGORIES;
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
  constructionCategories: string[]
): string[] {
  const cleanNormal = (normalTags || []).map(t => t.trim()).filter(Boolean);
  const cleanCC = (constructionCategories || []).map(c => `hm:${c.trim()}`).filter(Boolean);
  
  return Array.from(new Set([...cleanNormal, ...cleanCC]));
}
