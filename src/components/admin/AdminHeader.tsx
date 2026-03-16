/**
 * AdminHeader.tsx
 *
 * TailAdmin-style sticky top header: compact bar with breadcrumb, actions, user.
 */

import { Menu } from 'lucide-react';
import type { ReactNode } from 'react';
import type { User } from '../../types';
import { StatusPill } from './AdminShell';
import type { DashboardTab } from '../../hooks/useAdminDashboardController';

const TAB_LABELS: Record<DashboardTab, string> = {
  overview: 'لوحة التحكم',
  storefront: 'واجهة المتجر',
  products: 'المنتجات',
  categories: 'الأقسام',
  services: 'الخدمات',
  blog: 'المقالات',
  orders: 'الطلبات',
  quotes: 'عروض الأسعار',
  leads: 'العملاء المحتملون',
  customers: 'العملاء',
  'cms-products': '',
  'cms-orders': '',
  'cms-customers': '',
  'cms-content': '',
  'cms-media': '',
  'cms-promotions': '',
  'cms-navigation': '',
  'cms-settings': ''
};

type AdminHeaderProps = {
  user: User | null;
  storefrontDirty: boolean;
  activeTab: DashboardTab;
  onRefresh: () => void;
  onSignOut: () => void;
  onStorefront: () => void;
  onMenuClick: () => void;
  children?: ReactNode;
};

export function AdminHeader({
  storefrontDirty,
  activeTab,
  onRefresh,
  onSignOut,
  onStorefront,
  onMenuClick,
  children,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex shrink-0 flex-col border-b border-gray-200 bg-white shadow-sm">
      <div className="flex h-14 items-center justify-between gap-4 px-4 md:px-6">
        {/* Left: hamburger + page title */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="truncate text-base font-semibold text-gray-900 md:text-lg">
            {TAB_LABELS[activeTab]}
          </h1>
        </div>

        {/* Right: status + actions */}
        <div className="flex shrink-0 items-center gap-2">
          {storefrontDirty ? (
            <StatusPill label="غير منشورة" tone="warning" />
          ) : (
            <StatusPill label="متزامنة" tone="success" />
          )}
          <button
            type="button"
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={onRefresh}
          >
            تحديث
          </button>
          <button
            type="button"
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={onStorefront}
          >
            واجهة المتجر
          </button>
          <button
            type="button"
            className="rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-orange-600"
            onClick={onSignOut}
          >
            تسجيل الخروج
          </button>
        </div>
      </div>

      {children ? (
        <div className="border-t border-gray-100 bg-gray-50/80 px-4 py-2 md:px-6">
          {children}
        </div>
      ) : null}
    </header>
  );
}
