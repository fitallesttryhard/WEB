import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Tag, 
  Clock, 
  User, 
  ArrowRight, 
  Sparkles, 
  Share2, 
  Eye,
  Calendar,
  Layers,
  ChevronRight,
  X
} from 'lucide-react';

interface PostItem {
  id: string | number;
  title: string;
  category: string;
  slug?: string;
  image: string;
  excerpt: string;
  content?: string;
  author?: string;
  date: string;
  views?: number;
  featured?: boolean;
}

const defaultPosts: PostItem[] = [
  {
    id: 1,
    title: 'Top 10 Xu Hướng Thiết Kế Website & Apps Dẫn Đầu 2026',
    category: 'Thiết kế Web',
    slug: 'top-10-xu-huong-thiet-ke-web-2026',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
    excerpt: 'Khám phá phong cách Bento Grid cao cấp, Micro-Interactions mượt mà, hiệu ứng 3D Canvas và giải pháp tối ưu tỷ lệ chuyển đổi cho doanh nghiệp.',
    content: `Trong kỷ nguyên số 2026, trải nghiệm người dùng (UX) và giao diện số (UI) không chỉ đơn thuần là sự đẹp mắt mà là chìa khóa then chốt quyết định doanh thu và uy tín thương hiệu.

1. Bố cục Bento Grid: Cấu trúc thông tin phân tầng thông minh, giúp người xem tiếp nhận thông điệp nhanh gấp 3 lần.
2. Micro-Interactions: Những chuyển động vi mô tinh tế mang lại cảm giác sống động, chân thực trên từng thao tác chạm/click.
3. Tối ưu tốc độ tải trang dưới 1 giây với kiến trúc Next.js / Vite hiện đại.
4. Tích hợp AI thông minh hỗ trợ tư vấn và tương tác khách hàng tức thì.`,
    author: 'Fi.tallest Tech Team',
    date: '28/08/2026',
    views: 2450,
    featured: true
  },
  {
    id: 2,
    title: 'Chiến Lược SEO Tổng Thể Thống Trị Top 1 Google Năm 2026',
    category: 'SEO Google',
    slug: 'chien-luoc-seo-tong-the-top-1-google',
    image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=1000&auto=format&fit=crop',
    excerpt: 'Bí quyết tối ưu cấu trúc dữ liệu Semantic HTML5, Schema Markup và tốc độ Core Web Vitals giúp website đạt thứ hạng cao bền vững.',
    content: `Thuật toán xếp hạng của Google ngày càng ưu tiên trải nghiệm người dùng thực tế và độ chuyên sâu của nội dung (E-E-A-T).

Để website đạt thứ hạng Top 1 bền vững, doanh nghiệp cần:
- Tối ưu hóa cấu trúc liên kết nội bộ (Internal Links).
- Chuẩn hóa Schema Rich Snippets cho sản phẩm và bài viết.
- Tăng tốc độ phản hồi máy chủ (TTFB) với hạ tầng Cloud NVMe thế hệ mới.`,
    author: 'Chuyên gia SEO Fi.tallest',
    date: '25/08/2026',
    views: 1890,
    featured: false
  },
  {
    id: 3,
    title: 'Tối Ưu Tốc Độ Tải Trang Với Hạ Tầng Cloud Server NVMe',
    category: 'Hạ tầng Cloud',
    slug: 'toi-uu-toc-do-cloud-server-nvme',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1000&auto=format&fit=crop',
    excerpt: 'Tại sao tốc độ tải trang ảnh hưởng trực tiếp đến 70% quyết định mua hàng và cách nâng cấp hạ tầng lưu trữ đám mây cho doanh nghiệp.',
    content: `Khảo sát từ Google chỉ ra rằng hơn 53% người dùng sẽ rời bỏ website nếu trang tải chậm quá 3 giây.
Hạ tầng Cloud Server tại Fi.tallest sử dụng 100% ổ cứng Enterprise NVMe U.2 mang đến hiệu năng đọc ghi vượt trội gấp 10 lần so với SSD thông thường.`,
    author: 'Kỹ sư Hệ thống Fi.tallest',
    date: '20/08/2026',
    views: 1320,
    featured: false
  },
  {
    id: 4,
    title: 'Ứng Dụng Trí Tuệ Nhân Tạo (AI) Trong Tự Động Hóa Giao Diện Website',
    category: 'Trí tuệ Nhân tạo AI',
    slug: 'ung-dung-ai-tu-dong-hoa-giao-dien',
    image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1000&auto=format&fit=crop',
    excerpt: 'Công nghệ AI Design giúp tạo mẫu trang landing page tự động, cá nhân hóa nội dung cho từng phân khúc khách hàng tiềm năng.',
    content: `Trí tuệ nhân tạo đang tái định nghĩa cách chúng ta xây dựng phần mềm và trang web. Tại Fi.tallest, giải pháp AI Design được tích hợp sâu giúp tự động hóa việc phối màu, tối ưu tỷ lệ văn bản và đề xuất layout phù hợp với từng lĩnh vực kinh doanh.`,
    author: 'Fi.tallest AI Lab',
    date: '18/08/2026',
    views: 2100,
    featured: false
  }
];

interface BlogPageProps {
  setCurrentTab: (tab: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ setCurrentTab }) => {
  const [posts, setPosts] = useState<PostItem[]>(defaultPosts);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<PostItem | null>(null);

  const loadPosts = () => {
    try {
      const stored = localStorage.getItem('fitallest_admin_posts');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const dynamicPosts: PostItem[] = parsed.map((p: any) => ({
            id: p.id || String(Date.now()),
            title: p.title || 'Bài viết công nghệ mới',
            category: p.category || 'Công nghệ',
            slug: p.slug || 'bai-viet-moi',
            image: p.image || p.image_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
            excerpt: p.excerpt || 'Bài viết phân tích chuyên sâu về giải pháp công nghệ và phần mềm.',
            content: p.content || p.excerpt || 'Nội dung chi tiết bài viết đang được cập nhật.',
            author: p.author || 'Ban Biên Tập Fi.tallest',
            date: p.created_at || p.date || 'Vừa đăng',
            views: p.views || 100,
            featured: false
          }));
          setPosts(dynamicPosts);
          return;
        }
      }
    } catch (e) {}
    setPosts(defaultPosts);
  };

  useEffect(() => {
    loadPosts();
    window.addEventListener('storage', loadPosts);
    window.addEventListener('fitallest_posts_updated', loadPosts);
    return () => {
      window.removeEventListener('storage', loadPosts);
      window.removeEventListener('fitallest_posts_updated', loadPosts);
    };
  }, []);

  const categories = ['Tất cả', ...Array.from(new Set(posts.map(p => p.category)))];

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'Tất cả' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = filteredPosts.find(p => p.featured) || filteredPosts[0];
  const regularPosts = filteredPosts.filter(p => p.id !== featuredPost?.id);

  return (
    <div className="tech-bg min-h-screen py-16 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider animate-pulse">
            <BookOpen size={14} />
            <span>Trung Tâm Kiến Thức & Tin Tức Công Nghệ</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Bài Viết, Xu Hướng & <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Cẩm Nang Chuyển Đổi Số
            </span>
          </h1>

          <p className="text-base text-slate-600 font-medium">
            Tổng hợp các bài viết chuyên sâu về thiết kế UX/UI, giải pháp SEO Top 1 Google, kiến trúc Cloud và ứng dụng AI tự động hóa cho doanh nghiệp.
          </p>
        </div>

        {/* SEARCH & CATEGORY BAR */}
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-100 mb-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Tìm kiếm bài viết, chủ đề..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FEATURED POST BANNER */}
        {featuredPost && (
          <div className="mb-16 bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden group hover:border-indigo-300 transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              <div className="lg:col-span-7 h-72 lg:h-auto overflow-hidden relative">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 rounded-full bg-indigo-600 text-white text-xs font-black uppercase tracking-wider shadow-md">
                    ★ Bài viết nổi bật
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                    <span className="text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                      {featuredPost.category}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={13} /> {featuredPost.date}
                    </span>
                  </div>

                  <h2 
                    onClick={() => setActiveArticle(featuredPost)}
                    className="text-2xl lg:text-3xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer leading-snug"
                  >
                    {featuredPost.title}
                  </h2>

                  <p className="text-slate-600 text-sm font-medium leading-relaxed line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-black">
                      <User size={15} />
                    </div>
                    <span>{featuredPost.author || 'Fi.tallest'}</span>
                  </div>

                  <button 
                    onClick={() => setActiveArticle(featuredPost)}
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-indigo-600 hover:text-indigo-800 transition"
                  >
                    <span>Đọc toàn bộ bài viết</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* POSTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => (
            <article 
              key={post.id}
              onClick={() => setActiveArticle(post)}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer hover:-translate-y-1"
            >
              <div className="relative aspect-video overflow-hidden bg-slate-100">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[11px] font-extrabold text-slate-800 shadow-sm">
                  {post.category}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <Calendar size={13} />
                    <span>{post.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye size={13} /> {post.views?.toLocaleString() || 100} lượt xem
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-slate-500 text-xs font-medium leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">{post.author || 'Fi.tallest'}</span>
                  <span className="font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Chi tiết <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-xl mx-auto space-y-4 shadow-sm">
            <BookOpen size={48} className="mx-auto text-slate-300" />
            <h3 className="text-lg font-bold text-slate-800">Không tìm thấy bài viết phù hợp</h3>
            <p className="text-sm text-slate-500 font-medium">Thử tìm kiếm với từ khóa khác hoặc chuyển sang chuyên mục khác.</p>
            <button 
              onClick={() => { setSelectedCategory('Tất cả'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition"
            >
              Xem tất cả bài viết
            </button>
          </div>
        )}

      </div>

      {/* ARTICLE FULL MODAL */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 sm:p-10 relative">
            <button 
              onClick={() => setActiveArticle(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="space-y-6">
              <div className="flex items-center gap-3 text-xs font-bold text-indigo-600">
                <span className="bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                  {activeArticle.category}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500">{activeArticle.date}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {activeArticle.title}
              </h2>

              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100">
                <img src={activeArticle.image} alt={activeArticle.title} className="w-full h-full object-cover" />
              </div>

              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-medium space-y-4 whitespace-pre-line text-sm sm:text-base">
                {activeArticle.content || activeArticle.excerpt}
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                    <User size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{activeArticle.author || 'Fi.tallest'}</div>
                    <div className="text-xs text-slate-400 font-medium">Tác giả bài viết</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Đã sao chép liên kết bài viết!');
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition"
                  >
                    <Share2 size={14} /> Chia sẻ
                  </button>
                  <button 
                    onClick={() => {
                      setActiveArticle(null);
                      setCurrentTab('quote');
                    }}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-md shadow-indigo-500/20"
                  >
                    Tư vấn giải pháp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
