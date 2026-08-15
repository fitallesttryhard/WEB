import React from 'react';
import { X, Check, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface ProductComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: any[];
  onRemoveFromCompare: (id: string | number) => void;
}

export default function ProductComparisonModal({
  isOpen,
  onClose,
  products,
  onRemoveFromCompare
}: ProductComparisonModalProps) {
  const { addToCart } = useCart();

  if (!isOpen || products.length === 0) return null;

  const formatPrice = (price: number) => {
    if (!price || price === 0) return 'Liên hệ báo giá';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-100 animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50">
          <div>
            <span className="text-xs font-bold text-red-600 uppercase tracking-widest">Bàn cân thông số</span>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
              So Sánh Sản Phẩm Vật Tư ({products.length})
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body / Comparison Table */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr>
                  <th className="w-44 p-4 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50 rounded-l-xl">
                    Tiêu chí
                  </th>
                  {products.map((prod) => (
                    <th key={prod.id} className="p-4 min-w-[220px] align-top relative group border-l border-slate-100">
                      <button 
                        onClick={() => onRemoveFromCompare(prod.id)}
                        className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Bỏ so sánh"
                      >
                        <X size={14} />
                      </button>

                      <div className="w-24 h-24 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden mb-3">
                        <img 
                          src={prod.thumbnail_url || prod.image_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop'} 
                          alt={prod.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">{prod.name}</h4>
                      <p className="text-red-600 font-black text-base mt-1">
                        {formatPrice(prod.sale_price || prod.original_price || prod.regular_price || 0)}
                      </p>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {/* Row: Danh mục */}
                <tr>
                  <td className="p-4 font-bold text-slate-700 bg-slate-50/50">Danh mục / Loại</td>
                  {products.map((prod) => (
                    <td key={prod.id} className="p-4 text-slate-600 border-l border-slate-100">
                      {prod.categories?.name || 'Vật tư xây dựng'}
                    </td>
                  ))}
                </tr>

                {/* Row: Tình trạng kho */}
                <tr>
                  <td className="p-4 font-bold text-slate-700 bg-slate-50/50">Tình trạng kho</td>
                  {products.map((prod) => (
                    <td key={prod.id} className="p-4 border-l border-slate-100">
                      <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full text-[11px] ${
                        prod.stock_status === 'out_of_stock' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                      }`}>
                        <Check size={12} />
                        {prod.stock_status === 'out_of_stock' ? 'Hết hàng' : 'Sẵn kho giao ngay'}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Row: Mã SKU */}
                <tr>
                  <td className="p-4 font-bold text-slate-700 bg-slate-50/50">Mã SKU / Quy cách</td>
                  {products.map((prod) => (
                    <td key={prod.id} className="p-4 text-slate-600 border-l border-slate-100">
                      {prod.sku || 'SBUILD-STD'}
                    </td>
                  ))}
                </tr>

                {/* Row: Mô tả ngắn */}
                <tr>
                  <td className="p-4 font-bold text-slate-700 bg-slate-50/50">Đặc tính kỹ thuật</td>
                  {products.map((prod) => (
                    <td key={prod.id} className="p-4 text-slate-600 border-l border-slate-100 leading-relaxed">
                      {prod.seo_description || 'Chuẩn kiểm định chất lượng thi công công trình.'}
                    </td>
                  ))}
                </tr>

                {/* Row: Hành động */}
                <tr>
                  <td className="p-4 font-bold text-slate-700 bg-slate-50/50">Hành động</td>
                  {products.map((prod) => {
                    const price = prod.sale_price || prod.original_price || prod.regular_price || 0;
                    return (
                      <td key={prod.id} className="p-4 border-l border-slate-100">
                        <button
                          onClick={() => addToCart({
                            id: prod.id,
                            name: prod.name,
                            price: price,
                            image: prod.thumbnail_url || prod.image_url || '',
                            quantity: 1
                          })}
                          className="w-full py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <ShoppingBag size={14} />
                          Nhận báo giá
                        </button>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center text-xs">
          <span className="text-slate-500 font-medium">* So sánh dựa trên thông số niêm yết từ nhà sản xuất SBUILD.</span>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
