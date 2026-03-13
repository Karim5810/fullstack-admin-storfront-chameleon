import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import type { Service } from '../types';
import { getServicePath } from '../utils/catalog';

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      setLoading(true);

      try {
        const servicesData = await api.services.getAll();
        setServices(servicesData);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  return (
    <div className="page-enter">
      <div className="bg-linear-to-r from-(--d3) to-(--d2) border-b border-(--border) py-12">
        <div className="container text-center">
          <h1 className="text-4xl font-black text-white mb-2">خدماتنا الصناعية</h1>
          <p className="text-(--muted2)">مسارات تنفيذية تربط بين التوريد والسلامة والتشغيل والتحسين المستمر.</p>
        </div>
      </div>

      <div className="container py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-80 rounded-2xl bg-(--d2) animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-(--d2) border border-(--border) rounded-xl p-8 hover:border-(--o) transition-all"
              >
                <div className="w-14 h-14 bg-[rgba(255,107,0,0.1)] rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 stroke-(--o) stroke-2 fill-none" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-(--muted2) mb-4">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {(service.features ?? []).slice(0, 3).map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-(--muted2)">
                      <svg className="w-4 h-4 fill-(--o)" viewBox="0 0 20 20">
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to={getServicePath(service)}
                  className="text-(--o) font-bold text-sm hover:gap-2 flex items-center gap-1 transition-all"
                >
                  تفاصيل الخدمة
                  <svg className="w-3 h-3 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        )}

        <div className="bg-linear-to-r from-(--d3) to-(--d2) border border-(--border2) rounded-xl p-12 text-center">
          <h2 className="text-2xl font-black text-white mb-4">هل تحتاج مساراً تنفيذياً مخصصاً؟</h2>
          <p className="text-(--muted2) mb-6 max-w-xl mx-auto">
            تحدث معنا عن احتياج الموقع أو المصنع وسنقترح الخدمة الأنسب أو باقة تجمع أكثر من مسار.
          </p>
          <Link to="/quote" className="btn-fire inline-flex">
            اطلب عرضاً مخصصاً
          </Link>
        </div>
      </div>
    </div>
  );
}
