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
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2.5 pointer-events-auto">
      
      {/* Tooltip Popup */}
      {showTooltip && (
        <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300 relative border border-slate-800 max-w-[220px]">
          <Sparkles size={14} className="text-amber-400 shrink-0" />
          <span className="font-medium">Tư vấn vật tư & Báo giá Zalo 24/7</span>
          <button 
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-white p-0.5"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Tải Catalogue PDF CTA Button */}
      <button
        onClick={onOpenCatalogModal}
        className="group relative flex items-center gap-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-4 py-3 rounded-full shadow-lg shadow-amber-500/25 transition-all duration-300 hover:scale-105 active:scale-95 font-bold text-xs uppercase tracking-wider cursor-pointer"
        title="Tải Catalogue & Bảng Giá 2026 (PDF)"
      >
        <FileDown size={18} className="animate-bounce" />
        <span className="hidden sm:inline">Tải Catalogue 2026</span>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
      </button>

      {/* Zalo Chat Button */}
      <a
        href={zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-105 active:scale-95 font-bold text-xs uppercase tracking-wider"
        title="Chat Zalo tư vấn nhanh"
      >
        <div className="w-5 h-5 rounded-full bg-white text-blue-600 font-black text-[11px] flex items-center justify-center shrink-0">
          Z
        </div>
        <span className="hidden sm:inline">Chat Zalo Báo Giá</span>
      </a>

      {/* Call Hotline Button */}
      <a
        href={`tel:${cleanPhone}`}
        className="group flex items-center gap-2.5 bg-red-600 hover:bg-red-700 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-lg shadow-red-600/30 transition-all duration-300 hover:scale-105 active:scale-95 font-bold text-xs uppercase tracking-wider"
        title={`Gọi Hotline ${hotline}`}
      >
        <Phone size={18} className="animate-pulse" />
        <span className="hidden sm:inline">{hotline}</span>
      </a>

      {/* Scroll to Top */}
      <button
        onClick={scrollToTop}
        className="w-10 h-10 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full flex items-center justify-center shadow-md backdrop-blur-xs transition-transform hover:scale-110 active:scale-95 cursor-pointer"
        title="Lên đầu trang"
      >
        <ChevronUp size={18} />
      </button>

    </div>
  );
}
