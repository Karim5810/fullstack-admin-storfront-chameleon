import type { ReactNode } from 'react';

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
    <section className="rounded-[28px] border border-white/8 bg-[rgba(10,14,22,0.86)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl md:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          {eyebrow ? <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.28em] text-(--o2)">{eyebrow}</p> : null}
          <h2 className="text-xl font-black text-white">{title}</h2>
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}

export function MetricCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="rounded-[24px] border border-white/8 bg-white/4 p-5">
      <p className="text-sm font-semibold text-(--muted2)">{label}</p>
      <p className="mt-3 text-3xl font-black tracking-[-0.03em] text-white">{value}</p>
      <p className="mt-2 text-sm text-(--muted2)">{helper}</p>
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 bg-white/3 px-6 py-10 text-center">
      <h3 className="mb-2 text-lg font-bold text-white">{title}</h3>
      <p className="mx-auto max-w-md text-sm leading-7 text-(--muted2)">{description}</p>
    </div>
  );
}

export function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-[24px] border border-white/8 bg-white/3 p-4 md:p-5">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-(--o2)">{title}</h3>
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
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-(--muted2)">{label}</span>
      {children}
    </label>
  );
}

export function textInputClass() {
  return 'w-full rounded-2xl border border-white/10 bg-[rgba(6,9,15,0.8)] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-(--o)';
}

export const areaClass = `${textInputClass()} min-h-[120px]`;

export function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-[rgba(6,9,15,0.5)] px-4 py-3">
      <span className="text-sm font-semibold text-white">{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}
