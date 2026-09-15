"use client";
import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, ChevronDown, HardHat, ShoppingBag, ArrowRight, Layers, Filter, Package } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../supabaseClient';
import { getConstructionCategories, ConstructionCategory, DEFAULT_CONSTRUCTION_CATEGORIES } from '../constructionServices';

// Danh sách chủng loại vật tư mặc định cho S-BUILD để đảm bảo menu không bao giờ bị trắng trơn
export const DEFAULT_MATERIAL_CATEGORIES = [
  { id: 'b1111111-0000-0000-0000-000000000003', name: 'Nẹp nhựa', slug: 'nep-nhua' },
  { id: 'b1111111-0000-0000-0000-000000000001', name: 'Nẹp nhôm', slug: 'nep-nhom' },
  { id: 'b1111111-0000-0000-0000-000000000002', name: 'Nẹp inox', slug: 'nep-inox' },
  { id: 'b1111111-0000-0000-0000-000000000004', name: 'Dụng cụ', slug: 'dung-cu' },
  { id: 'b1111111-0000-0000-0000-000000000005', name: 'Phụ kiện', slug: 'phu-kien' },
  { id: 'b1111111-0000-0000-0000-000000000006', name: 'Hóa chất', slug: 'hoa-chat' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>(DEFAULT_MATERIAL_CATEGORIES);
  const [constructionCategories, setConstructionCategories] = useState<ConstructionCategory[]>(DEFAULT_CONSTRUCTION_CATEGORIES);

  const { settings } = useSettings();
  const { cartCount, openDrawer } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function fetchTaxonomies() {
      // 1. Tải chủng loại vật tư độc lập
      try {
        const { data: catData } = await supabase
          .from('categories')
          .select('*')
          .limit(20);
        if (catData && catData.length > 0) {
          const tenantCats = catData.filter((c: any) => 
            c.tenant_id === '00000000-0000-0000-0000-000000000002' || !c.tenant_id
          );
          const pool = tenantCats.length > 0 ? tenantCats : catData;
          const filtered = pool.filter((c: any) => 
            c.name && 
            c.name.trim().toLowerCase() !== 'vật tư xây dựng' &&
            !c.name.toLowerCase().includes('website') &&
            !c.name.toLowerCase().includes('hosting') &&
            !c.name.toLowerCase().includes('marketing') &&
            !c.name.toLowerCase().includes('saas')
          );
          if (filtered.length > 0) {
            // Hợp nhất với danh mục chuẩn để luôn đầy đủ và đa dạng
            const existing = new Set(filtered.map((c: any) => c.name.toLowerCase()));
            const merged = [...filtered];
            DEFAULT_MATERIAL_CATEGORIES.forEach((def) => {
              if (!existing.has(def.name.toLowerCase()) && merged.length < 6) {
                merged.push(def);
              }
            });
            const STANDARD_ORDER = ['Nẹp nhựa', 'Nẹp nhôm', 'Nẹp inox', 'Dụng cụ', 'Phụ kiện', 'Hóa chất'];
            merged.sort((a, b) => {
              const idxA = STANDARD_ORDER.indexOf(a.name);
              const idxB = STANDARD_ORDER.indexOf(b.name);
              if (idxA !== -1 && idxB !== -1) return idxA - idxB;
              if (idxA !== -1) return -1;
              if (idxB !== -1) return 1;
              return (a.name || '').localeCompare(b.name || '');
            });
            setCategories(merged);
          }
        }

      } catch (err) {
        console.warn('Lỗi nạp danh mục vật tư cho Navbar:', err);
      }

      // 2. Tải hạng mục thi công độc lập
      try {
        const ccList = await getConstructionCategories();
        if (ccList && ccList.length > 0) {
          setConstructionCategories(ccList);
        }
      } catch (err) {
        console.warn('Lỗi nạp hạng mục thi công cho Navbar:', err);
      }
    }
    fetchTaxonomies();
  }, []);

  return (
    <>
      {settings.status === 'locked' && (
        <div className="bg-rose-950 text-white text-xs px-4 py-2.5 text-center font-bold flex flex-wrap items-center justify-center gap-2 border-b border-rose-800 relative z-50 animate-in fade-in duration-200">
          <span>🔒 Tài khoản Cửa hàng ({settings.companyName || 'SBUILD'}) đang tạm ngưng dịch vụ do bị khóa bởi Super Admin.</span>
          <a href="/super-admin" className="underline text-amber-300 hover:text-amber-200 font-extrabold ml-2">
            Vào Super Admin để mở khóa ↗
          </a>
        </div>
      )}
      <header 
        className={`fixed left-0 right-0 z-50 transition-all duration-300 shrink-0 ${
          settings.status === 'locked' ? 'top-9' : 'top-0'
        } ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border-b border-slate-200/80 h-16' 
            : 'bg-white/95 backdrop-blur-md border-b border-slate-100 h-20'
        }`}
      >
      <div className="max-w-7xl h-full mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.location.href = '/'}>
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt={settings.companyName} className="h-10 w-auto object-contain transition-transform group-hover:scale-105" />
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center rounded-xl shadow-md shadow-red-500/20 transition-transform group-hover:rotate-3">
                <HardHat size={22} className="stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase leading-none">
                  SBUILD<span className="text-red-600">.</span>
                </span>
                <span className="text-[9px] font-bold tracking-[0.25em] text-slate-400 uppercase mt-0.5">Vật Tư Xây Dựng</span>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 font-bold text-xs uppercase tracking-[0.12em] text-slate-700">
          <a href="/" className="hover:text-red-600 transition-colors py-2 relative group">
            Trang chủ
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
          </a>
          
          <a href="/about" className="hover:text-red-600 transition-colors py-2 relative group">
            Giới thiệu
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
          </a>
          
          {/* Dropdown Menu */}
          <div className="relative group">
            <button 
              onClick={() => window.location.href = '/products'}
              className="flex items-center gap-1.5 uppercase hover:text-red-600 transition-colors py-2"
            >
              Sản phẩm 
              <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300 text-slate-400 group-hover:text-red-600" />
            </button>

            {/* Dropdown Card panel - Dual-Taxonomy Mega Menu */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[600px] max-w-[90vw] bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-[0_25px_60px_rgba(0,0,0,0.15)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top rounded-2xl overflow-hidden p-4 z-50">
              
              {/* Header: Tất cả sản phẩm */}
              <a 
                href="/products" 
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white hover:from-red-600 hover:to-rose-600 transition-all group/item font-bold text-xs shadow-sm mb-3.5"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                    <Package size={14} className="text-white" />
                  </div>
                  <div>
                    <div className="font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
                      Tất cả sản phẩm & vật tư
                      <span className="text-[9px] bg-white/20 text-white px-2 py-0.5 rounded-full font-semibold normal-case">Toàn bộ kho</span>
                    </div>
                    <div className="text-[10px] text-white/75 font-medium normal-case mt-0.5">
                      Xem danh mục đầy đủ các giải pháp nẹp và phụ kiện công trình
                    </div>
                  </div>
                </div>
                <ArrowRight size={15} className="group-hover/item:translate-x-1.5 transition-transform shrink-0" />
              </a>

              {/* 2 Khối Dual-Taxonomy */}
              <div className="grid grid-cols-2 gap-3.5 pb-2">
                {/* Khối 1: Chủng loại vật tư */}
                <div className="flex flex-col bg-slate-50/70 rounded-xl p-3 border border-slate-100">
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200/80">
                    <div className="w-5 h-5 rounded-md bg-red-100 text-red-600 flex items-center justify-center">
                      <Filter size={11} />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                      Chủng loại vật tư
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {(categories.length > 0 ? categories : DEFAULT_MATERIAL_CATEGORIES).map((cat) => (
                      <a 
                        key={cat.id || cat.slug || cat.name}
                        href={`/products?cat=${encodeURIComponent(cat.name)}`} 
                        className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-white transition-colors text-xs font-semibold group/link"
                      >
                        <span className="group-hover/link:translate-x-0.5 transition-transform">{cat.name}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 group-hover/link:bg-red-600 transition-colors"></span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Khối 2: Hạng mục thi công */}
                <div className="flex flex-col bg-slate-50/70 rounded-xl p-3 border border-slate-100">
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200/80">
                    <div className="w-5 h-5 rounded-md bg-slate-900 text-white flex items-center justify-center">
                      <Layers size={11} />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                      Hạng mục thi công
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {(constructionCategories.length > 0 ? constructionCategories : DEFAULT_CONSTRUCTION_CATEGORIES).map((cc) => (
                      <a 
                        key={cc.id || cc.slug || cc.name}
                        href={`/products?construction=${encodeURIComponent(cc.name)}`} 
                        className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-white transition-colors text-xs font-semibold group/link"
                      >
                        <span className="group-hover/link:translate-x-0.5 transition-transform">{cc.name}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover/link:bg-red-600 transition-colors"></span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 px-1">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Phân loại kép: Vật tư & Hạng mục thi công
                </span>
                <a href="/products" className="font-bold text-red-600 hover:underline">
                  Mở bộ lọc nâng cao &rarr;
                </a>
              </div>
            </div>
          </div>
          
          <a href="/projects" className="hover:text-red-600 transition-colors py-2 relative group">
            Dự án
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
          </a>

          <a href="/blog" className="hover:text-red-600 transition-colors py-2 relative group">
            Tin tức
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
          </a>

          <a href="/contact" className="hover:text-red-600 transition-colors py-2 relative group">
            Liên hệ
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Cart Icon */}
          <button 
            onClick={openDrawer}
            className="relative p-2.5 text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
            title="Danh sách nhận báo giá"
          >
            <ShoppingBag size={22} className="stroke-[2]" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-black flex items-center justify-center rounded-full shadow-sm animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Hotline CTA Button */}
          <div className="hidden md:flex">
            <a 
              href={`tel:${(settings.hotline || '').replace(/\s+/g, '')}`} 
              className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-700 hover:to-rose-800 text-white px-5 py-2.5 rounded-xl font-extrabold text-xs tracking-wider uppercase transition-all duration-300 shadow-md shadow-red-500/20 active:scale-95 overflow-hidden"
            >
              <Phone size={15} className="text-white group-hover:scale-110 transition-transform" />
              <span>{settings.hotline || '0901 234 567'}</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-slate-800 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-2xl border-b border-slate-200 shadow-2xl p-6 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-300">
          <a href="/" className="font-bold text-xs uppercase tracking-wider text-slate-900 py-2 border-b border-slate-100" onClick={() => setIsMobileMenuOpen(false)}>Trang chủ</a>
          <a href="/about" className="font-bold text-xs uppercase tracking-wider text-slate-900 py-2 border-b border-slate-100" onClick={() => setIsMobileMenuOpen(false)}>Giới thiệu</a>
          
          <div className="flex flex-col py-1">
            <a href="/products" className="font-bold text-xs uppercase tracking-wider text-red-600 py-1" onClick={() => setIsMobileMenuOpen(false)}>Sản phẩm</a>
            
            {/* Chủng loại vật tư */}
            <div className="pl-3 flex flex-col gap-1.5 border-l-2 border-red-500/20 ml-1 mt-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1 mb-0.5">
                Chủng loại vật tư
              </span>
              {(categories.length > 0 ? categories : DEFAULT_MATERIAL_CATEGORIES).map((cat) => (
                <a 
                  key={cat.id || cat.slug || cat.name} 
                  href={`/products?cat=${encodeURIComponent(cat.name)}`} 
                  className="text-slate-600 py-1 text-xs font-semibold hover:text-red-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {cat.name}
                </a>
              ))}
            </div>

            {/* Hạng mục thi công */}
            <div className="pl-3 flex flex-col gap-1.5 border-l-2 border-slate-200 ml-1 mt-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1 mb-0.5 flex items-center gap-1">
                <Layers size={11} /> Hạng mục thi công
              </span>
              {(constructionCategories.length > 0 ? constructionCategories : DEFAULT_CONSTRUCTION_CATEGORIES).map((cc) => (
                <a 
                  key={cc.id || cc.slug || cc.name} 
                  href={`/products?construction=${encodeURIComponent(cc.name)}`} 
                  className="text-slate-600 py-1 text-xs font-semibold hover:text-red-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {cc.name}
                </a>
              ))}
            </div>
          </div>

          <a href="/projects" className="font-bold text-xs uppercase tracking-wider text-slate-900 py-2 border-b border-slate-100" onClick={() => setIsMobileMenuOpen(false)}>Dự án</a>
          <a href="/blog" className="font-bold text-xs uppercase tracking-wider text-slate-900 py-2 border-b border-slate-100" onClick={() => setIsMobileMenuOpen(false)}>Tin tức</a>
          <a href="/contact" className="font-bold text-xs uppercase tracking-wider text-slate-900 py-2 border-b border-slate-100" onClick={() => setIsMobileMenuOpen(false)}>Liên hệ</a>
          
          <a 
            href={`tel:${(settings.hotline || '').replace(/\s+/g, '')}`} 
            className="bg-red-600 text-white px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2.5 mt-2 uppercase tracking-wider text-xs shadow-lg shadow-red-600/20"
          >
            <Phone size={16} />
            Hotline: {settings.hotline}
          </a>
        </div>
      )}
    </header>
  </>
  );
}
