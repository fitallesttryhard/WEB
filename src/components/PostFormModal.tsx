import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Search, Image as ImageIcon, EyeOff, Monitor, Smartphone, Lock } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';
import MediaPickerModal from './MediaPickerModal';

interface PostFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  categories: { id: string; name: string }[];
  initialData?: any;
}

export default function PostFormModal({ isOpen, onClose, onSubmit, categories, initialData }: PostFormModalProps) {
  const [previewMode, setPreviewMode] = useState<'off' | 'desktop' | 'mobile'>('desktop');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    id: undefined as number | undefined,
    title: '',
    slug: '',
    categoryId: '',
    content: '',
    seoTitle: '',
    seoDescription: '',
    thumbnailUrl: '',
    status: 'published'
  });

  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const [mediaPickerConfig, setMediaPickerConfig] = useState<{isOpen: boolean}>({ isOpen: false });
  const tinyMCECallbackRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          id: initialData.id,
          title: initialData.title || '',
          slug: initialData.slug || '',
          categoryId: initialData.categoryId || '',
          content: initialData.content || '',
          seoTitle: initialData.seoTitle || '',
          seoDescription: initialData.seoDescription || '',
          thumbnailUrl: initialData.thumbnailUrl || initialData.image || '',
          status: initialData.status || 'published'
        });
        setIsSlugEdited(!!initialData.slug);
      } else {
        setFormData({
          id: undefined,
          title: '',
          slug: '',
          categoryId: '',
          content: '',
          seoTitle: '',
          seoDescription: '',
          thumbnailUrl: '',
          status: 'published'
        });
        setIsSlugEdited(false);
      }
    }
  }, [initialData, isOpen]);

  // Tự động cuộn đến phần tử trong Preview
  useEffect(() => {
    if (focusedField && previewMode !== 'off') {
      const el = document.getElementById(`preview-${focusedField}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [focusedField, previewMode]);

  const toSlug = (str: string) => {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setFormData(prev => ({
      ...prev,
      title: newTitle,
      slug: !isSlugEdited ? toSlug(newTitle) : prev.slug
    }));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugEdited(true);
    setFormData(prev => ({ ...prev, slug: toSlug(e.target.value) }));
  };

  const getSeoTitleColor = (length: number) => {
    if (length === 0) return 'text-gray-400';
    if (length >= 50 && length <= 60) return 'text-green-600';
    if (length > 60) return 'text-red-600';
    return 'text-orange-500';
  };

  const getSeoDescColor = (length: number) => {
    if (length === 0) return 'text-gray-400';
    if (length >= 120 && length <= 160) return 'text-green-600';
    if (length > 160) return 'text-red-600';
    return 'text-orange-500';
  };

  const handleThumbnailUpload = () => {
    setFocusedField('thumbnail');
    setMediaPickerConfig({ isOpen: true });
  };

  const handleMediaSelected = (urls: string[]) => {
    if (urls.length === 0) return;
    if (tinyMCECallbackRef.current) {
      tinyMCECallbackRef.current(urls[0], { title: 'Hình ảnh từ thư viện S-BUILD' });
      tinyMCECallbackRef.current = null;
    } else {
      setFormData(prev => ({ ...prev, thumbnailUrl: urls[0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getHighlightClass = (fieldName: string) => {
    if (!focusedField) return 'transition-all duration-300';
    if (focusedField === fieldName) {
      return 'ring-4 ring-blue-500/50 ring-offset-4 ring-offset-white scale-[1.02] transition-all duration-300 shadow-2xl z-10 bg-white rounded-xl relative';
    }
    return 'opacity-40 transition-all duration-300 pointer-events-none blur-[1px]';
  };

  const categoryName = categories.find(c => String(c.id || (c as any).slug || '') === String(formData.categoryId || ''))?.name || 'Danh mục bài viết';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-gray-50 animate-in fade-in duration-200 overflow-hidden">
      
      {/* HEADER */}
      <div className="h-16 px-6 border-b border-gray-200 flex items-center justify-between bg-white shadow-sm shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-xl transition-colors"
          >
            <X size={24} />
          </button>
          <div className="h-6 w-px bg-gray-200"></div>
          <div>
            <h2 className="text-lg font-black text-gray-900">{formData.id ? 'Chỉnh sửa Bài viết' : 'Thêm Bài viết mới'}</h2>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Toggle Group Preview Mode */}
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setPreviewMode('off')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${previewMode === 'off' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <EyeOff size={16} /> <span className="hidden xl:inline">Tắt Preview</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode('desktop')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${previewMode === 'desktop' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Monitor size={16} /> <span className="hidden xl:inline">MacBook</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode('mobile')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${previewMode === 'mobile' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Smartphone size={16} /> <span className="hidden xl:inline">iPhone 17</span>
            </button>
          </div>

          <div className="h-6 w-px bg-gray-200"></div>

          <button 
            type="button"
            onClick={() => {
              const draftData = { ...formData, status: 'draft' };
              setFormData(draftData);
              onSubmit(draftData);
            }}
            className="bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 px-5 py-2 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95"
          >
            Lưu Bản Nháp
          </button>

          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              const publishedData = { ...formData, status: 'published' };
              setFormData(publishedData);
              onSubmit(publishedData);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-black text-sm uppercase tracking-wide transition-all shadow-[0_4px_12px_rgba(37,99,235,0.2)] hover:shadow-[0_6px_16px_rgba(37,99,235,0.3)] active:scale-95"
          >
            {formData.id ? 'Cập nhật' : 'Xuất Bản'}
          </button>
        </div>
      </div>

      {/* BODY SPLIT-SCREEN */}
      <div className="flex-1 flex overflow-hidden relative bg-gray-50">
        
        {/* LEFT PANE: LIVE PREVIEW (Mockup) */}
        <div 
          className={`transition-all duration-500 ease-in-out overflow-hidden flex flex-col z-10 border-gray-200 ${
            previewMode === 'off' ? 'w-0 opacity-0 border-r-0' : 'w-1/2 opacity-100 border-r'
          }`}
        >
          <div className="flex-1 bg-gray-100 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] overflow-hidden flex items-center justify-center p-4 lg:p-8">
            
            {/* --- IPHONE 17 PRO MAX MOCKUP --- */}
            {previewMode === 'mobile' && (
              <div className="w-full max-w-[380px] aspect-[9/19.5] bg-black rounded-[3.5rem] p-3 shadow-2xl relative border border-[#2b2b2b] ring-1 ring-white/10">
                {/* Physical Buttons */}
                <div className="absolute top-[120px] -left-1.5 w-1.5 h-10 bg-[#1a1a1a] rounded-l-md border-y border-l border-white/10"></div>
                <div className="absolute top-[180px] -left-1.5 w-1.5 h-16 bg-[#1a1a1a] rounded-l-md border-y border-l border-white/10"></div>
                <div className="absolute top-[260px] -left-1.5 w-1.5 h-16 bg-[#1a1a1a] rounded-l-md border-y border-l border-white/10"></div>
                <div className="absolute top-[160px] -right-1.5 w-1.5 h-24 bg-[#1a1a1a] rounded-r-md border-y border-r border-white/10"></div>
                
                {/* Screen Content */}
                <div className="w-full h-full bg-white rounded-[2.75rem] overflow-y-auto custom-scrollbar relative flex flex-col">
                  {/* Screen Content */}
                  <div className="px-5 pb-5 pt-8 flex-1">
                    {/* Meta info */}
                    <div id="preview-categoryId" className={`flex flex-wrap items-center gap-2 mb-6 text-xs ${getHighlightClass('categoryId')}`}>
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 font-bold rounded-md">
                        {categoryName}
                      </span>
                      <span className="text-gray-400">&bull;</span>
                      <span className="text-gray-500 font-medium">Hôm nay</span>
                    </div>

                    {/* Title Preview */}
                    <div id="preview-title" className={`p-2 -mx-2 rounded-xl ${getHighlightClass('title')}`}>
                      <h1 className="text-3xl font-black text-gray-900 leading-[1.3]">
                        {formData.title || 'Tiêu đề bài viết hiển thị ở đây...'}
                      </h1>
                    </div>

                    {/* Thumbnail Preview */}
                    <div id="preview-thumbnail" className={`mt-6 mb-8 p-2 -mx-2 rounded-xl ${getHighlightClass('thumbnail')}`}>
                      <div className="aspect-[16/9] bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center">
                        {formData.thumbnailUrl ? (
                          <img src={formData.thumbnailUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-gray-400 flex flex-col items-center gap-3">
                            <ImageIcon className="w-12 h-12 opacity-50" />
                            <span className="text-xs font-medium">Ảnh đại diện</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content Preview */}
                    <div id="preview-content" className={`p-2 -mx-2 rounded-xl ${getHighlightClass('content')}`}>
                      <div className="prose prose-base max-w-none prose-headings:font-black prose-a:text-blue-600 hover:prose-a:text-blue-700 text-gray-700">
                        {formData.content ? (
                          <div dangerouslySetInnerHTML={{ __html: formData.content }} />
                        ) : (
                          <div className="h-40 flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-sm">
                            Nội dung chi tiết bài viết
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Safari Bottom Bar */}
                  <div className="sticky bottom-0 z-40 bg-[#f8f8f8]/90 backdrop-blur-md border-t border-gray-200/50 pb-5 pt-3 px-4 flex items-center justify-center shrink-0">
                    <div id="preview-slug" className={`w-full max-w-[260px] h-10 bg-white rounded-xl shadow-sm border border-gray-200/60 flex items-center justify-center text-[11px] font-medium text-gray-700 transition-all ${getHighlightClass('slug')}`}>
                      <Lock size={12} className="mr-1.5 text-gray-400" /> <span className="truncate px-2">sbuild.vn/tin-tuc/{formData.slug || 'bai-viet'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- MACBOOK PRO MOCKUP --- */}
            {previewMode === 'desktop' && (
              <div className="w-full max-w-5xl bg-[#1e1e1e] rounded-t-[1.5rem] rounded-b-lg p-3 shadow-2xl relative border-b-[12px] border-gray-300 ring-1 ring-black/10">
                {/* Screen */}
                <div className="w-full aspect-[16/10] bg-white rounded-lg overflow-y-auto custom-scrollbar relative flex flex-col">
                  {/* Browser Toolbar */}
                  <div className="sticky top-0 z-40 flex items-center h-12 bg-[#f5f5f5] border-b border-gray-200 px-4 shrink-0">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]"></div>
                    </div>
                    <div id="preview-slug" className={`flex-1 max-w-2xl mx-auto bg-white h-7 rounded-md shadow-sm border border-gray-200/80 flex items-center justify-center text-xs font-medium text-gray-500 transition-all ${getHighlightClass('slug')}`}>
                      <Lock size={12} className="mr-2 opacity-60" /> <span className="truncate">sbuild.vn/tin-tuc/{formData.slug || 'bai-viet-moi'}</span>
                    </div>
                  </div>

                  <div className="p-10 flex-1 max-w-3xl mx-auto w-full">
                    {/* Meta info */}
                    <div id="preview-categoryId" className={`flex flex-wrap items-center gap-3 mb-6 text-sm ${getHighlightClass('categoryId')}`}>
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 font-bold rounded-md">
                        {categoryName}
                      </span>
                      <span className="text-gray-400">&bull;</span>
                      <span className="text-gray-500 font-medium">Hôm nay</span>
                    </div>

                    {/* Title Preview */}
                    <div id="preview-title" className={`p-4 -mx-4 rounded-xl ${getHighlightClass('title')}`}>
                      <h1 className="text-4xl font-black text-gray-900 leading-[1.3]">
                        {formData.title || 'Tiêu đề bài viết hiển thị ở đây...'}
                      </h1>
                    </div>

                    {/* Thumbnail Preview */}
                    <div id="preview-thumbnail" className={`mt-8 mb-10 p-2 -mx-2 rounded-xl ${getHighlightClass('thumbnail')}`}>
                      <div className="aspect-[16/9] bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center">
                        {formData.thumbnailUrl ? (
                          <img src={formData.thumbnailUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-gray-400 flex flex-col items-center gap-3">
                            <ImageIcon className="w-16 h-16 opacity-50" />
                            <span className="text-sm font-medium">Ảnh đại diện bài viết</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content Preview */}
                    <div id="preview-content" className={`p-4 -mx-4 rounded-xl ${getHighlightClass('content')}`}>
                      <div className="prose prose-lg max-w-none prose-headings:font-black prose-a:text-blue-600 hover:prose-a:text-blue-700 text-gray-700">
                        {formData.content ? (
                          <div dangerouslySetInnerHTML={{ __html: formData.content }} />
                        ) : (
                          <div className="h-48 flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-base">
                            Nội dung chi tiết của bài viết sẽ hiển thị tại đây
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANE: FORM */}
        <div 
          className={`bg-white overflow-y-auto custom-scrollbar transition-all duration-500 ease-in-out relative z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.02)] ${
            previewMode === 'off' ? 'w-full' : 'w-1/2'
          }`}
        >
          <form 
            onSubmit={handleSubmit} 
            className={`p-8 lg:p-12 pb-32 transition-all duration-500 ease-in-out mx-auto grid gap-10 items-start ${
              previewMode === 'off' ? 'grid-cols-2 max-w-5xl w-full' : 'grid-cols-1 max-w-3xl w-full'
            }`}
          >
            
            {/* THÔNG TIN CƠ BẢN */}
            <div className="flex flex-col gap-6 h-fit">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-black text-sm">1</span>
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-wider">Thông tin bài viết</h3>
              </div>
              
              <div className="flex flex-col gap-6 pl-11">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tiêu đề bài viết <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required
                    value={formData.title}
                    onChange={handleTitleChange}
                    onFocus={() => setFocusedField('title')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Nhập tiêu đề..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base font-medium transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Slug (Đường dẫn SEO) <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required
                    value={formData.slug}
                    onChange={handleSlugChange}
                    onFocus={() => setFocusedField('slug')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="vd: tieu-de-bai-viet"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium text-gray-600 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Danh mục <span className="text-red-500">*</span></label>
                  <select 
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                    onFocus={() => setFocusedField('categoryId')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base font-medium transition-all text-gray-700 bg-white"
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* HÌNH ẢNH */}
            <div className="flex flex-col gap-6 h-fit" onClick={() => setFocusedField('thumbnail')}>
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-black text-sm">2</span>
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-wider">Ảnh Đại Diện</h3>
              </div>
              
              <div className="pl-11">
                <div 
                  onClick={handleThumbnailUpload}
                  className={`w-full aspect-[21/9] rounded-2xl border-2 border-dashed ${formData.thumbnailUrl ? 'border-gray-200 p-1.5' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'} transition-colors flex flex-col items-center justify-center cursor-pointer relative overflow-hidden group`}
                >
                  {formData.thumbnailUrl ? (
                    <>
                      <img src={formData.thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover rounded-xl" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                        <span className="text-white text-sm font-bold flex items-center gap-2"><Upload size={16}/> Đổi ảnh</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                        <Upload size={28} className="text-gray-400 group-hover:text-orange-500 transition-colors" />
                      </div>
                      <p className="text-sm font-bold text-gray-600">Click tải ảnh lên</p>
                      <p className="text-xs font-medium text-gray-400 mt-2">Tối đa 5MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* NỘI DUNG CHI TIẾT (Spans 2 cols when Off) */}
            <div className={`flex flex-col gap-6 h-fit ${previewMode === 'off' ? 'col-span-2' : ''}`}>
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-black text-sm">3</span>
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-wider">Nội dung chi tiết</h3>
              </div>
              
              <div className="pl-11">
                <div 
                  className="border border-gray-200 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all shadow-sm"
                >
                  <Editor
                    tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.3/tinymce.min.js"
                    value={formData.content}
                    onEditorChange={(content) => setFormData({ ...formData, content })}
                    onFocus={() => setFocusedField('content')}
                    onBlur={() => setFocusedField(null)}
                    init={{
                      height: 600,
                      menubar: false,
                      plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor',
                        'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime',
                        'media', 'table', 'code', 'help', 'wordcount', 'directionality'
                      ],
                      toolbar: [
                        'code | save print | undo redo | cut copy paste pastetext | searchreplace | ltr rtl | visualblocks',
                        'bold italic underline strikethrough subscript superscript | removeformat | numlist bullist outdent indent | blockquote alignleft aligncenter alignright alignjustify | link unlink anchor | image media table hr charmap',
                        'styles blocks fontfamily fontsize lineheight | forecolor backcolor | fullscreen help'
                      ].join(' | '),
                      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px; line-height: 1.6; }',
                      language: 'en',
                      file_picker_callback: (callback, _value, meta) => {
                        if (meta.filetype === 'image') {
                          tinyMCECallbackRef.current = callback;
                          setMediaPickerConfig({ isOpen: true });
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* SEO TỐI ƯU (Spans 2 cols when Off) */}
            <div className={`flex flex-col gap-6 h-fit ${previewMode === 'off' ? 'col-span-2' : ''}`}>
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 font-black text-sm">4</span>
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-wider">Tối ưu hóa SEO</h3>
              </div>

              <div className={`pl-11 grid gap-6 ${previewMode === 'off' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                <div id="preview-seo" className="bg-gray-50 border border-gray-200 p-6 rounded-2xl shadow-sm h-fit">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm"><Search size={14} className="text-gray-500"/></div>
                    <span className="text-sm font-medium text-[#202124] line-clamp-1">sbuild.vn › tin-tuc › {formData.slug || 'duong-dan'}</span>
                  </div>
                  <h4 className="text-2xl text-[#1a0dab] font-normal hover:underline cursor-pointer mb-2 line-clamp-1">
                    {formData.seoTitle || formData.title || 'Tiêu đề bài viết hiển thị trên Google'}
                  </h4>
                  <p className="text-base text-[#4d5156] line-clamp-2">
                    {formData.seoDescription || 'Mô tả ngắn gọn về bài viết (Meta Description) sẽ hiển thị ở đây trên kết quả tìm kiếm Google.'}
                  </p>
                </div>

                <div className="flex flex-col gap-6">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="block text-sm font-bold text-gray-700">Tiêu đề SEO (Meta Title)</label>
                      <span className={`text-xs font-bold px-2 py-1 bg-gray-100 rounded-md ${getSeoTitleColor(formData.seoTitle.length)}`}>
                        {formData.seoTitle.length}/60
                      </span>
                    </div>
                    <input 
                      type="text" 
                      value={formData.seoTitle}
                      onChange={(e) => setFormData({...formData, seoTitle: e.target.value})}
                      onFocus={() => setFocusedField('seo')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Nhập tiêu đề SEO..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-base font-medium transition-all"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="block text-sm font-bold text-gray-700">Mô tả SEO (Meta Description)</label>
                      <span className={`text-xs font-bold px-2 py-1 bg-gray-100 rounded-md ${getSeoDescColor(formData.seoDescription.length)}`}>
                        {formData.seoDescription.length}/160
                      </span>
                    </div>
                    <textarea 
                      value={formData.seoDescription}
                      onChange={(e) => setFormData({...formData, seoDescription: e.target.value})}
                      onFocus={() => setFocusedField('seo')}
                      onBlur={() => setFocusedField(null)}
                      rows={4}
                      placeholder="Nhập mô tả SEO..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-base font-medium transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

          </form>
        </div>
      </div>
      
      <MediaPickerModal 
        isOpen={mediaPickerConfig.isOpen}
        onClose={() => setMediaPickerConfig({ isOpen: false })}
        onSelect={handleMediaSelected}
        multiple={false}
      />
    </div>
  );
}
