import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { api } from '../api';
import type { Category, Product } from '../types';

export default function CategoryDetail() {
  const { slug = '' } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategory = async () => {
      setLoading(true);
      setError(null);

      try {
        const [categoryData, productsData] = await Promise.all([api.categories.getBySlug(slug), api.products.getAll()]);
        setCategory(categoryData);
        setProducts(productsData.filter((product) => product.category === slug));
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : 'تعذر تحميل هذه الفئة.');
      } finally {
        setLoading(false);
      }
    };

    void loadCategory();
  }, [slug]);

  if (!loading && !category) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">الفئة غير موجودة</h1>
        <p className="text-[var(--muted2)] mb-6">{error ?? 'لم نتمكن من العثور على هذه الفئة داخل الكتالوج.'}</p>
        <Link to="/categories" className="btn-fire inline-flex">
          العودة إلى جميع الفئات
        </Link>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <div className="bg-[var(--d2)] border-b border-[var(--border)] py-4">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/" className="hover:text-[var(--o)] transition-colors">
              الرئيسية
            </Link>
            <span className="mx-2 text-[var(--muted)]">/</span>
            <Link to="/categories" className="hover:text-[var(--o)] transition-colors">
              الفئات
            </Link>
            <span className="mx-2 text-[var(--muted)]">/</span>
            <span className="text-[var(--chrome)]">{category?.name ?? '...'}</span>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-3">{category?.name}</h1>
          <p className="text-[var(--muted2)] max-w-3xl leading-8">
            {category?.description || 'مجموعة مختارة من المنتجات الموثوقة للاستخدامات الصناعية والتشغيلية.'}
          </p>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="products-grid">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-80 rounded-2xl bg-[var(--d2)] animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-[var(--d2)] border border-[var(--border)] rounded-2xl p-12 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">لا توجد منتجات حاليا</h2>
            <p className="text-[var(--muted2)] mb-6">سيتم تحديث هذه الفئة تلقائيا مع توفر المنتجات في الكتالوج.</p>
            <Link to="/products" className="btn-fire inline-flex">
              عرض كل المنتجات
            </Link>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
