"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Ruler, Sparkles, Droplets, Wrench, Package, 
  Layers, LayoutGrid, Paintbrush, Home, Building2, 
  Lightbulb, ShieldCheck, ArrowRight, Loader2,
  CheckCircle2, Hammer, Boxes
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import { 
  getConstructionCategories, 
  ConstructionCategory, 
  DEFAULT_CONSTRUCTION_CATEGORIES,
  extractConstructionCategories 
} from '../constructionServices';
import { DEFAULT_MATERIAL_CATEGORIES } from './Navbar';

const SBUILD_TENANT_ID = '00000000-0000-0000-0000-000000000002';
const STANDARD_MATERIAL_ORDER = ['Nẹp nhựa', 'Nẹp nhôm', 'Nẹp inox', 'Dụng cụ', 'Phụ kiện', 'Hóa chất'];

// Hàm gán icon và màu chủ đạo phù hợp theo tên hoặc slug
function getCategoryVisuals(name: string, slug?: string, isConstruction = false) {
  const key = (slug || name || '').toLowerCase();

  if (isConstruction) {
    if (key.includes('op-lat') || key.includes('ốp lát')) {
      return { 
        icon: LayoutGrid, 
        color: 'from-blue-600 to-indigo-600', 
        bg: 'bg-blue-50', 
        text: 'text-blue-600', 
        badge: 'Gạch men & Đá' 
      };
    }
    if (key.includes('trat') || key.includes('trát')) {
      return { 
        icon: Paintbrush, 
        color: 'from-amber-500 to-orange-600', 
        bg: 'bg-amber-50', 
        text: 'text-amber-600', 
        badge: 'Cạnh vữa & Mốc trát' 
      };
    }
    if (key.includes('thach-cao') || key.includes('thạch cao')) {
      return { 
        icon: Layers, 
        color: 'from-cyan-600 to-blue-600', 
        bg: 'bg-cyan-50', 
        text: 'text-cyan-600', 
        badge: 'Trần & Vách ngăn' 
      };
    }
    if (key.includes('noi-that') || key.includes('nội thất')) {
      return { 
        icon: Home, 
        color: 'from-purple-600 to-indigo-600', 
        bg: 'bg-purple-50', 
        text: 'text-purple-600', 
        badge: 'Sàn gỗ & Nẹp len' 
      };
    }
    if (key.includes('ngoai-that') || key.includes('ngoại thất')) {
      return { 
        icon: Building2, 
        color: 'from-emerald-600 to-teal-600', 
        bg: 'bg-emerald-50', 
        text: 'text-emerald-600', 
        badge: 'Ban công & Cửa sổ' 
      };
    }
    if (key.includes('den-led') || key.includes('đèn led')) {
      return { 
        icon: Lightbulb, 
        color: 'from-yellow-500 to-amber-600', 
        bg: 'bg-yellow-50', 
        text: 'text-yellow-600', 
        badge: 'Nẹp nhôm âm trần' 
      };
    }
    return { 
      icon: ShieldCheck, 
      color: 'from-rose-600 to-red-600', 
      bg: 'bg-rose-50', 
      text: 'text-rose-600', 
      badge: 'Cổ ống & Mạch ngừng' 
    };
  }

  // Chủng loại vật tư
  if (key.includes('nhua') || key.includes('nhựa')) {
    return { 
      icon: Layers, 
      color: 'from-emerald-600 to-teal-600', 
      bg: 'bg-emerald-50', 
      text: 'text-emerald-600', 
      badge: 'Nhựa PVC cao cấp' 
    };
  }
  if (key.includes('nhom') || key.includes('nhôm')) {
    return { 
      icon: Ruler, 
      color: 'from-blue-600 to-indigo-600', 
      bg: 'bg-blue-50', 
      text: 'text-blue-600', 
      badge: 'Hợp kim Anode' 
    };
  }
  if (key.includes('inox')) {
    return { 
      icon: Sparkles, 
      color: 'from-amber-500 to-rose-600', 
      bg: 'bg-amber-50', 
      text: 'text-amber-600', 
      badge: 'Inox 304 mạ PVD' 
    };
  }
  if (key.includes('dung-cu') || key.includes('dụng cụ')) {
    return { 
      icon: Wrench, 
      color: 'from-slate-700 to-slate-900', 
      bg: 'bg-slate-100', 
      text: 'text-slate-800', 
      badge: 'Thi công chuyên nghiệp' 
    };
  }
  if (key.includes('phu-kien') || key.includes('phụ kiện')) {
    return { 
      icon: Boxes, 
      color: 'from-red-600 to-rose-600', 
      bg: 'bg-red-50', 
      text: 'text-red-600', 
      badge: 'Ke cân bằng & Cốp pha' 
    };
  }
  if (key.includes('hoa-chat') || key.includes('hóa chất')) {
    return { 
      icon: Droplets, 
      color: 'from-violet-600 to-purple-600', 
      bg: 'bg-violet-50', 
      text: 'text-violet-600', 
      badge: 'Keo dán & Chà ron' 
    };
  }

  return { 
    icon: Package, 
    color: 'from-red-600 to-rose-600', 
    bg: 'bg-red-50', 
    text: 'text-red-600', 
    badge: 'Vật tư đạt chuẩn' 
  };
}

export default function Categories() {
  const [activeTab, setActiveTab] = useState<'material' | 'construction'>('material');
  const [dbCategories, setDbCategories] = useState<any[]>(DEFAULT_MATERIAL_CATEGORIES);
  const [constructionCategories, setConstructionCategories] = useState<ConstructionCategory[]>(DEFAULT_CONSTRUCTION_CATEGORIES);
  const [productCounts, setProductCounts] = useState<{ [key: string]: number }>({});
  const [constructionCounts, setConstructionCounts] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadDynamicTaxonomy() {
      try {
        // 1. Tải danh mục vật tư từ DB Supabase (bảng categories)
        const catQuery = supabase
          .from('categories')
          .select('id, name, slug, description, image_url')
          .eq('tenant_id', SBUILD_TENANT_ID);

        // 2. Tải hạng mục thi công từ Supabase tenant_settings
        const ccQuery = getConstructionCategories();

        // 3. Tải danh sách sản phẩm để tính chính xác số lượng sản phẩm thật trong kho
        const prodQuery = supabase
          .from('products')
          .select('id, category_id, tags')
          .eq('tenant_id', SBUILD_TENANT_ID)
          .eq('status', 'published');

        const [catRes, ccList, prodRes] = await Promise.all([catQuery, ccQuery, prodQuery]);

        // Cập nhật danh mục vật tư từ DB
        if (catRes.data && catRes.data.length > 0) {
          const rawCats = catRes.data.filter((c: any) => 
            c.name && c.name.trim().toLowerCase() !== 'vật tư xây dựng'
          );

          // Sắp xếp theo thứ tự ưu tiên chuẩn
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

        // Cập nhật hạng mục thi công từ DB
        if (ccList && ccList.length > 0) {
          setConstructionCategories(ccList);
        }

        // Tính số lượng sản phẩm thực tế theo từng danh mục
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
      } finally {
        setLoading(false);
      }
    }

    loadDynamicTaxonomy();
  }, []);

  return (
    <section className="bg-slate-50/60 py-24 shrink-0 relative z-10 overflow-hidden border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-0.5 rounded-full bg-gradient-to-r from-red-600 to-rose-600"></span>
              <span className="text-red-600 font-extrabold text-xs uppercase tracking-[0.2em]">
                HỆ THỐNG PHÂN LOẠI KÉP
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">
              Giải Pháp Vật Tư & Thi Công Chuyên Dụng
            </h2>
            <p className="text-slate-500 text-sm font-medium mt-2 max-w-xl">
              Tra cứu linh hoạt theo chủng loại vật tư chính hoặc tìm giải pháp nẹp theo từng công đoạn thi công công trình.
            </p>
          </div>

          {/* Tab Selector Động (Chủng loại vật tư vs Hạng mục thi công) */}
          <div className="flex items-center bg-slate-200/80 p-1.5 rounded-2xl self-start md:self-auto border border-slate-200 shadow-inner">
            <button
              onClick={() => setActiveTab('material')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === 'material'
                  ? 'bg-white text-slate-900 shadow-md shadow-slate-900/10'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package size={15} className={activeTab === 'material' ? 'text-red-600' : 'text-slate-400'} />
              <span>Chủng loại vật tư ({dbCategories.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('construction')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === 'construction'
                  ? 'bg-white text-purple-950 shadow-md shadow-purple-900/10'
                  : 'text-slate-600 hover:text-purple-950'
              }`}
            >
              <Layers size={15} className={activeTab === 'construction' ? 'text-purple-600' : 'text-slate-400'} />
              <span>Hạng mục thi công ({constructionCategories.length})</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Chủng loại vật tư (Nạp hoàn toàn từ bảng categories trong Supabase) */}
        {activeTab === 'material' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {dbCategories.map((cat, index) => {
              const visuals = getCategoryVisuals(cat.name, cat.slug, false);
              const Icon = visuals.icon;
              const count = productCounts[cat.id] || 0;

              return (
                <a
                  key={cat.id || index}
                  href={`/products?cat=${encodeURIComponent(cat.name)}`}
                  className="group relative flex flex-col justify-between p-7 rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 hover:border-red-500/40 hover:shadow-[0_16px_35px_rgba(225,29,72,0.12)] hover:-translate-y-1.5 overflow-hidden"
                >
                  {/* Subtle Background Glow Accent */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-red-50 to-rose-100/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                  <div>
                    {/* Header: Icon + Count Badge */}
                    <div className="flex items-center justify-between mb-5">
                      <div className={`w-13 h-13 rounded-2xl ${visuals.bg} text-slate-800 flex items-center justify-center group-hover:bg-gradient-to-tr ${visuals.color} group-hover:text-white transition-all duration-300 shadow-sm border border-slate-100`}>
                        <Icon size={24} strokeWidth={2.2} />
                      </div>
                      <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/70 px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-600 group-hover:border-red-200 group-hover:text-red-600 transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        <span>{count > 0 ? `${count} sản phẩm` : 'Sẵn hàng'}</span>
                      </div>
                    </div>

                    {/* Sub-badge */}
                    <span className="inline-block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                      {visuals.badge}
                    </span>

                    {/* Category Name */}
                    <h3 className="font-black text-xl uppercase text-slate-900 mb-2.5 group-hover:text-red-600 transition-colors">
                      {cat.name}
                    </h3>
                    
                    {/* Category Description */}
                    <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">
                      {cat.description || 'Giải pháp vật tư xây dựng chuyên dụng chất lượng chuẩn kiểm định.'}
                    </p>
                  </div>

                  {/* Footer CTA Link */}
                  <div className="mt-7 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-black text-slate-500 group-hover:text-red-600 transition-colors uppercase tracking-wider">
                    <span>Xem sản phẩm</span>
                    <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {/* Tab 2: Hạng mục thi công (Nạp hoàn toàn từ Supabase tenant_settings) */}
        {activeTab === 'construction' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-300">
            {constructionCategories.map((cc, index) => {
              const visuals = getCategoryVisuals(cc.name, cc.slug, true);
              const Icon = visuals.icon;
              const count = constructionCounts[cc.name] || 0;

              return (
                <a
                  key={cc.id || index}
                  href={`/products?construction=${encodeURIComponent(cc.name)}`}
                  className="group relative flex flex-col justify-between p-6 rounded-2xl border border-purple-100 bg-white transition-all duration-300 hover:border-purple-400 hover:shadow-[0_16px_35px_rgba(147,51,234,0.12)] hover:-translate-y-1.5 overflow-hidden"
                >
                  <div className="absolute -top-10 -right-10 w-28 h-28 bg-gradient-to-br from-purple-50 to-indigo-100/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                  <div>
                    {/* Header: Icon + Count Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl ${visuals.bg} ${visuals.text} flex items-center justify-center group-hover:bg-gradient-to-tr ${visuals.color} group-hover:text-white transition-all duration-300 shadow-sm border border-purple-100`}>
                        <Icon size={22} strokeWidth={2.2} />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200/60">
                        {count > 0 ? `${count} vật tư` : 'Đang áp dụng'}
                      </span>
                    </div>

                    <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-purple-600/80 mb-1">
                      Công đoạn
                    </span>

                    <h3 className="font-black text-lg text-slate-900 mb-2 group-hover:text-purple-700 transition-colors">
                      {cc.name}
                    </h3>
                    
                    <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                      {cc.description || 'Ứng dụng nẹp và phụ kiện chuyên biệt cho công đoạn thi công.'}
                    </p>
                  </div>

                  {/* Footer CTA Link */}
                  <div className="mt-6 pt-3.5 border-t border-purple-50 flex items-center justify-between text-xs font-black text-purple-700 group-hover:text-purple-900 transition-colors uppercase tracking-wider">
                    <span>Lọc theo công đoạn</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {/* Bottom Banner with Direct Link to All Products Filter */}
        <div className="mt-14 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-slate-800 text-white">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-red-600/20 border border-red-500/30 text-red-500 flex items-center justify-center shrink-0">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h4 className="font-black text-base uppercase tracking-tight text-white">
                Cần tìm giải pháp vật tư tùy chỉnh theo bản vẽ kỹ thuật?
              </h4>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Sbuild cung cấp đầy đủ chứng chỉ CO/CQ, bảng quy cách chi tiết và hỗ trợ gửi mẫu tận chân công trình.
              </p>
            </div>
          </div>

          <a
            href="/products"
            className="shrink-0 px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-md shadow-red-600/30 hover:shadow-red-600/50 hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <span>Mở kho sản phẩm</span>
            <ArrowRight size={15} />
          </a>
        </div>

      </div>
    </section>
  );
}
