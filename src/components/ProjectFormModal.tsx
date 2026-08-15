import React, { useState, useEffect, useRef } from 'react';
import { X, UploadCloud, Image as ImageIcon, Sparkles, Plus, Trash2, Check } from 'lucide-react';
import MediaPickerModal from './MediaPickerModal';
import { supabase } from '../supabaseClient';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const PRESET_CATEGORIES = [
  'Chung cư cao cấp',
  'Trung tâm thương mại',
  'Khu đô thị / Resort',
  'Nhà xưởng công nghiệp',
  'Biệt thự / Nhà phố cao cấp',
  'Bệnh viện / Trường học',
  'Công trình hạ tầng giao thông'
];

export default function ProjectFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData
}: ProjectFormModalProps) {
  const [formData, setFormData] = useState({
    id: null as any,
    title: '',
    category: 'Chung cư cao cấp',
    customCategory: '',
    location: '',
    scale: '',
    image: '',
    materials: '',
    description: ''
  });

  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      const isPreset = PRESET_CATEGORIES.includes(initialData.category);
      setFormData({
        id: initialData.id,
        title: initialData.title || '',
        category: isPreset ? initialData.category : 'custom',
        customCategory: isPreset ? '' : initialData.category || '',
        location: initialData.location || '',
        scale: initialData.scale || '',
        image: initialData.image || initialData.image_url || '',
        materials: Array.isArray(initialData.materials) ? initialData.materials.join(', ') : (initialData.materials || ''),
        description: initialData.description || ''
      });
      setIsCustomCategory(!isPreset);
    } else {
      setFormData({
        id: null,
        title: '',
        category: 'Chung cư cao cấp',
        customCategory: '',
        location: '',
        scale: '',
        image: '',
        materials: '',
        description: ''
      });
      setIsCustomCategory(false);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'custom') {
      setIsCustomCategory(true);
      setFormData(prev => ({ ...prev, category: 'custom' }));
    } else {
      setIsCustomCategory(false);
      setFormData(prev => ({ ...prev, category: val }));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // 1. Try uploading to Supabase Storage
      const fileName = `project-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const { error } = await supabase.storage.from('product-media').upload(fileName, file);

      if (!error) {
        const { data: { publicUrl } } = supabase.storage.from('product-media').getPublicUrl(fileName);
        setFormData(prev => ({ ...prev, image: publicUrl }));
      } else {
        // Fallback to FileReader base64 if storage upload restricted
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setFormData(prev => ({ ...prev, image: event.target!.result as string }));
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.warn('Lỗi upload ảnh dự án:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.location) {
      alert('Vui lòng điền Tên dự án và Vị trí!');
      return;
    }

    const finalCategory = isCustomCategory ? (formData.customCategory || 'Dự án khác') : formData.category;
    const materialsArr = typeof formData.materials === 'string'
      ? formData.materials.split(',').map(m => m.trim()).filter(Boolean)
      : formData.materials;

    onSubmit({
      id: formData.id || Date.now(),
      title: formData.fullName || formData.title,
      category: finalCategory,
      location: formData.location,
      scale: formData.scale,
      image: formData.image,
      materials: materialsArr,
      description: formData.description
    });
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-100 animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Sparkles size={18} className="text-red-600" />
              {formData.id ? 'Chỉnh Sửa Dự Án Thi Công' : 'Thêm Dự Án Thi Công Mới'}
            </h3>
            <button 
              onClick={onClose} 
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
            
            {/* 1. Ảnh Đại Diện Dự Án (Visual Drag & Drop / Media Picker) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Hình Ảnh Đại Diện Dự Án (Khuyên dùng tỷ lệ 16:9) *
              </label>

              {formData.image ? (
                <div className="relative rounded-2xl border border-slate-200 overflow-hidden group bg-slate-900 aspect-video flex items-center justify-center shadow-md">
                  <img src={formData.image} alt="Project Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs rounded-xl shadow-md transition-colors"
                    >
                      Đổi ảnh khác
                    </button>
                    <button 
                      type="button"
                      onClick={() => setIsMediaPickerOpen(true)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                    >
                      Thư viện Media
                    </button>
                    <button 
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition-colors"
                      title="Xóa ảnh"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 bg-slate-50 flex flex-col items-center justify-center gap-3 hover:border-red-400 hover:bg-red-50/50 transition-colors aspect-video">
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400">
                    <UploadCloud size={24} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-800">Tải ảnh dự án lên từ thiết bị</p>
                    <p className="text-xs text-slate-500 mt-0.5">Hỗ trợ JPG, PNG, WEBP (Tối đa 10MB)</p>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-sm transition-colors cursor-pointer"
                    >
                      Chọn file từ máy
                    </button>
                    <button 
                      type="button"
                      onClick={() => setIsMediaPickerOpen(true)}
                      className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-xs shadow-sm transition-colors cursor-pointer"
                    >
                      Chọn từ Thư viện
                    </button>
                  </div>
                </div>
              )}

              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept="image/*" 
                className="hidden" 
              />
              
              {/* Optional URL input fallback */}
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Hoặc dán URL:</span>
                <input 
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* 2. Tên Dự Án */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tên Công Trình / Dự Án *
              </label>
              <input 
                type="text" 
                required
                value={formData.title} 
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ví dụ: Tổ Hợp Tòa Nhà S-Sky Tower" 
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium"
              />
            </div>

            {/* 3. Loại Hình Công Trình (Flex Combobox) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Loại Hình Công Trình *
                </label>
                <select 
                  value={formData.category}
                  onChange={handleCategoryChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer"
                >
                  {PRESET_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="custom">✏️ Tự nhập loại hình khác...</option>
                </select>

                {isCustomCategory && (
                  <input 
                    type="text"
                    required
                    value={formData.customCategory}
                    onChange={(e) => setFormData(prev => ({ ...prev, customCategory: e.target.value }))}
                    placeholder="Nhập loại hình dự án mới (VD: Khách sạn 5 sao...)"
                    className="w-full mt-2 px-4 py-2.5 rounded-xl border border-red-200 bg-red-50/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Vị Trí / Địa Điểm *
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.location} 
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Ví dụ: Quận 2, TP. Hồ Chí Minh" 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium"
                />
              </div>
            </div>

            {/* 4. Quy Mô Công Trình */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Quy Mô Công Trình
              </label>
              <input 
                type="text" 
                value={formData.scale} 
                onChange={(e) => setFormData(prev => ({ ...prev, scale: e.target.value }))}
                placeholder="Ví dụ: 38 Tầng - 1,200 Căn hộ (hoặc 50,000 m² sàn)" 
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium"
              />
            </div>

            {/* 5. Vật Tư SBUILD Cung Ứng */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Vật Tư SBUILD Cung Ứng (Nhập các mục phân cách bằng dấu phẩy)
              </label>
              <input 
                type="text" 
                value={formData.materials} 
                onChange={(e) => setFormData(prev => ({ ...prev, materials: e.target.value }))}
                placeholder="Ví dụ: Nẹp nhôm T20, Băng cản nước V200, Phụ kiện giàn giáo..." 
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium"
              />
            </div>

            {/* 6. Mô Tả Dự Án */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Mô Tả Tóm Tắt Giải Pháp
              </label>
              <textarea 
                rows={3} 
                value={formData.description} 
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Nêu tóm tắt giải pháp vật tư SBUILD đã triển khai cho công trình này..." 
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium resize-none"
              />
            </div>

            {/* Submit Bar */}
            <div className="pt-4 border-t border-slate-100 flex gap-3 shrink-0">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button 
                type="submit" 
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-red-500/25 transition-all cursor-pointer"
              >
                {formData.id ? 'Lưu Cập Nhật Dự Án' : 'Thêm Dự Án Mới'}
              </button>
            </div>
          </form>

        </div>
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal 
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={(urls) => {
          if (urls.length > 0) {
            setFormData(prev => ({ ...prev, image: urls[0] }));
          }
          setIsMediaPickerOpen(false);
        }}
      />
    </>
  );
}
