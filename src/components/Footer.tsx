"use client";
import React from 'react';
import { MapPin, Phone, Mail, Facebook, Youtube, Instagram, Twitter, Video, MessageCircle, Globe, ChevronRight } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

export default function Footer() {
  const { settings } = useSettings();

  const getSocialIcon = (platform: string) => {
    switch (platform?.toLowerCase()) {
      case 'facebook': return <Facebook size={14} />;
      case 'youtube': return <Youtube size={14} />;
      case 'instagram': return <Instagram size={14} />;
      case 'twitter': return <Twitter size={14} />;
      case 'tiktok': return <Video size={14} />;
      case 'zalo': return <MessageCircle size={14} />;
      default: return <Globe size={14} />;
    }
  };

  // Chỉ hiển thị mạng xã hội thật do admin cấu hình (không có liên kết '#' giả)
  const socialLinks = settings.socialLinks && settings.socialLinks.length > 0
    ? settings.socialLinks
    : [];

  const footerBlocks = settings.footerBlocks || [];

  return (
    <footer className="bg-slate-950 text-slate-300 pt-24 pb-12 shrink-0 border-t border-slate-800/80 relative z-0">
      {/* Top Subtle Red Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-rose-600 to-red-600"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          
          {/* Col 1: About / Company Name */}
          <div className="lg:col-span-4">
            <div className="flex flex-col gap-4 mb-6">
              {/* Logo Footer: Loại bỏ hoàn toàn khung viền, căn giữa, chống chìm với phiên bản chữ trắng + S đỏ */}
              <div className="w-full flex justify-center py-1">
                <a href="/" className="inline-block group focus:outline-none">
                  <img 
                    src="/logo-white.webp" 
                    alt={settings.companyName || 'SBUILD'} 
                    className="h-12 sm:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_2px_14px_rgba(255,255,255,0.08)]" 
                    onError={(e) => {
                      // Fallback nếu cần
                      if (settings.logoUrl) (e.target as HTMLImageElement).src = settings.logoUrl;
                    }}
                  />
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600"></span>
                <span className="text-sm font-black uppercase tracking-wider text-white">
                  {settings.companyName}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-6 font-medium max-w-sm">
              {settings.companyDescription}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {socialLinks.map((link: any, index: number) => (
                <a 
                  key={index} 
                  href={link.url || '#'} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800/80 text-slate-400 flex items-center justify-center hover:bg-red-600 hover:border-red-600 hover:text-white transition-all duration-200 uppercase shadow-xs"
                  title={link.platform}
                >
                  {getSocialIcon(link.platform)}
                </a>
              ))}
            </div>
          </div>

          {/* Dynamic Blocks or Default Links */}
          {footerBlocks.length > 0 ? (
            footerBlocks.map((block: any, index: number) => {
              // Dynamic column span based on total blocks
              const blockSpan = footerBlocks.length === 1 
                ? 'lg:col-span-3' 
                : block.type === 'text' 
                  ? 'lg:col-span-3' 
                  : 'lg:col-span-2';

              return (
                <div key={block.id || index} className={blockSpan}>
                  <h3 className="text-[11px] font-extrabold uppercase text-slate-400 tracking-widest mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                    {block.title || 'Thông tin'}
                  </h3>
                  {block.type === 'links' && block.items && (
                    <ul className="flex flex-col gap-3 font-medium text-xs">
                      {block.items.map((item: any, i: number) => (
                        <li key={i}>
                          <a href={item.url || '#'} className="text-slate-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1.5 group">
                            <ChevronRight size={12} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span>{item.label || item.title}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                  {block.type === 'text' && (
                    <p className="text-xs text-slate-400 leading-relaxed font-medium whitespace-pre-line">
                      {block.content}
                    </p>
                  )}
                  {block.type === 'image' && block.url && (
                    <div className="mt-2">
                      <img src={block.url} alt={block.title || 'Footer image'} style={{ maxWidth: `${block.width || 120}px` }} className="rounded-lg object-contain bg-slate-900 p-2 border border-slate-800" />
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="lg:col-span-3">
              <h3 className="text-[11px] font-extrabold uppercase text-slate-400 tracking-widest mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                Danh Mục Nhanh
              </h3>
              <ul className="flex flex-col gap-3 font-medium text-xs">
                <li>
                  <a href="/" className="text-slate-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1.5 group">
                    <ChevronRight size={12} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" /> Trang chủ
                  </a>
                </li>
                <li>
                  <a href="/about" className="text-slate-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1.5 group">
                    <ChevronRight size={12} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" /> Về chúng tôi
                  </a>
                </li>
                <li>
                  <a href="/products" className="text-slate-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1.5 group">
                    <ChevronRight size={12} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" /> Danh mục vật tư
                  </a>
                </li>
                <li>
                  <a href="/blog" className="text-slate-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1.5 group">
                    <ChevronRight size={12} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" /> Cẩm nang & Kinh nghiệm
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-slate-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1.5 group">
                    <ChevronRight size={12} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" /> Yêu cầu báo giá
                  </a>
                </li>
              </ul>
            </div>
          )}

          {/* Col Contact */}
          <div className={footerBlocks.length >= 2 ? "lg:col-span-3" : "lg:col-span-5"}>
            <h3 className="text-[11px] font-extrabold uppercase text-slate-400 tracking-widest mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
              Thông Tin Trụ Sở & Liên Hệ
            </h3>
            <ul className="flex flex-col gap-4 text-xs font-medium">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800/80 text-red-500 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <MapPin size={15} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Địa chỉ văn phòng</span>
                  <span className="text-slate-300 font-semibold">{settings.address}</span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800/80 text-red-500 flex items-center justify-center shrink-0 shadow-xs">
                  <Phone size={15} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Hotline tư vấn B2B</span>
                  <a href={`tel:${(settings.hotline || '').replace(/\s+/g, '')}`} className="text-white font-extrabold hover:text-red-400 transition-colors">
                    {settings.hotline}
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800/80 text-red-500 flex items-center justify-center shrink-0 shadow-xs">
                  <Mail size={15} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Email tiếp nhận báo giá</span>
                  <a href={`mailto:${settings.email}`} className="text-slate-300 hover:text-white transition-colors">
                    {settings.email}
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
          <p>&copy; {new Date().getFullYear()} <span className="text-slate-300 font-bold">{settings.companyName}</span>. Tất cả quyền được bảo lưu.</p>
          <div className="flex gap-6 text-slate-400">
            <a href="/" className="hover:text-white transition-colors">Điều khoản dịch vụ</a>
            <a href="/contact" className="hover:text-white transition-colors">Hỗ trợ đối tác B2B</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

