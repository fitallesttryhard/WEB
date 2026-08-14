import React from 'react';
import { MapPin, Phone, Mail, Facebook, Youtube, Instagram, Twitter, Video, MessageCircle, Globe } from 'lucide-react';
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

  const socialLinks = settings.socialLinks && settings.socialLinks.length > 0
    ? settings.socialLinks
    : [
        { platform: 'facebook', url: '#' },
        { platform: 'youtube', url: '#' }
      ];

  const footerBlocks = settings.footerBlocks || [];

  return (
    <footer className="bg-red-700 text-white pt-16 pb-12 shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          
          {/* Col 1: About / Company Name */}
          <div className="lg:col-span-4">
            <div className="flex flex-col gap-2 mb-6">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt={settings.companyName} className="h-10 w-auto object-contain self-start bg-white/10 p-1 rounded" />
              ) : null}
              <span className="text-sm font-black uppercase tracking-widest text-white">
                {settings.companyName || 'Công ty TNHH Đầu tư Xây dựng Sbuild'}
              </span>
            </div>
            <p className="text-[12px] opacity-80 leading-relaxed mb-6 font-medium">
              Nhà cung cấp chuyên nghiệp các giải pháp vật tư, phụ kiện và dụng cụ thi công xây dựng với chất lượng hàng đầu tại Việt Nam.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 flex-wrap">
              {socialLinks.map((link: any, index: number) => (
                <a 
                  key={index} 
                  href={link.url || '#'} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-red-700 transition-colors uppercase"
                  title={link.platform}
                >
                  {getSocialIcon(link.platform)}
                </a>
              ))}
            </div>
          </div>

          {/* Dynamic Blocks or Default Links */}
          {footerBlocks.length > 0 ? (
            footerBlocks.map((block: any, index: number) => (
              <div key={block.id || index} className="lg:col-span-3">
                <h3 className="text-[11px] font-bold uppercase opacity-60 tracking-widest mb-6">
                  {block.title || 'Liên kết'}
                </h3>
                {block.type === 'links' && block.items && (
                  <ul className="flex flex-col gap-3 font-medium text-[12px]">
                    {block.items.map((item: any, i: number) => (
                      <li key={i}>
                        <a href={item.url || '#'} className="hover:underline opacity-90 transition-all">
                          {item.label || item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
                {block.type === 'text' && (
                  <p className="text-[12px] opacity-80 leading-relaxed font-medium">
                    {block.content}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="lg:col-span-3">
              <h3 className="text-[11px] font-bold uppercase opacity-60 tracking-widest mb-6">Liên kết nhanh</h3>
              <ul className="flex flex-col gap-3 font-medium text-[12px]">
                <li><a href="#" className="hover:underline opacity-90 transition-all">Trang chủ</a></li>
                <li><a href="#" className="hover:underline opacity-90 transition-all">Giới thiệu công ty</a></li>
                <li><a href="#products" className="hover:underline opacity-90 transition-all">Danh mục sản phẩm</a></li>
                <li><a href="#blog" className="hover:underline opacity-90 transition-all">Tin tức & Sự kiện</a></li>
                <li><a href="#contact" className="hover:underline opacity-90 transition-all">Liên hệ</a></li>
              </ul>
            </div>
          )}

          {/* Col Contact */}
          <div className="lg:col-span-5">
            <h3 className="text-[11px] font-bold uppercase opacity-60 tracking-widest mb-6">Thông tin liên hệ</h3>
            <ul className="flex flex-col gap-4 text-[12px] font-medium opacity-90">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>{settings.address || 'Tầng 5, Tòa nhà Sbuild, Quận 1, TP. Hồ Chí Minh'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="flex-shrink-0" />
                <a href={`tel:${(settings.hotline || '').replace(/\s+/g, '')}`} className="hover:underline">
                  {settings.hotline || '0901 234 567'}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="flex-shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:underline">
                  {settings.email || 'contact@sbuild.vn'}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-red-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] font-medium opacity-70">
          <p>&copy; {new Date().getFullYear()} {settings.companyName || 'Xây Dựng Sbuild'}. Tất cả quyền được bảo lưu.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:underline transition-all">Điều khoản dịch vụ</a>
            <a href="#contact" className="hover:underline transition-all">Hỗ trợ khách hàng</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
