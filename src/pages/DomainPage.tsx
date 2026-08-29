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
    <div className="tech-bg min-h-screen py-16 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 uppercase tracking-wider inline-flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-amber-600" /> Tra Cứu & Đăng Ký Tên Miền
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Khởi Đầu Thương Hiệu Số Với Tên Miền Đẹp
          </h1>
          <p className="text-slate-600 text-base sm:text-lg">
            Sở hữu tên miền chính chủ với thủ tục đăng ký tự động nhanh chóng trong 3 phút, miễn phí quản trị DNS và bảo mật Whois.
          </p>
        </div>

        {/* DOMAIN SEARCH BOX */}
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-2 rounded-3xl shadow-xl">
          <form onSubmit={handleSearch} className="bg-white rounded-2xl p-3 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full flex-1">
              <Globe className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Nhập tên miền bạn muốn mua (ví dụ: fitallest.com)..." 
                value={domainSearch}
                onChange={(e) => setDomainSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
              />
            </div>
            <button 
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors whitespace-nowrap"
            >
              Kiem Tra Tên Miền
            </button>
          </form>

          {searchResult && (
            <div className="mt-3 p-4 bg-slate-900 text-white rounded-xl text-xs flex items-center justify-between">
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

        {/* DOMAIN PRICING TABLE */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm max-w-4xl mx-auto space-y-6">
          <h2 className="text-xl font-bold text-slate-900 text-center">Bảng Giá Tên Miền Phổ Biến</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {domainPricing.map((item) => (
              <div 
                key={item.tld}
                className={`p-5 rounded-2xl border-2 flex flex-col justify-between ${
                  item.highlight ? 'bg-amber-50/60 border-amber-400' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-black text-slate-900">{item.tld}</span>
                  {item.highlight && <span className="px-2 py-0.5 rounded bg-amber-400 text-[10px] font-bold text-slate-900">HOT</span>}
                </div>
                <div className="text-lg font-bold text-amber-600">{item.price} <span className="text-xs text-slate-400 font-normal">/ năm</span></div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
