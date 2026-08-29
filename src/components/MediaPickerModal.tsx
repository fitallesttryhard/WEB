import React, { useState, useEffect, useRef } from 'react';
import { X, UploadCloud, Loader2, CheckCircle2, Image as ImageIcon, Search, Trash2, Copy, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (urls: string[]) => void;
  multiple?: boolean;
}

export default function MediaPickerModal({ isOpen, onClose, onSelect, multiple = false }: MediaPickerModalProps) {
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
      setSelectedUrls([]);
      setSearchQuery('');
    }
  }, [isOpen]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const fetchMedia = async () => {
    setLoading(true);
    try {
      let localSaved: any[] = [];
      const stored = localStorage.getItem('admin_local_media_gallery');
      if (stored) {
        try { localSaved = JSON.parse(stored); } catch (e) {}
      }

      let remoteFiles: any[] = [];
      const { data, error } = await supabase.storage.from('product-media').list();
      if (!error && data) {
        const validFiles = (data || []).filter((f: any) => f.name !== '.emptyFolderPlaceholder');
        remoteFiles = validFiles.map((file: any) => {
          const { data: { publicUrl } } = supabase.storage.from('product-media').getPublicUrl(file.name);
          return {
            id: file.id || file.name,
            name: file.name,
            size: file.metadata?.size || 0,
            path: file.name,
            url: publicUrl
          };
        });
      }

      const merged = [...remoteFiles];
      for (const item of localSaved) {
        if (!merged.some(m => m.path === item.path || m.url === item.url)) {
          merged.push(item);
        }
      }

      if (merged.length === 0) {
        merged.push(
          { id: '1', name: 'scaffolding-hero.jpg', url: 'https://images.unsplash.com/photo-1541888086925-920a0b40eb45?q=80&w=600&auto=format&fit=crop' },
          { id: '2', name: 'metal-clamp.png', url: 'https://images.unsplash.com/photo-1504307651254-35680f356f58?q=80&w=600&auto=format&fit=crop' },
          { id: '3', name: 'waterproof-membrane.jpg', url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop' }
        );
      }

      setMediaFiles(merged);
    } catch (error) {
      console.warn('Error fetching media from Supabase Storage:', error);
      let localSaved: any[] = [];
      try {
        const stored = localStorage.getItem('admin_local_media_gallery');
        if (stored) localSaved = JSON.parse(stored);
      } catch (e) {}

      if (localSaved.length > 0) {
        setMediaFiles(localSaved);
      } else {
        setMediaFiles([
          { id: '1', name: 'scaffolding-hero.jpg', url: 'https://images.unsplash.com/photo-1541888086925-920a0b40eb45?q=80&w=600&auto=format&fit=crop' },
          { id: '2', name: 'metal-clamp.png', url: 'https://images.unsplash.com/photo-1504307651254-35680f356f58?q=80&w=600&auto=format&fit=crop' },
          { id: '3', name: 'waterproof-membrane.jpg', url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop' }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMediaUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    
    const newFiles: any[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      let uploadedObj: any = null;

      try {
        const { data: upData, error } = await supabase.storage.from('product-media').upload(fileName, file);
        if (!error && upData) {
          const { data: { publicUrl } } = supabase.storage.from('product-media').getPublicUrl(fileName);
          uploadedObj = {
            id: fileName,
            name: file.name,
            size: file.size,
            path: fileName,
            url: publicUrl
          };
        }
      } catch (error) {
        console.warn('Upload failed to Supabase Storage, fallback to local Base64:', error);
      }

      if (!uploadedObj) {
        try {
          const base64Url = await fileToBase64(file);
          uploadedObj = {
            id: `local-${Date.now()}-${i}`,
            name: file.name,
            size: file.size,
            path: `local-${Date.now()}-${i}`,
            url: base64Url
          };
        } catch (e) {
          uploadedObj = {
            id: `mock-${Date.now()}-${i}`,
            name: file.name,
            size: file.size,
            path: `mock-${Date.now()}-${i}`,
            url: URL.createObjectURL(file)
          };
        }
      }

      if (uploadedObj) {
        newFiles.push(uploadedObj);
      }
    }
    
    setMediaFiles(prev => {
      const updated = [...newFiles, ...prev];
      try {
        localStorage.setItem('admin_local_media_gallery', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setIsUploading(false);
  };

  const handleDeleteMedia = async (e: React.MouseEvent, file: any) => {
    e.stopPropagation();
    if (!window.confirm(`Bạn có chắc muốn xóa file "${file.name}" khỏi thư viện?`)) return;

    try {
      if (file.path && !file.path.startsWith('mock-') && !file.path.startsWith('local-')) {
        await supabase.storage.from('product-media').remove([file.path]);
      }
    } catch (err) {
      console.warn('Failed to delete file from storage:', err);
    }

    setMediaFiles(prev => {
      const updated = prev.filter(f => f.id !== file.id && f.url !== file.url);
      try {
        localStorage.setItem('admin_local_media_gallery', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setSelectedUrls(prev => prev.filter(u => u !== file.url));
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

  const filteredFiles = mediaFiles.filter(f => 
    f.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh] border border-gray-100 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <ImageIcon size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900">Thư viện Media</h2>
              <p className="text-xs text-gray-500 font-medium">Quản lý và chọn hình ảnh cho sản phẩm, dự án, bài viết</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Upload & Search Bar */}
        <div className="p-5 shrink-0 border-b border-gray-100 bg-gray-50/50 space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm hình ảnh theo tên..."
                className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-xs font-medium"
              />
            </div>

            {/* Direct Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full md:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <UploadCloud size={16} />
              <span>Tải ảnh mới lên</span>
            </button>
          </div>

          {/* Drag & Drop Box */}
          <div 
            className={`w-full p-4 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer bg-white
              ${isDragging ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:bg-gray-100/80 hover:border-gray-300'}`}
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
              <div className="flex items-center gap-2 py-1">
                <Loader2 size={20} className="text-red-600 animate-spin" />
                <p className="text-xs font-bold text-gray-700">Đang tải ảnh lên thư viện...</p>
              </div>
            ) : (
              <p className="text-xs font-semibold text-gray-500">
                Kéo thả file hình ảnh vào đây hoặc <span className="text-red-600 font-bold underline">duyệt từ máy tính</span> (JPG, PNG, WEBP)
              </p>
            )}
          </div>
        </div>

        {/* Gallery */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
              <Loader2 size={32} className="text-red-600 animate-spin" />
              <p className="text-xs font-semibold">Đang tải danh sách ảnh...</p>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
              <ImageIcon size={48} className="mb-3 opacity-40 text-gray-400" />
              <p className="font-bold text-sm text-gray-700">Chưa tìm thấy hình ảnh phù hợp.</p>
              <p className="text-xs text-gray-400 mt-1">Thử đổi từ khóa tìm kiếm hoặc tải ảnh mới lên.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredFiles.map((file) => {
                const isSelected = selectedUrls.includes(file.url);
                return (
                  <div 
                    key={file.id}
                    onClick={() => toggleSelect(file.url)}
                    className={`group aspect-square rounded-2xl overflow-hidden cursor-pointer relative border-2 bg-white transition-all shadow-xs ${
                      isSelected 
                        ? 'border-red-600 ring-2 ring-red-600/30 scale-[0.98]' 
                        : 'border-gray-200 hover:border-red-400 hover:shadow-md'
                    }`}
                  >
                    <img 
                      src={file.url} 
                      alt={file.name} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />

                    {/* File name bar */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-[10px] text-white font-medium truncate pointer-events-none">
                      {file.name}
                    </div>

                    {/* Actions Overlay */}
                    <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button
                        type="button"
                        onClick={(e) => handleCopyUrl(e, file.url)}
                        className="w-7 h-7 rounded-lg bg-slate-900/80 text-white flex items-center justify-center hover:bg-black transition-colors"
                        title="Sao chép link ảnh"
                      >
                        {copiedUrl === file.url ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteMedia(e, file)}
                        className="w-7 h-7 rounded-lg bg-red-600/90 text-white flex items-center justify-center hover:bg-red-700 transition-colors"
                        title="Xóa ảnh"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* Checkmark badge */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-red-600/20 flex items-center justify-center pointer-events-none">
                        <div className="bg-red-600 text-white rounded-full p-1.5 shadow-lg animate-in zoom-in-75 duration-200">
                          <CheckCircle2 size={24} />
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
            Đã chọn <span className="font-extrabold text-red-600 text-sm">{selectedUrls.length}</span> hình ảnh {multiple ? '(Cho phép chọn nhiều)' : '(Chọn 1 ảnh)'}
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
    </div>
  );
}

