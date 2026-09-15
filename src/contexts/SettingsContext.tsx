"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../supabaseClient';

export interface TenantSettings {
  companyName: string;
  companyDescription?: string;
  hotline: string;
  address: string;
  email: string;
  logoUrl?: string;
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
  [key: string]: any;
}

interface SettingsContextType {
  settings: TenantSettings;
  updateSettings: (newSettings: Partial<TenantSettings>) => void;
  loading: boolean;
}

const defaultSbuildBanners = [
  {
    id: 1,
    image_url: '/images/hero-banner.webp',
    heading: 'KIẾN TẠO KHÔNG GIAN SỐNG',
    subheading: 'Sbuild - Cùng bạn xây dựng tương lai vững chắc',
    cta_text: 'XEM DỰ ÁN',
    cta_link: '/projects',
    prop_1: 'CHUẨN CO/CQ KIỂM ĐỊNH',
    prop_2: 'GIAO HÀNG CÔNG TRÌNH 24/7',
    prop_3: 'BẢO HÀNH CHÍNH HÃNG',
    status: true,
    order: 1
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
    normalized.includes('0909876817')
  );
};

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<TenantSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTenantSettings() {
      try {
        // 1. Fetch tenant metadata (status, subdomain, plan) from Supabase or localStorage
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

        // 2. Fetch tenant_settings table from Supabase for this specific tenant
        let tenantRecord: any = null;
        let activeTenantId: string | null = null;

        const { data: tenant } = await supabase
          .from('tenants')
          .select('id, subdomain, status')
          .eq('subdomain', tenantSubdomain)
          .maybeSingle();

        if (tenant?.id) {
          activeTenantId = tenant.id;
          const { data: tenantSetting } = await supabase
            .from('tenant_settings')
            .select('*')
            .eq('tenant_id', tenant.id)
            .maybeSingle();
          tenantRecord = tenantSetting;
        }

        if (!tenantRecord) {
          const { data: fallbackSetting } = await supabase
            .from('tenant_settings')
            .select('*')
            .eq('tenant_id', '00000000-0000-0000-0000-000000000002')
            .maybeSingle();
          tenantRecord = fallbackSetting;
        }

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

          setSettings((prev) => ({
            ...prev,
            brandColor: (data.brand_color && data.brand_color !== '#6366f1') ? data.brand_color : '#dc2626',
            logoUrl: data.logo_url || prev.logoUrl,
            companyName,
            companyDescription: fc.companyDescription || prev.companyDescription,
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
            banners: cleanBanners,
            ...localCustomSettings,
          }));
        } else {
          setSettings((prev) => ({
            ...prev,
            status: tenantStatus,
            subdomain: tenantSubdomain,
            plan: tenantPlan,
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
      const updated = { ...prev, ...newSettings };

      // Save to localStorage for instant local site override
      try {
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
        }));
        window.dispatchEvent(new Event('sbuild_settings_updated'));
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
