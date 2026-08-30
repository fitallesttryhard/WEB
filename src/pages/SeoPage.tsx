import React from 'react';
import { 
  Globe, 
  TrendingUp, 
  Search, 
  CheckCircle2, 
  ArrowRight,
  Target,
  BarChart3,
  Award
} from 'lucide-react';

interface SeoPageProps {
  setCurrentTab: (tab: string) => void;
}

export const SeoPage: React.FC<SeoPageProps> = ({ setCurrentTab }) => {
  return (
    <div className="min-h-screen py-16 text-slate-100 relative overflow-x-clip">
      
      {/* Glow elements specific to SEO page */}
      <div className="absolute top-1/4 left-1/10 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none filter blur-[120px]"
        style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider inline-flex items-center gap-1.5">
            <Search className="w-4 h-4 text-emerald-400" /> Dịch Vụ SEO Google Tổng Thể
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Đưa Từ Khóa Lên Top 1 Google Bứt Phá Doanh Số
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Chiến lược SEO bền vững, tiếp cận hàng ngàn khách hàng tiềm năng chủ động tìm kiếm dịch vụ của bạn mỗi ngày mà không tốn chi phí quảng cáo duy trì.
          </p>
        </div>

        {/* PRICING PACKAGES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* PACKAGE 1 */}
          <div className="bg-[#0A1020]/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:border-emerald-400/30 transition-all flex flex-col justify-between hover:-translate-y-1 duration-300">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gói SEO Khởi Nghiệp</span>
              <h3 className="text-2xl font-bold text-white my-2">SEO Local & Bản Đồ</h3>
              <div className="text-2xl font-black text-emerald-400 mb-6">Liên Hệ Báo Giá</div>
              
              <ul className="space-y-3 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>SEO Google Maps chuẩn xác địa chỉ</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Cam kết 10 - 20 từ khóa địa phương Top 1 - 5</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Tối ưu Google Business Profile đầy đủ</span>
                </li>
              </ul>
            </div>

            <button 
              onClick={() => setCurrentTab('quote')}
              className="w-full py-3 rounded-xl bg-white/5 hover:bg-emerald-600 hover:text-white border border-white/10 font-bold text-xs text-slate-200 transition-colors"
            >
              Chọn Gói SEO Local
            </button>
          </div>

          {/* PACKAGE 2 (POPULAR) */}
          <div className="bg-[#0A1020]/60 backdrop-blur-xl rounded-3xl p-8 border-2 border-emerald-500 text-white shadow-2xl flex flex-col justify-between relative transform lg:-translate-y-2 hover:border-emerald-400 transition-all duration-300">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider">
              Khuyên Dùng Nhiều Nhất
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Gói SEO Tổng Thể</span>
              <h3 className="text-2xl font-bold text-white my-2">Bứt Phá Top Google</h3>
              <div className="text-2xl font-black text-emerald-400 mb-6">Liên Hệ Báo Giá</div>
              
              <ul className="space-y-3 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>50 - 100 từ khóa ngành phủ rộng</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Sáng tạo bài viết chuẩn SEO hàng tuần</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Tối ưu kỹ thuật Onpage & Backlink</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Báo cáo thứ hạng từ khóa hàng tuần</span>
                </li>
              </ul>
            </div>

            <button 
              onClick={() => setCurrentTab('quote')}
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-bold text-xs text-slate-950 transition-colors shadow-lg shadow-emerald-500/25"
            >
              Đăng Ký Gói SEO Tổng Thể
            </button>
          </div>

          {/* PACKAGE 3 */}
          <div className="bg-[#0A1020]/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:border-emerald-400/30 transition-all flex flex-col justify-between hover:-translate-y-1 duration-300">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gói Doanh Nghiệp</span>
              <h3 className="text-2xl font-bold text-white my-2">Dominant Industry SEO</h3>
              <div className="text-2xl font-black text-emerald-400 mb-6">Liên Hệ Tư Vấn</div>
              
              <ul className="space-y-3 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Phủ Top ngành hàng cạnh tranh cao</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Chiến dịch Content Marketing quy mô lớn</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Cam kết KPI lượng truy cập hữu cơ</span>
                </li>
              </ul>
            </div>

            <button 
              onClick={() => setCurrentTab('quote')}
              className="w-full py-3 rounded-xl bg-white/5 hover:bg-emerald-600 hover:text-white border border-white/10 font-bold text-xs text-slate-200 transition-colors"
            >
              Liên Hệ Ngay
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
