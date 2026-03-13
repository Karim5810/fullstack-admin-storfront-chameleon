import React from 'react';
import { Link } from 'react-router-dom';

const certificates = [
  { title: 'إدارة السلامة والجودة', detail: 'مسار عمل موثق لإدارة الجودة ومتطلبات التشغيل الداخلي.' },
  { title: 'اعتماد مورد صناعي', detail: 'إجراءات مراجعة للموردين والمنتجات وربط الاعتماد بملفات التوريد.' },
  { title: 'التدريب والاستجابة للطوارئ', detail: 'برامج تدريب ومتابعة دورية لرفع الجاهزية الميدانية.' },
];

export default function Certificates() {
  return (
    <div className="page-enter">
      <div className="container py-14">
        <div className="max-w-3xl mb-10">
          <h1 className="text-4xl font-black text-white mb-4">الشهادات والاعتمادات</h1>
          <p className="text-(--muted2) leading-8">
            نعرض هنا مسارات الاعتماد والامتثال التي ندعم بها الشركات في التوريد والسلامة والتشغيل.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {certificates.map((certificate) => (
            <div key={certificate.title} className="rounded-3xl border border-(--border) bg-(--d2) p-6">
              <h2 className="text-xl font-bold text-white mb-3">{certificate.title}</h2>
              <p className="text-(--muted2) leading-8">{certificate.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/services/iso" className="btn-fire">
            تجهيز ملف الاعتماد
          </Link>
          <Link to="/quote" className="btn-ghost">
            طلب استشارة
          </Link>
        </div>
      </div>
    </div>
  );
}
