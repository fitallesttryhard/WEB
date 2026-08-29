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
  fontFamily?: string;
  mapUrl?: string;
  gaMeasurementId?: string;
  gscVerificationCode?: string;
  customHeaderScripts?: string;
  status?: 'active' | 'locked' | 'inactive';
  subdomain?: string;
  plan?: string;
  paymentStatus?: string;
  socialLinks?: Array<{ platform: string; url: string }>;
  footerBlocks?: Array<{ title: string; links: Array<{ label: string; url: string }> }>;
  banners?: Array<any>;
  [key: string]: any;
}

interface SettingsContextType {
  settings: TenantSettings;
  updateSettings: (newSettings: Partial<TenantSettings>) => void;
  loading: boolean;
}

const defaultSettings: TenantSettings = {
  companyName: 'Công ty TNHH Công Nghệ Fi.tallest',
  hotline: '0909 876 817',
  address: 'Tòa nhà Công Nghệ Fi.tallest, Quận 1, TP. Hồ Chí Minh',
  email: 'contact@fitallest.com',
  companyDescription: 'Fitallest là đơn vị chuyên nghiệp trong lĩnh vực Thiết kế Website, Ứng dụng di động, UI/UX Design, Dịch vụ SEO Google và Hạ tầng Cloud Hosting. Cam kết mang đến giải pháp công nghệ hiệu quả và thẩm mỹ hàng đầu.',
  logoUrl: '',
  brandColor: '#dc2626',
  fontFamily: "'Inter', 'Be Vietnam Pro', sans-serif",
  mapUrl: 'https://maps.google.com/maps?q=T%E1%BA%A7ng%205%2C%20T%C3%B2a%20nh%C3%A0%20Fi.tallest%2C%20Qu%E1%BA%ADn%201%2C%20TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh&t=&z=15&ie=UTF8&iwloc=&output=embed',
  gaMeasurementId: '',
  gscVerificationCode: '',
  customHeaderScripts: '',
  status: 'active',
  subdomain: 'fitallest',
  plan: 'Enterprise',
  paymentStatus: 'Paid',
  socialLinks: [],
  footerBlocks: [],
  banners: [],
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  loading: false,
});

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<TenantSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  // Apply dynamic theme side-effects (CSS variables, Font Family, Favicon)
  useEffect(() => {
    if (settings.brandColor) {
      document.documentElement.style.setProperty('--brand-color', settings.brandColor);
      document.documentElement.style.setProperty('--primary-color', settings.brandColor);
    }
    if (settings.fontFamily) {
      document.documentElement.style.setProperty('font-family', settings.fontFamily);
      document.body.style.fontFamily = settings.fontFamily;
    }
    if (settings.faviconUrl) {
      let favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
      }
      favicon.href = settings.faviconUrl;
    }
  }, [settings.brandColor, settings.fontFamily, settings.faviconUrl]);

  useEffect(() => {
    async function fetchTenantSettings() {
      try {
        // 1. Fetch tenant metadata (status, subdomain, plan) from Supabase or localStorage
        let tenantStatus: 'active' | 'locked' = 'active';
        let tenantSubdomain = 'fitallest';
        let tenantPlan = 'Enterprise';

        // Check local storage for quick site-level override
        let localCustomSettings: Partial<TenantSettings> = {};
        const storedSiteSettings = localStorage.getItem('fitallest_site_custom_settings');
        if (storedSiteSettings) {
          try {
            localCustomSettings = JSON.parse(storedSiteSettings);
          } catch (e) {}
        }

        const localTenantsRaw = localStorage.getItem('saas_tenants_data');
        if (localTenantsRaw) {
          try {
            const list = JSON.parse(localTenantsRaw);
            const current = list.find((t: any) => t.subdomain === 'fitallest' || t.id === 'ten-1');
            if (current) {
              tenantStatus = current.status || 'active';
              tenantSubdomain = current.subdomain || 'fitallest';
              tenantPlan = current.plan || 'Enterprise';
            }
          } catch (e) {}
        }

        // 2. Fetch tenant_settings table from Supabase
        const { data, error } = await supabase
          .from('tenant_settings')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (data) {
          const fc = data.footer_config || {};
          const soc = data.socials || [];
          setSettings((prev) => ({
            ...prev,
            brandColor: data.brand_color || prev.brandColor,
            logoUrl: data.logo_url || prev.logoUrl,
            companyName: data.company_name || fc.companyName || prev.companyName,
            hotline: data.hotline || fc.hotline || prev.hotline,
            address: data.address || fc.address || prev.address,
            email: data.email || fc.email || prev.email,
            companyDescription: fc.companyDescription || prev.companyDescription,
            mapUrl: fc.mapUrl || prev.mapUrl,
            gaMeasurementId: fc.gaMeasurementId || localCustomSettings.gaMeasurementId || prev.gaMeasurementId || '',
            gscVerificationCode: fc.gscVerificationCode || localCustomSettings.gscVerificationCode || prev.gscVerificationCode || '',
            customHeaderScripts: fc.customHeaderScripts || localCustomSettings.customHeaderScripts || prev.customHeaderScripts || '',
            status: tenantStatus,
            subdomain: tenantSubdomain,
            plan: tenantPlan,
            socialLinks: Array.isArray(soc) ? soc : (soc.links || prev.socialLinks),
            footerBlocks: Array.isArray(fc) ? fc : (fc.blocks || prev.footerBlocks),
            banners: fc.banners || prev.banners || [],
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
          const current = list.find((t: any) => t.subdomain === 'fitallest' || t.id === 'ten-1');
          if (current) {
            setSettings(prev => ({
              ...prev,
              status: current.status,
              plan: current.plan
            }));
          }
        } catch (err) {}
      }
      if (e.key === 'fitallest_site_custom_settings' && e.newValue) {
        try {
          const updatedLocal = JSON.parse(e.newValue);
          setSettings(prev => ({ ...prev, ...updatedLocal }));
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateSettings = async (newSettings: Partial<TenantSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };

      // Save complete settings object to localStorage for instant local site override
      try {
        localStorage.setItem('fitallest_site_custom_settings', JSON.stringify(updated));
      } catch (e) {}

      // Async sync to Supabase in background
      (async () => {
        try {
          // Lấy tenant đầu tiên hoặc tạo record cấu hình
          const { data: existing } = await supabase.from('tenant_settings').select('id, footer_config').limit(1).maybeSingle();
          const existingFc = existing?.footer_config || {};

          const dbPayload = {
            company_name: updated.companyName,
            hotline: updated.hotline,
            address: updated.address,
            email: updated.email,
            logo_url: updated.logoUrl,
            brand_color: updated.brandColor,
            socials: updated.socialLinks,
            footer_config: {
              ...existingFc,
              companyName: updated.companyName,
              hotline: updated.hotline,
              address: updated.address,
              email: updated.email,
              companyDescription: updated.companyDescription,
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
            // Lấy tenant_id từ bảng tenants nếu có
            const { data: tenant } = await supabase.from('tenants').select('id').limit(1).maybeSingle();
            if (tenant?.id) {
              await supabase.from('tenant_settings').insert([{ ...dbPayload, tenant_id: tenant.id }]);
            }
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
