import { useState } from 'react';

type CatalogActionsHeaderProps = {
  title: string;
  subtitle: string;
  onCreateNew: () => void;
  onSave: () => Promise<void>;
  onDelete: () => Promise<void>;
  itemCount: number;
  hasDraft: boolean;
};

export function CatalogActionsHeader({
  title,
  subtitle,
  onCreateNew,
  onSave,
  onDelete,
  itemCount,
  hasDraft,
}: CatalogActionsHeaderProps) {
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    setSaveLoading(true);
    setSaveSuccess(false);
    try {
      await onSave();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await onDelete();
      setDeleteConfirm(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      {/* Header section */}
      <div className="border-b border-gray-200 bg-white px-4 py-4 md:px-6 md:py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <p className="mt-1 truncate text-sm text-gray-500">{subtitle}</p>
            <p className="mt-2 text-xs text-gray-400">
              {itemCount} عنصر{itemCount !== 1 && 'ا'}
            </p>
          </div>

          {/* Action buttons - stack on mobile */}
          <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:gap-2">
            <button
              type="button"
              onClick={onCreateNew}
              className="flex-1 sm:flex-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-0"
              aria-label="إنشاء عنصر جديد"
            >
              ✚ جديد
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saveLoading || !hasDraft}
              className={`flex-1 sm:flex-none rounded-lg px-3 py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                saveSuccess
                  ? 'bg-green-600 text-white'
                  : saveLoading
                    ? 'bg-gray-400 text-white'
                    : hasDraft
                      ? 'bg-gray-900 text-white hover:bg-gray-800'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              aria-busy={saveLoading}
            >
              {saveLoading ? 'جاري الحفظ...' : saveSuccess ? '✓ تم' : 'حفظ'}
            </button>

            {deleteConfirm ? (
              <div className="flex gap-2 flex-1 sm:flex-none">
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(false)}
                  className="flex-1 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  disabled={deleteLoading}
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className={`flex-1 rounded px-2 py-1 text-xs font-medium text-white ${
                    deleteLoading
                      ? 'bg-red-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700'
                  } transition-colors`}
                  aria-busy={deleteLoading}
                >
                  {deleteLoading ? 'جاري...' : 'تأكيد الحذف'}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setDeleteConfirm(true)}
                className="flex-1 sm:flex-none rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-0"
                aria-label="حذف العنصر الحالي"
              >
                🗑 حذف
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
