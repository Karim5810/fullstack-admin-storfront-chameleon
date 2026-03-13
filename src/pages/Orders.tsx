import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';
import type { Order, OrderStatus } from '../types';
import { formatCurrency } from '../utils/catalog';
import { ORDER_STATUS_CLASSES, ORDER_STATUS_LABELS } from '../utils/orders';

export default function Orders() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user?.id) {
        setOrders([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await api.orders.getByUserId(user.id);
        setOrders(data);
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : 'تعذر تحميل الطلبات.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadOrders();
  }, [user?.id]);

  const filteredOrders = useMemo(
    () => (statusFilter === 'all' ? orders : orders.filter((order) => order.status === statusFilter)),
    [orders, statusFilter],
  );

  return (
    <div className="page-enter">
      <div className="bg-(--d2) border-b border-(--border) py-4">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/" className="hover:text-(--o)">
              الرئيسية
            </Link>
            <span className="mx-2 text-(--muted)">/</span>
            <span className="text-(--chrome)">طلباتي</span>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <h1 className="text-3xl font-bold text-white mb-8">طلباتي</h1>

        <div className="flex gap-2 mb-8 flex-wrap">
          {(['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map(
            (status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  statusFilter === status
                    ? 'bg-(--o) text-white'
                    : 'bg-(--d2) text-(--muted2) hover:text-white'
                }`}
              >
                {status === 'all' ? 'الكل' : ORDER_STATUS_LABELS[status]}
              </button>
            ),
          )}
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-32 rounded-2xl bg-(--d2) animate-pulse" />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-(--d2) border border-(--border) rounded-xl p-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <h2 className="text-xl font-bold text-(--chrome) mb-2">لا توجد طلبات بهذا التصنيف</h2>
            <p className="text-(--muted2) mb-6">ابدأ التسوق وسيظهر سجل طلباتك هنا.</p>
            <Link to="/products" className="btn-fire inline-flex">
              ابدأ التسوق
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="block bg-(--d2) border border-(--border) rounded-xl p-6 hover:border-(--o) transition-colors"
              >
                <div className="flex justify-between items-start gap-6 flex-wrap">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2 flex-wrap">
                      <h3 className="text-lg font-bold text-white">{order.orderNumber}</h3>
                      <span className={`text-sm font-semibold ${ORDER_STATUS_CLASSES[order.status]}`}>
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </div>
                    <p className="text-sm text-(--muted2) mb-3">
                      التاريخ: {new Date(order.createdAt).toLocaleDateString('ar-EG')}
                    </p>
                    <p className="text-sm text-(--muted2)">{order.items.length} منتج</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-(--o)">{formatCurrency(order.total)}</p>
                    <p className="text-xs text-(--muted2) mt-1">الإجمالي</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
