import React from 'react';
import { Link } from 'react-router-dom';

interface Job {
  id: string;
  title: string;
  location: string;
  type: string;
  department: string;
}

export default function Careers() {
  const [jobs] = React.useState<Job[]>([
    {
      id: '1',
      title: 'مهندس السلامة الصناعية',
      location: 'القاهرة',
      type: 'دوام كامل',
      department: 'الهندسة',
    },
    {
      id: '2',
      title: 'مسؤول المبيعات',
      location: 'الإسكندرية',
      type: 'دوام كامل',
      department: 'المبيعات',
    },
  ]);

  return (
    <div className="page-enter">
      {/* Hero */}
      <div className="bg-linear-to-r from-(--d3) to-(--d2) border-b border-(--border) py-16">
        <div className="container text-center">
          <h1 className="text-4xl font-black mb-4">انضم إلى فريقنا</h1>
          <p className="text-(--muted2) max-w-2xl mx-auto">
            نبحث عن مواهب متميزة تشاركنا رؤيتنا في تحسين السلامة الصناعية
          </p>
        </div>
      </div>

      <div className="container py-16">
        {/* Why Join */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {[
            { title: 'بيئة عمل رائعة', desc: 'فريق متعاون ومحفز' },
            { title: 'مزايا تنافسية', desc: 'راتب وتأمين صحي ممتاز' },
            { title: 'فرص تطور', desc: 'برامج تدريب وتطور مهني' },
            { title: 'مشاريع مهمة', desc: 'عمل ذو تأثير إيجابي' },
          ].map((item, i) => (
            <div key={i} className="bg-(--d2) border border-(--border) rounded-xl p-6 text-center">
              <h3 className="font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-(--muted2)">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Job Listings */}
        <div className="mb-16">
          <h2 className="text-3xl font-black text-white mb-8">الوظائف المتاحة</h2>
          
          {jobs.length === 0 ? (
            <div className="bg-(--d2) border border-(--border) rounded-xl p-12 text-center">
              <p className="text-(--muted2)">لا توجد وظائف متاحة حالياً</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="bg-(--d2) border border-(--border) rounded-xl p-6 hover:border-(--o) transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-white">{job.title}</h3>
                      <p className="text-sm text-(--muted2)">{job.department}</p>
                    </div>
                    <button className="btn-fire text-sm px-4 py-2">
                      تقديم الطلب
                    </button>
                  </div>
                  <div className="flex gap-4 text-sm text-(--muted2)">
                    <span>📍 {job.location}</span>
                    <span>⏰ {job.type}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Application Info */}
        <div className="bg-linear-to-r from-(--d3) to-(--d2) border border-(--border2) rounded-xl p-12">
          <h2 className="text-2xl font-black text-white mb-4">تقديم الطلبات</h2>
          <p className="text-(--muted2) mb-6">
            إرسل سيرتك الذاتية وخطاب التحفيز إلى بريدنا الإلكتروني
          </p>
          <p className="text-(--o) font-semibold">
            careers@alrayan.com
          </p>
        </div>
      </div>
    </div>
  );
}
