import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { api } from '../api';
import type { Category, Product } from '../types';

const ITEMS_PER_PAGE = 20;

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = Number.parseInt(searchParams.get('page') || '1', 10);
  const priceMin = Number.parseInt(searchParams.get('priceMin') || '0', 10);
  const priceMax = Number.parseInt(searchParams.get('priceMax') || '999999', 10);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const [productsData, categoriesData] = await Promise.all([api.products.getAll(), api.categories.getAll()]);
        setAllProducts(productsData);
        setCategories(categoriesData);
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : 'تعذر تحميل الكتالوج.');
      } finally {
        setLoading(false);
      }
    };

    void fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const scoped = allProducts
      .filter((product) => (!category ? true : product.category === category))
      .filter((product) => product.price >= priceMin && product.price <= priceMax);

    const sorted = [...scoped];

    switch (sort) {
      case 'price_asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default:
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return sorted;
  }, [allProducts, category, priceMin, priceMax, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const visibleProducts = filteredProducts.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const updateFilter = (key: string, value: string | number) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value === '' || value === 0) {
      nextParams.delete(key);
    } else {
      nextParams.set(key, String(value));
    }

    if (key !== 'page') {
      nextParams.set('page', '1');
    }

    setSearchParams(nextParams);
  };

  return (
    <div className="page-enter">
      <div className="bg-[var(--d2)] border-b border-[var(--border)] py-4">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/" className="hover:text-[var(--o)] transition-colors">
              الرئيسية
            </Link>
            <span className="mx-2 text-[var(--muted)]">/</span>
            <span className="text-[var(--chrome)]">جميع المنتجات</span>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {error ? (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="bg-[var(--d2)] rounded-xl p-6 sticky top-40 border border-[var(--border)]">
              <h3 className="text-lg font-bold text-white mb-6">التصفية</h3>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-[var(--chrome)] mb-2">الترتيب</label>
                <select
                  value={sort}
                  onChange={(event) => updateFilter('sort', event.target.value)}
                  className="w-full bg-[var(--d3)] border border-[var(--border)] text-[var(--chrome)] p-2 rounded text-sm focus:outline-none focus:border-[var(--o)]"
                >
                  <option value="newest">الأحدث</option>
                  <option value="price_asc">السعر من الأقل للأعلى</option>
                  <option value="price_desc">السعر من الأعلى للأقل</option>
                  <option value="rating">الأعلى تقييما</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-[var(--chrome)] mb-2">نطاق السعر</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="number"
                    placeholder="من"
                    value={priceMin || ''}
                    onChange={(event) => updateFilter('priceMin', event.target.value)}
                    className="flex-1 bg-[var(--d3)] border border-[var(--border)] text-[var(--chrome)] p-2 rounded text-sm focus:outline-none focus:border-[var(--o)]"
                  />
                  <input
                    type="number"
                    placeholder="إلى"
                    value={priceMax === 999999 ? '' : priceMax}
                    onChange={(event) => updateFilter('priceMax', event.target.value)}
                    className="flex-1 bg-[var(--d3)] border border-[var(--border)] text-[var(--chrome)] p-2 rounded text-sm focus:outline-none focus:border-[var(--o)]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    updateFilter('priceMin', '');
                    updateFilter('priceMax', '');
                  }}
                  className="text-xs text-[var(--o)] hover:underline"
                >
                  مسح النطاق
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--chrome)] mb-2">الفئة</label>
                <button
                  type="button"
                  onClick={() => updateFilter('category', '')}
                  className={`block w-full text-right p-2 rounded text-sm mb-2 transition-colors ${
                    !category ? 'bg-[var(--d3)] text-[var(--o)]' : 'text-[var(--muted2)] hover:text-[var(--chrome)]'
                  }`}
                >
                  جميع الفئات
                </button>
                <div className="space-y-1">
                  {categories.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => updateFilter('category', item.slug)}
                      className={`block w-full text-right p-2 rounded text-sm transition-colors ${
                        category === item.slug
                          ? 'bg-[var(--d3)] text-[var(--o)]'
                          : 'text-[var(--muted2)] hover:text-[var(--chrome)]'
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-3">
            <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
              <h1 className="text-2xl font-bold text-white">
                جميع المنتجات <span className="text-sm text-[var(--muted2)]">({filteredProducts.length})</span>
              </h1>
            </div>

            {loading ? (
              <div className="products-grid">
                {Array.from({ length: 12 }).map((_, index) => (
                  <div key={index} className="h-80 rounded-2xl bg-[var(--d2)] animate-pulse" />
                ))}
              </div>
            ) : visibleProducts.length === 0 ? (
              <div className="bg-[var(--d2)] border border-[var(--border)] rounded-xl p-12 text-center">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" strokeWidth="2" />
                </svg>
                <h2 className="text-xl font-bold text-[var(--chrome)] mb-2">لا توجد منتجات مطابقة</h2>
                <p className="text-[var(--muted2)] mb-6">جرّب حذف بعض الفلاتر أو اختيار فئة مختلفة.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchParams(new URLSearchParams());
                  }}
                  className="btn-fire inline-flex"
                >
                  مسح الفلاتر
                </button>
              </div>
            ) : (
              <>
                <div className="products-grid mb-8">
                  {visibleProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {totalPages > 1 ? (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                      type="button"
                      onClick={() => updateFilter('page', String(safePage - 1))}
                      disabled={safePage === 1}
                      className="px-4 py-2 rounded bg-[var(--d2)] text-[var(--chrome)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--d3)] transition-colors"
                    >
                      السابق
                    </button>

                    {Array.from({ length: totalPages }).map((_, index) => (
                      <button
                        key={index + 1}
                        type="button"
                        onClick={() => updateFilter('page', String(index + 1))}
                        className={`w-10 h-10 rounded transition-colors ${
                          safePage === index + 1 ? 'bg-[var(--o)] text-white' : 'bg-[var(--d2)] text-[var(--chrome)] hover:bg-[var(--d3)]'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => updateFilter('page', String(safePage + 1))}
                      disabled={safePage === totalPages}
                      className="px-4 py-2 rounded bg-[var(--d2)] text-[var(--chrome)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--d3)] transition-colors"
                    >
                      التالي
                    </button>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
