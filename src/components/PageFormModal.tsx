import React, { useState, useEffect } from 'react';
import { X, Save, Image as ImageIcon, LayoutTemplate } from 'lucide-react';

interface PageFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export default function PageFormModal({ isOpen, onClose, onSubmit, initialData }: PageFormModalProps) {
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    slug: '',
    content: '',
    status: 'published',
    template: 'default',
    seoTitle: '',
    seoDescription: ''
  });
  
  const [isSlugEdited, setIsSlugEdited] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        title: initialData.title || '',
        slug: initialData.slug || '',
        content: initialData.content || '',
        status: initialData.status || 'published',
        template: initialData.template || 'default',
        seoTitle: initialData.seoTitle || '',
        seoDescription: initialData.seoDescription || ''
      });
      setIsSlugEdited(true);
    } else {
      setFormData({
        id: null,
        title: '',
        slug: '',
        content: '',
        status: 'published',
        template: 'default',
        seoTitle: '',
        seoDescription: ''
      });
      setIsSlugEdited(false);
    }
  }, [initialData, isOpen]);

  const toSlug = (str: string) => {
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'title' && !isSlugEdited) {
      setFormData({ ...formData, title: value, slug: toSlug(value) });
    } else if (name === 'slug') {
      setIsSlugEdited(true);
      setFormData({ ...formData, slug: toSlug(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      alert('Vui lòng nhập tiêu đề trang!');
      return;
    }
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-gray-50/50">
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
            {initialData ? 'Chỉnh sửa Trang tĩnh' : 'Thêm Trang tĩnh mới'}
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
          <form id="page-form" onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* Cột trái (75%) */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* Title */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tiêu đề trang *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Nhập tiêu đề trang tĩnh (vd: Giới thiệu công ty)..."
                    className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-xl font-black text-gray-900 placeholder:font-medium placeholder:text-gray-400"
                    required
                  />
                </div>

                {/* URL Slug */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Đường dẫn tĩnh (URL Slug)</label>
                  <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                    <span className="text-gray-500 font-medium text-sm">sbuild.vn/</span>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      placeholder="gioi-thieu"
                      className="flex-1 bg-transparent border-none focus:outline-none text-gray-900 font-bold text-sm"
                    />
                  </div>
                </div>

                {/* Content Editor */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nội dung trang</label>
                  <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-red-500/20 focus-within:border-red-500 transition-all">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center gap-2">
                      <button type="button" className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"><ImageIcon size={16} /></button>
                      <div className="w-px h-4 bg-gray-300 mx-1"></div>
                      <select className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer">
                        <option>Đoạn văn</option>
                        <option>Tiêu đề 2</option>
                        <option>Tiêu đề 3</option>
                      </select>
                    </div>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      placeholder="Viết nội dung trang tại đây. Hỗ trợ chèn HTML, iframe bản đồ, hình ảnh..."
                      rows={16}
                      className="w-full px-5 py-4 outline-none text-gray-800 text-sm leading-relaxed resize-y bg-white"
                    ></textarea>
                  </div>
                </div>
                
              </div>

              {/* Cột phải (25%) */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* Publish Action */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Save size={16} className="text-red-600" />
                    Xuất bản
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Trạng thái</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-bold text-gray-700 bg-gray-50"
                      >
                        <option value="published">Đã xuất bản (Public)</option>
                        <option value="draft">Bản nháp (Draft)</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      form="page-form"
                      className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-bold text-sm transition-all shadow-[0_4px_12px_rgba(220,38,38,0.2)] active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Save size={18} />
                      {initialData ? 'Cập nhật Trang' : 'Đăng Trang tĩnh'}
                    </button>
                  </div>
                </div>

                {/* Page Attributes */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <LayoutTemplate size={16} className="text-blue-600" />
                    Thuộc tính trang
                  </h3>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Mẫu giao diện (Template)</label>
                    <select
                      name="template"
                      value={formData.template}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-bold text-gray-700"
                    >
                      <option value="default">Giao diện mặc định</option>
                      <option value="contact">Trang Liên Hệ (Kèm Form)</option>
                      <option value="full-width">Trang Full-width (Không Sidebar)</option>
                    </select>
                    <p className="text-xs text-gray-400 mt-2 font-medium">Chọn mẫu bố cục phù hợp với mục đích của trang.</p>
                  </div>
                </div>

                {/* SEO Settings */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4">Tối ưu SEO</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tiêu đề SEO</label>
                      <input
                        type="text"
                        name="seoTitle"
                        value={formData.seoTitle}
                        onChange={handleChange}
                        placeholder="Tiêu đề hiển thị trên Google..."
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Mô tả SEO</label>
                      <textarea
                        name="seoDescription"
                        value={formData.seoDescription}
                        onChange={handleChange}
                        placeholder="Mô tả ngắn gọn về trang này..."
                        rows={3}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium resize-none"
                      ></textarea>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
