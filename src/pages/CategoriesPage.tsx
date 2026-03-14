import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useImageRegistry } from '../contexts/ImageRegistryContext';
import type { Category, Product } from '../types';

export default function CategoriesPage() {
  const { getUrl } = useImageRegistry();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPage = async () => {
      setLoading(true);

      try {
        const [categoriesData, productsData] = await Promise.all([
          api.categories.getAll(),
          api.products.getAll(),
        ]);

        setCategories(categoriesData);
        setProducts(productsData);
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, []);

  const categoryCounts = products.reduce<Record<string, number>>((acc, product) => {
    acc[product.category] = (acc[product.category] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="page-enter">
      <div className="bg-linear-to-r from-(--d3) to-(--d2) border-b border-(--border) py-12">
        <div className="container text-center">
          <h1 className="text-4xl font-black text-white mb-2">جميع الفئات</h1>
          <p className="text-(--muted2)">استكشف الفئات الأساسية للمعدات الصناعية ومستلزمات السلامة.</p>
        </div>
      </div>

      <div className="container py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-48 rounded-2xl border border-(--border) bg-(--d2) animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const imageUrl = category.image || getUrl(`Cat-${index + 1}`);
              return (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="bg-(--d2) border border-(--border) rounded-2xl p-6 hover:border-(--o) hover:-translate-y-1 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-[rgba(255,107,0,0.12)] flex items-center justify-center overflow-hidden mb-5">
                  {imageUrl ? (
                    <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-7 h-7 text-(--o)" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    </svg>
                  )}
                </div>
                <h2 className="text-xl font-bold text-white mb-2">{category.name}</h2>
                <p className="text-(--muted2) text-sm mb-4 leading-7">
                  {category.description || 'فئة متخصصة ضمن كتالوج الريان للمعدات الصناعية.'}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-(--muted2)">{categoryCounts[category.slug] ?? 0} منتج</span>
                  <span className="text-(--o) font-bold">استعرض الفئة</span>
                </div>
              </Link>
            );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
