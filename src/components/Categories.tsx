import React, { useState, useEffect } from 'react';
import { Ruler, Blocks, Droplet, Wrench, Package, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase.from('categories').select('*').limit(8);
        if (error) throw error;
        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const displayCategories = categories.map((cat, i) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description || 'Danh mục sản phẩm vật tư chuyên dụng cao cấp',
    icon: i === 0 ? Ruler : i === 1 ? Blocks : i === 2 ? Droplet : i === 3 ? Wrench : Package,
  }));

  if (!loading && displayCategories.length === 0) {
    return null;
  }

  return (
    <section className="bg-slate-50/60 py-24 shrink-0 relative z-10 overflow-hidden border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-0.5 rounded-full bg-gradient-to-r from-red-600 to-rose-600"></span>
              <span className="text-red-600 font-extrabold text-xs uppercase tracking-[0.2em]">
                DANH MỤC TIÊU BIỂU
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">
              Giải Pháp Vật Tư Chuyên Dụng
            </h2>
          </div>

          <a
            href="#products"
            className="inline-flex items-center gap-2 font-extrabold text-xs text-slate-700 hover:text-red-600 transition-colors uppercase tracking-widest group"
          >
            <span>Tất cả danh mục</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-red-600" size={32} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayCategories.map((cat, index) => {
              const Icon = cat.icon;
              return (
                <a
                  key={cat.id || index}
                  href={`#products?cat=${cat.id}`}
                  className="group relative flex flex-col justify-between p-8 rounded-2xl border border-slate-200/90 bg-white transition-all duration-300 hover:border-red-500/40 hover:shadow-[0_16px_35px_rgba(225,29,72,0.1)] hover:-translate-y-1.5 overflow-hidden"
                >
                  {/* Subtle Background Accent */}
                  <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-red-50 to-rose-50/20 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 text-slate-800 flex items-center justify-center mb-6 group-hover:bg-gradient-to-tr group-hover:from-red-600 group-hover:to-rose-600 group-hover:text-white group-hover:border-red-600 transition-all duration-300 shadow-sm">
                      <Icon size={24} strokeWidth={2} />
                    </div>

                    <h3 className="font-extrabold text-lg uppercase text-slate-900 mb-2.5 group-hover:text-red-600 transition-colors">
                      {cat.name}
                    </h3>
                    
                    <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-extrabold text-slate-400 group-hover:text-red-600 transition-colors uppercase tracking-wider">
                    <span>Khám phá sản phẩm</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
