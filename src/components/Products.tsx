"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, Filter, Layers, Check, 
  Loader2, RotateCcw, Sparkles 
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../supabaseClient';
import { getProducts } from '../productServices';
import { 
  getConstructionCategories, 
  extractConstructionCategories, 
  DEFAULT_CONSTRUCTION_CATEGORIES, 
  ConstructionCategory 
} from '../constructionServices';
import { SEED_PRODUCTS } from '../seedData';

const SLUG_TO_CATEGORY_NAME: Record<string, string> = {
  'nep-nhua': 'Nẹp nhựa',
  'nep-nhom': 'Nẹp nhôm',
  'nep-inox': 'Nẹp inox',
  'dung-cu': 'Dụng cụ',
  'phu-kien': 'Phụ kiện',
  'hoa-chat': 'Hóa chất',
  'nep-nhom-trang-tri': 'Nẹp nhôm',
  'nep-inox-304-cao-cap': 'Nẹp inox',
  'nep-nhua-pvc-chong-tham': 'Nẹp nhựa'
};

const FALLBACK_PRODUCTS = SEED_PRODUCTS.map((p, idx) => ({
  id: `fb-${idx + 1}`,
  name: p.name,
  slug: p.slug,
  category: SLUG_TO_CATEGORY_NAME[p.category_slug] || 'Phụ kiện',
  price: p.sale_price || p.original_price,
  image: p.thumbnail_url,
  is_hot: p.is_hot,
  construction_categories: p.construction_categories || ['Hoàn thiện nội thất']
}));

const STANDARD_CATEGORIES_ORDER = ['Nẹp nhựa', 'Nẹp nhôm', 'Nẹp inox', 'Dụng cụ', 'Phụ kiện', 'Hóa chất'];

export default function ProductsPage() {
  // Bộ lọc Khối 1: Danh mục sản phẩm (Chủng loại vật tư)
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');

  // Bộ lọc Khối 2: Hạng mục thi công (Chọn nhiều)
  const [selectedConstructionCategories, setSelectedConstructionCategories] = useState<string[]>([]);

  // Lọc khoảng giá
  const [priceRange, setPriceRange] = useState(1000000);
  const [sortOption, setSortOption] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<string[]>([
    'Tất cả', 
    'Nẹp nhựa', 
    'Nẹp nhôm', 
    'Nẹp inox', 
    'Dụng cụ', 
    'Phụ kiện', 
    'Hóa chất'
  ]);
  const [constructionCategories, setConstructionCategories] = useState<ConstructionCategory[]>(DEFAULT_CONSTRUCTION_CATEGORIES);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    // Đọc URL search params khi mở trang (hỗ trợ lọc trực tiếp từ Menu xổ xuống)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const catParam = urlParams.get('cat');
      const constructionParam = urlParams.get('construction') || urlParams.get('hm');
      if (catParam) {
        setSelectedCategory(decodeURIComponent(catParam));
      }
      if (constructionParam) {
        setSelectedConstructionCategories([decodeURIComponent(constructionParam)]);
      }
    }

    async function loadProductData() {
      try {
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 4000));
        
        const fetchPromise = Promise.all([
          getProducts({ limit: 100, status: 'published', tenantId: '00000000-0000-0000-0000-000000000002' }),
          supabase.from('categories').select('name').eq('tenant_id', '00000000-0000-0000-0000-000000000002'),
          getConstructionCategories()
        ]);

        const [prodRes, catRes, ccList] = await Promise.race([fetchPromise, timeoutPromise]) as any;

        if (prodRes?.success && prodRes.data && prodRes.data.length > 0) {
          setDbProducts(prodRes.data);
        }

        if (catRes?.data && catRes.data.length > 0) {
          const rawNames = catRes.data
            .map((c: any) => c.name)
            .filter((n: string) => n && n.trim().toLowerCase() !== 'vật tư xây dựng');
          
          const sorted: string[] = ([...new Set(rawNames)] as string[]).sort((a: string, b: string) => {
            const idxA = STANDARD_CATEGORIES_ORDER.indexOf(a);
            const idxB = STANDARD_CATEGORIES_ORDER.indexOf(b);
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
            return a.localeCompare(b);
          });

          setDbCategories(['Tất cả', ...sorted]);
        }

        if (ccList && ccList.length > 0) {
          setConstructionCategories(ccList);
        }
      } catch (err) {
        console.warn('Sử dụng dữ liệu khởi tạo mặc định cho sản phẩm & danh mục:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProductData();
  }, []);

  // Chuẩn hóa danh sách sản phẩm hiển thị
  const rawProducts = useMemo(() => {
    if (dbProducts.length > 0) {
      return dbProducts.map((p) => {
        const cc = extractConstructionCategories(p.tags, constructionCategories);
        const catName = (p.categories?.name && p.categories?.name.trim().toLowerCase() !== 'vật tư xây dựng') ? p.categories.name : '';
        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          category: catName,
          price: p.sale_price || p.original_price || p.regular_price || 0,
          image: p.thumbnail_url || p.image_url || 'https://images.unsplash.com/photo-1504307651254-35680f356f58?q=80&w=800&auto=format&fit=crop',
          is_hot: p.is_hot,
          construction_categories: cc.length > 0 ? cc : ['Hoàn thiện nội thất'],
          created_at: p.created_at
        };
      });
    }
    return FALLBACK_PRODUCTS;
  }, [dbProducts, constructionCategories]);

  // LOGIC LỌC DỮ LIỆU KẾT HỢP (AND FILTER)
  const filteredProducts = useMemo(() => {
    return rawProducts.filter((p) => {
      // 1. Lọc theo Danh mục sản phẩm (Chủng loại vật tư)
      const matchCategory = selectedCategory === 'Tất cả' || (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());

      // 2. Lọc theo Hạng mục thi công (Tích chọn nhiều)
      // Nếu không chọn mục nào: hiển thị tất cả. Nếu chọn: sản phẩm phải thuộc ít nhất một trong các hạng mục đã tích
      const matchConstruction = selectedConstructionCategories.length === 0 ||
        (Array.isArray(p.construction_categories) && 
         p.construction_categories.some((cc: string) => selectedConstructionCategories.includes(cc)));

      // 3. Lọc theo khoảng giá
      const matchPrice = p.price <= priceRange;

      // KẾT HỢP AND GIỮA DANH MỤC VÀ HẠNG MỤC THI CÔNG
      return matchCategory && matchConstruction && matchPrice;
    }).sort((a, b) => {
      if (sortOption === 'price_asc') return a.price - b.price;
      if (sortOption === 'price_desc') return b.price - a.price;
      if (sortOption === 'popular') return (b.is_hot ? 1 : 0) - (a.is_hot ? 1 : 0);
      return 0;
    });
  }, [rawProducts, selectedCategory, selectedConstructionCategories, priceRange, sortOption]);

  const formatPrice = (price: number) => {
    if (!price || price === 0) return 'Liên hệ báo giá';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleConstructionToggle = (name: string) => {
    setSelectedConstructionCategories(prev => 
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  const handleResetFilters = () => {
    setSelectedCategory('Tất cả');
    setSelectedConstructionCategories([]);
    setPriceRange(1000000);
    setSortOption('newest');
  };

  const hasActiveFilters = selectedCategory !== 'Tất cả' || selectedConstructionCategories.length > 0 || priceRange < 1000000;

  // Tính số lượng sản phẩm cho từng hạng mục thi công
  const getConstructionCount = (ccName: string) => {
    return rawProducts.filter(p => 
      (selectedCategory === 'Tất cả' || p.category === selectedCategory) &&
      Array.isArray(p.construction_categories) && 
      p.construction_categories.includes(ccName)
    ).length;
  };

  // Tính số lượng sản phẩm cho từng danh mục vật tư
  const getCategoryCount = (catName: string) => {
    if (catName === 'Tất cả') return rawProducts.length;
    return rawProducts.filter(p => p.category === catName).length;
  };

  return (
    <div className="bg-gray-50/40 pt-32 pb-24 w-full min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-black uppercase tracking-widest mb-3">
            <Sparkles size={14} /> Phân loại kép: Vật tư & Hạng mục
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">
            Hệ Thống Sản Phẩm & Vật Tư
          </h1>
          <p className="text-slate-500 text-sm max-w-2xl mx-auto mt-2 font-medium">
            Lựa chọn theo chủng loại vật tư chính kết hợp tra cứu chính xác theo từng công đoạn và hạng mục thi công.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-red-600 to-rose-600 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10">
          
          {/* SIDEBAR BỘ LỌC (2 KHỐI ĐỘC LẬP) */}
          <aside className="lg:col-span-1 space-y-6">

            {/* Thanh thông báo đặt lại bộ lọc */}
            {hasActiveFilters && (
              <div className="bg-red-50 border border-red-200/80 rounded-2xl p-4 flex items-center justify-between animate-in fade-in">
                <div className="text-xs font-bold text-red-900">
                  Đang lọc {filteredProducts.length} sản phẩm
                </div>
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1.5 text-xs font-black text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                >
                  <RotateCcw size={13} /> Đặt lại
                </button>
              </div>
            )}

            {/* KHỐI 1: DANH MỤC SẢN PHẨM (CHỦNG LOẠI VẬT TƯ) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <Filter size={15} className="text-red-600" />
                  <span>Danh mục sản phẩm</span>
                </h3>
                <span className="text-[10px] font-extrabold uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                  Chủng loại
                </span>
              </div>

              <div className="space-y-2.5">
                {dbCategories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  const count = getCategoryCount(cat);
                  return (
                    <label 
                      key={cat} 
                      onClick={() => setSelectedCategory(cat)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer group select-none ${
                        isSelected 
                          ? 'bg-gradient-to-r from-red-600 to-rose-600 border-red-600 text-white shadow-sm shadow-red-600/20' 
                          : 'bg-white border-transparent hover:border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected ? 'border-white bg-white text-red-600' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-red-600"></div>}
                        </div>
                        <span className={`text-xs font-bold leading-tight ${isSelected ? 'text-white' : 'text-slate-800 group-hover:text-red-600'}`}>
                          {cat}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {count}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* KHỐI 2: HẠNG MỤC THI CÔNG (CÔNG ĐOẠN ỨNG DỤNG - MULTI-SELECT) */}
            <div className="bg-white p-6 rounded-2xl border border-purple-200/90 shadow-sm relative overflow-hidden">
              {/* Highlight top border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-600"></div>

              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <Layers size={15} className="text-purple-600" />
                  <span>Hạng mục thi công</span>
                </h3>
                <span className="text-[10px] font-extrabold uppercase bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                  Chọn nhiều
                </span>
              </div>

              <p className="text-[11px] text-slate-500 font-medium mb-3.5">
                Tích chọn các công đoạn để lọc sản phẩm tương thích:
              </p>

              <div className="space-y-2">
                {constructionCategories.map((cc) => {
                  const isChecked = selectedConstructionCategories.includes(cc.name);
                  const count = getConstructionCount(cc.name);
                  return (
                    <label 
                      key={cc.id || cc.slug}
                      onClick={() => handleConstructionToggle(cc.name)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer group select-none ${
                        isChecked 
                          ? 'bg-purple-600 border-purple-600 text-white shadow-sm shadow-purple-600/20' 
                          : 'bg-white border-slate-200/70 hover:border-purple-300 hover:bg-purple-50/40 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                          isChecked 
                            ? 'bg-white border-white text-purple-600' 
                            : 'border-slate-300 group-hover:border-purple-400 bg-white'
                        }`}>
                          {isChecked && <Check size={12} strokeWidth={3} />}
                        </div>
                        <span className={`text-xs font-bold truncate ${isChecked ? 'text-white' : 'text-slate-800 group-hover:text-purple-700'}`}>
                          {cc.name}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        isChecked ? 'bg-white/20 text-white' : 'bg-purple-50 text-purple-700'
                      }`}>
                        {count}
                      </span>
                    </label>
                  );
                })}
              </div>

              {selectedConstructionCategories.length > 0 && (
                <div className="mt-4 pt-3 border-t border-purple-100 flex items-center justify-between">
                  <span className="text-[11px] text-purple-700 font-bold">
                    Đã chọn {selectedConstructionCategories.length} mục
                  </span>
                  <button
                    onClick={() => setSelectedConstructionCategories([])}
                    className="text-[11px] font-bold text-slate-400 hover:text-red-600 cursor-pointer"
                  >
                    Bỏ chọn tất cả
                  </button>
                </div>
              )}
            </div>

            {/* BỘ LỌC KHOẢNG GIÁ */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">
                Khoảng giá tối đa
              </h3>
              <div className="space-y-3">
                <input 
                  type="range" 
                  min="0" 
                  max="1000000" 
                  step="20000"
                  value={priceRange} 
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
                <div className="flex justify-between items-center text-xs font-extrabold text-slate-900">
                  <span>0đ</span>
                  <span className="text-red-600 text-sm font-black">{formatPrice(priceRange)}</span>
                </div>
              </div>
            </div>

          </aside>

          {/* MAIN PRODUCTS GRID */}
          <div className="lg:col-span-3 flex flex-col">
            
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm mb-6 gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-slate-500">
                  Hiển thị <strong className="text-slate-900 font-extrabold">{filteredProducts.length}</strong> sản phẩm
                </span>
                {selectedCategory !== 'Tất cả' && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    Loại: {selectedCategory}
                  </span>
                )}
                {selectedConstructionCategories.map((cc) => (
                  <span 
                    key={cc} 
                    onClick={() => handleConstructionToggle(cc)}
                    className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 cursor-pointer hover:bg-purple-100"
                    title="Click để bỏ lọc mục này"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                    {cc} &times;
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Sắp xếp:</span>
                <select 
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-slate-50/50 cursor-pointer"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price_asc">Giá tăng dần</option>
                  <option value="price_desc">Giá giảm dần</option>
                  <option value="popular">Bán chạy & Nổi bật</option>
                </select>
              </div>
            </div>

            {/* Grid Thẻ sản phẩm (Product Cards) */}
            {loading ? (
              <div className="flex flex-col justify-center items-center py-28 gap-3 bg-white rounded-2xl border border-slate-200/80">
                <Loader2 className="animate-spin text-red-600" size={36} />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đang nạp sản phẩm...</span>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-14 text-center border border-slate-200/80 shadow-sm flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-4">
                  <Filter size={24} />
                </div>
                <p className="text-slate-800 font-extrabold text-lg mb-1.5">Không tìm thấy sản phẩm phù hợp</p>
                <p className="text-slate-500 text-sm max-w-md mb-6 leading-relaxed">
                  Không có sản phẩm nào thuộc danh mục <strong className="text-slate-800">{selectedCategory}</strong> kết hợp với các hạng mục thi công đã chọn.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                >
                  Xóa bộ lọc & Xem tất cả
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const defaultImg = 'https://images.unsplash.com/photo-1504307651254-35680f356f58?q=80&w=800&auto=format&fit=crop';
                  return (
                    <div 
                      key={product.id}
                      className="group flex flex-col bg-white rounded-2xl border border-slate-200/80 p-4 transition-all duration-300 hover:border-red-500/40 hover:shadow-[0_16px_35px_rgba(225,29,72,0.12)] hover:-translate-y-1 relative"
                    >
                      {/* Image Container */}
                      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-100 mb-3.5 group/img flex items-center justify-center border border-slate-100">
                        <a href={`/san-pham/${(product as any).slug || (product as any).id}`} className="w-full h-full block">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = defaultImg;
                            }}
                            className="w-full h-full object-cover rounded-xl transition-transform duration-500 ease-out group-hover/img:scale-105"
                          />
                        </a>

                        {/* HOT Badge */}
                        {product.is_hot && (
                          <span className="absolute top-2.5 right-2.5 z-10 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md backdrop-blur-md pointer-events-none">
                            Nổi bật
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex flex-col flex-grow">
                        {/* 1. Nhãn Danh mục chính (chỉ hiển thị nếu có danh mục cụ thể, loại bỏ dòng 'Vật tư xây dựng' lặp lại) */}
                        {product.category && product.category.trim().toLowerCase() !== 'vật tư xây dựng' && (
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] text-red-600 font-extrabold uppercase tracking-widest line-clamp-1">
                              {product.category}
                            </span>
                          </div>
                        )}

                        {/* 2. Mini-Tags / Badges Hạng mục thi công liên quan */}
                        {product.construction_categories && product.construction_categories.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2.5">
                            {product.construction_categories.slice(0, 2).map((cc: string, ccIdx: number) => (
                              <span
                                key={ccIdx}
                                className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-100"
                              >
                                <span className="w-1 h-1 rounded-full bg-purple-500"></span>
                                {cc}
                              </span>
                            ))}
                            {product.construction_categories.length > 2 && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500" title={product.construction_categories.slice(2).join(', ')}>
                                +{product.construction_categories.length - 2}
                              </span>
                            )}
                          </div>
                        )}

                        {/* 3. Tên sản phẩm */}
                        <a 
                          href={`/san-pham/${(product as any).slug || (product as any).id}`} 
                          className="text-sm font-extrabold text-slate-800 line-clamp-2 leading-snug h-10 mb-3 group-hover:text-red-600 transition-colors"
                        >
                          {product.name}
                        </a>
                        
                        {/* 4. Giá & Nút hành động */}
                        <div className="mt-auto pt-3 border-t border-slate-100 flex flex-col gap-3">
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600 font-black text-base">
                            {formatPrice(product.price)}
                          </span>
                          <button 
                            onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 })}
                            className="w-full py-2.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-700 hover:to-rose-800 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-red-500/20 active:scale-[0.98] cursor-pointer"
                          >
                            <ShoppingBag size={14} /> Nhận báo giá
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
