"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../supabaseClient';

export interface TenantSettings {
  companyName: string;
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
    image_url: 'https://images.unsplash.com/photo-1541888086903-efdc749f1813?q=80&w=2000&auto=format&fit=crop',
    heading: 'CUNG CẤP PHỤ KIỆN XÂY DỰNG CHUYÊN NGHIỆP',
    subheading: 'Đồng hành cùng hàng nghìn công trình trên toàn quốc. Cam kết chất lượng chuẩn kiểm định, giao hàng tận nơi và tư vấn giải pháp kỹ thuật tối ưu chi phí.',
    cta_text: 'KHÁM PHÁ SẢN PHẨM',
    cta_link: '/products',
    prop_1: 'CÔNG TY TNHH ĐẦU TƯ XÂY DỰNG SBUILD',
    prop_2: 'Giao Hàng Công Trình 24/7',
    prop_3: 'Bảo Hành Chính Hãng',
    status: true,
    order: 1
  }
];

const defaultSettings: TenantSettings = {
  companyName: 'Công ty TNHH Đầu tư Xây dựng Sbuild',
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
  footerBlocks: [],
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
    normalized.includes('kientaokhonggiansong') ||
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

          setSettings((prev) => ({
            ...prev,
            brandColor: (data.brand_color && data.brand_color !== '#6366f1') ? data.brand_color : '#dc2626',
            logoUrl: data.logo_url || prev.logoUrl,
            companyName,
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
            socialLinks: Array.isArray(soc) ? soc : (soc.links || prev.socialLinks),
            footerBlocks: Array.isArray(fc) ? fc : (fc.blocks || prev.footerBlocks),
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
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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
          hotline: updated.hotline,
          address: updated.address,
          email: updated.email,
          mapUrl: updated.mapUrl,
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
              hotline: updated.hotline,
              address: updated.address,
              email: updated.email,
              mapUrl: updated.mapUrl,
              gaMeasurementId: updated.gaMeasurementId,
              gscVerificationCode: updated.gscVerificationCode,
              customHeaderScripts: updated.customHeaderScripts,
              blocks: updated.footerBlocks || existingFc.blocks || [],
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
