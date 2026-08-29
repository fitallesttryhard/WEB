import React from 'react';
import { 
  Code, 
  Smartphone, 
  Layout, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';

interface ServicesPageProps {
  setCurrentTab: (tab: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ setCurrentTab }) => {
  return (
    <div className="tech-bg min-h-screen py-16 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 uppercase tracking-wider inline-flex items-center gap-1.5">
            <Code className="w-4 h-4 text-indigo-600" /> Dịch Vụ Thiết Kế Web & App
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Giải Pháp Lập Trình & Thiết Kế Đa Nền Tảng
          </h1>
          <p className="text-slate-600 text-base sm:text-lg">
            Fi.tallest xây dựng các hệ thống số đột phá mang tính cá nhân hóa cao, giúp nâng tầm hình ảnh thương hiệu và tăng trưởng doanh số bền vững.
          </p>
        </div>

        {/* SECTION 1: WEB DESIGN */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              <Code className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
              Thiết Kế Website Độc Bản theo Yêu Cầu
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Mỗi website được nghiên cứu theo đúng ngành nghề kinh doanh, văn hóa thương hiệu và tập khách hàng mục tiêu của bạn. 100% mã nguồn sạch, tối ưu hóa tốc độ tải trang dưới 1.5 giây.
            </p>

            <div className="space-y-3 text-xs sm:text-sm font-semibold text-slate-700">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                <span>Giao diện Glassmorphic & 3D hiện đại chuẩn xu hướng quốc tế</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                <span>Tối ưu chuẩn SEO Onpage, thân thiện 100% thiết bị di động</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                <span>Trang quản trị CMS dễ dùng, tự tùy chỉnh thông tin dễ dàng</span>
              </div>
            </div>

            <button 
              onClick={() => setCurrentTab('quote')}
              className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-2"
            >
              <span>Nhận Dự Toán Thiết Kế Web</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 text-slate-300 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
              <Zap className="w-4 h-4" /> Tốc độ & Chuẩn SEO:
            </div>
            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 text-xs font-mono space-y-2">
              <div className="text-emerald-400">✓ PageSpeed Score: 98/100</div>
              <div className="text-blue-400">✓ First Contentful Paint: 0.6s</div>
              <div className="text-purple-400">✓ Interactive Time: 1.1s</div>
              <div className="text-pink-400">✓ SSL 256-bit Security Enabled</div>
            </div>
          </div>
        </div>

        {/* SECTION 2: MOBILE APP */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="order-2 lg:order-1 bg-gradient-to-tr from-purple-900 to-indigo-950 rounded-3xl p-8 text-white space-y-4">
            <div className="text-xs font-bold text-purple-300 uppercase tracking-widest">
              Đa Nền Tảng iOS & Android
            </div>
            <div className="text-2xl font-black">Ứng Dụng Di Động Mượt Mà</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Xây dựng trải nghiệm ứng dụng bản địa (Native Feel) với tính năng đẩy thông báo (Push Notification), quét mã QR, tích hợp bản đồ và hệ thống ví thanh toán trực tuyến.
            </p>
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
              <Smartphone className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
              Lập Trình Ứng Dụng Mobile Doanh Nghiệp
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Giúp doanh nghiệp giữ chân khách hàng trung thành, quản lý lịch hẹn, đặt hàng và chăm sóc tự động ngay trên điện thoại thông minh.
            </p>

            <button 
              onClick={() => setCurrentTab('quote')}
              className="px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/25 transition-all flex items-center gap-2"
            >
              <span>Nhận Dự Toán App Mobile</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
