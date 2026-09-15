"use client";
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Share2, Facebook, Twitter, Linkedin, Link as LinkIcon, Loader2 } from 'lucide-react';
import { getArticleByIdOrSlug } from '../articleServices';

export default function ArticleDetail({ slug: propSlug }: { slug?: string }) {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    async function fetchArticle() {
      setLoading(true);
      try {
        let searchStr = window.location.search;
        if (!searchStr && window.location.hash) {
          searchStr = window.location.hash.includes('?') 
            ? '?' + window.location.hash.split('?')[1] 
            : '?' + window.location.hash.replace('#', '');
        }
        const params = new URLSearchParams(searchStr);
        const postId = params.get('id');
        const searchSlug = params.get('slug');

        const article = await getArticleByIdOrSlug(propSlug || postId || searchSlug || '');
        setPost(article);
      } catch (err) {
        console.error('Lỗi khi tải chi tiết bài viết:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [propSlug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex justify-center items-center">
        <Loader2 className="animate-spin text-red-600" size={40} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-32 text-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Bài viết không tồn tại</h2>
        <p className="text-gray-500 mb-6">Bài viết bạn tìm kiếm chưa được xuất bản hoặc đã bị xóa.</p>
        <a href="/blog" className="inline-block bg-red-600 text-white font-bold px-6 py-2.5 rounded-xl">
          Quay lại danh sách bài viết
        </a>
      </div>
    );
  }

  const coverImage = post.cover_image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2400&auto=format&fit=crop';
  const postDate = new Date(post.created_at || Date.now()).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="bg-white min-h-screen pt-28 pb-24 selection:bg-gray-200 selection:text-gray-900">
      
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <a href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors mb-10">
          <ArrowLeft size={16} /> Quay lại danh sách bài viết
        </a>
        
        <span className="block text-sm font-bold text-red-600 uppercase tracking-widest mb-6">
          {post.category || 'Tin tức & Dự án'}
        </span>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.1] mb-10 max-w-4xl mx-auto">
          {post.title}
        </h1>
        
        <div className="flex items-center justify-center gap-6 text-sm font-medium text-gray-500">
          <span className="font-bold text-gray-900">{post.author || 'Ban Kỹ Thuật S-BUILD'}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
          <span>{postDate}</span>
        </div>
      </div>

      {/* Cover Image */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="w-full aspect-[21/9] md:aspect-[2.39/1] rounded-3xl overflow-hidden bg-gray-100 shadow-sm">
          <img 
            src={coverImage} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Article Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Excerpt */}
        {post.excerpt && (
          <p className="lead text-xl text-gray-600 font-medium leading-relaxed mb-10 italic border-l-4 border-red-600 pl-4">
            {post.excerpt}
          </p>
        )}

        {/* Prose Content */}
        <div 
          className="prose prose-lg prose-gray max-w-none leading-relaxed prose-headings:font-black prose-a:text-red-600"
          dangerouslySetInnerHTML={{ __html: post.html_content || post.content || post.excerpt || '<p>Nội dung chi tiết đang được cập nhật...</p>' }}
        />

        {/* Back to blog */}
        <div className="mt-16 pt-8 border-t border-gray-100 flex justify-between items-center">
          <a href="/blog" className="inline-flex items-center gap-2 font-bold text-red-600 hover:underline">
            <ArrowLeft size={16} /> Xem các bài viết khác
          </a>
        </div>

      </div>
    </div>
  );
}
