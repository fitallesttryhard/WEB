import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

export default function CartDrawer() {
  const { isDrawerOpen, closeDrawer, items, removeFromCart, updateQuantity, cartTotal } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={closeDrawer}
      />
      
      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
          <h2 className="text-xl font-black text-gray-900 uppercase flex items-center gap-2">
            <ShoppingBag size={20} />
            Giỏ hàng của bạn
          </h2>
          <button 
            onClick={closeDrawer}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 gap-4">
              <ShoppingBag size={48} className="text-gray-200" />
              <p>Giỏ hàng của bạn đang trống.</p>
              <button 
                onClick={closeDrawer}
                className="mt-2 px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-lg transition-colors text-sm"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.id}-${item.size || ''}`} className="flex gap-4 group">
                <div className="w-20 h-20 shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2">{item.name}</h3>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-600 p-1 rounded-md transition-colors"
                      title="Xóa"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {item.size && (
                    <span className="text-xs font-bold text-gray-500 uppercase mt-1">Kích thước: {item.size}</span>
                  )}
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3 border border-gray-200 rounded-md p-1">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="text-gray-500 hover:text-gray-900 w-6 h-6 flex items-center justify-center transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="text-gray-500 hover:text-gray-900 w-6 h-6 flex items-center justify-center transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="font-black text-red-600 text-sm">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-5 bg-gray-50 shrink-0 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-bold uppercase text-sm">Tạm tính</span>
              <span className="text-xl font-black text-red-600">{formatPrice(cartTotal)}</span>
            </div>
            <button className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-black uppercase tracking-widest transition-colors shadow-lg shadow-red-200/50">
              Thanh toán
            </button>
          </div>
        )}
      </div>
    </>
  );
}
