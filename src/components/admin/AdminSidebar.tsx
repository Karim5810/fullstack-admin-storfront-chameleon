/**
 * AdminSidebar.tsx
 *
 * TailAdmin-style fixed sidebar: compact nav, mobile overlay, responsive.
 */

import { X } from 'lucide-react';
import { StatusPill, TabButton } from './AdminShell';
import { navSections, formatTabCount } from './navConfig';
import { isSupabaseConfigured } from '../../supabaseClient';
import type { DashboardTab } from '../../hooks/useAdminDashboardController';
import type { User } from '../../types';

type Props = {
  user: User | null;
  activeTab: DashboardTab;
  tabCounts: Record<string, string | undefined>;
  onTabChange: (tab: DashboardTab) => void;
  sidebarOpen?: boolean;
  onClose?: () => void;
};

export function AdminSidebar({
  user,
  activeTab,
  tabCounts,
  onTabChange,
  sidebarOpen = true,
  onClose,
}: Props) {
  return (
    <>
      {/* Desktop: static sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white shadow-sm
          transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo / brand */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 px-4">
          <span className="text-lg font-bold tracking-tight text-gray-900">
            لوحة التحكم
          </span>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 lg:hidden"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Nav sections - scrollable */}
        <nav className="flex-1 bg-white overflow-y-auto px-3 py-4">
          {navSections.map((section) => (
            <div key={section.title}>
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                {section.title}
              </p>
              <ul className="space-y-1">
                {section.items.map((tab) => (
                  <li key={tab.id}>
                    <TabButton
                      tab={tab}
                      active={activeTab === tab.id}
                      count={formatTabCount(tab.id, tabCounts[tab.id])}
                      onClick={() => onTabChange(tab.id)}
                      compact
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="border-t border-gray-200 p-4">
          <div className="rounded-lg bg-gray-50 px-3 py-2">
            <p className="truncate text-sm font-medium text-gray-900">
              {user?.name ?? 'Admin'}
            </p>
            <p className="truncate text-xs text-gray-500">
              {user?.email ?? ''}
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              <StatusPill label={user?.role ?? 'admin'} tone="accent" />
              <StatusPill
                label={isSupabaseConfigured() ? 'مباشر' : 'تجربة'}
                tone={isSupabaseConfigured() ? 'success' : 'warning'}
              />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
