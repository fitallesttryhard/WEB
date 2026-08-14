import React from 'react';
import { ArrowRight, ShieldCheck, Award, Truck, Sparkles } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

export default function Hero() {
  const { settings } = useSettings();

  const brandColor = settings.brandColor || '#dc2626';
  const banners = settings.banners || [];
  const activeBanner = banners.find((b: any) => b.status !== false) || banners[0];

  const bgImage = activeBanner?.image_url || activeBanner?.image || "https://images.unsplash.com/photo-1541888086903-efdc749f1813?q=80&w=2000&auto=format&fit=crop";
  const heading = activeBanner?.heading || "Cung Cấp Phụ Kiện Xây Dựng Chuyên Nghiệp";
  const subheading = activeBanner?.subheading || "Đồng hành cùng hàng nghìn công trình trên toàn quốc. Cam kết chất lượng chuẩn kiểm định, giao hàng tận nơi và tư vấn giải pháp kỹ thuật tối ưu chi phí.";
  const ctaText = activeBanner?.cta_text || "KHÁM PHÁ SẢN PHẨM";
  const ctaLink = activeBanner?.cta_link || "#products";

  return (
    <section className="relative min-h-[90dvh] w-full bg-slate-950 flex items-center mt-[80px] shrink-0 overflow-hidden">
      {/* Background Layer with Dark Gradient Blend */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-900/60 z-10"></div>
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000"
        style={{
          backgroundImage: `url('${bgImage}')`,
        }}
      ></div>

      {/* Subtle Background Glow Spheres */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none z-10"></div>

      {/* Content Container */}
      <div className="relative z-20 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-20 flex flex-col justify-center items-start">
        
        {/* Live Status Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-xs font-bold uppercase tracking-[0.18em] mb-8 shadow-inner">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <ShieldCheck size={15} className="text-red-400" />
          <span>{settings.companyName || 'Giải pháp Vật tư Xây dựng Toàn diện'}</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white leading-[1.05] mb-8 uppercase tracking-tight text-left max-w-4xl drop-shadow-lg">
          {heading}
        </h1>

        {/* Subheading */}
        <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-12 max-w-2xl font-medium text-left leading-relaxed">
          {subheading}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-16">
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

        {/* Value Propositions Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-white/10 w-full max-w-3xl">
          <div className="flex items-center gap-3 text-slate-300 text-xs font-bold uppercase tracking-wider">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Award size={16} />
            </div>
            <span>Chuẩn CO/CQ Kiểm Định</span>
          </div>

          <div className="flex items-center gap-3 text-slate-300 text-xs font-bold uppercase tracking-wider">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Truck size={16} />
            </div>
            <span>Giao Hàng Công Trình 24/7</span>
          </div>

          <div className="flex items-center gap-3 text-slate-300 text-xs font-bold uppercase tracking-wider">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck size={16} />
            </div>
            <span>Bảo Hành Chính Hãng</span>
          </div>
        </div>

      </div>
    </section>
  );
}
