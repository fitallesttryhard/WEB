"use client";
import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, X, ArrowUpRight, ShieldCheck, ArrowRight, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { getArticles, Article } from '../articleServices';

// In-memory cache for articles to eliminate re-fetch delay
let cachedArticlesList: Article[] | null = null;

export default function ProjectsShowcase() {
  const [articlesList, setArticlesList] = useState<Article[]>(() => cachedArticlesList || []);
  const [activeCategory, setActiveCategory] = useState('Tất cả cẩm nang');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(!cachedArticlesList);
  const { openDrawer } = useCart();

  useEffect(() => {
    async function loadArticles() {
      try {
        if (!cachedArticlesList) {
          setLoading(true);
        }
        const data = await getArticles();
        if (data && data.length > 0) {
          const published = data.filter(a => a.is_published !== false);
          cachedArticlesList = published;
          setArticlesList(published);
        }
      } catch (err) {
        console.warn('Lỗi nạp bài viết cẩm nang:', err);
      } finally {
        setLoading(false);
      }
    }
    loadArticles();
  }, []);

  const defaultCategories = ['Kỹ Thuật Thi Công', 'Cẩm Nang Vật Tư', 'Kinh Nghiệm Thực Tế', 'Tiêu Chuẩn & Báo Giá'];
  const articleCategories = Array.from(new Set(articlesList.map(a => a.category).filter(Boolean)));
  const categories = ['Tất cả cẩm nang', ...Array.from(new Set([...defaultCategories, ...articleCategories]))];

  const filteredArticles = activeCategory === 'Tất cả cẩm nang' 
    ? articlesList 
    : articlesList.filter(a => a.category === activeCategory);

  return (
    <section className="py-16 sm:py-20 bg-[#f8f8f6] text-slate-900 font-sans border-t border-b border-slate-200/60 relative" id="cam-nang-thi-cong">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER SECTION: CẨM NANG & KINH NGHIỆM THI CÔNG */}
        <div className="max-w-3xl mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold uppercase tracking-widest">
            <Sparkles size={13} className="text-amber-400" />
            <span>SBUILD KNOWLEDGE // CHIA SẺ KỸ THUẬT</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 uppercase tracking-tight leading-[1.15]">
            Cẩm nang & <br className="hidden sm:block" />
            <span className="text-slate-500 font-bold">Kinh nghiệm thi công...</span>
          </h2>

          <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed max-w-2xl pt-1">
            Tổng hợp quy chuẩn kỹ thuật lắp đặt nẹp, giải pháp xử lý chi tiết kiến trúc và kinh nghiệm thực chiến từ đội ngũ kỹ sư chuyên gia SBUILD.
          </p>
        </div>

        {/* FULL-WIDTH CATEGORY FILTER TABS (METRICS STRIP REMOVED FOR MAXIMUM TAB SPACE) */}
        <div className="mb-10 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-2">
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
        </div>

        {/* LUXURY ARCHITECTURAL CARDS GRID */}
        {loading && articlesList.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-sm font-medium">
            Đang tải dữ liệu cẩm nang thi công...
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8">
            <p className="text-slate-500 font-medium">Chưa có bài viết trong chuyên mục này.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {filteredArticles.slice(0, 6).map((article, idx) => (
              <div
                key={article.id || idx}
                onClick={() => setSelectedArticle(article)}
                className="group bg-white rounded-[2rem] border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col cursor-pointer"
              >
                {/* Image Container with Floating Badges */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <img 
                    src={article.cover_image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop'} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent"></div>
                  
                  {/* Number Badge Top Left */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-slate-900 font-mono font-black text-xs px-3 py-1 rounded-full shadow-sm border border-slate-200/80">
                    0{idx + 1}
                  </div>

                  {/* Category Badge Top Right */}
                  <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md text-white font-bold text-[11px] uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                    {article.category}
                  </div>

                  {/* Read Time / Date Badge Bottom Left */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">
                    <Clock size={13} className="text-amber-400 shrink-0" />
                    <span>{article.read_time || '4 phút đọc'}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      <span className="flex items-center gap-1.5 text-slate-700 font-bold">
                        <BookOpen size={14} className="text-amber-500" /> {article.author || 'Ban Kỹ Thuật S-BUILD'}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {new Date(article.created_at || Date.now()).toLocaleDateString('vi-VN')}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-red-600 transition-colors leading-snug line-clamp-2 mb-2">
                      {article.title}
                    </h3>

                    <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>

                  {/* Topic Tags & Action Button */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-1.5">
                      {(Array.isArray(article.tags) ? article.tags : ['Chuẩn kỹ thuật', 'Vật tư CO/CQ']).slice(0, 2).map((tag: string, i: number) => (
                        <span key={i} className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200/60">
                          ✓ {tag}
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
        )}

        {/* BOTTOM SECTION CTA */}
        <div className="flex justify-center pt-2">
          <a
            href="/blog"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md shadow-slate-900/10 active:scale-95 cursor-pointer"
          >
            <span>Xem tất cả cẩm nang & kinh nghiệm thi công</span>
            <ArrowRight size={15} />
          </a>
        </div>

      </div>

      {/* LUXURY ARCHITECTURAL ARTICLE DETAIL MODAL */}
      {selectedArticle && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white text-slate-900 w-full max-w-3xl rounded-[2rem] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200 my-6 border border-slate-200">
            
            <button 
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 bg-white/90 hover:bg-white rounded-full border border-slate-200 transition-colors z-20 shadow-md cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Banner Image */}
            <div className="relative aspect-[16/8] w-full overflow-hidden bg-slate-100">
              <img 
                src={selectedArticle.cover_image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop'} 
                alt={selectedArticle.title} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="bg-red-600 text-white font-bold text-[10px] uppercase px-3 py-1 rounded-full tracking-wider">
                  {selectedArticle.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-black uppercase mt-2 drop-shadow-md">
                  {selectedArticle.title}
                </h3>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-6 sm:p-8 space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <BookOpen size={16} />
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Tác giả chuyên môn</span>
                    <p className="font-bold text-slate-900 text-xs">{selectedArticle.author || 'Ban Kỹ Thuật S-BUILD'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Thời gian đăng tải</span>
                    <p className="font-bold text-slate-900 text-xs">{new Date(selectedArticle.created_at || Date.now()).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Tóm tắt nội dung cẩm nang:</h4>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                  {selectedArticle.excerpt}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Điểm mấu chốt & Tiêu chuẩn thi công:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(Array.isArray(selectedArticle.tags) ? selectedArticle.tags : ['Chuẩn kỹ thuật 2026', 'Vật tư CO/CQ chính hãng']).map((t: string, i: number) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-bold flex items-center gap-2 text-slate-800">
                      <ShieldCheck size={16} className="text-green-600 shrink-0" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
                <a 
                  href={`/bai-viet/${selectedArticle.slug || selectedArticle.id}`}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl font-black uppercase tracking-wider text-xs transition-all shadow-md shadow-red-500/20 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <BookOpen size={15} />
                  Đọc toàn bộ bài viết chi tiết
                  <ArrowRight size={14} />
                </a>
                <button 
                  onClick={() => {
                    setSelectedArticle(null);
                    openDrawer();
                  }}
                  className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold uppercase tracking-wider text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Nhận Báo Giá Vật Tư
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
}
