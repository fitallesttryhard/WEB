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
  socialLinks?: Array<{ platform: string; url: string }>;
  footerBlocks?: Array<{ title: string; links: Array<{ label: string; url: string }> }>;
  [key: string]: any;
}

interface SettingsContextType {
  settings: TenantSettings;
  updateSettings: (newSettings: Partial<TenantSettings>) => void;
  loading: boolean;
}

const defaultSettings: TenantSettings = {
  companyName: 'Công ty TNHH Đầu tư Xây dựng Sbuild',
  hotline: '0901 234 567',
  address: 'Tầng 5, Tòa nhà Sbuild, Quận 1, TP. Hồ Chí Minh',
  email: 'contact@sbuild.vn',
  logoUrl: '',
  brandColor: '#dc2626',
  socialLinks: [],
  footerBlocks: [],
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  loading: false,
});

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<TenantSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTenantSettings() {
      try {
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
            socialLinks: Array.isArray(soc) ? soc : (soc.links || prev.socialLinks),
            footerBlocks: Array.isArray(fc) ? fc : (fc.blocks || prev.footerBlocks),
          }));
        }
      } catch (err) {
        console.warn('Lỗi lấy tenant_settings từ Supabase:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTenantSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<TenantSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };

      // Async sync to Supabase in background
      (async () => {
        try {
          // Lấy tenant đầu tiên hoặc tạo record cấu hình
          const { data: existing } = await supabase.from('tenant_settings').select('id').limit(1).maybeSingle();

          const dbPayload = {
            company_name: updated.companyName,
            hotline: updated.hotline,
            address: updated.address,
            email: updated.email,
            logo_url: updated.logoUrl,
            brand_color: updated.brandColor,
            socials: updated.socialLinks,
            footer_config: updated.footerBlocks,
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
