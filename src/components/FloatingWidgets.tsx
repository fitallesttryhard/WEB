import React, { useState } from 'react';
import { Phone, FileDown, ChevronUp, X, Sparkles } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface FloatingWidgetsProps {
  onOpenCatalogModal: () => void;
}

export default function FloatingWidgets({ onOpenCatalogModal }: FloatingWidgetsProps) {
  const { settings } = useSettings();
  const [showTooltip, setShowTooltip] = useState(true);

  const hotline = settings.hotline || '0901 234 567';
  const cleanPhone = hotline.replace(/\s+/g, '');
  const zaloUrl = `https://zalo.me/${cleanPhone}`;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 pointer-events-auto">
      
      {/* Tooltip Popup */}
      {showTooltip && (
        <div className="bg-slate-900/95 backdrop-blur-md text-white text-xs px-3.5 py-2 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300 relative border border-slate-700/60 max-w-[230px]">
          <Sparkles size={14} className="text-amber-400 shrink-0" />
          <span className="font-semibold leading-tight">Tư vấn vật tư & Báo giá Zalo 24/7</span>
          <button 
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-white p-0.5 ml-auto"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* Action Buttons Group */}
      <div className="flex flex-col items-end gap-2.5">
        {/* Tải Catalogue PDF CTA Button */}
        <button
          onClick={onOpenCatalogModal}
          className="group relative flex items-center gap-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-4 py-2.5 rounded-full shadow-lg shadow-amber-500/20 transition-all duration-300 hover:scale-105 active:scale-95 font-extrabold text-xs uppercase tracking-wider cursor-pointer"
          title="Tải Catalogue & Bảng Giá 2026 (PDF)"
        >
          <FileDown size={17} className="animate-bounce" />
          <span className="hidden sm:inline">Catalogue 2026</span>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
        </button>

        {/* Zalo Chat Button */}
        <a
          href={zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-full shadow-lg shadow-blue-600/25 transition-all duration-300 hover:scale-105 active:scale-95 font-extrabold text-xs uppercase tracking-wider"
          title="Chat Zalo tư vấn nhanh"
        >
          <div className="w-5 h-5 rounded-full bg-white text-blue-600 font-black text-[10px] flex items-center justify-center shrink-0 shadow-xs">
            Z
          </div>
          <span className="hidden sm:inline">Zalo Báo Giá</span>
        </a>

        {/* Call Hotline Button */}
        <a
          href={`tel:${cleanPhone}`}
          className="group flex items-center gap-2.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-700 hover:to-rose-800 text-white px-4 py-2.5 rounded-full shadow-lg shadow-red-600/30 transition-all duration-300 hover:scale-105 active:scale-95 font-extrabold text-xs uppercase tracking-wider"
          title={`Gọi Hotline ${hotline}`}
        >
          <Phone size={16} className="animate-pulse" />
          <span className="hidden sm:inline">{hotline}</span>
        </a>

        {/* Scroll to Top */}
        <button
          onClick={scrollToTop}
          className="w-9 h-9 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full flex items-center justify-center shadow-md backdrop-blur-sm transition-transform hover:scale-110 active:scale-95 cursor-pointer mt-1"
          title="Lên đầu trang"
        >
          <ChevronUp size={18} />
        </button>
      </div>

    </div>
  );
}
