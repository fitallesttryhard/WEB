"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Target,
  Eye,
  Layers,
  Wrench,
  FlaskConical,
  Settings,
  Puzzle,
  FileText,
  Box,
  MessageSquare,
  Truck,
  Building2,
  HardHat,
  Compass,
  Handshake,
  ChevronRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { DEFAULT_ABOUT_PAGE_CONFIG, AboutPageConfig } from '../types/about';

// Helper to map icon names to Lucide icons
const renderIcon = (iconName: string, size = 20, className = '') => {
  switch (iconName?.toLowerCase()) {
    case 'target': return <Target size={size} className={className} />;
    case 'eye': return <Eye size={size} className={className} />;
    case 'layers': return <Layers size={size} className={className} />;
    case 'wrench': return <Wrench size={size} className={className} />;
    case 'flaskconical':
    case 'beaker':
    case 'flask': return <FlaskConical size={size} className={className} />;
    case 'settings':
    case 'gear': return <Settings size={size} className={className} />;
    case 'puzzle': return <Puzzle size={size} className={className} />;
    case 'filetext':
    case 'document': return <FileText size={size} className={className} />;
    case 'box':
    case 'package': return <Box size={size} className={className} />;
    case 'messagesquare':
    case 'chat': return <MessageSquare size={size} className={className} />;
    case 'truck':
    case 'delivery': return <Truck size={size} className={className} />;
    case 'building':
    case 'building2': return <Building2 size={size} className={className} />;
    case 'hardhat': return <HardHat size={size} className={className} />;
    case 'draftingcompass':
    case 'compass': return <Compass size={size} className={className} />;
    case 'handshake': return <Handshake size={size} className={className} />;
    default: return <Sparkles size={size} className={className} />;
  }
};

export default function AboutPageDetail() {
  const { settings } = useSettings();
  const config: AboutPageConfig = settings?.aboutPageConfig || DEFAULT_ABOUT_PAGE_CONFIG;

  const {
    hero = DEFAULT_ABOUT_PAGE_CONFIG.hero,
    whoWeAre = DEFAULT_ABOUT_PAGE_CONFIG.whoWeAre,
    missionVision = DEFAULT_ABOUT_PAGE_CONFIG.missionVision,
    solutions = DEFAULT_ABOUT_PAGE_CONFIG.solutions,
    coreValues = DEFAULT_ABOUT_PAGE_CONFIG.coreValues,
    team = DEFAULT_ABOUT_PAGE_CONFIG.team,
    partners = DEFAULT_ABOUT_PAGE_CONFIG.partners,
    ctaBanner = DEFAULT_ABOUT_PAGE_CONFIG.ctaBanner
  } = config;

  return (
    <div className="w-full bg-white font-sans text-slate-800">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[480px] lg:min-h-[540px] flex items-center justify-start overflow-hidden bg-slate-950">
        {/* Background Image with Dark Vignette Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={hero.backgroundImage || '/images/about/about-hero.jpg'}
            alt="SBUILD Architecture"
            className="w-full h-full object-cover object-center brightness-[0.75]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 w-full">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6 uppercase tracking-wider">
            <Link href="/" className="hover:text-white transition-colors">{hero.breadcrumbHome || 'Trang chủ'}</Link>
            <span className="text-red-500">/</span>
            <span className="text-white">{hero.breadcrumbCurrent || 'Giới thiệu'}</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            {/* Tag / Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-8 h-[2px] bg-red-600"></span>
              <span className="text-xs font-black uppercase tracking-[0.25em] text-red-500">
                {hero.badge || 'VỀ SBUILD'}
              </span>
            </div>

            {/* H1 Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight leading-[1.15] mb-5 drop-shadow-md">
              {hero.title || 'VẬT TƯ & GIẢI PHÁP HOÀN THIỆN CÔNG TRÌNH'}
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-sm sm:text-base lg:text-lg font-normal leading-relaxed mb-8 max-w-xl">
              {hero.subtitle || 'Từ lựa chọn vật liệu đến từng chi tiết hoàn thiện, SBUILD đồng hành cùng nhu cầu thi công thực tế.'}
            </p>

            {/* CTA Button */}
            {hero.ctaText && (
              <a
                href={hero.ctaLink || '#solutions'}
                className="inline-flex items-center gap-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white px-7 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-xl shadow-red-600/30 group"
              >
                <span>{hero.ctaText}</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
            )}
          </motion.div>
        </div>
      </section>

      {/* 2. CHÚNG TÔI LÀ AI */}
      <section className="py-20 lg:py-28 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Corner Trim Tile Macro Photo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-100 group bg-slate-100 aspect-[4/3]">
                <img
                  src={whoWeAre.image || '/images/about/about-tile-trim.jpg'}
                  alt="SBUILD Nẹp hoàn thiện"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>
            </motion.div>

            {/* Right Column: Text & 3 Badges */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-6 flex flex-col justify-center"
            >
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-8 h-[2px] bg-red-600"></span>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-red-600">
                  {whoWeAre.badge || 'CHÚNG TÔI LÀ AI'}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-5">
                {whoWeAre.heading || 'Hoàn thiện bắt đầu từ lựa chọn đúng'}
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
                {whoWeAre.description || 'SBUILD cung cấp nẹp, vật tư và giải pháp phục vụ hoàn thiện xây dựng. Chúng tôi kết nối sản phẩm với ứng dụng, giúp khách hàng lựa chọn phù hợp với từng hạng mục thi công.'}
              </p>

              {/* 3 Feature Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(whoWeAre.featurePills || []).map((pill) => (
                  <div
                    key={pill.id}
                    className="flex items-center sm:flex-col sm:items-center justify-center gap-2 sm:gap-2.5 p-3.5 sm:p-4 rounded-xl border border-slate-200/90 bg-slate-50/70 hover:bg-white hover:border-red-300 hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all">
                      {renderIcon(pill.icon, 16)}
                    </div>
                    <span className="text-[11px] font-black tracking-wider uppercase text-slate-700 text-center group-hover:text-slate-900">
                      {pill.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. SỨ MỆNH & TẦM NHÌN */}
      <section className="py-16 bg-slate-50/80 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            
            {/* Card 1: SỨ MỆNH */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white p-7 sm:p-9 rounded-2xl border border-slate-200/80 shadow-xs hover:border-red-300 hover:shadow-lg transition-all duration-300 flex items-start gap-5"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 shadow-xs">
                <Target size={26} className="stroke-[2.2]" />
              </div>
              <div className="flex-1">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-red-600 block mb-1">
                  {missionVision.mission.badge || 'SỨ MỆNH'}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2">
                  {missionVision.mission.title || 'Chỉn chu từ những chi tiết nhỏ'}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {missionVision.mission.description || 'Cung cấp vật tư và giải pháp phù hợp, góp phần tạo nên những công trình được hoàn thiện chính xác và đồng bộ.'}
                </p>
              </div>
            </motion.div>

            {/* Card 2: TẦM NHÌN */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-7 sm:p-9 rounded-2xl border border-slate-200/80 shadow-xs hover:border-red-300 hover:shadow-lg transition-all duration-300 flex items-start gap-5"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 shadow-xs">
                <Eye size={26} className="stroke-[2.2]" />
              </div>
              <div className="flex-1">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-red-600 block mb-1">
                  {missionVision.vision.badge || 'TẦM NHÌN'}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2">
                  {missionVision.vision.title || 'Đối tác cho nhu cầu hoàn thiện'}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {missionVision.vision.description || 'Hướng tới trở thành đối tác cung ứng được tin cậy bởi nhà thầu, đội thi công, kiến trúc sư và đại lý.'}
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 4. SẢN PHẨM / GIẢI PHÁP CHO TỪNG HẠNG MỤC */}
      <section id="solutions" className="py-20 lg:py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center justify-center gap-2 mb-2">
              <span className="w-6 h-[2px] bg-red-600"></span>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-red-600">
                {solutions.badge || 'SẢN PHẨM'}
              </span>
              <span className="w-6 h-[2px] bg-red-600"></span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-3">
              {solutions.title || 'Giải pháp cho từng hạng mục'}
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              {solutions.subtitle || 'Danh mục vật tư gắn với nhu cầu hoàn thiện và thi công.'}
            </p>
          </div>

          {/* 3 Solution Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(solutions.items || []).map((item, idx) => (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col hover:border-red-300 hover:shadow-xl transition-all duration-300 group"
              >
                {/* Image */}
                <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 mb-2 group-hover:text-red-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>

                  <Link
                    href={item.link || '/products'}
                    className="inline-flex items-center gap-1.5 text-xs font-black text-red-600 hover:text-red-700 uppercase tracking-wider group/btn"
                  >
                    <span>XEM SẢN PHẨM</span>
                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. GIÁ TRỊ CỐT LÕI (DARK NAVY THEME) */}
      <section className="py-20 lg:py-24 bg-slate-950 text-white relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center justify-center gap-2 mb-2">
              <span className="w-6 h-[2px] bg-red-600"></span>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-red-500">
                {coreValues.badge || 'GIÁ TRỊ CỐT LÕI'}
              </span>
              <span className="w-6 h-[2px] bg-red-600"></span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {coreValues.title || 'Lựa chọn phù hợp. Thi công chỉn chu.'}
            </h2>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {(coreValues.items || []).map((val, idx) => (
              <motion.div
                key={val.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-red-500/40 hover:bg-slate-900 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-red-600/15 border border-red-500/30 text-red-500 flex items-center justify-center mb-4 shadow-inner">
                  {renderIcon(val.icon, 22)}
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white mb-2">
                  {val.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {val.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CON NGƯỜI / ĐỘI NGŨ PHÁT TRIỂN SBUILD */}
      <section className="py-20 lg:py-28 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center justify-center gap-2 mb-2">
              <span className="w-6 h-[2px] bg-red-600"></span>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-red-600">
                {team.badge || 'CON NGƯỜI'}
              </span>
              <span className="w-6 h-[2px] bg-red-600"></span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-2">
              {team.title || 'Đội ngũ phát triển SBUILD'}
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              {team.subtitle || 'Cùng kết nối sản phẩm, nhu cầu thi công và trải nghiệm khách hàng.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left: Team Photo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-100 bg-slate-100 aspect-[16/10] group">
                <img
                  src={team.image || '/images/about/about-team.jpg'}
                  alt="Đội ngũ SBUILD"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </motion.div>

            {/* Right: 3 Support Pillars */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-6 space-y-4"
            >
              {(team.pillars || []).map((pillar, idx) => (
                <div
                  key={pillar.id || idx}
                  className="p-5 sm:p-6 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-red-300 hover:shadow-md transition-all duration-300 flex items-start gap-4 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 group-hover:bg-red-600 group-hover:text-white transition-colors">
                    {renderIcon(pillar.icon, 20)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1 group-hover:text-red-600 transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>

          </div>
        </div>
      </section>

      {/* 7. ĐỐI TÁC KHÁCH HÀNG */}
      <section className="py-16 bg-slate-50/60 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center justify-center gap-2 mb-2">
              <span className="w-6 h-[2px] bg-red-600"></span>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-red-600">
                {partners.badge || 'ĐỐI TÁC KHÁCH HÀNG'}
              </span>
              <span className="w-6 h-[2px] bg-red-600"></span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
              {partners.title || 'Kết nối cùng người làm công trình'}
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">
              {partners.subtitle || 'SBUILD đồng hành cùng nhiều đối tượng trong ngành xây dựng hoàn thiện.'}
            </p>
          </div>

          {/* 4 Partners Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {(partners.items || []).map((partner, idx) => (
              <motion.div
                key={partner.id || idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col items-center justify-center gap-3 text-center hover:border-red-400 hover:shadow-md transition-all group cursor-default"
              >
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all">
                  {renderIcon(partner.icon, 20)}
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 group-hover:text-red-600 transition-colors">
                  {partner.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CTA BOTTOM BANNER */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-8 sm:p-12 shadow-[0_20px_50px_rgba(225,29,72,0.25)] border border-red-500/30">
            {/* Background Ambient Circles */}
            <div className="absolute -right-10 -bottom-10 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute left-1/4 -top-10 w-48 h-48 bg-black/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight mb-2">
                  {ctaBanner.title || 'Cùng tìm giải pháp cho công trình của bạn'}
                </h3>
                <p className="text-red-100 text-xs sm:text-sm font-medium max-w-xl">
                  {ctaBanner.subtitle || 'Trao đổi nhu cầu để lựa chọn vật tư phù hợp với từng hạng mục.'}
                </p>
              </div>

              <Link
                href={ctaBanner.buttonLink || '/contact'}
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-950 text-red-600 hover:text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-xl active:scale-95 shrink-0"
              >
                <span>{ctaBanner.buttonText || 'LIÊN HỆ SBUILD'}</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
