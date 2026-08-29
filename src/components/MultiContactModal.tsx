import React from 'react';
import { Phone, X, MessageCircle, ExternalLink, Mail, Sparkles, Building2 } from 'lucide-react';
import { ContactItem } from '../utils/contactParser';

interface MultiContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  type: 'phone' | 'zalo' | 'email' | 'facebook';
  items: ContactItem[];
}

export default function MultiContactModal({
  isOpen,
  onClose,
  title,
  subtitle = 'Vui lòng chọn bộ phận bạn cần kết nối tư vấn & hỗ trợ',
  type,
  items,
}: MultiContactModalProps) {
  if (!isOpen || items.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className={`p-5 text-white flex items-center justify-between ${
          type === 'phone' ? 'bg-gradient-to-r from-red-600 to-rose-700' :
          type === 'zalo' ? 'bg-gradient-to-r from-blue-600 to-indigo-700' :
          type === 'email' ? 'bg-gradient-to-r from-emerald-600 to-teal-700' :
          'bg-gradient-to-r from-indigo-600 to-blue-700'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shrink-0">
              {type === 'phone' && <Phone size={20} />}
              {type === 'zalo' && <MessageCircle size={20} />}
              {type === 'email' && <Mail size={20} />}
              {type === 'facebook' && <ExternalLink size={20} />}
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">{title}</h3>
              <p className="text-xs text-white/80 mt-0.5 font-medium">{subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Contact List Options */}
        <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto bg-slate-50/50">
          {items.map((item, idx) => (
            <a
              key={item.id || idx}
              href={
                type === 'phone'
                  ? `tel:${item.clean}`
                  : type === 'zalo'
                  ? item.clean
                  : type === 'email'
                  ? `mailto:${item.clean}`
                  : item.clean
              }
              target={type === 'phone' || type === 'email' ? '_self' : '_blank'}
              rel="noopener noreferrer"
              onClick={onClose}
              className="group bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-red-400 hover:shadow-lg transition-all duration-200 flex items-center justify-between gap-3 active:scale-[0.98]"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  type === 'phone' ? 'bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white' :
                  type === 'zalo' ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' :
                  'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'
                } transition-colors`}>
                  {type === 'phone' ? <Phone size={16} /> : type === 'zalo' ? 'Z' : <Building2 size={16} />}
                </div>
                <div className="overflow-hidden min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900 truncate font-mono">{item.raw}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-500 group-hover:text-red-600 transition-colors block truncate">
                    {item.label}
                  </span>
                </div>
              </div>

              <div className={`px-3 py-1.5 rounded-xl text-xs font-extrabold shrink-0 flex items-center gap-1 transition-all ${
                type === 'phone' ? 'bg-red-600 text-white shadow-xs group-hover:bg-red-700' :
                type === 'zalo' ? 'bg-blue-600 text-white shadow-xs group-hover:bg-blue-700' :
                'bg-slate-900 text-white'
              }`}>
                <span>{type === 'phone' ? 'Gọi ngay' : type === 'zalo' ? 'Chat Zalo' : 'Truy cập'}</span>
              </div>
            </a>
          ))}
        </div>

        {/* Footer info */}
        <div className="px-5 py-3.5 bg-slate-100/80 border-t border-slate-200/60 flex items-center justify-between text-slate-500 text-[11px] font-semibold">
          <span className="flex items-center gap-1">
            <Sparkles size={13} className="text-amber-500" />
            Đơn vị hỗ trợ 24/7 Fi.tallest
          </span>
          <button onClick={onClose} className="hover:text-slate-900 font-bold cursor-pointer">
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
