import React from 'react';
import { Link } from 'react-router-dom';

export default function B2B() {
  return (
    <div className="page-enter">
      {/* Hero */}
      <div className="bg-linear-to-r from-(--d3) via-(--d2) to-(--d3) border-b border-(--border) py-16">
        <div className="container text-center">
          <h1 className="text-4xl font-black text-white mb-4">حلول B2B للقطاع الصناعي</h1>
          <p className="text-(--muted2) max-w-2xl mx-auto mb-8">
            احصل على أسعار الجملة والخدمات المتخصصة لشركتك
          </p>
          <Link to="/b2b/register" className="btn-fire inline-flex">
            تسجيل حساب أعمال
          </Link>
        </div>
      </div>

      <div className="container py-16">
        {/* Benefits Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-black text-white mb-10 text-center">مميزات حلول B2B</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '💰', title: 'أسعار الجملة', desc: 'خصومات حقيقية تبدأ من 20%' },
              { icon: '🚚', title: 'توصيل أولوية', desc: 'شحن سريع مع تتبع فوري' },
              { icon: '💳', title: 'ائتمان تجاري', desc: 'فترات دفع آجلة حتى 60 يوم' },
              { icon: '👤', title: 'مدير حساب', desc: 'دعم مخصص لحسابك' },
            ].map((benefit, i) => (
              <div key={i} className="bg-(--d2) border border-(--border) rounded-xl p-6 text-center hover:border-(--o) transition-colors">
                <div className="text-4xl mb-3">{benefit.icon}</div>
                <h3 className="font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-sm text-(--muted2)">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <h2 className="text-3xl font-black text-white mb-10 text-center">كيفية الانضمام</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'التسجيل', desc: 'أنشئ حساب B2B وأرسل مستندات شركتك' },
              { step: '2', title: 'التحقق', desc: 'سيتحقق فريقنا من بياناتك خلال 24 ساعة' },
              { step: '3', title: 'البدء', desc: 'ابدأ الطلب بأسعار الجملة الخاصة' },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="bg-(--d2) border border-(--border) rounded-xl p-8 text-center h-full">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-(--o) text-white font-black mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-(--muted2) text-sm">{item.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-(--border)" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-linear-to-r from-(--d3) to-(--d2) border border-(--border2) rounded-xl p-12 text-center">
          <h2 className="text-2xl font-black text-white mb-4">هل أنت مستعد؟</h2>
          <p className="text-(--muted2) mb-6 max-w-xl mx-auto">
            انضم إلى مئات الشركات التي تستفيد من حلول B2B لدينا
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/b2b/register" className="btn-fire">
              تسجيل حساب أعمال
            </Link>
            <Link to="/contact" className="btn-ghost">
              اتصل بفريق المبيعات
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
