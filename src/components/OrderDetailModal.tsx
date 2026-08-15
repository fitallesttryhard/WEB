import React, { useRef } from 'react';
import { X, Printer, CheckCircle2, Clock, Truck, Package, MapPin, Phone, Mail, User, Calendar, CreditCard } from 'lucide-react';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  onUpdateStatus: (id: string, newStatus: string) => void;
}

export default function OrderDetailModal({ isOpen, onClose, order, onUpdateStatus }: OrderDetailModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const getStatusInfo = (status: string) => {
    switch(status) {
      case 'pending': return { icon: <Clock size={20}/>, text: 'Chờ xử lý', color: 'text-orange-600', bg: 'bg-orange-100', border: 'border-orange-200' };
      case 'processing': return { icon: <Package size={20}/>, text: 'Đang đóng gói', color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-200' };
      case 'shipped': return { icon: <Truck size={20}/>, text: 'Đang giao hàng', color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-200' };
      case 'paid': 
      case 'completed': return { icon: <CheckCircle2 size={20}/>, text: 'Đã hoàn thành', color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-200' };
      default: return { icon: <Clock size={20}/>, text: 'Chờ xử lý', color: 'text-gray-600', bg: 'bg-gray-100', border: 'border-gray-200' };
    }
  };

  const currentStatus = getStatusInfo(order.status);
  
  // Define all statuses for timeline
  const statuses = [
    { id: 'pending', label: 'Chờ xử lý', icon: Clock },
    { id: 'processing', label: 'Đóng gói', icon: Package },
    { id: 'shipped', label: 'Đang giao', icon: Truck },
    { id: 'completed', label: 'Hoàn thành', icon: CheckCircle2 },
  ];

  const getCurrentStepIndex = () => {
    if (order.status === 'completed' || order.status === 'paid') return 3;
    if (order.status === 'shipped') return 2;
    if (order.status === 'processing') return 1;
    return 0;
  };
  const currentStep = getCurrentStepIndex();

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 overflow-y-auto print:bg-white print:p-0 print:block">
      {/* Modal Container */}
      <div 
        ref={printRef}
        className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 print:max-h-none print:shadow-none print:w-full print:max-w-none print:rounded-none"
      >
        
        {/* Header - Hidden in print and replaced with print-specific header if needed, but we can keep it clean */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white print:hidden">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
              <X size={24} />
            </button>
            <div className="w-px h-6 bg-gray-200"></div>
            <div>
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                Chi tiết Đơn hàng <span className="text-red-600">#{order.id}</span>
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handlePrint}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
            >
              <Printer size={16} />
              In hóa đơn
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 print:bg-white print:p-0">
          
          {/* Print Header (Only visible in print) */}
          <div className="hidden print:flex justify-between items-start mb-8 border-b pb-6">
            <div>
              <h1 className="text-3xl font-black text-gray-900">SBUILD</h1>
              <p className="text-gray-500 mt-1">Giải pháp Vật tư Xây dựng</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-gray-900">HÓA ĐƠN BÁN HÀNG</h2>
              <p className="text-gray-600 mt-1">Mã đơn: <strong>{order.id}</strong></p>
              <p className="text-gray-600">Ngày tạo: {order.date}</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column */}
            <div className="flex-1 space-y-6">
              
              {/* Order Status Timeline (Hidden in print) */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 print:hidden">
                <h3 className="text-base font-bold text-gray-900 mb-6">Trạng thái Đơn hàng</h3>
                <div className="relative flex justify-between items-center">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full z-0"></div>
                  <div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-green-500 rounded-full z-0 transition-all duration-500"
                    style={{ width: `${(currentStep / (statuses.length - 1)) * 100}%` }}
                  ></div>
                  
                  {statuses.map((step, index) => {
                    const isCompleted = index <= currentStep;
                    const isCurrent = index === currentStep;
                    const Icon = step.icon;
                    return (
                      <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                          isCompleted ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-200 text-gray-400'
                        } ${isCurrent ? 'ring-4 ring-green-500/20' : ''}`}>
                          <Icon size={18} />
                        </div>
                        <span className={`text-xs font-bold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 print:border-none print:shadow-none print:p-0">
                <h3 className="text-base font-bold text-gray-900 mb-4 print:mb-2">Sản phẩm Đã đặt</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-200 text-sm text-gray-500">
                        <th className="pb-3 font-semibold">Sản phẩm</th>
                        <th className="pb-3 font-semibold text-center">Đơn giá</th>
                        <th className="pb-3 font-semibold text-center">SL</th>
                        <th className="pb-3 font-semibold text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {order.items && order.items.length > 0 ? order.items.map((item: any, idx: number) => (
                        <tr key={idx}>
                          <td className="py-4 flex items-center gap-3">
                            <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-gray-50 print:hidden" />
                            <div>
                              <p className="font-bold text-gray-900 text-sm">{item.name}</p>
                              {item.variant && <p className="text-xs text-gray-500">{item.variant}</p>}
                            </div>
                          </td>
                          <td className="py-4 text-center font-medium text-sm text-gray-600">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                          </td>
                          <td className="py-4 text-center font-bold text-gray-900 text-sm">{item.quantity}</td>
                          <td className="py-4 text-right font-bold text-red-600 text-sm">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-gray-500 font-medium">Không có chi tiết sản phẩm</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 border-t border-gray-100 pt-4 flex flex-col gap-2 items-end">
                  <div className="flex justify-between w-full sm:w-1/2 text-sm text-gray-600">
                    <span>Tạm tính:</span>
                    <span className="font-medium">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.amount - (order.shippingFee || 0))}</span>
                  </div>
                  <div className="flex justify-between w-full sm:w-1/2 text-sm text-gray-600">
                    <span>Phí giao hàng:</span>
                    <span className="font-medium">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.shippingFee || 0)}</span>
                  </div>
                  <div className="flex justify-between w-full sm:w-1/2 text-lg font-black text-gray-900 mt-2">
                    <span>Tổng cộng:</span>
                    <span className="text-red-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.amount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="w-full lg:w-80 space-y-6">
              
              {/* Action/Status Panel (Hidden in print) */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 print:hidden">
                <h3 className="text-base font-bold text-gray-900 mb-4">Cập nhật Trạng thái</h3>
                <select 
                  value={order.status}
                  onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer mb-4"
                >
                  <option value="pending">Chờ xử lý</option>
                  <option value="processing">Đang đóng gói</option>
                  <option value="shipped">Đang giao hàng</option>
                  <option value="completed">Đã hoàn thành / Đã thanh toán</option>
                </select>
                <div className={`p-4 rounded-xl border flex items-start gap-3 ${currentStatus.bg} ${currentStatus.border}`}>
                  <div className={`${currentStatus.color} mt-0.5`}>{currentStatus.icon}</div>
                  <div>
                    <p className={`text-sm font-bold ${currentStatus.color}`}>Trạng thái hiện tại</p>
                    <p className="text-xs font-medium text-gray-700 mt-1">{currentStatus.text}</p>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 print:border-none print:shadow-none print:p-0">
                <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User size={18} className="text-gray-400" />
                  Thông tin Khách hàng
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-sm">
                    <User size={16} className="text-gray-400 shrink-0 mt-0.5" />
                    <span className="font-medium text-gray-900">{order.customer}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <Phone size={16} className="text-gray-400 shrink-0 mt-0.5" />
                    <span className="text-gray-600">{order.phone || '0901234567'}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <Mail size={16} className="text-gray-400 shrink-0 mt-0.5" />
                    <span className="text-gray-600">{order.email || 'khachhang@email.com'}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 print:border-none print:shadow-none print:p-0">
                <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin size={18} className="text-gray-400" />
                  Địa chỉ Giao hàng
                </h3>
                <div className="text-sm text-gray-600 leading-relaxed">
                  <p className="font-medium text-gray-900 mb-1">{order.customer}</p>
                  <p>{order.address || '123 Đường Điện Biên Phủ, Phường 15, Quận Bình Thạnh, TP. Hồ Chí Minh'}</p>
                </div>
              </div>

              {/* Payment / Order Type Info */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 print:border-none print:shadow-none print:p-0">
                <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard size={18} className="text-gray-400" />
                  Hình thức mua hàng
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Phương thức:</span>
                    <span className="font-bold text-gray-900">{order.paymentMethod || 'Yêu cầu Báo giá'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Ngày đặt:</span>
                    <span className="font-medium text-gray-900">{order.date}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
