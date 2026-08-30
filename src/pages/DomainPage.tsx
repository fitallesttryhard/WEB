import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface DomainPageProps {
  setCurrentTab: (tab: string) => void;
}

export const DomainPage: React.FC<DomainPageProps> = ({ setCurrentTab }) => {
  const [domainSearch, setDomainSearch] = useState('');
  const [searchResult, setSearchResult] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainSearch) return;
    setSearchResult(domainSearch);
  };

  const domainPricing = [
    { tld: '.com', price: 'Liên hệ', renew: 'Báo giá tốt', highlight: true },
    { tld: '.vn', price: 'Liên hệ', renew: 'Báo giá tốt', highlight: true },
    { tld: '.com.vn', price: 'Liên hệ', renew: 'Báo giá tốt', highlight: false },
    { tld: '.net', price: 'Liên hệ', renew: 'Báo giá tốt', highlight: false },
    { tld: '.org', price: 'Liên hệ', renew: 'Báo giá tốt', highlight: false },
    { tld: '.info', price: 'Liên hệ', renew: 'Báo giá tốt', highlight: false },
  ];

  return (
    <div className="min-h-screen py-16 text-slate-100 relative overflow-x-clip">
      
      {/* Glow elements specific to domain page */}
      <div className="absolute top-1/4 left-1/10 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none filter blur-[120px]"
        style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider inline-flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-amber-400" /> Tra Cứu & Đăng Ký Tên Miền
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Khởi Đầu Thương Hiệu Số Với Tên Miền Đẹp
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Sở hữu tên miền chính chủ với thủ tục đăng ký tự động nhanh chóng trong 3 phút, miễn phí quản trị DNS và bảo mật Whois.
          </p>
        </div>

        {/* DOMAIN SEARCH BOX */}
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-[1.5px] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
          <div className="bg-[#0B1224] rounded-[22px] p-3">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full flex-1">
                <Globe className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Nhập tên miền bạn muốn mua (ví dụ: fitallest.com)..." 
                  value={domainSearch}
                  onChange={(e) => setDomainSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-sm bg-transparent text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
              <button 
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors whitespace-nowrap shadow-md shadow-amber-500/10 cursor-pointer"
              >
                Kiểm Tra Tên Miền
              </button>
            </form>

            {searchResult && (
              <div className="mt-3 p-4 bg-slate-950/80 border border-white/5 text-white rounded-xl text-xs flex items-center justify-between">
                <div>
                  Tên miền <span className="font-bold text-amber-400">{searchResult}</span> đang có sẵn để đăng ký ngay!
                </div>
                <button 
                  onClick={() => setCurrentTab('quote')}
                  className="px-4 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors"
                >
                  Mua Ngay
                </button>
              </div>
            )}
          </div>
        </div>

        {/* DOMAIN PRICING TABLE */}
        <div className="bg-[#0A1020]/45 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] max-w-4xl mx-auto space-y-6">
          <h2 className="text-xl font-bold text-white text-center">Bảng Giá Tên Miền Phổ Biến</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {domainPricing.map((item) => (
              <div 
                key={item.tld}
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all duration-300 ${
                  item.highlight ? 'bg-amber-500/10 border-amber-400/40' : 'bg-white/5 border-white/[0.08]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-black text-white">{item.tld}</span>
                  {item.highlight && <span className="px-2 py-0.5 rounded bg-amber-400 text-[10px] font-bold text-slate-900">HOT</span>}
                </div>
                <div className="text-lg font-bold text-amber-400">{item.price} <span className="text-xs text-slate-400 font-normal">/ năm</span></div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
