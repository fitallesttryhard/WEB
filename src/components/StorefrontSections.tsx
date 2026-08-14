import React, { useState, useEffect } from 'react';
import { ShoppingCart, ArrowRight, Calendar, User, Loader2, ArrowLeftRight, X, Check, Eye } from 'lucide-react';
import { getProducts } from '../productServices';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../supabaseClient';

export default function StorefrontSections() {
  const [products, setProducts] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [compareList, setCompareList] = useState<any[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const { addToCart, openDrawer } = useCart();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Tải sản phẩm từ productServices.ts
        const res = await getProducts({ limit: 8, status: 'published' });
        if (res.success && res.data) {
          setProducts(res.data);
        }

        // Tải bài viết nổi bật từ Supabase
        const { data: postData } = await supabase
          .from('posts')
          .select('*')
          .eq('is_published', true)
          .limit(3);

        if (postData) {
          setPosts(postData);
        }
      } catch (err) {
        console.error('Lỗi khi nạp dữ liệu Storefront:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const formatPrice = (price: number) => {
    if (!price || price === 0) return 'Liên hệ báo giá';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.original_price || product.price || 0,
      image: product.thumbnail_url || product.image_url || 'https://images.unsplash.com/photo-1504307651254-35680f356f58?q=80&w=800&auto=format&fit=crop',
      quantity: 1,
    });
    openDrawer();
  };

  const handleToggleCompare = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (compareList.find((p) => p.id === product.id)) {
      setCompareList(compareList.filter((p) => p.id !== product.id));
    } else {
      if (compareList.length >= 3) {
        alert('Bạn chỉ có thể so sánh tối đa 3 sản phẩm cùng lúc.');
        return;
      }
      setCompareList([...compareList, product]);
    }
  };

  const displayArticles = posts.map((p) => ({
    id: p.id,
    title: p.title,
    excerpt: p.excerpt || 'Bài viết thông tin dự án & kỹ thuật thi công.',
    image: p.cover_image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
    date: new Date(p.created_at).toLocaleDateString('vi-VN'),
    author: 'Admin',
  }));

  return (
    <div className="bg-slate-50/50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full flex flex-col gap-24">
        
        {/* SECTION 1: SẢN PHẨM NỔI BẬT */}
        <section>
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-red-600 font-extrabold text-xs uppercase tracking-widest block mb-2">
                SẢN PHẨM BÁN CHẠY
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">
                Vật Tư & Phụ Kiện Tiêu Biểu
              </h2>
            </div>
            <a
              href="#products"
              className="inline-flex items-center gap-2 font-bold text-sm text-red-600 hover:text-red-700 transition-colors uppercase tracking-wider group"
            >
              Xem tất cả sản phẩm
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-red-600" size={36} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => {
                const img = product.thumbnail_url || product.image_url || 'https://images.unsplash.com/photo-1504307651254-35680f356f58?q=80&w=800&auto=format&fit=crop';
                const catName = product.categories?.name || 'Vật tư xây dựng';
                const price = product.original_price || product.price || 0;

                return (
                  <div
                    key={product.id}
                    className="group flex flex-col bg-white rounded-2xl border border-slate-200/80 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 relative"
                  >
                    {/* HOT Badge */}
                    {product.is_hot && (
                      <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-red-600 to-amber-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                        Nổi bật
                      </div>
                    )}

                    {/* Compare Button */}
                    <button
                      onClick={(e) => handleToggleCompare(e, { ...product, image: img, price })}
                      className={`absolute top-4 left-4 z-20 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold transition-all shadow-sm backdrop-blur-md ${
                        compareList.find((p) => p.id === product.id)
                          ? 'bg-red-600 text-white'
                          : 'bg-white/90 text-slate-700 hover:bg-slate-900 hover:text-white'
                      }`}
                      title="So sánh"
                    >
                      <ArrowLeftRight size={14} />
                      <span className="hidden sm:inline">
                        {compareList.find((p) => p.id === product.id) ? 'Đã chọn' : 'So sánh'}
                      </span>
                    </button>

                    {/* Image Container */}
                    <a href={`#product?id=${product.id}`} className="aspect-[4/3] w-full overflow-hidden bg-slate-100 flex items-center justify-center p-4 relative block">
                      <img
                        src={img}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-xl transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </a>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-grow">
                      <span className="text-[11px] text-red-600 font-extrabold uppercase tracking-widest mb-1.5">
                        {catName}
                      </span>
                      <a href={`#product?id=${product.id}`} className="text-base font-bold text-slate-900 mb-3 line-clamp-2 leading-snug flex-grow group-hover:text-red-600 transition-colors">
                        {product.name}
                      </a>

                      <div className="mt-auto flex flex-col gap-3.5 pt-3 border-t border-slate-100">
                        <span className="text-red-600 font-black text-xl">
                          {formatPrice(price)}
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          <a
                            href={`#product?id=${product.id}`}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                          >
                            <Eye size={15} /> Xem chi tiết
                          </a>
                          <button
                            onClick={(e) => handleAddToCart(e, product)}
                            className="bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <ShoppingCart size={15} /> Thêm giỏ
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* SECTION 2: BÀI VIẾT NỔI BẬT */}
        {displayArticles.length > 0 && (
          <section>
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-red-600 font-extrabold text-xs uppercase tracking-widest block mb-2">
                  TIN TỨC & DỰ ÁN
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">
                  Kiến Thức & Kinh Nghiệm Thi Công
                </h2>
              </div>
              <a
                href="#blog"
                className="inline-flex items-center gap-2 font-bold text-sm text-red-600 hover:text-red-700 transition-colors uppercase tracking-wider group"
              >
                Xem tất cả bài viết
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {displayArticles.map((article) => (
                <article
                  key={article.id}
                  className="group flex flex-col bg-white rounded-2xl border border-slate-200/80 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5"
                >
                  <a href={`#article?id=${article.id}`} className="aspect-[16/10] w-full overflow-hidden bg-slate-100 block">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </a>

                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-red-600" />
                        <span>{article.date}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1.5">
                        <User size={14} className="text-red-600" />
                        <span>{article.author}</span>
                      </div>
                    </div>

                    <a href={`#article?id=${article.id}`} className="text-lg font-bold text-slate-900 mb-3 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors">
                      {article.title}
                    </a>

                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-6 font-medium">
                      {article.excerpt}
                    </p>

                    <div className="mt-auto pt-4 border-t border-slate-100">
                      <a
                        href={`#article?id=${article.id}`}
                        className="inline-flex items-center gap-2 text-xs font-extrabold text-red-600 uppercase tracking-wider group-hover:gap-3 transition-all"
                      >
                        Đọc tiếp
                        <ArrowRight size={14} />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* Floating Compare Bar */}
      {compareList.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-8px_30px_rgba(0,0,0,0.1)] p-4 z-40 transform transition-transform duration-300 animate-in slide-in-from-bottom">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-4">
                {compareList.map((p, idx) => (
                  <div key={idx} className="w-12 h-12 rounded-full border-2 border-white bg-gray-100 overflow-hidden shadow-sm relative group">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => {
                        const newList = compareList.filter(item => item.id !== p.id);
                        setCompareList(newList);
                        if (newList.length < 2) setIsCompareModalOpen(false);
                      }}
                      className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="text-sm font-bold text-gray-700">
                Đã chọn {compareList.length}/3 sản phẩm
              </div>
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto">
              <button 
                onClick={() => {
                  setCompareList([]);
                  setIsCompareModalOpen(false);
                }}
                className="flex-1 sm:flex-none px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition-colors text-sm"
              >
                Xóa tất cả
              </button>
              <button 
                onClick={() => setIsCompareModalOpen(true)}
                disabled={compareList.length < 2}
                className="flex-1 sm:flex-none px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors shadow-sm text-sm"
              >
                So sánh ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compare Modal */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCompareModalOpen(false)}></div>
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl relative z-10 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
              <h3 className="text-xl md:text-2xl font-black text-gray-900 uppercase">So sánh sản phẩm</h3>
              <button 
                onClick={() => setIsCompareModalOpen(false)}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-0 overflow-auto custom-scrollbar flex-1">
              <div className="min-w-[700px] p-6">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="p-4 w-48 border-b border-gray-200 bg-white sticky left-0 z-10"></th>
                      {compareList.map((p) => (
                        <th key={p.id} className="p-4 w-[250px] border-b border-gray-200 align-top">
                          <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 mb-4 border border-gray-200">
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                            <button 
                              onClick={() => {
                                const newList = compareList.filter(item => item.id !== p.id);
                                setCompareList(newList);
                                if (newList.length < 2) setIsCompareModalOpen(false);
                              }}
                              className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white transition-colors shadow-sm"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <h4 className="font-bold text-gray-900 text-base md:text-lg mb-2 line-clamp-2">{p.name}</h4>
                          <span className="text-red-600 font-black text-lg md:text-xl block">{formatPrice(p.price)}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-bold text-slate-500 uppercase tracking-widest bg-white sticky left-0 z-10 border-r border-slate-100">Danh mục</td>
                      {compareList.map((p) => (
                        <td key={p.id} className="p-4 text-slate-900 font-bold">
                          {p.category || p.categories?.name || 'Nẹp Xây Dựng'}
                        </td>
                      ))}
                    </tr>

                    {/* Ma trận thuộc tính so sánh động do Admin cấu hình */}
                    {Array.from(new Set(compareList.flatMap(p => {
                      if (Array.isArray(p.compareFields) && p.compareFields.length > 0) {
                        return p.compareFields.map((f: any) => String(f.key)).filter(Boolean);
                      }
                      return ['Chất liệu', 'Quy cách / Kích thước', 'Màu sắc / Bề mặt', 'Xuất xứ', 'Bảo hành', 'Ứng dụng'];
                    }))).map((keyName: string) => (
                      <tr key={keyName} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4 font-bold text-slate-500 uppercase tracking-widest bg-white sticky left-0 z-10 border-r border-slate-100">
                          {keyName}
                        </td>
                        {compareList.map((p) => {
                          let val = '---';
                          if (Array.isArray(p.compareFields)) {
                            const found = p.compareFields.find((f: any) => f.key === keyName);
                            if (found && found.value) val = found.value;
                          } else if (p.compareAttrs) {
                            if (keyName.includes('Chất liệu')) val = p.compareAttrs.material || val;
                            else if (keyName.includes('Quy cách')) val = p.compareAttrs.dimensions || val;
                            else if (keyName.includes('Màu sắc')) val = p.compareAttrs.color || val;
                            else if (keyName.includes('Xuất xứ')) val = p.compareAttrs.origin || val;
                            else if (keyName.includes('Bảo hành')) val = p.compareAttrs.warranty || val;
                            else if (keyName.includes('Ứng dụng')) val = p.compareAttrs.application || val;
                          }
                          return (
                            <td key={p.id} className="p-4 text-slate-700">
                              {val}
                            </td>
                          );
                        })}
                      </tr>
                    ))}

                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-bold text-slate-500 uppercase tracking-widest bg-white sticky left-0 z-10 border-r border-slate-100">Tình trạng</td>
                      {compareList.map((p) => (
                        <td key={p.id} className="p-4">
                          <div className="flex items-center gap-1.5 text-emerald-600 font-extrabold">
                            <Check size={16} /> Còn hàng sẵn kho
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-4 md:p-6 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl flex justify-end shrink-0">
              <button 
                onClick={() => setIsCompareModalOpen(false)}
                className="px-6 md:px-8 py-2.5 md:py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-colors shadow-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
