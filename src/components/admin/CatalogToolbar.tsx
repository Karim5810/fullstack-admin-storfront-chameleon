import { Toolbar, textInputClass } from './AdminShell';

type CatalogToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  visibilityFilter: 'all' | 'visible' | 'hidden';
  onVisibilityFilterChange: (value: 'all' | 'visible' | 'hidden') => void;
  hasAppliedFilters: boolean;
  onClearFilters?: () => void;
};

export function CatalogToolbar({
  search,
  onSearchChange,
  visibilityFilter,
  onVisibilityFilterChange,
  hasAppliedFilters,
  onClearFilters,
}: CatalogToolbarProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 rounded-lg bg-gray-50 p-4 sm:flex-row sm:items-center md:p-5">
      <div className="flex-1">
        <input
          type="search"
          placeholder="ابحث عن عنصر..."
          className={textInputClass() + ' w-full'}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="البحث عن عناصر"
        />
      </div>

      <select
        className={textInputClass() + ' min-w-max'}
        value={visibilityFilter}
        onChange={(e) =>
          onVisibilityFilterChange(e.target.value as 'all' | 'visible' | 'hidden')
        }
        aria-label="تصفية حسب الرؤية"
      >
        <option value="all">جميع العناصر</option>
        <option value="visible">مرئية فقط</option>
        <option value="hidden">مخفية فقط</option>
      </select>

      {hasAppliedFilters && onClearFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="إعادة تعيين التصفية"
        >
          ✕ مسح
        </button>
      )}
    </div>
  );
}
