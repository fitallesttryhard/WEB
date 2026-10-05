"use client";
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { 
  ShoppingBag, Filter, Layers, Check, 
  Loader2, RotateCcw, Sparkles, ChevronLeft, ChevronRight, ArrowRight,
  Search, ChevronDown, ImageIcon, ArrowLeft, CheckCircle2
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useSettings } from '../contexts/SettingsContext';
import { supabase } from '../supabaseClient';
import { getProducts } from '../productServices';
import { 
  getConstructionCategories, 
  extractConstructionCategories, 
  ConstructionCategory 
} from '../constructionServices';
import { 
  getSubcategoriesMap, 
  getSubcategoriesForCategory, 
  extractSubcategory
} from '../subcategoryServices';

interface CategoryBannerInfo {
  badge: string;
  title: string;
  description: string;
  image: string;
}

const CATEGORY_BANNER_META: Record<string, CategoryBannerInfo> = {
  'Tất cả': {
    badge: 'VẬT TƯ & GIẢI PHÁP SBUILD',
    title: 'VẬT TƯ & GIẢI PHÁP HOÀN THIỆN CÔNG TRÌNH - CHẤT LƯỢNG CAO',
    description: 'Từ lựa chọn vật liệu đến từng chi tiết hoàn thiện, SBUILD đồng hành cùng nhu cầu thi công thực tế của mọi nhà thầu và kiến trúc sư.',
    image: '/images/about/about-hero.jpg'
  },
  'Nẹp nhôm': {
    badge: 'CHỦNG LOẠI VẬT TƯ // HỢP KIM CAO CẤP',
    title: 'GIẢI PHÁP NẸP NHÔM TRANG TRÍ & HOÀN THIỆN KIẾN TRÚC CAO CẤP',
    description: 'Nẹp nhôm chữ T, V, U, L mạ Anode cao cấp chống ăn mòn, tạo đường nét sắc sảo, tinh tế cho vách tường, sàn nhà và góc cạnh công trình.',
    image: ''
  },
  'Nẹp inox': {
    badge: 'CHỦNG LOẠI VẬT TƯ // INOX 304 CAO CẤP',
    title: 'NẸP INOX 304 MẠ PVD BẢO VỆ & TRANG TRÍ SANG TRỌNG',
    description: 'Gia công từ inox 304 mạ PVD vàng gương, vàng xước, đen bóng đạt chuẩn sang trọng, kháng hóa chất và chịu lực va đập vượt trội.',
    image: ''
  },
  'Nẹp nhựa': {
    badge: 'CHỦNG LOẠI VẬT TƯ // PVC NGUYÊN SINH',
    title: 'NẸP NHỰA PVC BO GÓC & NGẮT NƯỚC CHUYÊN DỤNG',
    description: 'Nẹp nhựa PVC bo góc gạch men, nẹp chỉ ngắt nước và nẹp trát tường định hình chính xác, thi công nhanh chóng và tiết kiệm chi phí.',
    image: ''
  },
  'Dụng cụ': {
    badge: 'THIẾT BỊ & DỤNG CỤ // THI CÔNG CHUẨN',
    title: 'DỤNG CỤ & THIẾT BỊ THI CÔNG XÂY DỰNG CHUYÊN NGHIỆP',
    description: 'Dụng cụ thi công ốp lát, bay răng cưa, búa cao su, kìm siết ke cân bằng chuẩn kỹ thuật, nâng cao năng suất thi công.',
    image: ''
  },
  'Phụ kiện': {
    badge: 'PHỤ KIỆN XÂY DỰNG // GIÀN GIÁO & LIÊN KẾT',
    title: 'PHỤ KIỆN CÔNG TRÌNH, KE CÂN BẰNG & VẬT TƯ PHỤ TRỢ',
    description: 'Ke cân bằng, nêm chêm gạch, nút bịt đầu nẹp, phụ kiện liên kết và đỡ giàn giáo chuẩn an toàn cho công trình.',
    image: ''
  },
  'Hóa chất': {
    badge: 'HÓA CHẤT XÂY DỰNG // KEO DÁN & CHỐNG THẤM',
    title: 'KEO DÁN GẠCH, KEO CHÀ RON & HÓA CHẤT XÂY DỰNG ĐẶC CHỦNG',
    description: 'Keo dán gạch, keo chà ron, keo dán nẹp chuyên dụng và phụ gia chống thấm chất lượng cao bảo vệ công trình bền vững.',
    image: ''
  }
};


const STANDARD_CATEGORIES_ORDER = ['Nẹp nhựa', 'Nẹp nhôm', 'Nẹp inox', 'Dụng cụ', 'Phụ kiện', 'Hóa chất'];

// Bộ nhớ đệm toàn cục (in-memory cache) giữa các lần chuyển trang để loại bỏ hoàn toàn việc tải 2 lần
let cachedProducts: any[] | null = null;
let cachedCategoriesData: any[] | null = null;
let cachedCategories: string[] | null = null;
let cachedConstructionCategories: ConstructionCategory[] | null = null;

interface ProductCardProps {
  product: any;
  defaultCategory?: string;
  onQuote: (p: any) => void;
}

function ProductCardItem({ product, defaultCategory, onQuote }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const hasImage = Boolean(product.image) && !imgError && !product.image.includes('placeholder-empty');

  const formatPrice = (price: number) => {
    if (!price || price === 0) return 'Liên hệ báo giá';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/90 hover:border-red-400 p-3 flex flex-col justify-between transition-all duration-200 hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] group">
      <div>
        {/* Aspect Square Image Container */}
        <div className="relative aspect-square w-full rounded-lg bg-slate-50 border border-gray-100 overflow-hidden mb-3 flex items-center justify-center group-hover:bg-slate-100/60 transition-colors">
          <a href={`/san-pham/${product.slug || product.id}`} className="w-full h-full flex items-center justify-center">
            {hasImage ? (
              <img 
                src={product.image} 
                alt={product.name}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400 gap-1.5 p-4 text-center">
                <ImageIcon size={28} strokeWidth={1.5} className="text-gray-300 group-hover:text-red-400 transition-colors" />
                <span className="text-[11px] font-medium text-gray-400">Ảnh sản phẩm</span>
              </div>
            )}
          </a>
          {product.is_hot && (
            <span className="absolute top-2 right-2 bg-red-600 text-white text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
              Nổi bật
            </span>
          )}
        </div>

        {/* Product Title */}
        <a 
          href={`/san-pham/${product.slug || product.id}`} 
          className="font-bold text-xs text-gray-900 line-clamp-2 hover:text-red-600 transition-colors mb-1 leading-snug min-h-[32px] block"
          title={product.name}
        >
          {product.name}
        </a>

        {/* Short Feature / Description */}
        <p className="text-[11px] text-gray-500 line-clamp-1 mb-2 font-medium">
          {product.specs?.purpose || product.description || 'Công năng ngắn theo hồ sơ sản phẩm'}
        </p>

        {/* Category Badge */}
        <div className="mb-3">
          <span className="inline-block text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded border border-gray-200/60">
            {product.category || defaultCategory || 'Nẹp hoàn thiện'}
          </span>
        </div>
      </div>

      {/* Price & Actions Row */}
      <div className="pt-2 border-t border-gray-100 mt-auto">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-red-600">
            {formatPrice(product.price)}
          </span>
          <a 
            href={`/san-pham/${product.slug || product.id}`} 
            className="text-[11px] text-gray-400 hover:text-red-600 font-medium flex items-center gap-0.5 transition-colors"
          >
            <span>Xem chi tiết</span>
            <span className="text-xs">→</span>
          </a>
        </div>

        {/* Full-width Red Quote Button */}
        <button 
          onClick={() => onQuote(product)}
          className="w-full py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-md text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-[0.99] cursor-pointer"
        >
          Yêu cầu báo giá
        </button>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  // Bộ lọc Khối 1: Danh mục sản phẩm (Chủng loại vật tư)
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');

  // Danh mục con được chọn (nếu null = hiển thị tất cả các nhóm con gom nhóm)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  // Tìm kiếm theo từ khóa hoặc mã sản phẩm
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Bộ lọc Khối 2: Hạng mục thi công (Chọn nhiều)
  const [selectedConstructionCategories, setSelectedConstructionCategories] = useState<string[]>([]);

  // Lọc khoảng giá & sắp xếp
  const [priceRange, setPriceRange] = useState(1000000);
  const [sortOption, setSortOption] = useState('newest');

  // Bản đồ danh mục con
  const [subcategoriesMap, setSubcategoriesMap] = useState<Record<string, string[]>>({});
  const [quoteFeedback, setQuoteFeedback] = useState<string | null>(null);

  // Phân trang & số sản phẩm hiển thị trên 1 trang (tránh đứng máy & dài trang)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Khởi tạo trực tiếp từ Cache nếu đã từng nạp trước đó để trang hiện NGAY LẬP TỨC (0ms)
  const [dbProducts, setDbProducts] = useState<any[]>(() => cachedProducts || []);
  const [dbCategoriesData, setDbCategoriesData] = useState<any[]>(() => cachedCategoriesData || []);
  const [dbCategories, setDbCategories] = useState<string[]>(() => cachedCategories || ['Tất cả']);
  const [constructionCategories, setConstructionCategories] = useState<ConstructionCategory[]>(
    () => cachedConstructionCategories || []
  );
  // Nếu đã có cache thì không cần bật loading, nếu chưa có thì bật loading true
  const [loading, setLoading] = useState<boolean>(() => !cachedProducts || cachedProducts.length === 0);
  const { addToCart } = useCart();
  const { settings } = useSettings();
  const aboutHeroImage = settings?.aboutPageConfig?.hero?.backgroundImage || '/images/about/about-hero.jpg';

  useEffect(() => {
    // Đọc URL search params khi mở trang (hỗ trợ lọc trực tiếp từ Menu xổ xuống)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const catParam = urlParams.get('cat');
      const subParam = urlParams.get('sub') || urlParams.get('dmc');
      const constructionParam = urlParams.get('construction') || urlParams.get('hm');
      if (catParam) {
        setSelectedCategory(decodeURIComponent(catParam));
      }
      if (subParam) {
        setSelectedSubcategory(decodeURIComponent(subParam));
      }
      if (constructionParam) {
        setSelectedConstructionCategories([decodeURIComponent(constructionParam)]);
      }
    }

    async function loadProductData() {
      try {
        if (!cachedProducts || cachedProducts.length === 0) {
          setLoading(true);
        }
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000));
        
        const fetchPromise = Promise.all([
          getProducts({ limit: 100, status: 'published', tenantId: '00000000-0000-0000-0000-000000000002' }),
          supabase.from('categories').select('*').eq('tenant_id', '00000000-0000-0000-0000-000000000002'),
          getConstructionCategories(),
          getSubcategoriesMap()
        ]);

        const [prodRes, catRes, ccList, subMap] = await Promise.race([fetchPromise, timeoutPromise]) as any;

        if (subMap) {
          setSubcategoriesMap(subMap);
        }

        if (prodRes?.success && prodRes.data && prodRes.data.length > 0) {
          cachedProducts = prodRes.data;
          setDbProducts(prodRes.data);
        }

        if (catRes?.data && catRes.data.length > 0) {
          cachedCategoriesData = catRes.data;
          setDbCategoriesData(catRes.data);
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

          const finalCategories = ['Tất cả', ...sorted];
          cachedCategories = finalCategories;
          setDbCategories(finalCategories);
        }

        if (ccList && ccList.length > 0) {
          cachedConstructionCategories = ccList;
          setConstructionCategories(ccList);
        }
      } catch (err) {
        console.warn('Lỗi khi nạp dữ liệu sản phẩm từ Supabase:', err);
        // Không dùng dữ liệu mẫu khi lỗi mạng: danh sách để trống thay vì hiển thị sản phẩm ảo
      } finally {
        setLoading(false);
      }
    }
    loadProductData();
  }, []);

  // Tính toán dữ liệu Hero Banner động theo danh mục được chọn (chuẩn định dạng trang Giới thiệu)
  const activeHero = useMemo(() => {
    if (selectedCategory === 'Tất cả') {
      return {
        badge: 'VẬT TƯ & GIẢI PHÁP SBUILD',
        title: 'VẬT TƯ & GIẢI PHÁP HOÀN THIỆN CÔNG TRÌNH - CHẤT LƯỢNG CAO',
        description: 'Từ lựa chọn vật liệu đến từng chi tiết hoàn thiện, SBUILD đồng hành cùng nhu cầu thi công thực tế của mọi nhà thầu và kiến trúc sư.',
        image: aboutHeroImage
      };
    }

    const meta = CATEGORY_BANNER_META[selectedCategory] || {
      badge: `CHỦNG LOẠI VẬT TƯ // ${selectedCategory.toUpperCase()}`,
      title: `GIẢI PHÁP ${selectedCategory.toUpperCase()} CHUYÊN DỤNG`,
      description: `Hệ thống sản phẩm ${selectedCategory} đạt chuẩn kỹ thuật, tối ưu chi phí và thẩm mỹ cho công trình.`,
      image: aboutHeroImage
    };

    // Tìm trong dbCategoriesData nếu có ảnh hoặc mô tả tùy chỉnh từ admin
    const dbCat = dbCategoriesData.find(c => c.name?.trim().toLowerCase() === selectedCategory.trim().toLowerCase());

    return {
      badge: meta.badge,
      title: meta.title,
      description: dbCat?.description?.trim() ? dbCat.description : meta.description,
      image: dbCat?.banner_image_url?.trim() ? dbCat.banner_image_url : (meta.image || aboutHeroImage)
    };
  }, [selectedCategory, dbCategoriesData, aboutHeroImage]);

  // Chuẩn hóa danh sách sản phẩm hiển thị (KHÔNG BAO GIỜ hiển thị 12 sản phẩm ảo khi đang nạp)
  const rawProducts = useMemo(() => {
    if (dbProducts.length > 0) {
      return dbProducts.map((p) => {
        const cc = extractConstructionCategories(p.tags, constructionCategories);
        const catName = (p.categories?.name && p.categories?.name.trim().toLowerCase() !== 'vật tư xây dựng') ? p.categories.name : '';
        const subcat = extractSubcategory(p.tags, p.name, catName, subcategoriesMap[catName] || []);
        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          category: catName,
          subcategory: subcat,
          price: p.sale_price || p.original_price || p.regular_price || 0,
          image: p.thumbnail_url || p.image_url || '',
          is_hot: p.is_hot,
          construction_categories: cc.length > 0 ? cc : ['Hoàn thiện nội thất'],
          created_at: p.created_at,
          specs: p.specs,
          description: p.description
        };
      });
    }
    // Không có sản phẩm thật (đang nạp hoặc chưa có): trả về rỗng, không hiển thị sản phẩm ảo
    return [];
  }, [dbProducts, constructionCategories, subcategoriesMap]);

  // LOGIC LỌC DỮ LIỆU KẾT HỢP (AND FILTER)
  const filteredProducts = useMemo(() => {
    return rawProducts.filter((p) => {
      // 1. Lọc theo Danh mục sản phẩm (Chủng loại vật tư)
      const matchCategory = selectedCategory === 'Tất cả' || (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());

      // 2. Lọc theo Hạng mục thi công (Tích chọn nhiều)
      const matchConstruction = selectedConstructionCategories.length === 0 ||
        (Array.isArray(p.construction_categories) && 
         p.construction_categories.some((cc: string) => selectedConstructionCategories.includes(cc)));

      // 3. Lọc theo khoảng giá
      const matchPrice = p.price <= priceRange;

      // 4. Lọc theo từ khóa tìm kiếm (Tên hoặc mã sản phẩm)
      const q = searchQuery.trim().toLowerCase();
      const matchSearch = !q || p.name.toLowerCase().includes(q) || (p.slug && p.slug.toLowerCase().includes(q));

      // 5. Lọc theo danh mục con (nếu đang chọn 1 danh mục con cụ thể)
      const matchSub = !selectedSubcategory || (p.subcategory && p.subcategory.toLowerCase() === selectedSubcategory.toLowerCase());

      return matchCategory && matchConstruction && matchPrice && matchSearch && matchSub;
    }).sort((a, b) => {
      if (sortOption === 'price_asc') return a.price - b.price;
      if (sortOption === 'price_desc') return b.price - a.price;
      if (sortOption === 'popular') return (b.is_hot ? 1 : 0) - (a.is_hot ? 1 : 0);
      return 0;
    });
  }, [rawProducts, selectedCategory, selectedConstructionCategories, priceRange, searchQuery, selectedSubcategory, sortOption]);

  // Danh sách các danh mục con của danh mục đang chọn
  const currentCategorySubcategories = useMemo(() => {
    if (selectedCategory === 'Tất cả') return [];
    return getSubcategoriesForCategory(selectedCategory, subcategoriesMap);
  }, [selectedCategory, subcategoriesMap]);

  // Nhóm sản phẩm theo danh mục con khi lọc một danh mục vật tư
  const groupedBySubcategory = useMemo(() => {
    if (selectedCategory === 'Tất cả' || selectedSubcategory) return [];

    const groups: { title: string; products: any[] }[] = [];
    const assignedIds = new Set<any>();

    // Dựa theo thứ tự các danh mục con đã cấu hình
    for (const sub of currentCategorySubcategories) {
      const prods = filteredProducts.filter(p => {
        const match = p.subcategory && p.subcategory.trim().toLowerCase() === sub.trim().toLowerCase();
        if (match) assignedIds.add(p.id);
        return match;
      });
      if (prods.length > 0) {
        groups.push({ title: sub, products: prods });
      }
    }

    // Các sản phẩm còn lại chưa được gán vào nhóm con nào
    const leftover = filteredProducts.filter(p => !assignedIds.has(p.id));
    if (leftover.length > 0) {
      if (groups.length === 0 && currentCategorySubcategories.length > 0) {
        groups.push({ title: currentCategorySubcategories[0], products: leftover });
      } else {
        groups.push({ title: `Các sản phẩm ${selectedCategory} khác`, products: leftover });
      }
    }

    return groups;
  }, [selectedCategory, selectedSubcategory, currentCategorySubcategories, filteredProducts]);

  // Khi bộ lọc thay đổi, reset về trang 1
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedSubcategory, selectedConstructionCategories, priceRange, sortOption, searchQuery, itemsPerPage]);

  // Tính toán phân trang cho chế độ xem đơn lẻ
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handleScrollToGridTop = () => {
    const el = document.getElementById('products-catalog-section');
    if (el) {
      const yOffset = -70;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    handleScrollToGridTop();
  };

  const formatPrice = (price: number) => {
    if (!price || price === 0) return 'Liên hệ báo giá';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedSubcategory(null);
    setCurrentPage(1);
  };

  const handleConstructionToggle = (name: string) => {
    setSelectedConstructionCategories(prev => 
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  const handleQuoteRequest = (product: any) => {
    addToCart({ 
      id: product.id, 
      name: product.name, 
      price: product.price, 
      image: product.image, 
      quantity: 1 
    });
    setQuoteFeedback(`Đã thêm "${product.name}" vào yêu cầu báo giá!`);
    setTimeout(() => setQuoteFeedback(null), 3500);
  };

  const handleResetFilters = () => {
    setSelectedCategory('Tất cả');
    setSelectedSubcategory(null);
    setSearchQuery('');
    setSelectedConstructionCategories([]);
    setPriceRange(1000000);
    setSortOption('newest');
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedCategory !== 'Tất cả' || selectedSubcategory !== null || searchQuery !== '' || selectedConstructionCategories.length > 0 || priceRange < 1000000;

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

  // Render các nút số trang thông minh có dấu chấm lửng
  const renderPaginationButtons = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }

    return pages.map((page, idx) => {
      if (page === '...') {
        return (
          <span key={`ellipsis-${idx}`} className="px-2 py-1 text-slate-400 font-bold text-xs select-none">
            ...
          </span>
        );
      }
      const isCurrent = page === currentPage;
      return (
        <button
          key={`page-${page}`}
          onClick={() => handlePageChange(Number(page))}
          className={`w-9 h-9 rounded-xl text-xs font-black transition-all flex items-center justify-center cursor-pointer ${
            isCurrent
              ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-md shadow-red-600/30 scale-105'
              : 'bg-white border border-slate-200/80 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          {page}
        </button>
      );
    });
  };

  return (
    <div className="bg-slate-50/50 w-full flex-1 flex flex-col">
      {/* 1. DYNAMIC CATEGORY HERO BANNER - ĐỒNG BỘ ĐỊNH DẠNG VỚI TRANG GIỚI THIỆU */}
      <section className="relative min-h-[460px] lg:min-h-[520px] flex items-center justify-start overflow-hidden bg-slate-950 pt-24 pb-14 lg:py-24">
        {/* Background Image with Dark Vignette Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            key={activeHero.image}
            src={activeHero.image}
            alt={activeHero.title}
            className="w-full h-full object-cover object-center brightness-[0.75] scale-105 transition-all duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6 uppercase tracking-wider">
            <Link href="/" className="hover:text-white transition-colors">TRANG CHỦ</Link>
            <span className="text-red-500">/</span>
            <button 
              onClick={() => setSelectedCategory('Tất cả')}
              className={`hover:text-white transition-colors uppercase cursor-pointer ${selectedCategory === 'Tất cả' ? 'text-white' : 'text-slate-400'}`}
            >
              SẢN PHẨM
            </button>
            {selectedCategory !== 'Tất cả' && (
              <>
                <span className="text-red-500">/</span>
                <span className="text-white font-bold uppercase">{selectedCategory}</span>
              </>
            )}
          </nav>

          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl lg:max-w-3xl"
          >
            {/* Tag / Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-8 h-[2px] bg-red-600"></span>
              <span className="text-xs font-black uppercase tracking-[0.25em] text-red-500">
                {activeHero.badge}
              </span>
            </div>

            {/* H1 Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight leading-[1.15] mb-5 drop-shadow-md">
              {activeHero.title}
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-sm sm:text-base lg:text-lg font-normal leading-relaxed mb-8 max-w-2xl [text-wrap:balance]">
              {activeHero.description}
            </p>

            {/* CTA Button */}
            <button
              onClick={handleScrollToGridTop}
              className="inline-flex items-center gap-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white px-7 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-xl shadow-red-600/30 group cursor-pointer"
            >
              <span>Khám phá giải pháp{!loading && filteredProducts.length > 0 ? ` (${filteredProducts.length})` : ''}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. MAIN PRODUCTS CATALOG SECTION */}
      <div id="products-catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col pt-10 pb-16">
        
        {/* ANCHOR CHO SCROLL MƯỢT KHI ĐỔI TRANG HOẶC TAB */}
        <div id="products-grid-top"></div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10 items-start">
          
          {/* SIDEBAR BỘ LỌC (Cố định sticky tự nhiên, không chặn cuộn chuột của trang) */}
          <aside className="lg:col-span-1 space-y-5 lg:sticky lg:top-24 self-start">

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
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="mb-3 pb-2.5 border-b border-slate-100">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-1.5">
                  <Filter size={15} className="text-red-600 shrink-0" />
                  <span>Danh mục sản phẩm</span>
                </h3>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Phân loại vật tư:
                  </span>
                  <span className="text-[9.5px] font-extrabold uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full shrink-0">
                    Chủng loại
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                {dbCategories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  const count = getCategoryCount(cat);
                  return (
                    <label 
                      key={cat} 
                      onClick={() => handleCategorySelect(cat)}
                      className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer group select-none ${
                        isSelected 
                          ? 'bg-gradient-to-r from-red-600 to-rose-600 border-red-600 text-white shadow-sm shadow-red-600/20' 
                          : 'bg-white border-transparent hover:border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected ? 'border-white bg-white text-red-600' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>}
                        </div>
                        <span className={`text-xs font-bold leading-tight ${isSelected ? 'text-white' : 'text-slate-800 group-hover:text-red-600'}`}>
                          {cat}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center justify-center min-w-[24px] ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {loading ? (
                          <span className="w-3.5 h-1.5 bg-slate-300/70 rounded-full animate-pulse"></span>
                        ) : (
                          count
                        )}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* KHỐI 2: HẠNG MỤC THI CÔNG (CÔNG ĐOẠN ỨNG DỤNG - MULTI-SELECT) */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-purple-200/90 shadow-xs relative overflow-hidden">
              {/* Highlight top border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-600"></div>

              <div className="mb-3 pb-2.5 border-b border-slate-100">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-1.5">
                  <Layers size={15} className="text-purple-600 shrink-0" />
                  <span>Hạng mục thi công</span>
                </h3>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Tích chọn công đoạn:
                  </span>
                  <span className="text-[9.5px] font-extrabold uppercase bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full shrink-0">
                    Chọn nhiều
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                {constructionCategories.map((cc) => {
                  const isChecked = selectedConstructionCategories.includes(cc.name);
                  const count = getConstructionCount(cc.name);
                  return (
                    <label 
                      key={cc.id || cc.slug}
                      onClick={() => handleConstructionToggle(cc.name)}
                      className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer group select-none ${
                        isChecked 
                          ? 'bg-purple-600 border-purple-600 text-white shadow-sm shadow-purple-600/20' 
                          : 'bg-white border-slate-200/70 hover:border-purple-300 hover:bg-purple-50/40 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors shrink-0 ${
                          isChecked 
                            ? 'bg-white border-white text-purple-600' 
                            : 'border-slate-300 group-hover:border-purple-400 bg-white'
                        }`}>
                          {isChecked && <Check size={11} strokeWidth={3} />}
                        </div>
                        <span className={`text-xs font-bold truncate ${isChecked ? 'text-white' : 'text-slate-800 group-hover:text-purple-700'}`}>
                          {cc.name}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 flex items-center justify-center min-w-[24px] ${
                        isChecked ? 'bg-white/20 text-white' : 'bg-purple-50 text-purple-700'
                      }`}>
                        {loading ? (
                          <span className="w-3.5 h-1.5 bg-purple-300/70 rounded-full animate-pulse"></span>
                        ) : (
                          count
                        )}
                      </span>
                    </label>
                  );
                })}
              </div>

              {selectedConstructionCategories.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-purple-100 flex items-center justify-between">
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
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3">
                Khoảng giá tối đa
              </h3>
              <div className="space-y-2.5">
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

          {/* MAIN PRODUCTS GRID & PAGINATION */}
          <div className="lg:col-span-3 flex flex-col">
            
            {/* Toolbar (Tìm kiếm & Sắp xếp theo thiết kế mẫu) */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search input */}
                <div className="relative flex-1 max-w-lg">
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm theo tên hoặc mã sản phẩm..."
                    className="w-full pl-9 pr-8 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white placeholder-gray-400 font-medium transition-all"
                  />
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')} 
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 text-sm font-bold"
                    >
                      &times;
                    </button>
                  )}
                </div>

                {/* Sắp xếp */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="relative">
                    <select 
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="appearance-none border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-xs font-bold text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer shadow-2xs"
                    >
                      <option value="newest">Mặc định</option>
                      <option value="popular">Bán chạy & Nổi bật</option>
                      <option value="price_asc">Giá tăng dần</option>
                      <option value="price_desc">Giá giảm dần</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Sub-label hiển thị số lượng nhóm hoặc sản phẩm */}
              <div className="mt-3 pt-2.5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 font-medium">
                <div>
                  {loading ? (
                    <span className="inline-block w-32 h-3.5 bg-gray-200 rounded animate-pulse"></span>
                  ) : selectedCategory !== 'Tất cả' && !selectedSubcategory ? (
                    <span className="font-bold text-gray-700">
                      {groupedBySubcategory.length} nhóm đang hiển thị
                    </span>
                  ) : (
                    <span>
                      Hiển thị <strong className="text-gray-900 font-bold">{paginatedProducts.length}</strong> / <strong className="text-red-600 font-bold">{filteredProducts.length}</strong> sản phẩm
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {selectedCategory !== 'Tất cả' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-100">
                      Chủng loại: {selectedCategory}
                    </span>
                  )}
                  {selectedSubcategory && (
                    <span 
                      onClick={() => setSelectedSubcategory(null)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 cursor-pointer hover:bg-amber-100"
                      title="Bấm để xem tất cả nhóm"
                    >
                      Nhóm: {selectedSubcategory} &times;
                    </span>
                  )}
                  {selectedConstructionCategories.map((cc) => (
                    <span 
                      key={cc} 
                      onClick={() => handleConstructionToggle(cc)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 cursor-pointer hover:bg-purple-100"
                      title="Click để bỏ lọc mục này"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                      {cc} &times;
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Pills Bar khi đang xem một Danh mục vật tư */}
            {selectedCategory !== 'Tất cả' && currentCategorySubcategories.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
                <button
                  onClick={() => {
                    setSelectedSubcategory(null);
                    handleScrollToGridTop();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    !selectedSubcategory 
                      ? 'bg-red-600 text-white shadow-xs' 
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-red-400 hover:text-red-600'
                  }`}
                >
                  Tất cả các nhóm ({filteredProducts.length})
                </button>
                {currentCategorySubcategories.map((sub) => {
                  const count = rawProducts.filter(p => 
                    p.category === selectedCategory && 
                    p.subcategory?.trim().toLowerCase() === sub.trim().toLowerCase()
                  ).length;
                  const isActive = selectedSubcategory === sub;
                  return (
                    <button
                      key={sub}
                      onClick={() => {
                        setSelectedSubcategory(isActive ? null : sub);
                        handleScrollToGridTop();
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                        isActive 
                          ? 'bg-red-600 text-white shadow-xs' 
                          : 'bg-white border border-gray-200 text-gray-700 hover:border-red-400 hover:text-red-600'
                      }`}
                    >
                      <span>{sub}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* NỘI DUNG CHÍNH: Skeleton / Empty / Grouped / Single */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div 
                    key={`skeleton-${idx}`} 
                    className="bg-white rounded-xl border border-gray-200 p-3 flex flex-col justify-between animate-pulse"
                  >
                    <div>
                      <div className="aspect-square w-full rounded-lg bg-gray-100 mb-3"></div>
                      <div className="h-4 w-3/4 bg-gray-100 rounded mb-2"></div>
                      <div className="h-3 w-1/2 bg-gray-100 rounded mb-3"></div>
                      <div className="h-4 w-16 bg-gray-100 rounded mb-4"></div>
                    </div>
                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <div className="h-4 w-20 bg-gray-100 rounded"></div>
                        <div className="h-3 w-16 bg-gray-100 rounded"></div>
                      </div>
                      <div className="h-8 w-full bg-gray-100 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-14 text-center border border-slate-200/80 shadow-sm flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-4">
                  <Filter size={24} />
                </div>
                <p className="text-slate-800 font-extrabold text-lg mb-1.5">Không tìm thấy sản phẩm phù hợp</p>
                <p className="text-slate-500 text-sm max-w-md mb-6 leading-relaxed">
                  {selectedSubcategory ? (
                    <>Không có sản phẩm nào thuộc nhóm <strong className="text-slate-800">{selectedSubcategory}</strong> với bộ lọc hiện tại.</>
                  ) : (
                    <>Không có sản phẩm nào thuộc danh mục <strong className="text-slate-800">{selectedCategory}</strong> kết hợp với các bộ lọc đã chọn.</>
                  )}
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                >
                  Xóa bộ lọc & Xem tất cả
                </button>
              </div>
            ) : selectedCategory !== 'Tất cả' && !selectedSubcategory ? (
              /* TRƯỜNG HỢP 1: HIỂN THỊ PHÂN THEO CÁC DANH MỤC CON (Theo ảnh khách gửi) */
              <div className="space-y-10">
                {groupedBySubcategory.map((group) => (
                  <div key={group.title} className="animate-in fade-in duration-300">
                    {/* Header nhóm con: Tên đậm + Xem tất cả */}
                    <div className="flex items-baseline justify-between mb-1.5">
                      <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
                        {group.title}
                      </h2>
                      <button 
                        onClick={() => {
                          setSelectedSubcategory(group.title);
                          handleScrollToGridTop();
                        }}
                        className="text-xs text-gray-400 hover:text-red-600 transition-colors flex items-center gap-1 font-semibold cursor-pointer group/link"
                      >
                        <span>Xem tất cả</span>
                        <span className="text-sm transition-transform group-hover/link:translate-x-0.5">→</span>
                      </button>
                    </div>

                    {/* Vạch kẻ đỏ phía dưới tiêu đề nhóm */}
                    <div className="relative w-full h-[2px] bg-gray-200 mb-5">
                      <div className="absolute left-0 top-0 h-[2px] w-28 bg-red-600"></div>
                    </div>

                    {/* Grid sản phẩm của nhóm con */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                      {group.products.map((product) => (
                        <ProductCardItem 
                          key={product.id} 
                          product={product} 
                          defaultCategory={selectedCategory}
                          onQuote={handleQuoteRequest}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* TRƯỜNG HỢP 2: HIỂN THỊ 1 NHÓM CON CỤ THỂ HOẶC TẤT CẢ DANH MỤC */
              <div className="space-y-6">
                {selectedSubcategory && (
                  <div>
                    <button
                      onClick={() => {
                        setSelectedSubcategory(null);
                        handleScrollToGridTop();
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-red-600 mb-2 cursor-pointer transition-colors"
                    >
                      <ArrowLeft size={14} /> Trở về xem tất cả các nhóm {selectedCategory}
                    </button>
                    <div className="flex items-baseline justify-between mb-1.5">
                      <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
                        {selectedSubcategory}
                      </h2>
                      <span className="text-xs font-bold text-gray-500">
                        {filteredProducts.length} sản phẩm
                      </span>
                    </div>
                    <div className="relative w-full h-[2px] bg-gray-200 mb-5">
                      <div className="absolute left-0 top-0 h-[2px] w-28 bg-red-600"></div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {paginatedProducts.map((product) => (
                    <ProductCardItem 
                      key={product.id} 
                      product={product} 
                      defaultCategory={selectedCategory}
                      onQuote={handleQuoteRequest}
                    />
                  ))}
                </div>

                {/* BỘ PHÂN TRANG */}
                {filteredProducts.length > 0 && totalPages > 1 && (
                  <div className="mt-10 pt-6 border-t border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-xs border">
                    <div className="text-xs font-semibold text-slate-500 text-center md:text-left">
                      Hiển thị <span className="font-extrabold text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="font-extrabold text-slate-900">{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</span> trên <span className="font-black text-red-600">{filteredProducts.length}</span> sản phẩm (Trang {currentPage}/{totalPages})
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap justify-center">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <ChevronLeft size={14} /> <span className="hidden sm:inline">Trước</span>
                      </button>

                      {renderPaginationButtons()}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span className="hidden sm:inline">Sau</span> <ChevronRight size={14} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      <span className="hidden lg:inline">Mỗi trang:</span>
                      <select
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                          handleScrollToGridTop();
                        }}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-extrabold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 cursor-pointer"
                      >
                        <option value={12}>12 sản phẩm</option>
                        <option value={24}>24 sản phẩm</option>
                        <option value={36}>36 sản phẩm</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Floating Quote Feedback Toast */}
      {quoteFeedback && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300 border border-slate-700">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{quoteFeedback}</span>
        </div>
      )}
    </div>
  );
}
