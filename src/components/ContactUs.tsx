import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2, ShieldCheck, Truck, Award, Clock, Sparkles, ExternalLink } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

export default function ContactUs() {
  const { settings } = useSettings();
  const [selectedTopic, setSelectedTopic] = useState<string>('Nẹp nhôm trang trí');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', phone: '', email: '', message: '' });
      
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    }, 1200);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const topicOptions = [
    'Nẹp nhôm Anode',
    'Nẹp Inox 304 PVD',
    'Băng cản nước PVC',
    'Phụ kiện giàn giáo',
    'Báo giá toàn bộ công trình'
  ];

  // Smart resolver that accepts iframe HTML code, share links, custom embed URLs, or fallback address
  const getGoogleMapEmbedUrl = (rawInput?: string, addressFallback?: string): string => {
    let cleaned = (rawInput || '').trim();

    // Extract src if user pasted full <iframe src="..."> HTML snippet
    if (cleaned.includes('<iframe') && cleaned.includes('src=')) {
      const match = cleaned.match(/src=["']([^"']+)["']/i);
      if (match && match[1]) {
        cleaned = match[1];
      }
    }

    const defaultAddress = addressFallback && addressFallback.trim() 
      ? addressFallback.trim() 
      : 'Tầng 5, Tòa nhà Sbuild, Quận 1, TP. Hồ Chí Minh';

    const addressEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(defaultAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

    // If input is empty or contains known broken/mock pb parameter
    if (!cleaned || cleaned.includes('1711234567890')) {
      return addressEmbedUrl;
    }

    // Already a clean embed URL
    if (cleaned.includes('output=embed')) {
      return cleaned;
    }

    if (cleaned.includes('/maps/embed')) {
      // If the embed URL has an invalid pb parameter format or is incomplete, fallback safely
      if (cleaned.includes('pb=') && !cleaned.includes('!1m')) {
        return addressEmbedUrl;
      }
      return cleaned;
    }

    // Convert share links, place links, or text addresses to output=embed format
    return `https://maps.google.com/maps?q=${encodeURIComponent(cleaned)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  };

  const mapSrc = getGoogleMapEmbedUrl(settings.mapUrl, settings.address);
  const directMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address || 'Sbuild, TP.HCM')}`;

  return (
    <div className="bg-slate-50/50 min-h-screen pt-28 pb-20 selection:bg-red-200 selection:text-red-900">
      
      {/* 1. HERO HEADER */}
      <div className="bg-slate-900 text-white py-16 relative overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-red-950/40 via-slate-900/90 to-slate-950 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-extrabold uppercase tracking-widest mb-4">
            <Sparkles size={14} /> Tư Vấn Kỹ Thuật & Nhận Báo Giá 24/7
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4 drop-shadow-sm">
            Liên Hệ Với <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-500">{settings.companyName || 'SBUILD'}</span>
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto font-medium leading-relaxed">
            Đội ngũ chuyên gia vật tư và kỹ sư Sbuild luôn sẵn sàng hỗ trợ chọn mẫu nẹp, tư vấn bản vẽ thi công và báo giá ưu đãi tốt nhất cho dự án của bạn.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 2. TOP CONTACT CARDS STRIP */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1: Địa chỉ */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-start gap-4 hover:border-red-500/30 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 shadow-xs font-bold">
              <MapPin size={22} />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block mb-1">Văn phòng / Showroom</span>
              <p className="text-sm font-bold text-slate-900 leading-snug">{settings.address || 'Tầng 5, Tòa nhà Sbuild, Quận 1, TP. Hồ Chí Minh'}</p>
            </div>
          </div>

          {/* Card 2: Hotline */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-start gap-4 hover:border-red-500/30 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-xs font-bold">
              <Phone size={22} />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block mb-1">Hotline & Zalo Kỹ Thuật</span>
              <a href={`tel:${(settings.hotline || '').replace(/\s+/g, '')}`} className="text-lg font-black text-red-600 hover:underline">
                {settings.hotline || '0901 234 567'}
              </a>
              <span className="block text-xs font-medium text-slate-500 mt-0.5">Phản hồi ngay trong 5 phút</span>
            </div>
          </div>

          {/* Card 3: Email */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-start gap-4 hover:border-red-500/30 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-xs font-bold">
              <Mail size={22} />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block mb-1">Email Báo Giá</span>
              <a href={`mailto:${settings.email}`} className="text-sm font-bold text-slate-900 hover:text-red-600 transition-colors block">
                {settings.email || 'contact@sbuild.vn'}
              </a>
              <span className="block text-xs font-medium text-slate-500 mt-0.5">Gửi hồ sơ bản vẽ dự án 24/7</span>
            </div>
          </div>
        </div>

        {/* 3. MAIN FORM & MAP GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* LEFT: FORM CARD (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 lg:p-10 relative overflow-hidden">
            
            <div className="mb-8">
              <span className="text-red-600 font-extrabold text-xs uppercase tracking-[0.2em] block mb-1">HỖ TRỢ NHANH CHÓNG</span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">
                Gửi Yêu Cầu Báo Giá & Mẫu Thử
              </h2>
              <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">
                Điền thông tin bên dưới, nhân viên kỹ thuật Sbuild sẽ gửi bảng giá chi tiết kèm ưu đãi chiết khấu.
              </p>
            </div>

            {/* Quick Topic Badges */}
            <div className="mb-6">
              <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2.5">
                Bạn cần tư vấn về danh mục nào?
              </label>
              <div className="flex flex-wrap gap-2">
                {topicOptions.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => setSelectedTopic(topic)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
                      selectedTopic === topic
                        ? 'bg-red-600 text-white shadow-sm shadow-red-500/30'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="VD: Nguyễn Văn A"
                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                    Số điện thoại / Zalo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="VD: 0901 234 567"
                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                  Email công ty / cá nhân (Không bắt buộc)
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="VD: eng.nguyen@gmail.com"
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                  Nội dung chi tiết hoặc yêu cầu khối lượng nẹp/vật tư
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={`Cần báo giá cho danh mục: ${selectedTopic}. Quy cách / Kích thước mong muốn...`}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-700 hover:to-rose-800 text-white rounded-xl font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/25 active:scale-[0.99] disabled:opacity-70 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Đang gửi yêu cầu...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Gửi Yêu Cầu Báo Giá
                  </>
                )}
              </button>
            </form>

            {/* Success Overlay */}
            {isSuccess && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-6 animate-in fade-in duration-300">
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <CheckCircle2 size={36} />
                </div>
                <h4 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Đã Gửi Yêu Cầu Thành Công!</h4>
                <p className="text-sm text-slate-600 font-medium max-w-md">
                  Cảm ơn bạn. Chuyên viên tư vấn vật tư Sbuild sẽ gọi điện/Zalo hỗ trợ và gửi báo giá trong thời gian sớm nhất.
                </p>
              </div>
            )}
          </div>

          {/* RIGHT: MAP CARD (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden flex flex-col h-full min-h-[500px] p-3">
            <div className="p-4 bg-slate-900 text-white rounded-2xl mb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-red-400 uppercase tracking-widest block">Bản đồ vị trí</span>
                <span className="text-xs font-bold text-slate-200">Showroom & Kho Vật Tư Sbuild</span>
              </div>
              <a
                href={directMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-xl text-[11px] font-bold transition flex items-center gap-1 shadow-sm"
                title="Mở vị trí trên Google Maps"
              >
                Google Maps <ExternalLink size={12} />
              </a>
            </div>

            <div className="flex-1 w-full rounded-2xl overflow-hidden bg-slate-100 relative min-h-[400px]">
              <iframe 
                src={mapSrc} 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full min-h-[400px]"
                title="Bản đồ Google Maps Sbuild"
              ></iframe>
            </div>
          </div>

        </div>

        {/* 4. BOTTOM SERVICE COMMITMENT STRIP */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-slate-200/60 text-center">
          <div className="flex items-center justify-center gap-3 py-2 text-slate-700">
            <Truck size={20} className="text-red-600" />
            <span className="text-xs font-extrabold uppercase tracking-wider">Giao hàng 24h tận chân công trình</span>
          </div>

          <div className="flex items-center justify-center gap-3 py-2 text-slate-700">
            <Award size={20} className="text-red-600" />
            <span className="text-xs font-extrabold uppercase tracking-wider">Đầy đủ chứng chỉ CO/CQ kiểm định</span>
          </div>

          <div className="flex items-center justify-center gap-3 py-2 text-slate-700">
            <ShieldCheck size={20} className="text-red-600" />
            <span className="text-xs font-extrabold uppercase tracking-wider">Gửi mẫu thử vật tư tận nơi miễn phí</span>
          </div>
        </div>

      </div>
    </div>
  );
}

