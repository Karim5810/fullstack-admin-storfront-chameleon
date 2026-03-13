import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { getBlogPostPath } from '../utils/catalog';
import type { BlogPost } from '../types';

export default function News() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      setIsLoading(true);
      try {
        const data = await api.blog.getAll();
        setPosts(data);
      } finally {
        setIsLoading(false);
      }
    };

    void loadNews();
  }, []);

  return (
    <div className="page-enter">
      <div className="bg-linear-to-r from-(--d3) to-(--d2) border-b border-(--border) py-12">
        <div className="container text-center">
          <h1 className="text-4xl font-black text-white mb-3">الأخبار والتحديثات</h1>
          <p className="text-(--muted2)">آخر المستجدات التشغيلية وإطلاقات المنتجات والمبادرات الجديدة.</p>
        </div>
      </div>

      <div className="container py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-56 rounded-3xl bg-(--d2) animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={getBlogPostPath(post)}
                className="rounded-3xl border border-(--border) bg-(--d2) p-6 hover:border-(--o) transition-colors"
              >
                <div className="text-sm text-(--o) font-bold mb-3">
                  {new Date(post.publishedAt).toLocaleDateString('ar-EG')}
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">{post.title}</h2>
                <p className="text-(--muted2) leading-8">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
