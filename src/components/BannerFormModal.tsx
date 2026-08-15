import React, { useState, useEffect } from 'react';
import { X, Save, UploadCloud, Image as ImageIcon, ToggleLeft, ToggleRight } from 'lucide-react';
import MediaPickerModal from './MediaPickerModal';

interface BannerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export default function BannerFormModal({ isOpen, onClose, onSubmit, initialData }: BannerFormModalProps) {
  const [formData, setFormData] = useState({
    id: null,
    image_url: '',
    heading: '',
    subheading: '',
    cta_text: '',
    cta_link: '',
    layout_type: 'standard',
    prop_1: 'Chuẩn CO/CQ Kiểm Định',
    prop_2: 'Giao Hàng Công Trình 24/7',
    prop_3: 'Bảo Hành Chính Hãng',
    status: true,
  });
  
  const [mediaPickerConfig, setMediaPickerConfig] = useState<{isOpen: boolean}>({ isOpen: false });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        image_url: initialData.image_url || initialData.image || '',
        heading: initialData.heading || '',
        subheading: initialData.subheading || '',
        cta_text: initialData.cta_text || '',
        cta_link: initialData.cta_link || '',
        layout_type: initialData.layout_type || 'standard',
        prop_1: initialData.prop_1 || 'Chuẩn CO/CQ Kiểm Định',
        prop_2: initialData.prop_2 || 'Giao Hàng Công Trình 24/7',
        prop_3: initialData.prop_3 || 'Bảo Hành Chính Hãng',
        status: initialData.status !== undefined ? initialData.status : true,
      });
    } else {
      setFormData({
        id: null,
        image_url: '',
        heading: '',
        subheading: '',
        cta_text: '',
        cta_link: '',
        layout_type: 'standard',
        prop_1: 'Chuẩn CO/CQ Kiểm Định',
        prop_2: 'Giao Hàng Công Trình 24/7',
        prop_3: 'Bảo Hành Chính Hãng',
        status: true,
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url) {
      alert('Vui lòng cung cấp hình ảnh nền cho banner!');
      return;
    }
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-gray-50/50">
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
            {initialData ? 'Chỉnh sửa Banner' : 'Thêm Banner mới'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <form id="banner-form" onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Cột trái: Form nhập liệu */}
              <div className="space-y-6">
                
                {/* Upload Ảnh nền */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Ảnh nền (Landscape 16:9) *</label>
                  {formData.image_url ? (
                    <div className="relative rounded-xl border border-gray-200 overflow-hidden group bg-gray-50 aspect-video flex items-center justify-center">
                      <img src={formData.image_url} alt="Banner Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          type="button"
                          onClick={() => setMediaPickerConfig({ isOpen: true })}
                          className="bg-white text-gray-700 hover:text-red-600 px-4 py-2 rounded-lg font-bold text-sm shadow-sm transition-colors"
                        >
                          Xóa / Đổi ảnh
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-xl p-8 bg-gray-50 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-red-400 hover:bg-red-50 transition-colors aspect-video"
                      onClick={() => setMediaPickerConfig({ isOpen: true })}
                    >
                      <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center">
                        <UploadCloud size={24} className="text-gray-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-gray-700">Kéo thả ảnh ngang vào đây</p>
                        <p className="text-xs text-gray-500 mt-1">Hoặc click để chọn file (Khuyến nghị: 1920x1080px)</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Nội dung chữ */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Tiêu đề chính (Heading)</label>
                    <input
                      type="text"
                      name="heading"
                      value={formData.heading}
                      onChange={handleChange}
                      placeholder="VD: Kiến tạo không gian sống đỉnh cao"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Mô tả phụ (Subheading)</label>
                    <input
                      type="text"
                      name="subheading"
                      value={formData.subheading}
                      onChange={handleChange}
                      placeholder="VD: Cùng Sbuild xây dựng tương lai vững chắc..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Nút Call to Action */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Chữ trên nút (CTA Text)</label>
                    <input
                      type="text"
                      name="cta_text"
                      value={formData.cta_text}
                      onChange={handleChange}
                      placeholder="VD: Xem dự án"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Chọn Kiểu Giao Diện (Layout Style) */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Kiểu giao diện Slide (Layout Style)</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, layout_type: 'standard' })}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-left flex flex-col justify-between ${
                        formData.layout_type === 'standard' ? 'border-red-600 bg-red-50/60 text-red-600 shadow-sm ring-1 ring-red-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span className="font-extrabold uppercase text-[11px]">1. Đầy đủ</span>
                      <span className="text-[10px] font-normal opacity-80 mt-1">Tiêu đề + 3 Thẻ cam kết chân slide</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, layout_type: 'minimal' })}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-left flex flex-col justify-between ${
                        formData.layout_type === 'minimal' ? 'border-red-600 bg-red-50/60 text-red-600 shadow-sm ring-1 ring-red-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span className="font-extrabold uppercase text-[11px]">2. Tối giản</span>
                      <span className="text-[10px] font-normal opacity-80 mt-1">Chỉ Tiêu đề + Mô tả + Nút bấm</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, layout_type: 'badge_pills' })}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-left flex flex-col justify-between ${
                        formData.layout_type === 'badge_pills' ? 'border-red-600 bg-red-50/60 text-red-600 shadow-sm ring-1 ring-red-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span className="font-extrabold uppercase text-[11px]">3. Huy hiệu</span>
                      <span className="text-[10px] font-normal opacity-80 mt-1">Badges nhỏ nằm trên Tiêu đề</span>
                    </button>
                  </div>
                </div>

                {/* Nhập nội dung 3 Cam kết / Huy hiệu nếu kiểu giao diện yêu cầu */}
                {formData.layout_type !== 'minimal' && (
                  <div className="p-4 border border-gray-100 rounded-xl bg-slate-50/50 space-y-3">
                    <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">Tùy chỉnh 3 câu Cam kết / Huy hiệu</p>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        name="prop_1"
                        value={formData.prop_1}
                        onChange={handleChange}
                        placeholder="Cam kết 1"
                        className="px-3 py-2 rounded-lg border border-gray-200 text-xs font-medium focus:outline-none focus:border-red-500"
                      />
                      <input
                        type="text"
                        name="prop_2"
                        value={formData.prop_2}
                        onChange={handleChange}
                        placeholder="Cam kết 2"
                        className="px-3 py-2 rounded-lg border border-gray-200 text-xs font-medium focus:outline-none focus:border-red-500"
                      />
                      <input
                        type="text"
                        name="prop_3"
                        value={formData.prop_3}
                        onChange={handleChange}
                        placeholder="Cam kết 3"
                        className="px-3 py-2 rounded-lg border border-gray-200 text-xs font-medium focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>
                )}

                {/* Trạng thái */}
                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                  <div>
                    <p className="text-sm font-bold text-gray-900">Trạng thái hiển thị</p>
                    <p className="text-xs text-gray-500 mt-0.5">Bật hoặc tắt banner này trên trang chủ</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, status: !formData.status})}
                    className={`transition-colors ${formData.status ? 'text-green-500' : 'text-gray-400'}`}
                  >
                    {formData.status ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
                  </button>
                </div>
              </div>

              {/* Cột phải: Live Preview */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <ImageIcon size={16} className="text-blue-500" />
                  Bản xem trước (Live Preview)
                </h3>
                
                <div className="flex-1 rounded-xl overflow-hidden shadow-lg border border-gray-200 relative bg-gray-900 min-h-[300px]">
                  {formData.image_url ? (
                    <img src={formData.image_url} alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                  ) : (
                    <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                      <ImageIcon size={48} className="text-gray-600" />
                    </div>
                  )}
                  
                  {/* Overlay giả lập */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-center bg-gradient-to-r from-black/80 to-transparent">
                    <div className="max-w-md">
                      {formData.heading ? (
                        <h2 className="text-3xl font-black text-white leading-tight mb-3">
                          {formData.heading}
                        </h2>
                      ) : (
                        <div className="h-8 w-3/4 bg-white/20 rounded mb-4 animate-pulse"></div>
                      )}
                      
                      {formData.subheading ? (
                        <p className="text-sm text-gray-300 font-medium leading-relaxed mb-6">
                          {formData.subheading}
                        </p>
                      ) : (
                        <div className="space-y-2 mb-6">
                          <div className="h-3 w-full bg-white/20 rounded animate-pulse"></div>
                          <div className="h-3 w-4/5 bg-white/20 rounded animate-pulse"></div>
                        </div>
                      )}
                      
                      {formData.cta_text && (
                        <div className="inline-block px-6 py-2.5 bg-red-600 text-white text-sm font-bold rounded-lg shadow-lg">
                          {formData.cta_text}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    form="banner-form"
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3.5 rounded-xl font-bold text-sm transition-all shadow-[0_4px_12px_rgba(220,38,38,0.2)] active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Save size={18} />
                    {initialData ? 'Cập nhật Banner' : 'Lưu Banner mới'}
                  </button>
                </div>
              </div>

            </div>
          </form>
        </div>
      </div>
      
      <MediaPickerModal 
        isOpen={mediaPickerConfig.isOpen}
        onClose={() => setMediaPickerConfig({ isOpen: false })}
        onSelect={(urls) => {
          if (urls.length > 0) setFormData({ ...formData, image_url: urls[0] });
        }}
        multiple={false}
      />
    </div>
  );
}
