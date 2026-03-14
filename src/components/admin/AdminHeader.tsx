import type { ReactNode } from 'react';
import type { User } from '../../types';
import { StatusPill } from './AdminShell';

type AdminHeaderProps = {
  user: User | null;
  storefrontDirty: boolean;
  onRefresh: () => void;
  onSignOut: () => void;
  onStorefront: () => void;
  children?: ReactNode;
};

export function AdminHeader({
  user,
  storefrontDirty,
  onRefresh,
  onSignOut,
  onStorefront,
  children,
}: AdminHeaderProps) {
  const name = user?.name ?? 'Admin workspace';

  return (
    <header className="rounded-[32px] border border-slate-200 bg-white px-5 py-4 shadow-sm md:px-6 md:py-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-700">Dashboard</p>
          <h1 className="mt-2 truncate text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
            {name}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage storefront, catalog, and customer activity from a single place.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          {storefrontDirty ? (
            <StatusPill label="Unpublished changes" tone="warning" />
          ) : (
            <StatusPill label="Storefront in sync" tone="success" />
          )}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            onClick={onRefresh}
          >
            Refresh data
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            onClick={onStorefront}
          >
            Storefront settings
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            onClick={onSignOut}
          >
            Sign out
          </button>
        </div>
      </div>

      {children ? <div className="mt-4 space-y-2">{children}</div> : null}
    </header>
  );
}

