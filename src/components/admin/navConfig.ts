import type { ComponentType, SVGProps } from 'react';
import {
  LayoutDashboard,
  Store,
  Package,
  Tags,
  Wrench,
  FileText,
  ShoppingCart,
  FileSignature,
  Users,
} from 'lucide-react';
import type { DashboardTab } from '../../hooks/useAdminDashboardController';

export type TabConfig = {
  id: DashboardTab;
  label: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

type NavSection = {
  title: string;
  items: TabConfig[];
};

export const navSections: NavSection[] = [
  {
    title: 'لوحة الخدمات',
    items: [
      {
        id: 'overview',
        label: 'لوحة التحكم',
        description: 'ملخص الأداء العام والنشاط الأخير.',
        icon: LayoutDashboard,
      },
      {
        id: 'storefront',
        label: 'واجهة المتجر',
        description: 'إعدادات الصفحة الرئيسية والتصميم.',
        icon: Store,
      },
    ],
  },
  {
    title: 'الكاتالوج',
    items: [
      {
        id: 'products',
        label: 'المنتجات',
        description: 'إدارة المنتجات والأسعار والمخزون.',
        icon: Package,
      },
      {
        id: 'categories',
        label: 'الأقسام',
        description: 'تنظيم أقسام وفئات المنتجات.',
        icon: Tags,
      },
      {
        id: 'services',
        label: 'الخدمات',
        description: 'إدارة خدمات التركيبات والصيانة.',
        icon: Wrench,
      },
      {
        id: 'blog',
        label: 'المقالات',
        description: 'محتوى تعليمي وأخبار الشركة.',
        icon: FileText,
      },
    ],
  },
  {
    title: 'المبيعات وإدارة العلاقات',
    items: [
      {
        id: 'orders',
        label: 'الطلبات',
        description: 'متابعة طلبات العملاء وحالتها.',
        icon: ShoppingCart,
      },
      {
        id: 'quotes',
        label: 'عروض الأسعار',
        description: 'طلبات تسعير من الشركات والعملاء.',
        icon: FileSignature,
      },
      {
        id: 'leads',
        label: 'العملاء المحتملون',
        description: 'تسجيلات B2B والمتابعة.',
        icon: Users,
      },
      {
        id: 'customers',
        label: 'العملاء',
        description: 'ملفات العملاء المسجلين.',
        icon: Users,
      },
    ],
  },
];

export function formatTabCount(id: DashboardTab, raw?: string) {
  if (!raw) return undefined;
  if (id === 'storefront') {
    // Show just a short "time" style for updatedAt strings, or fallback to raw
    const date = new Date(raw);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString('ar-EG', {
        month: 'short',
        day: '2-digit',
      });
    }
    return raw;
  }

  return raw;
}

