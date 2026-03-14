import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container py-20 min-h-[60vh] flex items-center justify-center">
      <div className="max-w-xl w-full bg-(--d2) border border-(--border) rounded-3xl p-10 text-center">
        <div className="text-(--o) text-sm font-bold mb-4">404</div>
        <h1 className="text-4xl font-black mb-4">الصفحة غير موجودة</h1>
        <p className="text-(--muted2) leading-8 mb-8">
          الرابط الذي تحاول الوصول إليه غير متاح حالياً أو تم نقله إلى مسار آخر داخل المنصة.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link to="/" className="btn-fire">
            العودة إلى الرئيسية
          </Link>
          <Link to="/products" className="btn-ghost">
            تصفح المنتجات
          </Link>
        </div>
      </div>
    </div>
  );
}
