import React, { useState, useEffect } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { 
  Globe, 
  Code, 
  Sparkles, 
  Server, 
  Phone, 
  Calculator, 
  Menu, 
  X, 
  ChevronDown,
  ArrowRight,
  Search,
  Bot,
  Zap,
  Layers,
  Flame,
  ShieldCheck
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const FitallestNavbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { settings } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  const hotline = settings.hotline || '0356 105 315';
  const companyName = settings.companyName || 'Fi.tallest';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigate = (tab: string) => {
    setCurrentTab(tab);
    if (tab === 'home') {
      window.history.pushState("", document.title, window.location.pathname + window.location.search);
    } else {
      window.location.hash = tab;
    }
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isServiceActive = ['services', 'seo', 'hosting', 'domain', 'ai-design'].includes(currentTab);

  const servicesList = [
    {
      id: 'services',
      title: 'Thiết Kế Website & Apps',
      desc: 'Độc bản, chuẩn UX/UI, tốc độ tải siêu tốc',
      icon: <Code className="w-4 h-4" />,
      color: '#06b6d4',
      badge: 'POPULAR'
    },
    {
      id: 'seo',
      title: 'Dịch Vụ SEO Google Top 1',
      desc: 'Tăng trưởng traffic thực và doanh thu bền vững',
      icon: <Search className="w-4 h-4" />,
      color: '#34d399',
      badge: 'TOP 1'
    },
    {
      id: 'ai-design',
      title: 'Thiết Kế AI Sáng Tạo',
      desc: 'Tự động hóa giao diện & cá nhân hóa UX',
      icon: <Bot className="w-4 h-4" />,
      color: '#f472b6',
      badge: 'AI 2026'
    },
    {
      id: 'hosting',
      title: 'Cloud Hosting NVMe',
      desc: 'Hạ tầng máy chủ đám mây cực nhanh, SSL miễn phí',
      icon: <Server className="w-4 h-4" />,
      color: '#60a5fa'
    },
    {
      id: 'domain',
      title: 'Tên Miền Thương Hiệu',
      desc: 'Đăng ký & bảo vệ tên miền .VN, .COM',
      icon: <Globe className="w-4 h-4" />,
      color: '#fbbf24'
    }
  ];

  return (
    <header className="sticky top-0 z-50 transition-all duration-300 py-3 px-3 sm:px-6 bg-transparent pointer-events-none">
      <div className={`max-w-7xl mx-auto rounded-2xl sm:rounded-full transition-all duration-300 border pointer-events-auto ${
        scrolled 
          ? 'bg-[#050A14]/95 backdrop-blur-2xl border-cyan-500/30 shadow-[0_10px_35px_rgba(0,0,0,0.8)]' 
          : 'bg-[#070D1D]/60 hover:bg-[#070D1D]/80 backdrop-blur-xl border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.4)]'
      }`}>
        <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between">
          
          {/* ─── BRAND LOGO ─── */}
          <div 
            onClick={() => navigate('home')} 
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            {!logoFailed ? (
              <div className="logo-border-beam-box group/logo cursor-pointer transition-transform duration-300 hover:scale-[1.03]">
                <div className="logo-border-beam-inner">
                  <img 
                    src={settings.logoUrl || '/assets/images/logo.png'} 
                    alt={companyName} 
                    className="h-9 max-w-[200px] object-contain relative z-10"
                    onError={() => setLogoFailed(true)}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 p-[1.5px] shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
                    <div className="w-full h-full bg-[#050A14] rounded-[10px] flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
                    </div>
                  </div>
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl font-black tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                      Fi<span className="text-cyan-400">.</span>tallest
                    </span>
                    <span className="hidden sm:inline-block px-1.5 py-0.2 text-[9px] font-extrabold uppercase tracking-wider rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      Tech
                    </span>
                  </div>
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest -mt-0.5">
                    Digital Agency
                  </span>
                </div>
              </>
            )}
          </div>

          {/* ─── DESKTOP NAVIGATION ─── */}
          <nav className="hidden lg:flex items-center gap-1 font-medium text-xs text-slate-300">
            <button 
              onClick={() => navigate('home')}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                currentTab === 'home' 
                  ? 'text-white bg-cyan-500/20 border border-cyan-500/40 font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                  : 'hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              Trang Chủ
            </button>

            {/* SERVICES DROPDOWN */}
            <div 
              className="relative group py-1"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button 
                onClick={() => {
                  setDropdownOpen(!dropdownOpen);
                  navigate('services');
                }}
                className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                  isServiceActive
                    ? 'text-white bg-cyan-500/20 border border-cyan-500/40 font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <span>Dịch Vụ</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 ${dropdownOpen ? 'rotate-180 text-cyan-400' : 'group-hover:rotate-180'}`} />
              </button>

              {/* DROPDOWN MENU */}
              <div className={`absolute top-full left-0 pt-2 w-80 transition-all duration-300 z-50 ${
                dropdownOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto'
              }`}>
                {/* Invisible Hover Buffer Bridge */}
                <div className="absolute -top-3 left-0 right-0 h-4 bg-transparent" />

                <div className="bg-[#0A1020]/95 backdrop-blur-2xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/10 p-2 space-y-1">
                  {servicesList.map((svc) => (
                    <button
                      key={svc.id}
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate(svc.id);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-start gap-3 group/item cursor-pointer ${
                        currentTab === svc.id 
                          ? 'bg-cyan-500/15 border border-cyan-500/30' 
                          : 'hover:bg-white/[0.06]'
                      }`}
                    >
                      <div 
                        className="p-2 rounded-lg transition-transform group-hover/item:scale-110 shrink-0 mt-0.5"
                        style={{ background: `${svc.color}20`, color: svc.color }}
                      >
                        {svc.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="font-bold text-white text-xs group-hover/item:text-cyan-300 transition-colors truncate">
                            {svc.title}
                          </span>
                          {svc.badge && (
                            <span 
                              className="text-[9px] font-black px-1.5 py-0.2 rounded uppercase shrink-0"
                              style={{ background: `${svc.color}25`, color: svc.color, border: `1px solid ${svc.color}40` }}
                            >
                              {svc.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 leading-tight truncate">
                          {svc.desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => navigate('projects')}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                currentTab === 'projects' 
                  ? 'text-white bg-cyan-500/20 border border-cyan-500/40 font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                  : 'hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              Dự Án Mẫu
            </button>

            <button 
              onClick={() => navigate('blog')}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                currentTab === 'blog' 
                  ? 'text-white bg-cyan-500/20 border border-cyan-500/40 font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                  : 'hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              Tin Tức
            </button>

            <button 
              onClick={() => navigate('quote')}
              className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-1.5 ${
                currentTab === 'quote' 
                  ? 'text-white bg-cyan-500/20 border border-cyan-500/40 font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                  : 'hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-cyan-400" />
              <span>Báo Giá Tự Động</span>
            </button>
          </nav>

          {/* ─── RIGHT ACTIONS ─── */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Live Availability Status */}
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Nhận Dự Án</span>
            </div>

            {/* Hotline button */}
            <a 
              href={`tel:${hotline.replace(/\s+/g, '')}`} 
              className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-cyan-300 px-3 py-2 rounded-full hover:bg-white/[0.06] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              <span>{hotline}</span>
            </a>

            {/* CTA Button */}
            <button 
              onClick={() => navigate('quote')}
              className="group relative px-5 py-2.5 rounded-full font-bold text-xs text-white overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]"
              style={{ background: 'linear-gradient(135deg,#0891b2,#06b6d4,#38bdf8)' }}
            >
              <span className="relative z-10 flex items-center gap-1.5">
                Báo Giá Ngay
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
            </button>
          </div>

          {/* ─── MOBILE MENU TOGGLE ─── */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* ─── MOBILE MENU MODAL ─── */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-3 top-20 z-50 pointer-events-auto bg-[#050A14]/95 backdrop-blur-2xl rounded-2xl border border-cyan-500/30 p-5 space-y-4 shadow-[0_20px_60px_rgba(0,0,0,0.9)] animate-in slide-in-from-top-4 duration-300 max-h-[85vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigate('home')}
              className={`px-4 py-3 rounded-xl font-bold text-xs text-center transition-colors ${
                currentTab === 'home' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-white/[0.03] text-slate-300'
              }`}
            >
              Trang Chủ
            </button>
            <button
              onClick={() => navigate('projects')}
              className={`px-4 py-3 rounded-xl font-bold text-xs text-center transition-colors ${
                currentTab === 'projects' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-white/[0.03] text-slate-300'
              }`}
            >
              Kho Dự Án
            </button>
          </div>

          {/* Services list in mobile */}
          <div className="space-y-1.5 pt-2 border-t border-white/10">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 mb-2">
              Dịch vụ cốt lõi
            </div>
            {servicesList.map((svc) => (
              <button
                key={svc.id}
                onClick={() => navigate(svc.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                  currentTab === svc.id ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span style={{ color: svc.color }}>{svc.icon}</span>
                  <span>{svc.title}</span>
                </div>
                {svc.badge && (
                  <span 
                    className="text-[8px] font-black px-1.5 py-0.2 rounded"
                    style={{ background: `${svc.color}20`, color: svc.color }}
                  >
                    {svc.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
            <button
              onClick={() => navigate('blog')}
              className={`px-4 py-3 rounded-xl font-bold text-xs text-center transition-colors ${
                currentTab === 'blog' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-white/[0.03] text-slate-300'
              }`}
            >
              Tin Tức
            </button>
            <button
              onClick={() => navigate('quote')}
              className={`px-4 py-3 rounded-xl font-bold text-xs text-center transition-colors ${
                currentTab === 'quote' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-white/[0.03] text-slate-300'
              }`}
            >
              Báo Giá Tự Động
            </button>
          </div>

          {/* Quick actions mobile */}
          <div className="pt-2 space-y-2">
            <a
              href={`tel:${hotline.replace(/\s+/g, '')}`}
              className="w-full py-3 rounded-xl bg-white/[0.05] border border-white/10 text-center font-bold text-slate-200 text-xs flex items-center justify-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              Hotline: {hotline}
            </a>

            <button
              onClick={() => navigate('quote')}
              className="w-full py-3.5 rounded-xl font-bold text-white text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg,#0891b2,#06b6d4,#38bdf8)' }}
            >
              <Calculator className="w-4 h-4" />
              <span>Nhận Tư Vấn & Báo Giá Nhanh</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
