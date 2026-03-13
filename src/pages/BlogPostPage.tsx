import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api';
import type { BlogPost } from '../types';
import { getBlogPostPath } from '../utils/catalog';

export default function BlogPostPage() {
  const { id = '' } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);

      try {
        const postData = await api.blog.getById(id);
        setPost(postData);

        const allPosts = await api.blog.getAll();
        setRelatedPosts(
          allPosts
            .filter((entry) => entry.id !== postData?.id && entry.category === postData?.category)
            .slice(0, 3),
        );
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  if (!loading && !post) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">المقال غير موجود</h1>
        <p className="text-(--muted2) mb-6">قد يكون الرابط قد تغير أو لم يعد المقال متاحاً.</p>
        <Link to="/blog" className="btn-fire inline-flex">
          العودة إلى المدونة
        </Link>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <div className="bg-linear-to-r from-(--d3) to-(--d2) border-b border-(--border) py-12">
        <div className="container max-w-4xl">
          <div className="inline-flex px-3 py-1 rounded-full bg-[rgba(255,107,0,0.12)] text-(--o) text-sm font-bold mb-4">
            {post?.category ?? 'المعرفة الصناعية'}
          </div>
          <h1 className="text-4xl font-black text-white mb-4 leading-tight">{post?.title ?? '...'}</h1>
          <div className="flex gap-4 flex-wrap text-sm text-(--muted2)">
            <span>{post?.author}</span>
            <span>{post ? new Date(post.publishedAt).toLocaleDateString('ar-EG') : ''}</span>
            <span>{post?.readTime ?? 4} دقائق قراءة</span>
          </div>
        </div>
      </div>

      <div className="container py-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-10">
          <article className="bg-(--d2) border border-(--border) rounded-3xl p-8 lg:p-10">
            {loading ? (
              <div className="space-y-4">
                <div className="h-5 rounded bg-(--d3) animate-pulse" />
                <div className="h-5 rounded bg-(--d3) animate-pulse" />
                <div className="h-5 rounded bg-(--d3) animate-pulse" />
              </div>
            ) : (
              <>
                <p className="text-xl text-(--chrome) leading-9 mb-8">{post?.excerpt}</p>
                <div className="text-(--muted2) leading-9 text-base whitespace-pre-line">
                  {post?.content}
                </div>
              </>
            )}
          </article>

          <aside className="space-y-6">
            <div className="bg-(--d2) border border-(--border) rounded-3xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">مقالات مرتبطة</h2>
              <div className="space-y-4">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    to={getBlogPostPath(relatedPost)}
                    className="block border border-(--border) rounded-2xl p-4 hover:border-(--o) transition-colors"
                  >
                    <h3 className="font-bold text-white mb-2 line-clamp-2">{relatedPost.title}</h3>
                    <p className="text-sm text-(--muted2) line-clamp-2">{relatedPost.excerpt}</p>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
