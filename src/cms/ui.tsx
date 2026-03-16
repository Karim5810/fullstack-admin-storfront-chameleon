// ═══════════════════════════════════════════════════════
//  NexusUI CMS — UI Component Library
//  Provides essential UI components for the CMS
// ═══════════════════════════════════════════════════════

import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// ── Types ──────────────────────────────────────────────
export interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  cell?: (row: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

// ── Button Component ───────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  iconLeft,
  iconRight,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-(--o) text-white hover:bg-(--orange)',
    secondary: 'bg-(--d2) text-white border border-(--border) hover:bg-(--d3)',
    ghost: 'bg-transparent text-(--muted2) hover:text-(--chrome) border border-transparent',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'bg-transparent border border-(--border) text-(--chrome) hover:bg-(--d3)',
  };

  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <span className="mr-2 h-4 w-4 border-2 border-(--border) border-t-(--o) rounded-full animate-spin" />}
      {iconLeft && <span className="mr-2">{iconLeft}</span>}
      {children}
      {iconRight && <span className="ml-2">{iconRight}</span>}
    </button>
  );
}

// ── Badge Component ────────────────────────────────────
interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'ghost' | 'primary';
  children: React.ReactNode;
}

export function Badge({ variant = 'default', children }: BadgeProps) {
  const variants = {
    default: 'bg-(--d3) text-(--chrome)',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    ghost: 'bg-transparent border border-(--border) text-(--muted2)',
    primary: 'bg-(--o) text-white',
  };

  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}

// ── Avatar Component ───────────────────────────────────
interface AvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  src?: string;
  status?: 'online' | 'offline' | 'away';
}

export function Avatar({ name, size = 'md', src, status }: AvatarProps) {
  const sizes = {
    xs: 'h-8 w-8 text-xs',
    sm: 'h-10 w-10 text-sm',
    md: 'h-12 w-12 text-base',
    lg: 'h-16 w-16',
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`relative inline-block ${sizes[size]} rounded-full bg-(--d3) flex items-center justify-center font-bold text-(--chrome)`}>
      {src ? (
        <img src={src} alt={name} className="w-full h-full rounded-full object-cover" />
      ) : (
        initials
      )}
      {status && (
        <span
          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-(--d1) ${
            status === 'online' ? 'bg-green-500' : status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
          }`}
        />
      )}
    </div>
  );
}

// ── Spinner Component ──────────────────────────────────
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

export function Spinner({ size = 'md' }: SpinnerProps) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={`${sizes[size]} border-2 border-(--border) border-t-(--o) rounded-full animate-spin`} />
  );
}

// ── Input Component ────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  hint?: string;
}

export function Input({ label, error, helperText, hint, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-(--chrome) mb-2">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-3 py-2 bg-(--d3) border rounded-lg text-(--chrome) placeholder-text-(--muted2) focus:outline-none focus:border-(--o) transition-colors ${
          error ? 'border-red-500' : 'border-(--border)'
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-(--muted2)">{hint}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-(--muted2)">{helperText}</p>}
    </div>
  );
}

// ── Toggle Component ───────────────────────────────────
interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
}

export function Toggle({ checked, onChange, label, description }: ToggleProps) {
  return (
    <div className="flex items-center gap-3">
      <label className="flex items-center gap-2 cursor-pointer flex-1">
        <div
          className={`relative w-10 h-6 rounded-full transition-colors ${
            checked ? 'bg-(--o)' : 'bg-(--d3)'
          }`}
          onClick={() => onChange(!checked)}
        >
          <div
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
              checked ? 'translate-x-5' : 'translate-x-1'
            }`}
          />
        </div>
        <div className="flex-1">
          {label && <span className="text-sm font-medium text-(--chrome)">{label}</span>}
          {description && <p className="text-xs text-(--muted2) mt-0.5">{description}</p>}
        </div>
      </label>
    </div>
  );
}

// ── DataTable Component ────────────────────────────────
interface DataTableProps<T extends Record<string, any>> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  selectedIds?: Set<string>;
  onSelectAll?: (select: boolean) => void;
  onSelectRow?: (id: string | unknown) => void;
  getRowId?: (row: T, index: number) => string;
  searchable?: boolean;
  pageSize?: number;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  selectedIds = new Set(),
  onSelectAll,
  onSelectRow,
  getRowId = (_, i) => String(i),
  searchable = false,
  pageSize = 10,
}: DataTableProps<T>) {
  const allSelected = data.length > 0 && selectedIds.size === data.length;
  const someSelected = selectedIds.size > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-(--muted2)">
        No data found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-(--border) rounded-lg">
      <table className="w-full">
        <thead>
          <tr className="bg-(--d2) border-b border-(--border)">
            {onSelectAll && (
              <th className="w-12 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="rounded"
                />
              </th>
            )}
            {columns.map((col) => (
              <th key={String(col.key)} className="px-4 py-3 text-left text-sm font-semibold text-(--chrome) text-nowrap" style={{ width: col.width }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => {
            const rowId = getRowId(row, idx);
            const isSelected = selectedIds.has(rowId);

            return (
              <tr key={rowId} className={`border-b border-(--border) hover:bg-(--d2) ${isSelected ? 'bg-(--d3)' : ''}`}>
                {onSelectRow && (
                  <td className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onSelectRow(rowId)}
                      className="rounded"
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-4 py-3 text-sm text-(--chrome)">
                    {col.cell ? col.cell(row) : (row[col.key as keyof T] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Dropdown/Menu Component ────────────────────────────
interface DropdownProps {
  trigger: React.ReactNode;
  items: { label: string; onClick: () => void; variant?: 'default' | 'danger' }[];
}

export function Dropdown({ trigger, items }: DropdownProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <div onClick={() => setOpen(!open)} className="inline-block cursor-pointer">
        {trigger}
      </div>

      {open && (
        <div className="absolute right-0 mt-1 w-48 bg-(--d2) border border-(--border) rounded-lg shadow-lg z-50">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 text-sm transition-colors hover:bg-(--d3) ${
                item.variant === 'danger' ? 'text-red-500 hover:text-red-600' : 'text-(--chrome)'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Pagination Component ───────────────────────────────
interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        <ChevronLeft size={16} />
      </Button>

      <div className="flex gap-1">
        {Array.from({ length: totalPages }).map((_, i) => {
          const p = i + 1;
          const isActive = p === page;
          const isVisible = p === 1 || p === totalPages || Math.abs(p - page) <= 2;

          if (!isVisible && p !== 2 && p !== totalPages - 1) return null;

          if ((p === 2 && page > 4) || (p === totalPages - 1 && page < totalPages - 3)) {
            return <span key={p}>...</span>;
          }

          return (
            <Button
              key={p}
              variant={isActive ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => onPageChange(p)}
            >
              {p}
            </Button>
          );
        })}
      </div>

      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        <ChevronRight size={16} />
      </Button>

      <span className="ml-4 text-sm text-(--muted2)">
        Page {page} of {totalPages}
      </span>
    </div>
  );
}

// ── Modal/Dialog Component ─────────────────────────────
interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
  actions?: { label: string; onClick: () => void; variant?: 'primary' | 'danger' }[];
}

export function Modal({ open, onOpenChange, title, children, actions }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-(--d1) rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          {title && <h2 className="text-lg font-bold text-(--chrome)">{title}</h2>}
          <button onClick={() => onOpenChange(false)} className="text-(--muted2) hover:text-(--chrome)">
            <X size={20} />
          </button>
        </div>

        <div className="text-(--chrome) mb-6">{children}</div>

        {actions && (
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            {actions.map((action, idx) => (
              <Button
                key={idx}
                variant={action.variant || 'primary'}
                onClick={() => {
                  action.onClick();
                  onOpenChange(false);
                }}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Export UI index ────────────────────────────────────
export * from './types';
