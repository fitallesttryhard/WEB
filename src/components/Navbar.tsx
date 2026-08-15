import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, ChevronDown, HardHat, ShoppingBag, ArrowRight } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../supabaseClient';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

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
    async function fetchCategories() {
      try {
        const { data } = await supabase.from('categories').select('*').limit(8);
        if (data) setCategories(data);
      } catch (err) {
        console.warn('Lỗi nạp categories cho Navbar:', err);
      }
    }
    fetchCategories();
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 shrink-0 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border-b border-slate-200/80 h-16' 
          : 'bg-white/95 backdrop-blur-md border-b border-slate-100 h-20'
      }`}
    >
      <div className="max-w-7xl h-full mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.location.hash = ''}>
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
          <a href="#" className="hover:text-red-600 transition-colors py-2 relative group">
            Trang chủ
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
          </a>
          
          <a href="#" className="hover:text-red-600 transition-colors py-2 relative group">
            Giới thiệu
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
          </a>
          
          {/* Dropdown Menu */}
          <div className="relative group">
            <button 
              onClick={() => window.location.hash = '#products'}
              className="flex items-center gap-1.5 hover:text-red-600 transition-colors py-2"
            >
              Sản phẩm 
              <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300 text-slate-400 group-hover:text-red-600" />
            </button>

            {/* Dropdown Card panel */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white/95 backdrop-blur-2xl border border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.12)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top rounded-2xl overflow-hidden p-2 z-50">
              <a 
                href="#products" 
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-900 hover:text-red-600 transition-colors group/item mb-1 font-bold text-xs"
              >
                <span>Tất cả sản phẩm</span>
                <ArrowRight size={14} className="group-hover/item:translate-x-1 transition-transform" />
              </a>

              <div className="h-[1px] bg-slate-100 my-1"></div>

              <div className="flex flex-col gap-0.5">
                {categories.map((cat) => (
                  <a 
                    key={cat.id}
                    href={`#products?cat=${cat.id}`} 
                    className="flex items-center justify-between px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors text-xs font-semibold"
                  >
                    <span>{cat.name}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500/40"></span>
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          <a href="#projects" className="hover:text-red-600 transition-colors py-2 relative group">
            Dự án
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
          </a>

          <a href="#blog" className="hover:text-red-600 transition-colors py-2 relative group">
            Tin tức
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
          </a>

          <a href="#contact" className="hover:text-red-600 transition-colors py-2 relative group">
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
              className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-red-600 hover:to-rose-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-sm active:scale-95 overflow-hidden"
            >
              <Phone size={15} className="text-red-400 group-hover:text-white transition-colors" />
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
          <a href="#" className="font-bold text-slate-900 py-2 border-b border-slate-100" onClick={() => setIsMobileMenuOpen(false)}>Trang chủ</a>
          <a href="#" className="font-bold text-slate-900 py-2 border-b border-slate-100" onClick={() => setIsMobileMenuOpen(false)}>Giới thiệu</a>
          
          <div className="flex flex-col py-1">
            <a href="#products" className="font-bold text-red-600 py-1 text-sm uppercase tracking-wider" onClick={() => setIsMobileMenuOpen(false)}>Sản phẩm</a>
            {categories.length > 0 && (
              <div className="pl-4 flex flex-col gap-2 border-l-2 border-red-500/20 ml-1 mt-2">
                {categories.map((cat) => (
                  <a 
                    key={cat.id} 
                    href={`#products?cat=${cat.id}`} 
                    className="text-slate-600 py-1.5 text-xs font-semibold hover:text-red-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {cat.name}
                  </a>
                ))}
              </div>
            )}
          </div>

          <a href="#blog" className="font-bold text-slate-900 py-2 border-b border-slate-100" onClick={() => setIsMobileMenuOpen(false)}>Tin tức</a>
          <a href="#contact" className="font-bold text-slate-900 py-2 border-b border-slate-100" onClick={() => setIsMobileMenuOpen(false)}>Liên hệ</a>
          
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
  );
}
