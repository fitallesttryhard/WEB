import React, { useState } from 'react';
import { 
  Calculator, 
  CheckCircle2, 
  Sparkles, 
  Send, 
  Check, 
  ShieldCheck,
  Zap,
  PenTool,
  LineChart,
  Palette,
  Video,
  Code2,
  ChevronDown,
  Copy,
  MessageCircle,
  Bot,
  Image,
  Search,
  CheckCheck,
  ImagePlus,
  Link,
  AlignLeft,
  Hash,
  BookOpen,
  Target,
  Layers,
  Sparkle
} from 'lucide-react';

interface QuotePageProps {
  setCurrentTab: (tab: string) => void;
}

export const QuotePage: React.FC<QuotePageProps> = ({ setCurrentTab }) => {
  // Budget Calculator state
  const [selectedWebType, setSelectedWebType] = useState('company-basic');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['domain-com', 'hosting-basic', 'responsive-all']);
  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Accordion toggle states for Bento Grid items
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    'seo-basic': true,
    'seo-pro': true,
    'social-short': true,
    'social-story': true,
    'maps': true,
    'analytics': true,
    'design': false,
    'logo': false,
    'music': false,
    'shorts': false,
    'ai-video': true,
    'landing': true,
    'webapp': false,
    'debut': false,
    'retainer': false
  });

  const toggleAccordion = (key: string) => {
    setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const copyContact = () => {
    navigator.clipboard.writeText("0909876817");
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  const webTypes = [
    {
      id: 'landing-page',
      title: 'Landing Page Bán Hàng',
      price: 0,
      priceLabel: 'Liên Hệ Báo Giá',
      desc: 'Trang đơn giới thiệu sản phẩm/dịch vụ, tối ưu tỷ lệ chuyển đổi cao.'
    },
    {
      id: 'company-basic',
      title: 'Website Doanh Nghiệp Standard',
      price: 0,
      priceLabel: 'Liên Hệ Báo Giá',
      desc: 'Giới thiệu công ty, dịch vụ, trang tin tức, liên hệ chuẩn SEO.'
    },
    {
      id: 'company-premium',
      title: 'Website Doanh Nghiệp Premium UI/UX',
      price: 0,
      priceLabel: 'Liên Hệ Báo Giá',
      desc: 'Thiết kế độc bản sang trọng, hiệu ứng chuyển động mượt mà, tối ưu PageSpeed 95+.'
    },
    {
      id: 'ecommerce',
      title: 'Website Bán Hàng E-Commerce',
      price: 0,
      priceLabel: 'Liên Hệ Báo Giá',
      desc: 'Giỏ hàng, quản lý sản phẩm, đơn hàng, tích hợp lọc thông minh.'
    },
    {
      id: 'construction-realestate',
      title: 'Website Bất Động Sản / Xây Dựng',
      price: 0,
      priceLabel: 'Liên Hệ Báo Giá',
      desc: 'Danh mục dự án, bộ lọc khu vực, công cụ dự toán chi phí thi công.'
    }
  ];

  const featuresOptions = [
    { id: 'domain-com', title: 'Tên Miền .COM / .NET (1 năm)', priceLabel: 'Hỗ trợ đăng ký' },
    { id: 'domain-vn', title: 'Tên Miền Quốc Gia .VN (1 năm)', priceLabel: 'Hỗ trợ đăng ký' },
    { id: 'hosting-basic', title: 'Hosting NVMe 3GB Siêu Tốc (1 năm)', priceLabel: 'Tích hợp sẵn' },
    { id: 'hosting-pro', title: 'Hosting NVMe 10GB Doanh Nghiệp (1 năm)', priceLabel: 'Nâng cấp linh hoạt' },
    { id: 'responsive-all', title: 'Tối ưu Chuẩn Responsive Mobile & Tablet', priceLabel: 'Miễn Phí' },
    { id: 'seo-local', title: 'Cấu hình chuẩn SEO Onpage & Google Maps', priceLabel: 'Hỗ trợ tối ưu' },
    { id: 'payment-gateway', title: 'Tích hợp Thanh toán Online VNPAY / MoMo', priceLabel: 'Tư vấn tích hợp' },
    { id: 'multilingual', title: 'Đa ngôn ngữ (Anh - Việt / Trung / Nhật)', priceLabel: 'Tư vấn mở rộng' },
    { id: 'ai-chatbot', title: 'Tích hợp Chatbot AI Tư vấn tự động 24/7', priceLabel: 'Tùy chọn AI' },
  ];

  const toggleFeature = (id: string) => {
    if (selectedFeatures.includes(id)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== id));
    } else {
      setSelectedFeatures([...selectedFeatures, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const webTypeObj = webTypes.find(w => w.id === selectedWebType);
    const selectedFeatureTitles = selectedFeatures.map(fid => featuresOptions.find(f => f.id === fid)?.title).filter(Boolean);

    const newLead = {
      id: `QUOTE-${Date.now().toString().slice(-4)}`,
      name: fullname,
      fullname: fullname,
      customer: fullname,
      phone: phone,
      email: '',
      service: `Dự toán: ${webTypeObj?.title || 'Chưa chọn'} (${selectedFeatures.length} tính năng thêm)`,
      services: [webTypeObj?.title || '', ...selectedFeatureTitles.map(String)],
      note: note ? `${note} | Cấu hình: ${webTypeObj?.title}` : `Khung: ${webTypeObj?.title}`,
      status: 'new',
      createdAt: new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      source: 'Trang Báo Giá Tự Động (Quote Page)'
    };

    try {
      const existing = JSON.parse(localStorage.getItem('admin_leads') || localStorage.getItem('leads') || '[]');
      const updated = [newLead, ...existing];
      localStorage.setItem('admin_leads', JSON.stringify(updated));
      localStorage.setItem('leads', JSON.stringify(updated));
      window.dispatchEvent(new Event('admin_leads_updated'));
    } catch (err) {}

    setSubmitted(true);
    setFullname('');
    setPhone('');
    setNote('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-white font-sans selection:bg-purple-500 selection:text-white">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Toast Copy */}
        {copySuccess && (
          <div className="fixed top-6 right-6 z-50 bg-emerald-500 text-slate-950 font-bold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-5 h-5" />
            <span>Đã sao chép số điện thoại (0909876817)!</span>
          </div>
        )}

        {/* HEADER SECTION (Cao Nhất Phi Báo Giá) */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold mb-3 border border-purple-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              Sẵn sàng nhận dự án 2026
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-2 bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Cao Nhất Phi
            </h1>
            <p className="text-lg sm:text-xl text-slate-400">
              Creative & Digital Services <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 font-extrabold">Quotation</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="https://zalo.me/0909876817" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0068FF] text-white font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95"
            >
              <span className="font-black text-lg">Z</span>
              <span>Chat Zalo 0909876817</span>
            </a>
            <button 
              onClick={copyContact} 
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all border border-white/10 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Copy className="w-4 h-4" />
              <span>Copy SĐT</span>
            </button>
          </div>
        </header>

        {/* BENTO GRID QUOTATION CARDS */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              <Sparkle className="w-6 h-6 text-purple-400" />
              Bảng Giá Chi Tiết Dịch Vụ Digital & Sáng Tạo
            </h2>
            <span className="text-xs text-purple-300 font-semibold hidden sm:inline-block bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
              ✨ Di trỏ chuột hoặc click để xem chi tiết hạng mục
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {/* CARD 1: CONTENT (Span 2) */}
            <div className="bg-gradient-to-br from-[#161616] to-[#111111] border border-white/10 hover:border-white/20 rounded-3xl p-6 sm:p-8 col-span-1 md:col-span-2 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-6 border border-blue-500/20">
                  <PenTool className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">✍️ Nội dung (Content)</h3>
                
                <div className="space-y-4">
                  {/* Bài viết chuẩn SEO Web */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <h4 className="font-semibold text-lg text-white">Bài viết chuẩn SEO Web</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Cơ bản */}
                      <div 
                        onClick={() => toggleAccordion('seo-basic')}
                        className="bg-[#111] p-4 rounded-xl border border-white/5 hover:border-blue-500/40 cursor-pointer transition-all group"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-slate-300 group-hover:text-blue-300 transition-colors flex items-center gap-1.5">
                            Gói Cơ bản 
                            <ChevronDown className={`w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-transform ${expandedItems['seo-basic'] ? 'rotate-180' : ''}`} />
                          </span>
                          <span className="text-blue-400 font-mono font-bold text-lg">150k</span>
                        </div>
                        {expandedItems['seo-basic'] && (
                          <ul className="text-xs text-slate-400 space-y-2 pt-3 border-t border-white/5 mt-3 animate-in fade-in">
                            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400 shrink-0" /> ~1000 từ (Tiêu chuẩn)</li>
                            <li className="flex items-center gap-2"><Image className="w-3.5 h-3.5 text-blue-400 shrink-0" /> 2 ảnh minh họa</li>
                            <li className="flex items-center gap-2"><Search className="w-3.5 h-3.5 text-blue-400 shrink-0" /> Tối ưu On-page cơ bản</li>
                          </ul>
                        )}
                      </div>

                      {/* Chuyên sâu */}
                      <div 
                        onClick={() => toggleAccordion('seo-pro')}
                        className="bg-blue-900/10 p-4 rounded-xl border border-blue-500/30 hover:bg-blue-900/20 hover:border-blue-500/50 cursor-pointer transition-all relative overflow-hidden group"
                      >
                        <div className="absolute top-0 right-0 bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">Khuyên dùng</div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-blue-400 group-hover:text-blue-300 transition-colors flex items-center gap-1.5">
                            Gói Chuyên sâu
                            <ChevronDown className={`w-4 h-4 text-blue-400/60 group-hover:text-blue-400 transition-transform ${expandedItems['seo-pro'] ? 'rotate-180' : ''}`} />
                          </span>
                          <span className="text-blue-400 font-mono font-bold text-lg">300k</span>
                        </div>
                        {expandedItems['seo-pro'] && (
                          <ul className="text-xs text-slate-300 space-y-2 pt-3 border-t border-blue-500/20 mt-3 animate-in fade-in">
                            <li className="flex items-center gap-2"><CheckCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" /> 1500+ từ (Nghiên cứu kĩ)</li>
                            <li className="flex items-center gap-2"><ImagePlus className="w-3.5 h-3.5 text-blue-400 shrink-0" /> 5 ảnh (Có design layout)</li>
                            <li className="flex items-center gap-2"><Link className="w-3.5 h-3.5 text-blue-400 shrink-0" /> Internal link & Dàn ý</li>
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Social Post */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <h4 className="font-semibold text-lg text-white">Bài đăng Social (FB/IG)</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div 
                        onClick={() => toggleAccordion('social-short')}
                        className="bg-[#111] p-4 rounded-xl border border-white/5 hover:border-pink-500/40 cursor-pointer transition-all group"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-slate-300 group-hover:text-pink-300 transition-colors flex items-center gap-1.5">
                            Caption Ngắn 
                            <ChevronDown className={`w-4 h-4 text-slate-500 group-hover:text-pink-400 transition-transform ${expandedItems['social-short'] ? 'rotate-180' : ''}`} />
                          </span>
                          <span className="text-pink-400 font-mono font-bold text-lg">80k</span>
                        </div>
                        {expandedItems['social-short'] && (
                          <ul className="text-xs text-slate-400 space-y-2 pt-3 border-t border-white/5 mt-3 animate-in fade-in">
                            <li className="flex items-center gap-2"><AlignLeft className="w-3.5 h-3.5 text-pink-400 shrink-0" /> Dưới 300 từ, giật tít thu hút</li>
                            <li className="flex items-center gap-2"><Hash className="w-3.5 h-3.5 text-pink-400 shrink-0" /> Kèm bộ Hashtag chuẩn</li>
                          </ul>
                        )}
                      </div>

                      <div 
                        onClick={() => toggleAccordion('social-story')}
                        className="bg-pink-900/10 p-4 rounded-xl border border-pink-500/30 hover:bg-pink-900/20 hover:border-pink-500/50 cursor-pointer transition-all relative overflow-hidden group"
                      >
                        <div className="absolute top-0 right-0 bg-pink-500/20 text-pink-300 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">Viral</div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-pink-400 group-hover:text-pink-300 transition-colors flex items-center gap-1.5">
                            Storytelling
                            <ChevronDown className={`w-4 h-4 text-pink-400/60 group-hover:text-pink-400 transition-transform ${expandedItems['social-story'] ? 'rotate-180' : ''}`} />
                          </span>
                          <span className="text-pink-400 font-mono font-bold text-lg">150k</span>
                        </div>
                        {expandedItems['social-story'] && (
                          <ul className="text-xs text-slate-300 space-y-2 pt-3 border-t border-pink-500/20 mt-3 animate-in fade-in">
                            <li className="flex items-center gap-2"><BookOpen className="w-3.5 h-3.5 text-pink-400 shrink-0" /> Kịch bản dài, lôi cuốn</li>
                            <li className="flex items-center gap-2"><Target className="w-3.5 h-3.5 text-pink-400 shrink-0" /> Đánh trúng tâm lý khách hàng</li>
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: ANALYTICS & TRACKING */}
            <div className="bg-gradient-to-br from-[#161616] to-[#0d1520] border border-white/10 hover:border-emerald-500/30 rounded-3xl p-6 sm:p-8 col-span-1 md:col-span-1 lg:col-span-2 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6 border border-emerald-500/20">
                  <LineChart className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">📍 Đo lường & Phân tích</h3>
                
                <div className="space-y-4">
                  {/* Google Maps */}
                  <div 
                    onClick={() => toggleAccordion('maps')}
                    className="border-b border-slate-800 pb-4 cursor-pointer group"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-emerald-300 group-hover:text-emerald-200 transition-colors text-lg">Khởi tạo Google Maps</h4>
                        <ChevronDown className={`w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-transform ${expandedItems['maps'] ? 'rotate-180' : ''}`} />
                      </div>
                      <div className="font-mono text-emerald-400 font-bold text-lg">500k - 1.2m</div>
                    </div>
                    {expandedItems['maps'] && (
                      <div className="pt-3 space-y-2 text-xs animate-in fade-in">
                        <div className="bg-black/40 p-3 rounded-xl border border-white/5 flex justify-between gap-3">
                          <div>
                            <div className="font-bold text-slate-200">Cơ bản (500k)</div>
                            <div className="text-slate-400 mt-0.5">Xác minh chính chủ, thông tin liên hệ chuẩn.</div>
                          </div>
                        </div>
                        <div className="bg-emerald-900/10 p-3 rounded-xl border border-emerald-500/20 flex justify-between gap-3">
                          <div>
                            <div className="font-bold text-emerald-400">Tối ưu Local SEO (1.2m)</div>
                            <div className="text-slate-300 mt-0.5">Phủ từ khóa, mồi đánh giá 5 sao, bài đăng update.</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Analytics */}
                  <div 
                    onClick={() => toggleAccordion('analytics')}
                    className="border-b border-slate-800 pb-4 cursor-pointer group"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-teal-300 group-hover:text-teal-200 transition-colors text-lg">Cài đặt Data Analytics</h4>
                        <span className="bg-teal-500/20 text-teal-300 text-[10px] px-2 py-0.5 rounded uppercase font-bold border border-teal-500/30">Hot</span>
                        <ChevronDown className={`w-4 h-4 text-slate-500 group-hover:text-teal-400 transition-transform ${expandedItems['analytics'] ? 'rotate-180' : ''}`} />
                      </div>
                      <div className="font-mono text-teal-400 font-bold text-lg">800k - 1.5m</div>
                    </div>
                    {expandedItems['analytics'] && (
                      <div className="pt-3 space-y-2 text-xs animate-in fade-in">
                        <div className="bg-black/40 p-3 rounded-xl border border-white/5 flex justify-between gap-3">
                          <div>
                            <div className="font-bold text-slate-200">Cài đặt GSC & GA4 (800k)</div>
                            <div className="text-slate-400 mt-0.5">Gắn mã theo dõi mượt mà, không lỗi luồng data.</div>
                          </div>
                        </div>
                        <div className="bg-teal-900/10 p-3 rounded-xl border border-teal-500/20 flex justify-between gap-3">
                          <div>
                            <div className="font-bold text-teal-400">Báo cáo Looker Studio (1.5m)</div>
                            <div className="text-slate-300 mt-0.5">Thiết lập đo lường nút bấm / điền form trực quan.</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Free audit */}
                  <div className="pt-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-purple-300 text-lg">Khám bệnh Web & UI/UX</h4>
                        <span className="bg-purple-500/20 text-purple-300 text-[10px] px-2 py-0.5 rounded uppercase font-bold border border-purple-500/30 animate-pulse">Miễn phí</span>
                      </div>
                      <div className="font-mono text-purple-400 font-black text-2xl">0đ</div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      Kiểm tra toàn diện website. Tư vấn cải tạo giao diện, tăng tốc độ và gỡ rối luồng chuyển đổi chốt đơn hoàn toàn miễn phí khi sử dụng các dịch vụ khác.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 3: VISUAL & GRAPHICS */}
            <div className="bg-gradient-to-br from-[#161616] to-[#1a0f18] border border-white/10 hover:border-pink-500/30 rounded-3xl p-6 sm:p-8 col-span-1 md:col-span-3 lg:col-span-2 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/10">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center mb-6 border border-pink-500/20">
                  <Palette className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">🎨 Thiết kế Đồ họa (Visual)</h3>
                
                <div className="space-y-4 text-xs">
                  <div className="border-b border-slate-800 pb-3 flex justify-between items-center gap-3">
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-200 text-sm">Thiết kế Ấn phẩm Quảng cáo</h4>
                      <p className="text-slate-400 mt-0.5">Banner Facebook/Zalo, Standee, Flyer thương hiệu</p>
                    </div>
                    <span className="font-mono text-pink-300 font-bold text-sm shrink-0 whitespace-nowrap">Liên hệ</span>
                  </div>

                  <div className="border-b border-slate-800 pb-3 flex justify-between items-center gap-3">
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-200 text-sm">Thiết kế Logo & Bộ nhận diện</h4>
                      <p className="text-slate-400 mt-0.5">Xuất file vector, quy chuẩn màu sắc font chữ</p>
                    </div>
                    <span className="font-mono text-pink-300 font-bold text-sm shrink-0 whitespace-nowrap">Liên hệ</span>
                  </div>

                  <div className="flex justify-between items-center gap-3">
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-200 text-sm">Nhạc Thương hiệu Độc quyền</h4>
                      <p className="text-slate-400 mt-0.5">Giai điệu 15s - 30s+, 100% bản quyền</p>
                    </div>
                    <span className="font-mono text-pink-300 font-bold text-sm shrink-0 whitespace-nowrap">Liên hệ</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 4: VIDEO & AI MOTION */}
            <div className="bg-gradient-to-br from-[#161616] to-[#1a0b1c] border border-white/10 hover:border-orange-500/30 rounded-3xl p-6 sm:p-8 col-span-1 md:col-span-3 lg:col-span-2 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center mb-6 border border-orange-500/20">
                  <Video className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2 mb-6">
                  <h3 className="text-2xl font-bold text-white">🎬 Video & AI Motion</h3>
                  <span className="bg-orange-500/20 text-orange-300 text-[10px] px-2 py-0.5 rounded uppercase font-bold border border-orange-500/30">Xu hướng</span>
                </div>
                
                <div className="space-y-4 text-xs">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-1">
                    <div className="flex justify-between items-center gap-3">
                      <h4 className="font-bold text-orange-200 text-sm min-w-0">Dựng Video Ngắn (Shorts / Reel / TikTok)</h4>
                      <span className="font-mono text-orange-300 font-bold text-sm shrink-0 whitespace-nowrap">Liên hệ</span>
                    </div>
                    <p className="text-slate-400">Dưới 60s, chèn phụ đề tự động, meme hiệu ứng nhịp điệu dồn dập.</p>
                  </div>

                  <div className="bg-orange-900/15 p-4 rounded-xl border border-orange-500/30 space-y-1">
                    <div className="flex justify-between items-center gap-3">
                      <h4 className="font-bold text-orange-400 text-sm flex items-center gap-1.5 min-w-0">
                        <Bot className="w-4 h-4 shrink-0" /> <span>Sản xuất Video AI MC Ảo</span>
                      </h4>
                      <span className="font-mono text-orange-400 font-bold text-sm shrink-0 whitespace-nowrap">Liên hệ</span>
                    </div>
                    <p className="text-slate-300">Tạo nhân vật MC ảo giống thật 99%, lồng tiếng AI sinh động, cảnh nền Midjourney.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 5: WEB & SOFTWARE (Span 4) */}
            <div className="bg-gradient-to-r from-[#0f172a] via-[#1e1b4b] to-[#0f172a] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 col-span-1 md:col-span-3 lg:col-span-4 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-6 border border-cyan-500/30">
                <Code2 className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-3 mb-6">
                <h3 className="text-2xl sm:text-3xl font-bold text-white">💻 Lập trình Web & Phần mềm Doanh nghiệp</h3>
                <div className="h-[1px] flex-grow bg-gradient-to-r from-cyan-500/30 to-transparent"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-3">
                  <div className="flex justify-between items-start gap-3">
                    <div className="min-w-0">
                      <h4 className="font-bold text-cyan-300 text-lg">Thiết kế Landing Page</h4>
                      <p className="text-xs text-slate-400 mt-1">Tối ưu UI/UX tập trung vào chuyển đổi chốt đơn</p>
                    </div>
                    <span className="font-mono text-cyan-400 font-bold text-sm shrink-0 whitespace-nowrap">Liên hệ</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                    <li>Gói Template tối ưu sẵn: Tư vấn báo giá</li>
                    <li>Gói Custom thiết kế riêng độc bản: Tư vấn báo giá</li>
                  </ul>
                </div>

                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-3">
                  <div className="flex justify-between items-start gap-3">
                    <div className="min-w-0">
                      <h4 className="font-bold text-indigo-300 text-lg">Phần mềm (Web App / Mini App)</h4>
                      <p className="text-xs text-slate-400 mt-1">Hệ thống quản lý nội bộ doanh nghiệp & bán hàng</p>
                    </div>
                    <span className="font-mono text-indigo-400 font-bold text-sm shrink-0 whitespace-nowrap">Liên hệ</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                    <li>Quản trị cơ bản (CRM, Kho bãi, Báo cáo): Tư vấn báo giá</li>
                    <li>Hệ thống đa luồng dữ liệu lớn & bảo mật cao: Tư vấn báo giá</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* CARD 6: COMBO UPSELL */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-[2px] rounded-3xl col-span-1 md:col-span-3 lg:col-span-4">
              <div className="bg-slate-950 rounded-[22px] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="md:w-5/12 space-y-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 text-amber-300 text-xs font-bold uppercase tracking-wider">
                    <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Hiệu quả nhất
                  </span>
                  <h3 className="text-3xl font-black text-white">Combo Trọn Gói</h3>
                  <p className="text-slate-300 text-sm">
                    Đồng bộ thương hiệu, tối ưu chi phí. Đi đường dài cùng nhau để tạo ra tỷ lệ chuyển đổi thực tế.
                  </p>
                </div>

                <div className="w-full md:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-2 hover:bg-white/10 transition">
                    <h4 className="font-bold text-purple-400 text-base">Khởi chạy (Debut) 🚀</h4>
                    <p className="text-slate-300">
                      Dành cho brand mới: Logo + Khởi tạo Maps + 3 bài đăng mở màn + 1 Video ngắn. Tặng khám Web.
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-2 hover:bg-white/10 transition">
                    <h4 className="font-bold text-blue-400 text-base">Đồng hành (Retainer) 🔁</h4>
                    <p className="text-slate-300">
                      Cam kết hàng tháng: Chăm sóc đa kênh (SEO, Social), dựng Video định kỳ & báo cáo Looker Studio.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* INTERACTIVE BUDGET CALCULATOR SECTION */}
        <section className="pt-8 border-t border-white/10 space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider inline-flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-indigo-400" /> Công Cụ Tính Báo Giá Tự Động
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Dự Toán Chi Phí Website Tự Động
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Minh bạch 100% chi phí. Chọn quy mô và tính năng để biết chính xác tổng ngân sách đầu tư cho dự án của bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* LEFT 2 COLUMNS: CONFIGURATION OPTIONS */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* STEP 1: WEB TYPE */}
              <div className="bg-[#111] rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                    1
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Chọn Loại Hình Website
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {webTypes.map((type) => {
                    const isSelected = selectedWebType === type.id;
                    return (
                      <div 
                        key={type.id}
                        onClick={() => setSelectedWebType(type.id)}
                        className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected 
                            ? 'bg-indigo-900/20 border-indigo-500 shadow-lg scale-[1.01]' 
                            : 'bg-white/5 border-white/5 hover:border-indigo-500/30'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-white text-base">{type.title}</h4>
                            {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-400" />}
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed mb-4">
                            {type.desc}
                          </p>
                        </div>
                        <div className="font-black text-indigo-400 text-base flex items-center gap-1.5">
                          <span>{type.priceLabel}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* STEP 2: ADDITIONAL FEATURES */}
              <div className="bg-[#111] rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-sm">
                    2
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Chọn Tùy Chọn & Tính Năng Bổ Sung
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {featuresOptions.map((feat) => {
                    const isChecked = selectedFeatures.includes(feat.id);
                    return (
                      <div 
                        key={feat.id}
                        onClick={() => toggleFeature(feat.id)}
                        className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between text-xs transition-all ${
                          isChecked 
                            ? 'bg-purple-900/20 border-purple-500 text-purple-200 shadow-sm' 
                            : 'bg-white/5 border-white/5 text-slate-300 hover:border-purple-500/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                            isChecked ? 'bg-purple-600 border-purple-600 text-white' : 'border-slate-600'
                          }`}>
                            {isChecked && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <span className="font-semibold">{feat.title}</span>
                        </div>

                        <span className="font-bold text-purple-400 ml-2 whitespace-nowrap">
                          {feat.priceLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: PRICE SUMMARY & REGISTRATION FORM */}
            <div className="sticky top-28 space-y-6">
              
              <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-indigo-500/30">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4" /> Tổng Ngân Sách Ước Tính
                </div>

                <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-200 to-pink-300 mb-2">
                  Liên Hệ Báo Giá
                </div>
                <p className="text-xs text-indigo-200/80 mb-6">
                  Liên hệ ngay với chuyên gia Fi.tallest để nhận tư vấn trực tiếp & báo giá tối ưu nhất theo quy mô dự án.
                </p>

                <div className="border-t border-slate-800 pt-4 mb-6 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span>Khung thiết kế:</span>
                    <span className="font-bold text-white">
                      {webTypes.find(w => w.id === selectedWebType)?.title}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Số tính năng thêm:</span>
                    <span className="font-bold text-indigo-400">{selectedFeatures.length} tùy chọn</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Thời gian bàn giao:</span>
                    <span className="font-bold text-emerald-400">5 - 10 ngày làm việc</span>
                  </div>
                </div>

                {submitted ? (
                  <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold text-center">
                    Cảm ơn bạn! Đã nhận thông tin báo giá. Sếp Phi sẽ liên hệ lại tư vấn ngay!
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <input 
                        type="text" 
                        required
                        placeholder="Họ tên của bạn *"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <input 
                        type="tel" 
                        required
                        placeholder="Số điện thoại / Zalo *"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <textarea 
                        rows={2}
                        placeholder="Ghi chú thêm yêu cầu đặc biệt..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-sm shadow-lg shadow-indigo-600/40 transition-all flex items-center justify-center gap-2 cursor-pointer shimmer-btn"
                    >
                      <Send className="w-4 h-4" />
                      <span>Gửi Đăng Ký Theo Bảng Báo Giá Này</span>
                    </button>
                  </form>
                )}

              </div>

              <div className="bg-[#111] rounded-2xl p-6 border border-white/10 text-xs text-slate-300 space-y-3">
                <div className="flex items-center gap-2 font-bold text-white">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Cam kết dịch vụ từ Fi.tallest:
                </div>
                <ul className="space-y-1.5 list-disc list-inside text-slate-400">
                  <li>Không phát sinh bất kỳ chi phí ẩn nào.</li>
                  <li>Bảo hành mã nguồn kỹ thuật vĩnh viễn.</li>
                  <li>Hướng dẫn sử dụng & quản trị trực quan.</li>
                </ul>
              </div>

            </div>

          </div>

        </section>

      </div>
    </div>
  );
};
