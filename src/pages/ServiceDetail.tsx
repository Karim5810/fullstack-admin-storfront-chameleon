import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api';
import type { Product, Service } from '../types';
import { getProductPath, getServicePath } from '../utils/catalog';

export default function ServiceDetail() {
  const { id = '' } = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [relatedServices, setRelatedServices] = useState<Service[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadService = async () => {
      setLoading(true);

      try {
        const serviceData = await api.services.getById(id);
        setService(serviceData);

        const [servicesData, productsData] = await Promise.all([
          api.services.getAll(),
          api.products.getAll(),
        ]);

        setRelatedServices(servicesData.filter((entry) => entry.id !== serviceData?.id).slice(0, 3));
        setRelatedProducts(
          productsData
            .filter((product) => product.category === serviceData?.relatedCategory)
            .slice(0, 4),
        );
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [id]);

  if (!loading && !service) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">الخدمة غير موجودة</h1>
        <p className="text-(--muted2) mb-6">تعذر العثور على تفاصيل هذه الخدمة في الوقت الحالي.</p>
        <Link to="/services" className="btn-fire inline-flex">
          العودة إلى الخدمات
        </Link>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <div className="bg-linear-to-r from-(--d3) to-(--d2) border-b border-(--border) py-12">
        <div className="container max-w-5xl">
          <h1 className="text-4xl font-black mb-4">{service?.title ?? '...'}</h1>
          <p className="text-(--muted2) max-w-3xl leading-8">
            {service?.description || 'حل مهني مصمم لدعم التشغيل والسلامة داخل منشأتك.'}
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-10">
          <div className="space-y-8">
            <section className="bg-(--d2) border border-(--border) rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-5">ماذا تتضمن الخدمة؟</h2>
              {loading ? (
                <div className="space-y-4">
                  <div className="h-5 rounded bg-(--d3) animate-pulse" />
                  <div className="h-5 rounded bg-(--d3) animate-pulse" />
                  <div className="h-5 rounded bg-(--d3) animate-pulse" />
                </div>
              ) : (
                <div className="space-y-4">
                  {(service?.details ?? []).map((detail) => (
                    <div
                      key={detail}
                      className="rounded-2xl border border-(--border) bg-(--d3) px-5 py-4 text-(--muted2) leading-8"
                    >
                      {detail}
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-(--d2) border border-(--border) rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-5">منتجات مرتبطة بالخدمة</h2>
              <div className="products-grid">
                {relatedProducts.map((product) => (
                  <Link key={product.id} to={getProductPath(product)} className="prod-card">
                    <div className="prod-img" style={{ background: 'var(--d2)' }}>
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-contain p-4"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="prod-info">
                      <div className="prod-brand">{product.brand}</div>
                      <h3 className="prod-name">{product.title}</h3>
                      <div className="prod-price">
                        <span className="p-main">{product.price.toFixed(2)} ج.م</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="bg-(--d2) border border-(--border) rounded-3xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">أبرز المخرجات</h2>
              <div className="space-y-3">
                {(service?.features ?? []).map((feature) => (
                  <div key={feature} className="flex items-start gap-3 text-sm text-(--muted2)">
                    <span className="mt-1 w-2.5 h-2.5 rounded-full bg-(--o) shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <Link to="/quote" className="btn-fire w-full justify-center mt-6">
                اطلب عرضاً للخدمة
              </Link>
            </div>

            <div className="bg-(--d2) border border-(--border) rounded-3xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">خدمات أخرى</h2>
              <div className="space-y-4">
                {relatedServices.map((entry) => (
                  <Link
                    key={entry.id}
                    to={getServicePath(entry)}
                    className="block rounded-2xl border border-(--border) p-4 hover:border-(--o) transition-colors"
                  >
                    <h3 className="font-bold text-white mb-2">{entry.title}</h3>
                    <p className="text-sm text-(--muted2) line-clamp-2">{entry.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
