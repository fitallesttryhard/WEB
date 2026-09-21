import { supabase } from './lib/supabase';
import { SEED_PRODUCTS } from './seedData';
import { DEFAULT_SBUILD_ARTICLES } from './articleServices';

export const DEFAULT_BANNERS = [
  {
    id: '1789704147477',
    image_url: '/images/banners/banner-1789704147477.png',
    heading: 'KIẾN TẠO ĐÔ THỊ TỪ NỀN TẢNG',
  },
  {
    id: '1789704310932',
    image_url: '/images/banners/banner-1789704310932.png',
    heading: 'CHỈNH CHU TRONG TỪNG CÔNG TRÌNH',
  },
  {
    id: '1789704391026',
    image_url: '/images/banners/banner-1789704391026.png',
    heading: 'CHÍNH XÁC ĐẾN TỪNG ĐƯỜNG NÉT',
  }
];

export type MediaSourceType = 'all' | 'banner' | 'product' | 'project' | 'article' | 'category' | 'system' | 'upload';

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  size?: number;
  source: MediaSourceType;
  sourceTitle?: string;
  createdAt?: string;
  path?: string;
}

export const BUILT_IN_MEDIA: MediaItem[] = [
  {
    id: 'static-banner-1',
    name: 'banner-1789704147477.png',
    url: '/images/banners/banner-1789704147477.png',
    source: 'banner',
    sourceTitle: 'Kiến tạo đô thị từ nền tảng'
  },
  {
    id: 'static-banner-2',
    name: 'banner-1789704310932.png',
    url: '/images/banners/banner-1789704310932.png',
    source: 'banner',
    sourceTitle: 'Chỉnh chu trong từng công trình'
  },
  {
    id: 'static-banner-3',
    name: 'banner-1789704391026.png',
    url: '/images/banners/banner-1789704391026.png',
    source: 'banner',
    sourceTitle: 'Chính xác đến từng đường nét'
  },
  {
    id: 'static-hero-banner',
    name: 'hero-banner.webp',
    url: '/images/hero-banner.webp',
    source: 'system',
    sourceTitle: 'Banner trang chủ S-BUILD'
  },
  {
    id: 'static-about-1',
    name: 'about-hero.jpg',
    url: '/images/about/about-hero.jpg',
    source: 'system',
    sourceTitle: 'Ảnh Hero Giới thiệu S-BUILD'
  },
  {
    id: 'static-about-2',
    name: 'about-team.jpg',
    url: '/images/about/about-team.jpg',
    source: 'system',
    sourceTitle: 'Đội ngũ chuyên gia S-BUILD'
  },
  {
    id: 'static-about-3',
    name: 'about-tile-trim.jpg',
    url: '/images/about/about-tile-trim.jpg',
    source: 'system',
    sourceTitle: 'Giải pháp nẹp hoàn thiện'
  },
  {
    id: 'static-about-4',
    name: 'solution-profiles.jpg',
    url: '/images/about/solution-profiles.jpg',
    source: 'product',
    sourceTitle: 'Nẹp nhôm & inox trang trí'
  },
  {
    id: 'static-about-5',
    name: 'solution-chemicals.jpg',
    url: '/images/about/solution-chemicals.jpg',
    source: 'product',
    sourceTitle: 'Hóa chất & keo xây dựng'
  },
  {
    id: 'static-about-6',
    name: 'solution-tools.jpg',
    url: '/images/about/solution-tools.jpg',
    source: 'product',
    sourceTitle: 'Dụng cụ thi công chuyên nghiệp'
  }
];

const STORAGE_KEY = 'admin_local_media_gallery';

export function getLocalUploadedMedia(): MediaItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((item: any, idx: number) => ({
        id: item.id || `upload-${idx}-${Date.now()}`,
        name: item.name || 'Ảnh tải lên',
        url: item.url,
        size: item.size || 0,
        source: 'upload',
        sourceTitle: 'Tải lên từ máy',
        path: item.path || item.url,
        createdAt: item.createdAt || new Date().toISOString()
      }));
    }
  } catch (e) {
    console.warn('Lỗi đọc local uploaded media:', e);
  }
  return [];
}

export function saveLocalUploadedMedia(items: MediaItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('sbuild_media_updated', { detail: { items } }));
  } catch (e) {
    console.warn('Lỗi lưu local uploaded media:', e);
  }
}

export function addLocalUploadedMedia(item: MediaItem) {
  const current = getLocalUploadedMedia();
  // Tránh trùng URL
  const filtered = current.filter(i => i.url !== item.url);
  const updated = [item, ...filtered];
  saveLocalUploadedMedia(updated);
}

export function deleteLocalUploadedMedia(idOrUrl: string) {
  const current = getLocalUploadedMedia();
  const updated = current.filter(i => i.id !== idOrUrl && i.url !== idOrUrl && i.path !== idOrUrl);
  saveLocalUploadedMedia(updated);
}

export function extractSystemMedia(contextData?: {
  banners?: any[];
  products?: any[];
  projects?: any[];
  posts?: any[];
  categories?: any[];
  settings?: any;
}): MediaItem[] {
  const items: MediaItem[] = [];
  const seenUrls = new Set<string>();

  const add = (url: string | undefined | null, name: string, source: MediaSourceType, sourceTitle?: string) => {
    if (!url || typeof url !== 'string' || !url.trim() || seenUrls.has(url.trim())) return;
    const cleanUrl = url.trim();
    seenUrls.add(cleanUrl);
    
    // Trích xuất tên file từ URL nếu có
    let displayName = name;
    try {
      const parts = cleanUrl.split('/');
      const last = parts[parts.length - 1]?.split('?')[0];
      if (last && last.includes('.')) {
        displayName = decodeURIComponent(last);
      }
    } catch (e) {}

    items.push({
      id: `sys-${source}-${items.length}-${Math.random().toString(36).substring(2, 7)}`,
      name: displayName || `${source}-media`,
      url: cleanUrl,
      source,
      sourceTitle: sourceTitle || name
    });
  };

  // 1. Banners
  const banners = (contextData?.banners && contextData.banners.length > 0) 
    ? contextData.banners 
    : DEFAULT_BANNERS;
  banners.forEach((b: any, idx: number) => {
    const bannerUrl = b.image_url || b.image;
    add(bannerUrl, b.heading || `Banner Slide ${idx + 1}`, 'banner', b.heading || `Banner Slide ${idx + 1}`);
  });

  // 2. Products
  const products = (contextData?.products && contextData.products.length > 0)
    ? contextData.products
    : SEED_PRODUCTS;
  products.forEach((p: any) => {
    const thumb = p.thumbnailUrl || p.thumbnail_url || p.image || p.image_url;
    add(thumb, p.name || 'Sản phẩm', 'product', `SP: ${p.name || ''}`);
    if (Array.isArray(p.galleryUrls)) {
      p.galleryUrls.forEach((g: string, gIdx: number) => {
        add(g, `${p.name} (Gallery ${gIdx + 1})`, 'product', `Gallery: ${p.name || ''}`);
      });
    }
    if (Array.isArray(p.gallery_urls)) {
      p.gallery_urls.forEach((g: string, gIdx: number) => {
        add(g, `${p.name} (Gallery ${gIdx + 1})`, 'product', `Gallery: ${p.name || ''}`);
      });
    }
  });

  // 3. Projects
  const projects = contextData?.projects || [];
  projects.forEach((pr: any) => {
    const pImg = pr.image || pr.image_url || pr.cover_image;
    add(pImg, pr.title || 'Dự án thi công', 'project', `Dự án: ${pr.title || ''}`);
  });

  // 4. Articles / Posts
  const posts = (contextData?.posts && contextData.posts.length > 0)
    ? contextData.posts
    : DEFAULT_SBUILD_ARTICLES;
  posts.forEach((a: any) => {
    const aImg = a.cover_image || a.image || a.thumbnailUrl || a.thumbnail_url;
    add(aImg, a.title || 'Bài viết tin tức', 'article', `Bài viết: ${a.title || ''}`);
  });

  // 5. Categories
  const categories = contextData?.categories || [];
  categories.forEach((c: any) => {
    add(c.image_url, c.name || 'Danh mục sản phẩm', 'category', `Danh mục: ${c.name || ''}`);
  });

  // 6. Settings / Brand
  const settings = contextData?.settings;
  if (settings) {
    if (settings.logoUrl || settings.logo_url) {
      add(settings.logoUrl || settings.logo_url, 'Logo Doanh Nghiệp', 'system', 'Logo chính hệ thống');
    }
    if (settings.faviconUrl || settings.favicon_url) {
      add(settings.faviconUrl || settings.favicon_url, 'Favicon Website', 'system', 'Biểu tượng website');
    }
    if (settings.aboutImageUrl) {
      add(settings.aboutImageUrl, 'Ảnh Giới Thiệu (Không chỉ là vật tư)', 'system', 'Khối giới thiệu trang chủ');
    }
    if (settings.aboutPageConfig?.hero?.imageUrl) {
      add(settings.aboutPageConfig.hero.imageUrl, 'Hero Trang Giới Thiệu', 'system', 'Trang giới thiệu');
    }
  }

  // 7. Built-in defaults
  BUILT_IN_MEDIA.forEach((bm) => {
    add(bm.url, bm.name, bm.source, bm.sourceTitle);
  });

  return items;
}

export async function fetchRemoteStorageMedia(): Promise<MediaItem[]> {
  try {
    const { data, error } = await supabase.storage.from('product-media').list();
    if (error || !data) return [];
    
    const valid = data.filter((f: any) => f.name !== '.emptyFolderPlaceholder' && f.metadata?.size);
    return valid.map((file: any) => {
      const { data: { publicUrl } } = supabase.storage.from('product-media').getPublicUrl(file.name);
      return {
        id: file.id || file.name,
        name: file.name,
        size: file.metadata?.size || 0,
        path: file.name,
        url: publicUrl,
        source: 'upload' as MediaSourceType,
        sourceTitle: 'Supabase Storage',
        createdAt: file.created_at
      };
    });
  } catch (err) {
    console.warn('Lỗi lấy ảnh từ Supabase Storage:', err);
    return [];
  }
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const raw = e.target?.result as string;
      try {
        const img = new Image();
        img.src = raw;
        img.onload = () => {
          const maxDim = 1920;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            const compressed = canvas.toDataURL('image/webp', 0.84);
            resolve(compressed);
            return;
          }
          resolve(raw);
        };
        img.onerror = () => resolve(raw);
      } catch (err) {
        resolve(raw);
      }
    };
    reader.onerror = () => resolve('');
  });
}

export async function uploadSingleMediaFile(file: File): Promise<MediaItem | null> {
  if (!file.type.startsWith('image/')) return null;

  const fileExt = file.name.split('.').pop() || 'png';
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  let finalUrl = '';
  let finalPath = fileName;

  // 1. Thử Server API upload
  try {
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: bodyFormData,
    });
    if (res.ok) {
      const result = await res.json();
      if (result.success && result.url) {
        finalUrl = result.url;
        finalPath = result.url;
      }
    }
  } catch (apiErr) {
    console.warn('Server Upload API không khả dụng, thử Storage:', apiErr);
  }

  // 2. Thử Supabase Storage
  if (!finalUrl) {
    try {
      const { data: upData, error } = await supabase.storage.from('product-media').upload(fileName, file);
      if (!error && upData) {
        const { data: { publicUrl } } = supabase.storage.from('product-media').getPublicUrl(fileName);
        finalUrl = publicUrl;
        finalPath = fileName;
      }
    } catch (storageErr) {
      console.warn('Supabase Storage upload lỗi:', storageErr);
    }
  }

  // 3. Fallback: nén ảnh canvas Base64
  if (!finalUrl) {
    try {
      finalUrl = await fileToBase64(file);
      finalPath = `base64-${Date.now()}`;
    } catch (e) {
      finalUrl = URL.createObjectURL(file);
      finalPath = `blob-${Date.now()}`;
    }
  }

  const newItem: MediaItem = {
    id: `upload-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: file.name,
    size: file.size,
    url: finalUrl,
    path: finalPath,
    source: 'upload',
    sourceTitle: 'Tải lên từ máy',
    createdAt: new Date().toISOString()
  };

  addLocalUploadedMedia(newItem);
  return newItem;
}
