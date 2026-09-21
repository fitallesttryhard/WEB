"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../supabaseClient';
import { AboutPageConfig, DEFAULT_ABOUT_PAGE_CONFIG } from '../types/about';

export interface TenantSettings {
  companyName: string;
  companyDescription?: string;
  hotline: string;
  address: string;
  email: string;
  logoUrl?: string;
  aboutImageUrl?: string;
  faviconUrl?: string;
  brandColor?: string;
  mapUrl?: string;
  gaMeasurementId?: string;
  gscVerificationCode?: string;
  customHeaderScripts?: string;
  status?: 'active' | 'locked' | 'inactive';
  subdomain?: string;
  plan?: string;
  paymentStatus?: string;
  socialLinks?: Array<{ id?: any; platform: string; url: string }>;
  footerBlocks?: Array<{ id?: any; title: string; type?: string; items?: any[]; content?: string; url?: string; width?: number; links?: Array<{ label: string; url: string }> }>;
  banners?: Array<any>;
  aboutPageConfig?: AboutPageConfig;
  [key: string]: any;
}

interface SettingsContextType {
  settings: TenantSettings;
  updateSettings: (newSettings: Partial<TenantSettings>) => void;
  loading: boolean;
}

const defaultSbuildBanners = [
  {
    id: '1789704147477',
    image_url: '/images/banners/banner-1789704147477.png',
    heading: 'KIẾN TẠO ĐÔ THỊ TỪ NỀN TẢNG',
    subheading: 'SBUILD cung cấp vật tư và giải pháp hoàn thiện, góp phần tạo nên những công trình chỉn chu và bền vững.',
    cta_text: 'KHÁM PHÁ GIẢI PHÁP',
    cta_link: '/products',
    layout_type: 'badge_pills',
    prop_1: 'GIẢI PHÁP CHUYÊN DỤNG',
    prop_2: 'DANH MỤC ĐA DẠNG',
    prop_3: 'HỖ TRỢ CÔNG TRÌNH',
    status: true,
    order: 1
  },
  {
    id: '1789704310932',
    image_url: '/images/banners/banner-1789704310932.png',
    heading: 'CHỈNH CHU TRONG TỪNG CÔNG TRÌNH',
    subheading: 'Lựa chọn đúng vật liệu hoàn thiện giúp hiện thực hóa thiết kế với độ chính xác và tính đồng bộ cao.',
    cta_text: 'KHÁM PHÁ DỰ ÁN',
    cta_link: '/projects',
    layout_type: 'minimal',
    prop_1: 'Chuẩn CO/CQ Kiểm Định',
    prop_2: 'Giao Hàng Công Trình 24/7',
    prop_3: 'Bảo Hành Chính Hãng',
    status: true,
    order: 2
  },
  {
    id: '1789704391026',
    image_url: '/images/banners/banner-1789704391026.png',
    heading: 'CHÍNH XÁC ĐẾN TỪNG ĐƯỜNG NÉT',
    subheading: 'Những góc cạnh, khe nối và điểm chuyển tiếp được xử lý tốt tạo nên khác biệt của công trình.',
    cta_text: 'XEM ỨNG DỤNG',
    cta_link: '/products',
    layout_type: 'minimal',
    prop_1: 'Chuẩn CO/CQ Kiểm Định',
    prop_2: 'Giao Hàng Công Trình 24/7',
    prop_3: 'Bảo Hành Chính Hãng',
    status: true,
    order: 3
  }
];

export const DEFAULT_FOOTER_BLOCKS = [
  {
    id: 'block-default-1',
    type: 'links',
    title: 'Liên kết nhanh',
    items: [
      { id: '1', label: 'Trang chủ', url: '/' },
      { id: '2', label: 'Giới thiệu công ty', url: '/about' },
      { id: '3', label: 'Danh mục sản phẩm', url: '/products' },
      { id: '4', label: 'Dự án đã thi công', url: '/projects' },
      { id: '5', label: 'Tin tức & Sự kiện', url: '/blog' },
      { id: '6', label: 'Liên hệ', url: '/contact' }
    ]
  },
  {
    id: 'block-default-2',
    type: 'text',
    title: 'Chính sách chất lượng',
    content: 'SBUILD cam kết cung cấp giải pháp vật tư, phụ kiện giàn giáo và dụng cụ thi công chất lượng chuẩn CO/CQ với chi phí tối ưu nhất.'
  }
];

const defaultSettings: TenantSettings = {
  companyName: 'Công ty TNHH Đầu tư Xây dựng Sbuild',
  companyDescription: 'Nhà cung cấp chuyên nghiệp các giải pháp vật tư, nẹp trang trí cao cấp, phụ kiện và dụng cụ thi công xây dựng đạt tiêu chuẩn hàng đầu tại Việt Nam.',
  hotline: '0901 234 567',
  address: 'Tầng 5, Tòa nhà Sbuild, Quận 1, TP. Hồ Chí Minh',
  email: 'contact@sbuild.vn',
  logoUrl: '',
  brandColor: '#dc2626',
  mapUrl: 'https://maps.google.com/maps?q=T%E1%BA%A7ng%205%2C%20T%C3%B2a%20nh%C3%A0%20Sbuild%2C%20Qu%E1%BA%ADn%201%2C%20TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh&t=&z=15&ie=UTF8&iwloc=&output=embed',
  gaMeasurementId: '',
  gscVerificationCode: '',
  customHeaderScripts: '',
  status: 'active',
  subdomain: 'sbuild',
  plan: 'Enterprise',
  paymentStatus: 'Paid',
  socialLinks: [],
  footerBlocks: DEFAULT_FOOTER_BLOCKS,
  banners: defaultSbuildBanners,
  aboutPageConfig: DEFAULT_ABOUT_PAGE_CONFIG,
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  loading: false,
});

const isLegacyText = (val: any): boolean => {
  if (!val) return false;
  const str = typeof val === 'string' ? val : JSON.stringify(val);
  const normalized = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return (
    normalized.includes('fitallest') ||
    normalized.includes('0909876817') ||
    normalized.includes('kientaokhonggiansong')
  );
};

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<TenantSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTenantSettings() {
      try {
        let tenantStatus: 'active' | 'locked' = 'active';
        let tenantSubdomain = 'sbuild';
        let tenantPlan = 'Enterprise';

        // Check local storage for quick site-level override and purge legacy entries
        let localCustomSettings: Partial<TenantSettings> = {};
        const storedSiteSettings = localStorage.getItem('sbuild_site_custom_settings');
        if (storedSiteSettings) {
          try {
            const parsed = JSON.parse(storedSiteSettings);
            Object.keys(parsed).forEach((k) => {
              if (isLegacyText(parsed[k])) {
                delete parsed[k];
              }
            });
            // Never allow stale legacy banner cache to override live Supabase banners
            if (parsed.banners && Array.isArray(parsed.banners)) {
              parsed.banners = parsed.banners.filter((b: any) => {
                if (isLegacyText(b)) return false;
                const h = (b.heading || '').toLowerCase();
                return !h.includes('không gian sống') && !h.includes('khong gian song');
              });
              if (parsed.banners.length === 0) delete parsed.banners;
            }
            if (parsed.logoUrl && typeof parsed.logoUrl === 'string' && parsed.logoUrl.startsWith('blob:')) {
              delete parsed.logoUrl;
            }
            localCustomSettings = parsed;
            localStorage.setItem('sbuild_site_custom_settings', JSON.stringify(localCustomSettings));
          } catch (e) {}
        }

        const localTenantsRaw = localStorage.getItem('saas_tenants_data');
        if (localTenantsRaw) {
          try {
            const list = JSON.parse(localTenantsRaw);
            const current = list.find((t: any) => t.subdomain === 'sbuild' || t.id === 'ten-1');
            if (current) {
              tenantStatus = current.status || 'active';
              tenantSubdomain = current.subdomain || 'sbuild';
              tenantPlan = current.plan || 'Enterprise';
            }
          } catch (e) {}
        }

        // 2. Fetch tenant_settings table from Supabase specifically for SBUILD tenant
        const SBUILD_TENANT_ID = '00000000-0000-0000-0000-000000000002';
        let tenantRecord: any = null;

        const { data: tenantSetting } = await supabase
          .from('tenant_settings')
          .select('*')
          .eq('tenant_id', SBUILD_TENANT_ID)
          .maybeSingle();
        tenantRecord = tenantSetting;

        const data = tenantRecord;

        if (data) {
          const fc = data.footer_config || {};
          const soc = data.socials || [];

          // Sanitize company name & hotline if legacy Fi.tallest data is present
          let companyName = data.company_name || fc.companyName || defaultSettings.companyName;
          if (isLegacyText(companyName)) {
            companyName = 'Công ty TNHH Đầu tư Xây dựng Sbuild';
          }

          let hotline = data.hotline || fc.hotline || defaultSettings.hotline;
          if (isLegacyText(hotline)) {
            hotline = '0901 234 567';
          }

          let email = data.email || fc.email || defaultSettings.email;
          if (isLegacyText(email)) {
            email = 'contact@sbuild.vn';
          }

          // Sanitize banners
          let rawBanners = fc.banners || data.banners || [];
          let cleanBanners = Array.isArray(rawBanners)
            ? rawBanners.filter((b: any) => !isLegacyText(b))
            : [];

          if (cleanBanners.length === 0) {
            cleanBanners = defaultSbuildBanners;
          }

          // If legacy data was detected, update Supabase DB in background
          if (isLegacyText(fc.companyName) || isLegacyText(fc.hotline) || isLegacyText(fc.email) || rawBanners.length !== cleanBanners.length) {
            try {
              await supabase.from('tenant_settings').update({
                brand_color: '#dc2626',
                footer_config: {
                  ...fc,
                  companyName,
                  hotline,
                  email,
                  banners: cleanBanners,
                }
              }).eq('id', data.id);
            } catch (e) {}
          }

          const rawBlocks = Array.isArray(fc) ? fc : (fc.blocks || []);
          const finalBlocks = Array.isArray(rawBlocks) && rawBlocks.length > 0 ? rawBlocks : DEFAULT_FOOTER_BLOCKS;

          let safeLogoUrl = data.logo_url || prev.logoUrl || '';
          if (typeof safeLogoUrl === 'string' && safeLogoUrl.startsWith('blob:')) {
            safeLogoUrl = '';
          }

          setSettings((prev) => ({
            ...prev,
            brandColor: (data.brand_color && data.brand_color !== '#6366f1') ? data.brand_color : '#dc2626',
            logoUrl: safeLogoUrl,
            companyName,
            companyDescription: fc.companyDescription || prev.companyDescription,
            aboutImageUrl: fc.aboutImageUrl || data.about_image_url || localCustomSettings.aboutImageUrl || prev.aboutImageUrl,
            hotline,
            address: data.address || fc.address || prev.address,
            email,
            mapUrl: fc.mapUrl || prev.mapUrl,
            gaMeasurementId: fc.gaMeasurementId || localCustomSettings.gaMeasurementId || prev.gaMeasurementId || '',
            gscVerificationCode: fc.gscVerificationCode || localCustomSettings.gscVerificationCode || prev.gscVerificationCode || '',
            customHeaderScripts: fc.customHeaderScripts || localCustomSettings.customHeaderScripts || prev.customHeaderScripts || '',
            status: tenantStatus,
            subdomain: tenantSubdomain,
            plan: tenantPlan,
            socialLinks: Array.isArray(soc) && soc.length > 0 ? soc : (soc.links || prev.socialLinks),
            footerBlocks: finalBlocks,
            aboutPageConfig: fc.aboutPageConfig || localCustomSettings.aboutPageConfig || DEFAULT_ABOUT_PAGE_CONFIG,
            ...localCustomSettings,
            banners: cleanBanners,
          }));
        } else {
          setSettings((prev) => ({
            ...prev,
            status: tenantStatus,
            subdomain: tenantSubdomain,
            plan: tenantPlan,
            aboutPageConfig: localCustomSettings.aboutPageConfig || DEFAULT_ABOUT_PAGE_CONFIG,
            ...localCustomSettings,
          }));
        }
      } catch (err) {
        console.warn('Lỗi lấy tenant_settings từ Supabase:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTenantSettings();

    // Listen for custom settings update event across the app
    const handleCustomSettingsUpdate = () => {
      fetchTenantSettings();
    };
    window.addEventListener('sbuild_settings_updated', handleCustomSettingsUpdate);

    // Listen for storage changes across tabs for instant multi-tenant status updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'saas_tenants_data' && e.newValue) {
        try {
          const list = JSON.parse(e.newValue);
          const current = list.find((t: any) => t.subdomain === 'sbuild' || t.id === 'ten-1');
          if (current) {
            setSettings(prev => ({
              ...prev,
              status: current.status,
              plan: current.plan
            }));
          }
        } catch (err) {}
      }
      if (e.key === 'sbuild_site_custom_settings') {
        fetchTenantSettings();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sbuild_settings_updated', handleCustomSettingsUpdate);
    };
  }, []);

  const updateSettings = async (newSettings: Partial<TenantSettings>) => {
    setSettings((prev) => {
      const sanitizedSettings = { ...newSettings };
      if (typeof sanitizedSettings.logoUrl === 'string' && sanitizedSettings.logoUrl.startsWith('blob:')) {
        sanitizedSettings.logoUrl = '';
      }
      const updated = { ...prev, ...sanitizedSettings };

      // Save to localStorage for instant local site override (compact banner URLs)
      try {
        const compactBanners = (updated.banners || []).map((b: any) => ({
          ...b,
          image_url: (b.image_url && b.image_url.startsWith('data:')) ? b.image_url.slice(0, 100) : b.image_url
        }));

        localStorage.setItem('sbuild_site_custom_settings', JSON.stringify({
          gaMeasurementId: updated.gaMeasurementId,
          gscVerificationCode: updated.gscVerificationCode,
          customHeaderScripts: updated.customHeaderScripts,
          companyName: updated.companyName,
          companyDescription: updated.companyDescription,
          hotline: updated.hotline,
          address: updated.address,
          email: updated.email,
          mapUrl: updated.mapUrl,
          footerBlocks: updated.footerBlocks,
          banners: compactBanners,
          aboutPageConfig: updated.aboutPageConfig,
        }));
      } catch (e) {}

      // Async sync to Supabase in background
      (async () => {
        try {
          let targetTenantId = '00000000-0000-0000-0000-000000000002';
          const { data: tenant } = await supabase
            .from('tenants')
            .select('id')
            .eq('subdomain', 'sbuild')
            .maybeSingle();

          if (tenant?.id) {
            targetTenantId = tenant.id;
          }

          const { data: existing } = await supabase
            .from('tenant_settings')
            .select('id, footer_config')
            .eq('tenant_id', targetTenantId)
            .maybeSingle();

          const existingFc = existing?.footer_config || {};

          const dbPayload = {
            logo_url: updated.logoUrl,
            brand_color: updated.brandColor,
            socials: updated.socialLinks,
            footer_config: {
              ...existingFc,
              companyName: updated.companyName,
              companyDescription: updated.companyDescription,
              hotline: updated.hotline,
              address: updated.address,
              email: updated.email,
              mapUrl: updated.mapUrl,
              gaMeasurementId: updated.gaMeasurementId,
              gscVerificationCode: updated.gscVerificationCode,
              customHeaderScripts: updated.customHeaderScripts,
              blocks: updated.footerBlocks || existingFc.blocks || DEFAULT_FOOTER_BLOCKS,
              banners: updated.banners || existingFc.banners || [],
              aboutPageConfig: updated.aboutPageConfig || existingFc.aboutPageConfig || DEFAULT_ABOUT_PAGE_CONFIG,
            },
          };

          if (existing?.id) {
            await supabase.from('tenant_settings').update(dbPayload).eq('id', existing.id);
          } else {
            await supabase.from('tenant_settings').insert([{ ...dbPayload, tenant_id: targetTenantId }]);
          }
        } catch (e) {
          console.warn('Không thể đồng bộ tenant_settings với DB:', e);
        }
      })();

      return updated;
    });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
export default SettingsContext;
