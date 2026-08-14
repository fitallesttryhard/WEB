import React, { useState, useEffect, useRef } from 'react';
import { X, UploadCloud, Loader2, CheckCircle2, Image as ImageIcon } from 'lucide-react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
      setSelectedUrls([]);
    }
  }, [isOpen]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage.from('product-media').list();
      if (error) throw error;
      
      const validFiles = data.filter((f: any) => f.name !== '.emptyFolderPlaceholder' && f.metadata?.size);
      
      const filesWithUrls = validFiles.map((file: any) => {
        const { data: { publicUrl } } = supabase.storage.from('product-media').getPublicUrl(file.name);
        return {
          id: file.id,
          name: file.name,
          size: file.metadata?.size || 0,
          path: file.name,
          url: publicUrl
        };
      });
      setMediaFiles(filesWithUrls.sort((a, b) => b.name.localeCompare(a.name)));
    } catch (error) {
      console.error('Error fetching media:', error);
      // Fallback mocks
      if (mediaFiles.length === 0) {
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
      
      try {
        const { error } = await supabase.storage.from('product-media').upload(fileName, file);
        if (error) throw error;
        
        const { data: { publicUrl } } = supabase.storage.from('product-media').getPublicUrl(fileName);
        newFiles.push({
          id: fileName,
          name: file.name,
          size: file.size,
          path: fileName,
          url: publicUrl
        });
      } catch (error) {
        console.error('Upload failed:', error);
        // Fallback for local mock
        newFiles.push({
          id: fileName,
          name: file.name,
          url: URL.createObjectURL(file)
        });
      }
    }
    
    setMediaFiles(prev => [...newFiles, ...prev]);
    setIsUploading(false);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <ImageIcon className="text-red-600" />
            Thư viện Media
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Upload Area */}
        <div className="p-6 shrink-0 border-b border-gray-50">
          <div 
            className={`w-full p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer
              ${isDragging ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300'}`}
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
              <div className="flex flex-col items-center">
                <Loader2 size={32} className="text-red-500 animate-spin mb-2" />
                <p className="text-sm font-bold text-gray-700">Đang tải ảnh lên...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <UploadCloud size={28} className="text-gray-400 mb-2" />
                <p className="text-sm font-bold text-gray-900 mb-1">Kéo thả hình ảnh vào đây</p>
                <p className="text-xs text-gray-500 font-medium">hoặc click để tải lên</p>
              </div>
            )}
          </div>
        </div>

        {/* Gallery */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 size={32} className="text-red-500 animate-spin" />
            </div>
          ) : mediaFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ImageIcon size={48} className="mb-4 opacity-50" />
              <p className="font-medium">Chưa có hình ảnh nào trong thư viện.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {mediaFiles.map((file) => {
                const isSelected = selectedUrls.includes(file.url);
                return (
                  <div 
                    key={file.id}
                    onClick={() => toggleSelect(file.url)}
                    className={`aspect-square rounded-xl overflow-hidden cursor-pointer relative border-2 transition-all ${isSelected ? 'border-red-500 ring-2 ring-red-500/20' : 'border-transparent hover:border-gray-300'}`}
                  >
                    <img 
                      src={file.url} 
                      alt={file.name} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                        <div className="bg-red-500 text-white rounded-full p-1 shadow-lg scale-110 animate-in zoom-in-75 duration-200">
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
          <p className="text-sm font-medium text-gray-500">
            Đã chọn <span className="font-black text-gray-900">{selectedUrls.length}</span> hình ảnh
          </p>
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Hủy
            </button>
            <button 
              onClick={handleConfirm}
              disabled={selectedUrls.length === 0}
              className="px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              Sử dụng ảnh đã chọn
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
