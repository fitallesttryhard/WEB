import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Loader2 } from 'lucide-react';

export default function BlogList() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        if (data) {
          setPosts(data);
        }
      } catch (err) {
        console.error('Lỗi lấy bài viết từ Supabase:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const displayArticles = posts.map((p) => ({
    id: p.id,
    title: p.title,
    excerpt: p.excerpt || 'Bài viết kỹ thuật & dự án công nghệ & phần mềm.',
    date: new Date(p.created_at).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' }),
    image: p.cover_image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop',
    category: 'Tin tức & Dự án',
  }));

  return (
    <div className="bg-white min-h-screen pt-32 pb-24 selection:bg-gray-200 selection:text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Trang */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">
            Dự Án & Tin Tức
          </h1>
          <p className="text-lg text-gray-500 font-medium">
            Cập nhật những xu hướng thiết kế mới nhất, kiến thức thi công chuyên sâu và các dự án tiêu biểu do Sbuild cung cấp vật tư.
          </p>
        </div>

        {/* Bố cục Grid 3 cột */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="animate-spin text-red-600" size={36} />
          </div>
        ) : displayArticles.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-12 text-center border border-gray-100 max-w-xl mx-auto">
            <p className="text-gray-500 font-medium text-lg mb-2">Hiện chưa có bài viết nào được xuất bản.</p>
            <p className="text-gray-400 text-sm">Bạn có thể tạo bài viết mới từ trang <a href="#admin" className="text-red-600 font-bold hover:underline">Quản trị Admin</a>.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {displayArticles.map((article) => (
              <article key={article.id} className="group cursor-pointer flex flex-col">
                {/* Hình ảnh */}
                <div className="w-full overflow-hidden rounded-2xl mb-6 bg-gray-100 aspect-video relative">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-gray-900 uppercase tracking-wider">
                    {article.category}
                  </div>
                </div>

                {/* Nội dung */}
                <div className="flex flex-col flex-1">
                  <span className="text-sm font-bold text-gray-400 mb-3 block">
                    {article.date}
                  </span>
                  <h2 className="text-xl font-bold text-gray-900 leading-snug mb-3 group-hover:text-gray-600 transition-colors">
                    <a href={`#article?id=${article.id}`} className="block outline-none">
                      {article.title}
                    </a>
                  </h2>
                  <p className="text-gray-500 text-base leading-relaxed line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
