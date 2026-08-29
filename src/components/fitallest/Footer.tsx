import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  ArrowUpRight, 
  CheckCircle2, 
  Send,
  ShieldCheck,
  Heart
} from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export const FitallestFooter: React.FC<FooterProps> = ({ setCurrentTab }) => {
  const { settings } = useSettings();
  const hotline = settings.hotline || '0356 105 315';
  const email = settings.email || 'contact@fitallest.com';
  const address = settings.address || 'TP. Hồ Chí Minh & Toàn Quốc';
  const companyName = settings.companyName || 'Fi.tallest';

  const navigate = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 relative overflow-hidden border-t border-slate-800">
      
      {/* GLOW DECORATIONS */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* TOP CALL TO ACTION BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 border-b border-slate-800/80">
        <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 rounded-3xl p-8 sm:p-12 border border-indigo-500/30 backdrop-blur-xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-4 max-w-2xl text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5" /> Khởi Tạo Dự Án Ngay
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
              Sẵn sàng tạo bứt phá <span className="whitespace-nowrap">doanh số</span> với{' '}
              <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                Website đẳng cấp?
              </span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Liên hệ với chuyên gia Fi.tallest để nhận bản tư vấn miễn phí & giải pháp phù hợp nhất cho doanh nghiệp của bạn.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button 
              onClick={() => navigate('quote')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>Nhận Dự Toán Tự Động</span>
              <ArrowUpRight className="w-5 h-5" />
            </button>
            <a 
              href={`tel:${hotline.replace(/\s+/g, '')}`}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold text-center transition-all"
            >
              Hotline: {hotline}
            </a>
          </div>
        </div>
      </div>

      {/* MAIN FOOTER CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
        
        {/* BRAND COLUMN */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 p-0.5 shadow-lg">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                {settings.logoUrl ? (
                  <img src={settings.logoUrl} alt={companyName} className="w-6 h-6 object-contain" />
                ) : (
                  <img src="/assets/images/logo.png" alt={companyName} className="w-6 h-6 object-contain" />
                )}
              </div>
            </div>
            <span className="text-2xl font-black text-white tracking-tight">{companyName}</span>
          </div>

          <p className="text-slate-400 text-sm leading-relaxed max-w-md">
            {settings.companyDescription || `${companyName} là đơn vị chuyên nghiệp trong lĩnh vực Thiết kế Website, Ứng dụng di động, UI/UX Design, Dịch vụ SEO Google và Hạ tầng Cloud Hosting. Cam kết mang đến giải pháp công nghệ hiệu quả và thẩm mỹ hàng đầu.`}
          </p>

          <div className="space-y-3 text-sm text-slate-400">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <span>{address}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-indigo-400 shrink-0" />
              <a href={`tel:${hotline.replace(/\s+/g, '')}`} className="hover:text-white transition-colors">{hotline}</a>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-indigo-400 shrink-0" />
              <a href={`mailto:${email}`} className="hover:text-white transition-colors">{email}</a>
            </div>
          </div>
        </div>

        {/* SERVICES COLUMN */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-white font-bold tracking-wide uppercase text-xs text-indigo-400">Dịch Vụ Nổi Bật</h3>
          <ul className="space-y-2.5 text-sm font-medium text-slate-400">
            <li>
              <button onClick={() => navigate('services')} className="text-left w-full hover:text-indigo-300 transition-colors leading-normal cursor-pointer">Thiết Kế Website Theo&nbsp;Yêu&nbsp;Cầu</button>
            </li>
            <li>
              <button onClick={() => navigate('services')} className="text-left w-full hover:text-indigo-300 transition-colors leading-normal cursor-pointer">Phát Triển Ứng Dụng&nbsp;Mobile</button>
            </li>
            <li>
              <button onClick={() => navigate('seo')} className="text-left w-full hover:text-indigo-300 transition-colors leading-normal cursor-pointer">Dịch Vụ SEO Google&nbsp;Đột&nbsp;Phá</button>
            </li>
            <li>
              <button onClick={() => navigate('hosting')} className="text-left w-full hover:text-indigo-300 transition-colors leading-normal cursor-pointer">Cloud Hosting NVMe Tốc&nbsp;Độ&nbsp;Cao</button>
            </li>
            <li>
              <button onClick={() => navigate('domain')} className="text-left w-full hover:text-indigo-300 transition-colors leading-normal cursor-pointer">Đăng Ký Tên Miền Giá&nbsp;Tốt</button>
            </li>
            <li>
              <button onClick={() => navigate('ai-design')} className="text-left w-full hover:text-indigo-300 transition-colors leading-normal cursor-pointer">Thiết Kế Giao Diện&nbsp;AI</button>
            </li>
          </ul>
        </div>

        {/* NAVIGATION COLUMN */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-white font-bold tracking-wide uppercase text-xs text-indigo-400">Liên Kết Nhanh</h3>
          <ul className="space-y-2.5 text-sm font-medium text-slate-400">
            <li>
              <button onClick={() => navigate('home')} className="text-left w-full hover:text-indigo-300 transition-colors cursor-pointer">Trang Chủ</button>
            </li>
            <li>
              <button onClick={() => navigate('projects')} className="text-left w-full hover:text-indigo-300 transition-colors cursor-pointer">Kho Dự Án Thực&nbsp;Hiện</button>
            </li>
            <li>
              <button onClick={() => navigate('quote')} className="text-left w-full hover:text-indigo-300 transition-colors cursor-pointer">Báo Giá Tự Động&nbsp;Nhanh</button>
            </li>
          </ul>
        </div>

        {/* TRUST BADGES & NEWSLETTER */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-white font-bold text-base tracking-wide uppercase text-xs text-indigo-400">Cam Kết Chất Lượng</h3>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Bảo hành mã nguồn trọn đời</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span>Hỗ trợ kỹ thuật 24/7</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-pink-400" />
              <span>Tối ưu PageSpeed 90+</span>
            </li>
          </ul>

          <div className="pt-2">
            <div className="text-xs text-slate-400 mb-2 font-semibold">Đăng ký nhận ưu đãi & tin công nghệ:</div>
            <div className="flex items-center gap-1.5">
              <input 
                type="email" 
                placeholder="Email của bạn..." 
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-colors">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM COPYRIGHT */}
      <div className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} <span className="text-slate-300 font-semibold">Fi.tallest</span>. All Rights Reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Crafted with passion for technology & design</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 inline ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};
