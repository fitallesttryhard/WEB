"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, Layers, ArrowRight, ChevronLeft, ChevronRight
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import { 
  getConstructionCategories, 
  ConstructionCategory, 
  DEFAULT_CONSTRUCTION_CATEGORIES,
  extractConstructionCategories 
} from '../constructionServices';

const SBUILD_TENANT_ID = '00000000-0000-0000-0000-000000000002';
const STANDARD_MATERIAL_ORDER = ['Nẹp nhựa', 'Nẹp nhôm', 'Nẹp inox', 'Dụng cụ', 'Phụ kiện', 'Hóa chất'];

// Dữ liệu khởi tạo chuẩn xác 100% khớp với Database
export const INITIAL_MATERIAL_CATEGORIES = [
  {
    id: 'b1111111-0000-0000-0000-000000000003',
    name: 'Nẹp nhựa',
    slug: 'nep-nhua',
    description: 'Nẹp nhựa PVC bo góc gạch men, nẹp chỉ ngắt nước và nẹp trát tường chuyên dụng.',
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop',
    count: 2
  },
  {
    id: 'b1111111-0000-0000-0000-000000000001',
    name: 'Nẹp nhôm',
    slug: 'nep-nhom',
    description: 'Nẹp nhôm chữ T, V, U, L mạ Anode cao cấp chống ăn mòn và tạo đường chỉ sắc nét cho công trình.',
    image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    count: 3
  },
  {
    id: 'b1111111-0000-0000-0000-000000000002',
    name: 'Nẹp inox',
    slug: 'nep-inox',
    description: 'Nẹp inox 304 mạ PVD vàng gương, vàng xước, đen bóng đạt chuẩn sang trọng và chịu lực va đập tốt.',
    image_url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop',
    count: 2
  },
  {
    id: 'b1111111-0000-0000-0000-000000000004',
    name: 'Dụng cụ',
    slug: 'dung-cu',
    description: 'Dụng cụ thi công ốp lát, bay răng cưa, búa cao su, kìm siết ke cân bằng.',
    image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop',
    count: 2
  },
  {
    id: 'b1111111-0000-0000-0000-000000000005',
    name: 'Phụ kiện',
    slug: 'phu-kien',
    description: 'Ke cân bằng, nêm chêm gạch, nút bịt đầu nẹp, phụ kiện liên kết và đỡ giàn giáo.',
    image_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200&auto=format&fit=crop',
    count: 7
  },
  {
    id: 'b1111111-0000-0000-0000-000000000006',
    name: 'Hóa chất',
    slug: 'hoa-chat',
    description: 'Keo dán gạch, keo chà ron, keo dán nẹp chuyên dụng và phụ gia chống thấm.',
    image_url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200&auto=format&fit=crop',
    count: 2
  }
];

// Sub-label kiến trúc cho từng danh mục
function getCategorySubLabel(name: string, slug?: string, isConstruction = false) {
  const key = (slug || name || '').toLowerCase();

  if (isConstruction) {
    if (key.includes('op-lat') || key.includes('ốp lát')) return 'Gạch men & Đá tự nhiên';
    if (key.includes('trat') || key.includes('trát')) return 'Cạnh vữa & Mốc trát tường';
    if (key.includes('thach-cao') || key.includes('thạch cao')) return 'Trần thạch cao & Vách ngăn';
    if (key.includes('noi-that') || key.includes('nội thất')) return 'Sàn gỗ & Nẹp len chân tường';
    if (key.includes('ngoai-that') || key.includes('ngoại thất')) return 'Ban công & Mặt dựng ngoài trời';
    if (key.includes('den-led') || key.includes('đèn led')) return 'Nẹp nhôm âm trần & Hắt sáng';
    return 'Cổ ống & Mạch ngừng bê tông';
  }
  if (key.includes('nhua') || key.includes('nhựa')) return 'Nhựa PVC nguyên sinh';
  if (key.includes('nhom') || key.includes('nhôm')) return 'Hợp kim Anode 6063-T5';
  if (key.includes('inox')) return 'Inox 304 mạ PVD cao cấp';
  if (key.includes('dung-cu') || key.includes('dụng cụ')) return 'Thi công xây dựng chuyên dụng';
  if (key.includes('phu-kien') || key.includes('phụ kiện')) return 'Ke cân bằng & Phụ kiện ốp lát';
  if (key.includes('hoa-chat') || key.includes('hóa chất')) return 'Keo dán nẹp & Phụ gia chống thấm';
  return 'Vật tư đạt chuẩn kiểm định';
}

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop',
];

// Định dạng xuống dòng thông minh và cân đối kiến trúc, tránh chữ mồ côi (như "THẤT" rớt dòng)
function formatArchitecturalTitle(name: string) {
  const clean = (name || '').trim();
  const lower = clean.toLowerCase();

  if (lower === 'hoàn thiện nội thất') {
    return (
      <>
        <span>HOÀN THIỆN</span>
        <br />
        <span>NỘI THẤT</span>
      </>
    );
  }
  if (lower === 'hoàn thiện ngoại thất') {
    return (
      <>
        <span>HOÀN THIỆN</span>
        <br />
        <span>NGOẠI THẤT</span>
      </>
    );
  }
  if (lower === 'thi công đèn led') {
    return (
      <>
        <span>THI CÔNG</span>
        <br />
        <span>ĐÈN LED</span>
      </>
    );
  }
  return clean;
}

// ─── Single Architectural Full-Bleed Card ──────────────────────────
function FullBleedCategoryCard({
  name,
  description,
  imageUrl,
  subLabel,
  href,
  index,
  total,
}: {
  name: string;
  description: string;
  imageUrl?: string;
  subLabel: string;
  href: string;
  index: number;
  total: number;
}) {
  const [hovered, setHovered] = useState(false);
  const defaultBg = PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];
  const [imgSrc, setImgSrc] = useState(imageUrl || defaultBg);

  useEffect(() => {
    setImgSrc(imageUrl || defaultBg);
  }, [imageUrl, defaultBg]);

  const formattedIndex = String(index + 1).padStart(2, '0');

  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative block h-full w-full overflow-hidden border-r border-white/10 select-none bg-slate-950 cursor-pointer"
      style={{
        transform: 'translateZ(0)',
        willChange: 'transform',
      }}
    >
      {/* Background Image with Slow Architectural Ken Burns Zoom */}
      <img
        src={imgSrc}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: hovered ? 'scale(1.08)' : 'scale(1)',
          willChange: 'transform',
        }}
        loading="eager"
        decoding="async"
        onError={() => {
          if (imgSrc !== defaultBg) setImgSrc(defaultBg);
        }}
      />

      {/* 
        CRITICAL REQUIREMENT: 
        Lớp phủ đen mờ đến trong dần từ cạnh trái đến cạnh phải của mỗi thẻ 
      */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          background: 'linear-gradient(90deg, rgba(0, 0, 0, 0.92) 0%, rgba(0, 0, 0, 0.65) 45%, rgba(0, 0, 0, 0.25) 80%, rgba(0, 0, 0, 0.05) 100%)',
          opacity: hovered ? 0.92 : 1,
        }}
      />

      {/* Subtle bottom shadow gradient to protect text in lower areas */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.1) 40%, transparent 100%)',
        }}
      />

      {/* Card Content Container */}
      <div className="relative z-10 h-full w-full p-5 sm:p-6 flex flex-col justify-between">
        
        {/* Top Section: Index, Category Title & Secondary Hover-only Content */}
        <div className="max-w-[95%]">
          {/* Index & Permanent Tag */}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-red-500 text-xs font-bold tracking-widest">
              {formattedIndex}
            </span>
            <span className="w-4 h-px bg-white/25"></span>
            <span className="font-arch text-white/50 text-[10px] font-bold uppercase tracking-[0.2em]">
              S-BUILD
            </span>
          </div>

          {/* Main Title — Balanced architectural typography, no awkward orphan line-breaks */}
          <h3 
            style={{ textWrap: 'balance' }}
            className="font-arch font-bold text-white text-lg sm:text-xl lg:text-[22px] uppercase tracking-wide leading-tight"
          >
            {formatArchitecturalTitle(name)}
          </h3>

          {/* 
            REQUIREMENT: Phần nội dung phụ chỉ hiện lên khi di chuột vào (Hover-reveal only)
          */}
          <div 
            style={{
              transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
              opacity: hovered ? 1 : 0,
              maxHeight: hovered ? '110px' : '0px',
              transform: hovered ? 'translateY(0)' : 'translateY(6px)',
              overflow: 'hidden',
            }}
            className="mt-2"
          >
            <span className="inline-block font-arch text-red-400 text-[10px] font-bold uppercase tracking-[0.16em] mb-1">
              {subLabel}
            </span>
            <p className="text-slate-300 text-xs font-medium leading-relaxed line-clamp-2 max-w-xs">
              {description}
            </p>
          </div>
        </div>

        {/* 
          REQUIREMENT: Dòng chữ dọc KHÔNG BỊ CHE
          Đặt chữ dọc ở góc dưới bên trái, cách đáy 24px (bottom-6) và xoay đọc từ dưới lên
        */}
        <div className="absolute bottom-6 left-5 z-20 pointer-events-none select-none">
          <span 
            className="block font-arch text-[9px] sm:text-[10px] font-bold text-white/35 group-hover:text-red-400 transition-colors uppercase tracking-[0.28em] whitespace-nowrap"
            style={{
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
            }}
          >
            S-BUILD • ARCHITECTURE
          </span>
        </div>

        {/* Bottom-Right Action CTA: Trồi lên khi di chuột vào */}
        <div className="flex items-end justify-end mt-auto pt-4">
          <div 
            style={{
              transition: 'opacity 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'translateX(0) translateY(0)' : 'translateX(6px) translateY(6px)',
              pointerEvents: hovered ? 'auto' : 'none',
            }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 border border-red-500 text-white shadow-lg shadow-red-950/50"
          >
            <span className="font-arch text-xs font-bold uppercase tracking-wider">
              Khám phá
            </span>
            <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </div>
        </div>

      </div>
    </a>
  );
}

// ─── Main Categories Component ─────────────────────────────────────
export default function Categories() {
  const [activeTab, setActiveTab] = useState<'material' | 'construction'>('material');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const [dbCategories, setDbCategories] = useState<any[]>(INITIAL_MATERIAL_CATEGORIES);
  const [constructionCategories, setConstructionCategories] = useState<ConstructionCategory[]>(DEFAULT_CONSTRUCTION_CATEGORIES);

  // Responsive visible cards count: 4 on desktop, 2 on tablet, 1 on mobile
  const [visibleCards, setVisibleCards] = useState(4);

  useEffect(() => {
    function updateVisibleCards() {
      if (typeof window === 'undefined') return;
      if (window.innerWidth >= 1024) {
        setVisibleCards(4);
      } else if (window.innerWidth >= 640) {
        setVisibleCards(2);
      } else {
        setVisibleCards(1);
      }
    }

    updateVisibleCards();
    window.addEventListener('resize', updateVisibleCards);
    return () => window.removeEventListener('resize', updateVisibleCards);
  }, []);

  // Reset slider index when changing tabs
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeTab]);

  // Load live data from Supabase
  useEffect(() => {
    async function loadDynamicTaxonomy() {
      try {
        const catQuery = supabase
          .from('categories')
          .select('id, name, slug, description, image_url')
          .eq('tenant_id', SBUILD_TENANT_ID);

        const ccQuery = getConstructionCategories();

        const [catRes, ccList] = await Promise.all([catQuery, ccQuery]);

        if (catRes.data && catRes.data.length > 0) {
          const rawCats = catRes.data.filter((c: any) => 
            c.name && c.name.trim().toLowerCase() !== 'vật tư xây dựng'
          );

          const sorted = [...rawCats].sort((a: any, b: any) => {
            const idxA = STANDARD_MATERIAL_ORDER.indexOf(a.name);
            const idxB = STANDARD_MATERIAL_ORDER.indexOf(b.name);
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
            return (a.name || '').localeCompare(b.name || '');
          });

          setDbCategories(sorted);
        }

        if (ccList && ccList.length > 0) {
          setConstructionCategories(ccList);
        }
      } catch (err) {
        console.warn('Lỗi khi nạp dữ liệu danh mục từ Supabase:', err);
      }
    }

    // Preload image cache for 60fps instant transitions
    try {
      const allUrls = [
        ...INITIAL_MATERIAL_CATEGORIES.map(c => c.image_url),
        ...DEFAULT_CONSTRUCTION_CATEGORIES.map(c => c.image_url),
        ...PLACEHOLDER_IMAGES
      ].filter(Boolean) as string[];

      allUrls.forEach(src => {
        if (src && typeof window !== 'undefined') {
          const img = new Image();
          img.src = src;
        }
      });
    } catch {
      // Ignore preloader error
    }

    loadDynamicTaxonomy();
  }, []);

  const currentItems = activeTab === 'material' ? dbCategories : constructionCategories;
  const maxIndex = Math.max(0, currentItems.length - visibleCards);

  // Auto-play: Slide from right to left every 5.2s if items > visibleCards
  useEffect(() => {
    if (isPaused || currentItems.length <= visibleCards) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5200);

    return () => clearInterval(interval);
  }, [isPaused, maxIndex, currentItems.length, visibleCards]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  // Touch / Drag swipe support
  const touchStartX = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  return (
    /* 
      REQUIREMENT: Giảm chiều cao lại 1 chút (trừ khoảng header navbar 4rem ~ 64px để vừa vặn)
      Section pb-0 để mép đáy của thẻ thanh thoát, nằm trọn trong khung nhìn
    */
    <section className="bg-white pt-2.5 sm:pt-3 pb-0 shrink-0 relative z-10 overflow-hidden border-b border-slate-100 w-full flex flex-col justify-between h-[calc(100dvh-4rem)] min-h-[520px]">
      
      {/* 
        REQUIREMENT: Header & Tab nằm ngay giữa màn hình (Centered Layout) 
      */}
      <div className="max-w-4xl mx-auto px-4 text-center mb-2 sm:mb-2.5 shrink-0">
        
        {/* Architectural Section Heading */}
        <div className="inline-flex items-center gap-2 mb-1">
          <span className="w-5 h-0.5 rounded-full bg-red-600"></span>
          <span className="font-arch text-red-600 font-bold text-[10px] sm:text-[11px] uppercase tracking-[0.24em]">
            HỆ THỐNG DANH MỤC KIẾN TRÚC
          </span>
          <span className="w-5 h-0.5 rounded-full bg-red-600"></span>
        </div>

        <h2 className="font-arch text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-wider uppercase">
          Giải Pháp Vật Tư & Thi Công
        </h2>

        {/* Centered Tab Switcher & Navigation Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-2.5">
          
          {/* Tab Pill Buttons — Tailored for White Theme */}
          <div className="inline-flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/90 shadow-inner relative">
            <button
              onClick={() => setActiveTab('material')}
              className={`relative font-arch flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer z-10 active:scale-95 ${
                activeTab === 'material' ? 'text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {activeTab === 'material' && (
                <motion.div
                  layoutId="categoryActivePill"
                  className="absolute inset-0 bg-red-600 rounded-xl shadow-md shadow-red-600/25 -z-10"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <Package size={14} className={activeTab === 'material' ? 'text-white' : 'text-slate-500'} />
              <span>Sản phẩm</span>
              <span className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full font-black transition-colors ${
                activeTab === 'material' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {dbCategories.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('construction')}
              className={`relative font-arch flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer z-10 active:scale-95 ${
                activeTab === 'construction' ? 'text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {activeTab === 'construction' && (
                <motion.div
                  layoutId="categoryActivePill"
                  className="absolute inset-0 bg-red-600 rounded-xl shadow-md shadow-red-600/25 -z-10"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <Layers size={14} className={activeTab === 'construction' ? 'text-white' : 'text-slate-500'} />
              <span>Hạng mục thi công</span>
              <span className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full font-black transition-colors ${
                activeTab === 'construction' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {constructionCategories.length}
              </span>
            </button>
          </div>

          {/* Quick Counter & Nav on Tablet/Desktop */}
          {currentItems.length > visibleCards && (
            <div className="hidden sm:inline-flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                onClick={handlePrev}
                aria-label="Previous"
                className="w-7 h-7 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer"
              >
                <ChevronLeft size={15} />
              </button>
              <div className="text-[11px] font-mono text-slate-500 px-1 font-bold">
                <span className="text-slate-900">{String(currentIndex + 1).padStart(2, '0')}</span>
                <span className="text-slate-300 mx-1">/</span>
                <span>{String(maxIndex + 1).padStart(2, '0')}</span>
              </div>
              <button
                onClick={handleNext}
                aria-label="Next"
                className="w-7 h-7 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          )}

        </div>
      </div>

      {/* 
        ─── FULL-WIDTH EDGE-TO-EDGE 4-COLUMN ARCHITECTURAL SLIDER ─── 
        CRITICAL: Touches screen edges on both left and right (w-full, px-0)!
      */}
      <div 
        className="w-full relative overflow-hidden select-none border-t border-slate-200/80 bg-slate-950 flex-1 flex flex-col min-h-0"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        
        {/* Slider Track — Chiều cao mở rộng chạm mép đáy màn hình hoàn hảo */}
        <div
          className="flex h-full w-full min-h-[440px] sm:min-h-[480px] lg:min-h-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            transform: `translateX(-${(currentIndex * 100) / visibleCards}%)`,
            willChange: 'transform',
          }}
        >
          {currentItems.map((item, index) => {
            const isConstruction = activeTab === 'construction';
            const subLabel = getCategorySubLabel(item.name, item.slug, isConstruction);
            const href = isConstruction
              ? `/products?construction=${encodeURIComponent(item.name)}`
              : `/products?cat=${encodeURIComponent(item.name)}`;

            return (
              <div
                key={item.id || item.slug || item.name || index}
                className="shrink-0 h-full w-full sm:w-1/2 lg:w-1/4"
              >
                <FullBleedCategoryCard
                  name={item.name}
                  description={
                    item.description ||
                    (isConstruction
                      ? 'Ứng dụng nẹp và phụ kiện chuyên biệt cho từng công đoạn thi công.'
                      : 'Giải pháp vật tư xây dựng chuyên dụng chất lượng chuẩn kiểm định.')
                  }
                  imageUrl={item.image_url}
                  subLabel={subLabel}
                  href={href}
                  index={index}
                  total={currentItems.length}
                />
              </div>
            );
          })}
        </div>

        {/* 
          OVERLAY NAVIGATION BUTTONS (Matching Reference Photo):
          ← PREV on the left side, NEXT → on the right side!
        */}
        {currentItems.length > visibleCards && (
          <>
            {/* Left Button (PREV) */}
            <button
              onClick={handlePrev}
              aria-label="Previous Slide"
              className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 group/btn flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/20 text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
            >
              <ChevronLeft size={16} className="transition-transform duration-300 group-hover/btn:-translate-x-1" />
              <span className="font-arch text-[11px] sm:text-xs font-bold uppercase tracking-widest hidden sm:inline-block">
                PREV
              </span>
            </button>

            {/* Right Button (NEXT) */}
            <button
              onClick={handleNext}
              aria-label="Next Slide"
              className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 group/btn flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/20 text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
            >
              <span className="font-arch text-[11px] sm:text-xs font-bold uppercase tracking-widest hidden sm:inline-block">
                NEXT
              </span>
              <ChevronRight size={16} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
            </button>
          </>
        )}

      </div>

    </section>
  );
}
