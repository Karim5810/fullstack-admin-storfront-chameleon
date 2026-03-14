import React from 'react';
import { Link } from 'react-router-dom';

export default function Partners() {
  return (
    <div className="page-enter">
      {/* Hero */}
      <div className="bg-linear-to-r from-(--d3) to-(--d2) border-b border-(--border) py-16">
        <div className="container text-center">
          <h1 className="text-4xl font-black mb-4">الشراكات والتعاون</h1>
          <p className="text-(--muted2) max-w-2xl mx-auto">
            لنبني معاً مستقبلاً أكثر أماناً وازدهاراً
          </p>
        </div>
      </div>

      <div className="container py-16">
        {/* Partnership Types */}
        <div className="mb-20">
          <h2 className="text-3xl font-black text-white mb-10 text-center">أنواع الشراكات</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'الموزعون',
                desc: 'كن موزعاً رسمياً لمنتجاتنا في منطقتك',
                benefits: ['أسعار موزع', 'دعم تسويقي', 'تدريب منتج'],
              },
              {
                title: 'الموردون',
                desc: 'توريد منتجات وخدمات عالية الجودة',
                benefits: ['عقود طويلة الأجل', 'فرص نمو', 'دعم فني'],
              },
              {
                title: 'الشركاء الاستراتيجيون',
                desc: 'التعاون في مشاريع وخدمات متكاملة',
                benefits: ['تطوير مشترك', 'سوق موسعة', 'عائد استثمار'],
              },
            ].map((type, i) => (
              <div key={i} className="bg-(--d2) border border-(--border) rounded-xl p-8">
                <h3 className="text-xl font-bold text-white mb-3">{type.title}</h3>
                <p className="text-(--muted2) mb-4">{type.desc}</p>
                <ul className="space-y-2 mb-6">
                  {type.benefits.map((benefit, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-(--muted2)">
                      <svg className="w-4 h-4 fill-(--o)" viewBox="0 0 20 20">
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                      {benefit}
                    </li>
                  ))}
                </ul>
                <button className="btn-fire w-full text-sm">
                  اتصل بنا
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Our Partners */}
        <div className="mb-20">
          <h2 className="text-3xl font-black text-white mb-10 text-center">شركاؤنا الموثوقون</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-(--d2) border border-(--border) rounded-xl h-[150px] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl mb-2">🏢</div>
                  <p className="text-xs text-(--muted2)">شركة شريكة {i}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-linear-to-r from-(--d3) to-(--d2) border border-(--border2) rounded-xl p-12 text-center">
          <h2 className="text-2xl font-black text-white mb-4">هل أنت مهتم بالشراكة معنا؟</h2>
          <p className="text-(--muted2) mb-6 max-w-xl mx-auto">
            تواصل معنا لمناقشة فرص الشراكة والتعاون المشترك
          </p>
          <Link to="/contact" className="btn-fire inline-flex">
            تواصل مع فريق الشراكات
          </Link>
        </div>
      </div>
    </div>
  );
}
