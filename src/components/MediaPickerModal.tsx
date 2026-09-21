"use client";
import React, { useState, useEffect, useRef } from 'react';
import { 
  X, UploadCloud, Loader2, CheckCircle2, Image as ImageIcon, 
  Search, Trash2, Copy, Check, Filter, RefreshCw, Eye
} from 'lucide-react';
import { 
  MediaItem, 
  MediaSourceType, 
  extractSystemMedia, 
  getLocalUploadedMedia, 
  fetchRemoteStorageMedia, 
  uploadSingleMediaFile, 
  deleteLocalUploadedMedia,
  saveLocalUploadedMedia
} from '../mediaServices';
import { useSettings } from '../contexts/SettingsContext';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (urls: string[]) => void;
  multiple?: boolean;
  contextData?: {
    banners?: any[];
    products?: any[];
    projects?: any[];
    posts?: any[];
    categories?: any[];
    settings?: any;
  };
}

export default function MediaPickerModal({ 
  isOpen, 
  onClose, 
  onSelect, 
  multiple = false,
  contextData
}: MediaPickerModalProps) {
  const { settings } = useSettings();
  const [mediaFiles, setMediaFiles] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<MediaSourceType>('all');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<MediaItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadAllMedia();
      setSelectedUrls([]);
      setSearchQuery('');
      setSelectedTab('all');
    }
  }, [isOpen]);

  // Lắng nghe sự kiện cập nhật media
  useEffect(() => {
    const handleUpdate = () => {
      loadAllMedia();
    };
    window.addEventListener('sbuild_media_updated', handleUpdate);
    return () => window.removeEventListener('sbuild_media_updated', handleUpdate);
  }, [contextData, settings]);

  const loadAllMedia = async () => {
    setLoading(true);
    try {
      // 1. Quét toàn bộ ảnh từ các thực thể hệ thống (Banners, Sản phẩm, Dự án, Bài viết, Danh mục, Cài đặt)
      const mergedContext = {
        banners: contextData?.banners || settings?.banners || [],
        products: contextData?.products || [],
        projects: contextData?.projects || [],
        posts: contextData?.posts || [],
        categories: contextData?.categories || [],
        settings: contextData?.settings || settings
      };

      const systemItems = extractSystemMedia(mergedContext);

      // 2. Lấy danh sách ảnh đã tải lên từ máy tính
      const localUploads = getLocalUploadedMedia();

      // 3. Thử lấy thêm ảnh từ remote storage nếu có
      let remoteUploads: MediaItem[] = [];
      try {
        remoteUploads = await fetchRemoteStorageMedia();
      } catch (e) {}

      // 4. Hợp nhất và loại trừ trùng lặp
      const combined = [...localUploads, ...remoteUploads, ...systemItems];
      const seen = new Set<string>();
      const deduplicated: MediaItem[] = [];

      for (const item of combined) {
        if (!item.url || seen.has(item.url)) continue;
        seen.add(item.url);
        deduplicated.push(item);
      }

      setMediaFiles(deduplicated);
    } catch (error) {
      console.warn('Lỗi load media trong MediaPickerModal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMediaUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);

    const uploadedList: MediaItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const item = await uploadSingleMediaFile(file);
        if (item) {
          uploadedList.push(item);
        }
      } catch (err) {
        console.error('Lỗi tải file:', err);
      }
    }

    if (uploadedList.length > 0) {
      setMediaFiles(prev => {
        const next = [...uploadedList, ...prev.filter(p => !uploadedList.some(u => u.url === p.url))];
        return next;
      });
      // Tự động chọn ảnh vừa tải lên nếu ở chế độ chọn 1 ảnh
      if (!multiple && uploadedList[0]) {
        setSelectedUrls([uploadedList[0].url]);
      } else if (multiple) {
        setSelectedUrls(prev => [...uploadedList.map(u => u.url), ...prev]);
      }
    }

    setIsUploading(false);
  };

  const handleDeleteMedia = (e: React.MouseEvent, item: MediaItem) => {
    e.stopPropagation();
    if (!window.confirm(`Bạn có chắc muốn xóa ảnh "${item.name}" khỏi danh sách tải lên?`)) return;

    deleteLocalUploadedMedia(item.id || item.url);
    setMediaFiles(prev => prev.filter(f => f.url !== item.url));
    setSelectedUrls(prev => prev.filter(u => u !== item.url));
  };

  const handleCopyUrl = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const toggleSelect = (url: string) => {
    if (multiple) {
      setSelectedUrls(prev => 
        prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]
      );
    } else {
      setSelectedUrls([url]);
    }
  };

  const handleConfirm = () => {
    onSelect(selectedUrls);
    onClose();
  };

  // Lọc theo tab & ô tìm kiếm
  const filteredFiles = mediaFiles.filter(f => {
    const matchesSearch = 
      f.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.sourceTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.url.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (selectedTab === 'all') return true;
    return f.source === selectedTab;
  });

  const getSourceBadge = (source: MediaSourceType, title?: string) => {
    switch (source) {
      case 'banner':
        return <span className="bg-amber-500/90 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider backdrop-blur-xs">Banner</span>;
      case 'product':
        return <span className="bg-red-600/90 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider backdrop-blur-xs">Sản phẩm</span>;
      case 'project':
        return <span className="bg-blue-600/90 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider backdrop-blur-xs">Dự án</span>;
      case 'article':
        return <span className="bg-emerald-600/90 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider backdrop-blur-xs">Bài viết</span>;
      case 'category':
        return <span className="bg-purple-600/90 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider backdrop-blur-xs">Danh mục</span>;
      case 'system':
        return <span className="bg-slate-700/90 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider backdrop-blur-xs">Hệ thống</span>;
      case 'upload':
        return <span className="bg-indigo-600/90 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider backdrop-blur-xs">Đã tải lên</span>;
      default:
        return null;
    }
  };

  const tabCounts = {
    all: mediaFiles.length,
    banner: mediaFiles.filter(f => f.source === 'banner').length,
    product: mediaFiles.filter(f => f.source === 'product').length,
    project: mediaFiles.filter(f => f.source === 'project').length,
    article: mediaFiles.filter(f => f.source === 'article').length,
    system: mediaFiles.filter(f => f.source === 'system').length,
    upload: mediaFiles.filter(f => f.source === 'upload').length,
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-gray-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[90vh] border border-gray-100 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold shadow-xs">
              <ImageIcon size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-gray-900">Thư viện Media Đồng bộ</h2>
                <span className="bg-emerald-100 text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Đã kết nối toàn hệ thống
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium">
                Chọn hình ảnh từ Banner, Sản phẩm, Dự án, Tin tức hoặc tải ảnh mới từ thiết bị
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="p-4 shrink-0 border-b border-gray-100 bg-gray-50/70 space-y-3">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {[
              { key: 'all', label: 'Tất cả' },
              { key: 'banner', label: 'Banner' },
              { key: 'product', label: 'Sản phẩm' },
              { key: 'project', label: 'Dự án' },
              { key: 'article', label: 'Bài viết' },
              { key: 'system', label: 'Hệ thống' },
              { key: 'upload', label: 'Đã tải lên' }
            ].map(tab => {
              const count = tabCounts[tab.key as keyof typeof tabCounts] || 0;
              const isActive = selectedTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setSelectedTab(tab.key as MediaSourceType)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive 
                      ? 'bg-red-600 text-white shadow-sm shadow-red-600/20' 
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/80'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? 'bg-red-700 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={loadAllMedia}
              title="Làm mới đồng bộ"
              className="p-1.5 rounded-xl bg-white text-gray-500 hover:text-red-600 border border-gray-200 hover:bg-red-50 transition-colors ml-auto shrink-0 cursor-pointer"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin text-red-600' : ''} />
            </button>
          </div>

          {/* Search & Direct Upload Area */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm hình ảnh theo tên, tiêu đề dự án hoặc liên kết..."
                className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-xs font-medium"
              />
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <UploadCloud size={16} />
              <span>Tải ảnh mới từ máy</span>
            </button>
          </div>

          {/* Mini Drag Drop Area */}
          <div 
            className={`w-full py-2.5 px-4 border border-dashed rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer bg-white text-xs ${
              isDragging ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-red-300 hover:bg-red-50/20'
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleMediaUpload(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              multiple 
              accept="image/*" 
              onChange={(e) => handleMediaUpload(e.target.files)}
            />
            {isUploading ? (
              <div className="flex items-center gap-2 py-0.5">
                <Loader2 size={16} className="text-red-600 animate-spin" />
                <span className="font-bold text-gray-700">Đang nạp ảnh vào hệ thống...</span>
              </div>
            ) : (
              <span className="text-gray-500 font-medium">
                Kéo thả file ảnh vào đây hoặc <strong className="text-red-600 underline">chọn từ máy tính</strong> (JPG, PNG, WEBP)
              </span>
            )}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
              <Loader2 size={36} className="text-red-600 animate-spin" />
              <p className="text-xs font-bold text-gray-600">Đang quét và đồng bộ hình ảnh toàn trang...</p>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
              <ImageIcon size={48} className="mb-3 opacity-40 text-gray-400" />
              <p className="font-bold text-sm text-gray-700">Chưa tìm thấy hình ảnh phù hợp trong mục này.</p>
              <p className="text-xs text-gray-400 mt-1">Chọn tab "Tất cả" hoặc tải ảnh mới từ máy tính lên.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredFiles.map((file) => {
                const isSelected = selectedUrls.includes(file.url);
                return (
                  <div 
                    key={file.id || file.url}
                    onClick={() => toggleSelect(file.url)}
                    className={`group aspect-square rounded-2xl overflow-hidden cursor-pointer relative border-2 bg-white transition-all shadow-xs ${
                      isSelected 
                        ? 'border-red-600 ring-4 ring-red-600/30 scale-[0.98] shadow-md' 
                        : 'border-gray-200 hover:border-red-400 hover:shadow-md'
                    }`}
                  >
                    <img 
                      src={file.url} 
                      alt={file.name} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />

                    {/* Source Badge */}
                    <div className="absolute top-2 left-2 pointer-events-none z-10 flex flex-col gap-1 items-start">
                      {getSourceBadge(file.source, file.sourceTitle)}
                    </div>

                    {/* Action buttons on Hover */}
                    <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewImage(file);
                        }}
                        className="w-7 h-7 rounded-lg bg-slate-900/80 text-white flex items-center justify-center hover:bg-black transition-colors"
                        title="Xem ảnh lớn"
                      >
                        <Eye size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleCopyUrl(e, file.url)}
                        className="w-7 h-7 rounded-lg bg-slate-900/80 text-white flex items-center justify-center hover:bg-black transition-colors"
                        title="Sao chép link ảnh"
                      >
                        {copiedUrl === file.url ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      </button>
                      {file.source === 'upload' && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteMedia(e, file)}
                          className="w-7 h-7 rounded-lg bg-red-600/90 text-white flex items-center justify-center hover:bg-red-700 transition-colors"
                          title="Xóa khỏi danh sách tải"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>

                    {/* File name bar */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/85 via-black/50 to-transparent text-[10px] text-white font-medium truncate pointer-events-none">
                      <span className="font-bold line-clamp-1">{file.sourceTitle || file.name}</span>
                    </div>

                    {/* Checkmark overlay */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-red-600/25 flex items-center justify-center pointer-events-none">
                        <div className="bg-red-600 text-white rounded-full p-2 shadow-lg animate-in zoom-in-75 duration-200">
                          <CheckCircle2 size={28} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between shrink-0">
          <p className="text-xs font-medium text-gray-500">
            Đã chọn <strong className="font-black text-red-600 text-sm">{selectedUrls.length}</strong> hình ảnh {multiple ? '(Cho phép chọn nhiều)' : '(Chọn 1 ảnh)'}
          </p>
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button 
              onClick={handleConfirm}
              disabled={selectedUrls.length === 0}
              className="px-6 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-red-600/20 active:scale-95 cursor-pointer"
            >
              Sử dụng ảnh đã chọn
            </button>
          </div>
        </div>

      </div>

      {/* Lightbox Preview */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-[250] bg-black/80 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <div className="max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col p-4 relative" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black transition-colors"
            >
              <X size={18} />
            </button>
            <img src={previewImage.url} alt={previewImage.name} className="max-h-[75vh] object-contain rounded-xl" />
            <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
              <span className="font-bold">{previewImage.sourceTitle || previewImage.name}</span>
              <span className="text-gray-400">{previewImage.url}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
