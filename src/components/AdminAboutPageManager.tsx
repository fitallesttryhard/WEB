"use client";
import React, { useState, useEffect } from 'react';
import {
  Save, ExternalLink, RefreshCw, Upload, Image as ImageIcon,
  CheckCircle2, ChevronDown, ChevronUp, Sparkles, Layers,
  Target, Eye, Wrench, Shield, Users, Building2, PhoneCall
} from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { AboutPageConfig, DEFAULT_ABOUT_PAGE_CONFIG } from '../types/about';
import MediaPickerModal from './MediaPickerModal';
import { supabase } from '../supabaseClient';

interface AdminAboutPageManagerProps {
  showToast: (message: string) => void;
}

export default function AdminAboutPageManager({ showToast }: AdminAboutPageManagerProps) {
  const { settings, updateSettings } = useSettings();
  const [config, setConfig] = useState<AboutPageConfig>(
    settings?.aboutPageConfig || DEFAULT_ABOUT_PAGE_CONFIG
  );
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Media Picker state
  const [mediaPickerConfig, setMediaPickerConfig] = useState<{
    isOpen: boolean;
    targetPath?: string;
  }>({ isOpen: false });

  // Sync with settings whenever settings change
  useEffect(() => {
    if (settings?.aboutPageConfig) {
      setConfig(settings.aboutPageConfig);
    }
  }, [settings?.aboutPageConfig]);

  // Handle nested updates
  const updateNestedField = (path: string, value: any) => {
    setConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      const parts = path.split('.');
      let current = clone;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) current[parts[i]] = {};
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      return clone;
    });
  };

  const handleOpenMediaPicker = (targetPath: string) => {
    setMediaPickerConfig({
      isOpen: true,
      targetPath,
    });
  };

  const handleMediaSelected = (selected: string[] | any) => {
    const url = Array.isArray(selected) ? selected[0] : selected;
    if (mediaPickerConfig.targetPath && url) {
      updateNestedField(mediaPickerConfig.targetPath, url);
    }
    setMediaPickerConfig({ isOpen: false });
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      // 1. Direct Supabase update
      const { data: existing } = await supabase
        .from('tenant_settings')
        .select('id, footer_config')
        .eq('tenant_id', '00000000-0000-0000-0000-000000000002')
        .maybeSingle();

      const existingFc = existing?.footer_config || {};
      const payload = {
        footer_config: {
          ...existingFc,
          aboutPageConfig: config,
        },
      };

      if (existing?.id) {
        await supabase.from('tenant_settings').update(payload).eq('id', existing.id);
      }

      // 2. Update React Context and local storage
      await updateSettings({ aboutPageConfig: config });

      // 3. Dispatch custom event for real-time listener update across pages
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('sbuild_settings_updated'));
      }

      showToast('Đã lưu và xuất bản thay đổi Trang Giới Thiệu thành công!');
    } catch (err) {
      console.error(err);
      showToast('Lỗi khi lưu cấu hình');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    if (confirm('Bạn có chắc chắn muốn khôi phục toàn bộ nội dung Trang Giới Thiệu về bản mẫu thiết kế ban đầu?')) {
      setConfig(DEFAULT_ABOUT_PAGE_CONFIG);
      try {
        await updateSettings({ aboutPageConfig: DEFAULT_ABOUT_PAGE_CONFIG });
        const { data: existing } = await supabase
          .from('tenant_settings')
          .select('id, footer_config')
          .eq('tenant_id', '00000000-0000-0000-0000-000000000002')
          .maybeSingle();
        if (existing?.id) {
          await supabase.from('tenant_settings').update({
            footer_config: {
              ...(existing.footer_config || {}),
              aboutPageConfig: DEFAULT_ABOUT_PAGE_CONFIG,
            }
          }).eq('id', existing.id);
        }
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('sbuild_settings_updated'));
        }
      } catch (e) {}
      showToast('Đã khôi phục nội dung mẫu!');
    }
  };

  const sectionsList = [
    { id: 'hero', label: '1. Banner Đầu Trang (Hero)', icon: Layers },
    { id: 'whoWeAre', label: '2. Chúng Tôi Là Ai', icon: Sparkles },
    { id: 'missionVision', label: '3. Sứ Mệnh & Tầm Nhìn', icon: Target },
    { id: 'solutions', label: '4. Giải Pháp Từng Hạng Mục', icon: Wrench },
    { id: 'coreValues', label: '5. Giá Trị Cốt Lõi', icon: Shield },
    { id: 'team', label: '6. Đội Ngũ Phát Triển', icon: Users },
    { id: 'partners', label: '7. Đối Tác Khách Hàng', icon: Building2 },
    { id: 'ctaBanner', label: '8. Banner Kêu Gọi Hành Động', icon: PhoneCall },
  ];

  return (
    <div className="animate-in fade-in duration-300 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Quản lý Trang Giới Thiệu</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Tùy biến 100% hình ảnh, tiêu đề, văn bản của tất cả các khối trên trang Giới Thiệu (/about).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/about"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-gray-200 hover:border-red-300 hover:text-red-600 text-gray-700 px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-xs flex items-center gap-2 group"
            title="Mở xem trang Giới Thiệu trong tab mới"
          >
            <ExternalLink size={16} className="text-red-600 group-hover:scale-110 transition-transform" />
            <span>Xem trên Web</span>
          </a>

          <button
            type="button"
            onClick={handleResetDefaults}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-1.5"
            title="Khôi phục thiết kế mẫu"
          >
            <RefreshCw size={15} />
            <span className="hidden sm:inline">Khôi phục mẫu</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-red-600/20 flex items-center gap-2 disabled:opacity-50 active:scale-95"
          >
            {isSaving ? (
              <span className="animate-spin mr-1">⏳</span>
            ) : (
              <Save size={16} />
            )}
            <span>Lưu thay đổi</span>
          </button>
        </div>
      </div>

      {/* Nav Tabs for 8 Sections */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none border-b border-gray-200">
        {sectionsList.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveSection(sec.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Icon size={15} className={isActive ? 'text-red-400' : 'text-gray-400'} />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* Section Forms */}
      <div className="space-y-6">

        {/* 1. HERO SECTION */}
        {activeSection === 'hero' && (
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 pb-4 border-b border-gray-100">
              <Layers className="text-red-600" size={20} />
              1. Cấu hình Banner Đầu Trang (Hero Section)
            </h2>

            {/* Background Image Preview & Picker */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Ảnh Nền Hero (Khuyến nghị 1920x800px)
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-full sm:w-72 h-36 rounded-xl overflow-hidden bg-slate-900 border border-gray-200 relative group shrink-0">
                  <img
                    src={config.hero.backgroundImage || '/images/about/about-hero.jpg'}
                    alt="Hero Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleOpenMediaPicker('hero.backgroundImage')}
                      className="bg-white text-gray-900 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm"
                    >
                      Đổi ảnh
                    </button>
                  </div>
                </div>

                <div className="flex-1 space-y-2 w-full">
                  <input
                    type="text"
                    value={config.hero.backgroundImage}
                    onChange={(e) => updateNestedField('hero.backgroundImage', e.target.value)}
                    placeholder="URL ảnh hoặc chọn từ thư viện..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleOpenMediaPicker('hero.backgroundImage')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors"
                  >
                    <Upload size={14} />
                    <span>Chọn ảnh từ máy tính / Thư viện</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Thẻ / Eyebrow Badge
                </label>
                <input
                  type="text"
                  value={config.hero.badge}
                  onChange={(e) => updateNestedField('hero.badge', e.target.value)}
                  placeholder="VD: VỀ SBUILD"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Tên Breadcrumb
                </label>
                <input
                  type="text"
                  value={config.hero.breadcrumbCurrent}
                  onChange={(e) => updateNestedField('hero.breadcrumbCurrent', e.target.value)}
                  placeholder="VD: Giới thiệu"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Tiêu đề chính (H1)
              </label>
              <input
                type="text"
                value={config.hero.title}
                onChange={(e) => updateNestedField('hero.title', e.target.value)}
                placeholder="VD: VẬT TƯ & GIẢI PHÁP HOÀN THIỆN CÔNG TRÌNH"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Mô tả giới thiệu ngắn
              </label>
              <textarea
                rows={3}
                value={config.hero.subtitle}
                onChange={(e) => updateNestedField('hero.subtitle', e.target.value)}
                placeholder="Mô tả dưới tiêu đề chính..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Chữ trên nút (CTA Button)
                </label>
                <input
                  type="text"
                  value={config.hero.ctaText}
                  onChange={(e) => updateNestedField('hero.ctaText', e.target.value)}
                  placeholder="VD: KHÁM PHÁ GIẢI PHÁP"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Liên kết nút
                </label>
                <input
                  type="text"
                  value={config.hero.ctaLink}
                  onChange={(e) => updateNestedField('hero.ctaLink', e.target.value)}
                  placeholder="VD: #solutions hoặc /products"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. CHÚNG TÔI LÀ AI */}
        {activeSection === 'whoWeAre' && (
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 pb-4 border-b border-gray-100">
              <Sparkles className="text-red-600" size={20} />
              2. Khối "Chúng Tôi Là Ai"
            </h2>

            {/* Image Picker */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Ảnh minh họa nẹp / thi công thực tế (Khuyến nghị 4:3)
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-full sm:w-64 h-48 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 relative group shrink-0">
                  <img
                    src={config.whoWeAre.image || '/images/about/about-tile-trim.jpg'}
                    alt="Who We Are"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleOpenMediaPicker('whoWeAre.image')}
                      className="bg-white text-gray-900 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm"
                    >
                      Đổi ảnh
                    </button>
                  </div>
                </div>

                <div className="flex-1 space-y-2 w-full">
                  <input
                    type="text"
                    value={config.whoWeAre.image}
                    onChange={(e) => updateNestedField('whoWeAre.image', e.target.value)}
                    placeholder="URL ảnh hoặc chọn từ thư viện..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleOpenMediaPicker('whoWeAre.image')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors"
                  >
                    <Upload size={14} />
                    <span>Tải ảnh mới từ máy tính</span>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Thẻ Eyebrow
              </label>
              <input
                type="text"
                value={config.whoWeAre.badge}
                onChange={(e) => updateNestedField('whoWeAre.badge', e.target.value)}
                placeholder="VD: CHÚNG TÔI LÀ AI"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Tiêu đề khối
              </label>
              <input
                type="text"
                value={config.whoWeAre.heading}
                onChange={(e) => updateNestedField('whoWeAre.heading', e.target.value)}
                placeholder="VD: Hoàn thiện bắt đầu từ lựa chọn đúng"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Nội dung chi tiết
              </label>
              <textarea
                rows={3}
                value={config.whoWeAre.description}
                onChange={(e) => updateNestedField('whoWeAre.description', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
              />
            </div>

            {/* 3 Pills */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                3 Thẻ Tính Năng Nổi Bật Dưới Chân Khối
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(config.whoWeAre.featurePills || []).map((pill, idx) => (
                  <div key={pill.id || idx} className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Thẻ {idx + 1}</span>
                    <input
                      type="text"
                      value={pill.label}
                      onChange={(e) => {
                        const nextPills = [...config.whoWeAre.featurePills];
                        nextPills[idx] = { ...nextPills[idx], label: e.target.value };
                        updateNestedField('whoWeAre.featurePills', nextPills);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-bold uppercase outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. SỨ MỆNH & TẦM NHÌN */}
        {activeSection === 'missionVision' && (
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 pb-4 border-b border-gray-100">
              <Target className="text-red-600" size={20} />
              3. Sứ Mệnh & Tầm Nhìn
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sứ Mệnh */}
              <div className="p-5 border border-red-100 bg-red-50/30 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 font-black text-sm text-red-600 uppercase tracking-wider">
                  <Target size={18} />
                  <span>Cột Sứ Mệnh</span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Thẻ Badge</label>
                  <input
                    type="text"
                    value={config.missionVision.mission.badge}
                    onChange={(e) => updateNestedField('missionVision.mission.badge', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Tiêu đề</label>
                  <input
                    type="text"
                    value={config.missionVision.mission.title}
                    onChange={(e) => updateNestedField('missionVision.mission.title', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Mô tả</label>
                  <textarea
                    rows={3}
                    value={config.missionVision.mission.description}
                    onChange={(e) => updateNestedField('missionVision.mission.description', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium outline-none"
                  />
                </div>
              </div>

              {/* Tầm Nhìn */}
              <div className="p-5 border border-slate-200 bg-slate-50/50 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 font-black text-sm text-slate-800 uppercase tracking-wider">
                  <Eye size={18} className="text-red-600" />
                  <span>Cột Tầm Nhìn</span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Thẻ Badge</label>
                  <input
                    type="text"
                    value={config.missionVision.vision.badge}
                    onChange={(e) => updateNestedField('missionVision.vision.badge', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Tiêu đề</label>
                  <input
                    type="text"
                    value={config.missionVision.vision.title}
                    onChange={(e) => updateNestedField('missionVision.vision.title', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Mô tả</label>
                  <textarea
                    rows={3}
                    value={config.missionVision.vision.description}
                    onChange={(e) => updateNestedField('missionVision.vision.description', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. GIẢI PHÁP TỪNG HẠNG MỤC */}
        {activeSection === 'solutions' && (
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 pb-4 border-b border-gray-100">
              <Wrench className="text-red-600" size={20} />
              4. Giải Pháp Cho Từng Hạng Mục (3 Thẻ Danh Mục)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Tiêu đề Khối
                </label>
                <input
                  type="text"
                  value={config.solutions.title}
                  onChange={(e) => updateNestedField('solutions.title', e.target.value)}
                  placeholder="VD: Giải pháp cho từng hạng mục"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Mô tả ngắn
                </label>
                <input
                  type="text"
                  value={config.solutions.subtitle}
                  onChange={(e) => updateNestedField('solutions.subtitle', e.target.value)}
                  placeholder="VD: Danh mục vật tư gắn với nhu cầu hoàn thiện..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium outline-none"
                />
              </div>
            </div>

            {/* 3 Solution Items */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {(config.solutions.items || []).map((item, idx) => (
                <div key={item.id || idx} className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-red-600">Thẻ {idx + 1}</span>
                  
                  {/* Image */}
                  <div className="h-32 rounded-xl overflow-hidden bg-gray-200 relative group">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => handleOpenMediaPicker(`solutions.items.${idx}.image`)}
                        className="bg-white text-gray-900 px-3 py-1 rounded text-xs font-bold"
                      >
                        Đổi ảnh
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      const nextItems = [...config.solutions.items];
                      nextItems[idx] = { ...nextItems[idx], title: e.target.value };
                      updateNestedField('solutions.items', nextItems);
                    }}
                    placeholder="Tên giải pháp"
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold outline-none"
                  />

                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) => {
                      const nextItems = [...config.solutions.items];
                      nextItems[idx] = { ...nextItems[idx], description: e.target.value };
                      updateNestedField('solutions.items', nextItems);
                    }}
                    placeholder="Mô tả tóm tắt"
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium outline-none"
                  />

                  <input
                    type="text"
                    value={item.link || '/products'}
                    onChange={(e) => {
                      const nextItems = [...config.solutions.items];
                      nextItems[idx] = { ...nextItems[idx], link: e.target.value };
                      updateNestedField('solutions.items', nextItems);
                    }}
                    placeholder="Link liên kết (/products)"
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-[11px] text-gray-500 outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. GIÁ TRỊ CỐT LÕI */}
        {activeSection === 'coreValues' && (
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 pb-4 border-b border-gray-100">
              <Shield className="text-red-600" size={20} />
              5. Giá Trị Cốt Lõi (Khối Xanh Đen Navy)
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Tiêu đề khối
              </label>
              <input
                type="text"
                value={config.coreValues.title}
                onChange={(e) => updateNestedField('coreValues.title', e.target.value)}
                placeholder="VD: Lựa chọn phù hợp. Thi công chỉn chu."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(config.coreValues.items || []).map((val, idx) => (
                <div key={val.id || idx} className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                  <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Cột {idx + 1}</span>
                  <input
                    type="text"
                    value={val.title}
                    onChange={(e) => {
                      const nextItems = [...config.coreValues.items];
                      nextItems[idx] = { ...nextItems[idx], title: e.target.value };
                      updateNestedField('coreValues.items', nextItems);
                    }}
                    placeholder="Tiêu đề giá trị"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-bold outline-none"
                  />
                  <textarea
                    rows={2}
                    value={val.description}
                    onChange={(e) => {
                      const nextItems = [...config.coreValues.items];
                      nextItems[idx] = { ...nextItems[idx], description: e.target.value };
                      updateNestedField('coreValues.items', nextItems);
                    }}
                    placeholder="Mô tả giá trị"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-medium outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. ĐỘI NGŨ PHÁT TRIỂN SBUILD */}
        {activeSection === 'team' && (
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 pb-4 border-b border-gray-100">
              <Users className="text-red-600" size={20} />
              6. Đội Ngũ Phát Triển SBUILD
            </h2>

            {/* Team Photo */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Ảnh Đội Ngũ SBUILD (Khuyến nghị 16:10 hoặc 16:9)
                </label>
                <span className="text-xs text-red-600 italic font-medium">* Thay bằng ảnh thực tế của công ty bạn</span>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-full sm:w-72 h-44 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 relative group shrink-0">
                  <img
                    src={config.team.image || '/images/about/about-team.jpg'}
                    alt="Team Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleOpenMediaPicker('team.image')}
                      className="bg-white text-gray-900 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm"
                    >
                      Đổi ảnh
                    </button>
                  </div>
                </div>

                <div className="flex-1 space-y-2 w-full">
                  <input
                    type="text"
                    value={config.team.image}
                    onChange={(e) => updateNestedField('team.image', e.target.value)}
                    placeholder="URL ảnh hoặc chọn từ thư viện..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleOpenMediaPicker('team.image')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors"
                  >
                    <Upload size={14} />
                    <span>Tải ảnh đội ngũ công ty lên</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Tiêu đề Khối
                </label>
                <input
                  type="text"
                  value={config.team.title}
                  onChange={(e) => updateNestedField('team.title', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Mô tả ngắn
                </label>
                <input
                  type="text"
                  value={config.team.subtitle}
                  onChange={(e) => updateNestedField('team.subtitle', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium outline-none"
                />
              </div>
            </div>

            {/* 3 Pillars */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                3 Trụ Cột Hỗ Trợ Khách Hàng
              </label>
              {(config.team.pillars || []).map((pillar, idx) => (
                <div key={pillar.id || idx} className="p-4 bg-gray-50 border border-gray-200 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 block mb-1">Tên trụ cột {idx + 1}</span>
                    <input
                      type="text"
                      value={pillar.title}
                      onChange={(e) => {
                        const nextPillars = [...config.team.pillars];
                        nextPillars[idx] = { ...nextPillars[idx], title: e.target.value };
                        updateNestedField('team.pillars', nextPillars);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[10px] font-bold text-gray-400 block mb-1">Nội dung chi tiết</span>
                    <input
                      type="text"
                      value={pillar.description}
                      onChange={(e) => {
                        const nextPillars = [...config.team.pillars];
                        nextPillars[idx] = { ...nextPillars[idx], description: e.target.value };
                        updateNestedField('team.pillars', nextPillars);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. ĐỐI TÁC KHÁCH HÀNG */}
        {activeSection === 'partners' && (
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 pb-4 border-b border-gray-100">
              <Building2 className="text-red-600" size={20} />
              7. Đối Tác Khách Hàng
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Tiêu đề Khối
                </label>
                <input
                  type="text"
                  value={config.partners.title}
                  onChange={(e) => updateNestedField('partners.title', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Mô tả
                </label>
                <input
                  type="text"
                  value={config.partners.subtitle}
                  onChange={(e) => updateNestedField('partners.subtitle', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium outline-none"
                />
              </div>
            </div>

            {/* 4 Partners */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(config.partners.items || []).map((partner, idx) => (
                <div key={partner.id || idx} className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 block">Đối tác {idx + 1}</span>
                  <input
                    type="text"
                    value={partner.label}
                    onChange={(e) => {
                      const nextItems = [...config.partners.items];
                      nextItems[idx] = { ...nextItems[idx], label: e.target.value };
                      updateNestedField('partners.items', nextItems);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-bold uppercase text-center outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. CTA BANNER */}
        {activeSection === 'ctaBanner' && (
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 pb-4 border-b border-gray-100">
              <PhoneCall className="text-red-600" size={20} />
              8. Khối Kêu Gọi Hành Động (CTA Banner Chân Trang)
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Tiêu đề Banner
              </label>
              <input
                type="text"
                value={config.ctaBanner.title}
                onChange={(e) => updateNestedField('ctaBanner.title', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Mô tả Banner
              </label>
              <input
                type="text"
                value={config.ctaBanner.subtitle}
                onChange={(e) => updateNestedField('ctaBanner.subtitle', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Chữ trên nút bấm
                </label>
                <input
                  type="text"
                  value={config.ctaBanner.buttonText}
                  onChange={(e) => updateNestedField('ctaBanner.buttonText', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold outline-none uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Đường dẫn (Link)
                </label>
                <input
                  type="text"
                  value={config.ctaBanner.buttonLink}
                  onChange={(e) => updateNestedField('ctaBanner.buttonLink', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium outline-none"
                />
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerConfig.isOpen}
        onClose={() => setMediaPickerConfig({ isOpen: false })}
        onSelect={handleMediaSelected}
      />
    </div>
  );
}
