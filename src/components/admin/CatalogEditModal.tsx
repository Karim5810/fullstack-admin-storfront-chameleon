import { ReactNode, useEffect } from 'react';

type CatalogEditModalProps = {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  onSave: () => Promise<void>;
  isSaving?: boolean;
  children: ReactNode;
};

export function CatalogEditModal({
  isOpen,
  title,
  subtitle,
  onClose,
  onSave,
  isSaving = false,
  children,
}: CatalogEditModalProps) {
  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-end md:items-center md:justify-center overflow-y-auto p-4 md:p-0">
        <div
          className="w-full md:max-w-2xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-labelledby="modal-title"
          aria-modal="true"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-4 flex items-center justify-between">
            <div className="flex-1">
              <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
                {title}
              </h2>
              {subtitle && (
                <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="ml-4 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 rounded"
              aria-label="إغلاق"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">{children}</div>

          {/* Footer */}
          <div className="sticky bottom-0 border-t border-gray-200 bg-gray-50 px-6 py-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                isSaving
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-orange-600 hover:bg-orange-700'
              }`}
              aria-busy={isSaving}
            >
              {isSaving ? 'جاري الحفظ...' : 'حفظ'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
