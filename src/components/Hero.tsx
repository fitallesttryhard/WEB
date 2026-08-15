import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, Award, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

export default function Hero() {
  const { settings } = useSettings();

  const brandColor = settings.brandColor || '#dc2626';
  const banners = settings.banners || [];
  const activeBanners = banners.filter((b: any) => b.status !== false);
  
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fallback banner if none configured or active
  const defaultBanner = {
    image_url: "https://images.unsplash.com/photo-1541888086903-efdc749f1813?q=80&w=2000&auto=format&fit=crop",
    heading: "Cung Cấp Phụ Kiện Xây Dựng Chuyên Nghiệp",
    subheading: "Đồng hành cùng hàng nghìn công trình trên toàn quốc. Cam kết chất lượng chuẩn kiểm định, giao hàng tận nơi và tư vấn giải pháp kỹ thuật tối ưu chi phí.",
    cta_text: "KHÁM PHÁ SẢN PHẨM",
    cta_link: "#products",
  };

  const displayBanners = activeBanners.length > 0 ? activeBanners : [defaultBanner];

  // Auto rotation if multiple banners
  useEffect(() => {
    if (displayBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [displayBanners.length]);

  const activeBanner = displayBanners[currentIndex] || displayBanners[0];

  const bgImage = activeBanner?.image_url || activeBanner?.image || defaultBanner.image_url;
  const heading = activeBanner?.heading || defaultBanner.heading;
  const subheading = activeBanner?.subheading || defaultBanner.subheading;
  const ctaText = activeBanner?.cta_text || defaultBanner.cta_text;
  const ctaLink = activeBanner?.cta_link || defaultBanner.cta_link;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + displayBanners.length) % displayBanners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % displayBanners.length);
  };

  const layoutType = activeBanner?.layout_type || 'standard';
  const prop1 = activeBanner?.prop_1 || 'Chuẩn CO/CQ Kiểm Định';
  const prop2 = activeBanner?.prop_2 || 'Giao Hàng Công Trình 24/7';
  const prop3 = activeBanner?.prop_3 || 'Bảo Hành Chính Hãng';

  return (
    <section className="relative min-h-[90dvh] w-full bg-slate-950 flex items-center mt-[80px] shrink-0 overflow-hidden group">
      {/* Background Image Layer */}
      <div 
        key={currentIndex}
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-60 transition-opacity duration-1000 scale-105"
        style={{
          backgroundImage: `url('${bgImage}')`,
        }}
      ></div>

      {/* Subtle Dark Gradient Overlay for optimal readability without completely blacking out the image */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-950/40 z-10 pointer-events-none"></div>

      {/* Subtle Background Glow Spheres */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none z-10"></div>

      {/* Slider Controls (if multiple active banners) */}
      {displayBanners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/40 hover:bg-red-600 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-lg"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/40 hover:bg-red-600 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-lg"
            aria-label="Next Slide"
          >
            <ChevronRight size={24} />
          </button>

          {/* Indicator Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
            {displayBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 rounded-full transition-all ${
                  idx === currentIndex ? 'w-8 bg-red-600' : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Content Container */}
      <div className="relative z-20 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-20 flex flex-col justify-center items-start">
        
        {/* Top Badges for layout_type 'badge_pills' */}
        {layoutType === 'badge_pills' && (
          <div className="flex flex-wrap items-center gap-2.5 mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Award size={14} className="text-amber-400" />
              <span>{prop1}</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Truck size={14} className="text-blue-400" />
              <span>{prop2}</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>{prop3}</span>
            </div>
          </div>
        )}

        {/* Live Status Pill Badge (Standard Layout) */}
        {layoutType === 'standard' && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-xs font-bold uppercase tracking-[0.18em] mb-8 shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <ShieldCheck size={15} className="text-red-400" />
            <span>{settings.companyName || 'Giải pháp Vật tư Xây dựng Toàn diện'}</span>
          </div>
        )}

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white leading-[1.05] mb-8 uppercase tracking-tight text-left max-w-4xl drop-shadow-lg transition-all duration-500">
          {heading}
        </h1>

        {/* Subheading */}
        <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-12 max-w-2xl font-medium text-left leading-relaxed transition-all duration-500">
          {subheading}
        </p>

        {/* Action Buttons */}
        <div className={`flex flex-col sm:flex-row gap-4 w-full sm:w-auto ${layoutType === 'standard' ? 'mb-16' : 'mb-8'}`}>
          <a
            href={ctaLink}
            className="group relative inline-flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-sm font-extrabold tracking-widest uppercase rounded-xl transition-all shadow-[0_10px_30px_rgba(220,38,38,0.3)] hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>{ctaText}</span>
            <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
          </a>

          <a
            href="#contact"
            className="inline-flex items-center justify-center bg-white/5 hover:bg-white/10 text-white border border-white/20 hover:border-white/40 px-8 py-4 text-sm font-extrabold tracking-widest uppercase rounded-xl backdrop-blur-md transition-all active:scale-95"
          >
            YÊU CẦU BÁO GIÁ
          </a>
        </div>

        {/* Value Propositions Strip (Standard Layout Only) */}
        {layoutType === 'standard' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-white/10 w-full max-w-3xl">
            <div className="flex items-center gap-3 text-slate-300 text-xs font-bold uppercase tracking-wider">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Award size={16} />
              </div>
              <span>{prop1}</span>
            </div>

            <div className="flex items-center gap-3 text-slate-300 text-xs font-bold uppercase tracking-wider">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <Truck size={16} />
              </div>
              <span>{prop2}</span>
            </div>

            <div className="flex items-center gap-3 text-slate-300 text-xs font-bold uppercase tracking-wider">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck size={16} />
              </div>
              <span>{prop3}</span>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
