import React, { useState, useEffect } from 'react';
import { ShoppingCart, ShoppingBag, Filter, Search, Check, Loader2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../supabaseClient';
import { getProducts } from '../productServices';

const tags = ['Bán chạy', 'Khuyến mãi', 'Mới nhất', 'Cao cấp', 'Giá rẻ', 'Dự án'];

const FALLBACK_TRIM_PRODUCTS = [
  { id: '1', name: 'Nẹp Nhôm Chữ T T10mm Vàng Xước', category: 'Nẹp Nhôm Trang Trí', price: 95000, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop', is_hot: true },
  { id: '2', name: 'Nẹp Nhôm Góc V V20mm Bạc Mờ', category: 'Nẹp Nhôm Trang Trí', price: 85000, image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop', is_hot: true },
  { id: '3', name: 'Nẹp Nhôm Chỉ Âm U12mm Nhôm Mờ', category: 'Nẹp Nhôm Trang Trí', price: 105000, image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=800&auto=format&fit=crop', is_hot: false },
  { id: '4', name: 'Nẹp Inox 304 Chữ T T15mm Vàng Gương PVD', category: 'Nẹp Inox 304 Cao Cấp', price: 185000, image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop', is_hot: true },
  { id: '5', name: 'Nẹp Inox 304 V25mm Đen Phản Quang', category: 'Nẹp Inox 304 Cao Cấp', price: 210000, image: 'https://images.unsplash.com/photo-1541888086925-920a0b40eb45?q=80&w=800&auto=format&fit=crop', is_hot: false },
  { id: '6', name: 'Nẹp Inox Lập Là Flat Bar 20x2mm Vàng Xước', category: 'Nẹp Inox 304 Cao Cấp', price: 160000, image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop', is_hot: false },
  { id: '7', name: 'Nẹp Nhựa PVC Bo Góc Tròn Gạch Men 10mm', category: 'Nẹp Nhựa PVC & Chống Thấm', price: 35000, image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop', is_hot: false },
  { id: '8', name: 'Nẹp Kết Thúc Sàn Gỗ Nhựa PVC L25mm', category: 'Nẹp Nhựa PVC & Chống Thấm', price: 40000, image: 'https://images.unsplash.com/photo-1504307651254-35680f356f58?q=80&w=800&auto=format&fit=crop', is_hot: false },
  { id: '9', name: 'Nẹp Cao Su Chống Trượt Cầu Thang Mũi Bậc', category: 'Nẹp Nhựa PVC & Chống Thấm', price: 65000, image: 'https://images.unsplash.com/photo-1541888086925-920a0b40eb45?q=80&w=800&auto=format&fit=crop', is_hot: true },
  { id: '10', name: 'Nẹp Đồng Thau Nguyên Chất Chữ T T20mm', category: 'Nẹp Đồng & Nẹp Nối Thảm', price: 295000, image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800&auto=format&fit=crop', is_hot: false },
  { id: '11', name: 'Nẹp Đồng V25mm Nổi Gờ Chống Trượt', category: 'Nẹp Đồng & Nẹp Nối Thảm', price: 320000, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop', is_hot: false },
  { id: '12', name: 'Nẹp Nối Thảm Nhôm Răng Cưa N20mm', category: 'Nẹp Đồng & Nẹp Nối Thảm', price: 125000, image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop', is_hot: false },
];

export default function ProductsPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Tất cả']);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState(1000000);
  const [sortOption, setSortOption] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<string[]>(['Tất cả', 'Thiết Kế Website & Apps', 'Cloud Hosting & Server', 'Dịch Vụ SEO & Marketing', 'Giải Pháp AI & SaaS']);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadProductData() {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          getProducts({ limit: 50, status: 'published' }),
          supabase.from('categories').select('name')
        ]);

        if (prodRes.success && prodRes.data && prodRes.data.length > 0) {
          setDbProducts(prodRes.data);
        }

        if (catRes.data && catRes.data.length > 0) {
          const catNames = ['Tất cả', ...new Set(catRes.data.map((c: any) => c.name))];
          setDbCategories(catNames);
        }
      } catch (err) {
        console.error('Lỗi khi nạp danh sách sản phẩm từ Supabase:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProductData();
  }, []);

  const rawProducts = dbProducts.length > 0
    ? dbProducts.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.categories?.name || 'Vật tư xây dựng',
        price: p.original_price || 0,
        image: p.thumbnail_url || 'https://images.unsplash.com/photo-1504307651254-35680f356f58?q=80&w=800&auto=format&fit=crop',
        is_hot: p.is_hot,
      }))
    : FALLBACK_TRIM_PRODUCTS;

  // Filtering
  const filteredProducts = rawProducts.filter((p) => {
    const matchCategory = selectedCategories.includes('Tất cả') || selectedCategories.includes(p.category);
    const matchPrice = p.price <= priceRange;
    return matchCategory && matchPrice;
  });

  const formatPrice = (price: number) => {
    if (!price || price === 0) return 'Liên hệ báo giá';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleCategoryChange = (category: string) => {
    if (category === 'Tất cả') {
      setSelectedCategories(['Tất cả']);
    } else {
      let newCats = selectedCategories.filter((c) => c !== 'Tất cả');
      if (newCats.includes(category)) {
        newCats = newCats.filter((c) => c !== category);
        if (newCats.length === 0) newCats = ['Tất cả'];
      } else {
        newCats.push(category);
      }
      setSelectedCategories(newCats);
    }
  };

  const handleTagChange = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="bg-gray-50/30 pt-32 pb-20 w-full min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-10 text-center">
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">Sản Phẩm</h1>
          <div className="w-16 h-1 bg-gradient-to-r from-red-600 to-rose-600 mx-auto mt-3 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          
          {/* Sidebar / Filters */}
          <aside className="lg:col-span-1 space-y-8">
            {/* Categories */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Filter size={14} className="text-red-600" /> Danh mục
              </h3>
              <div className="space-y-3">
                {dbCategories.map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => handleCategoryChange(cat)}
                      className="hidden"
                    />
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                      selectedCategories.includes(cat) 
                        ? 'bg-gradient-to-r from-red-600 to-rose-600 border-red-600 text-white shadow-sm' 
                        : 'border-slate-300 group-hover:border-red-400 bg-white'
                    }`}>
                      {selectedCategories.includes(cat) && <Check size={14} strokeWidth={3} />}
                    </div>
                    <span className={`text-sm font-semibold transition-colors ${
                      selectedCategories.includes(cat) ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'
                    }`}>
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">Khoảng giá tối đa</h3>
              <div className="space-y-4">
                <input 
                  type="range" 
                  min="0" 
                  max="10000000" 
                  step="100000"
                  value={priceRange} 
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
                <div className="flex justify-between items-center text-sm font-extrabold text-slate-900">
                  <span>0đ</span>
                  <span className="text-red-600">{formatPrice(priceRange)}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">Từ khóa / Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagChange(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                      selectedTags.includes(tag)
                        ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-3 flex flex-col">
            
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm mb-6 gap-4">
              <span className="text-sm font-medium text-slate-500">
                Hiển thị <strong className="text-slate-900 font-extrabold">{filteredProducts.length}</strong> sản phẩm
              </span>
              <div className="flex items-center gap-3">
                <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Sắp xếp:</span>
                <select 
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-slate-50/50 cursor-pointer"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price_asc">Giá tăng dần</option>
                  <option value="price_desc">Giá giảm dần</option>
                  <option value="popular">Phổ biến</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="flex justify-center items-center py-24">
                <Loader2 className="animate-spin text-red-600" size={36} />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-sm">
                <p className="text-slate-500 font-medium text-lg mb-2">Chưa có sản phẩm nào trong mục này.</p>
                <p className="text-slate-400 text-sm">Bạn có thể đăng nhập trang <a href="#admin" className="text-red-600 font-bold hover:underline">Quản trị Admin</a> để thêm sản phẩm mới.</p>
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
                        <a href={`#product?id=${product.id}`} className="w-full h-full block">
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
                        <span className="text-[10px] text-red-600 font-extrabold uppercase tracking-widest mb-1 line-clamp-1">
                          {product.category}
                        </span>
                        <a 
                          href={`#product?id=${product.id}`} 
                          className="text-sm font-extrabold text-slate-800 line-clamp-2 leading-snug h-10 mb-3 group-hover:text-red-600 transition-colors"
                        >
                          {product.name}
                        </a>
                        
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

            {/* Pagination */}
            <div className="mt-12 flex justify-center gap-2">
              {[1, 2, 3, 4].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                    currentPage === page 
                      ? 'bg-red-600 text-white shadow-md shadow-red-200' 
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <span className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>
              <button
                onClick={() => setCurrentPage(10)}
                className="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                10
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
