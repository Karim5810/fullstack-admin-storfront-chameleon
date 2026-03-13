import type { OrderStatus } from '../types';

export const ORDER_STATUS_STEPS: OrderStatus[] = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'قيد الانتظار',
  confirmed: 'تم التأكيد',
  processing: 'قيد المعالجة',
  shipped: 'تم الشحن',
  delivered: 'تم التسليم',
  cancelled: 'ملغي',
};

export const ORDER_STATUS_CLASSES: Record<OrderStatus, string> = {
  pending: 'text-yellow-400',
  confirmed: 'text-sky-400',
  processing: 'text-orange-400',
  shipped: 'text-violet-400',
  delivered: 'text-emerald-400',
  cancelled: 'text-red-400',
};

export const hasReachedOrderStep = (status: OrderStatus, step: OrderStatus) => {
  if (status === 'cancelled') {
    return false;
  }

  return ORDER_STATUS_STEPS.indexOf(status) >= ORDER_STATUS_STEPS.indexOf(step);
};
