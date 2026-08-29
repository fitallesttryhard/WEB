import React from 'react';
import { 
  Server, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Cpu, 
  HardDrive, 
  RefreshCw,
  ArrowRight
} from 'lucide-react';

interface HostingPageProps {
  setCurrentTab: (tab: string) => void;
}

export const HostingPage: React.FC<HostingPageProps> = ({ setCurrentTab }) => {
  return (
    <div className="tech-bg min-h-screen py-16 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 uppercase tracking-wider inline-flex items-center gap-1.5">
            <Server className="w-4 h-4 text-blue-600" /> Cloud Hosting NVMe Tốc Độ Cao
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Máy Chủ Đám Mây Tối Ưu Tốc Độ Cho Website
          </h1>
          <p className="text-slate-600 text-base sm:text-lg">
            Hạ tầng ổ cứng Enterprise NVMe SSD cho tốc độ đọc ghi nhanh gấp 10 lần SSD thông thường. Uptime 99.9% đảm bảo website luôn hoạt động mượt mà.
          </p>
        </div>

        {/* HOSTING PACKAGES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* PACKAGE 1 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-blue-400 transition-all">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cơ Bản</span>
              <h3 className="text-2xl font-bold text-slate-900 my-2">Host NVMe Personal</h3>
              <div className="text-2xl font-black text-blue-600 mb-6">Liên Hệ Báo Giá</div>
              
              <ul className="space-y-3 text-xs text-slate-600 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  <span>Dung lượng NVMe: 3 GB</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  <span>Băng thông: Không giới hạn</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  <span>RAM: 1.5 GB | CPU: 1 Core</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  <span>SSL Chứng chỉ bảo mật miễn phí</span>
                </li>
              </ul>
            </div>

            <button 
              onClick={() => setCurrentTab('quote')}
              className="w-full py-3 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white font-bold text-xs text-slate-800 transition-colors"
            >
              Đăng Ký Host Personal
            </button>
          </div>

          {/* PACKAGE 2 (POPULAR) */}
          <div className="bg-slate-900 rounded-3xl p-8 border-2 border-blue-500 text-white shadow-2xl flex flex-col justify-between relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider">
              Khuyên Dùng
            </div>

            <div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Doanh Nghiệp</span>
              <h3 className="text-2xl font-bold text-white my-2">Host NVMe Business</h3>
              <div className="text-2xl font-black text-blue-400 mb-6">Liên Hệ Báo Giá</div>
              
              <ul className="space-y-3 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>Dung lượng NVMe: 10 GB</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>Băng thông: Không giới hạn</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>RAM: 3 GB | CPU: 2 Cores</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>Tự động Backup dữ liệu hàng ngày</span>
                </li>
              </ul>
            </div>

            <button 
              onClick={() => setCurrentTab('quote')}
              className="w-full py-3.5 rounded-xl bg-blue-500 hover:bg-blue-400 font-bold text-xs text-slate-950 transition-colors shadow-lg shadow-blue-500/25"
            >
              Đăng Ký Host Business
            </button>
          </div>

          {/* PACKAGE 3 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-blue-400 transition-all">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cao Cấp</span>
              <h3 className="text-2xl font-bold text-slate-900 my-2">Host NVMe Ultra PRO</h3>
              <div className="text-2xl font-black text-blue-600 mb-6">Liên Hệ Báo Giá</div>
              
              <ul className="space-y-3 text-xs text-slate-600 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  <span>Dung lượng NVMe: 25 GB</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  <span>RAM: 6 GB | CPU: 4 Cores</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  <span>Tự động tối ưu Cache Litespeed</span>
                </li>
              </ul>
            </div>

            <button 
              onClick={() => setCurrentTab('quote')}
              className="w-full py-3 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white font-bold text-xs text-slate-800 transition-colors"
            >
              Đăng Ký Host Ultra PRO
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
