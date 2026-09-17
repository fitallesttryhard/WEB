"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, Layers, ArrowRight, CheckCircle2
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

// Dữ liệu khởi tạo chuẩn xác 100% khớp với Database để HTML sinh ra từ Server/lần đầu không bị giật hay đổi text sau 0.5s
export const INITIAL_MATERIAL_CATEGORIES = [
  {
    id: 'b1111111-0000-0000-0000-000000000003',
    name: 'Nẹp nhựa',
    slug: 'nep-nhua',
    description: 'Nẹp nhựa PVC bo góc gạch men, nẹp chỉ ngắt nước và nẹp trát tường chuyên dụng.',
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop',
    count: 2
  },
  {
    id: 'b1111111-0000-0000-0000-000000000001',
    name: 'Nẹp nhôm',
    slug: 'nep-nhom',
    description: 'Nẹp nhôm chữ T, V, U, L mạ Anode cao cấp chống ăn mòn và tạo đường chỉ sắc nét cho công trình.',
    image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
    count: 3
  },
  {
    id: 'b1111111-0000-0000-0000-000000000002',
    name: 'Nẹp inox',
    slug: 'nep-inox',
    description: 'Nẹp inox 304 mạ PVD vàng gương, vàng xước, đen bóng đạt chuẩn sang trọng và chịu lực va đập tốt.',
    image_url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=800&auto=format&fit=crop',
    count: 2
  },
  {
    id: 'b1111111-0000-0000-0000-000000000004',
    name: 'Dụng cụ',
    slug: 'dung-cu',
    description: 'Dụng cụ thi công ốp lát, bay răng cưa, búa cao su, kìm siết ke cân bằng.',
    image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop',
    count: 2
  },
  {
    id: 'b1111111-0000-0000-0000-000000000005',
    name: 'Phụ kiện',
    slug: 'phu-kien',
    description: 'Ke cân bằng, nêm chêm gạch, nút bịt đầu nẹp, phụ kiện liên kết và đỡ giàn giáo.',
    image_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop',
    count: 7
  },
  {
    id: 'b1111111-0000-0000-0000-000000000006',
    name: 'Hóa chất',
    slug: 'hoa-chat',
    description: 'Keo dán gạch, keo chà ron, keo dán nẹp chuyên dụng và phụ gia chống thấm.',
    image_url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop',
    count: 2
  }
];

// Sub-label hiển thị trên hover
function getCategorySubLabel(name: string, slug?: string, isConstruction = false) {
  const key = (slug || name || '').toLowerCase();

  if (isConstruction) {
    if (key.includes('op-lat') || key.includes('ốp lát')) return 'Gạch men & Đá';
    if (key.includes('trat') || key.includes('trát')) return 'Cạnh vữa & Mốc trát';
    if (key.includes('thach-cao') || key.includes('thạch cao')) return 'Trần & Vách ngăn';
    if (key.includes('noi-that') || key.includes('nội thất')) return 'Sàn gỗ & Nẹp len';
    if (key.includes('ngoai-that') || key.includes('ngoại thất')) return 'Ban công & Cửa sổ';
    if (key.includes('den-led') || key.includes('đèn led')) return 'Nẹp nhôm âm trần';
    return 'Cổ ống & Mạch ngừng';
  }
  if (key.includes('nhua') || key.includes('nhựa')) return 'Nhựa PVC cao cấp';
  if (key.includes('nhom') || key.includes('nhôm')) return 'Hợp kim Anode';
  if (key.includes('inox')) return 'Inox 304 mạ PVD';
  if (key.includes('dung-cu') || key.includes('dụng cụ')) return 'Thi công chuyên nghiệp';
  if (key.includes('phu-kien') || key.includes('phụ kiện')) return 'Ke cân bằng & Cốp pha';
  if (key.includes('hoa-chat') || key.includes('hóa chất')) return 'Keo dán & Chà ron';
  return 'Vật tư đạt chuẩn';
}

// Placeholder images - 100% verified reliable construction & architectural photos
const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop',
];

// ─── Category Card (go.arch style) ──────────────────────────────
function CategoryCard({ 
  name, 
  description, 
  imageUrl, 
  subLabel, 
  href, 
  index 
}: {
  name: string;
  description: string;
  imageUrl?: string;
  subLabel: string;
  href: string;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const defaultBg = PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];
  const [imgSrc, setImgSrc] = useState(imageUrl || defaultBg);

  useEffect(() => {
    setImgSrc(imageUrl || defaultBg);
  }, [imageUrl, defaultBg]);

  return (
    <a
      href={href}
      className="group relative block overflow-hidden rounded-2xl cursor-pointer"
      style={{ 
        aspectRatio: '4/3.35', 
        minHeight: 220,
        transform: 'translateZ(0)',
        willChange: 'transform'
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background Image — ken burns zoom */}
      <img
        src={imgSrc}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: hovered ? 'scale(1.06)' : 'scale(1)',
          willChange: 'transform',
        }}
        loading="eager"
        decoding="async"
        onError={() => {
          if (imgSrc !== defaultBg) {
            setImgSrc(defaultBg);
          }
        }}
      />

      {/* Permanent gradient: dark at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

      {/* Extra darkening on hover */}
      <div
        className="absolute inset-0 bg-black/20"
        style={{
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.35s ease',
        }}
      />

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4 sm:p-5">

        {/* Description — slides up from below on hover */}
        <div style={{ overflow: 'hidden' }}>
          <p
            style={{
              transform: hovered ? 'translateY(0)' : 'translateY(110%)',
              opacity: hovered ? 1 : 0,
              transition: 'transform 0.45s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease',
            }}
            className="text-white/85 text-xs font-medium leading-relaxed mb-2 line-clamp-2"
          >
            {description}
          </p>
        </div>

        {/* Sub label — slides up with delay */}
        <div style={{ overflow: 'hidden' }}>
          <span
            style={{
              display: 'inline-block',
              transform: hovered ? 'translateY(0)' : 'translateY(110%)',
              opacity: hovered ? 1 : 0,
              transition: 'transform 0.45s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease',
              transitionDelay: hovered ? '50ms' : '0ms',
            }}
            className="font-arch text-red-400 text-[10px] font-bold uppercase tracking-[0.18em] mb-1.5 inline-block"
          >
            {subLabel}
          </span>
        </div>

        {/* Category name — always visible */}
        <div className="flex items-end justify-between gap-2.5">
          <h3
            style={{
              transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
              transition: 'transform 0.3s ease',
            }}
            className="font-arch font-bold text-white text-lg sm:text-xl uppercase tracking-[0.05em] leading-tight"
          >
            {name}
          </h3>
          <div
            style={{
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'translateX(0)' : 'translateX(8px)',
              transition: 'opacity 0.3s ease, transform 0.3s ease',
              transitionDelay: hovered ? '70ms' : '0ms',
            }}
            className="w-7 h-7 rounded-full bg-white/15 border border-white/25 backdrop-blur-sm flex items-center justify-center shrink-0"
          >
            <ArrowRight size={13} className="text-white" />
          </div>
        </div>
      </div>
    </a>
  );
}

// ─── Dynamic Column Span Calculation for Gap-filling Banner ─────────
function getFillBannerColSpan(count: number) {
  const rem2 = count % 2;
  const rem3 = count % 3;
  const rem4 = count % 4;

  const baseSpan = rem2 === 1 ? 'col-span-1' : 'col-span-2';

  let mdSpan = 'md:col-span-3';
  if (rem3 === 1) mdSpan = 'md:col-span-2';
  else if (rem3 === 2) mdSpan = 'md:col-span-1';

  let lgSpan = 'lg:col-span-4';
  if (rem4 === 1) lgSpan = 'lg:col-span-3';
  else if (rem4 === 2) lgSpan = 'lg:col-span-2';
  else if (rem4 === 3) lgSpan = 'lg:col-span-1';

  return `${baseSpan} ${mdSpan} ${lgSpan}`;
}

// ─── Gap-filling CTA Banner Card ────────────────────────────────────
function CategoryCtaCard({ 
  isSingleColOnLg = false 
}: { 
  isSingleColOnLg?: boolean; 
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative overflow-hidden rounded-2xl border border-slate-800 shadow-xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:border-red-500/50 hover:shadow-red-950/40 h-full w-full"
      style={{
        backgroundColor: '#090d16',
        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, #090d16 1px)',
        backgroundSize: '20px 20px',
        minHeight: 220,
      }}
    >
      {/* Ambient Red Glow on hover / dynamic lighting */}
      <div
        className="pointer-events-none absolute -top-12 -right-12 w-44 h-44 rounded-full blur-2xl transition-opacity duration-700"
        style={{
          background: 'radial-gradient(circle, rgba(220, 38, 38, 0.35) 0%, transparent 70%)',
          opacity: hovered ? 1 : 0.65,
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-12 -left-12 w-44 h-44 rounded-full blur-2xl transition-opacity duration-700"
        style={{
          background: 'radial-gradient(circle, rgba(239, 68, 68, 0.2) 0%, transparent 70%)',
          opacity: hovered ? 0.9 : 0.4,
        }}
      />

      {/* Top Header info */}
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-5 h-5 rounded-md bg-red-600/25 border border-red-500/40 text-red-500 flex items-center justify-center shrink-0 shadow-sm">
              <CheckCircle2 size={12} className="transition-transform duration-300 group-hover:scale-110" />
            </div>
            <span className="font-arch text-red-400 font-bold text-[10px] uppercase tracking-[0.14em] truncate">
              DỰ ÁN & VẬT TƯ ĐẶC THÙ
            </span>
          </div>

          <a
            href="tel:0901234567"
            className="text-[10px] font-bold text-slate-400 hover:text-red-400 transition-colors shrink-0 whitespace-nowrap"
          >
            Hotline: <span className="text-red-400 font-black">0901 234 567</span>
          </a>
        </div>

        <h4 className={`font-arch font-bold text-white uppercase tracking-wide leading-snug line-clamp-2 ${
          isSingleColOnLg ? 'text-sm' : 'text-sm sm:text-base lg:text-lg'
        }`}>
          Cần tìm giải pháp vật tư tùy chỉnh theo bản vẽ kỹ thuật?
        </h4>

        <p className="text-slate-300 text-[11px] font-medium mt-1 leading-relaxed line-clamp-2">
          Sbuild cung cấp đầy đủ chứng chỉ CO/CQ, bảng quy cách chi tiết & gửi mẫu công trình.
        </p>

        {/* Feature badges */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 border border-white/15 text-[10px] font-bold text-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> CO/CQ
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 border border-white/15 text-[10px] font-bold text-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span> Gửi mẫu
          </span>
          {!isSingleColOnLg && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 border border-white/15 text-[10px] font-bold text-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> Giá sỉ công trình
            </span>
          )}
        </div>
      </div>

      {/* Bottom Action — Prominent button with zero cutoff & ample bottom breathing room */}
      <div className="relative z-10 pt-2.5 mt-2.5 border-t border-slate-800/80">
        <a
          href="/products"
          className="font-arch inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-lg shadow-red-600/30 hover:shadow-red-600/50 hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
        >
          <span>Mở kho sản phẩm</span>
          <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────
export default function Categories() {
  const [activeTab, setActiveTab] = useState<'material' | 'construction'>('material');
  
  const [dbCategories, setDbCategories] = useState<any[]>(INITIAL_MATERIAL_CATEGORIES);
  const [constructionCategories, setConstructionCategories] = useState<ConstructionCategory[]>(DEFAULT_CONSTRUCTION_CATEGORIES);
  const [productCounts, setProductCounts] = useState<{ [key: string]: number }>({
    'b1111111-0000-0000-0000-000000000003': 2,
    'b1111111-0000-0000-0000-000000000001': 3,
    'b1111111-0000-0000-0000-000000000002': 2,
    'b1111111-0000-0000-0000-000000000004': 2,
    'b1111111-0000-0000-0000-000000000005': 7,
    'b1111111-0000-0000-0000-000000000006': 2,
  });
  const [constructionCounts, setConstructionCounts] = useState<{ [key: string]: number }>({
    'Ốp lát gạch': 8,
    'Trát tường': 2,
    'Thạch cao': 1,
    'Hoàn thiện nội thất': 9,
    'Hoàn thiện ngoại thất': 3,
    'Thi công đèn LED': 0,
    'Chống thấm': 2,
  });

  useEffect(() => {
    async function loadDynamicTaxonomy() {
      try {
        const catQuery = supabase
          .from('categories')
          .select('id, name, slug, description, image_url')
          .eq('tenant_id', SBUILD_TENANT_ID);

        const ccQuery = getConstructionCategories();

        const prodQuery = supabase
          .from('products')
          .select('id, category_id, tags')
          .eq('tenant_id', SBUILD_TENANT_ID)
          .eq('status', 'published');

        const [catRes, ccList, prodRes] = await Promise.all([catQuery, ccQuery, prodQuery]);

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

        if (prodRes.data && prodRes.data.length > 0) {
          const pMap: { [key: string]: number } = {};
          const ccMap: { [key: string]: number } = {};

          prodRes.data.forEach((p: any) => {
            if (p.category_id) {
              pMap[p.category_id] = (pMap[p.category_id] || 0) + 1;
            }
            const ccs = extractConstructionCategories(p.tags, ccList || DEFAULT_CONSTRUCTION_CATEGORIES);
            ccs.forEach((ccName) => {
              ccMap[ccName] = (ccMap[ccName] || 0) + 1;
            });
          });

          setProductCounts(pMap);
          setConstructionCounts(ccMap);
        }
      } catch (err) {
        console.warn('Lỗi khi nạp dữ liệu danh mục từ Supabase:', err);
      }
    }

    // Preload all category images into browser cache so tab switching is instantaneous
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
      // Ignore preloader errors
    }

    loadDynamicTaxonomy();
  }, []);

  // Unified grid class — same for both tabs
  const gridClass = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5";

  return (
    <section className="bg-white py-10 sm:py-12 lg:py-14 shrink-0 relative z-10 overflow-hidden border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-4 sm:mb-5">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-7 h-0.5 rounded-full bg-gradient-to-r from-red-600 to-rose-600"></span>
            <span className="font-arch text-red-600 font-bold text-[11px] uppercase tracking-[0.22em]">
              DANH MỤC
            </span>
            <span className="w-7 h-0.5 rounded-full bg-gradient-to-r from-rose-600 to-red-600"></span>
          </div>
          <h2 className="font-arch text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-wider uppercase">
            Giải Pháp Vật Tư & Thi Công
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1 max-w-xl mx-auto">
            Tra cứu linh hoạt theo chủng loại vật tư hoặc tìm giải pháp theo từng hạng mục thi công.
          </p>
        </div>

        {/* Tab Toggle Buttons - Centered and Compact with Smooth Animated Pill */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="inline-flex items-center bg-slate-100/90 backdrop-blur-sm p-1 sm:p-1.5 rounded-2xl border border-slate-200/90 shadow-inner relative">
            <button
              onClick={() => setActiveTab('material')}
              className={`relative font-arch flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer z-10 active:scale-95 ${
                activeTab === 'material' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {activeTab === 'material' && (
                <motion.div
                  layoutId="categoryActivePill"
                  className="absolute inset-0 bg-white rounded-xl shadow-md shadow-slate-900/10 -z-10"
                  transition={{ type: "spring", stiffness: 500, damping: 34 }}
                />
              )}
              <Package size={16} className={`transition-all duration-300 ${activeTab === 'material' ? 'text-red-600 scale-110' : 'text-slate-400'}`} />
              <span>Sản phẩm</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-black transition-colors ${
                activeTab === 'material' ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-500'
              }`}>
                {dbCategories.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('construction')}
              className={`relative font-arch flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer z-10 active:scale-95 ${
                activeTab === 'construction' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {activeTab === 'construction' && (
                <motion.div
                  layoutId="categoryActivePill"
                  className="absolute inset-0 bg-white rounded-xl shadow-md shadow-slate-900/10 -z-10"
                  transition={{ type: "spring", stiffness: 500, damping: 34 }}
                />
              )}
              <Layers size={16} className={`transition-all duration-300 ${activeTab === 'construction' ? 'text-red-600 scale-110' : 'text-slate-400'}`} />
              <span>Hạng mục thi công</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-black transition-colors ${
                activeTab === 'construction' ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-500'
              }`}>
                {constructionCategories.length}
              </span>
            </button>
          </div>
        </div>

        {/* 60FPS High Performance Grid — native CSS grid with zero layout thrashing */}
        <div className={gridClass}>
          {(activeTab === 'material' ? dbCategories : constructionCategories).map((item, index) => {
            const isConstruction = activeTab === 'construction';
            const subLabel = getCategorySubLabel(item.name, item.slug, isConstruction);
            const itemKey = `${activeTab}-${item.id || item.slug || item.name || index}`;
            return (
              <motion.div
                key={itemKey}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.18,
                  ease: [0.16, 1, 0.3, 1],
                  delay: Math.min(index * 0.015, 0.08)
                }}
                style={{ willChange: 'transform, opacity' }}
              >
                <CategoryCard
                  name={item.name}
                  description={
                    item.description ||
                    (isConstruction
                      ? 'Ứng dụng nẹp và phụ kiện chuyên biệt cho công đoạn thi công.'
                      : 'Giải pháp vật tư xây dựng chuyên dụng chất lượng chuẩn kiểm định.')
                  }
                  imageUrl={item.image_url}
                  subLabel={subLabel}
                  href={
                    isConstruction
                      ? `/products?construction=${encodeURIComponent(item.name)}`
                      : `/products?cat=${encodeURIComponent(item.name)}`
                  }
                  index={index}
                />
              </motion.div>
            );
          })}

          {/* Morphing CTA Banner Card: spring-morphs between 2 cols and 1 col with high performance */}
          <motion.div
            layout
            key="categoryCtaBannerMorph"
            className={getFillBannerColSpan(
              activeTab === 'material' ? dbCategories.length : constructionCategories.length
            )}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 32,
              mass: 0.7
            }}
            style={{ willChange: 'transform' }}
          >
            <CategoryCtaCard
              isSingleColOnLg={getFillBannerColSpan(
                activeTab === 'material' ? dbCategories.length : constructionCategories.length
              ).includes('lg:col-span-1')}
            />
          </motion.div>
        </div>

      </div>
    </section>
  );
}
