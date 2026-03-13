import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AddToCartButton from '../components/AddToCartButton';
import ProductCard from '../components/ProductCard';
import WishlistButton from '../components/WishlistButton';
import { api } from '../api';
import type { Product } from '../types';
import { formatCurrency } from '../utils/catalog';

export default function ProductDetail() {
  const { slug = '' } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const productData = await api.products.getById(slug);
        setProduct(productData);

        const allProducts = await api.products.getAll();
        setRelatedProducts(
          allProducts.filter((entry) => entry.id !== productData?.id && entry.category === productData?.category).slice(0, 4),
        );
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : 'تعذر تحميل بيانات المنتج.');
      } finally {
        setLoading(false);
      }
    };

    void loadProduct();
  }, [slug]);

  if (!loading && !product) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">المنتج غير موجود</h1>
        <p className="text-[var(--muted2)] mb-6">{error ?? 'قد يكون الرابط غير صحيح أو تمت إزالة المنتج من الكتالوج.'}</p>
        <Link to="/products" className="btn-fire inline-flex">
          العودة إلى المنتجات
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
            <Link to="/products" className="hover:text-[var(--o)] transition-colors">
              المنتجات
            </Link>
            <span className="mx-2 text-[var(--muted)]">/</span>
            <span className="text-[var(--chrome)]">{product?.title ?? '...'}</span>
          </div>
        </div>
      </div>

      <div className="container py-12">
        {error ? (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        {loading || !product ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="h-[420px] rounded-3xl bg-[var(--d2)] animate-pulse" />
            <div className="space-y-4">
              <div className="h-6 w-1/4 rounded bg-[var(--d2)] animate-pulse" />
              <div className="h-10 w-3/4 rounded bg-[var(--d2)] animate-pulse" />
              <div className="h-24 rounded bg-[var(--d2)] animate-pulse" />
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
              <div className="bg-[var(--d2)] border border-[var(--border)] rounded-3xl p-8">
                <div className="aspect-square rounded-2xl bg-[var(--d3)] flex items-center justify-center overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-contain p-8"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 flex-wrap mb-4">
                  <span className="px-3 py-1 rounded-full bg-[rgba(255,107,0,0.12)] text-[var(--o)] text-sm font-bold">
                    {product.brand}
                  </span>
                  {product.isNew ? (
                    <span className="px-3 py-1 rounded-full bg-green-500/15 text-green-400 text-sm font-bold">جديد</span>
                  ) : null}
                  {product.isSale ? (
                    <span className="px-3 py-1 rounded-full bg-red-500/15 text-red-400 text-sm font-bold">عرض خاص</span>
                  ) : null}
                </div>

                <h1 className="text-4xl font-black text-white mb-4 leading-tight">{product.title}</h1>
                <p className="text-[var(--muted2)] leading-8 mb-6">{product.description}</p>

                <div className="flex items-end gap-4 mb-6">
                  <span className="text-4xl font-black text-[var(--o)]">{formatCurrency(product.price)}</span>
                  {product.oldPrice ? (
                    <span className="text-xl text-[var(--muted)] line-through">{formatCurrency(product.oldPrice)}</span>
                  ) : null}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-[var(--d2)] border border-[var(--border)] rounded-2xl p-4">
                    <div className="text-sm text-[var(--muted2)] mb-1">المخزون</div>
                    <div className="text-lg font-bold text-white">
                      {product.stock > 0 ? `${product.stock} قطعة متاحة` : 'غير متاح حاليا'}
                    </div>
                  </div>
                  <div className="bg-[var(--d2)] border border-[var(--border)] rounded-2xl p-4">
                    <div className="text-sm text-[var(--muted2)] mb-1">التقييم</div>
                    <div className="text-lg font-bold text-white">
                      {product.rating.toFixed(1)} / 5 ({product.reviewsCount})
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 flex-wrap">
                  <AddToCartButton product={product} className="btn-fire" />
                  <Link to="/quote" className="btn-ghost">
                    اطلب عرض سعر
                  </Link>
                  <WishlistButton product={product} className="btn-ghost" />
                </div>
              </div>
            </div>

            {relatedProducts.length > 0 ? (
              <section className="mt-16">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">منتجات مرتبطة</h2>
                  <Link to={`/category/${product.category}`} className="text-[var(--o)] font-bold">
                    المزيد من نفس الفئة
                  </Link>
                </div>
                <div className="products-grid">
                  {relatedProducts.map((relatedProduct) => (
                    <ProductCard key={relatedProduct.id} product={relatedProduct} />
                  ))}
                </div>
              </section>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
