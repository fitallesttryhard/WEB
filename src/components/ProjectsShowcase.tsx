"use client";
import React, { useState, useEffect } from 'react';
import { Building2, MapPin, Sparkles, X, Send, ArrowUpRight, ShieldCheck, ChevronRight, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../supabaseClient';

import { getProjects, SBUILD_TENANT_ID } from '../projectServices';

export default function ProjectsShowcase() {
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('Tất cả công trình');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { openDrawer } = useCart();

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true);
        const data = await getProjects(SBUILD_TENANT_ID);
        setProjectsList(data);
      } catch (err) {
        console.warn('Lỗi nạp dự án:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  const defaultCategories = ['Chung cư cao cấp', 'Trung tâm thương mại', 'Resort & Biệt thự', 'Nhà xưởng công nghiệp'];
  const projectCategories = Array.from(new Set(projectsList.map(p => p.category).filter(Boolean)));
  const categories = ['Tất cả công trình', ...Array.from(new Set([...projectCategories, ...defaultCategories]))];

  const filteredProjects = activeCategory === 'Tất cả công trình' 
    ? projectsList 
    : projectsList.filter(p => p.category === activeCategory);

  return (
    <section className="py-16 sm:py-20 bg-[#f8f8f6] text-slate-900 font-sans border-t border-b border-slate-200/60 relative" id="projects">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* OPEN DESIGN LUXURY ARCHITECTURAL STATEMENT HEADER */}
        <div className="max-w-3xl mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold uppercase tracking-widest">
            <Sparkles size={13} className="text-amber-400" />
            <span>SBUILD PORTFOLIO // CASE STUDIES</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 uppercase tracking-tight leading-[1.15]">
            Kiến tạo không gian <br className="hidden sm:block" />
            <span className="text-slate-500 font-bold">bền vững với thời gian...</span>
          </h2>

          <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed max-w-2xl pt-1">
            Đồng hành cùng hơn 500+ chủ đầu tư và nhà thầu hàng đầu Việt Nam cung ứng giải pháp nẹp & phụ kiện xây dựng chuẩn CO/CQ kiểm định.
          </p>
        </div>

        {/* STATS STRIP & CATEGORY PILLS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-slate-200">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-6 text-xs font-bold text-slate-500 shrink-0">
            <div>
              <span className="text-lg font-black text-slate-900 block">500+</span>
              <span className="text-[10px] text-slate-400 uppercase">Dự án lớn</span>
            </div>
            <div className="w-px h-6 bg-slate-200"></div>
            <div>
              <span className="text-lg font-black text-slate-900 block">100%</span>
              <span className="text-[10px] text-slate-400 uppercase">Đạt CO/CQ</span>
            </div>
            <div className="w-px h-6 bg-slate-200"></div>
            <div>
              <span className="text-lg font-black text-slate-900 block">63</span>
              <span className="text-[10px] text-slate-400 uppercase">Tỉnh thành</span>
            </div>
          </div>
        </div>

        {/* LUXURY ARCHITECTURAL CARDS GRID (PINTEREST STYLE) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {filteredProjects.map((project, idx) => (
            <div
              key={project.id || idx}
              onClick={() => setSelectedProject(project)}
              className="group bg-white rounded-[2rem] border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col cursor-pointer"
            >
              {/* Image Container with Floating Badges */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                <img 
                  src={project.image || project.image_url} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent"></div>
                
                {/* Number Badge Top Left */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-slate-900 font-mono font-black text-xs px-3 py-1 rounded-full shadow-sm border border-slate-200/80">
                  0{idx + 1}
                </div>

                {/* Category Badge Top Right */}
                <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md text-white font-bold text-[11px] uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                  {project.category}
                </div>

                {/* Location Badge Bottom Left */}
                <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">
                  <MapPin size={13} className="text-red-400 shrink-0" />
                  <span>{project.location}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <span className="flex items-center gap-1 text-slate-700 font-bold">
                      <Building2 size={14} className="text-amber-500" /> {project.scale}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-red-600 transition-colors leading-snug line-clamp-1 mb-2">
                    {project.title}
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                </div>

                {/* Materials Tags & CTA Button */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-1.5">
                    {(Array.isArray(project.materials) ? project.materials : []).slice(0, 2).map((m: string, i: number) => (
                      <span key={i} className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200/60">
                        ✓ {m}
                      </span>
                    ))}
                  </div>

                  <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300 flex items-center justify-center shrink-0">
                    <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* LUXURY ARCHITECTURAL PROJECT DETAIL MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white text-slate-900 w-full max-w-3xl rounded-[2rem] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200 my-6 border border-slate-200">
            
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 bg-white/90 hover:bg-white rounded-full border border-slate-200 transition-colors z-20 shadow-md"
            >
              <X size={18} />
            </button>

            {/* Banner Image */}
            <div className="relative aspect-[16/8] w-full overflow-hidden bg-slate-100">
              <img 
                src={selectedProject.image || selectedProject.image_url} 
                alt={selectedProject.title} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="bg-red-600 text-white font-bold text-[10px] uppercase px-3 py-1 rounded-full tracking-wider">
                  {selectedProject.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-black uppercase mt-2 drop-shadow-md">
                  {selectedProject.title}
                </h3>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-6 sm:p-8 space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Vị trí công trình</span>
                    <p className="font-bold text-slate-900 text-xs">{selectedProject.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Building2 size={16} />
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Quy mô công trình</span>
                    <p className="font-bold text-slate-900 text-xs">{selectedProject.scale}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Giải pháp vật tư cung ứng:</h4>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                  {selectedProject.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Vật tư SBUILD đã cung ứng:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(Array.isArray(selectedProject.materials) ? selectedProject.materials : []).map((m: string, i: number) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-bold flex items-center gap-2 text-slate-800">
                      <ShieldCheck size={16} className="text-green-600 shrink-0" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => {
                    setSelectedProject(null);
                    openDrawer();
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl font-black uppercase tracking-wider text-xs transition-all shadow-md shadow-red-500/20 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <Send size={15} />
                  Yêu Cầu Báo Giá Vật Tư Dự Án Tương Tự
                </button>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold uppercase tracking-wider text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Đóng
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
}
