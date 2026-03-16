type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
};

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col gap-4 items-center justify-between border-t border-gray-200 bg-white px-6 py-4 sm:flex-row">
      <p className="text-sm text-gray-600">
        عرض <span className="font-medium">{startItem}</span> إلى{' '}
        <span className="font-medium">{endItem}</span> من{' '}
        <span className="font-medium">{totalItems}</span> عنصر
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="الصفحة السابقة"
        >
          ← السابق
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            const isCurrentPage = page === currentPage;
            const isNearCurrent = Math.abs(page - currentPage) <= 1;
            const showEllipsis =
              page === 2 && currentPage > 3;
            const showLastEllipsis =
              page === totalPages - 1 && currentPage < totalPages - 2;

            if (page === 1 || page === totalPages || isNearCurrent) {
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => onPageChange(page)}
                  className={`inline-flex items-center justify-center w-9 h-9 text-sm font-medium rounded-lg transition-colors ${
                    isCurrentPage
                      ? 'bg-orange-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  aria-current={isCurrentPage ? 'page' : undefined}
                >
                  {page}
                </button>
              );
            }

            if (showEllipsis || showLastEllipsis) {
              return (
                <span
                  key={`ellipsis-${page}`}
                  className="px-2 text-gray-400"
                >
                  …
                </span>
              );
            }

            return null;
          })}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="الصفحة التالية"
        >
          التالي →
        </button>
      </div>
    </div>
  );
}
