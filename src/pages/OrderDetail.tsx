import React from 'react';
import { Link, useParams } from 'react-router-dom';

const statusLabels = {
  pending: { label: 'قيد الانتظار', color: 'text-yellow-500' },
  confirmed: { label: 'تم التأكيد', color: 'text-blue-500' },
  processing: { label: 'قيد المعالجة', color: 'text-orange-500' },
  shipped: { label: 'تم الشحن', color: 'text-purple-500' },
  delivered: { label: 'تم التسليم', color: 'text-green-500' },
  cancelled: { label: 'ملغي', color: 'text-red-500' },
} as const;

export default function OrderDetail() {
  const { id = 'unknown' } = useParams();
  const order = {
    id,
    number: `ORD-${id.toUpperCase()}`,
    createdAt: '2026-03-08',
    status: 'processing' as const,
    itemsCount: 3,
    total: 450,
  };

  return (
    <div className="page-enter">
      <div className="bg-(--d2) border-b border-(--border) py-4">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/" className="hover:text-(--o)">
              الرئيسية
            </Link>
            <span className="mx-2 text-(--muted)">/</span>
            <Link to="/orders" className="hover:text-(--o)">
              طلباتي
            </Link>
            <span className="mx-2 text-(--muted)">/</span>
            <span className="text-(--chrome)">تفاصيل الطلب</span>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-4xl space-y-6">
          <div className="rounded-3xl border border-(--border) bg-(--d2) p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm text-(--muted2) mb-2">رقم الطلب</p>
                <h1 className="text-3xl font-black text-white">{order.number}</h1>
              </div>
              <div className="text-right">
                <span className={`text-sm font-semibold ${statusLabels[order.status].color}`}>
                  {statusLabels[order.status].label}
                </span>
                <p className="mt-2 text-sm text-(--muted2)">
                  {new Date(order.createdAt).toLocaleDateString('ar-EG')}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-(--border) bg-(--d2) p-6">
              <p className="text-sm text-(--muted2) mb-2">عدد المنتجات</p>
              <p className="text-2xl font-black text-white">{order.itemsCount}</p>
            </div>
            <div className="rounded-3xl border border-(--border) bg-(--d2) p-6">
              <p className="text-sm text-(--muted2) mb-2">الإجمالي</p>
              <p className="text-2xl font-black text-(--o)">{order.total.toFixed(2)} ج.م</p>
            </div>
            <div className="rounded-3xl border border-(--border) bg-(--d2) p-6">
              <p className="text-sm text-(--muted2) mb-2">الحالة الحالية</p>
              <p className={`text-lg font-bold ${statusLabels[order.status].color}`}>
                {statusLabels[order.status].label}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-(--border) bg-(--d2) p-8">
            <h2 className="text-xl font-bold text-white mb-4">ملاحظات الطلب</h2>
            <p className="text-(--muted2) leading-8">
              هذه صفحة مبدئية لعرض تفاصيل الطلب حتى يتم ربطها ببيانات الطلبات الفعلية من قاعدة البيانات.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
