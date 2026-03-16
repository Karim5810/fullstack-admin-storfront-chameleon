import type { ReactNode } from 'react';
import type { TabConfig } from './navConfig';

/** TailAdmin-style page card: white bg, border, shadow */
export function PageCard({ title, subtitle, actions, children }: { title: string; subtitle?: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
          </div>
          {actions}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

/** TailAdmin-style data table wrapper */
export function DataTable({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">{children}</table>
    </div>
  );
}

export function TableHead({ children }: { children: ReactNode }) {
  return <thead className="bg-gray-50">{children}</thead>;
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-gray-200 bg-white">{children}</tbody>;
}

export function TableRow({ children, onClick, className = '' }: { children: ReactNode; onClick?: () => void; className?: string }) {
  return (
    <tr
      className={`${onClick ? 'cursor-pointer transition-colors hover:bg-gray-50' : ''} ${className}`}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </tr>
  );
}

export function Th({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 ${className}`}>
      {children}
    </th>
  );
}

export function Td({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <td className={`whitespace-nowrap px-6 py-4 text-sm text-gray-900 ${className}`}>{children}</td>;
}

/** Stat widget for dashboard - TailAdmin style */
export function StatCard({ label, value, change, icon: Icon }: { label: string; value: string; change?: string; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
          {change && <p className="mt-1 text-xs text-gray-500">{change}</p>}
        </div>
        {Icon && (
          <div className="rounded-full bg-orange-100 p-3">
            <Icon className="h-6 w-6 text-orange-600" />
          </div>
        )}
      </div>
    </div>
  );
}

/** Toolbar: search + filters + actions */
export function Toolbar({ children }: { children: ReactNode }) {
  return <div className="mb-4 flex flex-wrap items-center gap-3">{children}</div>;
}

export function Panel({
  title,
  eyebrow,
  children,
  actions,
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          {eyebrow ? <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-orange-600">{eyebrow}</p> : null}
          <h2 className="text-base font-semibold text-gray-900 md:text-lg">{title}</h2>
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}

export function MetricCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">{value}</p>
      <p className="mt-1 text-xs text-gray-600">{helper}</p>
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center">
      <h3 className="mb-2 text-base font-semibold text-gray-900">{title}</h3>
      <p className="mx-auto max-w-sm text-sm leading-6 text-gray-600">{description}</p>
    </div>
  );
}

export function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-orange-600">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-gray-500">{label}</span>
      {children}
    </label>
  );
}

export function textInputClass() {
  return 'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-200';
}

export const areaClass = `${textInputClass()} min-h-[120px]`;

export function ToggleField({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2">
      <span className="min-w-0">
        <span className="block text-sm font-medium text-gray-900">{label}</span>
        {description ? <span className="mt-0.5 block text-xs text-gray-500">{description}</span> : null}
      </span>
      <span className="relative inline-flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="peer sr-only"
        />
        <span className="h-6 w-10 rounded-full border border-gray-200 bg-gray-200 transition-colors peer-checked:border-orange-500 peer-checked:bg-orange-500" />
        <span className="pointer-events-none absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
      </span>
    </label>
  );
}

/** Small pill used across admin UI for statuses and badges */
export function StatusPill({
  label,
  tone = 'neutral',
}: {
  label: string;
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'accent';
}) {
  const toneClass = {
    neutral: 'border-gray-200 bg-gray-100 text-gray-700',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    warning: 'border-amber-200 bg-amber-50 text-amber-700',
    danger: 'border-red-200 bg-red-50 text-red-700',
    accent: 'border-orange-200 bg-orange-50 text-orange-700',
  }[tone];

  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${toneClass}`}>
      {label}
    </span>
  );
}

/** Inline message banner for success / error notices in the header */
export function AdminMessage({ tone, children }: { tone: 'success' | 'error'; children: ReactNode }) {
  const toneClass =
    tone === 'success'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
      : 'border-red-200 bg-red-50 text-red-800';

  return <div className={`rounded-lg border px-3 py-2 text-xs ${toneClass}`}>{children}</div>;
}

/** Sidebar navigation button used for admin tabs */
export function TabButton({
  tab,
  active,
  count,
  onClick,
  compact = false,
}: {
  tab: TabConfig;
  active: boolean;
  count?: string;
  onClick: () => void;
  compact?: boolean;
}) {
  const { icon: Icon, label, description } = tab;
  const base =
    'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors';
  const activeClass = 'bg-orange-50 text-orange-700 border-l-2 border-orange-500';
  const inactiveClass =
    'text-gray-600 hover:bg-gray-100 hover:text-gray-900 border-l-2 border-transparent';

  if (compact) {
    return (
      <button
        type="button"
        className={`${base} ${active ? 'bg-orange-50 text-orange-700 font-medium' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
        onClick={onClick}
      >
        <Icon className="h-4 w-4 shrink-0 text-current" />
        <span className="min-w-0 truncate">{label}</span>
        {count ? (
          <span className="ml-auto rounded bg-gray-200 px-2 py-0.5 text-[10px] font-semibold text-gray-700">
            {count}
          </span>
        ) : null}
      </button>
    );
  }

  return (
    <button type="button" className={`${base} ${active ? activeClass : inactiveClass}`} onClick={onClick}>
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
          <Icon className="h-4 w-4" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold">{label}</span>
          <span className="block truncate text-xs text-gray-500">{description}</span>
        </span>
      </div>
      {count ? (
        <span className="rounded-full bg-gray-900 px-2 py-0.5 text-[11px] font-semibold leading-none text-white">
          {count}
        </span>
      ) : null}
    </button>
  );
}

