/**
 * AdminSidebar.tsx
 *
 * Left navigation column.
 * Owns: account pill, nav section groupings, TabButton rendering.
 *
 * Previously ~50 lines inlined inside AdminDashboard.tsx.
 */

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
};

export function AdminSidebar({ user, activeTab, tabCounts, onTabChange }: Props) {
  return (
    <aside className="space-y-3 xl:sticky xl:top-6 xl:self-start">
      {/* Account card */}
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Your account</p>
        <p className="mt-3 text-lg font-semibold text-slate-900">{user?.name ?? 'Admin user'}</p>
        <p className="mt-1 text-sm text-slate-600">{user?.email ?? 'No email available'}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <StatusPill label={user?.role ?? 'admin'} tone="accent" />
          <StatusPill
            label={isSupabaseConfigured() ? 'Live data' : 'Demo data'}
            tone={isSupabaseConfigured() ? 'success' : 'warning'}
          />
        </div>
      </div>

      {/* Nav sections */}
      <div className="rounded-[28px] border border-slate-200 bg-white p-3 shadow-sm">
        <div className="max-h-[calc(100vh-260px)] space-y-5 overflow-auto px-2 py-2">
          {navSections.map((section) => (
            <div key={section.title}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                {section.title}
              </p>
              <div className="space-y-2">
                {section.items.map((tab) => (
                  <TabButton
                    key={tab.id}
                    tab={tab}
                    active={activeTab === tab.id}
                    count={formatTabCount(tab.id, tabCounts[tab.id])}
                    onClick={() => onTabChange(tab.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
