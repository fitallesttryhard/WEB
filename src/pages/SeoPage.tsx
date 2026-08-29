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
    <div className="tech-bg min-h-screen py-16 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wider inline-flex items-center gap-1.5">
            <Search className="w-4 h-4 text-emerald-600" /> Dịch Vụ SEO Google Tổng Thể
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Đưa Từ Khóa Lên Top 1 Google Bứt Phá Doanh Số
          </h1>
          <p className="text-slate-600 text-base sm:text-lg">
            Chiến lược SEO bền vững, tiếp cận hàng ngàn khách hàng tiềm năng chủ động tìm kiếm dịch vụ của bạn mỗi ngày mà không tốn chi phí quảng cáo duy trì.
          </p>
        </div>

        {/* PRICING PACKAGES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* PACKAGE 1 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-emerald-400 transition-all">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gói SEO Khởi Nghiệp</span>
              <h3 className="text-2xl font-bold text-slate-900 my-2">SEO Local & Bản Đồ</h3>
              <div className="text-2xl font-black text-emerald-600 mb-6">Liên Hệ Báo Giá</div>
              
              <ul className="space-y-3 text-xs text-slate-600 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>SEO Google Maps chuẩn xác địa chỉ</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Cam kết 10 - 20 từ khóa địa phương Top 1 - 5</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Tối ưu Google Business Profile đầy đủ</span>
                </li>
              </ul>
            </div>

            <button 
              onClick={() => setCurrentTab('quote')}
              className="w-full py-3 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white font-bold text-xs text-slate-800 transition-colors"
            >
              Chọn Gói SEO Local
            </button>
          </div>

          {/* PACKAGE 2 (POPULAR) */}
          <div className="bg-slate-900 rounded-3xl p-8 border-2 border-emerald-500 text-white shadow-2xl flex flex-col justify-between relative transform lg:-translate-y-2">
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
                  <span>Tối ưu kỹ thuật Cấu trúc Onpage & Backlink chất lượng</span>
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
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-emerald-400 transition-all">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gói Doanh Nghiệp</span>
              <h3 className="text-2xl font-bold text-slate-900 my-2">Dominant Industry SEO</h3>
              <div className="text-3xl font-black text-emerald-600 mb-6">Liên Hệ <span className="text-xs text-slate-400 font-normal">tư vấn</span></div>
              
              <ul className="space-y-3 text-xs text-slate-600 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Phủ Top ngành hàng cạnh tranh cao</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Chiến dịch Content Marketing quy mô lớn</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Cam kết KPI lượng truy cập hữu cơ</span>
                </li>
              </ul>
            </div>

            <button 
              onClick={() => setCurrentTab('quote')}
              className="w-full py-3 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white font-bold text-xs text-slate-800 transition-colors"
            >
              Liên Hệ Nhận Tư Vấn
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
