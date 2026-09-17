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
          opacity: hovered ? 0.95 : 1,
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
      <div className="relative z-10 h-full w-full p-6 sm:p-7 lg:p-8 flex flex-col justify-between">
        
        {/* Top Section: Index, Category Title & Sub-label */}
        <div className="max-w-[90%]">
          {/* Tag & Index */}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-red-500 text-xs font-bold tracking-widest">
              {formattedIndex}
            </span>
            <span className="w-4 h-px bg-white/20"></span>
            <span className="font-arch text-white/50 text-[10px] font-bold uppercase tracking-[0.2em]">
              {subLabel}
            </span>
          </div>

          {/* Main Title — Big architectural font */}
          <h3 className="font-arch font-bold text-white text-xl sm:text-2xl lg:text-3xl uppercase tracking-wider leading-snug">
            {name}
          </h3>

          {/* Short Description */}
          <p 
            style={{
              transition: 'all 0.4s ease',
              opacity: hovered ? 1 : 0.82,
              transform: hovered ? 'translateY(0)' : 'translateY(2px)',
            }}
            className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed mt-2.5 line-clamp-2 max-w-sm"
          >
            {description}
          </p>
        </div>

        {/* 
          CRITICAL ARCHITECTURAL TOUCH (from reference photo):
          Vertical 90-degree rotated label on bottom-left 
        */}
        <div 
          className="absolute bottom-7 left-7 pointer-events-none origin-bottom-left"
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
          }}
        >
          <span className="font-arch text-[10px] font-bold text-white/30 group-hover:text-red-400/80 transition-colors uppercase tracking-[0.38em] whitespace-nowrap">
            S - B U I L D  •  A R C H I T E C T U R E
          </span>
        </div>

        {/* Bottom-Right Action CTA */}
        <div className="flex items-end justify-end mt-auto pt-6">
          <div 
            style={{
              transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: hovered ? 'translateX(0)' : 'translateX(6px)',
            }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/15 text-white group-hover:bg-red-600 group-hover:border-red-500 shadow-sm"
          >
            <span className="font-arch text-[11px] font-bold uppercase tracking-wider">
              Khám phá
            </span>
            <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>

      </div>
    </a>
  );
}

// ─── Main Categories Component (Edge-to-Edge Architectural Slider) ───
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
    <section className="bg-neutral-950 py-8 sm:py-10 shrink-0 relative z-10 overflow-hidden border-b border-neutral-900 w-full">
      
      {/* ─── Top Header & Tab Controls (Contained for crisp readability) ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          
          {/* Section Heading */}
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-6 h-0.5 rounded-full bg-red-600"></span>
              <span className="font-arch text-red-500 font-bold text-[11px] uppercase tracking-[0.24em]">
                HỆ THỐNG DANH MỤC KIẾN TRÚC
              </span>
            </div>
            <h2 className="font-arch text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-wider uppercase">
              Giải Pháp Vật Tư & Thi Công
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm font-medium mt-1">
              Khám phá giải pháp nẹp và phụ kiện chuyên dụng được phân chia trực quan theo từng hạng mục.
            </p>
          </div>

          {/* Tab Switcher & Navigation Controls */}
          <div className="flex flex-wrap items-center gap-3 self-start md:self-end">
            
            {/* Tab Pill Buttons */}
            <div className="inline-flex items-center bg-white/5 backdrop-blur-md p-1 rounded-xl border border-white/10 relative">
              <button
                onClick={() => setActiveTab('material')}
                className={`relative font-arch flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer z-10 active:scale-95 ${
                  activeTab === 'material' ? 'text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {activeTab === 'material' && (
                  <motion.div
                    layoutId="categoryActivePill"
                    className="absolute inset-0 bg-red-600 rounded-lg shadow-md shadow-red-950/40 -z-10"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <Package size={14} />
                <span>Sản phẩm</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  activeTab === 'material' ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-400'
                }`}>
                  {dbCategories.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('construction')}
                className={`relative font-arch flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer z-10 active:scale-95 ${
                  activeTab === 'construction' ? 'text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {activeTab === 'construction' && (
                  <motion.div
                    layoutId="categoryActivePill"
                    className="absolute inset-0 bg-red-600 rounded-lg shadow-md shadow-red-950/40 -z-10"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <Layers size={14} />
                <span>Hạng mục thi công</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  activeTab === 'construction' ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-400'
                }`}>
                  {constructionCategories.length}
                </span>
              </button>
            </div>

            {/* Top Carousel Navigation Buttons (if > 4 cards) */}
            {currentItems.length > visibleCards && (
              <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-md p-1 rounded-xl border border-white/10">
                <button
                  onClick={handlePrev}
                  aria-label="Previous"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="text-[11px] font-mono text-slate-400 px-1 font-bold">
                  <span>{String(currentIndex + 1).padStart(2, '0')}</span>
                  <span className="text-slate-600 mx-1">/</span>
                  <span>{String(maxIndex + 1).padStart(2, '0')}</span>
                </div>
                <button
                  onClick={handleNext}
                  aria-label="Next"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* 
        ─── FULL-WIDTH EDGE-TO-EDGE 4-COLUMN ARCHITECTURAL SLIDER ─── 
        CRITICAL: Touches screen edges on both left and right (w-full, px-0)!
      */}
      <div 
        className="w-full relative overflow-hidden select-none border-y border-white/10"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        
        {/* Slider Track */}
        <div
          className="flex h-[520px] sm:h-[580px] lg:h-[620px] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
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
              className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 group/btn flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/20 text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
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
              className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 group/btn flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/20 text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
            >
              <span className="font-arch text-[11px] sm:text-xs font-bold uppercase tracking-widest hidden sm:inline-block">
                NEXT
              </span>
              <ChevronRight size={16} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
            </button>
          </>
        )}

      </div>

      {/* ─── Bottom Status Indicator Bar ─── */}
      <div className="w-full mt-4 px-4 sm:px-6 flex items-center justify-between text-xs text-slate-500 font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
          <span className="font-arch text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {activeTab === 'material' ? 'VẬT TƯ CHUYÊN DỤNG' : 'CÔNG ĐOẠN THI CÔNG'}
          </span>
        </div>

        {/* Progress ticks */}
        {currentItems.length > visibleCards && (
          <div className="flex items-center gap-1.5">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1 transition-all duration-300 rounded-full cursor-pointer ${
                  currentIndex === idx ? 'w-8 bg-red-600' : 'w-2.5 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

    </section>
  );
}
