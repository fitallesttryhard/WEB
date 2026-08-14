import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Star, Heart, ShieldCheck, 
  Truck, CreditCard, Plus, Minus, ShoppingBag,
  Facebook, Twitter, Link as LinkIcon, Loader2
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../supabaseClient';

export default function ProductDetail() {
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('mô tả chi tiết');
  const { addToCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
    async function loadProduct() {
      setLoading(true);
      try {
        const hash = window.location.hash || '';
        const searchStr = hash.includes('?') ? hash.split('?')[1] : '';
        const params = new URLSearchParams(searchStr);
        const productId = params.get('id');

        let prodData = null;
        if (productId) {
          const { data } = await supabase
            .from('products')
            .select('*, categories(name)')
            .eq('id', productId)
            .maybeSingle();
          prodData = data;
        }

        if (!prodData) {
          // Default to latest published product if no ID specified or invalid
          const { data } = await supabase
            .from('products')
            .select('*, categories(name)')
            .eq('status', 'published')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
          prodData = data;
        }

        setProduct(prodData);

        // Fetch related products
        const { data: related } = await supabase
          .from('products')
          .select('*, categories(name)')
          .eq('status', 'published')
          .limit(4);

        if (related) {
          setRelatedProducts(related.filter(p => p.id !== prodData?.id).slice(0, 4));
        }
      } catch (err) {
        console.error('Lỗi khi tải chi tiết sản phẩm:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, []);

  const formatPrice = (price: number) => {
    if (!price || price === 0) return 'Liên hệ báo giá';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex justify-center items-center">
        <Loader2 className="animate-spin text-red-600" size={40} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-32 text-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Sản phẩm không tồn tại</h2>
        <p className="text-gray-500 mb-6">Sản phẩm bạn đang tìm kiếm hiện không có hoặc đã bị xóa.</p>
        <a href="#products" className="inline-block bg-red-600 text-white font-bold px-6 py-2.5 rounded-xl">
          Xem tất cả sản phẩm
        </a>
      </div>
    );
  }

  const galleryImages = [
    product.thumbnail_url || product.image_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop',
    ...(Array.isArray(product.gallery_urls) ? product.gallery_urls : [])
  ].filter(Boolean);

  const categoryName = product.categories?.name || 'Phụ kiện xây dựng';
  const price = product.sale_price || product.original_price || product.regular_price || 0;
  const oldPrice = product.sale_price ? (product.original_price || product.regular_price) : null;

  const handlePrevImage = () => {
    setActiveImageIdx((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIdx((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-white min-h-screen pt-[80px] pb-28 lg:pb-0">
      
      {/* 1. Breadcrumb */}
      <div className="bg-gray-50/50 py-8 lg:py-12 mb-8 lg:mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">{product.name}</h1>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 font-medium">
            <a href="#" className="hover:text-red-600 transition-colors">Trang chủ</a>
            <span>/</span>
            <a href="#products" className="hover:text-red-600 transition-colors">Sản phẩm</a>
            <span>/</span>
            <span className="text-gray-900">{categoryName}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        
        {/* 2. Main Info Block */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-16 mb-12 lg:mb-20">
          
          {/* Left Column: Image Gallery */}
          <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative aspect-square w-full bg-gray-50 rounded-2xl overflow-hidden group border border-gray-100">
              <img 
                src={galleryImages[activeImageIdx]} 
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              {galleryImages.length > 1 && (
                <>
                  <button 
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white text-gray-800 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <ChevronRight className="rotate-180" size={20} />
                  </button>
                  <button 
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white text-gray-800 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>
            
            {/* Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative aspect-square rounded-xl overflow-hidden bg-gray-50 border-2 transition-all duration-300 ${
                      activeImageIdx === idx 
                        ? 'border-red-600 opacity-100' 
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Details */}
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
              {categoryName}
            </span>
            
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-3xl md:text-4xl font-black text-gray-900">{product.name}</h1>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200 shrink-0">
                {product.stock_status === 'out_of_stock' ? 'Hết hàng' : 'Còn hàng'}
              </span>
            </div>
            
            {/* Price */}
            <div className="flex items-end gap-3 mb-6">
              <span className="text-3xl font-black text-red-600">{formatPrice(price)}</span>
              {oldPrice && (
                <span className="text-xl font-bold text-gray-400 line-through mb-1">{formatPrice(oldPrice)}</span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-gray-600 mb-8 leading-relaxed">
              {product.seo_description || product.description?.replace(/<[^>]*>?/gm, '').slice(0, 160) || 'Sản phẩm vật tư xây dựng cao cấp chuẩn kiểm định.'}
            </p>

            {/* Action Area */}
            <div className="flex flex-wrap items-center gap-4 mb-10 pb-10 border-b border-gray-100 relative">
              {/* Quantity */}
              <div className="flex items-center border border-gray-200 rounded-full h-12 w-32 bg-white shrink-0">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <input 
                  type="text" 
                  value={quantity} 
                  readOnly 
                  className="w-12 h-full text-center font-bold text-gray-900 bg-transparent outline-none"
                />
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 flex-1">
                <button 
                  onClick={() => addToCart({ 
                    id: product.id, 
                    name: product.name, 
                    price: price, 
                    image: galleryImages[0], 
                    quantity
                  })}
                  className="flex-1 h-12 px-6 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-full transition-colors text-sm lg:text-base whitespace-nowrap"
                >
                  Thêm vào giỏ
                </button>
                <a 
                  href="#contact"
                  className="flex-1 h-12 px-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition-colors shadow-sm text-sm lg:text-base flex items-center justify-center whitespace-nowrap"
                >
                  Liên hệ Báo giá
                </a>
              </div>
            </div>

            {/* Meta Info */}
            <div className="space-y-3 text-sm">
              <p>
                <span className="font-bold text-gray-900 w-16 inline-block">SKU:</span> 
                <span className="text-gray-500">{product.sku || 'N/A'}</span>
              </p>
              {product.tags && product.tags.length > 0 && (
                <p>
                  <span className="font-bold text-gray-900 w-16 inline-block">Tags:</span> 
                  <span className="text-gray-500">{Array.isArray(product.tags) ? product.tags.join(', ') : product.tags}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 3. Details Tabs */}
        <div className="mb-16 lg:mb-24">
          <div className="flex items-center justify-start sm:justify-center gap-6 md:gap-16 border-b border-gray-200 mb-8 lg:mb-10 overflow-x-auto">
            {['mô tả chi tiết', 'thông số kỹ thuật'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-base sm:text-lg font-bold capitalize transition-colors relative whitespace-nowrap shrink-0 ${
                  activeTab === tab 
                    ? 'text-gray-900' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-red-600 rounded-t-full"></div>
                )}
              </button>
            ))}
          </div>

          <div className="max-w-4xl mx-auto">
            {activeTab === 'mô tả chi tiết' && (
              <div 
                className="prose prose-lg max-w-none prose-p:text-gray-600 prose-li:text-gray-600 prose-headings:text-gray-900 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.description || '<p>Đang cập nhật thông tin mô tả chi tiết cho sản phẩm này.</p>' }}
              />
            )}
            {activeTab === 'thông số kỹ thuật' && (
              <div className="bg-slate-50/80 p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-sm">
                <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-600"></span>
                  Thông số kỹ thuật sản phẩm
                </h3>

                {Array.isArray(product.compareFields) && product.compareFields.length > 0 ? (
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                    {product.compareFields.map((field: any, idx: number) => (
                      <div key={idx} className={`grid grid-cols-12 p-4 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                        <div className="col-span-4 font-black text-xs uppercase tracking-wider text-slate-500 flex items-center">
                          {field.key}
                        </div>
                        <div className="col-span-8 font-bold text-sm text-slate-900">
                          {field.value || '—'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div 
                    className="prose prose-lg max-w-none text-gray-600 bg-white p-6 rounded-xl border border-slate-200"
                    dangerouslySetInnerHTML={{ __html: product.specs || '<p>Đang cập nhật thông số kỹ thuật cho sản phẩm này.</p>' }}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* 4. Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-20">
            <div className="text-center mb-10">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                Có thể bạn quan tâm
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase">
                Sản phẩm <span className="text-red-600">Liên quan</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProd) => (
                <a 
                  href={`#product?id=${relProd.id}`}
                  key={relProd.id}
                  onClick={() => window.location.hash = `#product?id=${relProd.id}`}
                  className="group flex flex-col bg-white rounded-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-gray-50 flex items-center justify-center">
                    <img 
                      src={relProd.thumbnail_url || relProd.image_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop'} 
                      alt={relProd.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-1.5">{relProd.categories?.name || categoryName}</span>
                    
                    <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                      {relProd.name}
                    </h3>
                    
                    <div className="mt-auto">
                      <span className="text-red-600 font-black text-lg">
                        {formatPrice(relProd.sale_price || relProd.original_price || relProd.regular_price || 0)}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
