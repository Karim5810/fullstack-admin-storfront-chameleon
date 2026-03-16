import type { ReactNode } from 'react';

type DeleteConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  itemName?: string;
  isLoading?: boolean;
  confirmLabel?: ReactNode;
  cancelLabel?: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
};

export function DeleteConfirmDialog({
  open,
  title,
  message,
  itemName,
  isLoading = false,
  confirmLabel = 'حذف',
  cancelLabel = 'إلغاء',
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-5 shadow-xl">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        <p className="mt-2 text-sm text-gray-600">{message}</p>
        {itemName ? (
          <p className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-800">
            {itemName}
          </p>
        ) : null}

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-red-300 bg-red-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-200"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'جاري الحذف...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
