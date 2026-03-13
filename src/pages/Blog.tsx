import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import type { BlogPost } from '../types';
import { getBlogPostPath } from '../utils/catalog';

const categoryLabels: Record<string, string> = {
  all: 'الكل',
  safety: 'السلامة الصناعية',
  regulations: 'لوائح وأنظمة',
  tips: 'نصائح تقنية',
  equipment: 'معدات',
};

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);

      try {
        const postsData = await api.blog.getAll();
        setPosts(postsData);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const categories: string[] = [
    'all',
    ...Array.from(new Set<string>(posts.map((post) => post.category as string))),
  ];
  const filteredPosts =
    selectedCategory === 'all'
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  return (
    <div className="page-enter">
      <div className="bg-linear-to-r from-(--d3) to-(--d2) border-b border-(--border) py-12">
        <div className="container text-center">
          <h1 className="text-4xl font-black text-white mb-2">مركز المعرفة الصناعية</h1>
          <p className="text-(--muted2)">مقالات وأدلة تشغيل تساعد فرق السلامة والتشغيل والمشتريات.</p>
        </div>
      </div>

      <div className="container py-12">
        <div className="flex gap-2 mb-8 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedCategory === category
                  ? 'bg-(--o) text-white'
                  : 'bg-(--d2) text-(--muted2) hover:text-white'
              }`}
            >
              {categoryLabels[category] ?? category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-[280px] rounded-2xl bg-(--d2) animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredPosts.map((post, index) => (
              <Link
                key={post.id}
                to={getBlogPostPath(post)}
                className={`bg-(--d2) border border-(--border) rounded-xl overflow-hidden hover:border-(--o) transition-all hover:-translate-y-1 ${
                  index === 0 ? 'md:col-span-2' : ''
                }`}
              >
                <div
                  className={`bg-gradient-to-br from-(--d3) to-(--d4) flex items-center justify-center ${
                    index === 0 ? 'h-80' : 'h-[220px]'
                  }`}
                >
                  <svg className="w-20 h-20 opacity-10 fill-(--o)" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div className="p-6">
                  <span className="inline-block px-2 py-1 bg-[rgba(255,107,0,0.1)] text-(--o) text-xs font-bold rounded mb-3">
                    {categoryLabels[post.category] ?? post.category}
                  </span>
                  <h3 className={`font-black text-white mb-3 ${index === 0 ? 'text-2xl' : 'text-lg line-clamp-2'}`}>
                    {post.title}
                  </h3>
                  <p className="text-(--muted2) text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex justify-between items-center text-xs text-(--muted2)">
                    <span>{post.author}</span>
                    <span>{post.readTime ?? 4} دقائق قراءة</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
