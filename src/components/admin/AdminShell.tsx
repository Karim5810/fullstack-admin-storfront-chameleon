import type { ReactNode } from 'react';
import type { TabConfig } from './navConfig';

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
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          {eyebrow ? <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-orange-700">{eyebrow}</p> : null}
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}

export function MetricCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-slate-900">{value}</p>
      <p className="mt-2 text-sm text-slate-600">{helper}</p>
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
      <h3 className="mb-2 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mx-auto max-w-md text-sm leading-7 text-slate-600">{description}</p>
    </div>
  );
}

export function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 md:p-5">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-orange-700">{title}</h3>
      <div className="space-y-4">{children}</div>
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
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</span>
      {children}
    </label>
  );
}

export function textInputClass() {
  return 'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-orange-300';
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
    <label className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-slate-900">{label}</span>
        {description ? <span className="mt-1 block text-xs leading-5 text-slate-500">{description}</span> : null}
      </span>
      <span className="relative inline-flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="peer sr-only"
        />
        <span className="h-7 w-12 rounded-full border border-slate-200 bg-slate-200 transition-colors peer-checked:border-orange-300 peer-checked:bg-orange-400" />
        <span className="pointer-events-none absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
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
    neutral: 'border-slate-200 bg-slate-100 text-slate-700',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    warning: 'border-amber-200 bg-amber-50 text-amber-700',
    danger: 'border-red-200 bg-red-50 text-red-700',
    accent: 'border-orange-200 bg-orange-50 text-orange-700',
  }[tone];

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${toneClass}`}>
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

  return <div className={`rounded-2xl border px-4 py-3 text-sm ${toneClass}`}>{children}</div>;
}

/** Sidebar navigation button used for admin tabs */
export function TabButton({
  tab,
  active,
  count,
  onClick,
}: {
  tab: TabConfig;
  active: boolean;
  count?: string;
  onClick: () => void;
}) {
  const { icon: Icon, label, description } = tab;
  const base =
    'flex w-full items-center justify-between gap-3 rounded-2xl border px-3 py-2.5 text-left text-sm transition-colors';
  const activeClass = 'border-orange-300 bg-orange-50 text-slate-900';
  const inactiveClass =
    'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900';

  return (
    <button type="button" className={`${base} ${active ? activeClass : inactiveClass}`} onClick={onClick}>
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-slate-50 text-slate-600">
          <Icon className="h-4 w-4" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold">{label}</span>
          <span className="block truncate text-xs text-slate-500">{description}</span>
        </span>
      </div>
      {count ? (
        <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[11px] font-semibold leading-none text-white">
          {count}
        </span>
      ) : null}
    </button>
  );
}

