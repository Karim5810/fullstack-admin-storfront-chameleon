import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useCommerce } from '../contexts/CommerceContext';

export default function Wishlist() {
  const { wishlistItems, isLoading, error } = useCommerce();

  return (
    <div className="page-enter">
      <div className="bg-(--d2) border-b border-(--border) py-4">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/" className="hover:text-(--o)">
              الرئيسية
            </Link>
            <span className="mx-2 text-(--muted)">/</span>
            <span className="text-(--chrome)">المفضلة</span>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <h1 className="text-3xl font-bold text-white mb-2">
          المفضلة <span className="text-sm text-(--muted2)">({wishlistItems.length} منتج)</span>
        </h1>
        <p className="text-(--muted2) mb-8">احفظ الأصناف التي تريد الرجوع إليها أو إضافتها للسلة لاحقا.</p>

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        {isLoading ? (
          <div className="products-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-80 rounded-2xl bg-(--d2) animate-pulse" />
            ))}
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="bg-(--d2) border border-(--border) rounded-xl p-12 text-center">
            <svg
              className="w-16 h-16 mx-auto mb-4 opacity-50"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <h2 className="text-xl font-bold text-(--chrome) mb-2">قائمة المفضلة فارغة</h2>
            <p className="text-(--muted2) mb-6">أضف المنتجات التي تريد مقارنتها أو الرجوع إليها لاحقا.</p>
            <Link to="/products" className="btn-fire inline-flex">
              تصفح المنتجات
            </Link>
          </div>
        ) : (
          <div className="products-grid">
            {wishlistItems.map((item) => (
              <ProductCard key={item.id} product={item.product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
