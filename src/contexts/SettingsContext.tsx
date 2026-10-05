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

/**
 * Giá trị khởi tạo TRỐNG: không còn thông tin công ty / hotline / địa chỉ / banner / footer mẫu.
 * Trong lúc dữ liệu thật chưa nạp xong (loading = true) các component phải hiển thị skeleton
 * hoặc để trống, tuyệt đối không hiển thị dữ liệu giả rồi mới "nhảy" sang dữ liệu thật.
 */
const defaultSettings: TenantSettings = {
  companyName: '',
  companyDescription: '',
  hotline: '',
  address: '',
  email: '',
  logoUrl: '',
  brandColor: '#dc2626',
  mapUrl: '',
  gaMeasurementId: '',
  gscVerificationCode: '',
  customHeaderScripts: '',
  status: 'active',
  subdomain: 'sbuild',
  plan: 'Enterprise',
  paymentStatus: 'Paid',
  socialLinks: [],
  footerBlocks: [],
  banners: [],
  aboutPageConfig: DEFAULT_ABOUT_PAGE_CONFIG,
};

// Bản sao dữ liệu THẬT lần tải trước để lần vào sau hiển thị ngay (không phải dữ liệu mẫu)
const SETTINGS_CACHE_KEY = 'sbuild_settings_real_cache_v1';

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

  // Nạp ngay bản sao dữ liệu thật đã lưu từ lần trước (nếu có) để tránh khung trống khi vào web
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_CACHE_KEY);
      if (!raw) return;
      const cached = JSON.parse(raw);
      if (cached && typeof cached === 'object') {
        setSettings((prev) => ({ ...prev, ...cached }));
        setLoading(false);
      }
    } catch (e) {}
  }, []);

  // Lưu lại dữ liệu thật sau khi đã nạp xong
  useEffect(() => {
    if (loading) return;
    try {
      const { status, subdomain, plan, paymentStatus, banners, ...rest } = settings;
      const safeBanners = (banners || []).filter(
        (b: any) => !(typeof b?.image_url === 'string' && b.image_url.startsWith('data:'))
      );
      localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify({ ...rest, banners: safeBanners }));
    } catch (e) {}
  }, [settings, loading]);

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

          // Loại bỏ dữ liệu cũ của Fi.tallest (không thay bằng dữ liệu mẫu)
          let companyName = data.company_name || fc.companyName || '';
          if (isLegacyText(companyName)) {
            companyName = '';
          }

          let hotline = data.hotline || fc.hotline || '';
          if (isLegacyText(hotline)) {
            hotline = '';
          }

          let email = data.email || fc.email || '';
          if (isLegacyText(email)) {
            email = '';
          }

          // Sanitize banners
          let rawBanners = fc.banners || data.banners || [];
          let cleanBanners = Array.isArray(rawBanners)
            ? rawBanners.filter((b: any) => !isLegacyText(b))
            : [];

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
          const finalBlocks = Array.isArray(rawBlocks) ? rawBlocks : [];

          setSettings((prev) => {
            let safeLogoUrl = data.logo_url || prev.logoUrl || '';
            if (typeof safeLogoUrl === 'string' && safeLogoUrl.startsWith('blob:')) {
              safeLogoUrl = '';
            }
            return {
              ...prev,
              brandColor: (data.brand_color && data.brand_color !== '#6366f1') ? data.brand_color : '#dc2626',
              logoUrl: safeLogoUrl,
            companyName,
            companyDescription: fc.companyDescription || '',
            aboutImageUrl: fc.aboutImageUrl || data.about_image_url || localCustomSettings.aboutImageUrl || prev.aboutImageUrl,
            hotline,
            address: data.address || fc.address || '',
            email,
            mapUrl: fc.mapUrl || '',
            gaMeasurementId: fc.gaMeasurementId || localCustomSettings.gaMeasurementId || prev.gaMeasurementId || '',
            gscVerificationCode: fc.gscVerificationCode || localCustomSettings.gscVerificationCode || prev.gscVerificationCode || '',
            customHeaderScripts: fc.customHeaderScripts || localCustomSettings.customHeaderScripts || prev.customHeaderScripts || '',
            status: tenantStatus,
            subdomain: tenantSubdomain,
            plan: tenantPlan,
            socialLinks: Array.isArray(soc) && soc.length > 0 ? soc : (soc.links || []),
            footerBlocks: finalBlocks,
            aboutPageConfig: fc.aboutPageConfig || localCustomSettings.aboutPageConfig || DEFAULT_ABOUT_PAGE_CONFIG,
            ...localCustomSettings,
            banners: cleanBanners,
          };
        });
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
              blocks: updated.footerBlocks || existingFc.blocks || [],
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
