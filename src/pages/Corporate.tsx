import React from 'react';
import { Link } from 'react-router-dom';

export default function Corporate() {
  return (
    <div className="page-enter">
      <div className="bg-linear-to-r from-(--d3) via-(--d2) to-(--d3) border-b border-(--border) py-14">
        <div className="container max-w-4xl text-center">
          <h1 className="text-4xl font-black mb-4">مزايا الشركات</h1>
          <p className="text-(--muted2) leading-8">
            حلول مخصصة للمصانع والمقاولين ومديري المرافق تشمل التسعير التجاري، التوريد الدوري، وتغطية احتياجات المواقع.
          </p>
        </div>
      </div>

      <div className="container py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          ['تسعير تعاقدي', 'أسعار مستقرة وربط بالأصناف المتكررة وحدود إعادة الطلب.'],
          ['متابعة تشغيلية', 'مسؤول حساب وتقارير متابعة للطلبيات والأصناف الحرجة.'],
          ['مسارات تنفيذ', 'ربط التوريد بخدمات التدريب والتدقيق والاعتماد.'],
        ].map(([title, description]) => (
          <div key={title} className="rounded-3xl border border-(--border) bg-(--d2) p-6">
            <h2 className="text-xl font-bold text-white mb-3">{title}</h2>
            <p className="text-(--muted2) leading-8">{description}</p>
          </div>
        ))}
      </div>

      <div className="container pb-12 flex flex-wrap gap-3">
        <Link to="/b2b/register" className="btn-fire">
          فتح ملف شركة
        </Link>
        <Link to="/contact" className="btn-ghost">
          تحدث مع المبيعات
        </Link>
      </div>
    </div>
  );
}
