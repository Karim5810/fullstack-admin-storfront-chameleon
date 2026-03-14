import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="page-enter">
      {/* Hero Section */}
      <div className="bg-linear-to-b from-(--d3) to-(--d2) border-b border-(--border) py-16">
        <div className="container text-center">
          <h1 className="text-4xl font-black  mb-4">نبذة عن الريان للسلامة الصناعية</h1>
          <p className="text-(--muted2) max-w-2xl mx-auto">
            رائدة في مجال توفير حلول السلامة والمعدات الصناعية الموثوقة منذ 2015
          </p>
        </div>
      </div>

      <div className="container py-16">
        {/* Company Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20 items-center">
          <div>
            <h2 className="text-3xl font-black text-white mb-6">قصتنا</h2>
            <p className="text-(--muted2) mb-4 leading-relaxed">
              تأسست الريان للسلامة الصناعية بهدف توفير حلول السلامة والمعدات الصناعية الموثوقة للمصانع والشركات الكبرى والصغيرة.
            </p>
            <p className="text-(--muted2) mb-4 leading-relaxed">
              بعد سنوات من العمل الشاق والتكريس، أصبحنا الخيار الأول لآلاف العملاء في المنطقة لكفاءتنا والتزامنا بتقديم أفضل الخدمات.
            </p>
            <p className="text-(--muted2) leading-relaxed">
              نحن نؤمن بأن السلامة أولاً، والتزامنا هو ضمان سلامة موظفيك وعاملينك كل يوم.
            </p>
          </div>
          <div className="bg-(--d2) border border-(--border) rounded-xl h-[400px] flex items-center justify-center">
            <svg className="w-48 h-48 opacity-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-20">
          {[
            { label: 'آلاف العملاء', value: '5000+' },
            { label: 'سنة خبرة', value: '9' },
            { label: 'فئة منتج', value: '120+' },
            { label: 'موقع بيع', value: '15+' },
          ].map((stat, i) => (
            <div key={i} className="bg-(--d2) border border-(--border) rounded-xl p-6 text-center">
              <div className="text-3xl font-black text-(--o) mb-2">{stat.value}</div>
              <div className="text-sm text-(--muted2)">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-black text-white mb-10 text-center">قيمنا الأساسية</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'مهمتنا', desc: 'توفير حلول سلامة وجودة عالية بأسعار منافسة' },
              { title: 'رؤيتنا', desc: 'أن نكون الشركة الرائدة في مجال السلامة الصناعية' },
              { title: 'قيمنا', desc: 'الشفافية والنزاهة والجودة في كل ما نقدمه' },
            ].map((val, i) => (
              <div key={i} className="bg-linear-to-br from-[rgba(255,107,0,0.05)] to-transparent border border-(--border) rounded-xl p-8">
                <h3 className="text-xl font-bold text-(--o) mb-3">{val.title}</h3>
                <p className="text-(--muted2)">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-linear-to-r from-(--d3) to-(--d2) border border-(--border2) rounded-xl p-12 text-center">
          <h2 className="text-2xl font-black text-white mb-4">هل تريد التعاون معنا؟</h2>
          <p className="text-(--muted2) mb-6 max-w-xl mx-auto">
            نرحب بالشراكات الجديدة والفرص التعاونية
          </p>
          <Link to="/contact" className="btn-fire inline-flex">
            تواصل معنا
          </Link>
        </div>
      </div>
    </div>
  );
}
