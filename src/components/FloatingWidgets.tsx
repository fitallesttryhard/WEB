import React, { useState, useEffect } from 'react';
import { Phone, FileDown, ChevronUp, X, Sparkles, MessageCircle, Send } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { parseMultiContact, ContactItem } from '../utils/contactParser';
import MultiContactModal from './MultiContactModal';

interface FloatingWidgetsProps {
  onOpenCatalogModal: () => void;
}

export default function FloatingWidgets({ onOpenCatalogModal }: FloatingWidgetsProps) {
  const { settings } = useSettings();
  const [showTooltip, setShowTooltip] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeModal, setActiveModal] = useState<{
    isOpen: boolean;
    type: 'phone' | 'zalo' | 'email' | 'facebook';
    title: string;
    items: ContactItem[];
  }>({
    isOpen: false,
    type: 'phone',
    title: '',
    items: [],
  });

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // If floating widgets are globally disabled in Admin, return null
  if (settings.enableFloatingWidgets === false) {
    return null;
  }

  const hotlineRaw = settings.hotline || '0909 876 817';
  const zaloRaw = settings.zaloUrl || 'https://zalo.me/0909876817';
  const messengerUrl = settings.messengerUrl || 'https://m.me/fitallest.tech';
  const telegramUrl = settings.telegramUrl || 'https://t.me/fitallest';

  const hotlineItems = parseMultiContact(hotlineRaw, 'phone');
  const zaloItems = parseMultiContact(zaloRaw, 'zalo');

  const showHotline = settings.enableHotlineWidget !== false && hotlineItems.length > 0;
  const showZalo = settings.enableZaloWidget !== false && zaloItems.length > 0;
  const showMessenger = settings.enableMessengerWidget !== false && Boolean(messengerUrl);
  const showTelegram = settings.enableTelegramWidget === true && Boolean(telegramUrl);

  const handleHotlineClick = (e: React.MouseEvent) => {
    if (hotlineItems.length > 1) {
      e.preventDefault();
      setActiveModal({
        isOpen: true,
        type: 'phone',
        title: 'Hotline Liên Hệ & Tư Vấn Báo Giá',
        items: hotlineItems,
      });
    }
  };

  const handleZaloClick = (e: React.MouseEvent) => {
    if (zaloItems.length > 1) {
      e.preventDefault();
      setActiveModal({
        isOpen: true,
        type: 'zalo',
        title: 'Kênh Zalo Tư Vấn & Hỗ Trợ Khách Hàng',
        items: zaloItems,
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const firstHotline = hotlineItems[0] || { raw: '0909 876 817', clean: '0909876817' };
  const firstZalo = zaloItems[0] || { clean: 'https://zalo.me/0909876817' };

  return (
    <>
      {/* ================= DESKTOP VIEW (PC: Retain side position) ================= */}
      <div className="fixed bottom-5 right-5 z-40 hidden sm:flex flex-col items-end gap-3 pointer-events-auto">
        {/* Tooltip Popup */}
        {showTooltip && (
          <div className="bg-slate-900/95 backdrop-blur-md text-white text-xs px-3.5 py-2 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300 relative border border-slate-700/60 max-w-[250px]">
            <Sparkles size={14} className="text-cyan-400 shrink-0 animate-pulse" />
            <span className="font-semibold leading-tight text-slate-200">Tư vấn giải pháp & Báo giá tự động 24/7</span>
            <button
              onClick={() => setShowTooltip(false)}
              className="text-slate-400 hover:text-white p-0.5 ml-auto cursor-pointer"
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
            title="Tải Profile & Báo Giá 2026 (PDF)"
          >
            <FileDown size={17} className="animate-bounce" />
            <span>Hồ Sơ Năng Lực</span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
          </button>

          {/* Telegram Chat Button */}
          {showTelegram && (
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2.5 rounded-full shadow-lg shadow-sky-500/25 transition-all duration-300 hover:scale-105 active:scale-95 font-extrabold text-xs uppercase tracking-wider"
              title="Chat Telegram"
            >
              <Send size={16} className="shrink-0" />
              <span>Telegram</span>
            </a>
          )}

          {/* Messenger Chat Button */}
          {showMessenger && (
            <a
              href={messengerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-full shadow-lg shadow-indigo-600/25 transition-all duration-300 hover:scale-105 active:scale-95 font-extrabold text-xs uppercase tracking-wider"
              title="Chat Messenger Facebook"
            >
              <MessageCircle size={16} className="shrink-0" />
              <span>Messenger</span>
            </a>
          )}

          {/* Zalo Chat Button */}
          {showZalo && (
            <a
              href={firstZalo.clean}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleZaloClick}
              className="group flex items-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-full shadow-lg shadow-blue-600/25 transition-all duration-300 hover:scale-105 active:scale-95 font-extrabold text-xs uppercase tracking-wider cursor-pointer"
              title={zaloItems.length > 1 ? 'Chọn phòng ban Zalo chat' : 'Chat Zalo tư vấn nhanh'}
            >
              <div className="w-5 h-5 rounded-full bg-white text-blue-600 font-black text-[10px] flex items-center justify-center shrink-0 shadow-xs">
                Z
              </div>
              <span>
                {zaloItems.length > 1 ? `Zalo (${zaloItems.length} Kênh)` : 'Zalo Báo Giá'}
              </span>
            </a>
          )}

          {/* Call Hotline Button */}
          {showHotline && (
            <a
              href={`tel:${firstHotline.clean}`}
              onClick={handleHotlineClick}
              className="group flex items-center gap-2.5 bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white px-4 py-2.5 rounded-full shadow-lg shadow-indigo-600/30 transition-all duration-300 hover:scale-105 active:scale-95 font-extrabold text-xs uppercase tracking-wider cursor-pointer"
              title={hotlineItems.length > 1 ? 'Chọn Hotline phòng ban' : `Gọi Hotline ${firstHotline.raw}`}
            >
              <Phone size={16} className="animate-pulse" />
              <span>
                {hotlineItems.length > 1 ? `Hotline (${hotlineItems.length} số)` : firstHotline.raw}
              </span>
            </a>
          )}

          {/* Scroll to Top */}
          <button
            onClick={scrollToTop}
            className="w-9 h-9 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full flex items-center justify-center shadow-md backdrop-blur-sm transition-transform hover:scale-110 active:scale-95 cursor-pointer mt-1 border border-slate-700/50"
            title="Lên đầu trang"
          >
            <ChevronUp size={18} />
          </button>
        </div>
      </div>

      {/* ================= MOBILE VIEW (Bottom Dock to avoid covering content) ================= */}
      <div className="sm:hidden pointer-events-auto">
        {/* Mobile Scroll to Top button (only displays when scrolled down) */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-16 right-3.5 z-50 w-7 h-7 rounded-full bg-[#050A14]/90 border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:text-white shadow-lg backdrop-blur-md active:scale-90 transition-all cursor-pointer animate-in fade-in"
            title="Lên đầu trang"
            aria-label="Lên đầu trang"
          >
            <ChevronUp size={14} />
          </button>
        )}

        {/* Mobile Bottom Action Bar (Refined Cyber Capsule Dock) */}
        <nav 
          aria-label="Thanh tác vụ nhanh di động"
          className="fixed bottom-3.5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-[340px] px-3 py-1.5 rounded-full bg-[#050A14]/90 backdrop-blur-2xl border border-white/10 shadow-[0_12px_36px_rgba(0,0,0,0.85),0_0_20px_rgba(6,182,212,0.12)] ring-1 ring-cyan-500/20 flex items-center justify-between pointer-events-auto"
        >
          {/* Subtle top neon hairline glow */}
          <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none" />

          {/* Tải Profile / Catalogue CTA */}
          <button
            onClick={onOpenCatalogModal}
            className="group flex-1 flex flex-col items-center justify-center py-0.5 transition-all active:scale-90 cursor-pointer relative"
          >
            <span className="absolute -top-0.5 right-1.5 w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping opacity-90" />
            <FileDown size={15} className="text-amber-400 group-hover:scale-110 transition-transform mb-0.5" />
            <span className="text-[9px] font-mono tracking-wider font-semibold text-slate-400 group-hover:text-amber-300 transition-colors">HỒ SƠ</span>
          </button>

          {/* Hairline Divider */}
          {showZalo && <div className="w-[1px] h-4 bg-white/[0.08] shrink-0" />}

          {/* Zalo CTA */}
          {showZalo && (
            <a
              href={firstZalo.clean}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleZaloClick}
              className="group flex-1 flex flex-col items-center justify-center py-0.5 transition-all active:scale-90 cursor-pointer"
            >
              <div className="w-4 h-4 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 font-mono font-black text-[9px] mb-0.5 group-hover:scale-110 transition-transform">
                Z
              </div>
              <span className="text-[9px] font-mono tracking-wider font-semibold text-slate-400 group-hover:text-blue-300 transition-colors">ZALO</span>
            </a>
          )}

          {/* Hairline Divider */}
          {showHotline && <div className="w-[1px] h-4 bg-white/[0.08] shrink-0" />}

          {/* Hotline CTA */}
          {showHotline && (
            <a
              href={`tel:${firstHotline.clean}`}
              onClick={handleHotlineClick}
              className="group flex-1 flex flex-col items-center justify-center py-0.5 transition-all active:scale-90 cursor-pointer"
            >
              <Phone size={14} className="text-cyan-400 animate-pulse group-hover:scale-110 transition-transform mb-0.5" />
              <span className="text-[9px] font-mono tracking-wider font-semibold text-slate-400 group-hover:text-cyan-300 transition-colors">GỌI ĐIỆN</span>
            </a>
          )}

          {/* Hairline Divider */}
          {showMessenger && <div className="w-[1px] h-4 bg-white/[0.08] shrink-0" />}

          {/* Messenger CTA */}
          {showMessenger && (
            <a
              href={messengerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex-1 flex flex-col items-center justify-center py-0.5 transition-all active:scale-90 cursor-pointer"
            >
              <MessageCircle size={14} className="text-purple-400 group-hover:scale-110 transition-transform mb-0.5" />
              <span className="text-[9px] font-mono tracking-wider font-semibold text-slate-400 group-hover:text-purple-300 transition-colors">TƯ VẤN</span>
            </a>
          )}

          {/* Hairline Divider */}
          {showTelegram && <div className="w-[1px] h-4 bg-white/[0.08] shrink-0" />}

          {/* Telegram CTA */}
          {showTelegram && (
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex-1 flex flex-col items-center justify-center py-0.5 transition-all active:scale-90 cursor-pointer"
            >
              <Send size={14} className="text-sky-400 group-hover:scale-110 transition-transform mb-0.5" />
              <span className="text-[9px] font-mono tracking-wider font-semibold text-slate-400 group-hover:text-sky-300 transition-colors">TELEGRAM</span>
            </a>
          )}
        </nav>
      </div>

      {/* Multi Contact Modal */}
      <MultiContactModal
        isOpen={activeModal.isOpen}
        onClose={() => setActiveModal((prev) => ({ ...prev, isOpen: false }))}
        title={activeModal.title}
        type={activeModal.type}
        items={activeModal.items}
      />
    </>
  );
}
