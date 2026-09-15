"use client";
import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, Award, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

export default function Hero() {
  const { settings } = useSettings();

  const banners = settings.banners || [];
  const activeBanners = banners.filter((b: any) => {
    if (b.status === false) return false;
    const str = `${b.heading || ''} ${b.subheading || ''} ${b.prop_1 || ''}`.toLowerCase().replace(/[^a-z0-9]/g, '');
    return !str.includes('fitallest') && !str.includes('0909876817');
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>({});

  // Fallback banner if none configured or active
  const defaultBanner = {
    image_url: "/images/hero-banner.webp",
    heading: "Kiến Tạo Không Gian Sống",
    subheading: "Sbuild - Cùng bạn xây dựng tương lai vững chắc",
    cta_text: "XEM DỰ ÁN",
    cta_link: "/projects",
    prop_1: "CHUẨN CO/CQ KIỂM ĐỊNH",
    prop_2: "Giao Hàng Công Trình 24/7",
    prop_3: "Bảo Hành Chính Hãng",
  };

  const displayBanners = activeBanners.length > 0 ? activeBanners : [defaultBanner];

  // Preload all admin-configured banner images into browser cache immediately
  useEffect(() => {
    displayBanners.forEach((b: any) => {
      const url = b.image_url || b.image;
      if (url) {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          setLoadedImages((prev) => ({ ...prev, [url]: true }));
        };
      }
    });
  }, [displayBanners]);

  // Auto rotation if multiple banners
  useEffect(() => {
    if (displayBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [displayBanners.length]);

  const activeBanner = displayBanners[currentIndex] || displayBanners[0];

  const heading = activeBanner?.heading || defaultBanner.heading;
  const subheading = activeBanner?.subheading || defaultBanner.subheading;
  const ctaText = activeBanner?.cta_text || defaultBanner.cta_text;
  const rawCtaLink = activeBanner?.cta_link || activeBanner?.ctaLink;
  const ctaLink = (rawCtaLink && rawCtaLink.trim() !== '' && rawCtaLink !== '#') ? rawCtaLink : '/products';

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + displayBanners.length) % displayBanners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % displayBanners.length);
  };

  const layoutType = activeBanner?.layout_type || 'standard';
  const prop1 = activeBanner?.prop_1 || 'CÔNG TY TNHH ĐẦU TƯ XÂY DỰNG SBUILD';
  const prop2 = activeBanner?.prop_2 || 'Giao Hàng Công Trình 24/7';
  const prop3 = activeBanner?.prop_3 || 'Bảo Hành Chính Hãng';

  return (
    <section className="relative min-h-[90dvh] w-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 flex items-center mt-[80px] shrink-0 overflow-hidden group">
      
      {/* Architectural Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0c_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0c_1px,transparent_1px)] bg-[size:36px_36px] z-10 pointer-events-none opacity-50"></div>

      {/* Background Image Layers with Double Buffering from Admin Selection */}
      {displayBanners.map((banner: any, idx: number) => {
        const url = banner.image_url || banner.image || defaultBanner.image_url;
        const isActive = idx === currentIndex;
        return (
          <div
            key={url + idx}
            className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-70 z-0 pointer-events-auto' : 'opacity-0 -z-10 pointer-events-none'
            }`}
          >
            <img 
              src={url}
              alt={banner.heading || "Hero Background"}
              fetchPriority={isActive ? "high" : "low"}
              loading="eager"
              decoding="async"
              className={`w-full h-full object-cover transform ${
                isActive ? 'scale-105 animate-kenburns' : 'scale-100'
              } transition-transform duration-1000`}
            />
          </div>
        );
      })}

      {/* Warm Premium Gradient Overlay for perfect readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/45 z-10 pointer-events-none"></div>

      {/* Subtle Background Glow Spheres */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none z-10 animate-pulse-glow"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none z-10 animate-pulse-glow delay-300"></div>

      {/* Slider Controls (if multiple active banners) */}
      {displayBanners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/40 hover:bg-red-600 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-lg hover:scale-110 active:scale-95"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/40 hover:bg-red-600 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-lg hover:scale-110 active:scale-95"
            aria-label="Next Slide"
          >
            <ChevronRight size={24} />
          </button>

          {/* Indicator Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
            {displayBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-8 bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.8)]' : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Content Container with Entrance Animations */}
      <div className="relative z-20 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-20 flex flex-col justify-center items-start">
        
        {/* Top Badges for layout_type 'badge_pills' */}
        {layoutType === 'badge_pills' && (
          <div className="flex flex-wrap items-center gap-2.5 mb-8 animate-fade-in-down delay-100">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm">
              <Award size={14} className="text-amber-400 animate-pulse" />
              <span>{prop1}</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm">
              <Truck size={14} className="text-blue-400" />
              <span>{prop2}</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>{prop3}</span>
            </div>
          </div>
        )}

        {/* Live Status Pill Badge (Standard Layout) */}
        {layoutType === 'standard' && (
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-xs font-bold uppercase tracking-[0.18em] mb-8 shadow-inner animate-fade-in-down delay-100">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <ShieldCheck size={15} className="text-red-400" />
            <span>{settings.companyName || 'Giải pháp Vật tư Xây dựng Toàn diện'}</span>
          </div>
        )}

        {/* Hero Title */}
        <h1 
          key={`heading-${currentIndex}`}
          className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-[1.05] mb-8 uppercase tracking-tight text-left max-w-4xl drop-shadow-xl animate-fade-in-up delay-200"
        >
          {heading}
        </h1>

        {/* Subheading */}
        <p 
          key={`subheading-${currentIndex}`}
          className="text-base sm:text-lg md:text-xl text-slate-300 mb-12 max-w-2xl font-medium text-left leading-relaxed animate-fade-in-up delay-300"
        >
          {subheading}
        </p>

        {/* Action Buttons with Shimmer & Hover Glow */}
        <div className={`flex flex-col sm:flex-row gap-4 w-full sm:w-auto ${layoutType === 'standard' ? 'mb-16' : 'mb-8'} animate-fade-in-up delay-400`}>
          <a
            href={ctaLink}
            className="group relative overflow-hidden inline-flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white px-8 py-4 text-sm font-black tracking-widest uppercase rounded-xl transition-all shadow-[0_10px_30px_rgba(225,29,72,0.4)] hover:shadow-[0_15px_35px_rgba(225,29,72,0.6)] hover:-translate-y-1 active:translate-y-0"
          >
            {/* Shimmer Light Beam Effect */}
            <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full animate-shimmer pointer-events-none"></span>
            <span className="relative z-10">{ctaText}</span>
            <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1.5 transition-transform" />
          </a>

          <a
            href="/contact"
            className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 px-8 py-4 text-sm font-extrabold tracking-widest uppercase rounded-xl backdrop-blur-md transition-all hover:-translate-y-0.5 active:scale-95 shadow-md"
          >
            YÊU CẦU BÁO GIÁ
          </a>
        </div>

        {/* Value Propositions Strip (Standard Layout Only) */}
        {layoutType === 'standard' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-white/10 w-full max-w-3xl animate-fade-in-up delay-500">
            <div className="flex items-center gap-3 text-slate-300 text-xs font-bold uppercase tracking-wider group/prop">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 group-hover/prop:scale-110 transition-transform shadow-sm">
                <Award size={18} />
              </div>
              <span>{prop1}</span>
            </div>

            <div className="flex items-center gap-3 text-slate-300 text-xs font-bold uppercase tracking-wider group/prop">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 group-hover/prop:scale-110 transition-transform shadow-sm">
                <Truck size={18} />
              </div>
              <span>{prop2}</span>
            </div>

            <div className="flex items-center gap-3 text-slate-300 text-xs font-bold uppercase tracking-wider group/prop">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 group-hover/prop:scale-110 transition-transform shadow-sm">
                <ShieldCheck size={18} />
              </div>
              <span>{prop3}</span>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
