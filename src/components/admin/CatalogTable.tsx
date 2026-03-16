import { DataTable, TableHead, TableBody, TableRow, Th, Td, StatusPill } from './AdminShell';
import type { Product, Category, Service, BlogPost } from '../../types';

type CatalogItem = Product | Category | Service | BlogPost;

type CatalogTableProps = {
  items: CatalogItem[];
  onEditItem: (item: CatalogItem) => void;
  onToggleVisibility: (e: React.MouseEvent, item: CatalogItem) => void;
  onDeleteItem: (item: CatalogItem) => void;
  getTitle: (item: CatalogItem) => string;
  getSlug: (item: CatalogItem) => string;
  getIsVisible: (item: CatalogItem) => boolean;
  emptyMessage?: string;
  isLoading?: boolean;
};

export function CatalogTable({
  items,
  onEditItem,
  onToggleVisibility,
  onDeleteItem,
  getTitle,
  getSlug,
  getIsVisible,
  emptyMessage = 'لا توجد عناصر. اضغط "إنشاء جديد" للبدء.',
  isLoading = false,
}: CatalogTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <DataTable>
        <TableHead>
          <tr>
            <Th>العنوان</Th>
            <Th>الرابط</Th>
            <Th className="text-center">الحالة</Th>
            <Th className="text-right">الإجراءات</Th>
          </tr>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <tr>
              <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                جاري التحميل...
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            items.map((item) => {
              const isVisible = getIsVisible(item);

              return (
                <TableRow
                  key={item.id}
                  className="group hover:bg-gray-50 transition-colors"
                >
                  <Td className="font-medium text-gray-900">
                    {getTitle(item)}
                  </Td>
                  <Td className="text-gray-500 text-sm">
                    {getSlug(item) || '—'}
                  </Td>
                  <Td className="text-center">
                    <button
                      type="button"
                      onClick={(e) => onToggleVisibility(e, item)}
                      className="inline-flex transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded"
                      aria-label={
                        isVisible
                          ? 'إخفاء العنصر'
                          : 'إظهار العنصر'
                      }
                    >
                      <StatusPill
                        label={isVisible ? 'مرئي' : 'مخفي'}
                        tone={isVisible ? 'success' : 'warning'}
                      />
                    </button>
                  </Td>
                  <Td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEditItem(item)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
                        aria-label={`تعديل ${getTitle(item)}`}
                      >
                        ✏️ تعديل
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteItem(item)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label={`حذف ${getTitle(item)}`}
                      >
                        🗑️
                      </button>
                    </div>
                  </Td>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </DataTable>
    </div>
  );
}
