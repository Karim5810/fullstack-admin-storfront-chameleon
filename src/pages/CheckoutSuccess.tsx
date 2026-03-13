import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import type { Order } from '../types';
import { formatCurrency } from '../utils/catalog';

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const orderRef = searchParams.get('id') || searchParams.get('order') || '';

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderRef) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await api.orders.getById(orderRef);
        setOrder(data);
      } finally {
        setIsLoading(false);
      }
    };

    void loadOrder();
  }, [orderRef]);

  return (
    <div className="page-enter">
      <div className="container min-h-[70vh] flex flex-col items-center justify-center text-center py-20">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[rgba(0,200,120,0.1)] border border-[rgba(0,200,120,0.3)]">
            <svg className="w-12 h-12 text-[#00c878]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-black text-white mb-3">تم تأكيد طلبك بنجاح</h1>
        <p className="text-2xl text-(--o) font-bold mb-4">
          رقم الطلب: {order?.orderNumber ?? searchParams.get('order') ?? 'قيد التوليد'}
        </p>

        <div className="bg-(--d2) border border-(--border) rounded-xl p-8 max-w-xl w-full mb-8 text-right">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-5 rounded bg-(--d3) animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <p className="text-(--muted2) leading-relaxed mb-4 text-center">
                تم استلام طلبك بنجاح وسيقوم فريقنا بمراجعته والتواصل معك لتأكيد الدفع والتسليم.
              </p>

              {order ? (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-(--muted2)">عدد المنتجات</span>
                    <span className="text-white">{order.items.length}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-(--muted2)">إجمالي الطلب</span>
                    <span className="text-white">{formatCurrency(order.total)}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-(--muted2)">طريقة الدفع</span>
                    <span className="text-white">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-(--muted2)">عنوان الشحن</span>
                    <span className="text-white">{order.shippingAddress.city}</span>
                  </div>
                </div>
              ) : (
                <p className="text-(--muted2) text-center">
                  يمكنك متابعة حالة الطلب من صفحة الطلبات بمجرد اكتمال المعالجة.
                </p>
              )}
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md mb-8">
          <div className="bg-(--d3) border border-(--border) rounded-lg p-4">
            <div className="text-2xl mb-2">متابعة</div>
            <h3 className="font-semibold text-white mb-1">حالة الطلب</h3>
            <p className="text-xs text-(--muted2)">ستظهر التحديثات الجديدة داخل صفحة الطلبات.</p>
          </div>
          <div className="bg-(--d3) border border-(--border) rounded-lg p-4">
            <div className="text-2xl mb-2">تسليم</div>
            <h3 className="font-semibold text-white mb-1">التجهيز والشحن</h3>
            <p className="text-xs text-(--muted2)">نراجع توفر الأصناف ثم ننسق معك موعد التسليم.</p>
          </div>
        </div>

        <div className="flex gap-4 w-full max-w-md">
          <Link to={order ? `/orders/${order.id}` : '/orders'} className="btn-fire flex-1 inline-flex justify-center">
            عرض تفاصيل الطلب
          </Link>
          <Link to="/products" className="btn-ghost flex-1 inline-flex justify-center">
            متابعة التسوق
          </Link>
        </div>
      </div>
    </div>
  );
}
