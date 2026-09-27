"use client";
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { 
  BookOpen, Sparkles, X, ArrowUpRight, ShieldCheck, Clock, 
  Calendar, Search, ArrowRight, ChevronLeft, ChevronRight, RotateCcw
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useSettings } from '../contexts/SettingsContext';
import { getArticles, Article, DEFAULT_SBUILD_ARTICLES } from '../articleServices';

export default function BlogList() {
  const { settings } = useSettings();
  const { openDrawer } = useCart();

  const [articles, setArticles] = useState<Article[]>([]);
  const [activeCategory, setActiveCategory] = useState('Tất cả cẩm nang');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Giới hạn hiển thị 6 bài viết mỗi trang tương tự trang chủ

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        const data = await getArticles();
        if (data && data.length > 0) {
          setArticles(data.filter(a => a.is_published !== false));
        } else {
          setArticles(DEFAULT_SBUILD_ARTICLES);
        }
      } catch (err) {
        console.error('Lỗi lấy bài viết cẩm nang S-BUILD:', err);
        setArticles(DEFAULT_SBUILD_ARTICLES);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const defaultCategories = ['Kỹ Thuật Thi Công', 'Cẩm Nang Vật Tư', 'Kinh Nghiệm Thực Tế', 'Tiêu Chuẩn & Báo Giá'];
  const articleCategories = Array.from(new Set(articles.map(a => a.category).filter(Boolean)));
  const categories = ['Tất cả cẩm nang', ...Array.from(new Set([...defaultCategories, ...articleCategories]))];

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesCategory = activeCategory === 'Tất cả cẩm nang' || article.category === activeCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q || 
        article.title.toLowerCase().includes(q) ||
        article.excerpt?.toLowerCase().includes(q) ||
        (Array.isArray(article.tags) && article.tags.some(t => t.toLowerCase().includes(q)));
      return matchesCategory && matchesSearch;
    });
  }, [articles, activeCategory, searchQuery]);

  // Reset về trang 1 khi đổi danh mục hoặc tìm kiếm
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  // Phân trang
  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / itemsPerPage));
  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredArticles.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredArticles, currentPage, itemsPerPage]);

  const handleScrollToGrid = () => {
    const el = document.getElementById('cam-nang-content');
    if (el) {
      const yOffset = -80;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    handleScrollToGrid();
  };

  const handleResetFilters = () => {
    setActiveCategory('Tất cả cẩm nang');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const heroBackgroundImage = 
    settings?.aboutPageConfig?.hero?.backgroundImage || 
    '/images/about/about-hero.jpg';

  return (
    <div className="bg-[#f8f8f6] min-h-screen text-slate-900 font-sans selection:bg-red-100 selection:text-red-900">
      
      {/* 1. HERO BANNER - ĐỒNG BỘ PHONG CÁCH VỚI TRANG GIỚI THIỆU & SẢN PHẨM */}
      <section className="relative min-h-[460px] lg:min-h-[520px] flex items-center justify-start overflow-hidden bg-slate-950 pt-32 pb-16 lg:py-24">
        {/* Background Image with Dark Vignette Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBackgroundImage}
            alt="Cẩm nang & Kinh nghiệm thi công SBUILD"
            className="w-full h-full object-cover object-center brightness-[0.75] scale-105 transition-all duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-black/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6 uppercase tracking-wider">
            <Link href="/" className="hover:text-white transition-colors">TRANG CHỦ</Link>
            <span className="text-red-500">/</span>
            <button 
              onClick={handleResetFilters}
              className={`hover:text-white transition-colors uppercase cursor-pointer ${activeCategory === 'Tất cả cẩm nang' ? 'text-white font-bold' : 'text-slate-400'}`}
            >
              CẨM NANG & KINH NGHIỆM
            </button>
            {activeCategory !== 'Tất cả cẩm nang' && (
              <>
                <span className="text-red-500">/</span>
                <span className="text-white font-bold uppercase">{activeCategory}</span>
              </>
            )}
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl lg:max-w-4xl xl:max-w-5xl"
          >
            {/* Tag / Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-8 h-[2px] bg-red-600"></span>
              <span className="text-xs font-black uppercase tracking-[0.25em] text-red-500">
                SBUILD KNOWLEDGE // CHIA SẺ KỸ THUẬT
              </span>
            </div>

            {/* H1 Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] xl:text-5xl font-black text-white uppercase tracking-tight leading-tight sm:leading-[1.15] mb-5 drop-shadow-md">
              <span className="inline-block">CẨM NANG &amp; KINH NGHIỆM</span>{' '}
              <span className="inline-block whitespace-nowrap">THI CÔNG</span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-sm sm:text-base lg:text-lg font-normal leading-relaxed mb-8 max-w-2xl text-pretty">
              Tổng hợp quy chuẩn kỹ thuật lắp đặt nẹp, giải pháp xử lý chi tiết kiến trúc và cẩm nang kinh nghiệm thực chiến từ đội ngũ kỹ sư chuyên gia SBUILD.
            </p>

            {/* CTA Button */}
            <button
              onClick={handleScrollToGrid}
              className="inline-flex items-center gap-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white px-7 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-xl shadow-red-600/30 group cursor-pointer"
            >
              <span>Khám phá cẩm nang ({filteredArticles.length} bài viết)</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. MAIN CONTENT AREA */}
      <div id="cam-nang-content" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        {/* ROW 1: DỜI KHUNG TÌM KIẾM SANG VỊ TRÍ RIÊNG TRÊN HÀNG TAB ĐỂ KHÔNG BỊ CHE CẮT */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Sparkles size={14} className="text-amber-500" />
              Chuyên mục cẩm nang
            </span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
              {filteredArticles.length} bài viết
            </span>
            {(activeCategory !== 'Tất cả cẩm nang' || searchQuery) && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 ml-2 underline cursor-pointer"
              >
                <RotateCcw size={12} />
                Đặt lại
              </button>
            )}
          </div>

          {/* Khung tìm kiếm nằm riêng biệt, rộng rãi, không chiếm diện tích tab */}
          <div className="relative w-full sm:w-80 md:w-96 shrink-0">
            <input
              type="text"
              placeholder="Tìm kiếm cẩm nang, giải pháp kỹ thuật..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 text-xs bg-white rounded-full border border-slate-200 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100 text-slate-800 placeholder-slate-400 shadow-2xs transition-all"
            />
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                title="Xóa tìm kiếm"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* ROW 2: HÀNG TAB CHUYÊN MỤC TRẢI RỘNG 100% TOÀN BỘ KHÔNG GIAN, KHÔNG BỊ CHE CẮT */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-10 pb-5 border-b border-slate-200">
          {categories.map((cat) => {
            const count = cat === 'Tất cả cẩm nang' 
              ? articles.length 
              : articles.filter(a => a.category === cat).length;
            const isActive = activeCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-900/15 ring-2 ring-slate-900 ring-offset-2'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/90 shadow-2xs hover:border-slate-300'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 3. LUXURY ARCHITECTURAL CARDS GRID VỚI GIỚI HẠN HIỂN THỊ */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-24 space-y-3">
            <div className="w-9 h-9 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin"></div>
            <p className="text-slate-400 text-xs font-semibold">Đang nạp cẩm nang & kinh nghiệm thi công...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 max-w-xl mx-auto my-12 shadow-sm">
            <p className="text-slate-800 font-extrabold text-lg mb-2">Không tìm thấy bài viết nào phù hợp.</p>
            <p className="text-slate-500 text-xs leading-relaxed mb-4">
              Vui lòng thử chọn chuyên mục khác hoặc xóa từ khóa tìm kiếm để xem tất cả bài viết.
            </p>
            <button 
              onClick={handleResetFilters}
              className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-600 transition-colors cursor-pointer"
            >
              Xem tất cả cẩm nang
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {paginatedArticles.map((article, idx) => {
                const articleIndex = (currentPage - 1) * itemsPerPage + idx + 1;
                const formattedIndex = String(articleIndex).padStart(2, '0');

                return (
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
                        {formattedIndex}
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

                        <h2 className="text-xl font-bold text-slate-900 group-hover:text-red-600 transition-colors leading-snug line-clamp-2 mb-2">
                          {article.title}
                        </h2>

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
                );
              })}
            </div>

            {/* 4. PHÂN TRANG VÀ GIỚI HẠN SỐ BÀI VIẾT HIỂN THỊ */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
                <div className="text-xs text-slate-500 font-medium">
                  Hiển thị <span className="font-bold text-slate-900">{(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredArticles.length)}</span> trên tổng số <span className="font-bold text-slate-900">{filteredArticles.length}</span> bài viết
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    title="Trang trước"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        currentPage === page
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    title="Trang sau"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

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

    </div>
  );
}
