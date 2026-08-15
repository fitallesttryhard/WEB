import React, { useState } from 'react';
import { X, FileDown, CheckCircle2, ShieldCheck, Loader2, Sparkles, Building2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface CatalogDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CatalogDownloadModal({ isOpen, onClose }: CatalogDownloadModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    projectType: 'Chung cư / Tòa nhà cao tầng'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      alert('Vui lòng nhập Họ tên và Số điện thoại để nhận Catalogue!');
      return;
    }

    setIsSubmitting(true);
    try {
      // Save lead into orders database with type lead
      await supabase.from('orders').insert([{
        customer: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        address: formData.projectType,
        amount: 0,
        status: 'pending',
        notes: `[TẢI CATALOGUE 2026] Loại công trình: ${formData.projectType}`,
        payment_method: 'Nhận Catalogue PDF'
      }]);
    } catch (err) {
      console.warn('Lưu lead nhận catalogue:', err);
    } finally {
      setIsSubmitting(false);
      setIsDownloaded(true);

      // Trigger automatic simulated download
      const element = document.createElement('a');
      const file = new Blob([
        `CATALOGUE SBUILD 2026 - GIẢI PHÁP VẬT TƯ XÂY DỰNG CAO CẤP\n\n` +
        `Cảm ơn quý khách ${formData.fullName} (SĐT: ${formData.phone}) đã quan tâm đến giải pháp nẹp & phụ kiện xây dựng SBUILD!\n\n` +
        `Chuyên viên kinh doanh SBUILD sẽ liên hệ gửi Bảng giá chiết khấu dự án trong thời gian sớm nhất.`
      ], { type: 'text/plain;charset=utf-8' });
      element.href = URL.createObjectURL(file);
      element.download = 'CATALOGUE_SBUILD_2026_VAT_TU_XAY_DUNG.txt';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative border border-slate-100 animate-in zoom-in-95 duration-200">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-6 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="bg-amber-400 text-slate-950 font-black text-[10px] uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles size={12} /> BẢN PHÁT HÀNH 2026
            </span>
          </div>

          <h3 className="text-xl font-black uppercase tracking-tight leading-snug">
            Tải Catalogue & Bảng Giá Vật Tư SBUILD
          </h3>
          <p className="text-xs text-white/80 mt-1 font-medium">
            Trọn bộ 200+ quy cách nẹp nhôm, nẹp inox, phụ kiện giàn giáo & băng cản nước chuẩn kiểm định.
          </p>
        </div>

        {/* Content Body */}
        {!isDownloaded ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Họ và tên của bạn *
              </label>
              <input 
                type="text" 
                required
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="Ví dụ: Nguyễn Văn A"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Số điện thoại (Nhận file Zalo) *
              </label>
              <input 
                type="tel" 
                required
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Ví dụ: 0901 234 567"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Loại hình công trình / Nhu cầu
              </label>
              <select 
                value={formData.projectType}
                onChange={(e) => setFormData(prev => ({ ...prev, projectType: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium cursor-pointer"
              >
                <option value="Chung cư / Tòa nhà cao tầng">Chung cư / Tòa nhà cao tầng</option>
                <option value="Biệt thự / Nhà phố cao cấp">Biệt thự / Nhà phố cao cấp</option>
                <option value="Công trình công nghiệp / Nhà xưởng">Công trình công nghiệp / Nhà xưởng</option>
                <option value="Đại lý / Nhà phân phối vật tư">Đại lý / Cửa hàng phân phối</option>
              </select>
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl font-black uppercase tracking-wider text-xs transition-all shadow-md shadow-red-500/25 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={16} />}
                TẢI CATALOGUE PDF VÀ BẢNG GIÁ NGAY
              </button>
            </div>

            <p className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1 font-medium">
              <ShieldCheck size={14} className="text-green-600" />
              SBUILD bảo mật tuyệt đối thông tin khách hàng.
            </p>
          </form>
        ) : (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 size={36} />
            </div>

            <div>
              <h4 className="text-xl font-black text-slate-900 uppercase">Đang Tải Catalogue...</h4>
              <p className="text-xs text-slate-600 mt-2 font-medium leading-relaxed">
                Cảm ơn <b>{formData.fullName}</b>! File Catalogue SBUILD 2026 đã tự động tải xuống thiết bị của bạn.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-left text-xs space-y-1.5">
              <p className="font-bold text-slate-800 flex items-center gap-1">
                <Building2 size={14} className="text-red-600" /> Hỗ trợ báo giá dự án:
              </p>
              <p className="text-slate-600">
                Chuyên viên SBUILD sẽ liên hệ lại qua SĐT <b>{formData.phone}</b> để gửi bảng báo giá chiết khấu theo khối lượng công trình.
              </p>
            </div>

            <button 
              onClick={onClose}
              className="w-full bg-slate-900 hover:bg-black text-white py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors cursor-pointer"
            >
              Hoàn tất & Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
