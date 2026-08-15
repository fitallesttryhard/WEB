import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, FileText, CheckCircle2, ArrowLeft, Send, PhoneCall, ShieldCheck, Loader2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../supabaseClient';

export default function CartDrawer() {
  const { isDrawerOpen, closeDrawer, items, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  
  const [step, setStep] = useState<'cart' | 'form' | 'success'>('cart');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCode, setOrderCode] = useState('');

  const [customerForm, setCustomerForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  });

  const formatPrice = (price: number) => {
    if (!price || price === 0) return 'Liên hệ báo giá';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerForm(prev => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setStep('cart');
    closeDrawer();
  };

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerForm.fullName || !customerForm.phone || !customerForm.address) {
      alert('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ công trình!');
      return;
    }

    setIsSubmitting(true);
    const generatedCode = `SBUILD-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderCode(generatedCode);

    try {
      // 1. Try to save order in database
      const dbPayload = {
        customer: customerForm.fullName,
        phone: customerForm.phone,
        email: customerForm.email,
        address: customerForm.address,
        amount: cartTotal,
        status: 'pending',
        notes: customerForm.notes,
        payment_method: 'Yêu cầu Báo giá',
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          variant: item.size || 'Mặc định',
          price: item.price,
          quantity: item.quantity,
          image: item.image
        }))
      };

      await supabase.from('orders').insert([dbPayload]);
    } catch (err) {
      console.warn('Lưu đơn hàng vào DB:', err);
    } finally {
      setIsSubmitting(false);
      clearCart();
      setStep('success');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs z-[60] transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={handleClose}
      />
      
      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0 bg-gray-50/50">
          <div className="flex items-center gap-2">
            {step === 'form' && (
              <button 
                onClick={() => setStep('cart')}
                className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors mr-1"
                title="Quay lại"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
              <FileText size={20} className="text-red-600" />
              {step === 'form' ? 'Thông tin yêu cầu báo giá' : step === 'success' ? 'Gửi yêu cầu thành công' : 'Danh sách nhận báo giá'}
            </h2>
          </div>

          <button 
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Info Banner: Clarify Quote Request Workflow */}
        {step !== 'success' && (
          <div className="px-5 py-3 bg-red-50/80 border-b border-red-100 text-red-900 text-xs font-semibold flex items-center gap-2.5">
            <ShieldCheck size={16} className="text-red-600 shrink-0" />
            <span>SBUILD tiếp nhận <b>Yêu cầu Báo Giá & Giao Hàng Công Trình</b> (Không áp dụng thanh toán trực tuyến).</span>
          </div>
        )}

        {/* STEP 1: CART ITEMS LIST */}
        {step === 'cart' && (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 gap-4 py-12">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <FileText size={32} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base mb-1">Danh sách đang trống</h3>
                    <p className="text-xs text-gray-500 max-w-xs">Chọn các sản phẩm vật tư cần báo giá để gửi yêu cầu cho SBUILD.</p>
                  </div>
                  <button 
                    onClick={handleClose}
                    className="mt-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors text-xs uppercase tracking-wider shadow-sm"
                  >
                    Xem sản phẩm
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={`${item.id}-${item.size || ''}`} className="flex gap-4 p-3 border border-gray-100 rounded-xl bg-white shadow-xs group hover:border-red-200 transition-colors">
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
                        <span className="text-[11px] font-bold text-gray-500 uppercase mt-1">Kích thước: {item.size}</span>
                      )}
                      <div className="flex items-center justify-between mt-auto pt-2">
                        <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-0.5 bg-gray-50">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="text-gray-500 hover:text-gray-900 w-6 h-6 flex items-center justify-center transition-colors"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="font-bold text-xs w-5 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="text-gray-500 hover:text-gray-900 w-6 h-6 flex items-center justify-center transition-colors"
                          >
                            <Plus size={13} />
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
              <div className="border-t border-gray-100 p-5 bg-gray-50/80 shrink-0 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-bold uppercase text-xs tracking-wider">Ước tính giá trị</span>
                  <span className="text-xl font-black text-red-600">{formatPrice(cartTotal)}</span>
                </div>
                <button 
                  onClick={() => setStep('form')}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all shadow-[0_4px_16px_rgba(220,38,38,0.25)] flex items-center justify-center gap-2 active:scale-95"
                >
                  <Send size={18} />
                  Gửi Yêu Cầu Báo Giá
                </button>
              </div>
            )}
          </>
        )}

        {/* STEP 2: FORM INPUT */}
        {step === 'form' && (
          <form onSubmit={handleSubmitQuote} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Họ và tên người nhận *
                </label>
                <input 
                  type="text" 
                  name="fullName"
                  required
                  value={customerForm.fullName}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Số điện thoại (Nhận báo giá / Zalo) *
                </label>
                <input 
                  type="tel" 
                  name="phone"
                  required
                  value={customerForm.phone}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: 0901 234 567"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Email (Để nhận bảng báo giá PDF)
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={customerForm.email}
                  onChange={handleInputChange}
                  placeholder="name@company.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Địa chỉ công trình / Giao hàng *
                </label>
                <input 
                  type="text" 
                  name="address"
                  required
                  value={customerForm.address}
                  onChange={handleInputChange}
                  placeholder="Địa điểm công trình hoặc địa chỉ nhận hàng..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Ghi chú yêu cầu (Quy cách, tiến độ giao hàng...)
                </label>
                <textarea 
                  name="notes"
                  rows={3}
                  value={customerForm.notes}
                  onChange={handleInputChange}
                  placeholder="Cần giao gấp trong tuần, quy cách riêng..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium resize-none"
                />
              </div>

              {/* Order Items Preview summary */}
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl space-y-2">
                <p className="text-xs font-bold text-gray-700 uppercase">Sản phẩm yêu cầu ({items.length}):</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  {items.map((item, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span className="truncate max-w-[220px]">{item.name} x{item.quantity}</span>
                      <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-100 p-5 bg-gray-50 shrink-0">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all shadow-[0_4px_16px_rgba(220,38,38,0.25)] flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                Gửi Yêu Cầu Mua Hàng & Báo Giá
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: SUCCESS STATE */}
        {step === 'success' && (
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-green-100 border-4 border-green-50 flex items-center justify-center text-green-600 animate-in zoom-in-50 duration-300 shadow-md">
              <CheckCircle2 size={44} />
            </div>

            <div>
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-md uppercase tracking-wider mb-2">
                Mã yêu cầu: #{orderCode}
              </span>
              <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                Gửi Yêu Cầu Thành Công!
              </h3>
              <p className="text-sm text-gray-600 mt-2 max-w-sm font-medium leading-relaxed">
                Cảm ơn quý khách <b>{customerForm.fullName}</b>! SBUILD đã nhận được yêu cầu mua hàng của bạn.
              </p>
            </div>

            <div className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 text-left space-y-2 text-xs">
              <p className="flex items-center gap-2 text-slate-700 font-bold">
                <PhoneCall size={14} className="text-red-600" />
                Quy trình tiếp theo:
              </p>
              <p className="text-slate-600 leading-relaxed">
                Chuyên viên kinh doanh SBUILD sẽ liên hệ lại qua SĐT <b>{customerForm.phone}</b> trong vòng <b>15 - 30 phút</b> để xác nhận chủng loại vật tư, ưu đãi chiết khấu và gửi bảng báo giá chi tiết.
              </p>
            </div>

            <button 
              onClick={handleClose}
              className="w-full bg-gray-900 hover:bg-black text-white py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors"
            >
              Hoàn tất & Đóng
            </button>
          </div>
        )}
      </div>
    </>
  );
}
