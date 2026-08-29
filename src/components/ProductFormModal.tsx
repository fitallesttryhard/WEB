import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Search, CheckCircle2, Image as ImageIcon, EyeOff, Monitor, Smartphone, Lock } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';
import MediaPickerModal from './MediaPickerModal';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  categories: { id: string; name: string }[];
  initialData?: any;
}

export default function ProductFormModal({ isOpen, onClose, onSubmit, categories, initialData }: ProductFormModalProps) {
  const [previewMode, setPreviewMode] = useState<'off' | 'desktop' | 'mobile'>('desktop');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    id: undefined as number | undefined,
    name: '',
    categoryId: '',
    slug: '',
    description: '', specs: '',
    compareFields: [
      { id: '1', key: 'Chất liệu', value: '' },
      { id: '2', key: 'Quy cách / Kích thước', value: '' },
      { id: '3', key: 'Màu sắc / Bề mặt', value: '' },
      { id: '4', key: 'Xuất xứ', value: 'Chính hãng S-BUILD' },
      { id: '5', key: 'Bảo hành', value: '12 - 24 tháng' },
      { id: '6', key: 'Ứng dụng', value: '' }
    ] as { id: string; key: string; value: string }[],
    seoTitle: '',
    seoDescription: '',
    thumbnailUrl: '',
    galleryUrls: [] as string[],
    isHot: false,
    sku: '',
    regularPrice: '',
    salePrice: '',
    stockStatus: 'instock',
    tags: [] as string[],
    status: 'published'
  });

  const [tagInput, setTagInput] = useState('');
  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const [mediaPickerConfig, setMediaPickerConfig] = useState<{isOpen: boolean, type: 'thumbnail' | 'gallery' | 'tinymce'}>({ isOpen: false, type: 'thumbnail' });
  const [autoSyncSpecs, setAutoSyncSpecs] = useState(true);
  const tinyMCECallbackRef = useRef<any>(null);

  const buildSpecsFromCompareFields = (fields: { id?: string; key: string; value: string }[]) => {
    const validFields = fields.filter(f => f && f.key && f.key.trim() && f.value && f.value.trim());
    if (validFields.length === 0) return '';
    return validFields
      .map(f => `<p><strong>${f.key.trim()}:</strong> ${f.value.trim()}</p>`)
      .join('\n');
  };

  const updateCompareFields = (newFields: { id: string; key: string; value: string }[]) => {
    setFormData(prev => ({
      ...prev,
      compareFields: newFields,
      specs: autoSyncSpecs ? buildSpecsFromCompareFields(newFields) : prev.specs
    }));
  };

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        let fields: { id: string; key: string; value: string }[] = [];

        if (Array.isArray(initialData.compareFields) && initialData.compareFields.length > 0) {
          fields = initialData.compareFields;
        } else if (initialData.compareAttrs) {
          const ca = initialData.compareAttrs;
          if (ca.material) fields.push({ id: '1', key: 'Chất liệu', value: ca.material });
          if (ca.dimensions) fields.push({ id: '2', key: 'Quy cách / Kích thước', value: ca.dimensions });
          if (ca.color) fields.push({ id: '3', key: 'Màu sắc / Bề mặt', value: ca.color });
          if (ca.origin) fields.push({ id: '4', key: 'Xuất xứ', value: ca.origin });
          if (ca.warranty) fields.push({ id: '5', key: 'Bảo hành', value: ca.warranty });
          if (ca.application) fields.push({ id: '6', key: 'Ứng dụng', value: ca.application });
        }

        if (fields.length === 0) {
          fields = [
            { id: '1', key: 'Chất liệu', value: '' },
            { id: '2', key: 'Quy cách / Kích thước', value: '' },
            { id: '3', key: 'Màu sắc / Bề mặt', value: '' },
            { id: '4', key: 'Xuất xứ', value: 'Chính hãng S-BUILD' },
            { id: '5', key: 'Bảo hành', value: '12 - 24 tháng' },
            { id: '6', key: 'Ứng dụng', value: '' }
          ];
        }

        const isAutoSync = initialData.autoSyncSpecs !== undefined ? initialData.autoSyncSpecs : true;
        setAutoSyncSpecs(isAutoSync);

        const initialSpecs = initialData.specs || (isAutoSync ? buildSpecsFromCompareFields(fields) : '');

        setFormData({
          id: initialData.id,
          name: initialData.name || '',
          categoryId: initialData.categoryId || '',
          slug: initialData.slug || '',
          description: initialData.description || '',
          specs: initialSpecs,
          compareFields: fields,
          seoTitle: initialData.seoTitle || '',
          seoDescription: initialData.seoDescription || '',
          thumbnailUrl: initialData.thumbnailUrl || initialData.image || '',
          galleryUrls: initialData.galleryUrls || [],
          isHot: initialData.is_hot || false,
          sku: initialData.sku || '',
          regularPrice: initialData.regularPrice || '',
          salePrice: initialData.salePrice || '',
          stockStatus: initialData.stockStatus || 'instock',
          tags: initialData.tags || [],
          status: initialData.status || 'published'
        });
        setIsSlugEdited(!!initialData.slug);
      } else {
        const defaultFields = [
          { id: '1', key: 'Chất liệu', value: '' },
          { id: '2', key: 'Quy cách / Kích thước', value: '' },
          { id: '3', key: 'Màu sắc / Bề mặt', value: '' },
          { id: '4', key: 'Xuất xứ', value: 'Chính hãng S-BUILD' },
          { id: '5', key: 'Bảo hành', value: '12 - 24 tháng' },
          { id: '6', key: 'Ứng dụng', value: '' }
        ];

        setAutoSyncSpecs(true);

        setFormData({
          id: undefined,
          name: '',
          categoryId: '',
          slug: '',
          description: '',
          specs: buildSpecsFromCompareFields(defaultFields),
          compareFields: defaultFields,
          seoTitle: '',
          seoDescription: '',
          thumbnailUrl: '',
          galleryUrls: [],
          isHot: false,
          sku: '',
          regularPrice: '',
          salePrice: '',
          stockStatus: 'instock',
          tags: [],
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


  // Hàm tạo slug từ tiếng Việt
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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setFormData(prev => ({
      ...prev,
      name: newName,
      slug: !isSlugEdited ? toSlug(newName) : prev.slug
    }));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugEdited(true);
    setFormData(prev => ({ ...prev, slug: toSlug(e.target.value) }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/,$/, '');
      if (newTag && !formData.tags.includes(newTag)) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }));
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
    setFocusedField('images');
    setMediaPickerConfig({ isOpen: true, type: 'thumbnail' });
  };

  const handleGalleryUpload = () => {
    setFocusedField('images');
    setMediaPickerConfig({ isOpen: true, type: 'gallery' });
  };

  const handleMediaSelected = (urls: string[]) => {
    if (urls.length === 0) return;
    if (tinyMCECallbackRef.current) {
      tinyMCECallbackRef.current(urls[0], { title: 'Hình ảnh từ thư viện S-BUILD' });
      tinyMCECallbackRef.current = null;
    } else if (mediaPickerConfig.type === 'thumbnail') {
      setFormData(prev => ({ ...prev, thumbnailUrl: urls[0] }));
    } else {
      setFormData(prev => ({ ...prev, galleryUrls: [...prev.galleryUrls, ...urls] }));
    }
  };

  const removeGalleryImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      galleryUrls: prev.galleryUrls.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      autoSyncSpecs
    });
  };

  const getHighlightClass = (fieldName: string) => {
    if (!focusedField) return 'transition-all duration-300';
    if (focusedField === fieldName) {
      return 'ring-4 ring-red-500/50 ring-offset-4 ring-offset-white scale-[1.02] transition-all duration-300 shadow-2xl z-10 bg-white rounded-xl relative';
    }
    return 'opacity-40 transition-all duration-300 pointer-events-none blur-[1px]';
  };

  const categoryName = categories.find(c => String(c.id || (c as any).slug || '') === String(formData.categoryId || ''))?.name || 'Danh mục sản phẩm';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-gray-50 animate-in fade-in duration-200 overflow-hidden">
      
      {/* HEADER */}
      <div className="h-16 px-6 border-b border-gray-200 flex items-center justify-between bg-white shadow-sm shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-xl transition-colors"
          >
            <X size={24} />
          </button>
          <div className="h-6 w-px bg-gray-200"></div>
          <div>
            <h2 className="text-lg font-black text-gray-900">{formData.id ? 'Chỉnh sửa Sản phẩm' : 'Thêm Sản phẩm mới'}</h2>
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
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-black text-sm uppercase tracking-wide transition-all shadow-[0_4px_12px_rgba(220,38,38,0.2)] hover:shadow-[0_6px_16px_rgba(220,38,38,0.3)] active:scale-95"
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
                    {/* Mockup Header */}
                    <div id="preview-categoryId" className={`flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-6 ${getHighlightClass('categoryId')}`}>
                      <span>Trang chủ</span> <span>/</span> <span className="font-medium text-gray-700">{categoryName}</span>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      {/* Images */}
                      <div id="preview-images" className={`rounded-xl ${getHighlightClass('images')}`}>
                        <div className="aspect-square bg-gray-50 rounded-2xl mb-3 overflow-hidden border border-gray-100 flex items-center justify-center">
                          {formData.thumbnailUrl ? (
                            <img src={formData.thumbnailUrl} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="text-gray-300 w-12 h-12" />
                          )}
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {formData.galleryUrls.slice(0, 4).map((url, i) => (
                            <div key={i} className="aspect-square rounded-xl border border-gray-100 overflow-hidden">
                              <img src={url} className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex flex-col">
                        <div id="preview-isHot" className={`${getHighlightClass('isHot')}`}>
                          {formData.isHot && <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 inline-block">🔥 HOT</span>}
                        </div>

                        <div id="preview-name" className={`${getHighlightClass('name')}`}>
                          <h1 className="text-2xl font-black text-gray-900 leading-tight">
                            {formData.name || 'Tên sản phẩm hiển thị ở đây...'}
                          </h1>
                        </div>
                        
                        <div id="preview-price" className={`mt-3 ${getHighlightClass('price')}`}>
                          {formData.salePrice ? (
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-2xl font-black text-red-600">{Number(formData.salePrice).toLocaleString('vi-VN')}đ</span>
                              <span className="text-lg font-semibold text-gray-400 line-through">{Number(formData.regularPrice).toLocaleString('vi-VN')}đ</span>
                            </div>
                          ) : (
                            <span className="text-2xl font-black text-red-600">{formData.regularPrice ? Number(formData.regularPrice).toLocaleString('vi-VN') + 'đ' : 'Liên hệ'}</span>
                          )}
                        </div>

                        <div id="preview-details" className={`mt-5 space-y-2 border-y border-gray-100 py-4 ${getHighlightClass('details')}`}>
                          <div className="flex text-xs">
                            <span className="w-20 text-gray-500 font-medium shrink-0">Mã SP:</span>
                            <span className="font-bold text-gray-900">{formData.sku || 'N/A'}</span>
                          </div>
                          <div className="flex text-xs">
                            <span className="w-20 text-gray-500 font-medium shrink-0">Trạng thái:</span>
                            <span className={`font-bold ${formData.stockStatus === 'instock' ? 'text-green-600' : 'text-red-600'}`}>
                              {formData.stockStatus === 'instock' ? 'Còn hàng' : 'Hết hàng'}
                            </span>
                          </div>
                          {formData.tags.length > 0 && (
                            <div className="flex text-xs mt-2">
                              <span className="w-20 text-gray-500 font-medium shrink-0">Tags:</span>
                              <div className="flex gap-1.5 flex-wrap">
                                {formData.tags.map(tag => (
                                  <span key={tag} className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px] font-medium">{tag}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <button className="w-full bg-red-600 text-white font-bold py-3.5 mt-6 rounded-2xl text-sm hover:bg-red-700 transition-colors shadow-lg shadow-red-600/30">
                          THÊM VÀO GIỎ HÀNG
                        </button>
                      </div>
                    </div>

                    <div className="mt-8">
                      <div className="flex border-b border-gray-100 gap-4">
                        <div className="py-2 border-b-2 border-red-600 text-red-600 font-bold text-sm">Mô tả</div>
                        <div className="py-2 text-gray-400 font-bold text-sm">Thông số</div>
                      </div>
                      <div id="preview-description" className={`pt-4 ${getHighlightClass('description')}`}>
                        <div className="prose prose-sm max-w-none text-gray-600">
                          {formData.description ? <div dangerouslySetInnerHTML={{ __html: formData.description }} /> : <p className="text-gray-400 italic">Mô tả sản phẩm...</p>}
                        </div>
                      </div>
                      <div id="preview-specs" className={`pt-6 ${getHighlightClass('specs')}`}>
                        <div className="prose prose-sm max-w-none text-gray-600 bg-gray-50 p-4 rounded-xl">
                          {formData.specs ? <div dangerouslySetInnerHTML={{ __html: formData.specs }} /> : <p className="text-gray-400 italic text-center">Chưa có thông số</p>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Safari Bottom Bar */}
                  <div className="sticky bottom-0 z-40 bg-[#f8f8f8]/90 backdrop-blur-md border-t border-gray-200/50 pb-5 pt-3 px-4 flex items-center justify-center shrink-0">
                    <div id="preview-slug" className={`w-full max-w-[260px] h-10 bg-white rounded-xl shadow-sm border border-gray-200/60 flex items-center justify-center text-[11px] font-medium text-gray-700 transition-all ${getHighlightClass('slug')}`}>
                      <Lock size={12} className="mr-1.5 text-gray-400" /> <span className="truncate px-2">sbuild.vn/{formData.slug || 'san-pham'}</span>
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
                      <Lock size={12} className="mr-2 opacity-60" /> <span className="truncate">sbuild.vn/san-pham/{formData.slug || 'san-pham-moi'}</span>
                    </div>
                  </div>

                  <div className="p-10 flex-1">
                    {/* Mockup Header */}
                    <div id="preview-categoryId" className={`flex items-center gap-2 text-sm text-gray-500 mb-8 ${getHighlightClass('categoryId')}`}>
                      <span>Trang chủ</span> <span>/</span> <span className="font-medium text-gray-800">{categoryName}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-10">
                      {/* Images */}
                      <div id="preview-images" className={`rounded-xl ${getHighlightClass('images')}`}>
                        <div className="aspect-square bg-gray-50 rounded-2xl mb-4 overflow-hidden border border-gray-100 flex items-center justify-center">
                          {formData.thumbnailUrl ? (
                            <img src={formData.thumbnailUrl} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="text-gray-300 w-16 h-16" />
                          )}
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                          {formData.galleryUrls.slice(0, 4).map((url, i) => (
                            <div key={i} className="aspect-square rounded-xl border border-gray-100 overflow-hidden">
                              <img src={url} className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex flex-col">
                        <div id="preview-isHot" className={`${getHighlightClass('isHot')}`}>
                          {formData.isHot && <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">🔥 Sản phẩm HOT</span>}
                        </div>

                        <div id="preview-name" className={`${getHighlightClass('name')}`}>
                          <h1 className="text-4xl font-black text-gray-900 leading-tight">
                            {formData.name || 'Tên sản phẩm hiển thị ở đây...'}
                          </h1>
                        </div>
                        
                        <div id="preview-price" className={`mt-4 ${getHighlightClass('price')}`}>
                          {formData.salePrice ? (
                            <div className="flex items-end gap-3">
                              <span className="text-4xl font-black text-red-600">{Number(formData.salePrice).toLocaleString('vi-VN')}đ</span>
                              <span className="text-xl font-semibold text-gray-400 line-through pb-1">{Number(formData.regularPrice).toLocaleString('vi-VN')}đ</span>
                            </div>
                          ) : (
                            <span className="text-4xl font-black text-red-600">{formData.regularPrice ? Number(formData.regularPrice).toLocaleString('vi-VN') + 'đ' : 'Liên hệ'}</span>
                          )}
                        </div>

                        <div id="preview-details" className={`mt-6 space-y-3 border-y border-gray-100 py-6 ${getHighlightClass('details')}`}>
                          <div className="flex text-sm">
                            <span className="w-32 text-gray-500 font-medium shrink-0">Mã SP (SKU):</span>
                            <span className="font-bold text-gray-900">{formData.sku || 'N/A'}</span>
                          </div>
                          <div className="flex text-sm">
                            <span className="w-32 text-gray-500 font-medium shrink-0">Tình trạng:</span>
                            <span className={`font-bold ${formData.stockStatus === 'instock' ? 'text-green-600' : 'text-red-600'}`}>
                              {formData.stockStatus === 'instock' ? 'Còn hàng' : 'Hết hàng'}
                            </span>
                          </div>
                          {formData.tags.length > 0 && (
                            <div className="flex text-sm mt-2">
                              <span className="w-32 text-gray-500 font-medium shrink-0">Tags:</span>
                              <div className="flex gap-2 flex-wrap">
                                {formData.tags.map(tag => (
                                  <span key={tag} className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs">{tag}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="mt-8">
                          <button className="w-full bg-red-600 text-white font-bold py-4 rounded-xl text-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-600/30">
                            THÊM VÀO GIỎ HÀNG
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-12 border-t border-gray-100 pt-8">
                      <div className="grid grid-cols-3 gap-12">
                        <div id="preview-description" className={`col-span-2 ${getHighlightClass('description')}`}>
                          <h3 className="text-xl font-black text-gray-900 mb-6 uppercase">Mô tả sản phẩm</h3>
                          <div className="prose max-w-none text-gray-600">
                            {formData.description ? <div dangerouslySetInnerHTML={{ __html: formData.description }} /> : <div className="h-32 flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">Chưa có mô tả</div>}
                          </div>
                        </div>
                        <div id="preview-specs" className={`${getHighlightClass('specs')}`}>
                          <h3 className="text-xl font-black text-gray-900 mb-6 uppercase">Thông số kỹ thuật</h3>
                          <div className="prose prose-sm max-w-none text-gray-600 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            {formData.specs ? <div dangerouslySetInnerHTML={{ __html: formData.specs }} /> : <p className="text-gray-400 text-center italic">Chưa có thông số</p>}
                          </div>
                        </div>
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
            
            {/* THÔNG TIN CƠ BẢN (Col 1) */}
            <div className="flex flex-col gap-6 h-fit">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 font-black text-sm">1</span>
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-wider">Thông tin cơ bản</h3>
              </div>
              
              <div className="flex flex-col gap-6 pl-11">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tên sản phẩm <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={handleNameChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="VD: Cùm xoay giàn giáo BS1139"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-base font-medium transition-all"
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
                    placeholder="vd: cum-xoay-gian-giao"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium text-gray-600 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* PHÂN LOẠI & DỮ LIỆU (Col 2 - Row spans 2 if Off) */}
            <div className={`flex flex-col gap-6 h-fit ${previewMode === 'off' ? 'row-span-2' : ''}`}>
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-black text-sm">2</span>
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-wider">Phân loại & Giá cả</h3>
              </div>
              
              <div className="flex flex-col gap-6 pl-11">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Danh mục <span className="text-red-500">*</span></label>
                  <select 
                    required
                    value={formData.categoryId}
                    onChange={(e) => {
                      const newCatId = e.target.value;
                      const selectedCat: any = categories.find(c => String(c.id || (c as any).slug || '') === String(newCatId || ''));
                      
                      let defaultKeys = ['Chất liệu', 'Quy cách / Kích thước', 'Màu sắc / Bề mặt', 'Xuất xứ', 'Bảo hành', 'Ứng dụng'];
                      if (selectedCat) {
                        if (Array.isArray(selectedCat.compare_fields) && selectedCat.compare_fields.length > 0) {
                          defaultKeys = selectedCat.compare_fields;
                        } else if (selectedCat.name.includes('Inox')) {
                          defaultKeys = ['Mác thép Inox 304', 'Quy cách / Kích thước', 'Bề mặt mạ PVD', 'Độ dày inox', 'Xuất xứ', 'Bảo hành chống gỉ'];
                        } else if (selectedCat.name.includes('Nhôm')) {
                          defaultKeys = ['Chất liệu hợp kim', 'Quy cách / Kích thước', 'Màu sắc mạ Anode', 'Độ dày nhôm', 'Xuất xứ', 'Bảo hành'];
                        } else if (selectedCat.name.includes('Nhựa')) {
                          defaultKeys = ['Chất liệu nhựa PVC', 'Quy cách / Kích thước', 'Màu sắc', 'Khả năng chịu nhiệt', 'Bảo hành'];
                        } else if (selectedCat.name.includes('Đồng')) {
                          defaultKeys = ['Hàm lượng đồng Cu', 'Quy cách / Kích thước', 'Bề mặt xử lý', 'Trọng lượng / thanh', 'Bảo hành'];
                        }
                      }

                      const newFields = defaultKeys.map((keyName, idx) => {
                        const existingVal = formData.compareFields.find(f => f.key === keyName)?.value || '';
                        return { id: (idx + 1).toString(), key: keyName, value: existingVal };
                      });

                      setFormData(prev => ({
                        ...prev,
                        categoryId: newCatId,
                        compareFields: newFields,
                        specs: autoSyncSpecs ? buildSpecsFromCompareFields(newFields) : prev.specs
                      }));
                    }}
                    onFocus={() => setFocusedField('categoryId')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-base font-medium transition-all text-gray-700 bg-white"
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Giá bán gốc (VNĐ)</label>
                    <input 
                      type="number" 
                      value={formData.regularPrice}
                      onChange={(e) => setFormData({...formData, regularPrice: e.target.value})}
                      onFocus={() => setFocusedField('price')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="0"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-base font-medium transition-all bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Giá khuyến mãi (VNĐ)</label>
                    <input 
                      type="number" 
                      value={formData.salePrice}
                      onChange={(e) => setFormData({...formData, salePrice: e.target.value})}
                      onFocus={() => setFocusedField('price')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Để trống nếu không có"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-base font-medium transition-all bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Mã sản phẩm (SKU)</label>
                    <input 
                      type="text" 
                      value={formData.sku}
                      onChange={(e) => setFormData({...formData, sku: e.target.value})}
                      onFocus={() => setFocusedField('details')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="VD: SBUILD-001"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-base font-medium transition-all bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Trạng thái kho</label>
                    <select 
                      value={formData.stockStatus}
                      onChange={(e) => setFormData({...formData, stockStatus: e.target.value})}
                      onFocus={() => setFocusedField('details')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-base font-medium transition-all bg-white"
                    >
                      <option value="instock">Còn hàng</option>
                      <option value="outofstock">Hết hàng</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Từ khóa (Tags)</label>
                  <div 
                    className="p-3 bg-white border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500 transition-all flex flex-wrap gap-2 items-center"
                  >
                    {formData.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-bold border border-gray-200">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="text-gray-400 hover:text-red-500 transition-colors">
                          <X size={14} strokeWidth={3} />
                        </button>
                      </span>
                    ))}
                    <input 
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      onFocus={() => setFocusedField('details')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Thêm từ khóa và phẩy (,)"
                      className="flex-1 min-w-[140px] bg-transparent focus:outline-none text-sm font-medium py-1 px-2"
                    />
                  </div>
                </div>

                <div>
                  <div 
                    className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 cursor-pointer hover:border-red-300 transition-colors" 
                    onClick={() => { setFocusedField('isHot'); setFormData({...formData, isHot: !formData.isHot}) }}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 ${formData.isHot ? 'bg-red-600 text-white' : 'bg-gray-100 text-transparent border border-gray-300'}`}>
                      <CheckCircle2 size={20} />
                    </div>
                    <div className="select-none">
                      <p className="text-base font-bold text-gray-900">Sản phẩm nổi bật (HOT)</p>
                      <p className="text-sm font-medium text-gray-500">Hiển thị nổi bật với nhãn dán đặc biệt</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* HÌNH ẢNH (Col 1) */}
            <div className="flex flex-col gap-6 h-fit" onClick={() => setFocusedField('images')}>
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-black text-sm">3</span>
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-wider">Hình ảnh</h3>
              </div>
              
              <div className="flex flex-col gap-8 pl-11">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Ảnh Đại Diện (Thumbnail) <span className="text-red-500">*</span></label>
                  <div 
                    onClick={handleThumbnailUpload}
                    className={`w-full aspect-video md:aspect-square rounded-2xl border-2 border-dashed ${formData.thumbnailUrl ? 'border-gray-200 p-1.5' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'} transition-colors flex flex-col items-center justify-center cursor-pointer relative overflow-hidden group`}
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
                        <p className="text-xs font-medium text-gray-400 mt-2">Tỉ lệ 1:1, Tối đa 5MB</p>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-3">
                    <label className="block text-sm font-bold text-gray-700">Album Ảnh (Gallery)</label>
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{formData.galleryUrls.length} ảnh</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {formData.galleryUrls.map((url, index) => (
                      <div key={index} className="relative aspect-square rounded-xl border border-gray-200 overflow-hidden group p-1">
                        <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover rounded-lg" />
                        <button 
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeGalleryImage(index); }}
                          className="absolute top-2 right-2 bg-white/90 text-red-600 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 hover:text-white shadow-sm"
                        >
                          <X size={16} strokeWidth={3} />
                        </button>
                      </div>
                    ))}
                    
                    <div 
                      onClick={handleGalleryUpload}
                      className="aspect-square rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 flex flex-col items-center justify-center cursor-pointer transition-colors"
                    >
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm">
                        <Plus size={16} className="text-gray-400" />
                      </div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Thêm ảnh</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MÔ TẢ CHI TIẾT (Spans 2 Cols) */}
            <div className={`flex flex-col gap-6 h-fit ${previewMode === 'off' ? 'col-span-2' : ''}`}>
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-black text-sm">4</span>
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-wider">Mô tả & Thông số</h3>
              </div>
              
              <div className="pl-11 space-y-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Mô tả chi tiết</label>
                  <div 
                    className="border border-gray-200 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-sm"
                  >
                    <Editor
                      tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.3/tinymce.min.js"
                      value={formData.description}
                      onEditorChange={(content) => setFormData({ ...formData, description: content })}
                      onFocus={() => setFocusedField('description')}
                      onBlur={() => setFocusedField(null)}
                      init={{
                        height: 500,
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
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:15px; line-height: 1.6; }',
                        language: 'en',
                        file_picker_callback: (callback, _value, meta) => {
                          if (meta.filetype === 'image') {
                            tinyMCECallbackRef.current = callback;
                            setMediaPickerConfig({ isOpen: true, type: 'tinymce' });
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                    <label className="block text-sm font-bold text-gray-700">Thông số kỹ thuật</label>

                    <div className="flex items-center gap-2.5 bg-amber-50/80 px-3 py-1.5 rounded-xl border border-amber-200/60 shadow-xs">
                      <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5 select-none">
                        <span className={`w-2 h-2 rounded-full ${autoSyncSpecs ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                        Tự động đồng bộ từ Thuộc tính so sánh
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const nextState = !autoSyncSpecs;
                          setAutoSyncSpecs(nextState);
                          if (nextState) {
                            setFormData(prev => ({
                              ...prev,
                              specs: buildSpecsFromCompareFields(prev.compareFields)
                            }));
                          }
                        }}
                        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                          autoSyncSpecs ? 'bg-emerald-600' : 'bg-slate-300'
                        }`}
                        title={autoSyncSpecs ? 'Đang BẬT tự động đồng bộ' : 'Đang TẮT tự động đồng bộ'}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-md ${
                            autoSyncSpecs ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {autoSyncSpecs && (
                    <div className="mb-3 px-3.5 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center justify-between">
                      <span>⚡ Đang bật tự động đồng bộ. Thay đổi ở danh sách Thuộc tính so sánh phía dưới sẽ tự động cập nhật vào đây.</span>
                      <button
                        type="button"
                        onClick={() => setAutoSyncSpecs(false)}
                        className="text-[11px] underline text-emerald-900 hover:text-emerald-700 font-extrabold ml-2 shrink-0 cursor-pointer"
                      >
                        Tắt để sửa thủ công
                      </button>
                    </div>
                  )}

                  <div 
                    className="border border-gray-200 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-sm"
                  >
                    <Editor
                      tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.3/tinymce.min.js"
                      value={formData.specs}
                      onEditorChange={(content) => setFormData({ ...formData, specs: content })}
                      onFocus={() => setFocusedField('specs')}
                      onBlur={() => setFocusedField(null)}
                      init={{
                        height: 300,
                        menubar: false,
                        plugins: [
                          "advlist", "autolink", "lists", "link", "image", "charmap", "preview", "anchor",
                          "searchreplace", "visualblocks", "code", "fullscreen", "insertdatetime",
                          "media", "table", "code", "help", "wordcount", "directionality"
                        ],
                        toolbar: [
                          "bold italic underline | bullist numlist | table | removeformat"
                        ].join(" | "),
                        content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:15px; line-height: 1.6; }",
                        language: "en",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* THUỘC TÍNH SO SÁNH SẢN PHẨM LINH HOẠT (Spans 2 Cols) */}
            <div className={`flex flex-col gap-6 h-fit ${previewMode === 'off' ? 'col-span-2' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-600 font-black text-sm">5</span>
                  <div>
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-wider">Mô-đun Thuộc Tính So Sánh Linh Hoạt</h3>
                    <p className="text-xs text-gray-500 font-medium">Tự do Thêm, Sửa tên trường, Giá trị hoặc Xóa bất kỳ thông số so sánh nào</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const newFields = [
                      ...formData.compareFields,
                      { id: Date.now().toString(), key: '', value: '' }
                    ];
                    updateCompareFields(newFields);
                  }}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <Plus size={16} />
                  <span>+ Thêm trường so sánh</span>
                </button>
              </div>

              <div className="pl-11 space-y-3 bg-amber-50/40 p-6 rounded-2xl border border-amber-200/60">
                <div className="grid grid-cols-12 gap-3 text-xs font-black uppercase tracking-wider text-gray-500 pb-2 border-b border-amber-200/50">
                  <span className="col-span-5">Tên trường so sánh (Key)</span>
                  <span className="col-span-6">Giá trị hiển thị (Value)</span>
                  <span className="col-span-1 text-center">Xóa</span>
                </div>

                {formData.compareFields.map((field, index) => (
                  <div key={field.id || index} className="grid grid-cols-12 gap-3 items-center group">
                    <div className="col-span-5">
                      <input
                        type="text"
                        value={field.key}
                        onChange={(e) => {
                          const newFields = [...formData.compareFields];
                          newFields[index].key = e.target.value;
                          updateCompareFields(newFields);
                        }}
                        placeholder="VD: Độ dày nhôm / Tiêu chuẩn / Màu sắc..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-amber-500 text-xs font-bold text-gray-900 shadow-sm"
                      />
                    </div>

                    <div className="col-span-6">
                      <input
                        type="text"
                        value={field.value}
                        onChange={(e) => {
                          const newFields = [...formData.compareFields];
                          newFields[index].value = e.target.value;
                          updateCompareFields(newFields);
                        }}
                        placeholder="VD: 1.2mm / ISO 9001 / Vàng xước..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-amber-500 text-xs font-semibold text-gray-800 shadow-sm"
                      />
                    </div>

                    <div className="col-span-1 flex justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          const newFields = formData.compareFields.filter((_, i) => i !== index);
                          updateCompareFields(newFields);
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Xóa trường này"
                      >
                        <X size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                ))}

                {formData.compareFields.length === 0 && (
                  <div className="text-center py-6 text-xs text-gray-400 font-medium italic">
                    Chưa có trường so sánh nào. Bấm nút "+ Thêm trường so sánh" ở trên để tạo trường mới.
                  </div>
                )}
              </div>
            </div>

            {/* SEO TỐI ƯU (Spans 2 Cols) */}
            <div className={`flex flex-col gap-6 h-fit ${previewMode === 'off' ? 'col-span-2' : ''}`}>
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 font-black text-sm">6</span>
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-wider">Tối ưu hóa SEO</h3>
              </div>

              <div className={`pl-11 grid gap-6 ${previewMode === 'off' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                <div id="preview-seo" className="bg-gray-50 border border-gray-200 p-6 rounded-2xl shadow-sm h-fit">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm"><Search size={14} className="text-gray-500"/></div>
                    <span className="text-sm font-medium text-[#202124] line-clamp-1">sbuild.vn › san-pham › {formData.slug || 'duong-dan'}</span>
                  </div>
                  <h4 className="text-2xl text-[#1a0dab] font-normal hover:underline cursor-pointer mb-2 line-clamp-1">
                    {formData.seoTitle || formData.name || 'Tiêu đề trang sản phẩm hiển thị trên Google'}
                  </h4>
                  <p className="text-base text-[#4d5156] line-clamp-2">
                    {formData.seoDescription || 'Mô tả ngắn gọn về sản phẩm (Meta Description) sẽ hiển thị ở đây trên kết quả tìm kiếm Google. Hãy viết mô tả hấp dẫn để tăng tỷ lệ click.'}
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
        onClose={() => setMediaPickerConfig({ ...mediaPickerConfig, isOpen: false })}
        onSelect={handleMediaSelected}
        multiple={mediaPickerConfig.type === 'gallery'}
      />
    </div>
  );
}

// Giả lập icon Plus (Do import thiếu ở trên)
const Plus = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);
