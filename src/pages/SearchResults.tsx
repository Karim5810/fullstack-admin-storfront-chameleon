import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { api } from '../api';
import type { Product } from '../types';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q')?.trim() || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        if (query.length < 2) {
          setProducts([]);
          setError('يجب إدخال كلمتين على الأقل للبحث.');
          return;
        }

        const results = await api.products.search(query);
        setProducts(results);
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : 'حدث خطأ أثناء البحث.');
      } finally {
        setLoading(false);
      }
    };

    void fetchResults();
  }, [query]);

  return (
    <div className="page-enter">
      <div className="container py-8">
        <div className="breadcrumb mb-8">
          <Link to="/" className="text-[var(--muted)] hover:text-[var(--o)]">
            الرئيسية
          </Link>
          <span className="mx-2 text-[var(--muted)]">/</span>
          <span className="text-[var(--chrome)]">نتائج البحث</span>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">
          نتائج البحث عن: <span className="text-[var(--o)]">"{query}"</span>
        </h1>
        <p className="text-[var(--muted2)] mb-8">{loading ? 'جار البحث...' : `${products.length} نتيجة`}</p>

        {error ? (
          <div className="bg-[var(--d2)] border border-[rgba(214,48,49,0.3)] rounded-lg p-6 text-center mb-8">
            <p className="text-[rgba(214,48,49,0.8)]">{error}</p>
          </div>
        ) : null}

        {!loading && !error && products.length === 0 ? (
          <div className="bg-[var(--d2)] border border-[var(--border)] rounded-xl p-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8" strokeWidth="2" />
              <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <h2 className="text-xl font-bold text-[var(--chrome)] mb-2">لم نجد نتائج مطابقة</h2>
            <p className="text-[var(--muted2)] mb-6">جرّب استخدام اسم منتج أو علامة تجارية أو فئة مختلفة.</p>
            <div className="flex gap-3 justify-center">
              <Link to="/" className="btn-fire">
                العودة للرئيسية
              </Link>
              <Link to="/products" className="btn-ghost">
                جميع المنتجات
              </Link>
            </div>
          </div>
        ) : null}

        {!loading && products.length > 0 ? (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : null}

        {loading ? (
          <div className="products-grid">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-80 rounded-2xl bg-[var(--d2)] animate-pulse" />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
